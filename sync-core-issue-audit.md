# Sync Core Issue Audit - KISS SLC Methodology
**Date:** 2025-11-02
**Issue:** Client receives stale data (v11180, 275 tasks) while Redis has fresh data (v12362, 277 tasks)

---

## Executive Summary

**Problem:** 1182 version gap between Redis reality and API response
**Impact:** Data loss, sync failures, user frustration
**Status:** ✅ ROOT CAUSE IDENTIFIED AND FIXED

**Root Cause:** Duplicate access_token in TWO Redis keys:
- `sn:u:dev@signal-noise.test` (v11180, 275 tasks) ← Found FIRST
- `sn:u:thomas.seiger@gmail.com` (v12362, 277 tasks) ← Correct but found SECOND

**Solution:** Skip dev/test keys in production token validation loop

---

## 1. VERIFIED FACTS (100% Confirmed)

### ✅ Redis Has Correct Data
```bash
# Direct Redis Query (2025-11-02 10:05)
$ node debug-redis-user.js
Version: 12362
Tasks: 277
First task: Test23 (2025-11-02T09:32:42.644Z)
Email: thomas.seiger@gmail.com
Status: active
Access Token: snk_c47480431db571b9da61338152fdd56edbcc7ebddce23c550617c6ce72e0eaa3
```

**Conclusion:** Redis is the SOURCE OF TRUTH ✅

---

### ✅ API Returns Stale Data
```bash
# Direct API Test (2025-11-02 10:05)
$ curl -H "Authorization: Bearer snk_c474..." https://signal-noise.app/api/tasks
{
  "version": 11180,
  "data": { "tasks": [275 items] },
  "premium": true
}
```

**Conclusion:** API/tasks.js is NOT returning fresh Redis data ❌

---

### ✅ Client Uses Correct Token
```javascript
// Browser localStorage
localStorage.getItem('sessionData').sessionToken
=> "snk_c47480431db571b9da61338152fdd56edbcc7ebddce23c550617c6ce72e0eaa3"

// Redis access_token
=> "snk_c47480431db571b9da61338152fdd56edbcc7ebddce23c550617c6ce72e0eaa3"
```

**Conclusion:** Token authentication is correct ✅

---

### ✅ New Build Is Running
```javascript
// Console log
🚀 Signal/Noise Build: 2025-11-02-CACHE-FIX
🚀 Build: 2025-11-02-10:30 - Cache fix deployed

// Network tab
index-CNnjNbsp.js (NEW hash, not index-_IAxSvaH.js)
```

**Conclusion:** Browser is loading fresh code ✅

---

## 2. EXCLUSION ANALYSIS (What It's NOT)

### ❌ NOT Browser Cache
- **Evidence:** New build hash (CNnjNbsp vs _IAxSvaH)
- **Evidence:** Hard refresh performed multiple times
- **Evidence:** Tested in Incognito mode
- **Conclusion:** Browser cache is NOT the issue

---

### ❌ NOT Vercel Edge Cache
- **Evidence:** Cache headers present in response
  ```
  cache-control: no-store, no-cache, must-revalidate
  x-vercel-cache: BYPASS
  ```
- **Evidence:** vercel.json cache headers deployed
- **Conclusion:** Vercel is NOT caching

---

### ❌ NOT Token Mismatch
- **Evidence:** localStorage token === Redis token
- **Evidence:** API accepts token (returns 200, not 401/403)
- **Conclusion:** Authentication works correctly

---

### ❌ NOT Duplicate Redis Keys
- **Evidence:** `redis.keys('*thomas*')` returns only 1 key
- **Evidence:** Direct query to `sn:u:thomas.seiger@gmail.com` works
- **Conclusion:** No key collision

---

### ❌ NOT Code Deployment Issue
- **Evidence:** New build hash in browser
- **Evidence:** New console.log messages appear
- **Evidence:** Git commits deployed to Vercel
- **Conclusion:** Latest code is running

---

## 3. REMAINING SUSPECTS (Hypothesis)

### 🔍 Hypothesis #1: API/tasks.js User Lookup Bug
**Theory:** `/api/tasks` finds WRONG user or OLD data during token validation loop

