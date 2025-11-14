# LIFER UI/UX DESIGN SYSTEM
## Complete Interface Design for 18-Thinker Life Management App

---

## EXECUTIVE SUMMARY

This document defines the complete UI/UX design system for Lifer, a gamified life management app built on principles from 18 influential thinkers. The design philosophy centers on **intentional constraint** (Streaks approach), **progressive disclosure** (reduce cognitive load), and **behavioral architecture** (James Clear's environment design).

**Design Goals:**
1. Make high-leverage habits obvious, attractive, easy, and satisfying
2. Reduce cognitive load through intentional constraint
3. Provide immediate value within 180 seconds
4. Create addictive interactions without dark patterns
5. Build identity reinforcement into every pixel

**Primary Influences:**
- Streaks (constraint as feature, 6-task maximum)
- Duolingo ("play first, profile second" onboarding)
- James Clear (environment = behavior architecture)
- Material Design 3 (accessibility, dynamic color)
- iOS HIG (platform-native excellence)

**Technical Stack:**
- Svelte 4+ with TypeScript
- Tailwind CSS for styling
- Progressive Web App (PWA)
- IndexedDB for offline-first data
- 60fps animations on budget devices

---

## DESIGN PHILOSOPHY: CONSTRAINT AS POWER

### Core Principle: "The Greatest Control Room of All Time"

Lifer is not a todo app. It's a **life control station** where every element reinforces the user's chosen identity through environmental design.

**The Three Rules:**

1. **Constraint Creates Focus**
   - Maximum 6 daily high-leverage tasks (Streaks approach)
   - One primary morning ritual flow
   - One identity statement at a time
   - Forces prioritization, prevents overwhelm

2. **Environment Shapes Behavior**
   - Every UI element is a cue (James Clear)
   - Make good actions obvious (visual hierarchy)
   - Make bad actions invisible (distraction removal)
   - Default path = optimal path

3. **Immediate Satisfaction Drives Repetition**
   - Sub-100ms interaction response
   - Confetti + haptic on completion
   - XP counter animates immediately
   - Visual progress always visible

### Design Language: "Focused Intensity"

**Visual Identity:**
- Dark, cinematic base (control room aesthetic)
- Electric blue for focus/action
- Vibrant green for success/flow
- Warm orange for energy peaks
- Clean red for urgency (not panic)

**Typography:**
- System fonts for performance (SF Pro, Roboto, Inter)
- Bold weights (700-900) for primary metrics
- Oversized numbers for at-a-glance reading (48-72pt)
- Three-tier hierarchy: Display > Body > Caption

**Spacing:**
- 8px base unit (everything divisible by 8)
- Touch targets: minimum 44x44px
- Breathing room: generous whitespace
- Content max-width: 680px for readability

---

## COLOR SYSTEM: SEMANTIC TOKEN ARCHITECTURE

### Three-Tier Token System

**LAYER 1: Primitive Tokens** (Raw Values)
```
blue-900: #0c4a6e    blue-800: #075985    blue-700: #0369a1
blue-600: #0284c7    blue-500: #0ea5e9    blue-400: #38bdf8
blue-300: #7dd3fc    blue-200: #bae6fd    blue-100: #e0f2fe

green-900: #14532d   green-800: #166534   green-700: #15803d
green-600: #16a34a   green-500: #22c55e   green-400: #4ade80
green-300: #86efac   green-200: #bbf7d0   green-100: #dcfce7

orange-900: #7c2d12  orange-800: #9a3412  orange-700: #c2410c
orange-600: #ea580c  orange-500: #f97316  orange-400: #fb923c
orange-300: #fdba74  orange-200: #fed7aa  orange-100: #ffedd5

red-900: #7f1d1d     red-800: #991b1b     red-700: #b91c1c
red-600: #dc2626     red-500: #ef4444     red-400: #f87171
red-300: #fca5a5     red-200: #fecaca     red-100: #fee2e2

slate-900: #0f172a   slate-800: #1e293b   slate-700: #334155
slate-600: #475569   slate-500: #64748b   slate-400: #94a3b8
slate-300: #cbd5e1   slate-200: #e2e8f0   slate-100: #f1f5f9
```

**LAYER 2: Semantic Tokens** (Meaning-Based)
```
LIGHT MODE:
text-primary: slate-900       (87% opacity)
text-secondary: slate-700     (60% opacity)
text-disabled: slate-500      (38% opacity)
bg-primary: slate-100
bg-secondary: slate-50
border-default: slate-300

DARK MODE:
text-primary: slate-50        (87% opacity)
text-secondary: slate-300     (60% opacity)
text-disabled: slate-500      (38% opacity)
bg-primary: slate-900
bg-secondary: slate-800
border-default: slate-700

ACTION COLORS (Same across themes):
action-primary: blue-500
action-hover: blue-600
action-active: blue-700
success: green-500
warning: orange-500
danger: red-500
```

**LAYER 3: Component Tokens** (Specific Use Cases)
```
button-primary-bg: action-primary
button-primary-hover: action-hover
button-primary-text: slate-50

task-leverage-high: orange-500     (9-10 leverage)
task-leverage-medium: blue-500     (7-8 leverage)
task-leverage-low: slate-400       (1-6 leverage)

streak-active: green-500
streak-risk: orange-500            (1 miss)
streak-broken: red-500             (2+ misses)

identity-aligned: green-500        (vote for identity)
identity-misaligned: red-500       (vote against)

energy-peak: orange-400            (BPT high energy)
energy-mid: blue-400               (normal energy)
energy-low: slate-400              (low energy)

flow-state: green-400              (effortless)
forced-state: red-400              (struggle)
```

### Accessibility Requirements

**Contrast Ratios:**
- Text: minimum 4.5:1 (WCAG AA)
- UI elements: minimum 3:1
- Large text (24px+): minimum 3:1

**Color Blindness Support:**
- Never rely on color alone
- Always pair with icons/text/patterns
- Test with deuteranopia simulator

**Dark Mode Specifics:**
- Base: #0f172a (not pure black - reduces eye strain)
- Elevated surfaces: lighter shades
- Text: 87%/60%/38% opacity hierarchy
- Avoid harsh white (#ffffff) - use slate-50

---

## TYPOGRAPHY SYSTEM

### Font Stack
```css
font-family: 
  -apple-system, BlinkMacSystemFont, 'Segoe UI', 
  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
  'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
  sans-serif;
```

### Type Scale (Mobile-First)
```
Display 1: 48px / 700 / -0.5px / 1.1 line-height
Display 2: 36px / 700 / -0.25px / 1.2
Heading 1: 32px / 700 / 0 / 1.25
Heading 2: 24px / 600 / 0 / 1.3
Heading 3: 20px / 600 / 0 / 1.4
Body Large: 18px / 400 / 0 / 1.5
Body: 16px / 400 / 0 / 1.5
Body Small: 14px / 400 / 0 / 1.5
Caption: 12px / 500 / 0.5px / 1.4
Overline: 11px / 600 / 1px / 1.4 / uppercase
```

### Usage Guidelines

**Display:** 
- XP numbers (Level 47: 8,432 XP)
- Streak counters (147 days)
- Large metrics

**Headings:**
- Section titles
- Modal headers
- Card titles

**Body:**
- Task descriptions
- Settings labels
- General content

**Caption:**
- Timestamps
- Helper text
- Metadata

**Overline:**
- Category labels
- Section headers
- Tags

---

## COMPONENT LIBRARY

### 1. DASHBOARD (Home Screen)

**Layout Structure:**
```
┌─────────────────────────────────┐
│ Top Bar (64px fixed)            │
│ - Avatar + Level + XP           │
│ - Streak counter                │
│ - Settings icon                 │
├─────────────────────────────────┤
│ Identity Statement (80px)       │
│ "I am a person who..."          │
│ Vote counter: 12↑ 3↓            │
├─────────────────────────────────┤
│ Morning Control (120px)         │
│ Circular progress: 5/8 ✓        │
│ "3x XP ACTIVE"                  │
├─────────────────────────────────┤
│ Today's Tasks (6 max)           │
│ ┌───────────────────────────┐   │
│ │ Task 1 [Leverage 9] 🔥    │   │
│ │ Progress ring             │   │
│ │ Swipe → to complete       │   │
│ └───────────────────────────┘   │
│ [5 more tasks...]               │
├─────────────────────────────────┤
│ Quick Actions (60px)            │
│ [+ Task] [Energy] [Focus]       │
├─────────────────────────────────┤
│ Bottom Nav (56px)               │
│ [Home][Habits][Goals][Stats]    │
└─────────────────────────────────┘
```

**Top Bar Specifications:**
- Height: 64px
- Padding: 16px horizontal
- Background: bg-primary with glassmorphic blur
- Shadow: subtle 0px 2px 8px rgba(0,0,0,0.1)

**Avatar + Stats:**
- Avatar: 40x40px circle
- Level badge: overlaid bottom-right
- XP counter: animates on change (spring physics)
- Tap: opens profile/stats modal

**Streak Counter:**
- Flame icon + number
- Color: green-500 (active), orange-500 (1 miss), red-500 (broken)
- Tap: shows streak history calendar

**Identity Statement Card:**
- Height: 80px minimum (auto-expands for long text)
- Padding: 16px
- Border-radius: 12px
- Background: gradient (blue-900 → blue-800)
- Text: Display 2 (36px, 700 weight)
- Vote counter below: "↑12 ↓3" (green/red indicators)
- Tap: opens Identity Builder modal

**Morning Control Widget:**
- Circular progress (120px diameter)
- Percentage in center (Display 1)
- 8 dots around perimeter (filled = completed)
- "3x XP ACTIVE" badge if 5+ completed
- Background: subtle glow if active
- Tap: opens morning ritual checklist

**Task Cards (Primary UI Element):**

```
┌─────────────────────────────────┐
│ ┌─┐ Clean home office     [9] 🔥│
│ │●│ Result: Focused workspace   │
│ └─┘ Purpose: Reduce distraction │
│     ────────────────── 75%      │
│     ⏱️ 90min • ⚡Peak energy    │
└─────────────────────────────────┘
```

**Card Anatomy:**
- Height: 88px minimum (expands for content)
- Padding: 16px
- Border-radius: 12px
- Background: slate-800 (dark mode)
- Border-left: 4px solid (leverage color)
  - Red (9-10): high leverage
  - Orange (7-8): medium leverage  
  - Blue (4-6): low leverage
  - Gray (1-3): minimal leverage

**Leverage Indicator:**
- Top-right corner
- Number in square badge
- Fire emoji if 9-10
- Glows subtly

**Progress Ring:**
- Left side of card
- 40x40px circle
- Stroke-width: 4px
- Animates on completion (0 → 100% over 600ms)

**Text Hierarchy:**
- Title: Body Large (18px, 600 weight)
- Result: Body Small (14px) with "Result:" label
- Purpose: Body Small (14px, italic) with "Purpose:" label
- Metadata: Caption (12px, secondary color)

**Interaction States:**

**Default:**
- Background: slate-800
- Border: transparent
- Shadow: none

**Hover (desktop):**
- Background: slate-750
- Border: blue-500 (1px)
- Shadow: 0px 4px 12px rgba(14, 165, 233, 0.2)
- Cursor: pointer
- 5-second countdown appears

**Pressed:**
- Background: slate-850
- Scale: 0.98
- Transition: 100ms ease-out

**Completed:**
- Background: green-900/20
- Border-left: green-500
- Checkmark overlays progress ring
- Opacity: 0.6
- Strike-through on title

**Swipe Gesture:**
- Threshold: 60% of card width
- Direction: right only (left = delete)
- Visual feedback: green glow follows finger
- Haptic: light impact at 30%, medium at 60%, heavy at trigger
- Confetti bursts from completion point
- XP counter animates immediately

**Quick Actions Bar:**
- Height: 60px
- Padding: 12px
- 3 buttons: Add Task, Energy Check-in, Start Focus
- Buttons: 44x44px minimum touch targets
- Icons: 24x24px
- Spacing: 16px between buttons

### 2. IDENTITY BUILDER MODAL

**Modal Structure:**
```
┌─────────────────────────────────┐
│ ← Who Are You Becoming?         │
├─────────────────────────────────┤
│                                 │
│ "I am a person who..."          │
│ ┌─────────────────────────────┐ │
│ │ [completes high-leverage]   │ │
│ │ [work in the morning]       │ │
│ └─────────────────────────────┘ │
│                                 │
│ Today's Votes:                  │
│ ✓ Meditated (FOR)               │
│ ✓ Completed Task 1 (FOR)        │
│ ✗ Skipped exercise (AGAINST)    │
│                                 │
│ Identity Alignment: 83%         │
│ ▓▓▓▓▓▓▓▓░░░░ (10 FOR, 2 AGAINST)│
│                                 │
│ [Evidence Builder]              │
│ "Proof I am this person..."     │
│ • 47-day morning streak         │
│ • 89% task completion rate      │
│ • Level 23 achievement          │
│                                 │
│ [Save] [Examples]               │
└─────────────────────────────────┘
```

**Design Specifications:**
- Full screen on mobile
- 600px max-width on desktop (centered)
- Background: slate-900 (dark mode)
- Close button: top-left (← back arrow)
- Padding: 24px

**Identity Input:**
- Large text area (18px font)
- Prefix: "I am a person who..." (fixed, gray)
- User completes the sentence
- Max length: 120 characters
- Auto-save on blur

**Vote Counter:**
- Real-time tracking
- Green checkmarks: actions FOR identity
- Red X marks: actions AGAINST identity
- Updates throughout day
- Tap each vote: shows context/time

**Alignment Meter:**
- Horizontal progress bar
- Percentage displayed prominently (Display 2)
- Color gradient: red → orange → green based on %
- Target line at 80%

**Evidence Builder:**
- Auto-populates from achievements
- User can add custom evidence
- Bullet list format
- Tap to see full details

### 3. TASK CREATION MODAL

**RPM + Four Laws Combined:**

```
┌─────────────────────────────────┐
│ ← Create High-Leverage Task     │
├─────────────────────────────────┤
│ RESULT (What outcome?)          │
│ ┌─────────────────────────────┐ │
│ │ Focused workspace           │ │
│ └─────────────────────────────┘ │
│                                 │
│ PURPOSE (Why does this matter?) │
│ ┌─────────────────────────────┐ │
│ │ Reduce distraction, improve │ │
│ │ deep work quality           │ │
│ └─────────────────────────────┘ │
│                                 │
│ MASSIVE ACTION (First step?)    │
│ ┌─────────────────────────────┐ │
│ │ Clear desk completely       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ─── Four Laws Optimization ───  │
│                                 │
│ OBVIOUS (When/where?)           │
│ ⏰ Tomorrow 9:00 AM              │
│ 📍 Home office                  │
│ [Set Implementation Intention]  │
│                                 │
│ ATTRACTIVE (Make it appealing)  │
│ Bundle with: [Listen to music] │
│ [Temptation Bundle +]           │
│                                 │
│ EASY (2-minute gateway?)        │
│ Gateway: "Pick up one item"     │
│ Friction score: ●●○○○ (2/5)     │
│ [Reduce Friction]               │
│                                 │
│ SATISFYING (Immediate reward?)  │
│ Reward: +150 XP                 │
│ Visual: Confetti + streak       │
│ [Add Custom Reward]             │
│                                 │
│ ─── Scoring ───                 │
│ Leverage: ●●●●●●●●●○ (9/10) 🔥  │
│ Energy needed: ⚡⚡○ (Peak)      │
│ Four Laws: 34/40 (85%) ✓        │
│                                 │
│ Identity check:                 │
│ ☑ Aligns with "I am a person   │
│   who completes high-leverage   │
│   work in the morning"          │
│                                 │
│ [Create Task] [Save Template]   │
└─────────────────────────────────┘
```

**Progressive Disclosure:**
- RPM section always visible (required)
- Four Laws section: tap to expand
- Scoring section: auto-calculated, always visible
- Advanced options: collapsed by default

**Field Validation:**
- Cannot save without Result + Purpose + Massive Action
- Four Laws optional but encouraged (shows score impact)
- Leverage score required (1-10)
- Energy level optional (defaults to "any")

**Smart Suggestions:**
- Based on past tasks
- Common templates available
- Time suggestions based on BPT data
- Location suggestions based on context

### 4. MORNING RITUAL CHECKLIST

```
┌─────────────────────────────────┐
│ Morning Sovereignty             │
│ 5/8 complete • 3x XP ACTIVE 🔥  │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ✓ Wake 6:00 AM              │ │
│ │   Streak: 47 days           │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Meditate (10 min)         │ │
│ │   Gateway: 2-min version ✓  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Movement (5 min)          │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Hydrate + breakfast       │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Journal (5 min)           │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ○ Vision review             │ │
│ │   Tap to open →             │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ○ Day design                │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ○ First win (30-90 min)     │ │
│ │   [Start Focus Block]       │ │
│ └─────────────────────────────┘ │
│                                 │
│ Morning Control Score: 87%      │
│ Last 30 days: ▓▓▓▓▓▓▓░▓▓...    │
└─────────────────────────────────┘
```

**Checklist Item States:**

**Completed (✓):**
- Green checkmark icon
- Green border-left (4px)
- Slightly dimmed
- Streak counter if applicable
- Timestamp shown (small text)

**Incomplete (○):**
- Gray circle icon
- Blue border-left when focused
- Full opacity
- Tap to complete immediately
- Long-press for options (skip, 2-min version)

**Skipped (⊘):**
- Orange warning icon
- Orange border-left
- "Never miss twice" warning if second skip
- Tap to un-skip

**Item Interaction:**
- Single tap: mark complete (with confirmation animation)
- Long-press: show options menu
  - Complete
  - Do 2-minute version
  - Skip today
  - Edit element
- Swipe right: complete
- Swipe left: skip

**Progress Indicator:**
- Top of screen
- X/8 complete
- Circular progress ring (large, centered)
- "3x XP ACTIVE" badge when 5+ complete
- Subtle pulsing glow when active

**Historical View:**
- Bottom section
- Sparkline graph: last 30 days
- Tap date: see that day's completion
- Streak counter: consecutive days with 5+

### 5. HABIT TRACKER (PRACTICES)

```
┌─────────────────────────────────┐
│ Daily Practices                 │
│ 12/15 complete today            │
├─────────────────────────────────┤
│ MORNING PRACTICES               │
│ ┌─────────────────────────────┐ │
│ │ ✓ Meditate            47🔥  │ │
│ │ ○○○○○○○ [Don't break chain]│ │
│ │ Identity: "I am mindful"    │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Exercise            89🔥  │ │
│ │ ○○○○○○○ Never miss twice!  │ │
│ └─────────────────────────────┘ │
│                                 │
│ AFTERNOON PRACTICES             │
│ ┌─────────────────────────────┐ │
│ │ ○ Deep work block            │
│ │   Best time: 2:00 PM         │
│ │   [Start Now] [Schedule]     │
│ └─────────────────────────────┘ │
│                                 │
│ EVENING PRACTICES               │
│ ┌─────────────────────────────┐ │
│ │ ○ Evening review              │
│ │   Usually done by: 8:00 PM   │
│ └─────────────────────────────┘ │
│                                 │
│ HABITS TO BREAK                 │
│ ┌─────────────────────────────┐ │
│ │ ✓ No phone in bedroom  23🔥 │ │
│ │ ○○○○○○○                     │ │
│ └─────────────────────────────┘ │
│                                 │
│ [+ Add Practice]                │
└─────────────────────────────────┘
```

**Habit Card Design:**
- Height: 72px minimum
- Visual chain: 7 circles (last 7 days)
- Current streak number with flame emoji
- Identity statement (if applicable)
- Tap: expand for details
- Swipe right: complete today
- Long-press: edit/options

**Chain Visualization:**
- 7 circles representing last 7 days
- Filled circle: completed
- Empty circle: missed
- Orange circle: skipped once (warning)
- Red X: missed twice (broken identity)

**Streak Counter:**
- Number + flame emoji
- Color: green (>7 days), orange (3-7), gray (<3)
- Animates on milestone (10, 25, 50, 100, 365 days)
- Confetti at major milestones

**Never Miss Twice Alert:**
- Appears when habit missed once
- Orange warning banner
- "Your [habit] streak is at risk!"
- Prominent action button: "Complete Now"
- Shows identity statement: "Remember: you are..."

**Habit Detail View (Tap to Expand):**
```
┌─────────────────────────────────┐
│ ← Meditate                      │
├─────────────────────────────────┤
│ Current streak: 47 days 🔥      │
│ Longest streak: 89 days         │
│ Completion rate: 94%            │
│                                 │
│ Identity:                       │
│ "I am a mindful person"         │
│                                 │
│ Four Laws Score: 38/40          │
│ ● Obvious: 10/10 ✓              │
│   Cue: Phone reminder 6:00 AM   │
│ ● Attractive: 9/10              │
│   Bundled with: Morning coffee  │
│ ● Easy: 10/10 ✓                 │
│   Gateway: 2-min version        │
│ ● Satisfying: 9/10              │
│   Reward: Immediate calm        │
│                                 │
│ History:                        │
│ [Calendar view of last 90 days] │
│                                 │
│ 1% Compound Trajectory:         │
│ [Graph showing improvement]     │
│                                 │
│ [Edit] [Archive] [Share]        │
└─────────────────────────────────┘
```

### 6. FOCUS BLOCK TIMER

```
┌─────────────────────────────────┐
│          FOCUS BLOCK            │
│                                 │
│          72:34                  │
│        remaining                │
│                                 │
│     ●●●●●●●●●●●●●●●●●●○○        │
│     90-minute deep work         │
│                                 │
│ Working on:                     │
│ "Complete quarterly report"     │
│                                 │
│ [Pause] [End Session]           │
│                                 │
│ ─────────────────────────       │
│                                 │
│ Distractions blocked:           │
│ ✓ Notifications off             │
│ ✓ Phone in other room           │
│ ✓ Do Not Disturb active         │
│                                 │
│ Environment:                    │
│ 🎵 Focus playlist playing        │
│ 📍 Office (door closed)          │
│                                 │
│ Streak: 12 consecutive blocks   │
└─────────────────────────────────┘
```

**Timer Display:**
- Fullscreen (or near-fullscreen)
- Minimal distractions
- Large time display (Display 1)
- Circular progress indicator
- Current task name visible

**40% Override Feature:**
- Triggers at 70 minutes (if 90-min block)
- Gentle alert: "Feeling done? You're at 40%"
- Options:
  - "Push Through" (Goggins mode)
  - "Take Break" (honor body signals)
- Cookie Jar quote if pushing through

**Post-Session Rating:**
```
┌─────────────────────────────────┐
│ Session Complete! +200 XP       │
├─────────────────────────────────┤
│ Focus Quality:                  │
│ ○ ○ ○ ○ ○                       │
│ Low ────────────── High         │
│                                 │
│ Did you hit the 40% wall?       │
│ [ ] Yes, pushed through         │
│ [ ] No, felt strong throughout  │
│ [ ] Yes, took break (wise)      │
│                                 │
│ Flow state?                     │
│ [Green (flowing)] [Red (forced)]│
│                                 │
│ Notes (optional):               │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Save + Close]                  │
└─────────────────────────────────┘
```

### 7. ANALYTICS DASHBOARD

```
┌─────────────────────────────────┐
│ This Week at a Glance           │
├─────────────────────────────────┤
│ ┌───────────────────────────┐   │
│ │ Morning Control    87%    │   │
│ │ ▓▓▓▓▓▓▓░ 6/7 days        │   │
│ └───────────────────────────┘   │
│ ┌───────────────────────────┐   │
│ │ Identity Alignment 83%    │   │
│ │ ↑12 votes FOR             │   │
│ │ ↓3 votes AGAINST          │   │
│ └───────────────────────────┘   │
│ ┌───────────────────────────┐   │
│ │ Leverage-Weighted Time    │   │
│ │ 7.8/10 avg                │   │
│ │ [Graph: daily leverage]   │   │
│ └───────────────────────────┘   │
│ ┌───────────────────────────┐   │
│ │ Habit Consistency  94%    │   │
│ │ 67/71 completed           │   │
│ └───────────────────────────┘   │
│                                 │
│ Your Season: Summer ☀️          │
│ (Building phase)                │
│                                 │
│ Insights:                       │
│ • Best energy: 9-11 AM          │
│ • Flow state: 67% this week     │
│ • Authenticity: 8.2/10 avg      │
│                                 │
│ [View Full Report] [Weekly Review]│
└─────────────────────────────────┘
```

**Metric Cards:**
- Consistent sizing (same height)
- Color-coded by status:
  - Green: target met (80%+)
  - Orange: approaching target (60-80%)
  - Red: below target (<60%)
- Tap to expand full details
- Sparkline graphs for trends

**Insights Section:**
- AI-generated observations
- Pattern recognition
- Actionable suggestions
- "Because you're in Summer season, consider..."

**Weekly Review Flow:**
```
┌─────────────────────────────────┐
│ Weekly Review (60 min)          │
├─────────────────────────────────┤
│ Step 1: Data Review (15 min)   │
│ [View metrics above]            │
│ [Next]                          │
│                                 │
│ Step 2: Reflect (15 min)        │
│ What went well?                 │
│ What could be better?           │
│ What did I learn?               │
│ [Next]                          │
│                                 │
│ Step 3: Season Check (10 min)  │
│ Current season: Summer          │
│ Does activity match? [Y/N]      │
│ Adjust expectations?            │
│ [Next]                          │
│                                 │
│ Step 4: Next Week (20 min)     │
│ Top 3 outcomes:                 │
│ 1. _______                      │
│ 2. _______                      │
│ 3. _______                      │
│ Maker/Manager allocation:       │
│ [Schedule template]             │
│ [Complete Review]               │
└─────────────────────────────────┘
```

---

## INTERACTION PATTERNS

### Micro-Interactions (The Magic)

**Task Completion Sequence:**
```
1. User swipes right on task card (60% threshold)
2. Card gains green glow (follows finger)
3. Haptic feedback: light (30%), medium (60%), heavy (trigger)
4. Card snaps to completed position (spring animation, 400ms)
5. Confetti bursts from completion point (3-5 particles, 800ms)
6. Checkmark animates onto progress ring (scale + rotate, 300ms)
7. XP counter increments (count-up animation, 600ms)
8. If identity-aligned: "+1 vote FOR [identity]" toast (2s)
9. If milestone (10th task today): bonus confetti + sound
10. Total time: <1000ms (feels instant)
```

**Haptic Feedback Guidelines:**
- Light impact: hover, minor actions
- Medium impact: button press, selection
- Heavy impact: completion, achievement
- Never on failure (no negative reinforcement)

**Animation Principles:**
- Spring physics (not linear easing)
- 60fps minimum (reduce complexity if needed)
- Respect reduced motion preference
- Stagger multiple elements (100ms offset)

**Loading States:**
- Skeleton screens (not spinners)
- Optimistic UI updates
- Background sync, foreground speed

### Gesture Vocabulary

**Universal Gestures:**
- Swipe right: complete/confirm
- Swipe left: delete/remove
- Long-press: options menu
- Pull down: refresh
- Pinch: zoom (on graphs)
- Double-tap: quick action (context-specific)

**Context-Specific:**
- Task cards: swipe right = complete
- Habit chain: tap day = see details
- Focus timer: long-press = 40% override prompt
- Calendar: swipe left/right = prev/next week

### Onboarding Flow

**"Play First, Profile Second" (Duolingo Approach)**

**Screen 1: Welcome (15 seconds)**
```
┌─────────────────────────────────┐
│                                 │
│      [Lifer Logo Animation]     │
│                                 │
│   The Greatest Life Control     │
│        System Ever Built        │
│                                 │
│    Built on principles from     │
│       18 influential minds      │
│                                 │
│         [Get Started]           │
│                                 │
└─────────────────────────────────┘
```

**Screen 2: First Win (45 seconds)**
```
┌─────────────────────────────────┐
│ Let's get your first win        │
├─────────────────────────────────┤
│ Complete ONE morning element:   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ○ Drink water               │ │
│ │   (Tap when done)           │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Swipe right to complete →]     │
│                                 │
└─────────────────────────────────┘

[User swipes]

┌─────────────────────────────────┐
│         🎉 +15 XP! 🎉           │
│                                 │
│    You just completed your      │
│     first morning element!      │
│                                 │
│        Level 1 → Level 2        │
│                                 │
│  This is how Lifer works:       │
│  Complete → Earn XP → Level Up  │
│                                 │
│         [Continue]              │
└─────────────────────────────────┘
```

**Screen 3: Identity Builder (60 seconds)**
```
┌─────────────────────────────────┐
│ Who are you becoming?           │
├─────────────────────────────────┤
│ This is the most important      │
│ question in Lifer.              │
│                                 │
│ Not "What do you want?"         │
│ But "WHO do you want to be?"    │
│                                 │
│ Complete this sentence:         │
│                                 │
│ "I am a person who..."          │
│ ┌─────────────────────────────┐ │
│ │ [completes high-leverage]   │ │
│ │ [work every morning]        │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Examples] [Continue]           │
└─────────────────────────────────┘
```

**Screen 4: Quick Tour (30 seconds, skippable)**
```
Interactive tutorial:
1. Swipe right to complete tasks
2. Tap for details
3. Your identity guides everything
4. Morning = 3x XP
[Skip] or auto-advances
```

**Screen 5: First Morning Ritual (60 seconds)**
```
┌─────────────────────────────────┐
│ Design your morning ritual      │
├─────────────────────────────────┤
│ Pick 3-8 elements:              │
│                                 │
│ ☑ Wake at same time            │
│ ☑ Meditate                     │
│ □ Exercise                     │
│ ☑ Journal                      │
│ □ Cold shower                  │
│ [+ Custom element]              │
│                                 │
│ Complete 5/8 = Morning Won      │
│ = 3x XP for the whole day!      │
│                                 │
│ [Done]                          │
└─────────────────────────────────┘
```

**Total Onboarding: 210 seconds (3.5 minutes)**
**First win achieved: Within 60 seconds**

### Notification Strategy

**Never Annoying, Always Helpful**

**Allowed Notifications:**
1. Morning ritual reminder (1x daily, user-set time)
2. Never miss twice alert (when habit at risk)
3. Focus block reminder (if scheduled)
4. Weekly review reminder (1x per week)
5. Milestone celebrations (Level up, streak milestone)

**Notification Design:**
- Always actionable
- Never vague ("Time to meditate" not "Don't forget!")
- Include quick action buttons
- Respect Do Not Disturb
- User can disable any category

**Example Notification:**
```
🔥 Meditation streak at risk!
You're at 1 miss. Don't break the chain.
[Do 2-min version] [Skip wisely] [Dismiss]
```

---

## RESPONSIVE DESIGN

### Mobile-First Breakpoints

```
Small phone:  320px - 375px
Phone:        376px - 768px   [PRIMARY TARGET]
Tablet:       769px - 1024px
Desktop:      1025px+
```

### Mobile Layout (320px+)

**Dashboard:**
- Single column
- Full-width cards
- Bottom navigation (56px)
- Top bar (64px)
- Content area: remaining height
- No sidebar

**Touch Targets:**
- Minimum: 44x44px (iOS HIG)
- Recommended: 48x48px
- Spacing: 8px minimum between targets

**Typography:**
- Scales appropriately
- Maintains readability
- No horizontal scrolling

### Tablet Layout (769px+)

**Dashboard:**
- Two-column grid for task cards
- Sidebar appears (240px)
- More content visible
- Same interactions as mobile

### Desktop Layout (1025px+)

**Dashboard:**
- Three-column grid for task cards
- Permanent sidebar (280px)
- Hover states enabled
- Keyboard shortcuts
- Max-width: 1440px (centered)

**Keyboard Shortcuts:**
```
N: New task
E: Energy check-in
F: Start focus block
W: Weekly review
/: Search
?: Show shortcuts
```

---

## ACCESSIBILITY

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text: 4.5:1 minimum
- Large text (24px+): 3:1 minimum
- UI components: 3:1 minimum

**Keyboard Navigation:**
- All interactive elements focusable
- Logical tab order
- Focus indicators (2px blue outline)
- Skip to main content link
- Escape to close modals

**Screen Reader Support:**
- Semantic HTML
- ARIA labels on all icons
- Live regions for dynamic content
- Form labels explicit
- Error messages announced

**Motion:**
- Respect prefers-reduced-motion
- Disable animations if set
- Maintain functionality without animation

**Text:**
- Resizable to 200% without breaking layout
- Minimum 16px base font size
- Proper heading hierarchy (h1 → h2 → h3)

### Testing Checklist

□ VoiceOver (iOS)
□ TalkBack (Android)
□ Color blindness simulator (all types)
□ Keyboard-only navigation
□ 200% zoom test
□ Reduced motion test
□ Touch target size verification

---

## PERFORMANCE REQUIREMENTS

### Core Web Vitals

**LCP (Largest Contentful Paint):**
- Target: <2.5s
- Strategy: Lazy load images, prioritize above-fold content

**FID (First Input Delay):**
- Target: <100ms
- Strategy: Minimize JavaScript, defer non-critical scripts

**CLS (Cumulative Layout Shift):**
- Target: <0.1
- Strategy: Reserve space for dynamic content, use aspect ratios

### Animation Performance

**60fps Minimum:**
- Use transform and opacity only (GPU-accelerated)
- Avoid layout thrashing
- Batch DOM reads and writes
- RequestAnimationFrame for animations

**Budget Android (3GB RAM, Snapdragon 600 series):**
- Must run smoothly
- Reduce particle count if needed
- Simplify animations if FPS drops

### Data Performance

**IndexedDB:**
- Indexed fields: id, created_at, leverage_score, identity_aligned
- Query optimization for large datasets
- Background sync when online

**Bundle Size:**
- Initial: <200KB (gzipped)
- Code splitting by route
- Lazy load non-critical components

---

## COMPONENT STATE MANAGEMENT

### Task Card States

```javascript
type TaskState = 
  | 'pending'      // Not started
  | 'in-progress'  // Focus timer active
  | 'completed'    // Done today
  | 'skipped'      // Intentionally skipped
  | 'overdue'      // Past scheduled time

type TaskPriority =
  | 'high'         // Leverage 9-10
  | 'medium'       // Leverage 7-8
  | 'low'          // Leverage 4-6
  | 'minimal'      // Leverage 1-3
```

### Habit States

```javascript
type HabitStatus =
  | 'active'       // Current streak, no misses
  | 'at-risk'      // Missed once (never miss twice warning)
  | 'broken'       // Missed twice, streak reset
  | 'paused'       // User-paused (doesn't count as miss)
  | 'archived'     // No longer tracking

type HabitStrength =
  | 'forming'      // 0-20 days
  | 'developing'   // 21-65 days
  | 'strong'       // 66-99 days
  | 'automatic'    // 100+ days
```

### Identity Alignment

```javascript
type IdentityVote = {
  action: string
  timestamp: Date
  direction: 'for' | 'against'
  context?: string
}

type IdentityScore = {
  today: number        // % aligned today
  week: number         // % aligned this week
  trajectory: number   // Trending up/down
  votes: IdentityVote[]
}
```

---

## ERROR STATES & EDGE CASES

### Empty States

**No Tasks Today:**
```
┌─────────────────────────────────┐
│   🎯 Ready for a fresh start    │
│                                 │
│   You have no tasks scheduled   │
│   for today.                    │
│                                 │
│   What high-leverage action     │
│   will you take?                │
│                                 │
│   [+ Create First Task]         │
└─────────────────────────────────┘
```

**No Habits Yet:**
```
┌─────────────────────────────────┐
│   🌱 Build your first habit     │
│                                 │
│   Habits compound.              │
│   Start with something tiny.    │
│                                 │
│   "I am a person who..."        │
│                                 │
│   [+ Add First Habit]           │
│   [Browse Templates]            │
└─────────────────────────────────┘
```

### Error States

**Offline:**
```
┌─────────────────────────────────┐
│   📡 Offline Mode               │
│                                 │
│   No internet connection.       │
│   All data saved locally.       │
│   Will sync when back online.   │
│                                 │
│   [Dismiss]                     │
└─────────────────────────────────┘
```

**Sync Error:**
```
┌─────────────────────────────────┐
│   ⚠️ Sync Failed                │
│                                 │
│   Couldn't sync your data.      │
│   Your local data is safe.      │
│                                 │
│   [Try Again] [View Details]    │
└─────────────────────────────────┘
```

### Loading States

**Use Skeleton Screens:**
```
┌─────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░           │
│ ▓▓▓▓░░░░░░░░░░░░░░░░           │
│                                 │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░         │
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░         │
└─────────────────────────────────┘
```

Not spinners. Skeleton shows structure, feels faster.

---

## PROGRESSIVE WEB APP (PWA)

### Installation Prompt

**Show After:**
- User completes 3 days successfully
- User has 5+ tasks completed
- User shows engagement

**Prompt Design:**
```
┌─────────────────────────────────┐
│   📱 Install Lifer              │
│                                 │
│   Add to home screen for:       │
│   • Faster access               │
│   • Offline support             │
│   • Full-screen experience      │
│                                 │
│   [Install] [Maybe Later]       │
└─────────────────────────────────┘
```

### Offline Support

**Cached:**
- App shell (HTML, CSS, JS)
- User data (IndexedDB)
- Critical assets

**Requires Online:**
- Initial sync
- Image uploads
- External integrations (future)

### App Manifest

```json
{
  "name": "Lifer - Life Control System",
  "short_name": "Lifer",
  "description": "Gamified life management built on 18 influential thinkers",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0ea5e9",
  "background_color": "#0f172a",
  "icons": [...]
}
```

---

## DESIGN SYSTEM MAINTENANCE

### Component Documentation

**Each Component Needs:**
- Visual example (screenshot)
- Code implementation
- Props/API documentation
- Accessibility notes
- Usage guidelines
- Do's and don'ts

### Design Tokens

**Version Control:**
- All tokens in JSON file
- Import to Figma (Tokens Studio)
- Import to code (CSS variables)
- Single source of truth

### Updates Process

1. Design in Figma
2. Update tokens JSON
3. Generate CSS variables
4. Update component library
5. Test in all breakpoints
6. Test accessibility
7. Deploy

---

## CONCLUSION: DESIGN PRINCIPLES SUMMARY

**1. Constraint Creates Focus**
Maximum 6 daily tasks. Forces prioritization.

**2. Environment Shapes Behavior**
Every pixel is intentional. Make good obvious, bad invisible.

**3. Immediate Satisfaction**
Sub-100ms response. Confetti. XP animation. Haptic feedback.

**4. Identity Reinforcement**
"I am a person who..." visible always. Every action = vote.

**5. Progressive Disclosure**
Show what's needed now. Hide complexity until requested.

**6. Accessibility First**
4.5:1 contrast. 44px touch targets. Screen reader tested.

**7. Performance Obsessed**
60fps. <2.5s LCP. Works on budget Android.

**8. Mobile-First**
Designed for phone. Enhanced for desktop.

**9. Offline-Capable**
PWA. IndexedDB. Works with zero connectivity.

**10. Never Annoying**
Minimal notifications. Always actionable. User controls all.

---

**This is Lifer UI/UX: The greatest personal life control system interface ever built.**
