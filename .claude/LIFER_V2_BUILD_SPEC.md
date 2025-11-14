# LIFER V2.0 - COMPLETE BUILD SPECIFICATION
## Single-File Build Guide for Claude Code

---

## CONTEXT: WHAT YOU'RE BUILDING

Lifer v2.0 is a gamified life management system. Current v1.0 has: Dashboard with XP/Levels, Streak tracking, Leverage ratio, Daily challenges, Practices with habit strength, Focus Timer, Weekly Review, Today's Status tracking.

**Tech Stack:** Svelte/React/Vue (check package.json), IndexedDB via idb-keyval, Tailwind CSS, Chart.js, Vite, GitHub Pages deployment.

**You're adding 7 major features in 7 days:**
1. Biological Prime Time energy tracking (trending productivity method)
2. 90-minute ultradian rhythm focus blocks (science-backed)
3. Pair Lifers couples mode with morning sync (killer feature)
4. Outcome trees visual goal mapping
5. Body doubling + 5 dynamic themes (COD, Cowboy, Professor, Cyberpunk, Zen)
6. AI task prioritization + personal analytics
7. Notion/GDrive integration + polish

---

## ALL DATA MODELS IN ONE PLACE

```typescript
interface UserProfile {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentStreak: number;
  bestStreak: number;
  morningWins: number;
  leverageRatio: number; // 0.0-10.0
  theme: 'military' | 'cowboy' | 'academic' | 'cyberpunk' | 'zen';
  coupleId?: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  leverageScore: number; // 1-10
  difficulty: number; // 1-10
  estimatedMinutes: number;
  category: string;
  outcomeId?: string;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
  xpAwarded: number;
  completedDuringBPT: boolean;
}

interface EnergyLog {
  id: string;
  timestamp: string;
  energy: number; // 1-10
  context: 'morning' | 'midday' | 'evening';
  notes?: string;
  completedTasksInLastHour: number;
}

interface BPTAnalysis {
  userId: string;
  dataPoints: number;
  peakWindow: { start: string; end: string; confidence: number };
  energyCurve: Array<{ hour: number; avgEnergy: number }>;
}

interface FocusSession {
  id: string;
  taskId: string;
  startTime: string;
  plannedDuration: number;
  actualDuration: number;
  interrupted: boolean;
  flowStateAchieved: boolean;
  breakQuality: number; // 1-5
  xpAwarded: number;
}

interface OutcomeNode {
  id: string;
  type: 'purpose' | 'outcome' | 'task';
  title: string;
  description: string;
  parentId?: string;
  childIds: string[];
  progress: number; // 0-100
  color: string;
  isActive: boolean;
  createdAt: string;
}

interface CouplesProfile {
  id: string;
  partner1Id: string;
  partner2Id: string;
  relationshipLevel: number;
  sharedXP: number;
  couplesStreak: number;
  sharedOutcomes: string[];
  sharedRewards: string[];
  createdAt: string;
}

interface MorningSync {
  id: string;
  coupleId: string;
  date: string;
  partner1Priorities: [string, string, string];
  partner2Priorities: [string, string, string];
  partner1Energy: number;
  partner2Energy: number;
  sharedSessionPlanned: boolean;
  sharedSessionTime?: string;
  sharedOutcome?: string;
  coupleReward?: string;
  completedSync: boolean;
}

interface CoupleReward {
  id: string;
  coupleId: string;
  name: string;
  description: string;
  category: 'quality_time' | 'intimate' | 'practical' | 'big_goal';
  xpCost: number;
  condition: string;
  isPrivate: boolean;
  createdBy: string;
  unlocked: boolean;
  redeemedAt?: string;
}

interface BodyDoublingSession {
  id: string;
  participants: [string, string];
  scheduledStart: string;
  actualStart: string;
  duration: number;
  tasksCompleted: { [userId: string]: number };
  focusQuality: { [userId: string]: number };
}
```

**IndexedDB Keys:**
- `'user'` → UserProfile
- `'tasks'` → Task[]
- `'energyLogs'` → EnergyLog[]
- `'bptAnalysis'` → BPTAnalysis
- `'focusSessions'` → FocusSession[]
- `'outcomeNodes'` → OutcomeNode[]
- `'couplesProfile'` → CouplesProfile
- `'morningSyncs'` → MorningSync[]
- `'coupleRewards'` → CoupleReward[]
- `'bodyDoublingSessions'` → BodyDoublingSession[]
- `'notionConnection'` → { token, databaseId, mappings }
- `'gdriveConnection'` → { token, folderId }
- `'userSettings'` → { theme, notifications, ... }

---

## DAY 1: BIOLOGICAL PRIME TIME

**Create 3 components:**

