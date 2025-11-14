<script lang="ts">
  import { onMount } from 'svelte'
  import {
    getAtRiskPractices,
    getCriticalPractices,
    getRecoverySuggestions,
    getRecoveryStats,
    getRecoveryEvents
  } from '../lib/db'
  import type { Practice, RecoveryEvent } from '../lib/types'

  let atRiskPractices: Practice[] = []
  let criticalPractices: Practice[] = []
  let allRecoveryEvents: RecoveryEvent[] = []
  let practiceStats: Map<string, {
    totalRecoveries: number
    averageMissCount: number
    lastRecoveryDate?: string
    longestRecoveryStreak: number
  }> = new Map()

  let selectedPractice: Practice | null = null
  let showingSuggestions = false

  onMount(async () => {
    await loadData()
  })

  async function loadData() {
    atRiskPractices = await getAtRiskPractices()
    criticalPractices = await getCriticalPractices()
    allRecoveryEvents = await getRecoveryEvents()

    // Load stats for all practices with recovery history
    const practiceIds = new Set([
      ...atRiskPractices.map(p => p.id),
      ...criticalPractices.map(p => p.id),
      ...allRecoveryEvents.map(e => e.practiceId)
    ])

    for (const id of practiceIds) {
      const stats = await getRecoveryStats(id)
      practiceStats.set(id, stats)
    }

    practiceStats = practiceStats // Trigger reactivity
  }

  function openSuggestions(practice: Practice) {
    selectedPractice = practice
    showingSuggestions = true
  }

  function closeSuggestions() {
    selectedPractice = null
    showingSuggestions = false
  }

  function getStreakColor(consecutiveMisses: number): string {
    if (consecutiveMisses >= 2) return 'text-red-400'
    if (consecutiveMisses === 1) return 'text-yellow-400'
    return 'text-green-400'
  }

  function getStatusBadge(consecutiveMisses: number): string {
    if (consecutiveMisses >= 2) return '🚨 CRITICAL'
    if (consecutiveMisses === 1) return '⚠️ AT RISK'
    return '✅ SAFE'
  }

  function getStatusColor(consecutiveMisses: number): string {
    if (consecutiveMisses >= 2) return 'bg-red-900/30 border-red-700'
    if (consecutiveMisses === 1) return 'bg-yellow-900/30 border-yellow-700'
    return 'bg-green-900/30 border-green-700'
  }

  $: totalAtRisk = atRiskPractices.length + criticalPractices.length
  $: totalRecoveries = Array.from(practiceStats.values()).reduce((sum, s) => sum + s.totalRecoveries, 0)
</script>

