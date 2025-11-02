# Lessons Learned: Sync Core Issue Fix (Nov 2, 2025)

## Problem Summary

**Symptom:** Client received stale data (v11180, 275 tasks) while Redis had fresh data (v12362, 277 tasks)
**Impact:** Data loss, sync failures, 409 version conflicts
**Delta:** 1182 versions behind, 2 tasks missing

---

## Root Cause Discovery Process

### ❌ What It Was NOT (Exclusion Analysis)

Through systematic debugging, we ruled out:

1. **Browser Cache** ❌
   - Evidence: New build hash (index-CNnjNbsp.js)
   - Hard refresh performed multiple times
   - Tested in Incognito mode

2. **Vercel Edge Cache** ❌
   - Evidence: `x-vercel-cache: BYPASS` in headers
   - `cache-control: no-store, no-cache, must-revalidate` present

3. **Token Mismatch** ❌
   - localStorage token === Redis token
   - API accepted token (200 response, not 401/403)

4. **Duplicate Redis Keys** ❌
   - `redis.keys('*thomas*')` returned only 1 production key

5. **Code Deployment Issue** ❌
   - New build hash in browser
   - New console.log messages appeared
   - Git commits deployed to Vercel

---

## ✅ Actual Root Cause

**TWO Redis keys had the SAME access_token:**

```
sn:u:dev@signal-noise.test      → v11180, 275 tasks (STALE) ← Found FIRST
sn:u:thomas.seiger@gmail.com    → v12362, 277 tasks (FRESH) ← Correct
```

**Why it happened:**
- Dev/test key was created with production access token for testing
- Token validation loop in `api/tasks.js` used `redis.keys('sn:u:*')`
- Loop found dev key FIRST (alphabetically: "dev@" < "thomas")
- Returned stale dev data instead of fresh production data

---

## Solution Applied

**Skip dev/test keys in production:**

```javascript
// In api/tasks.js and api/sync.js
for (const key of userKeys) {
  if (key.includes(':sessions')) continue;
  if (key.includes('dev@') || key.includes('.test')) continue; // ← NEW FIX
  
  const userData = await redis.hgetall(key);
  if (userData.access_token === accessToken) {
    // Process user...
  }
}
```

**Result:**
- Before: API returns v11180, 275 tasks
- After: API returns v12362, 277 tasks ✅

---

## Key Learnings

### 1. **Systematic Debugging > Guessing**