### EnergyLogger.jsx
```jsx
// src/features/energy/EnergyLogger.jsx
// PURPOSE: Log energy 3x daily for BPT calculation
// SHOWS: 1-10 slider with emojis, optional notes, mini today's graph
// STORES: IndexedDB 'energyLogs' key

import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

export default function EnergyLogger() {
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');
  const [todayLogs, setTodayLogs] = useState([]);
  
  const emojis = {
    1: '😴', 2: '😪', 3: '😕', 4: '😐', 5: '🙂',
    6: '😊', 7: '😄', 8: '⚡', 9: '🔥', 10: '🚀'
  };
  
  useEffect(() => {
    loadTodayLogs();
  }, []);
  
  async function loadTodayLogs() {
    const logs = await get('energyLogs') || [];
    const today = new Date().toISOString().split('T')[0];
    setTodayLogs(logs.filter(l => l.timestamp.startsWith(today)));
  }
  
  function getContext() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'midday';
    return 'evening';
  }
  
  async function saveLog() {
    const logs = await get('energyLogs') || [];
    const tasks = await get('tasks') || [];
    const recentTasks = tasks.filter(t => 
      t.completedAt && 
      new Date(t.completedAt) > new Date(Date.now() - 3600000)
    ).length;
    
    const log = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      energy,
      context: getContext(),
      notes,
      completedTasksInLastHour: recentTasks
    };
    
    logs.push(log);
    await set('energyLogs', logs);
    
    setNotes('');
    loadTodayLogs();
    
    // Check if 21 days reached
    if (logs.length >= 63) { // 21 days * 3 logs/day
      calculateBPT(logs);
    }
    
    alert(`Energy logged! ${emojis[energy]}`);
  }
  
  async function calculateBPT(logs) {
    // Group by hour
    const hourlyData = {};
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      if (!hourlyData[hour]) hourlyData[hour] = [];
      hourlyData[hour].push(log.energy);
    });
    
    // Calculate averages
    const hourlyAvg = Object.entries(hourlyData).map(([hour, energies]) => ({
      hour: parseInt(hour),
      avgEnergy: energies.reduce((a, b) => a + b) / energies.length
    }));
    
    // Find best 2-hour window
    let bestWindow = { start: 0, end: 0, avgEnergy: 0 };
    for (let i = 0; i < hourlyAvg.length - 1; i++) {
      const windowData = hourlyAvg.slice(i, i + 2);
      const windowAvg = windowData.reduce((sum, h) => sum + h.avgEnergy, 0) / 2;
      if (windowAvg > bestWindow.avgEnergy) {
        bestWindow = {
          start: windowData[0].hour,
          end: windowData[windowData.length - 1].hour + 1,
          avgEnergy: windowAvg
        };
      }
    }
    
    const overallAvg = hourlyAvg.reduce((sum, h) => sum + h.avgEnergy, 0) / hourlyAvg.length;
    const confidence = Math.min(100, Math.round(((bestWindow.avgEnergy - overallAvg) / overallAvg) * 100));
    
    await set('bptAnalysis', {
      userId: 'current',
      dataPoints: logs.length,
      peakWindow: {
        start: `${bestWindow.start.toString().padStart(2, '0')}:00`,
        end: `${bestWindow.end.toString().padStart(2, '0')}:00`,
        confidence
      },
      energyCurve: hourlyAvg
    });
  }
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Log Your Energy</h2>
      
      <div className="mb-6">
        <div className="text-6xl text-center mb-4">{emojis[energy]}</div>
        <input
          type="range"
          min="1"
          max="10"
          value={energy}
          onChange={e => setEnergy(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-2">
          <span>Exhausted</span>
          <span>Peak Energy</span>
        </div>
      </div>
      
      <input
        type="text"
        placeholder="What are you working on? (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="w-full p-2 bg-slate-700 rounded mb-4"
      />
      
      <button 
        onClick={saveLog}
        className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded"
      >
        Save Energy Log
      </button>
      
      {todayLogs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg mb-2">Today's Energy</h3>
          <div className="flex gap-2">
            {todayLogs.map(log => (
              <div key={log.id} className="text-2xl">{emojis[log.energy]}</div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-sm text-slate-400">
        Day {Math.floor((await get('energyLogs') || []).length / 3)}/21 for BPT analysis
      </div>
    </div>
  );
}
```

### BPTAnalysis.jsx
```jsx
// src/features/energy/BPTAnalysis.jsx
// PURPOSE: Show BPT after 21 days of data
// DISPLAYS: Energy curve chart, peak window, correlation stats
// REQUIRES: Chart.js already in project

import { useEffect, useState } from 'react';
import { get } from 'idb-keyval';
import { Line } from 'react-chartjs-2';

export default function BPTAnalysis() {
  const [bptData, setBptData] = useState(null);
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  async function loadData() {
    const analysis = await get('bptAnalysis');
    const energyLogs = await get('energyLogs') || [];
    setBptData(analysis);
    setLogs(energyLogs);
  }
  
  if (!bptData || logs.length < 63) {
    const daysComplete = Math.floor(logs.length / 3);
    return (
      <div className="p-6 bg-slate-800 rounded-lg">
        <h2 className="text-2xl mb-4">Biological Prime Time Analysis</h2>
        <div className="mb-4">
          <div className="bg-slate-700 h-4 rounded overflow-hidden">
            <div 
              className="bg-blue-500 h-full"
              style={{ width: `${(daysComplete / 21) * 100}%` }}
            />
          </div>
          <p className="text-sm mt-2">Day {daysComplete}/21 - Keep logging!</p>
        </div>
        <p className="text-slate-400">
          Log your energy 3x daily for 21 days to discover your peak productivity hours.
        </p>
      </div>
    );
  }
  
  const chartData = {
    labels: bptData.energyCurve.map(d => `${d.hour}:00`),
    datasets: [{
      label: 'Average Energy',
      data: bptData.energyCurve.map(d => d.avgEnergy),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Your Biological Prime Time</h2>
      
      <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mb-6">
        <div className="text-4xl mb-2">🎯</div>
        <h3 className="text-xl mb-2">
          {bptData.peakWindow.start} - {bptData.peakWindow.end}
        </h3>
        <p className="text-sm text-slate-300">
          {bptData.peakWindow.confidence}% confidence based on your patterns
        </p>
      </div>
      
      <Line data={chartData} options={{
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { min: 0, max: 10 }
        }
      }} />
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-slate-700 p-4 rounded">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-sm text-slate-400">High Energy (7+)</p>
          <p className="text-xl">4.2 tasks/hour</p>
        </div>
        <div className="bg-slate-700 p-4 rounded">
          <div className="text-2xl mb-2">😴</div>
          <p className="text-sm text-slate-400">Low Energy (&lt;4)</p>
          <p className="text-xl">1.1 tasks/hour</p>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-slate-400">
        💡 Schedule high-leverage tasks during your BPT for 2x XP
      </div>
    </div>
  );
}
```

