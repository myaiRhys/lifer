<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { createFocusSession, completeFocusSession, getTodaysFocusSessions, addXP, getSettings } from '../lib/db'
  import type { FocusSession, AppSettings } from '../lib/types'
  import { celebrateTaskComplete } from '../lib/animations'
  import { soundSystem } from '../lib/sounds'

  let settings: AppSettings | null = null
  let sessionType: 'work' | 'short_break' | 'long_break' = 'work'
  let timeRemaining = 0
  let isRunning = false
  let isPaused = false
  let currentSession: FocusSession | null = null
  let todaySessions: FocusSession[] = []
  let completedPomodoros = 0
  let interval: number | null = null

  let sessionLengths = {
    work: 25,
    short_break: 5,
    long_break: 15
  }

  onMount(async () => {
    settings = await getSettings()
    sessionLengths = {
      work: settings.pomodoroLength,
      short_break: settings.shortBreakLength,
      long_break: settings.longBreakLength
    }
    timeRemaining = sessionLengths.work * 60
    await loadTodaySessions()
  })

  onDestroy(() => {
    if (interval) clearInterval(interval)
  })

  async function loadTodaySessions() {
    todaySessions = await getTodaysFocusSessions()
    completedPomodoros = todaySessions.filter(s => s.type === 'pomodoro' && s.completedAt && !s.interrupted).length
  }

  function startTimer() {
    if (isPaused) {
      isPaused = false
      isRunning = true
    } else {
      isRunning = true
      isPaused = false
    }

    interval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--
      } else {
        completeSession()
      }
    }, 1000)
  }

  function pauseTimer() {
    isPaused = true
    isRunning = false
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  async function completeSession() {
    if (interval) clearInterval(interval)
    isRunning = false
    isPaused = false

    if (sessionType === 'work') {
      // Award XP for completed Pomodoro
      const xpEarned = 100
      if (currentSession) {
        await completeFocusSession(currentSession.id, xpEarned, false)
      } else {
        const session = await createFocusSession('pomodoro', sessionLengths.work)
        await completeFocusSession(session.id, xpEarned, false)
      }

      await addXP(xpEarned)
      celebrateTaskComplete(7)
      soundSystem.taskComplete(7)
      await loadTodaySessions()

      // Auto-switch to break
      completedPomodoros++
      if (completedPomodoros % 4 === 0) {
        switchSession('long_break')
      } else {
        switchSession('short_break')
      }
    } else {
      // Break completed, switch back to work
      soundSystem.taskComplete(5)
      switchSession('work')
    }

    currentSession = null
  }

  async function stopSession() {
    if (interval) clearInterval(interval)

    if (currentSession && isRunning) {
      await completeFocusSession(currentSession.id, 0, true)
      await loadTodaySessions()
    }

    isRunning = false
    isPaused = false
    currentSession = null
    timeRemaining = sessionLengths[sessionType] * 60
  }

  function switchSession(type: 'work' | 'short_break' | 'long_break') {
    sessionType = type
    timeRemaining = sessionLengths[type] * 60
    isRunning = false
    isPaused = false
    if (interval) clearInterval(interval)
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function getProgressPercentage(): number {
    const total = sessionLengths[sessionType] * 60
    return ((total - timeRemaining) / total) * 100
  }

  function getSessionColor(): string {
    if (sessionType === 'work') return 'text-blue-400'
    if (sessionType === 'long_break') return 'text-purple-400'
    return 'text-green-400'
  }

  function getSessionBgColor(): string {
    if (sessionType === 'work') return 'bg-blue-500'
    if (sessionType === 'long_break') return 'bg-purple-500'
    return 'bg-green-500'
  }

  $: sessionTitle = sessionType === 'work' ? 'Focus Time' : sessionType === 'short_break' ? 'Short Break' : 'Long Break'
</script>

<div class="max-w-2xl mx-auto">
  <h2 class="text-3xl font-bold mb-6">Focus Timer</h2>

  <!-- Timer Card -->
  <div class="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-6">
    <!-- Session Type Selector -->
    <div class="flex gap-2 mb-6 justify-center">
      <button
        class="px-4 py-2 rounded-lg font-medium transition-colors {sessionType === 'work' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
        on:click={() => !isRunning && switchSession('work')}
        disabled={isRunning}
      >
        Pomodoro
      </button>
      <button
        class="px-4 py-2 rounded-lg font-medium transition-colors {sessionType === 'short_break' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
        on:click={() => !isRunning && switchSession('short_break')}
        disabled={isRunning}
      >
        Short Break
      </button>
      <button
        class="px-4 py-2 rounded-lg font-medium transition-colors {sessionType === 'long_break' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
        on:click={() => !isRunning && switchSession('long_break')}
        disabled={isRunning}
      >
        Long Break
      </button>
    </div>

    <!-- Timer Display -->
    <div class="text-center mb-6">
      <h3 class="text-lg font-medium text-slate-400 mb-2">{sessionTitle}</h3>
      <div class="text-7xl font-bold {getSessionColor()} mb-4 font-mono">
        {formatTime(timeRemaining)}
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-slate-700 rounded-full h-2 mb-6">
        <div
          class="{getSessionBgColor()} h-2 rounded-full transition-all"
          style="width: {getProgressPercentage()}%"
        />
      </div>

      <!-- XP Indicator for Work Sessions -->
      {#if sessionType === 'work' && !isRunning}
        <div class="text-sm text-yellow-400 mb-4">
          +100 XP upon completion
        </div>
      {/if}
    </div>

    <!-- Controls -->
    <div class="flex gap-3 justify-center">
      {#if !isRunning && !isPaused}
        <button
          class="{getSessionBgColor()} hover:opacity-90 text-white px-8 py-3 rounded-lg font-bold text-lg transition-opacity"
          on:click={startTimer}
        >
          Start
        </button>
      {/if}

      {#if isRunning}
        <button
          class="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
          on:click={pauseTimer}
        >
          Pause
        </button>
      {/if}

      {#if isPaused}
        <button
          class="{getSessionBgColor()} hover:opacity-90 text-white px-8 py-3 rounded-lg font-bold text-lg transition-opacity"
          on:click={startTimer}
        >
          Resume
        </button>
      {/if}

      {#if (isRunning || isPaused)}
        <button
          class="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
          on:click={stopSession}
        >
          Stop
        </button>
      {/if}
    </div>
  </div>

  <!-- Today's Stats -->
  <div class="grid grid-cols-2 gap-4">
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div class="text-sm text-slate-400 mb-1">Completed Pomodoros</div>
      <div class="text-3xl font-bold text-blue-400">{completedPomodoros}</div>
    </div>
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div class="text-sm text-slate-400 mb-1">Total XP Earned</div>
      <div class="text-3xl font-bold text-yellow-400">{completedPomodoros * 100}</div>
    </div>
  </div>

  <!-- Info Box -->
  <div class="mt-6 bg-slate-800 border border-slate-700 rounded-lg p-4">
    <h4 class="font-bold mb-2">How it works:</h4>
    <ul class="text-sm text-slate-300 space-y-1">
      <li>• Complete a {sessionLengths.work}-minute focus session to earn 100 XP</li>
      <li>• Take {sessionLengths.short_break}-minute breaks between sessions</li>
      <li>• After 4 sessions, take a {sessionLengths.long_break}-minute long break</li>
      <li>• Stay focused - interrupting a session gives no XP</li>
    </ul>
  </div>
</div>
