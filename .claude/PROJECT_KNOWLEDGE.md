# Lifer - Project Knowledge & Architecture Documentation

## Executive Summary

**Lifer** is a comprehensive personal life management and productivity application that gamifies daily task completion, habit tracking, and goal achievement using RPG-like progression mechanics. Built as a Progressive Web App (PWA) with Svelte, it runs entirely client-side with IndexedDB for offline-first data persistence.

**Core Philosophy**: Focus on high-leverage activities (impact/effort ratio) rather than busywork, while building sustainable habits and understanding personal energy patterns.

**Project Stats**:
- **51 source files** (~10,262 lines of code)
- **23 Svelte components**
- **19 database modules**
- **15+ TypeScript data models**
- **25+ achievements** with 4 rarity tiers
- **11 visual themes**
- **100% offline capable** (no backend required)

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Data Models](#data-models)
5. [Core Features](#core-features)
6. [Code Patterns & Conventions](#code-patterns--conventions)
7. [Database Layer](#database-layer)
8. [User Journey](#user-journey)
9. [Key Algorithms](#key-algorithms)
10. [Deployment & Configuration](#deployment--configuration)

---

## Technology Stack

### Frontend Framework
- **Svelte 4.2** - Reactive component framework with compiler-based reactivity
- **TypeScript 5.3** - Strict type checking for reliability
- **Vite 5.0** - Build tool and dev server with HMR

### Styling
- **TailwindCSS 3.4** - Utility-first CSS framework
- **PostCSS + Autoprefixer** - CSS processing pipeline
- **Custom theme system** - 11 pre-built color schemes

### Data Persistence
- **idb-keyval 6.2** - Lightweight IndexedDB wrapper
- **IndexedDB** - Browser-native database (no backend needed)
- **21 storage keys** for different data collections

### Additional Libraries
- **Chart.js 4.4** - Data visualization for analytics
- **canvas-confetti 1.9** - Celebration animations
- **vite-plugin-pwa 0.19** - Progressive Web App capabilities

### Build Tools
- **Terser** - JavaScript minification
- **Code splitting** - Optimized bundle loading
- **Workbox** - Service worker for offline support

---

## Project Structure

```
/home/user/Lifer/
├── src/
│   ├── main.ts                      # Application bootstrap
│   ├── app.css                      # Global styles
│   ├── App.svelte                   # Root component with routing
│   │
│   ├── components/                  # 23 UI components (~6,269 lines)
│   │   ├── Dashboard.svelte         # Main overview (385 lines)
│   │   ├── TaskList.svelte          # Task management (450 lines)
│   │   ├── TaskPrioritizer.svelte   # AI task recommendations (262 lines)
│   │   ├── Practices.svelte         # Habit tracking (295 lines)
│   │   ├── Outcomes.svelte          # Goal management v1 (424 lines)
│   │   ├── OutcomeTreeView.svelte   # Hierarchical goals v2 (436 lines)
│   │   ├── Chores.svelte            # Household tasks (409 lines)
│   │   ├── FocusTimer.svelte        # Pomodoro timer (270 lines)
│   │   ├── UltradianTimer.svelte    # 90-min work cycles (371 lines)
│   │   ├── EnergyLogger.svelte      # Energy tracking (140 lines)
│   │   ├── BPTAnalysis.svelte       # Peak performance analysis (234 lines)
│   │   ├── CouplesMode.svelte       # Partnership features (617 lines)
│   │   ├── BodyDoublingView.svelte  # Collaborative work (276 lines)
│   │   ├── PersonalAnalytics.svelte # Data visualization (368 lines)
│   │   ├── HeatMap.svelte           # Activity calendar (231 lines)
│   │   ├── PowerUpShop.svelte       # Virtual rewards (203 lines)
│   │   ├── Achievements.svelte      # Badge display (116 lines)
│   │   ├── WeeklyReview.svelte      # Reflection prompts (192 lines)
│   │   ├── Onboarding.svelte        # First-time setup (173 lines)
│   │   └── [4 more components]      # Notifications, challenges, modals
│   │
│   └── lib/
│       ├── db/                      # Data persistence layer (19 modules)
│       │   ├── index.ts             # Public API exports
│       │   ├── init.ts              # Database initialization & migrations
│       │   ├── keys.ts              # Storage key constants
│       │   ├── userState.ts         # User progression system
│       │   ├── tasks.ts             # Task CRUD operations
│       │   ├── practices.ts         # Habit tracking logic
│       │   ├── outcomes.ts          # Goal management
│       │   ├── chores.ts            # Chore management
│       │   ├── focus.ts             # Focus session tracking
│       │   ├── history.ts           # Activity audit log
│       │   ├── energy.ts            # Energy logging & BPT
│       │   ├── couples.ts           # Relationship features
│       │   ├── bodyDoubling.ts      # Collaborative sessions
│       │   ├── outcomeTree.ts       # Hierarchical goals
│       │   ├── powerups.ts          # Virtual shop items
│       │   ├── achievements.ts      # Achievement tracking
│       │   ├── settings.ts          # User preferences
│       │   ├── backup.ts            # Export/import JSON
│       │   └── recurringTasks.ts    # Legacy recurring tasks
│       │
│       ├── types/index.ts           # TypeScript interfaces (~298 lines)
│       ├── achievements.ts          # Achievement definitions (~300+ lines)
│       ├── challenges.ts            # Challenge definitions (~150 lines)
│       ├── themes.ts                # Theme color palettes (~250 lines)
│       ├── notifications.ts         # Push notification system (~120 lines)
│       ├── sounds.ts                # Audio feedback (~80 lines)
│       └── animations.ts            # Celebration effects (~70 lines)
│
├── public/
│   └── icons/                       # PWA app icons (SVG)
│
├── index.html                       # HTML entry point
├── package.json                     # Dependencies
├── vite.config.ts                   # Build & PWA config (77 lines)
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS config
└── postcss.config.js                # PostCSS configuration
```

---

## Architecture & Design Patterns

### 1. Client-Side Routing

**Pattern**: State-based view switching in `App.svelte`

```typescript
let currentView = 'dashboard' // 'dashboard' | 'tasks' | 'focus' | 'energy' | ...

{#if currentView === 'dashboard'}
  <Dashboard />
{:else if currentView === 'tasks'}
  <TaskList />
{:else if currentView === 'energy'}
  <div class="space-y-6">
    <EnergyLogger />
    <BPTAnalysis />
  </div>
{/if}
```

**15 main views**:
- Dashboard, Tasks, AI Prioritizer
- Pomodoro Timer, Ultradian Timer
- Energy & BPT Analysis
- Outcome Trees, Practices, Chores
- Pair Lifers (Couples), Body Doubling
- Analytics, Activity Map, Power-Ups
- Outcomes v1 (legacy)

### 2. State Management

**No global state library** (Redux/Pinia/Zustand) - uses:

1. **Component-local reactive state** (Svelte's built-in reactivity)
2. **IndexedDB as single source of truth**
3. **Reactive declarations** with `$:` for computed values

**Standard component pattern**:

```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { getTasks, completeTask } from '../lib/db'
  import type { Task } from '../lib/types'

  let tasks: Task[] = []

  // Load on mount
  onMount(async () => {
    tasks = await getTasks()
  })

  // Reactive computed value
  $: incompleteTasks = tasks.filter(t => !t.completed)

  // Action handler
  async function handleComplete(taskId: string) {
    await completeTask(taskId)
    tasks = await getTasks() // Refresh local state
  }
</script>
```

**Key pattern**: Always refresh local state after mutations

### 3. Data Persistence Architecture

```
Component Layer (UI)
        ↓
DB Function Layer (business logic)
        ↓
idb-keyval (abstraction)
        ↓
IndexedDB (browser storage)
```

**Example flow** for completing a task:

```
User clicks "Complete" button
  → TaskList.svelte calls completeTask(taskId)
    → src/lib/db/tasks.ts:completeTask()
      → Calculate XP (leverageScore × 10)
      → Check morning multiplier (6-9 AM → 2x)
      → Update task object (completed: true)
      → Save to IndexedDB via set(KEYS.TASKS, updatedTasks)
      → Call addXP() in userState.ts
        → Update user XP, check level-up
        → Update streaks if first task today
        → Check achievement conditions
        → Save to IndexedDB
      → Create history record
    → Component refreshes: tasks = await getTasks()
  → UI updates with new data
  → Celebration animation + sound
```

### 4. Progressive Web App (PWA) Pattern

**Service Worker** (via vite-plugin-pwa):
- Caches all static assets
- Enables offline operation
- Installable as native app
- Background sync capability

**Manifest configuration** in `vite.config.ts`:
- App name: "Lifer"
- Icons: 192x192, 512x512 SVG
- Start URL: `/Lifer/`
- Display: `standalone`
- Theme color: `#0f172a` (slate-900)

### 5. Theme System Architecture

**11 themes** defined in `src/lib/themes.ts`:

```typescript
export const THEMES = {
  dark: { primary: '#0f172a', secondary: '#1e293b', ... },
  ocean: { primary: '#0c4a6e', secondary: '#075985', ... },
  fire: { primary: '#7f1d1d', secondary: '#991b1b', ... },
  // + 8 more themes
}

export function applyTheme(theme: Theme) {
  const colors = THEMES[theme]
  document.documentElement.style.setProperty('--color-primary', colors.primary)
  // ... set CSS variables
}
```

Themes are applied via **CSS custom properties** and stored in user settings.

---

## Data Models

### Core Data Models (15 TypeScript Interfaces)

#### 1. UserState - Player Progression

Location: `src/lib/types/index.ts:2-22`

```typescript
interface UserState {
  id: "user_state"
  xp: number                         // Experience points
  level: number                      // Current level (starts at 1)
  xpForNextLevel: number             // XP needed for next level

  // Multipliers
  morningMultiplier: boolean         // 2x XP if tasks done 6-9 AM
  peakPerformanceMultiplier: boolean // 2x XP during BPT window

  // Player stats (0-100%)
  hydration: number                  // From water practice
  strength: number                   // From strength training
  energy: number                     // From sleep + cardio
  focus: number                      // From deep work practice
  recovery: number                   // From sleep

  // Streaks
  currentStreak: number              // Days with completed tasks
  longestStreak: number              // Personal record

  // Analytics
  morningControlCount: number        // Times morning multiplier achieved
  lifetimeLeverageRatio: number      // Avg leverage across all tasks
  last7DaysLeverageRatio: number     // Recent leverage score

  // Timestamps
  lastActive: string                 // ISO date
  createdAt: string                  // Account creation
  lastMidnightReset: string          // Last daily reset
}
```

**Leveling formula**: `xpForNextLevel = level × 100`
- Level 2: 100 XP
- Level 3: 200 XP
- Level 10: 1000 XP
- Level 100: 10,000 XP

#### 2. Task - Work Items

Location: `src/lib/types/index.ts:38-52`

```typescript
interface Task {
  id: string                         // UUID
  title: string                      // Task name
  description?: string               // Optional details

  leverageScore: 1-10                // Impact/effort ratio (10% increments)
  outcomeId: string                  // Links to goal

  scheduledFor?: string              // Due date (ISO)
  isMorningTask: boolean             // Eligible for 6-9 AM bonus

  completed: boolean
  completedAt?: string               // ISO timestamp
  xpEarned?: number                  // XP awarded (calculated on completion)

  // Recurring task fields
  isRecurring: boolean
  recurringTemplateId?: string       // Links to template

  createdAt: string
}
```

**XP calculation**: `xpEarned = leverageScore × 10 × multipliers`

#### 3. Practice - Habit Tracking

Location: `src/lib/types/index.ts:65-88`

```typescript
interface Practice {
  id: string
  name: string                       // "Water Intake", "Sleep", etc.
  description?: string

  type: "positive" | "negative"      // Goal to maximize or minimize
  target: number                     // Daily target amount
  unit: string                       // "ml", "hours", "grams", etc.

  // Tracking
  todayValue: number                 // Current progress
  todayCompleted: boolean            // Met target today?

  // Streaks
  habitStrength: number              // 0-100 consistency score
  currentStreak: number              // Days completed in row
  longestStreak: number              // Best streak

  // Scheduling
  frequency: "daily" | "custom"
  scheduleDays?: number[]            // [1,3,5] = Mon/Wed/Fri (for custom)

  // Timestamps
  lastLoggedAt: string
  createdAt: string
  lastCompletedAt?: string

  // Optional fields (for practices migrated from recurring tasks)
  leverageScore?: 1-10
  outcomeId?: string
  isMorningTask?: boolean
}
```

**9 core practices** seeded on first launch (defined in `src/lib/db/init.ts:5-79`):
1. Water Intake (2000ml daily)
2. Medications (1 dose daily)
3. WRC - Walk/Run/Cardio (30 min daily)
4. Sleep (8 hours daily)
5. Protein (180g daily)
6. Morning Sun Exposure (15 min daily)
7. Strength Training (1 session, 3x/week - Mon/Wed/Fri)
8. High-Leverage Work (2 hours daily)
9. Morning Power Hour (1 completion daily)

#### 4. Outcome - Goals

Location: `src/lib/types/index.ts:24-36`

```typescript
interface Outcome {
  id: string
  result: string                     // What you want to achieve
  purpose: string                    // Why it matters

  status: "active" | "completed" | "stalled" | "archived"
  progress: number                   // 0-100%

  linkedTaskCount: number            // How many tasks point here
  lastProgressUpdate: string         // ISO timestamp
  stalledDays: number                // Days without progress

  createdAt: string
  completedAt?: string
  archivedAt?: string
}
```

**Stall detection**: Automatically tracks days since last progress update.

#### 5. OutcomeNode - Hierarchical Goals (v2)

Location: `src/lib/types/index.ts:256-268`

```typescript
interface OutcomeNode {
  id: string
  type: 'purpose' | 'outcome' | 'milestone'  // Hierarchy level
  title: string
  description: string

  parentId?: string                  // Parent node (null = root)
  childIds: string[]                 // Child nodes

  progress: number                   // 0-100%
  color: string                      // Visual differentiation
  isActive: boolean

  linkedTaskCount?: number           // Tasks pointing here
  createdAt: string
}
```

**Tree structure**: `Purpose → Outcomes → Milestones → Tasks`

#### 6. Achievement - Unlockable Badges

Location: `src/lib/types/index.ts:124-134`

```typescript
interface Achievement {
  id: string
  name: string
  description: string
  icon: string                       // Emoji
  rarity: "common" | "rare" | "epic" | "legendary"
  category: "streak" | "task" | "leverage" | "morning" | "level" | "practice" | "challenge"

  // Functional properties
  condition: (state: UserState, history: HistoryRecord[]) => boolean
  progress?: (state: UserState, history: HistoryRecord[]) => { current: number; total: number }

  unlockedAt?: string                // ISO timestamp (undefined = locked)
}
```

**Example achievement** (`src/lib/achievements.ts:6-14`):

```typescript
{
  id: 'fire_starter',
  name: 'Fire Starter',
  description: 'Maintain a 3-day streak',
  icon: '🔥',
  rarity: 'common',
  category: 'streak',
  condition: (state) => state.currentStreak >= 3,
  progress: (state) => ({ current: Math.min(state.currentStreak, 3), total: 3 })
}
```

#### 7. HistoryRecord - Activity Audit Log

Location: `src/lib/types/index.ts:105-120`

```typescript
interface HistoryRecord {
  id: string
  type: "task" | "practice" | "outcome" | "chore"
  entityId: string                   // ID of completed item
  entitySnapshot: object             // Full object at completion time

  completedAt: string                // ISO timestamp
  xpEarned?: number

  // Context data
  wasInMorningWindow: boolean        // 6-9 AM?
  leverageScore?: number             // For tasks
  habitStrength?: number             // For practices
  practiceType?: "positive" | "negative"
  slipOccurred?: boolean             // For negative practices
  choreCategory?: string

  // Analytics metadata
  dayOfWeek: number                  // 0-6 (Sunday = 0)
  hourOfDay: number                  // 0-23
}
```

**Purpose**: Enables analytics, achievement tracking, and historical analysis.

#### 8. Additional Models

**Chore** (`src/lib/types/index.ts:90-103`) - Household tasks with recurring patterns

**FocusSession** (`src/lib/types/index.ts:175-189`) - Pomodoro/deep work tracking

**EnergyLog** (`src/lib/types/index.ts:192-199`) - Energy ratings (1-10) with timestamp

**BPTAnalysis** (`src/lib/types/index.ts:201-207`) - Best Performance Time calculation

**CouplesProfile** (`src/lib/types/index.ts:210-222`) - Relationship-level progression

**MorningSync** (`src/lib/types/index.ts:224-238`) - Daily couple coordination

**CoupleReward** (`src/lib/types/index.ts:240-253`) - Custom relationship rewards

**BodyDoublingSession** (`src/lib/types/index.ts:271-281`) - Collaborative work sessions

**PowerUp** (`src/lib/types/index.ts:152-164`) - Virtual shop items

**Challenge** (`src/lib/types/index.ts:136-148`) - Daily/weekly objectives

**AppSettings** (`src/lib/types/index.ts:285-297`) - User preferences

---

## Core Features

### Feature Matrix

| Feature | Component | DB Module | Lines | Purpose |
|---------|-----------|-----------|-------|---------|
| **Dashboard** | Dashboard.svelte | multiple | 385 | Overview of all metrics |
| **Task Management** | TaskList.svelte | tasks.ts | 450 | Create/complete tasks with leverage scoring |
| **AI Prioritizer** | TaskPrioritizer.svelte | tasks.ts, userState.ts, energy.ts | 262 | Intelligent task recommendation |
| **Habit Tracking** | Practices.svelte | practices.ts | 295 | Daily/custom frequency habits |
| **Goal Management (v1)** | Outcomes.svelte | outcomes.ts | 424 | Flat goal structure |
| **Goal Trees (v2)** | OutcomeTreeView.svelte | outcomeTree.ts | 436 | Hierarchical purpose/outcome/milestone |
| **Pomodoro Timer** | FocusTimer.svelte | focus.ts | 270 | 25/5/15 min work/break cycles |
| **Ultradian Timer** | UltradianTimer.svelte | focus.ts | 371 | 90-min deep work + 20-min breaks |
| **Energy Tracking** | EnergyLogger.svelte | energy.ts | 140 | Log energy 3x/day for BPT |
| **BPT Analysis** | BPTAnalysis.svelte | energy.ts | 234 | Calculate peak performance time |
| **Couples Mode** | CouplesMode.svelte | couples.ts | 617 | Partnership progression + morning sync |
| **Body Doubling** | BodyDoublingView.svelte | bodyDoubling.ts | 276 | Collaborative work sessions |
| **Chores** | Chores.svelte | chores.ts | 409 | Household task management |
| **Analytics** | PersonalAnalytics.svelte | history.ts | 368 | Charts + data visualization |
| **Activity Map** | HeatMap.svelte | history.ts | 231 | GitHub-style activity calendar |
| **Power-Ups** | PowerUpShop.svelte | powerups.ts | 203 | Virtual shop for boosts |
| **Achievements** | Achievements.svelte | achievements.ts | 116 | Badge display + progress |
| **Weekly Review** | WeeklyReview.svelte | settings.ts | 192 | Reflection prompts every 7 days |
| **Onboarding** | Onboarding.svelte | settings.ts | 173 | First-time user setup |

### Feature Deep Dive

#### 1. Leverage Scoring System

**Concept**: Rate tasks 1-10 based on impact/effort ratio

**Implementation**:
- Score of 1 = Low impact or high effort
- Score of 10 = Maximum impact with minimal effort
- XP earned: `leverageScore × 10` (10-100 XP per task)

**Business logic** (`src/lib/db/tasks.ts`):
```typescript
async function completeTask(taskId: string) {
  const task = await getTask(taskId)
  let xp = task.leverageScore * 10

  // Apply multipliers
  if (isInMorningWindow()) xp *= 2
  if (isInBPTWindow()) xp *= 2

  task.xpEarned = xp
  await addXP(xp)
}
```

**Lifetime leverage ratio** (`src/lib/db/userState.ts`):
```typescript
// Calculate average leverage of all completed tasks
const avgLeverage = history
  .filter(h => h.type === 'task')
  .reduce((sum, h) => sum + (h.leverageScore || 0), 0) / taskCount
```

#### 2. Morning Multiplier (6-9 AM Bonus)

**Concept**: Complete tasks between 6-9 AM for 2x XP

**Check function**:
```typescript
function isInMorningWindow(): boolean {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 9
}
```

**Tracked metric**: `morningControlCount` increments each time achieved.

#### 3. Energy Tracking & BPT (Best Performance Time)

**Data collection**:
- Log energy level (1-10) three times daily
- Context: morning (6-11 AM), midday (11 AM-5 PM), evening (5-11 PM)
- Minimum 63 data points (21 days × 3 logs) for reliable analysis

**BPT calculation** (`src/lib/db/energy.ts`):
```typescript
async function calculateBPT(): Promise<BPTAnalysis> {
  const logs = await getEnergyLogs()

  // Group by hour and average
  const hourlyEnergy = logs.reduce((acc, log) => {
    const hour = new Date(log.timestamp).getHours()
    acc[hour] = (acc[hour] || []).concat(log.energy)
    return acc
  }, {})

  const energyCurve = Object.entries(hourlyEnergy).map(([hour, energies]) => ({
    hour: Number(hour),
    avgEnergy: energies.reduce((a, b) => a + b) / energies.length
  }))

  // Find peak consecutive 2-hour window
  const peakWindow = findPeakWindow(energyCurve)

  return {
    dataPoints: logs.length,
    peakWindow,
    energyCurve,
    lastCalculated: new Date().toISOString()
  }
}
```

**BPT multiplier**: Tasks completed during peak window earn 2x XP.

#### 4. AI Task Prioritizer

**Scoring algorithm** (`src/components/TaskPrioritizer.svelte`):

```typescript
function calculatePriority(task: Task): number {
  let score = 0

  // 1. Leverage weight (40 points max)
  score += (task.leverageScore / 10) * 40

  // 2. Morning bonus (15 points)
  if (task.isMorningTask && isBeforeNoon()) {
    score += 15
  }

  // 3. Urgency (25 points max)
  if (task.scheduledFor) {
    const daysUntilDue = getDaysUntilDue(task.scheduledFor)
    if (daysUntilDue === 0) score += 25        // Due today
    else if (daysUntilDue === 1) score += 20   // Due tomorrow
    else if (daysUntilDue <= 3) score += 15    // Within 3 days
    else if (daysUntilDue <= 7) score += 5     // Within week
  }

  // 4. Energy match (20 points)
  const currentEnergy = getCurrentEnergyLevel()
  if (currentEnergy >= 7 && task.leverageScore >= 7) {
    score += 20  // High energy + high leverage
  } else if (currentEnergy <= 4 && task.leverageScore <= 4) {
    score += 20  // Low energy + low leverage (do easy tasks)
  }

  // 5. BPT bonus (25 points)
  if (isInBPTWindow()) {
    score += 25
  }

  return score  // 0-100 scale
}
```

**Output**: Ranks all incomplete tasks and recommends top 3.

#### 5. Streak System

**Daily reset logic** (`src/lib/db/userState.ts`):

```typescript
async function checkDailyReset() {
  const state = await getUserState()
  const lastReset = new Date(state.lastMidnightReset)
  const now = new Date()

  // Check if we've passed midnight
  if (now.getDate() !== lastReset.getDate()) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    // Did user complete any tasks yesterday?
    const yesterdayTasks = await getTasksCompletedOn(yesterday)

    if (yesterdayTasks.length === 0) {
      // Streak broken
      state.currentStreak = 0
    }

    state.lastMidnightReset = now.toISOString()
    await saveUserState(state)
  }
}
```

**Streak increment**: Happens on first task completion each day.

#### 6. Couples Mode Features

**Setup flow**:
1. Partner 1 generates 6-digit code
2. Partner 2 enters code to link profiles
3. Creates `CouplesProfile` with shared progression

**Morning Sync ritual** (`src/components/CouplesMode.svelte`):
- Each partner shares top 3 priorities
- Exchange energy levels (1-10)
- Plan optional shared work session
- Earn relationship XP on completion

**Relationship leveling**:
- Shared XP pool (both partners contribute)
- Level up every 1000 XP
- Unlock couple rewards at milestones

#### 7. Achievements System

**25+ achievements** across 7 categories:

**Streak achievements**:
- Fire Starter (3 days) - Common
- Momentum Master (7 days) - Rare
- Unstoppable (30 days) - Epic
- Legend Status (100 days) - Legendary

**Task achievements**:
- Task Novice (10 tasks) - Common
- Task Warrior (50 tasks) - Rare
- Task Master (100 tasks) - Epic
- Task Legend (500 tasks) - Legendary

**Leverage achievements**:
- High Value (10× leverage 7+) - Common
- Leverage Pro (50× leverage 7+) - Rare
- Leverage Master (100× leverage 8+) - Epic
- Leverage Enlightened (lifetime avg 7+) - Legendary

**Morning achievements**:
- Early Bird (10 morning completions)
- Sunrise Warrior (50 morning completions)
- Morning Legend (100 morning completions)

**Check logic** (runs after each action):
```typescript
async function checkAchievements() {
  const state = await getUserState()
  const history = await getHistory()
  const achievements = ACHIEVEMENTS

  for (const achievement of achievements) {
    if (!achievement.unlockedAt && achievement.condition(state, history)) {
      achievement.unlockedAt = new Date().toISOString()
      await saveAchievement(achievement)
      showAchievementNotification(achievement)
    }
  }
}
```

---

## Code Patterns & Conventions

### 1. Component Structure Pattern

**Standard Svelte component layout**:

```svelte
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte'
  import { getX, updateX } from '../lib/db'
  import type { X } from '../lib/types'

  // 2. Props (if any)
  export let someProp: string

  // 3. State variables
  let data: X[] = []
  let loading = true
  let error: string | null = null

  // 4. Reactive declarations
  $: filteredData = data.filter(item => item.active)
  $: totalCount = data.length

  // 5. Lifecycle hooks
  onMount(async () => {
    await loadData()
  })

  // 6. Functions
  async function loadData() {
    try {
      loading = true
      data = await getX()
    } catch (e) {
      error = e.message
    } finally {
      loading = false
    }
  }

  async function handleAction(id: string) {
    await updateX(id)
    await loadData() // Always refresh after mutations
  }
</script>

<!-- 7. Template -->
<div class="container">
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else}
    <!-- Main content -->
  {/if}
</div>

<!-- 8. Styles (if scoped) -->
<style>
  .container {
    /* Component-specific styles */
  }
</style>
```

### 2. Database Function Patterns

**CRUD operations pattern** (example from `src/lib/db/tasks.ts`):

```typescript
import { get, set } from 'idb-keyval'
import { KEYS } from './keys'
import type { Task } from '../types'

// Read
export async function getTasks(): Promise<Task[]> {
  const tasks = await get<Task[]>(KEYS.TASKS)
  return tasks || []
}

export async function getTask(id: string): Promise<Task | undefined> {
  const tasks = await getTasks()
  return tasks.find(t => t.id === id)
}

// Create
export async function addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const tasks = await getTasks()
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  }
  await set(KEYS.TASKS, [...tasks, newTask])
  return newTask
}

// Update
export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  const tasks = await getTasks()
  const index = tasks.findIndex(t => t.id === id)
  if (index === -1) throw new Error('Task not found')

  tasks[index] = { ...tasks[index], ...updates }
  await set(KEYS.TASKS, tasks)
}

// Delete
export async function deleteTask(id: string): Promise<void> {
  const tasks = await getTasks()
  const filtered = tasks.filter(t => t.id !== id)
  await set(KEYS.TASKS, filtered)
}
```

**Key principles**:
1. Always use typed returns with TypeScript
2. Return empty arrays (not null) for collections
3. Generate UUIDs with `crypto.randomUUID()`
4. Add timestamps automatically
5. Throw errors for not-found cases

### 3. Naming Conventions

**Files**:
- Components: PascalCase (e.g., `TaskList.svelte`)
- Modules: camelCase (e.g., `userState.ts`)
- Types: `types/index.ts` (single file for all types)

**Variables**:
- State: camelCase (e.g., `currentView`, `tasks`)
- Constants: UPPER_SNAKE_CASE (e.g., `KEYS.TASKS`)
- Types: PascalCase (e.g., `UserState`, `Task`)

**Functions**:
- DB operations: verb + noun (e.g., `getTasks`, `addTask`, `updateUserState`)
- Event handlers: `handle` + action (e.g., `handleComplete`, `handleSubmit`)
- Utilities: descriptive camelCase (e.g., `calculateLeverageRatio`)

### 4. TypeScript Usage

**Strict mode enabled** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Type import pattern**:
```typescript
import type { Task, UserState } from '../types'
```

**Avoid `any`** - use proper types or `unknown`.

### 5. Error Handling Pattern

**Database operations**:
```typescript
try {
  const result = await someDBOperation()
  return result
} catch (error) {
  console.error('Error in someDBOperation:', error)
  throw error  // Re-throw for component to handle
}
```

**Component level**:
```svelte
<script>
  let error: string | null = null

  async function handleAction() {
    try {
      await someOperation()
      error = null
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred'
    }
  }
</script>

{#if error}
  <div class="bg-red-900/30 border border-red-700 p-4 rounded">
    {error}
  </div>
{/if}
```

### 6. Styling Patterns

**Tailwind utility classes** (most common):
```svelte
<div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
  <h2 class="text-2xl font-bold mb-4">Title</h2>
  <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors">
    Action
  </button>
</div>
```

**Color scheme**:
- Backgrounds: `bg-slate-900`, `bg-slate-800`, `bg-slate-700`
- Borders: `border-slate-700`, `border-slate-600`
- Text: `text-white`, `text-slate-400`, `text-blue-400`
- Accents: `text-blue-400`, `bg-blue-600`, `border-blue-500`

**Responsive**: Mobile-first with Tailwind breakpoints
```svelte
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## Database Layer

### Storage Keys (21 Collections)

**File**: `src/lib/db/keys.ts`

```typescript
export const KEYS = {
  // Core data
  USER_STATE: 'user_state',           // UserState object
  TASKS: 'tasks',                     // Task[]
  OUTCOMES: 'outcomes',               // Outcome[]
  PRACTICES: 'practices',             // Practice[]
  HISTORY: 'history',                 // HistoryRecord[]

  // Features
  ACHIEVEMENTS: 'achievements',       // Achievement[]
  CHALLENGES: 'challenges',           // Challenge[]
  POWER_UPS: 'power_ups',            // PurchasedPowerUp[]
  CHORES: 'chores',                  // Chore[]

  // Focus & Energy
  FOCUS_SESSIONS: 'focus_sessions',   // FocusSession[]
  ENERGY_LOGS: 'energy_logs',         // EnergyLog[]
  BPT_ANALYSIS: 'bpt_analysis',       // BPTAnalysis object

  // Couples features
  COUPLES_PROFILE: 'couples_profile', // CouplesProfile object
  MORNING_SYNCS: 'morning_syncs',     // MorningSync[]
  COUPLE_REWARDS: 'couple_rewards',   // CoupleReward[]

  // v2 features
  OUTCOME_NODES: 'outcome_nodes',     // OutcomeNode[]
  BODY_DOUBLING_SESSIONS: 'body_doubling', // BodyDoublingSession[]

  // System
  SETTINGS: 'settings',               // AppSettings object
  RECURRING_TASKS: 'recurring_tasks', // RecurringTaskTemplate[] (legacy)
}
```

### Database Initialization

**File**: `src/lib/db/init.ts`

**Initialization flow** (called from `main.ts` on app startup):

```typescript
export async function initializeStorage() {
  let userState = await get(KEYS.USER_STATE)

  if (!userState) {
    // First-time setup
    userState = createDefaultUserState()
    await set(KEYS.USER_STATE, userState)

    // Seed 9 core practices
    const practices = CORE_PRACTICES.map(p => ({
      ...p,
      id: crypto.randomUUID(),
      habitStrength: 0,
      currentStreak: 0,
      longestStreak: 0,
      todayValue: 0,
      todayCompleted: false,
      lastLoggedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }))
    await set(KEYS.PRACTICES, practices)
  } else {
    // Existing user - add any missing core practices
    const existingPractices = await get(KEYS.PRACTICES) || []
    const existingNames = new Set(existingPractices.map(p => p.name))

    const newPractices = CORE_PRACTICES
      .filter(p => !existingNames.has(p.name))
      .map(p => ({ ...p, /* initialize fields */ }))

    if (newPractices.length > 0) {
      await set(KEYS.PRACTICES, [...existingPractices, ...newPractices])
    }
  }

  // Initialize empty collections if needed
  if (!await get(KEYS.TASKS)) await set(KEYS.TASKS, [])
  if (!await get(KEYS.OUTCOMES)) await set(KEYS.OUTCOMES, [])
  if (!await get(KEYS.HISTORY)) await set(KEYS.HISTORY, [])
  // ... etc

  // Run migrations (one-time)
  await migrateRecurringTasksToPractices()
}
```

### Data Migration Pattern

**Example**: Recurring Tasks → Practices migration

```typescript
async function migrateRecurringTasksToPractices() {
  const recurringTasks = await get(KEYS.RECURRING_TASKS) || []
  if (recurringTasks.length === 0) return  // Already migrated

  const practices = await get(KEYS.PRACTICES) || []

  // Convert each recurring task to a practice
  const migratedPractices = recurringTasks.map(template => ({
    id: crypto.randomUUID(),
    name: template.title,
    description: template.description,
    type: "positive",
    target: 1,
    unit: "completion",
    // ... initialize all required fields
    leverageScore: template.leverageScore,  // Preserve from old model
    outcomeId: template.outcomeId,
    isMorningTask: template.isMorningTask
  }))

  // Merge with existing practices
  await set(KEYS.PRACTICES, [...practices, ...migratedPractices])

  // Clear old collection
  await set(KEYS.RECURRING_TASKS, [])

  console.log(`Migrated ${recurringTasks.length} recurring tasks`)
}
```

### Backup & Restore

**File**: `src/lib/db/backup.ts`

**Export all data**:
```typescript
export async function exportAllData(): Promise<string> {
  const data = {}

  for (const [name, key] of Object.entries(KEYS)) {
    data[name] = await get(key)
  }

  return JSON.stringify(data, null, 2)
}

export function downloadBackup(jsonData: string, filename: string) {
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

**Import data**:
```typescript
export async function importAllData(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString)

    // Validate structure
    if (!data.USER_STATE || !Array.isArray(data.TASKS)) {
      return false
    }

    // Import all keys
    for (const [name, key] of Object.entries(KEYS)) {
      if (data[name]) {
        await set(key, data[name])
      }
    }

    return true
  } catch (error) {
    console.error('Import error:', error)
    return false
  }
}
```

**Usage**: Export button in settings creates `lifer-backup-2025-01-15.json` file.

---

## User Journey

### First-Time User Flow

1. **App loads** → `main.ts` calls `initializeStorage()`
2. **No user state found** → Create default UserState (Level 1, 0 XP)
3. **Seed 9 core practices** (Water, Sleep, Strength Training, etc.)
4. **Show onboarding modal** (`showOnboarding = true` because `settings.onboardingCompleted === false`)
5. **User completes onboarding** → Sets `onboardingCompleted: true`
6. **Dashboard loads** showing:
   - Current level (1)
   - XP progress (0/100)
   - Streak (0 days)
   - Practice compliance (0%)
   - Empty task list
   - Achievement progress (all locked)

### Daily Usage Flow

**Morning** (6-9 AM):
1. User opens app
2. **Morning reminder notification** (if enabled)
3. Dashboard shows "Morning Multiplier Active" banner
4. User creates high-leverage task marked as "morning task"
5. User completes task → earns `leverageScore × 10 × 2 = 2x XP`
6. **Confetti animation** + **sound effect**
7. XP bar updates, potentially level up
8. Streak increments (first task of day)
9. `morningControlCount++`
10. Achievement check (e.g., "Early Bird" unlocks at 10 morning completions)

**Midday**:
1. User logs energy level (1-10) in Energy Logger
2. Checks AI Prioritizer for recommended task
3. Starts Pomodoro timer (25 min)
4. Timer completes → earns 100 XP + task completion XP
5. Takes 5-min break
6. Completes practice (e.g., "High-Leverage Work" 2 hours)
7. Practice progress bar updates

**Evening** (8-11 PM):
1. User logs evening energy level
2. **Streak reminder notification** (if no tasks completed today)
3. Completes remaining chores
4. Reviews daily progress on Dashboard
5. Weekly review prompt appears (if 7+ days since last review)

### Couples Mode Flow

**Setup**:
1. Partner 1: Navigate to "Pair Lifers" → Generate code (e.g., "X7K9M2")
2. Partner 2: Enter code → Profiles linked
3. `CouplesProfile` created with shared XP pool

**Daily Morning Sync**:
1. Both partners open "Morning Sync" screen
2. Each enters:
   - Top 3 priorities for the day
   - Current energy level (1-10)
   - Optional shared work session time
3. Both complete → Earn relationship XP
4. Dashboard shows couple streak + shared level

**Leveling together**:
- Both partners' task completions add to shared XP pool
- Every 1000 XP → Relationship level up
- Unlock custom couple rewards (quality time, date nights, etc.)
- Redeem rewards at milestones

---

## Key Algorithms

### 1. XP Calculation

**File**: `src/lib/db/tasks.ts`

```typescript
async function completeTask(taskId: string): Promise<number> {
  const task = await getTask(taskId)
  const state = await getUserState()

  // Base XP
  let xp = task.leverageScore * 10  // 10-100 XP

  // Morning multiplier (6-9 AM)
  if (task.isMorningTask && isInMorningWindow()) {
    xp *= 2
    state.morningMultiplier = true
    state.morningControlCount++
  }

  // BPT multiplier
  const bpt = await getBPTAnalysis()
  if (bpt && isInBPTWindow(bpt.peakWindow)) {
    xp *= 2
    state.peakPerformanceMultiplier = true
  }

  // Active power-ups
  const activePowerUps = await getActivePowerUps()
  const xpBoost = activePowerUps.find(p => p.type === 'xp_boost')
  if (xpBoost) {
    xp *= xpBoost.multiplier  // e.g., 1.5x
  }

  const doubleXP = activePowerUps.find(p => p.type === 'double_xp')
  if (doubleXP) {
    xp *= 2
  }

  return Math.floor(xp)
}
```

### 2. Level-Up Logic

**File**: `src/lib/db/userState.ts`

```typescript
export async function addXP(amount: number): Promise<{ leveledUp: boolean; newLevel?: number }> {
  const state = await getUserState()

  state.xp += amount
  let leveledUp = false
  let newLevel = state.level

  // Check for level up (may be multiple levels)
  while (state.xp >= state.xpForNextLevel) {
    state.xp -= state.xpForNextLevel
    state.level++
    newLevel = state.level
    leveledUp = true

    // Formula: next level requires level × 100 XP
    state.xpForNextLevel = state.level * 100

    // Play celebration
    if (leveledUp) {
      playSound('levelup')
      showNotification(`Level Up! You're now level ${state.level}`)
    }
  }

  await saveUserState(state)

  // Check achievements after XP change
  await checkAchievements()

  return { leveledUp, newLevel }
}
```

### 3. Streak Calculation

**File**: `src/lib/db/userState.ts`

```typescript
export async function updateStreak(): Promise<void> {
  const state = await getUserState()
  const now = new Date()
  const lastActive = new Date(state.lastActive)

  // Check if this is first activity today
  if (now.toDateString() !== lastActive.toDateString()) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    // Was last activity yesterday?
    if (lastActive.toDateString() === yesterday.toDateString()) {
      // Streak continues
      state.currentStreak++
    } else {
      // Streak broken (missed a day)
      state.currentStreak = 1
    }

    // Update longest streak
    if (state.currentStreak > state.longestStreak) {
      state.longestStreak = state.currentStreak
    }
  }

  state.lastActive = now.toISOString()
  await saveUserState(state)
}
```

### 4. Habit Strength Calculation

**File**: `src/lib/db/practices.ts`

```typescript
async function updateHabitStrength(practiceId: string): Promise<void> {
  const practice = await getPractice(practiceId)
  const history = await getHistory()

  // Get last 30 days of this practice
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentCompletions = history.filter(h =>
    h.type === 'practice' &&
    h.entityId === practiceId &&
    new Date(h.completedAt) > thirtyDaysAgo
  )

  // Calculate expected completions based on frequency
  let expectedCompletions = 0
  if (practice.frequency === 'daily') {
    expectedCompletions = 30
  } else if (practice.frequency === 'custom' && practice.scheduleDays) {
    // Count scheduled days in last 30 days
    expectedCompletions = countScheduledDaysInRange(practice.scheduleDays, thirtyDaysAgo, new Date())
  }

  // Habit strength = (actual / expected) × 100
  practice.habitStrength = Math.min(100, (recentCompletions.length / expectedCompletions) * 100)

  await savePractice(practice)
}
```

### 5. BPT Window Detection

**File**: `src/lib/db/energy.ts`

```typescript
function findPeakWindow(energyCurve: Array<{ hour: number; avgEnergy: number }>): {
  start: string;
  end: string;
  confidence: number;
} {
  let maxSum = 0
  let peakStart = 0

  // Find highest consecutive 2-hour window
  for (let i = 0; i < energyCurve.length - 1; i++) {
    const sum = energyCurve[i].avgEnergy + energyCurve[i + 1].avgEnergy
    if (sum > maxSum) {
      maxSum = sum
      peakStart = energyCurve[i].hour
    }
  }

  // Confidence based on data points and energy delta
  const avgEnergy = energyCurve.reduce((sum, e) => sum + e.avgEnergy, 0) / energyCurve.length
  const peakAvg = maxSum / 2
  const confidence = Math.min(100, ((peakAvg - avgEnergy) / avgEnergy) * 100)

  return {
    start: `${peakStart}:00`,
    end: `${peakStart + 2}:00`,
    confidence: Math.round(confidence)
  }
}
```

### 6. Task Priority Scoring

**File**: `src/components/TaskPrioritizer.svelte`

(See [Feature Deep Dive](#4-ai-task-prioritizer) for full algorithm)

**Summary**:
- Leverage: 40 points
- Morning bonus: 15 points
- Urgency: 25 points
- Energy match: 20 points
- BPT window: 25 points
- **Total**: 0-100 score

---

## Deployment & Configuration

### Build Configuration

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Lifer/',  // GitHub Pages deployment path

  plugins: [
    svelte(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg'],

      manifest: {
        name: 'Lifer',
        short_name: 'Lifer',
        description: 'Life management & productivity app',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/Lifer/',
        icons: [
          {
            src: '/Lifer/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/Lifer/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache'
            }
          }
        ]
      }
    })
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['svelte'],
          charts: ['chart.js'],
          db: ['idb-keyval']
        }
      }
    }
  }
})
```

### Deployment Process

**Host**: GitHub Pages

**Build command**: `npm run build`

**Output**: `dist/` directory

**GitHub Actions** (likely configured):
```yaml
- name: Build
  run: npm run build

- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

**Live URL**: `https://myairhys.github.io/Lifer/`

### Environment Configuration

**Development**:
```bash
npm run dev          # Starts Vite dev server on http://localhost:5173
npm run check        # TypeScript + Svelte type checking
```

**Production**:
```bash
npm run build        # Build optimized bundle
npm run preview      # Preview production build locally
```

### Browser Requirements

**Minimum requirements**:
- IndexedDB support (all modern browsers)
- ES2020 JavaScript support
- Service Worker support (for PWA features)

**Tested on**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Offline Capabilities

**Service Worker caching**:
1. All static assets (JS, CSS, HTML)
2. Icons and images
3. Google Fonts (if used)

**IndexedDB**:
- All user data stored locally
- No network required after initial load
- Backup/restore via JSON export

**Result**: App works 100% offline after first load.

---

## App Purpose & Target Audience

### Problem Statement

Modern productivity apps suffer from:
1. **Task count obsession** - Rewarding completion quantity over quality
2. **Generic recommendations** - Same advice for everyone regardless of energy patterns
3. **Weak accountability** - Solo tools with no partnership support
4. **Habit tracking silos** - Physical health separate from productivity
5. **Subscription fatigue** - Monthly costs for basic features
6. **Data privacy concerns** - Sensitive personal data on external servers

### Lifer's Solution

**Core principles**:

1. **Leverage > Volume** - Focus on high-impact tasks (impact/effort ratio)
2. **Chronotype optimization** - Identify and leverage your Best Performance Time
3. **Holistic tracking** - Physical health (sleep, exercise) + mental (focus, tasks)
4. **Relationship integration** - Couples mode and body doubling for accountability
5. **Offline-first** - No backend, no subscription, complete privacy
6. **Gamification** - RPG mechanics (XP, levels, achievements) for sustained motivation

### Target Users

**Primary audience**:
- **Productivity enthusiasts** seeking optimization beyond basic todo apps
- **ADHD/neurodivergent individuals** benefiting from body doubling and energy tracking
- **Couples** wanting to coordinate and progress together
- **Self-optimization seekers** who track metrics and iterate
- **Privacy-conscious users** who want local-only data storage

**Use cases**:
- Freelancers managing multiple high-leverage projects
- Students balancing coursework, health, and goals
- Couples coordinating household tasks and shared goals
- Anyone building sustainable daily habits (sleep, exercise, etc.)
- Remote workers optimizing focus time based on energy patterns

### Competitive Differentiation

| Feature | Lifer | Todoist | Habitica | Notion |
|---------|-------|---------|----------|--------|
| **Leverage scoring** | ✅ | ❌ | ❌ | ❌ |
| **Energy/BPT tracking** | ✅ | ❌ | ❌ | ❌ |
| **Couples progression** | ✅ | ❌ | ❌ | ❌ |
| **Body doubling** | ✅ | ❌ | ❌ | ❌ |
| **Offline-first** | ✅ | Limited | Limited | ❌ |
| **No subscription** | ✅ | ❌ | ✅ | ❌ |
| **Open source** | ✅ | ❌ | ✅ | ❌ |
| **RPG mechanics** | ✅ | ❌ | ✅ | ❌ |
| **Holistic health** | ✅ | ❌ | Limited | ❌ |

**Unique value proposition**: "Optimize your life based on YOUR energy patterns while building sustainable habits and progressing with your partner - all offline and free."

---

## Future Development Considerations

### Technical Debt

1. **Outcome v1 vs v2**: Two goal systems exist (flat Outcomes + hierarchical OutcomeTree)
   - Consider deprecating v1 or migrating data

2. **Recurring Tasks**: Legacy system migrated to Practices
   - Clean up `recurringTasks.ts` module if no longer needed

3. **Type safety**: Some `any` types in animation/sound modules
   - Full TypeScript coverage audit

4. **Testing**: No test suite currently
   - Add Vitest + Testing Library for components
   - Unit tests for algorithms (XP, BPT, streaks)

### Potential Features

1. **Data sync** (optional cloud backup)
   - End-to-end encrypted sync across devices
   - Keep offline-first philosophy

2. **Team mode** (beyond couples)
   - Small group accountability (3-5 people)
   - Shared outcomes and body doubling sessions

3. **AI insights** (local LLM)
   - Pattern recognition in energy/productivity
   - Personalized recommendations beyond current prioritizer

4. **Wearable integration**
   - Import sleep/activity data from Fitbit/Apple Watch
   - Auto-populate practices (sleep hours, steps, etc.)

5. **Spaced repetition**
   - Review outcomes and goals at optimal intervals
   - Memory retention for learning-based practices

### Performance Optimizations

1. **Lazy loading** - Load components on-demand for faster initial load
2. **Virtual scrolling** - For long task/history lists
3. **IndexedDB indexing** - Add indexes for faster queries on large datasets
4. **Web Workers** - Offload BPT calculations and heavy analytics

---

## Conclusion

Lifer is a **sophisticated, well-architected life management system** that stands out through:

1. **Thoughtful design patterns** - Clean separation of concerns (UI/DB/types)
2. **Focus on quality over quantity** - Leverage scoring emphasizes impact
3. **Scientific approach** - Energy tracking and chronotype analysis
4. **Relationship features** - Unique couples progression system
5. **Privacy-first** - 100% offline, no data leaves device
6. **Modern tech stack** - Svelte + TypeScript + PWA for great UX
7. **Gamification done right** - RPG mechanics that motivate without being gimmicky

The codebase is clean, well-organized, and ready for future enhancements while maintaining its core philosophy of **offline-first, high-leverage productivity optimization**.

---

**Document version**: 1.0
**Last updated**: 2025-01-15
**Total project lines**: ~10,262
**Components**: 23
**Data models**: 15+
**Features**: 20+