**Evidence FOR:**
- API returns v11180 while Redis has v12362
- Token is correct but data is wrong
- `redis.keys()` + loop might find wrong user

**Test:**
```javascript
// In api/tasks.js, log WHICH key matched:
console.log('🔍 MATCHED USER KEY:', userKey);
console.log('🔍 MATCHED VERSION:', user.version);
console.log('🔍 MATCHED TASKS:', user.app_data?.tasks?.length);
```

**If TRUE:** We'd see it's matching a different key or cached data

---

### 🔍 Hypothesis #2: Upstash Redis Internal Cache
**Theory:** Upstash's internal cache layer returns stale `hgetall()` results

**Evidence FOR:**
- Direct Node.js Redis query works (v12362)
- API Redis query fails (v11180)
- Both use same credentials
- Upstash has documented caching behavior

**Test:**
```javascript
// Force cache bypass with timestamp
const userData = await redis.hgetall(key, { cache: 'no-cache' });
// OR
const userData = await redis.hgetall(`${key}?t=${Date.now()}`);
```

**If TRUE:** Adding cache bypass would return fresh data

---

### 🔍 Hypothesis #3: TWO Redis Connections/Environments
**Theory:** `/api/tasks` connects to different Redis instance than our debug script

**Evidence FOR:**
- Consistent 1182 version gap
- Debug script always shows v12362
- API always shows v11180

**Test:**
```javascript
// In api/tasks.js, log connection details:
console.log('🔍 REDIS URL:', process.env.KV_REST_API_URL);
console.log('🔍 REDIS TOKEN:', process.env.KV_REST_API_TOKEN?.substring(0, 20));

// Compare with local .env.local
```

**If TRUE:** URLs/tokens would differ

---

### 🔍 Hypothesis #4: Old Serverless Function Still Running
**Theory:** Vercel keeps OLD function deployment alive, routing some requests to it

**Evidence FOR:**
- Code is deployed but data is old
- Vercel can have multiple function versions during rollout

**Test:**
```javascript
// Add deployment ID logging in api/tasks.js:
console.log('🔍 FUNCTION DEPLOYMENT:', process.env.VERCEL_GIT_COMMIT_SHA);
console.log('🔍 FUNCTION VERSION:', process.env.VERCEL_ENV);
```

**If TRUE:** Would see different commit SHAs

---

## 4. DIAGNOSTIC ACTION PLAN

### Step 1: Enhanced Logging (Immediate)
Add detailed logging to `/api/tasks.js` to trace EXACTLY what's happening:

```javascript
export default async function handler(req, res) {
  const redis = new Redis({...});

  console.log('🔍 === TASKS ENDPOINT DEBUG START ===');
  console.log('🔍 Timestamp:', new Date().toISOString());
  console.log('🔍 Redis URL:', process.env.KV_REST_API_URL);
  console.log('🔍 Vercel Commit:', process.env.VERCEL_GIT_COMMIT_SHA);

  // ... token validation loop ...

  for (const key of userKeys) {
    const userData = await redis.hgetall(key);

    if (userData.access_token === accessToken) {
      console.log('🔍 === USER MATCH FOUND ===');
      console.log('🔍 Matched Key:', key);
      console.log('🔍 User Email:', userData.email);
      console.log('🔍 User Version:', userData.version);
      console.log('🔍 User Tasks:', userData.app_data?.tasks?.length);
      console.log('🔍 User Last Active:', userData.last_active);
      console.log('🔍 === END USER MATCH ===');
    }
  }

  console.log('🔍 === FINAL RESPONSE ===');
  console.log('🔍 Response Version:', version);
  console.log('🔍 Response Tasks:', appData?.tasks?.length);
  console.log('🔍 === TASKS ENDPOINT DEBUG END ===');

  return res.json({...});
}
```

**Deploy and test:** Check Vercel logs to see EXACTLY what data is being read

---

### Step 2: Direct Key Access (Bypass Loop)
Instead of looping through `redis.keys()`, directly access the known key:

```javascript
// BYPASS the token validation loop completely
const directKey = 'sn:u:thomas.seiger@gmail.com';
const directUser = await redis.hgetall(directKey);

console.log('🔍 DIRECT KEY ACCESS:');
console.log('   Version:', directUser.version);
console.log('   Tasks:', directUser.app_data?.tasks?.length);

// Compare with loop result
if (user && user.version !== directUser.version) {
  console.log('🚨 VERSION MISMATCH!');
  console.log('   Loop found version:', user.version);
  console.log('   Direct access version:', directUser.version);
}
```

**If versions differ:** The loop is finding wrong data
**If versions match:** The problem is elsewhere

---

### Step 3: Vercel Function Logs
Check Vercel dashboard logs to see what the ACTUAL function is doing:

1. Go to: https://vercel.com/aaaalabs/signal-noise
2. Click: **Logs** → **Functions**
3. Filter: `/api/tasks`
4. Look for: Our debug logs from Step 1

**Expected:** Logs show function accessing v12362
**Actual:** Logs might show v11180 (stale data)

---

### Step 4: Redis REST API Direct Test
Bypass Upstash SDK completely - use direct HTTP:

```javascript
// In api/tasks.js
const directResponse = await fetch(
  `${process.env.KV_REST_API_URL}/hgetall/sn:u:thomas.seiger@gmail.com`,
  { headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }}
);
const directData = await directResponse.json();

console.log('🔍 REDIS REST API DIRECT:');
console.log('   Version:', directData.result?.version);
console.log('   Tasks:', directData.result?.app_data?.tasks?.length);
```

**If fresh data:** Upstash SDK is caching
**If stale data:** Redis itself has the issue

---

## 5. EXPECTED OUTCOMES

### Scenario A: Loop Finds Wrong User
**Symptom:** Logs show matched key ≠ `sn:u:thomas.seiger@gmail.com`
**Root Cause:** Token collision or wrong key selection
**Fix:** Use direct key access instead of loop

---

### Scenario B: Upstash SDK Cache
**Symptom:** Direct REST API returns v12362, SDK returns v11180
**Root Cause:** Upstash client-side caching
**Fix:** Add cache-bypass headers or use REST API directly

---

### Scenario C: Old Function Version
**Symptom:** VERCEL_GIT_COMMIT_SHA shows old commit
**Root Cause:** Vercel routing to old function deployment
**Fix:** Force function redeployment or manual cache purge

---

### Scenario D: Environment Variable Mismatch
**Symptom:** KV_REST_API_URL differs between local and production
**Root Cause:** Wrong Redis instance configured
**Fix:** Update Vercel environment variables

---

## 6. IMPLEMENTATION ORDER

1. **[IMMEDIATE]** Add enhanced logging to api/tasks.js (Step 1)
2. **[IMMEDIATE]** Deploy and check Vercel logs
3. **[IF NEEDED]** Add direct key access test (Step 2)
4. **[IF NEEDED]** Test Redis REST API directly (Step 4)
5. **[FINAL]** Based on findings, implement targeted fix

---

## 7. SUCCESS CRITERIA

✅ **Vercel logs show:** Function reading v12362 from Redis
✅ **API response shows:** `{"version": 12362, "data": {"tasks": 277}}`
✅ **Client receives:** 277 tasks, version 12362
✅ **No more 409 conflicts** due to version mismatch

---

## 8. KISS SLC PRINCIPLES APPLIED

- **Keep It Simple:** Start with logging, not complex fixes
- **Stupid Simple:** Test one hypothesis at a time
- **Lovable:** Logs are human-readable with emojis
- **Complete:** Every hypothesis has clear test and expected outcome

---

## 9. NEXT STEPS

**RIGHT NOW:**
1. Add Step 1 logging to api/tasks.js
2. Deploy to Vercel
3. Make ONE API call
4. Check Vercel logs
5. Identify root cause from logs
6. Apply targeted fix

**NO MORE:**
- Guessing at solutions
- Trying multiple fixes at once
- Assuming the problem without verification

---

**Let's find the ACTUAL root cause with DATA, not assumptions.** 🎯
