<script lang="ts">
  import { onMount } from 'svelte'
  import {
    getMarginalGainLogs,
    getMarginalGainStats,
    getTodayMarginalGains,
    logMarginalGain,
    deleteMarginalGainLog,
    calculateProjection,
    getOnePercentComparison,
    MARGINAL_GAIN_EXAMPLES
  } from '../lib/db'
  import type { MarginalGainLog, MarginalGainStats } from '../lib/types'

  let logs: MarginalGainLog[] = []
  let stats: MarginalGainStats | null = null
  let todayGains: MarginalGainLog[] = []

  // Form state
  let showAddForm = false
  let category: MarginalGainLog['category'] = 'skill'
  let description = ''
  let improvementPercent = 1

  // Projection state
  let selectedDays = 365
  let customDays = 365

  onMount(async () => {
    await loadData()
  })

  async function loadData() {
    logs = await getMarginalGainLogs()
    stats = await getMarginalGainStats()
    todayGains = await getTodayMarginalGains()
  }

  async function handleAddGain() {
    if (!description.trim()) return

    await logMarginalGain(category, description, improvementPercent)

    // Reset form
    description = ''
    improvementPercent = 1
    showAddForm = false

    await loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this improvement log?')) return
    await deleteMarginalGainLog(id)
    await loadData()
  }

  function getCategoryEmoji(cat: string): string {
    const map: Record<string, string> = {
      skill: '📚',
      health: '💪',
      productivity: '⚡',
      relationship: '❤️',
      mindset: '🧠',
      other: '✨'
    }
    return map[cat] || '✨'
  }

  function getCategoryColor(cat: string): string {
    const map: Record<string, string> = {
      skill: 'bg-blue-900/30 border-blue-700 text-blue-400',
      health: 'bg-green-900/30 border-green-700 text-green-400',
      productivity: 'bg-yellow-900/30 border-yellow-700 text-yellow-400',
      relationship: 'bg-pink-900/30 border-pink-700 text-pink-400',
      mindset: 'bg-purple-900/30 border-purple-700 text-purple-400',
      other: 'bg-slate-900/30 border-slate-700 text-slate-400'
    }
    return map[cat] || map.other
  }

  function formatMultiplier(multiplier: number): string {
    if (multiplier >= 10) return multiplier.toFixed(1)
    if (multiplier >= 2) return multiplier.toFixed(2)
    return multiplier.toFixed(3)
  }

  function formatPercent(percent: number): string {
    if (percent >= 100) return `+${Math.round(percent)}%`
    if (percent >= 10) return `+${percent.toFixed(1)}%`
    return `+${percent.toFixed(2)}%`
  }

  $: projection = stats ? calculateProjection(stats.avgDailyImprovement, selectedDays === 0 ? customDays : selectedDays) : null
  $: comparison = getOnePercentComparison(365)
  $: recentLogs = logs.slice(-10).reverse()
</script>

