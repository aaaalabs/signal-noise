# Inject Missing Tasks - Quick Guide

## ✅ Problem Solved

**Root cause fixed:** Stale data issue resolved by skipping dev keys in production.
**Result:** API now returns fresh data (v12362, 277 tasks)

---

## 🚀 How to Inject Missing Tasks (Oct 25-27)

### Step 1: Activate DevPanel

1. Go to https://signal-noise.app
2. Make sure you're logged in as Premium user
3. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows)
4. You'll see a 🧪 floating button appear in bottom-right corner

### Step 2: Inject Tasks

1. Click the 🧪 button to open DevPanel
2. Click **"💉 Inject Missing Tasks"** button
3. Console logs will show the injection process
4. Success alert → Page reloads automatically
5. Check Analytics - Oct 25-27 should no longer be empty

---

## 📋 Tasks Being Injected

**12 completed Signal tasks:**

**Oct 25:**
- Förderunterlagen finalisiert
- WG-Anzeige ausarbeiten
- VoiceLoop BPMN Breakthrough
- Visitenkarten Design gestartet

**Oct 26:**
- VoiceLoop MVP Validation
- Digital-Lotsen Pipeline CRM
- Visitenkarten entworfen
- Buchhaltungs-Check Innsbruck

**Oct 27:**
- Digital Lotsen System verfeinert
- Visitenkarten bestellt
- KI Stammtisch Launch-Post
- EEG Mockup vorbereitet

---

## 🔍 What Happens Behind the Scenes

```javascript
1. Fetch current data from Redis via /api/tasks
   → Gets fresh data (v12362, 277 tasks) ✅

2. Create 12 new task objects
   → All marked as completed: true
   → Timestamps: Oct 25-27, 2025

3. Merge with existing tasks
   → 277 + 12 = 289 tasks total

4. Upload via /api/sync
   → clientVersion: serverVersion (correct!)
   → No 409 conflict because versions match

5. Success!
   → Page reloads with complete data
   → Analytics shows filled Oct 25-27
```

---

## ⚠️ If Something Goes Wrong

**409 Conflict:**
- Rare, but page will reload automatically
- Just try again after reload

**"No session found":**
- Log out and log back in
- Then retry

**DevPanel not appearing:**
- Hard refresh (Cmd+Shift+R)
- Try Cmd+K again

---

## 🎯 Expected Result

**Before:**
```
Oct 25: Empty (no tasks)
Oct 26: Empty (no tasks)
Oct 27: Empty (no tasks)
Total: 277 tasks
```

**After:**
```
Oct 25: 4 completed signals ✅
Oct 26: 4 completed signals ✅
Oct 27: 4 completed signals ✅
Total: 289 tasks
```

---

## 📝 Notes

- DevPanel only visible to Premium users in production
- Always visible in DEV mode
- Cmd+K is a secret shortcut (not documented in UI)
- Injection is safe - uses correct version tracking
- All injected tasks marked as completed
- Chronologically sorted by timestamp

---

**Ready to inject? Press Cmd+K and click "💉 Inject Missing Tasks"!** 🚀
