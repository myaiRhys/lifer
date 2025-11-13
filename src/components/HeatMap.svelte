<script lang="ts">
  import { onMount } from 'svelte'
  import { getHistory } from '../lib/db/history'
  import type { HistoryRecord } from '../lib/types'

  let history: HistoryRecord[] = []
  let heatMapData: Map<string, number> = new Map()
  let maxXP = 0
  let selectedDate: string | null = null
  let selectedData: { date: string; xp: number; tasks: number } | null = null

  onMount(async () => {
    await loadHeatMap()
  })

  async function loadHeatMap() {
    history = await getHistory()

    // Aggregate XP by date
    const dataByDate = new Map<string, { xp: number; tasks: number }>()

    for (const record of history) {
      const date = new Date(record.completedAt).toISOString().split('T')[0]
      const existing = dataByDate.get(date) || { xp: 0, tasks: 0 }

      dataByDate.set(date, {
        xp: existing.xp + (record.xpEarned || 0),
        tasks: existing.tasks + 1
      })
    }

    // Convert to heat map data (just XP for coloring)
    dataByDate.forEach((value, date) => {
      heatMapData.set(date, value.xp)
      maxXP = Math.max(maxXP, value.xp)
    })

    heatMapData = heatMapData
  }

  function getLast90Days(): Date[] {
    const days: Date[] = []
    const today = new Date()

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date)
    }

    return days
  }

  function getWeeks(): Date[][] {
    const days = getLast90Days()
    const weeks: Date[][] = []
    let currentWeek: Date[] = []

    // Start from Sunday
    const firstDay = days[0]
    const firstDayOfWeek = firstDay.getDay()

    // Add empty days to align first week
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null as any)
    }

    for (const day of days) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(day)
    }

    // Fill last week
    while (currentWeek.length < 7) {
      currentWeek.push(null as any)
    }
    weeks.push(currentWeek)

    return weeks
  }

  function getColorForDay(date: Date | null): string {
    if (!date) return 'bg-transparent'

    const dateStr = date.toISOString().split('T')[0]
    const xp = heatMapData.get(dateStr) || 0

    if (xp === 0) return 'bg-slate-800 border-slate-700'

    const intensity = maxXP > 0 ? xp / maxXP : 0

    if (intensity > 0.75) return 'bg-green-500 border-green-400'
    if (intensity > 0.5) return 'bg-green-600 border-green-500'
    if (intensity > 0.25) return 'bg-green-700 border-green-600'
    return 'bg-green-800 border-green-700'
  }

  function handleDayClick(date: Date | null) {
    if (!date) return

    const dateStr = date.toISOString().split('T')[0]
    const xp = heatMapData.get(dateStr) || 0

    selectedDate = dateStr
    selectedData = {
      date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      xp,
      tasks: history.filter(h => new Date(h.completedAt).toISOString().split('T')[0] === dateStr).length
    }
  }

  function getTooltip(date: Date | null): string {
    if (!date) return ''

    const dateStr = date.toISOString().split('T')[0]
    const xp = heatMapData.get(dateStr) || 0
    const tasks = history.filter(h => new Date(h.completedAt).toISOString().split('T')[0] === dateStr).length

    return `${date.toLocaleDateString()}\n${xp} XP, ${tasks} tasks`
  }

  function getCurrentStreak(): number {
    // Calculate current streak from heat map data
    const today = new Date()
    let streak = 0

    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      if (heatMapData.get(dateStr)) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  $: weeks = getWeeks()
  $: dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  $: currentStreak = getCurrentStreak()
</script>

<div class="max-w-6xl mx-auto">
  <h2 class="text-3xl font-bold mb-6">Activity Heat Map</h2>

  <div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
    <h3 class="text-lg font-medium mb-4">Last 90 Days</h3>

    <!-- Legend -->
    <div class="flex items-center gap-2 mb-4 text-sm">
      <span class="text-slate-400">Less</span>
      <div class="w-3 h-3 bg-slate-800 border border-slate-700 rounded"></div>
      <div class="w-3 h-3 bg-green-800 border border-green-700 rounded"></div>
      <div class="w-3 h-3 bg-green-700 border border-green-600 rounded"></div>
      <div class="w-3 h-3 bg-green-600 border border-green-500 rounded"></div>
      <div class="w-3 h-3 bg-green-500 border border-green-400 rounded"></div>
      <span class="text-slate-400">More</span>
    </div>

    <!-- Calendar Grid -->
    <div class="overflow-x-auto">
      <div class="inline-flex gap-1">
        {#each weeks as week}
          <div class="flex flex-col gap-1">
            {#each week as day}
              <button
                class="w-3 h-3 rounded border transition-all hover:scale-125 {getColorForDay(day)}"
                title={getTooltip(day)}
                on:click={() => handleDayClick(day)}
                disabled={!day}
              />
            {/each}
          </div>
        {/each}
      </div>
    </div>

    <!-- Month Labels -->
    <div class="flex gap-1 mt-2 text-xs text-slate-400">
      {#each Array(13) as _, i}
        <div class="flex-1 text-center">
          {new Date(Date.now() - (12 - i) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' })}
        </div>
      {/each}
    </div>
  </div>

  <!-- Selected Day Details -->
  {#if selectedData}
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 class="text-lg font-medium mb-4">Selected Day</h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <div class="text-sm text-slate-400 mb-1">Date</div>
          <div class="font-medium">{selectedData.date}</div>
        </div>
        <div>
          <div class="text-sm text-slate-400 mb-1">XP Earned</div>
          <div class="text-2xl font-bold text-yellow-400">{selectedData.xp}</div>
        </div>
        <div>
          <div class="text-sm text-slate-400 mb-1">Tasks Completed</div>
          <div class="text-2xl font-bold text-blue-400">{selectedData.tasks}</div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Stats Summary -->
  <div class="grid grid-cols-3 gap-4 mt-6">
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div class="text-sm text-slate-400 mb-1">Current Streak</div>
      <div class="text-2xl font-bold text-green-400">{getCurrentStreak()} days</div>
    </div>
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div class="text-sm text-slate-400 mb-1">Active Days</div>
      <div class="text-2xl font-bold text-blue-400">{heatMapData.size}</div>
    </div>
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div class="text-sm text-slate-400 mb-1">Best Day</div>
      <div class="text-2xl font-bold text-purple-400">{maxXP} XP</div>
    </div>
  </div>
</div>