### Integrate BPT into Task System
```jsx
// Add to existing task completion function
async function completeTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  const bptAnalysis = await get('bptAnalysis');
  
  // Check if in BPT window
  let inBPT = false;
  if (bptAnalysis) {
    const now = new Date();
    const currentHour = now.getHours();
    const bptStart = parseInt(bptAnalysis.peakWindow.start.split(':')[0]);
    const bptEnd = parseInt(bptAnalysis.peakWindow.end.split(':')[0]);
    inBPT = currentHour >= bptStart && currentHour < bptEnd;
  }
  
  // Calculate XP with BPT multiplier
  const baseXP = task.leverageScore * 10;
  const multiplier = inBPT ? 2 : 1;
  const xpAwarded = baseXP * multiplier;
  
  task.completed = true;
  task.completedAt = new Date().toISOString();
  task.completedDuringBPT = inBPT;
  task.xpAwarded = xpAwarded;
  
  // Update user XP
  const user = await get('user');
  user.xp += xpAwarded;
  if (user.xp >= user.xpToNextLevel) {
    user.level++;
    user.xp = 0;
    user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
  }
  await set('user', user);
  
  // Save tasks
  const allTasks = await get('tasks');
  const index = allTasks.findIndex(t => t.id === taskId);
  allTasks[index] = task;
  await set('tasks', allTasks);
  
  if (inBPT) {
    alert(`Task completed! +${xpAwarded} XP (2x BPT bonus! 🔥)`);
  }
}
```

---

## DAY 2: 90-MINUTE ULTRADIAN FOCUS

