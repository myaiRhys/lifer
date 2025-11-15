# 🧪 Lifer Browser Testing Checklist

## 🚀 Pre-Testing Setup

- [ ] Run `npm run dev` to start the development server
- [ ] Open browser to `http://localhost:5173`
- [ ] Open browser DevTools Console (check for errors)
- [ ] Open Application tab > IndexedDB to verify data storage

---

## 📱 Core Functionality Tests

### ✅ **First Load / Initialization**
- [ ] App loads without errors
- [ ] IndexedDB initialized with all collections
- [ ] Core practices seeded (9 default practices)
- [ ] User state created with level 1, 0 XP
- [ ] Default theme applied

### ✅ **Tasks Management**
- [ ] Create a new task
- [ ] Set leverage score (1-10)
- [ ] Toggle "Morning Task" checkbox
- [ ] Complete a task → Check XP awarded
- [ ] Verify task appears in history
- [ ] Delete a task

### ✅ **Practices Management**
- [ ] Log a practice (positive type)
- [ ] Log a negative practice (stay under target)
- [ ] Verify streak increments on consecutive days
- [ ] Check habit strength increases (+2 per completion)
- [ ] Verify practice appears in Today's Practices

---

## 🆕 **New Feature Integration Tests**

### 1️⃣ **Identity-Based Habits** (P0-1)

**Setup:**
- [ ] Navigate to Identity section
- [ ] Create identity statement: "I am a person who [achieves goals]"

**Test Vote Creation:**
- [ ] Complete a task → Check Identity Votes increment
- [ ] Complete a practice → Check Identity Votes increment
- [ ] Complete a high-leverage task (≥7) → Check context added to vote
- [ ] Log a negative practice above target → Check "against" vote created

**Test Evidence:**
- [ ] Navigate to Identity Evidence
- [ ] Manually add evidence
- [ ] Complete a practice with a streak → Check auto-evidence added at milestones
- [ ] Verify evidence shows in list with category badges

**Test Alignment:**
- [ ] Check Today's Alignment percentage
- [ ] Verify votes "for" increase percentage
- [ ] Check Weekly Alignment chart

---

### 2️⃣ **Four Laws Task Optimizer** (P0-2)

**Setup:**
- [ ] Create a new task
- [ ] Click "Optimize with Four Laws" button

**Test Optimizer:**
- [ ] Fill in "Obvious" law: cue, time, location → Check score updates
- [ ] Fill in "Attractive" law: bundle with something you enjoy
- [ ] Fill in "Easy" law: gateway version, friction steps
- [ ] Fill in "Satisfying" law: reward
- [ ] Verify Total Score calculates correctly (out of 40)
- [ ] Check color coding: green (≥32), yellow (≥24), red (<24)
- [ ] Save task → Verify Four Laws data persists
- [ ] Edit task → Verify Four Laws data loads

**Test Suggestions:**
- [ ] Check suggestions appear based on low scores
- [ ] Verify suggestions are contextual to each law

---

### 3️⃣ **Never Miss Twice System** (P0-3)

**Setup:**
- [ ] Create a daily practice
- [ ] Complete it for 2-3 days (build streak)

**Test Miss Detection:**
- [ ] Skip logging the practice for 1 day
- [ ] Check Dashboard → Verify "⚠️ AT RISK" alert appears (yellow)
- [ ] Navigate to Never Miss Twice section
- [ ] Verify practice shows in "At Risk" list with 1 miss

**Test Recovery:**
- [ ] View recovery suggestions for at-risk practice
- [ ] Verify suggestions use Four Laws data if available
- [ ] Complete the practice → Check "atRisk" flag clears
- [ ] Check recovery event logged

**Test Critical Status:**
- [ ] Skip practice for 2 consecutive days
- [ ] Check Dashboard → Verify "🚨 CRITICAL" alert (red)
- [ ] Verify different, more urgent suggestions appear
- [ ] Complete practice → Check recovery count increments

---

### 4️⃣ **Morning Sovereignty Ritual** (P0-4)

**Setup:**
- [ ] Navigate to Morning Sovereignty section
- [ ] Review default 5-step ritual

