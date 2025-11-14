<script lang="ts">
  import { onMount } from 'svelte'
  import { getIdentity, setIdentity, getIdentityStats, getWeeklyAlignment, getTodayAlignment } from '../lib/db'
  import type { Identity } from '../lib/types'
  import IdentityVoteCounter from './IdentityVoteCounter.svelte'
  import IdentityEvidence from './IdentityEvidence.svelte'

  let identity: Identity | null = null
  let editMode = false
  let statementInput = ''
  let stats: any = null
  let weeklyAlignment: any = null
  let todayAlignment: any = null
  let showEvidence = false

  onMount(async () => {
    await loadData()
  })

  async function loadData() {
    identity = await getIdentity()
    stats = await getIdentityStats()
    weeklyAlignment = await getWeeklyAlignment()
    todayAlignment = await getTodayAlignment()

    if (identity) {
      statementInput = identity.statement
    }
  }

  async function saveIdentity() {
    if (!statementInput.trim()) {
      alert('Please enter your identity statement')
      return
    }

    identity = await setIdentity(statementInput.trim())
    editMode = false
    await loadData()
  }

  function startEdit() {
    editMode = true
    statementInput = identity?.statement || ''
  }

  function cancelEdit() {
    editMode = false
    statementInput = identity?.statement || ''
  }

  // Example identity statements for inspiration
  const examples = [
    "completes high-leverage work every morning",
    "never misses twice",
    "chooses discipline over regret",
    "invests in 1% daily improvements",
    "shows up regardless of motivation",
    "values progress over perfection",
    "protects their morning sovereignty",
    "honors their body's signals",
    "builds habits that compound",
    "takes extreme ownership of results"
  ]

  function useExample(example: string) {
    statementInput = example
  }

  $: alignmentColor = todayAlignment && todayAlignment.percentage >= 80 ? 'text-green-400'
    : todayAlignment && todayAlignment.percentage >= 60 ? 'text-yellow-400'
    : 'text-red-400'
</script>