### UltradianTimer.jsx
```jsx
// src/features/focus/UltradianTimer.jsx
// PURPOSE: 90-minute deep work blocks with mandatory breaks
// TRACKS: Flow state (30+ min), break quality, session stats

import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

const TIMER_MODES = {
  ULTRADIAN: { work: 90, break: 20, name: 'Deep Work (90+20)' },
  STANDARD: { work: 50, break: 10, name: 'Standard (50+10)' },
  SPRINT: { work: 25, break: 5, name: 'Sprint (25+5)' }
};

export default function UltradianTimer() {
  const [mode, setMode] = useState('ULTRADIAN');
  const [phase, setPhase] = useState('idle'); // 'idle' | 'work' | 'break'
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [flowAchieved, setFlowAchieved] = useState(false);
  const [breakQuality, setBreakQuality] = useState(0);
  
  useEffect(() => {
    if (phase === 'idle') return;
    
    const timer = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 0) {
          handlePhaseEnd();
          return 0;
        }
        
        // Check for flow state at 30 min
        if (phase === 'work' && s === (TIMER_MODES[mode].work - 30) * 60) {
          setFlowAchieved(true);
          alert('🔥 Flow State Detected! +25 XP bonus');
        }
        
        return s - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [phase, mode]);
  
  function startWork() {
    setPhase('work');
    setSecondsLeft(TIMER_MODES[mode].work * 60);
    setSessionStart(Date.now());
    setFlowAchieved(false);
    
    // Lock task
    if (selectedTask) {
      lockTask(selectedTask.id);
    }
  }
  
  function handlePhaseEnd() {
    if (phase === 'work') {
      saveSession();
      setPhase('break');
      setSecondsLeft(TIMER_MODES[mode].break * 60);
      
      // Unlock task during break
      if (selectedTask) {
        unlockTask(selectedTask.id);
      }
    } else {
      // Break ended
      setPhase('idle');
      alert('Break over! Ready for another session?');
    }
  }
  
  async function saveSession() {
    const sessions = await get('focusSessions') || [];
    const actualDuration = Math.floor((Date.now() - sessionStart) / 60000);
    
    const session = {
      id: Date.now().toString(),
      taskId: selectedTask?.id || 'none',
      startTime: new Date(sessionStart).toISOString(),
      plannedDuration: TIMER_MODES[mode].work,
      actualDuration,
      interrupted: actualDuration < TIMER_MODES[mode].work * 0.9,
      flowStateAchieved: flowAchieved,
      breakQuality: 0, // Will be rated after break
      xpAwarded: flowAchieved ? 125 : 100
    };
    
    sessions.push(session);
    await set('focusSessions', sessions);
    
    // Award XP
    const user = await get('user');
    user.xp += session.xpAwarded;
    await set('user', user);
  }
  
  async function rateBreak(quality) {
    setBreakQuality(quality);
    const sessions = await get('focusSessions') || [];
    if (sessions.length > 0) {
      sessions[sessions.length - 1].breakQuality = quality;
      await set('focusSessions', sessions);
    }
  }
  
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Ultradian Focus Timer</h2>
      
      {phase === 'idle' && (
        <>
          <div className="flex gap-2 mb-6">
            {Object.keys(TIMER_MODES).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 p-3 rounded ${
                  mode === m ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              >
                {TIMER_MODES[m].name}
              </button>
            ))}
          </div>
          
          <button
            onClick={startWork}
            className="w-full bg-green-500 hover:bg-green-600 p-4 rounded text-xl"
          >
            Start {TIMER_MODES[mode].work} Min Focus Block
          </button>
        </>
      )}
      
      {phase === 'work' && (
        <div className="text-center">
          <div className="text-6xl font-bold mb-4">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-lg mb-4">🎯 Focus Time</div>
          {selectedTask && (
            <div className="bg-slate-700 p-3 rounded mb-4">
              Working on: {selectedTask.title}
            </div>
          )}
          {flowAchieved && (
            <div className="bg-orange-900/30 border border-orange-500 p-3 rounded mb-4">
              🔥 Flow State Active!
            </div>
          )}
          <button
            onClick={() => setPhase('idle')}
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded"
          >
            End Early (-50 XP)
          </button>
        </div>
      )}
      
      {phase === 'break' && (
        <div className="text-center">
          <div className="text-6xl font-bold mb-4">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-lg mb-4">☕ Break Time</div>
          
          <div className="bg-slate-700 p-4 rounded mb-4">
            <p className="mb-2">Suggested activities:</p>
            <div className="text-2xl">🚶 💧 👀 🧘</div>
            <p className="text-sm mt-2">Walk • Water • Eyes closed • Stretch</p>
          </div>
          
          {secondsLeft < (TIMER_MODES[mode].break * 60 - 300) && (
            <div className="mb-4">
              <p className="mb-2">How was your break?</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => rateBreak(n)}
                    className={`text-2xl ${breakQuality === n ? 'scale-125' : ''}`}
                  >
                    {'⭐'.repeat(n)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## DAY 3: PAIR LIFERS COUPLES MODE

### PairSetup.jsx + MorningSync.jsx + CoupleRewards.jsx
```jsx
// src/features/couples/CouplesSystem.jsx
// PURPOSE: Complete couples mode - pairing, morning sync, rewards
// KILLER FEATURE: 5-minute daily morning sync ritual

import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

function PairSetup() {
  const [myCode, setMyCode] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  
  useEffect(() => {
    generateMyCode();
  }, []);
  
  function generateMyCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMyCode(code);
  }
  
  async function connectPartner() {
    // Simulate connection - in real app, this would use backend
    const couplesProfile = {
      id: Date.now().toString(),
      partner1Id: 'user1',
      partner2Id: 'user2',
      relationshipLevel: 1,
      sharedXP: 0,
      couplesStreak: 0,
      sharedOutcomes: [],
      sharedRewards: [],
      createdAt: new Date().toISOString()
    };
    
    await set('couplesProfile', couplesProfile);
    alert('🎉 You\'re paired! Start your first morning sync tomorrow.');
  }
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Connect with Your Partner</h2>
      
      <div className="mb-6">
        <p className="text-sm text-slate-400 mb-2">Your invite code:</p>
        <div className="bg-slate-700 p-4 rounded text-center">
          <div className="text-3xl font-bold tracking-widest">{myCode}</div>
        </div>
        <button className="w-full mt-2 bg-slate-700 p-2 rounded">
          Copy Link
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-slate-400 mb-2">Enter partner's code:</p>
        <input
          type="text"
          value={partnerCode}
          onChange={e => setPartnerCode(e.target.value.toUpperCase())}
          placeholder="ABC123"
          className="w-full p-3 bg-slate-700 rounded text-center text-2xl tracking-widest"
          maxLength={6}
        />
      </div>
      
      <button
        onClick={connectPartner}
        disabled={partnerCode.length !== 6}
        className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded disabled:opacity-50"
      >
        Connect
      </button>
    </div>
  );
}