**Test Session Start:**
- [ ] Click "I'm Awake" or "Start Morning Session"
- [ ] Verify 90-minute window starts
- [ ] Check timer shows time remaining

**Test Task Integration:**
- [ ] Create a task and mark as "Morning Task"
- [ ] Complete the morning task **within** the 90-minute window
- [ ] Verify session updates: tasksCompleted count increases
- [ ] Check leverage score accumulates
- [ ] Verify window utilization percentage updates

**Test Ritual Steps:**
- [ ] Toggle ritual step completion
- [ ] Add a custom ritual step
- [ ] Remove a step
- [ ] Complete all steps → Check ritualCompleted flag

**Test Window Expiry:**
- [ ] Wait for 90-minute window to expire (or manually adjust time in DevTools)
- [ ] Verify session archives to history
- [ ] Check Morning Stats update

**Test Dashboard Alert:**
- [ ] Start morning session
- [ ] Check Dashboard shows morning window alert (amber banner)
- [ ] Verify progress display shows X/Y tasks completed

---

### 5️⃣ **Habit Stacking Builder** (P1-6)

**Setup:**
- [ ] Navigate to Habit Stacking section
- [ ] Ensure you have 2+ practices created

**Test Stack Creation:**
- [ ] Click "Create Stack"
- [ ] Name the stack: "Morning Routine"
- [ ] Add 2-3 practices to the chain
- [ ] Set transition times between habits
- [ ] Reorder practices using up/down arrows
- [ ] Save stack

**Test Auto-Detection:**
- [ ] Complete the first practice in the stack
- [ ] Navigate to Habit Stacking → Check progress updates (1/3 completed)
- [ ] Complete second practice → Check progress (2/3)
- [ ] Verify visual chain shows green checkmarks for completed habits

**Test Explicit Completion:**
- [ ] Complete all practices in the stack
- [ ] Click "🎉 Complete Stack & Celebrate" button
- [ ] Verify celebration alert appears
- [ ] Check completion logged to analytics
- [ ] Verify streak updates

**Test Partial Completion:**
- [ ] Complete only 1 practice in a stack
- [ ] Click "📊 Log Progress (33%)" button
- [ ] Verify partial completion logged

**Test Analytics:**
- [ ] Check current streak display
- [ ] Verify completion rate percentage
- [ ] Check total completions counter

**Test Suggested Stacks:**
- [ ] If no stacks exist, check for suggestions
- [ ] Click "Use This Stack" → Verify pre-fills form
- [ ] Create stack from suggestion

---

### 6️⃣ **2-Minute Rule Gateway** (P1-5)

**Setup:**
- [ ] Navigate to Practices
- [ ] Create or edit a practice

**Test Gateway Creation:**
- [ ] Click "Add 2-Minute Gateway"
- [ ] Set gateway version: "2 minutes" instead of "30 minutes"
- [ ] Save practice

**Test Gateway Completion:**
- [ ] Click "Log Practice"
- [ ] Select "Gateway" completion type
- [ ] Verify streak continues
- [ ] Check gatewayCount increments
- [ ] Verify lastCompletionType = 'gateway'

**Test Full Completion:**
- [ ] Log practice as "Full" completion
- [ ] Check fullCount increments

**Test Analytics:**
- [ ] Navigate to Gateway Analytics or practice details
- [ ] Verify gateway percentage calculated
- [ ] Check "streaks saved by gateway" estimate

---

### 7️⃣ **Authenticity Tracker** (P1-7)

**Setup:**
- [ ] Navigate to Authenticity Tracker

**Test Daily Log:**
- [ ] Rate today's authenticity (1-10)
- [ ] Log boundaries honored count
- [ ] Add body signals (e.g., "tension in neck")
- [ ] Add reflection notes
- [ ] Save log

**Test Flow State:**
- [ ] Create a task or practice
- [ ] Set Flow State to "Flowing" (green) or "Forced" (red)
- [ ] Verify icon/color displays correctly

**Test Low Authenticity Alert:**
- [ ] Log several days with low scores (<5)
- [ ] Check Dashboard for authenticity alert
- [ ] Verify suggestions to realign

---