<div class="max-w-4xl mx-auto space-y-6">
  <!-- Header -->
  <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
    <h1 class="text-3xl font-bold mb-2">🎯 Identity-Based Habits</h1>
    <p class="text-slate-400">
      "You do not rise to the level of your goals. You fall to the level of your systems.
      But what you really become is the type of person who can achieve those goals." - James Clear
    </p>
  </div>

  <!-- Identity Statement Card -->
  <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
    {#if !identity || editMode}
      <!-- Edit Mode -->
      <h2 class="text-2xl font-bold mb-4">Who Are You Becoming?</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">
          Complete this sentence (focus on who, not what):
        </label>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-slate-400 text-lg">I am a person who</span>
          <input
            type="text"
            bind:value={statementInput}
            placeholder="..."
            class="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
            maxlength="120"
          />
        </div>
        <p class="text-sm text-slate-400">{statementInput.length}/120 characters</p>
      </div>

      <!-- Examples -->
      <div class="mb-6">
        <p class="text-sm font-medium mb-2">Need inspiration? Try one of these:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          {#each examples as example}
            <button
              on:click={() => useExample(example)}
              class="text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 hover:border-blue-500 transition-colors text-sm"
            >
              "I am a person who <span class="text-blue-400">{example}</span>"
            </button>
          {/each}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          on:click={saveIdentity}
          class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
        >
          {identity ? 'Update Identity' : 'Set My Identity'}
        </button>
        {#if identity}
          <button
            on:click={cancelEdit}
            class="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        {/if}
      </div>
    {:else}
      <!-- Display Mode -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h2 class="text-sm font-medium text-slate-400 mb-2">Your Identity</h2>
          <p class="text-2xl font-bold mb-1">
            I am a person who <span class="text-blue-400">{identity.statement}</span>
          </p>
          <p class="text-sm text-slate-500">
            Set on {new Date(identity.createdAt).toLocaleDateString()}
            {#if identity.lastUpdated !== identity.createdAt}
              • Last updated {new Date(identity.lastUpdated).toLocaleDateString()}
            {/if}
          </p>
        </div>
        <button
          on:click={startEdit}
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          ✏️ Edit
        </button>
      </div>

      <!-- Today's Alignment -->
      {#if todayAlignment}
        <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium">Today's Identity Alignment</h3>
            <span class="text-2xl font-bold {alignmentColor}">
              {todayAlignment.percentage}%
            </span>
          </div>
          <div class="w-full bg-slate-600 h-3 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
              style="width: {todayAlignment.percentage}%"
            />
          </div>
          <div class="flex items-center justify-between mt-2 text-sm">
            <span class="text-green-400">↑ {todayAlignment.votesFor} votes FOR</span>
            <span class="text-red-400">↓ {todayAlignment.votesAgainst} votes AGAINST</span>
          </div>
          <p class="text-xs text-slate-400 mt-2">
            {#if todayAlignment.percentage >= 80}
              ✨ Excellent! You're living your identity today.
            {:else if todayAlignment.percentage >= 60}
              💪 Good progress. Keep building momentum.
            {:else if todayAlignment.totalVotes > 0}
              ⚠️ Your actions today don't match who you want to become.
            {:else}
              Start taking actions to build your identity!
            {/if}
          </p>
        </div>
      {/if}
    {/if}
  </div>

  <!-- Stats Grid -->
  {#if identity && !editMode && stats}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div class="text-3xl mb-2">📊</div>
        <div class="text-sm text-slate-400">Lifetime Alignment</div>
        <div class="text-2xl font-bold">{stats.lifetimePercentage}%</div>
        <div class="text-xs text-slate-500 mt-1">{stats.totalVotes} total votes</div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div class="text-3xl mb-2">🔥</div>
        <div class="text-sm text-slate-400">Identity Streak</div>
        <div class="text-2xl font-bold">{stats.currentStreak} days</div>
        <div class="text-xs text-slate-500 mt-1">80%+ alignment</div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div class="text-3xl mb-2">📈</div>
        <div class="text-sm text-slate-400">Weekly Average</div>
        <div class="text-2xl font-bold">{weeklyAlignment.average}%</div>
        <div class="text-xs text-slate-500 mt-1">Last 7 days</div>
      </div>

      <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div class="text-3xl mb-2">⭐</div>
        <div class="text-sm text-slate-400">Evidence Collected</div>
        <div class="text-2xl font-bold">{stats.totalEvidence}</div>
        <div class="text-xs text-slate-500 mt-1">Proof you are this person</div>
      </div>
    </div>
  {/if}

  <!-- Vote Counter Widget -->
  {#if identity && !editMode}
    <IdentityVoteCounter on:voteAdded={loadData} />
  {/if}

  <!-- Evidence Section -->
  {#if identity && !editMode}
    <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">📜 Identity Evidence</h2>
        <button
          on:click={() => showEvidence = !showEvidence}
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          {showEvidence ? 'Hide' : 'Show'} Evidence ({stats?.totalEvidence || 0})
        </button>
      </div>

      {#if showEvidence}
        <p class="text-slate-400 mb-4">
          Build evidence that proves you are the person you claim to be.
          Every achievement, streak, and completion is a vote for your identity.
        </p>
        <IdentityEvidence on:evidenceUpdated={loadData} />
      {/if}
    </div>
  {/if}

  <!-- Educational Note -->
  <div class="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
    <h3 class="font-bold mb-2">💡 Why Identity-Based Habits Work</h3>
    <ul class="text-sm text-slate-300 space-y-1">
      <li>• Every action you take is a <strong>vote</strong> for the type of person you wish to become</li>
      <li>• Focus on <strong>who</strong> you want to be, not <strong>what</strong> you want to achieve</li>
      <li>• "I am a runner" is more powerful than "I want to run a marathon"</li>
      <li>• Build <strong>evidence</strong> through small wins that prove your identity to yourself</li>
      <li>• Target: <strong>80%+ alignment</strong> = you're becoming that person</li>
    </ul>
  </div>
</div>