function MorningSync() {
  const [step, setStep] = useState(1);
  const [myPriorities, setMyPriorities] = useState(['', '', '']);
  const [myEnergy, setMyEnergy] = useState(5);
  const [partnerData, setPartnerData] = useState(null);
  
  async function submitSync() {
    const couple = await get('couplesProfile');
    const sync = {
      id: Date.now().toString(),
      coupleId: couple.id,
      date: new Date().toISOString().split('T')[0],
      partner1Priorities: myPriorities,
      partner2Priorities: ['Task A', 'Task B', 'Task C'], // Simulated
      partner1Energy: myEnergy,
      partner2Energy: 7, // Simulated
      sharedSessionPlanned: false,
      completedSync: true
    };
    
    const syncs = await get('morningSyncs') || [];
    syncs.push(sync);
    await set('morningSyncs', syncs);
    
    // Update streak
    couple.couplesStreak++;
    couple.sharedXP += 50;
    await set('couplesProfile', couple);
    
    alert('✅ Morning sync complete! +50 Couple XP');
  }
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Morning Sync ☀️</h2>
      
      {step === 1 && (
        <>
          <p className="mb-4">What are your top 3 priorities today?</p>
          {[0, 1, 2].map(i => (
            <input
              key={i}
              type="text"
              placeholder={`Priority ${i + 1}`}
              value={myPriorities[i]}
              onChange={e => {
                const newP = [...myPriorities];
                newP[i] = e.target.value;
                setMyPriorities(newP);
              }}
              className="w-full p-3 bg-slate-700 rounded mb-2"
            />
          ))}
          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-500 p-3 rounded mt-4"
          >
            Continue
          </button>
        </>
      )}
      
      {step === 2 && (
        <>
          <p className="mb-4">How's your energy today?</p>
          <input
            type="range"
            min="1"
            max="10"
            value={myEnergy}
            onChange={e => setMyEnergy(parseInt(e.target.value))}
            className="w-full mb-2"
          />
          <div className="text-center text-4xl mb-4">
            {myEnergy >= 7 ? '⚡' : myEnergy >= 4 ? '😊' : '😴'}
          </div>
          <button
            onClick={() => setStep(3)}
            className="w-full bg-blue-500 p-3 rounded"
          >
            Continue
          </button>
        </>
      )}
      
      {step === 3 && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700 p-4 rounded">
              <h3 className="font-bold mb-2">Your Priorities</h3>
              <ol className="text-sm">
                {myPriorities.map((p, i) => (
                  <li key={i}>{i + 1}. {p}</li>
                ))}
              </ol>
              <div className="mt-2">Energy: {myEnergy}/10</div>
            </div>
            <div className="bg-slate-700 p-4 rounded opacity-75">
              <h3 className="font-bold mb-2">Partner's Priorities</h3>
              <ol className="text-sm">
                <li>1. Task A</li>
                <li>2. Task B</li>
                <li>3. Task C</li>
              </ol>
              <div className="mt-2">Energy: 7/10</div>
            </div>
          </div>
          
          <div className="bg-blue-900/30 border border-blue-500 p-4 rounded mb-4">
            <p className="text-sm">💡 You're high energy, partner is moderate.</p>
            <p className="text-sm">Consider: You tackle big tasks, partner handles admin?</p>
          </div>
          
          <button
            onClick={submitSync}
            className="w-full bg-green-500 hover:bg-green-600 p-3 rounded"
          >
            Complete Sync (+50 XP)
          </button>
        </>
      )}
    </div>
  );
}

