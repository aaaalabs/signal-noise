# Signal/Noise Premium Data Corruption Audit
**Date**: September 14, 2025
**Issue**: Persistent data corruption and failure to load Redis data into frontend

## Executive Summary
Despite multiple fixes, we're experiencing persistent issues where:
1. Redis data is stored as `[object Object]` instead of JSON string
2. Frontend receives empty data despite successful authentication
3. Data corruption is detected but not properly repaired
4. Cloud sync reports success but no actual data is loaded

## Current Symptoms

### Frontend Console Logs
```
✅ Premium data loaded from cloud: {taskCount: 0, premium: true, email: 'Tom'}
✅ CLOUD SYNC SUCCESS - REDIS WRITE CONFIRMED {tasksSynced: 0, dataSizeKB: '0.10KB'}
```
**Issue**: Reports success but taskCount is 0, data size is minimal (0.10KB)

### Server Logs
```
🚨 CORRUPTED APP_DATA DETECTED: {
  dataType: 'object',
  dataPreview: '{"tasks":[],"history":[]...',
  error: '"[object Object]" is not valid JSON'
}
```
**Issue**: Data is stored as JavaScript object, not JSON string

## Root Cause Analysis

### 1. Data Type Mismatch in Redis

**Current State**:
- Redis expects: JSON string
- Redis receives: JavaScript object
- JSON.parse() fails on `[object Object]`

**Evidence**:
```javascript
// api/sync.js line 229
const newAppData = JSON.stringify(data || {});
await redis.hset(userKey, {
  app_data: newAppData,  // This SHOULD be a string
  // ...
});
```

**Hypothesis**: The `redis.hset()` might be converting the string back to an object internally.

### 2. Upstash Redis SDK Behavior

**Possibility A**: Automatic JSON Serialization
- Upstash Redis SDK might auto-serialize objects
- When we pass `JSON.stringify(data)`, it might be double-stringified
- Or it might detect JSON and parse it automatically

**Possibility B**: Type Coercion
- The SDK might be coercing our string to an object
- Especially if it detects valid JSON structure

### 3. Write Path Corruption Points

**Initial Data Creation** (Stripe Webhook):
```javascript
// api/stripe-webhook.js
await redis.hset(userKey, {
  app_data: JSON.stringify(defaultAppData),  // ✅ Correct
});
```

**Sync Endpoint Write**:
```javascript
// api/sync.js line 249
await redis.hset(userKey, {
  app_data: newAppData,  // Where newAppData = JSON.stringify(data)
});
```

**Tasks Endpoint Write**:
```javascript
// api/tasks.js line 160
await redis.hset(userKey, {
  app_data: JSON.stringify(appData),  // ✅ Looks correct
});
```

### 4. Read Path Issues

**Sync GET Handler**:
```javascript
// api/sync.js line 63
parsedData = JSON.parse(user.app_data);  // Fails if app_data is object
```

**Tasks GET Handler**:
```javascript
// api/tasks.js line 106
appData = JSON.parse(user.app_data);  // Fails if app_data is object
```

## Possible Scenarios

### Scenario 1: Double Serialization
1. We stringify: `JSON.stringify(data)` → `"{"tasks":[]...}"`
2. Redis SDK stringifies again: → `"\"{\\"tasks\\":[]...}\""`
3. On read, we get escaped JSON string
4. Parse fails or returns string instead of object

### Scenario 2: Automatic Parsing
1. We stringify: `JSON.stringify(data)` → `"{"tasks":[]...}"`
2. Redis SDK detects JSON and parses: → `{tasks:[]...}` (object)
3. On read, we get object instead of string
4. `JSON.parse(object)` fails with `[object Object]`

### Scenario 3: Mixed Data Types
1. Some fields written as strings (initial creation)
2. Some fields written as objects (updates)
3. Inconsistent data types in same Redis hash

### Scenario 4: Race Condition
1. Multiple simultaneous writes from different endpoints
2. Last write wins, potentially with wrong format
3. Data corruption happens intermittently

## Testing Matrix

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Initial user creation | app_data as string | app_data as object | ❌ FAIL |
| Sync POST write | app_data as string | app_data as object | ❌ FAIL |
| Tasks POST write | app_data as string | app_data as object | ❌ FAIL |
| Manual Redis check | String value | Object value | ❌ FAIL |
| Corruption detection | Auto-repair | Detects but doesn't fix | ⚠️ PARTIAL |

## Proposed Solutions

### Solution 1: Force String Storage (Conservative)
```javascript
// Ensure string storage
const dataString = typeof data === 'string' ? data : JSON.stringify(data);
await redis.hset(userKey, {
  app_data: dataString  // Guaranteed string
});
```

### Solution 2: Handle Both Types on Read (Defensive)
```javascript
// Handle both string and object
let parsedData;
if (typeof user.app_data === 'string') {
  parsedData = JSON.parse(user.app_data);
} else if (typeof user.app_data === 'object' && user.app_data !== null) {
  parsedData = user.app_data;  // Already an object
} else {
  parsedData = { tasks: [], history: [], badges: [], patterns: {}, settings: { targetRatio: 80, notifications: false } };
}
```

### Solution 3: Use Redis SET Instead of HSET (Radical)
```javascript
// Store as separate key with guaranteed string
const appDataKey = `${userKey}:appdata`;
await redis.set(appDataKey, JSON.stringify(data));
```

### Solution 4: Debug Upstash SDK Behavior (Investigative)
```javascript
// Test what Redis actually stores
const testData = { test: 'value' };
await redis.hset('test:key', { data: JSON.stringify(testData) });
const result = await redis.hgetall('test:key');
console.log('Type stored:', typeof result.data);  // string or object?
```

## Critical Questions

1. **Why does corruption happen consistently?**
   - Not random, happens every time
   - Suggests systematic issue, not race condition

2. **Why doesn't auto-repair work?**
   - Code detects corruption and tries to fix
   - But next read still shows corruption
   - Suggests write is succeeding but in wrong format

3. **Why does test3@leodin.com have tasks but they don't load?**
   - Tasks exist in Redis (we restored them)
   - But frontend gets empty array
   - Data loss happens between Redis and frontend

4. **Is Upstash Redis behaving differently than expected?**
   - Documentation suggests it should store strings
   - But we're getting objects
   - SDK version or configuration issue?

## Immediate Action Items

1. **Test Redis behavior directly**
   - Write test endpoint to verify storage format
   - Check if issue is Upstash-specific

2. **Implement dual-type handling**
   - Make code work with both strings and objects
   - Log which type is encountered

3. **Add detailed write logging**
   - Log exact type before write
   - Log exact type after read
   - Identify where conversion happens

4. **Consider alternative storage**
   - Use JSON.stringify twice (escape it)
   - Use base64 encoding
   - Use separate keys instead of hash

## Risk Assessment

**High Risk**: Data loss for premium users
**Impact**: Users lose tasks, undermines trust
**Probability**: 100% - happening consistently
**Mitigation**: Implement Solution 2 (defensive reading) immediately

## Recommendation

Implement **Solution 2** (Handle Both Types) immediately as a hotfix, then investigate with **Solution 4** (Debug SDK) to understand root cause. This ensures system works while we investigate.

## Next Steps

1. Deploy defensive read handling (5 min)
2. Test with test3@leodin.com account (5 min)
3. Create Redis behavior test endpoint (10 min)
4. Document findings and permanent fix (10 min)

Total estimated time: 30 minutes to resolution