<div class="max-w-6xl mx-auto">
  <!-- Header -->
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-2">🔥 Never Miss Twice</h2>
    <p class="text-slate-400">
      "Missing once is an accident. Missing twice is the start of a new habit." — James Clear
    </p>
  </div>

  <!-- Stats Overview -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700 rounded-lg p-4">
      <div class="text-sm text-green-400 mb-1">Total Recoveries</div>
      <div class="text-3xl font-bold text-green-300">{totalRecoveries}</div>
      <div class="text-xs text-slate-400 mt-1">Times you bounced back</div>
    </div>

    <div class="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-700 rounded-lg p-4">
      <div class="text-sm text-yellow-400 mb-1">At Risk</div>
      <div class="text-3xl font-bold text-yellow-300">{atRiskPractices.length}</div>
      <div class="text-xs text-slate-400 mt-1">Missed once (accident)</div>
    </div>

    <div class="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700 rounded-lg p-4">
      <div class="text-sm text-red-400 mb-1">Critical</div>
      <div class="text-3xl font-bold text-red-300">{criticalPractices.length}</div>
      <div class="text-xs text-slate-400 mt-1">Missed twice+ (URGENT)</div>
    </div>
  </div>

  <!-- Critical Practices (Missed 2+) -->
  {#if criticalPractices.length > 0}
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-2xl">🚨</span>
        <h3 class="text-2xl font-bold text-red-400">CRITICAL: Act NOW</h3>
      </div>

      <div class="space-y-4">
        {#each criticalPractices as practice}
          <div class="bg-red-900/20 border-2 border-red-600 rounded-lg p-5 animate-pulse">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h4 class="text-xl font-bold text-red-300 mb-1">{practice.name}</h4>
                <div class="flex items-center gap-3 text-sm">
                  <span class="text-red-400">
                    Missed <strong>{practice.consecutiveMisses || 0} days</strong> in a row
                  </span>
                  {#if practice.lastMissDate}
                    <span class="text-slate-400">
                      Last miss: {new Date(practice.lastMissDate).toLocaleDateString()}
                    </span>
                  {/if}
                </div>
              </div>
              <button
                on:click={() => openSuggestions(practice)}
                class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors"
              >
                Get Help NOW
              </button>
            </div>

            <div class="bg-red-950/50 border border-red-800 rounded p-3">
              <p class="text-sm font-semibold text-red-300 mb-2">⏰ Emergency Action:</p>
              <ul class="text-sm text-slate-300 space-y-1">
                {#each getRecoverySuggestions(practice).slice(0, 2) as suggestion}
                  <li>• {suggestion}</li>
                {/each}
              </ul>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- At Risk Practices (Missed Once) -->
  {#if atRiskPractices.length > 0}
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-2xl">⚠️</span>
        <h3 class="text-xl font-bold text-yellow-400">At Risk: Recover Today</h3>
      </div>

      <div class="space-y-3">
        {#each atRiskPractices as practice}
          <div class="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h4 class="text-lg font-bold text-yellow-300 mb-1">{practice.name}</h4>
                <p class="text-sm text-slate-400">
                  You missed yesterday. That's okay—it's an accident. Get back on track today.
                </p>
              </div>
              <button
                on:click={() => openSuggestions(practice)}
                class="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Recovery Plan
              </button>
            </div>

            {#if practice.recoveryCount && practice.recoveryCount > 0}
              <div class="flex items-center gap-2 text-xs text-green-400 mt-2">
                <span>✅</span>
                <span>You've recovered {practice.recoveryCount} time{practice.recoveryCount > 1 ? 's' : ''} before. You can do it again!</span>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- All Clear -->
  {#if totalAtRisk === 0}
    <div class="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700 rounded-lg p-8 text-center mb-8">
      <div class="text-6xl mb-4">🎯</div>
      <h3 class="text-2xl font-bold text-green-400 mb-2">All Systems Green!</h3>
      <p class="text-slate-300">
        No practices at risk. You're maintaining all your habits consistently.
      </p>
      <p class="text-slate-400 text-sm mt-2">
        Keep this momentum going. Your future self will thank you.
      </p>
    </div>
  {/if}

  <!-- Recovery History -->
  {#if allRecoveryEvents.length > 0}
    <div class="mb-8">
      <h3 class="text-xl font-bold mb-4">💪 Recovery History</h3>

      <div class="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-700">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium">Practice</th>
              <th class="px-4 py-3 text-left text-sm font-medium">Missed Date</th>
              <th class="px-4 py-3 text-left text-sm font-medium">Recovered</th>
              <th class="px-4 py-3 text-left text-sm font-medium">Miss Count</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700">
            {#each allRecoveryEvents.slice(-10).reverse() as event}
              <tr class="hover:bg-slate-750">
                <td class="px-4 py-3 font-medium">{event.practiceName}</td>
                <td class="px-4 py-3 text-slate-400 text-sm">
                  {new Date(event.missedDate).toLocaleDateString()}
                </td>
                <td class="px-4 py-3 text-green-400 text-sm">
                  {new Date(event.recoveredDate).toLocaleDateString()}
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded text-xs font-medium {event.missCount === 1 ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}">
                    {event.missCount === 1 ? '1 day' : `${event.missCount} days`}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <!-- Educational Note -->
  <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
    <h4 class="font-bold mb-2">📚 The Science Behind "Never Miss Twice"</h4>
    <p class="text-sm text-slate-300 mb-2">
      Research shows that missing a habit <strong>once</strong> doesn't significantly impact long-term success.
      But missing <strong>twice</strong> in a row makes it 3x more likely the habit will fail entirely.
    </p>
    <p class="text-sm text-slate-300">
      <strong>The rule:</strong> If you miss today, you MUST do it tomorrow—no matter what. That's the line between
      staying on track and falling off completely.
    </p>
  </div>
</div>

<!-- Recovery Suggestions Modal -->
{#if showingSuggestions && selectedPractice}
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" on:click={closeSuggestions}>
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-2xl font-bold mb-1">{selectedPractice.name}</h3>
          <span class="text-sm px-3 py-1 rounded-full font-medium {getStatusColor(selectedPractice.consecutiveMisses || 0)}">
            {getStatusBadge(selectedPractice.consecutiveMisses || 0)}
          </span>
        </div>
        <button
          on:click={closeSuggestions}
          class="text-slate-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div class="mb-6">
        <h4 class="font-bold text-lg mb-3">🎯 Recovery Strategies</h4>
        <div class="space-y-2">
          {#each getRecoverySuggestions(selectedPractice) as suggestion, i}
            <div class="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-start gap-3">
              <span class="text-blue-400 font-bold flex-shrink-0">{i + 1}.</span>
              <p class="text-slate-200">{suggestion}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Stats for this practice -->
      {#if practiceStats.has(selectedPractice.id)}
        {@const stats = practiceStats.get(selectedPractice.id)}
        {#if stats && stats.totalRecoveries > 0}
          <div class="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
            <h4 class="font-bold mb-2 text-green-400">💪 Your Recovery Track Record</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div class="text-slate-400">Total Recoveries</div>
                <div class="text-xl font-bold text-green-300">{stats.totalRecoveries}</div>
              </div>
              <div>
                <div class="text-slate-400">Avg Miss Count</div>
                <div class="text-xl font-bold">{stats.averageMissCount.toFixed(1)} days</div>
              </div>
              {#if stats.longestRecoveryStreak > 0}
                <div>
                  <div class="text-slate-400">Best Recovery Streak</div>
                  <div class="text-xl font-bold text-yellow-400">{stats.longestRecoveryStreak}x</div>
                </div>
              {/if}
              {#if stats.lastRecoveryDate}
                <div>
                  <div class="text-slate-400">Last Recovery</div>
                  <div class="text-sm">{new Date(stats.lastRecoveryDate).toLocaleDateString()}</div>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      {/if}

      <div class="flex gap-3">
        <button
          on:click={closeSuggestions}
          class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
        >
          I'm Ready to Recover
        </button>
        <button
          on:click={closeSuggestions}
          class="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