function CoupleRewards() {
  const [rewards, setRewards] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    category: 'quality_time',
    xpCost: 500,
    isPrivate: false
  });
  
  useEffect(() => {
    loadRewards();
  }, []);
  
  async function loadRewards() {
    const r = await get('coupleRewards') || [];
    setRewards(r);
  }
  
  async function createReward() {
    const couple = await get('couplesProfile');
    const reward = {
      ...newReward,
      id: Date.now().toString(),
      coupleId: couple.id,
      createdBy: 'user1',
      unlocked: false,
      redeemedAt: null
    };
    
    const r = await get('coupleRewards') || [];
    r.push(reward);
    await set('coupleRewards', r);
    
    setCreating(false);
    loadRewards();
  }
  
  if (creating) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg">
        <h2 className="text-2xl mb-4">Create Couple Reward</h2>
        
        <input
          placeholder="Reward name"
          value={newReward.name}
          onChange={e => setNewReward({...newReward, name: e.target.value})}
          className="w-full p-3 bg-slate-700 rounded mb-4"
        />
        
        <select
          value={newReward.category}
          onChange={e => setNewReward({...newReward, category: e.target.value})}
          className="w-full p-3 bg-slate-700 rounded mb-4"
        >
          <option value="quality_time">🎬 Quality Time</option>
          <option value="intimate">💕 Intimate</option>
          <option value="practical">🏠 Practical</option>
          <option value="big_goal">✈️ Big Goal</option>
        </select>
        
        <div className="mb-4">
          <label className="block text-sm mb-2">XP Cost: {newReward.xpCost}</label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={newReward.xpCost}
            onChange={e => setNewReward({...newReward, xpCost: parseInt(e.target.value)})}
            className="w-full"
          />
        </div>
        
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={newReward.isPrivate}
            onChange={e => setNewReward({...newReward, isPrivate: e.target.checked})}
          />
          <span>Make private (only you see details)</span>
        </label>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCreating(false)}
            className="flex-1 bg-slate-700 p-3 rounded"
          >
            Cancel
          </button>
          <button
            onClick={createReward}
            className="flex-1 bg-blue-500 p-3 rounded"
          >
            Create
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Couple Rewards</h2>
      
      <button
        onClick={() => setCreating(true)}
        className="w-full bg-blue-500 p-3 rounded mb-4"
      >
        + Add Reward
      </button>
      
      <div className="space-y-3">
        {rewards.map(r => (
          <div key={r.id} className="bg-slate-700 p-4 rounded">
            <h3 className="font-bold">{r.isPrivate ? '🔒 Private Reward' : r.name}</h3>
            <p className="text-sm text-slate-400">{r.xpCost} Couple XP</p>
            {r.unlocked && (
              <button className="mt-2 bg-green-500 px-4 py-2 rounded text-sm">
                Redeem Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export { PairSetup, MorningSync, CoupleRewards };
```

---

## DAY 4: OUTCOME TREES

```jsx
// src/features/outcomes/OutcomeTree.jsx
// PURPOSE: Visual hierarchy: Purpose → Outcomes → Tasks
// USES: Simple canvas or div-based layout (React Flow adds complexity)

import { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

export default function OutcomeTree() {
  const [nodes, setNodes] = useState([]);
  const [adding, setAdding] = useState(null);
  
  useEffect(() => {
    loadNodes();
  }, []);
  
  async function loadNodes() {
    const n = await get('outcomeNodes') || [];
    setNodes(n);
    calculateAllProgress(n);
  }
  
  function calculateAllProgress(nodeList) {
    // Calculate progress bottom-up
    const updated = nodeList.map(node => ({
      ...node,
      progress: calcProgress(node, nodeList)
    }));
    setNodes(updated);
  }
  
  function calcProgress(node, allNodes) {
    if (node.type === 'task') {
      const tasks = await get('tasks') || [];
      const task = tasks.find(t => t.id === node.id);
      return task?.completed ? 100 : 0;
    }
    
    const children = allNodes.filter(n => n.parentId === node.id);
    if (children.length === 0) return 0;
    
    const total = children.reduce((sum, child) => 
      sum + calcProgress(child, allNodes), 0
    );
    return Math.round(total / children.length);
  }
  
  async function addNode(type) {
    const node = {
      id: Date.now().toString(),
      type,
      title: '',
      description: '',
      parentId: null,
      childIds: [],
      progress: 0,
      color: '#3b82f6',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    setAdding(node);
  }
  
  async function saveNode(node) {
    const allNodes = await get('outcomeNodes') || [];
    allNodes.push(node);
    await set('outcomeNodes', allNodes);
    setAdding(null);
    loadNodes();
  }
  
  const purposes = nodes.filter(n => n.type === 'purpose');
  const outcomes = nodes.filter(n => n.type === 'outcome');
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Outcome Trees</h2>
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => addNode('purpose')}
          className="bg-purple-500 px-4 py-2 rounded"
        >
          + Purpose
        </button>
        <button
          onClick={() => addNode('outcome')}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          + Outcome
        </button>
      </div>
      
      {adding && (
        <div className="bg-slate-700 p-4 rounded mb-4">
          <h3 className="font-bold mb-2">New {adding.type}</h3>
          <input
            placeholder="Title"
            value={adding.title}
            onChange={e => setAdding({...adding, title: e.target.value})}
            className="w-full p-2 bg-slate-600 rounded mb-2"
          />
          <textarea
            placeholder="Description"
            value={adding.description}
            onChange={e => setAdding({...adding, description: e.target.value})}
            className="w-full p-2 bg-slate-600 rounded mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setAdding(null)}
              className="flex-1 bg-slate-600 p-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => saveNode(adding)}
              className="flex-1 bg-blue-500 p-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {purposes.map(purpose => (
          <div key={purpose.id} className="border-l-4 border-purple-500 pl-4">
            <div className="bg-purple-900/20 p-4 rounded mb-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">🎯 {purpose.title}</h3>
                <div className="text-sm">{purpose.progress}%</div>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded mt-2">
                <div
                  className="bg-purple-500 h-full rounded"
                  style={{ width: `${purpose.progress}%` }}
                />
              </div>
            </div>
            
            {outcomes.filter(o => o.parentId === purpose.id).map(outcome => (
              <div key={outcome.id} className="ml-6 bg-blue-900/20 p-3 rounded mb-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">📊 {outcome.title}</h4>
                  <div className="text-sm">{outcome.progress}%</div>
                </div>
                <div className="w-full bg-slate-700 h-1 rounded mt-1">
                  <div
                    className="bg-blue-500 h-full rounded"
                    style={{ width: `${outcome.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## DAY 5: BODY DOUBLING + THEMES

```jsx
// src/features/social/BodyDoubling.jsx + ThemeSelector.jsx
// SIMPLIFIED: Body doubling invite system + theme switcher

function BodyDoubling() {
  const [friends, setFriends] = useState([]);
  const [session, setSession] = useState(null);
  
  async function startSession(friendId) {
    const s = {
      id: Date.now().toString(),
      participants: ['user1', friendId],
      scheduledStart: new Date().toISOString(),
      actualStart: new Date().toISOString(),
      duration: 90,
      tasksCompleted: {},
      focusQuality: {}
    };
    
    setSession(s);
    alert('Session started with friend!');
  }
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Body Doubling</h2>
      
      {!session ? (
        <>
          <p className="text-slate-400 mb-4">
            Work silently alongside a friend for accountability
          </p>
          <button className="bg-blue-500 w-full p-3 rounded mb-4">
            + Add Friend
          </button>
          
          <div className="space-y-2">
            <div className="bg-slate-700 p-3 rounded flex justify-between items-center">
              <div>
                <div className="font-bold">Sarah</div>
                <div className="text-sm text-green-400">🟢 Online</div>
              </div>
              <button
                onClick={() => startSession('sarah')}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Invite
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-4">⏱️</div>
          <div className="text-2xl mb-2">Focus Session Active</div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700 p-4 rounded">
              <div className="font-bold">You</div>
              <div className="text-sm mt-2">Working on Task A</div>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <div className="font-bold">Sarah</div>
              <div className="text-sm mt-2">Working on Task B</div>
            </div>
          </div>
          <button
            onClick={() => setSession(null)}
            className="bg-red-500 px-6 py-2 rounded"
          >
            End Session
          </button>
        </div>
      )}
    </div>
  );
}

// THEME SYSTEM
const THEMES = {
  military: {
    colors: { primary: '#1a4d2e', secondary: '#243e36' },
    labels: { xp: 'Combat Points', level: 'Rank', tasks: 'Missions' },
    icon: '🎖️'
  },
  cowboy: {
    colors: { primary: '#8b4513', secondary: '#d2691e' },
    labels: { xp: 'Honor Points', level: 'Renown', tasks: 'Bounties' },
    icon: '🤠'
  },
  academic: {
    colors: { primary: '#1e3a5f', secondary: '#3d5a80' },
    labels: { xp: 'Research Credits', level: 'Rank', tasks: 'Assignments' },
    icon: '🎓'
  },
  cyberpunk: {
    colors: { primary: '#ff006e', secondary: '#00f5ff' },
    labels: { xp: 'Street Cred', level: 'Clearance', tasks: 'Exploits' },
    icon: '🤖'
  },
  zen: {
    colors: { primary: '#2d6a4f', secondary: '#52b788' },
    labels: { xp: 'Life Force', level: 'Growth Stage', tasks: 'Practices' },
    icon: '🌱'
  }
};

function ThemeSelector() {
  const [theme, setTheme] = useState('military');
  
  async function changeTheme(newTheme) {
    setTheme(newTheme);
    const settings = await get('userSettings') || {};
    settings.theme = newTheme;
    await set('userSettings', settings);
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--primary', THEMES[newTheme].colors.primary);
    document.documentElement.style.setProperty('--secondary', THEMES[newTheme].colors.secondary);
    
    alert(`Theme changed to ${newTheme}!`);
  }
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Choose Your Theme</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => changeTheme(key)}
            className={`p-4 rounded border-2 ${
              theme === key ? 'border-blue-500' : 'border-slate-700'
            }`}
          >
            <div className="text-4xl mb-2">{t.icon}</div>
            <div className="font-bold capitalize">{key}</div>
            <div className="text-sm text-slate-400">{t.labels.xp}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export { BodyDoubling, ThemeSelector };
```

---

## DAY 6: AI PRIORITIZATION + ANALYTICS

```jsx
// src/features/ai/TaskPrioritizer.jsx
// PURPOSE: "What should I work on?" button with smart algorithm

export default function TaskPrioritizer() {
  const [suggestion, setSuggestion] = useState(null);
  
  async function getPrioritization() {
    const tasks = await get('tasks') || [];
    const bpt = await get('bptAnalysis');
    const currentHour = new Date().getHours();
    const energyLogs = await get('energyLogs') || [];
    
    // Get latest energy
    const recentLog = energyLogs[energyLogs.length - 1];
    const currentEnergy = recentLog?.energy || 5;
    
    // Check if in BPT
    let inBPT = false;
    if (bpt) {
      const bptStart = parseInt(bpt.peakWindow.start.split(':')[0]);
      const bptEnd = parseInt(bpt.peakWindow.end.split(':')[0]);
      inBPT = currentHour >= bptStart && currentHour < bptEnd;
    }
    
    // Score tasks
    const scored = tasks.filter(t => !t.completed).map(task => {
      let score = 0;
      
      // Leverage (40%)
      score += task.leverageScore * 4;
      
      // Deadline (25%)
      if (task.deadline) {
        const daysUntil = Math.ceil(
          (new Date(task.deadline) - new Date()) / 86400000
        );
        if (daysUntil <= 1) score += 25;
        else if (daysUntil <= 3) score += 15;
        else if (daysUntil <= 7) score += 5;
      }
      
      // Energy match (20%)
      if (currentEnergy >= 7 && task.difficulty >= 7) score += 20;
      if (currentEnergy <= 4 && task.difficulty <= 4) score += 20;
      
      // Time available (15%)
      if (task.estimatedMinutes <= 60) score += 15;
      
      return { task, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    const top = scored[0];
    
    const reasons = [];
    if (top.task.leverageScore >= 7) reasons.push('✓ High leverage');
    if (inBPT) reasons.push('✓ You\'re in your BPT window');
    if (currentEnergy >= 7) reasons.push('✓ High energy right now');
    
    setSuggestion({
      task: top.task,
      reasons,
      confidence: Math.min(100, Math.round(top.score))
    });
  }
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">AI Task Prioritization</h2>
      
      <button
        onClick={getPrioritization}
        className="w-full bg-blue-500 hover:bg-blue-600 p-4 rounded text-lg mb-4"
      >
        🎯 What should I work on next?
      </button>
      
      {suggestion && (
        <div className="bg-slate-700 p-4 rounded">
          <h3 className="text-xl font-bold mb-2">{suggestion.task.title}</h3>
          
          <div className="mb-3">
            <div className="text-sm text-slate-400 mb-1">Why now?</div>
            {suggestion.reasons.map((r, i) => (
              <div key={i} className="text-sm">{r}</div>
            ))}
          </div>
          
          <div className="text-sm text-slate-400 mb-3">
            {suggestion.confidence}% confident this is optimal
          </div>
          
          <button className="w-full bg-green-500 p-3 rounded">
            Start Now
          </button>
        </div>
      )}
    </div>
  );
}
```

```jsx
// src/features/analytics/PersonalAnalytics.jsx
// PURPOSE: Show patterns, correlations, insights

export default function PersonalAnalytics() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    calculateStats();
  }, []);
  
  async function calculateStats() {
    const tasks = await get('tasks') || [];
    const energyLogs = await get('energyLogs') || [];
    const sessions = await get('focusSessions') || [];
    
    // Calculate averages
    const completedTasks = tasks.filter(t => t.completed);
    const avgLeverage = completedTasks.reduce((sum, t) => 
      sum + t.leverageScore, 0) / completedTasks.length;
    
    const flowSessions = sessions.filter(s => s.flowStateAchieved);
    const flowRate = (flowSessions.length / sessions.length) * 100;
    
    setStats({
      avgLeverage: avgLeverage.toFixed(1),
      flowRate: flowRate.toFixed(0),
      totalTasks: completedTasks.length,
      avgEnergy: (energyLogs.reduce((sum, l) => 
        sum + l.energy, 0) / energyLogs.length).toFixed(1)
    });
  }
  
  if (!stats) return <div>Loading...</div>;
  
  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h2 className="text-2xl mb-4">Personal Analytics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700 p-4 rounded">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-sm text-slate-400">Avg Leverage</div>
          <div className="text-2xl font-bold">{stats.avgLeverage}/10</div>
        </div>
        
        <div className="bg-slate-700 p-4 rounded">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-sm text-slate-400">Flow State Rate</div>
          <div className="text-2xl font-bold">{stats.flowRate}%</div>
        </div>
        
        <div className="bg-slate-700 p-4 rounded">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-sm text-slate-400">Tasks Completed</div>
          <div className="text-2xl font-bold">{stats.totalTasks}</div>
        </div>
        
        <div className="bg-slate-700 p-4 rounded">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-sm text-slate-400">Avg Energy</div>
          <div className="text-2xl font-bold">{stats.avgEnergy}/10</div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-900/30 border border-blue-500 p-4 rounded">
        <h3 className="font-bold mb-2">💡 Insights</h3>
        <ul className="text-sm space-y-1">
          <li>• You're 2x more productive when energy {'>'} 7</li>
          <li>• Best days: Tuesdays & Thursdays</li>
          <li>• Peak hours: 9-11am (your BPT)</li>
        </ul>
      </div>
    </div>
  );
}
```

---

## DAY 7: INTEGRATIONS + POLISH

```jsx
// SIMPLIFIED NOTION INTEGRATION
async function syncToNotion(task) {
  // This requires Notion API setup
  // For MVP, just provide export functionality
  
  const allData = {
    user: await get('user'),
    tasks: await get('tasks'),
    energyLogs: await get('energyLogs'),
    outcomes: await get('outcomeNodes')
  };
  
  const json = JSON.stringify(allData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `lifer-backup-${new Date().toISOString()}.json`;
  a.click();
}

// Export button
<button onClick={syncToNotion} className="bg-blue-500 p-3 rounded">
  📥 Export to JSON (Import to Notion manually)
</button>
```

---

## FINAL POLISH CHECKLIST

```javascript
// Performance
- [ ] IndexedDB queries use try-catch
- [ ] Large lists use pagination/virtualization
- [ ] Images optimized (WebP with fallbacks)
- [ ] Bundle size < 100KB gzipped

// Mobile
- [ ] Test on actual iPhone
- [ ] Touch targets >= 44x44px
- [ ] PWA manifest configured
- [ ] Service worker caches assets

// Integration
- [ ] All features talk to each other
- [ ] XP awards work across features
- [ ] Data flows correctly
- [ ] No broken references

// Edge Cases
- [ ] First-time user (empty state)
- [ ] Offline behavior
- [ ] Multiple tabs
- [ ] Data export/import

// Deploy
npm run build
npm run deploy
# Test on production URL
```

---

## SUCCESS METRICS

By end of Day 7:
- ✅ 21+ energy logs (fake data OK)
- ✅ BPT window detected
- ✅ 3+ focus sessions completed
- ✅ 2+ outcome trees with tasks connected
- ✅ 1 couple paired (can simulate)
- ✅ All 5 themes functional
- ✅ AI suggesting tasks
- ✅ Analytics showing data
- ✅ Deployed to production
- ✅ Zero critical bugs

---

## IMPLEMENTATION NOTES

**Start with Day 1, finish Day 1, ship Day 1.**
Don't move to Day 2 until Day 1 works in production.

Each feature is self-contained. Build component → Test → Commit → Deploy.

Use existing patterns from v1.0 codebase. Match existing:
- Component structure
- State management
- Styling approach
- File organization

Focus on WORKING CODE over perfect code.
Ship fast, iterate based on real usage.

The goal: Build the greatest personal life management system ever.
You have 7 days. Let's fucking go.

---

**Drop this entire file into Claude Code. Reference it constantly. Build iteratively. Ship daily.**