Created `sync-core-issue-audit.md` with:
- Verified facts (100% confirmed)
- Exclusion analysis (what it's NOT)
- Hypothesis testing (what it MIGHT be)
- Diagnostic action plan (how to verify)

**Lesson:** Document your exclusion process. Knowing what it's NOT is as valuable as knowing what it IS.

---

### 2. **Direct Testing Reveals Truth**

**What revealed the root cause:**

```javascript
// Created /api/debug-env endpoint
const directData = await redis.hgetall('sn:u:thomas.seiger@gmail.com');
// Returns: v12362 ✅

const loopData = // ... token validation loop
// Returns: v11180 ❌

// Delta revealed the problem!
```

**Lesson:** When API behavior differs from direct queries, test the same operation in isolation.

---

### 3. **Token Collision Can Be Silent**

We had two keys with identical access tokens but different data:
- Production token accidentally copied to dev key
- No error messages (both keys valid)
- Loop just picked wrong one

**Prevention:**
- Use different token formats for dev (`dev-token-*`) vs production (`snk_*`)
- Or skip dev keys in production entirely (current fix)

---

### 4. **Alphabetical Ordering Matters**

```javascript
const userKeys = await redis.keys('sn:u:*');
// Returns: ['sn:u:dev@signal-noise.test', 'sn:u:thomas.seiger@gmail.com']
// Alphabetically: dev@ comes FIRST

for (const key of userKeys) {
  if (match) break; // ← Exits on FIRST match (dev key)
}
```

**Lesson:** When iterating unordered collections, be aware of implicit ordering.

---

### 5. **Version-Based Conflict Detection Works**

The version tracking system correctly detected conflicts:
- Client tried to sync with old version (11180)
- Server rejected with 409 (has v12362)
- Prevented data corruption

**Lesson:** Version numbers saved us from silent data loss. The 409 was a FEATURE, not a bug.

---

### 6. **Test Infrastructure Can Pollute Production**

Dev/test keys sharing production tokens created the issue.

**Better approach:**
- Separate dev tokens (`dev-session-token-*`)
- Separate Redis namespaces (`sn:dev:*` vs `sn:u:*`)
- Filter dev keys in production code

**Lesson:** Test data should be obviously distinguishable from production data.

---

### 7. **DevPanel Cleanup = SLC**

Removed dangerous/obsolete features:
- ❌ Reset to Clean (destructive)
- ❌ AI Coach Debug (not needed)
- ❌ Hardcoded Oct 25-27 inject (completed)

Kept focused, safe features:
- ✅ Morning Review (test modal)
- ✅ Custom JSON Inject (flexible)
- ✅ Export State (backup)
- ✅ Disable Panel (security)

**Lesson:** SLC means removing features that don't serve the user. Less is more.

---

## Diagnostic Tools Created

### 1. `/api/debug-env.js`
Tests three access patterns:
- Direct key access via SDK
- Loop access (like production)
- Direct REST API

Revealed: Direct access worked, loop access failed.

### 2. `find-token-duplicates.js`
Searches ALL keys for matching access tokens.

**Output:**
```
Found 2 keys with same access_token:
- sn:u:dev@signal-noise.test (v11180)
- sn:u:thomas.seiger@gmail.com (v12362)
```

This revealed the root cause!

### 3. `test-redis-rest-direct.js`
Bypasses SDK entirely, uses HTTP REST API.

Proved: Redis had fresh data, SDK worked correctly, problem was in key selection logic.

---

## Files Changed

**Production Fixes:**
- `api/tasks.js` - Added dev key filter
- `api/sync.js` - Added dev key filter

**DevPanel Cleanup:**
- `src/components/DevPanel.tsx` - Removed 3 features, kept 4 SLC ones
- `src/App.tsx` - Added DevPanel to render tree

**Documentation:**
- `sync-core-issue-audit.md` - Systematic debugging log
- `INJECT-MISSING-TASKS.md` - Recovery guide
- `MORNING-REVIEW-INFO.md` - Modal documentation
- `DEVPANEL-SLC-FINAL.md` - Final DevPanel reference

**Debug Scripts:**
- `find-token-duplicates.js` - Found the smoking gun
- `check-oct25-27-tasks.js` - Verified injection success
- `test-redis-rest-direct.js` - Isolated SDK from REST API

---

## Timeline

1. **10:00** - User reports stale data issue
2. **10:05** - Verified Redis has fresh data, API returns stale
3. **10:10** - Ruled out browser cache, Vercel cache
4. **10:15** - Created `/api/debug-env` - proved Vercel can read fresh data
5. **10:20** - Created `find-token-duplicates.js` - **FOUND ROOT CAUSE**
6. **10:25** - Applied fix (skip dev keys)
7. **10:30** - Verified: API now returns v12362 ✅
8. **10:35** - Injected missing Oct 25-27 tasks (12 tasks)
9. **10:40** - Added Custom JSON Inject to DevPanel
10. **10:50** - Cleaned up DevPanel (SLC principles)

**Total time:** ~50 minutes from problem to solution

---

## Success Metrics

**Before:**
- API: v11180, 275 tasks
- Client: 409 conflicts, data loss
- Missing: Oct 25-27 (0 tasks)

**After:**
- API: v12363, 289 tasks ✅
- Client: No conflicts, fresh data ✅
- Recovered: Oct 25-27 (22 tasks total) ✅

**Key validation:**
```bash
$ curl /api/tasks | jq '.version, (.data.tasks | length)'
12363
289
```

---

## Prevention Checklist

For future similar issues:

- [ ] Check for duplicate access tokens across all keys
- [ ] Verify token validation loop order/filtering
- [ ] Test with direct key access vs loop access
- [ ] Create isolation tests (like /api/debug-env)
- [ ] Use systematic exclusion analysis
- [ ] Document what it's NOT, not just what it IS
- [ ] Keep dev/test infrastructure separate from production

---

## Key Takeaways

1. **Systematic debugging wins** - Document exclusions, test hypotheses
2. **Direct testing reveals truth** - Isolate operations to find deltas
3. **Alphabetical order matters** - Be aware of implicit ordering
4. **Version tracking works** - 409 conflicts prevented data corruption
5. **Test data isolation** - Dev keys should be obviously different
6. **SLC applies to tools** - DevPanel cleanup improved UX
7. **Documentation is debugging** - Writing forces clarity

---

**Problem solved. Data recovered. System hardened. Lessons learned.** 🎯