### 8️⃣ **Marginal Gains Visualizer** (P1-8)

**Setup:**
- [ ] Navigate to Marginal Gains

**Test Logging:**
- [ ] Click "Log Improvement"
- [ ] Select category (skill, health, productivity, etc.)
- [ ] Describe improvement: "Improved typing speed by 2%"
- [ ] Set improvement percentage (1-5%)
- [ ] Save

**Test Visualization:**
- [ ] Check compound multiplier calculation (1.01^days)
- [ ] Verify chart shows growth over time
- [ ] Check category breakdown
- [ ] Verify streak tracking (consecutive days with improvements)

**Test Stats:**
- [ ] View total days with improvements
- [ ] Check average daily improvement percentage
- [ ] Verify longest streak display

---

### 9️⃣ **Maker/Manager Mode Toggle** (P2-9)

**Setup:**
- [ ] Navigate to Maker/Manager section

**Test Mode Switching:**
- [ ] Click "Start Maker Mode"
- [ ] Verify mode indicator shows "Maker Mode Active"
- [ ] Check notification blocking (if implemented)
- [ ] Switch to Manager Mode → Verify indicator updates

**Test Session Tracking:**
- [ ] End maker mode session
- [ ] Rate productivity (1-10)
- [ ] Add notes about session
- [ ] Log interruptions count
- [ ] Save session

**Test Analytics:**
- [ ] View total maker minutes vs manager minutes
- [ ] Check average productivity ratings
- [ ] Verify deep work streak tracking
- [ ] Check longest maker block duration

---

### 🔟 **Seasons System** (P2-10)

**Setup:**
- [ ] Navigate to Seasons section

**Test Season Creation:**
- [ ] Start a new season: "Spring" (or current season)
- [ ] Set theme: "Growth & Learning"
- [ ] Select primary outcomes for the season
- [ ] Set energy pattern and mindset
- [ ] Save season

**Test Season Display:**
- [ ] Check current season badge on Dashboard
- [ ] Verify season emoji displays correctly
- [ ] Check days in current season counter

**Test Season Transition:**
- [ ] End current season
- [ ] Add reflection notes
- [ ] Start new season → Verify seasonal history logs

**Test Analytics:**
- [ ] View season history
- [ ] Check most productive season
- [ ] Verify average season duration
- [ ] Check outcomes completed per season

---

### 1️⃣1️⃣ **Cookie Jar** (P2-11)

**Setup:**
- [ ] Navigate to Cookie Jar section

**Test Victory Creation:**
- [ ] Click "Add Victory"
- [ ] Title: "Completed first marathon"
- [ ] Story: Detailed emotional context
- [ ] Select emotion (proud, unstoppable, etc.)
- [ ] Set difficulty (1-10)
- [ ] Select category
- [ ] Save victory

**Test Auto-Victory Creation:**
- [ ] Unlock an achievement → Check if it appears in Cookie Jar
- [ ] Complete a high-leverage task → Check for auto-entry

**Test Retrieval:**
- [ ] Click "Retrieve Victory" or view a victory
- [ ] Verify timesRetrieved increments
- [ ] Check lastRetrievedAt updates

**Test Stats:**
- [ ] View total victories count
- [ ] Check most retrieved victory
- [ ] Verify victory breakdown by category
- [ ] Check current strength score (1-100)

---

## 🎮 **PWA Features** (P3-14)

### Install Prompt
- [ ] Wait for install prompt or check if it appears
- [ ] Click "Install Lifer"
- [ ] Verify app installs to home screen/apps menu
- [ ] Open installed PWA → Check it runs standalone

### Offline Support
- [ ] Open app while online
- [ ] Turn off network (DevTools → Network → Offline)
- [ ] Refresh app → Verify it loads from cache
- [ ] Try to complete a task → Check offline functionality
- [ ] Turn network back on → Verify data syncs (if implemented)

### Service Worker
- [ ] Check Application tab → Service Workers
- [ ] Verify SW registered and active
- [ ] Check Cache Storage for precached assets

---

## 🔗 **Cross-Feature Integration Tests**