<div class="max-w-6xl mx-auto space-y-6">
  <!-- Header -->
  <div class="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700 rounded-lg p-6">
    <div class="flex items-start gap-4">
      <span class="text-5xl">📈</span>
      <div class="flex-1">
        <h2 class="text-3xl font-bold mb-2">Marginal Gains Visualizer</h2>
        <p class="text-lg text-blue-200 mb-3">
          "If you get 1% better each day for one year, you'll end up 37 times better."
        </p>
        <p class="text-sm text-slate-400">— James Clear, Atomic Habits</p>
      </div>
    </div>
  </div>

  {#if stats}
    <!-- 1% Better vs 1% Worse Comparison -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">The Power of Marginal Gains</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- 1% Better -->
        <div class="bg-green-900/20 border border-green-700 rounded-lg p-4">
          <div class="text-center mb-3">
            <div class="text-4xl font-bold text-green-400">1.01<sup>365</sup></div>
            <div class="text-sm text-green-300 mt-1">1% better every day</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-400">{formatMultiplier(comparison.better.multiplier)}x</div>
            <div class="text-sm text-green-300 mt-1">better after 1 year</div>
            <div class="text-xs text-green-400 mt-2">{formatPercent(comparison.better.percentIncrease)} improvement</div>
          </div>
        </div>

        <!-- 1% Worse -->
        <div class="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <div class="text-center mb-3">
            <div class="text-4xl font-bold text-red-400">0.99<sup>365</sup></div>
            <div class="text-sm text-red-300 mt-1">1% worse every day</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-red-400">{formatMultiplier(comparison.worse.multiplier)}x</div>
            <div class="text-sm text-red-300 mt-1">remaining after 1 year</div>
            <div class="text-xs text-red-400 mt-2">-{comparison.worse.percentDecrease.toFixed(1)}% decline</div>
          </div>
        </div>
      </div>

      <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-4 text-center">
        <div class="text-lg font-semibold text-blue-300 mb-1">The Difference</div>
        <div class="text-4xl font-bold text-blue-400">{comparison.difference.toFixed(1)}x</div>
        <div class="text-sm text-blue-300 mt-2">1% better is {comparison.difference.toFixed(1)}x more effective than 1% worse</div>
      </div>
    </div>

    <!-- Current Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div class="text-sm text-slate-400 mb-1">Days Active</div>
        <div class="text-3xl font-bold text-blue-400">{stats.totalDays}</div>
        <div class="text-xs text-slate-500 mt-1">{stats.currentStreak} day streak</div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div class="text-sm text-slate-400 mb-1">Total Improvements</div>
        <div class="text-3xl font-bold text-green-400">{stats.totalImprovements}</div>
        <div class="text-xs text-slate-500 mt-1">{(stats.totalImprovements / Math.max(stats.totalDays, 1)).toFixed(1)} per day</div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div class="text-sm text-slate-400 mb-1">Avg Daily Improvement</div>
        <div class="text-3xl font-bold text-yellow-400">{stats.avgDailyImprovement.toFixed(2)}%</div>
        <div class="text-xs text-slate-500 mt-1">
          {stats.avgDailyImprovement > 1 ? '👍 Above 1%' : stats.avgDailyImprovement === 1 ? '🎯 Perfect 1%' : '📊 Below 1%'}
        </div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div class="text-sm text-slate-400 mb-1">Current Multiplier</div>
        <div class="text-3xl font-bold text-purple-400">{formatMultiplier(stats.currentMultiplier)}x</div>
        <div class="text-xs text-slate-500 mt-1">compounded over {stats.totalDays} days</div>
      </div>
    </div>

    <!-- Projection Calculator -->
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Growth Projection</h3>

      <div class="mb-4">
        <label class="block text-sm text-slate-400 mb-2">Project growth over:</label>
        <div class="grid grid-cols-4 gap-2 mb-2">
          <button
            class="px-4 py-2 rounded {selectedDays === 30 ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}"
            on:click={() => selectedDays = 30}
          >
            30 days
          </button>
          <button
            class="px-4 py-2 rounded {selectedDays === 90 ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}"
            on:click={() => selectedDays = 90}
          >
            90 days
          </button>
          <button
            class="px-4 py-2 rounded {selectedDays === 365 ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}"
            on:click={() => selectedDays = 365}
          >
            1 year
          </button>
          <button
            class="px-4 py-2 rounded {selectedDays === 0 ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}"
            on:click={() => selectedDays = 0}
          >
            Custom
          </button>
        </div>

        {#if selectedDays === 0}
          <input
            type="number"
            bind:value={customDays}
            min="1"
            max="3650"
            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg"
            placeholder="Enter custom days"
          />
        {/if}
      </div>

      {#if projection}
        <div class="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700 rounded-lg p-6">
          <div class="text-center mb-4">
            <div class="text-sm text-blue-300 mb-2">
              At your current rate of {stats.avgDailyImprovement.toFixed(2)}% daily improvement
            </div>
            <div class="text-sm text-blue-300 mb-3">
              over {selectedDays === 0 ? customDays : selectedDays} days, you'll be:
            </div>
          </div>

          <div class="text-center">
            <div class="text-6xl font-bold text-blue-400 mb-2">{formatMultiplier(projection.multiplier)}x</div>
            <div class="text-2xl text-blue-300">better</div>
            <div class="text-lg text-blue-400 mt-3">{formatPercent(projection.percentIncrease)} total growth</div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Category Breakdown -->
    {#if stats.categoryBreakdown.length > 0}
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 class="text-xl font-bold mb-4">Improvements by Category</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each stats.categoryBreakdown as cat}
            <div class="bg-slate-700 border border-slate-600 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">{getCategoryEmoji(cat.category)}</span>
                <span class="font-semibold capitalize">{cat.category}</span>
              </div>
              <div class="text-2xl font-bold text-blue-400 mb-1">{cat.count}</div>
              <div class="text-sm text-slate-400">Avg: {cat.avgImprovement.toFixed(2)}% improvement</div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}

  <!-- Log Today's Improvements -->
  <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold">Today's Improvements ({todayGains.length})</h3>
      <button
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
        on:click={() => showAddForm = !showAddForm}
      >
        {showAddForm ? 'Cancel' : '+ Log Improvement'}
      </button>
    </div>

    {#if showAddForm}
      <div class="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-4">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Category</label>
          <select
            bind:value={category}
            class="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg"
          >
            <option value="skill">{getCategoryEmoji('skill')} Skill</option>
            <option value="health">{getCategoryEmoji('health')} Health</option>
            <option value="productivity">{getCategoryEmoji('productivity')} Productivity</option>
            <option value="relationship">{getCategoryEmoji('relationship')} Relationship</option>
            <option value="mindset">{getCategoryEmoji('mindset')} Mindset</option>
            <option value="other">{getCategoryEmoji('other')} Other</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">What small improvement did you make?</label>
          <textarea
            bind:value={description}
            placeholder="E.g., Read 10 pages, Drank extra glass of water, Cleared inbox..."
            class="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg resize-none"
            rows="2"
          />

          <!-- Examples -->
          {#if MARGINAL_GAIN_EXAMPLES[category]}
            <div class="mt-2">
              <div class="text-xs text-slate-400 mb-1">Examples:</div>
              <div class="flex flex-wrap gap-1">
                {#each MARGINAL_GAIN_EXAMPLES[category].slice(0, 3) as example}
                  <button
                    class="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded"
                    on:click={() => description = example}
                  >
                    {example}
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Estimated improvement: {improvementPercent}%</label>
          <input
            type="range"
            bind:value={improvementPercent}
            min="0.1"
            max="10"
            step="0.1"
            class="w-full"
          />
          <div class="flex justify-between text-xs text-slate-400 mt-1">
            <span>0.1% (tiny)</span>
            <span>1% (marginal)</span>
            <span>5% (significant)</span>
            <span>10% (major)</span>
          </div>
        </div>

        <button
          class="w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors"
          on:click={handleAddGain}
          disabled={!description.trim()}
        >
          Log Improvement
        </button>
      </div>
    {/if}

    <!-- Today's Gains List -->
    {#if todayGains.length > 0}
      <div class="space-y-2">
        {#each todayGains as gain}
          <div class="flex items-start gap-3 p-3 bg-slate-700 border border-slate-600 rounded-lg">
            <span class="text-2xl">{getCategoryEmoji(gain.category)}</span>
            <div class="flex-1">
              <div class="font-medium">{gain.description}</div>
              <div class="text-sm text-slate-400 mt-1">
                +{gain.improvementPercent}% improvement · {gain.category}
              </div>
            </div>
            <button
              class="text-red-400 hover:text-red-300 text-sm"
              on:click={() => handleDelete(gain.id)}
            >
              Delete
            </button>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-8 text-slate-400">
        <div class="text-4xl mb-2">🎯</div>
        <div>No improvements logged yet today</div>
        <div class="text-sm mt-1">Log your first 1% improvement above!</div>
      </div>
    {/if}
  </div>

  <!-- Recent Improvements -->
  {#if recentLogs.length > 0}
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 class="text-xl font-bold mb-4">Recent Improvements</h3>

      <div class="space-y-2">
        {#each recentLogs as log}
          <div class="flex items-start gap-3 p-3 bg-slate-700 border border-slate-600 rounded-lg">
            <span class="text-2xl">{getCategoryEmoji(log.category)}</span>
            <div class="flex-1">
              <div class="font-medium">{log.description}</div>
              <div class="text-sm text-slate-400 mt-1">
                {log.date} · +{log.improvementPercent}% · {log.category}
              </div>
            </div>
            <button
              class="text-red-400 hover:text-red-300 text-sm"
              on:click={() => handleDelete(log.id)}
            >
              Delete
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Educational Content -->
  <div class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700 rounded-lg p-6">
    <h3 class="text-xl font-bold mb-3">The Science of Marginal Gains</h3>

    <div class="space-y-4 text-sm">
      <div>
        <div class="font-semibold text-purple-300 mb-1">🚴 British Cycling's 1% Rule</div>
        <div class="text-slate-300">
          Dave Brailsford led British Cycling to dominance by improving every aspect by just 1%:
          bike seats, tire pressure, hand-washing technique, pillow quality. Result: 178 world championships
          and 66 Olympic gold medals in 10 years.
        </div>
      </div>

      <div>
        <div class="font-semibold text-purple-300 mb-1">📈 Compound Growth</div>
        <div class="text-slate-300">
          Small improvements compound exponentially. 1% better daily = 37x better yearly.
          The formula: (1.01)^365 = 37.78. This applies to skills, habits, health, and relationships.
        </div>
      </div>

      <div>
        <div class="font-semibold text-purple-300 mb-1">🎯 Focus on Systems, Not Goals</div>
        <div class="text-slate-300">
          Don't aim to "get fit." Instead, improve your workout routine by 1% each session.
          Don't aim to "be productive." Instead, eliminate one distraction per day.
          Systems compound, goals are temporary.
        </div>
      </div>

      <div>
        <div class="font-semibold text-purple-300 mb-1">⚖️ The Plateau of Latent Potential</div>
        <div class="text-slate-300">
          Improvements often feel invisible at first. You're making progress, but it's stored up
          like potential energy. Then suddenly—breakthrough. This is why consistency matters more
          than intensity.
        </div>
      </div>

      <div>
        <div class="font-semibold text-purple-300 mb-1">💡 Examples of 1% Improvements</div>
        <div class="text-slate-300">
          • Start your workout 5 minutes earlier<br>
          • Read one page more than yesterday<br>
          • Drink one extra glass of water<br>
          • Eliminate one mindless scroll session<br>
          • Send one thoughtful message to someone<br>
          • Practice a skill for 10 extra minutes
        </div>
      </div>
    </div>
  </div>
</div>