### Identity + Task Completion
- [ ] Set identity: "I am a person who completes high-leverage tasks"
- [ ] Complete a task with leverage ≥7
- [ ] Check identity vote created with correct context
- [ ] Verify alignment percentage updates

### Four Laws + Never Miss Twice
- [ ] Create practice with Four Laws (especially Gateway)
- [ ] Miss practice once → Check recovery suggestions mention gateway
- [ ] Use gateway to maintain streak
- [ ] Verify gatewayCount increases

### Morning Ritual + Identity + Practices
- [ ] Start morning session
- [ ] Complete morning tasks
- [ ] Check identity votes created
- [ ] Verify morning stats accumulate

### Habit Stacking + Recovery
- [ ] Create habit stack with 3 practices
- [ ] Complete stack for several days (build streak)
- [ ] Miss entire stack → Check if practices show at-risk
- [ ] Complete partial stack → Check recovery tracking

---

## 🐛 **Bug & Edge Case Testing**

### Data Persistence
- [ ] Complete various actions (tasks, practices, identity votes)
- [ ] Refresh browser → Verify all data persists
- [ ] Check IndexedDB in DevTools → Verify collections populated

### Midnight Reset
- [ ] Manually change system time to 11:59 PM
- [ ] Wait for midnight (or trigger reset manually if possible)
- [ ] Check daily stats reset (todayCompleted, todayValue)
- [ ] Verify streaks calculate correctly

### Empty States
- [ ] Clear IndexedDB completely
- [ ] Refresh app → Check initialization works
- [ ] Verify default practices load
- [ ] Check empty state messaging in all sections

### Large Data Sets
- [ ] Create 50+ tasks
- [ ] Log 30+ practices
- [ ] Build 100+ day streak
- [ ] Check performance (scrolling, filtering, loading times)

### Browser Compatibility
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile browsers (iOS Safari, Chrome Android)

---

## 📊 **Performance Tests**

- [ ] Check Lighthouse score (Performance, Accessibility, Best Practices, SEO)
- [ ] Verify First Contentful Paint < 2s
- [ ] Check Time to Interactive < 3s
- [ ] Verify bundle size < 1MB (currently 635 KB)
- [ ] Test offline performance

---

## ♿ **Accessibility Tests**

- [ ] Navigate entire app using only keyboard (Tab, Enter, Escape)
- [ ] Test screen reader compatibility (NVDA, JAWS, VoiceOver)
- [ ] Check color contrast ratios (WCAG AA minimum)
- [ ] Verify all interactive elements have focus states
- [ ] Test with browser zoom at 200%
- [ ] Check all images have alt text
- [ ] Verify forms have proper labels

---

## ✅ **Final Checks**

- [ ] No console errors during normal use
- [ ] All features accessible from navigation
- [ ] Data exports/imports working (if implemented)
- [ ] Settings persist across sessions
- [ ] Theme changes work correctly
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] No TypeScript compilation errors
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Production build works (`npm run preview`)

---

## 🚨 **Known Issues to Watch For**

1. **Circular Import Warnings**: Non-blocking but monitor for runtime issues
2. **Large Bundle Size**: Watch for performance impact (635 KB main bundle)
3. **A11y Warnings**: Some remaining in App.svelte, Dashboard.svelte, Practices.svelte
4. **Midnight Reset**: May require manual testing or time manipulation

---

## 📝 **Testing Notes Template**

Use this template to document issues found:

```markdown
### Issue: [Brief Description]
- **Severity**: Critical / High / Medium / Low
- **Component**: [Component name]
- **Steps to Reproduce**:
  1.
  2.
  3.
- **Expected Behavior**:
- **Actual Behavior**:
- **Screenshots/Errors**:
- **Browser/Device**:
```

---

## 🎯 **Testing Success Criteria**

The app is ready for beta release when:
- ✅ All P0 features work end-to-end
- ✅ All P1 features work end-to-end
- ✅ All P2 features work end-to-end
- ✅ No critical bugs found
- ✅ Data persists correctly across sessions
- ✅ PWA installs and works offline
- ✅ Build succeeds without errors
- ✅ Core user flows complete without errors

---

**Happy Testing! 🧪🚀**
