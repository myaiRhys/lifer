<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import { getTodayVotes, addIdentityVote } from '../lib/db'
  import type { IdentityVote } from '../lib/types'

  const dispatch = createEventDispatcher()

  let todayVotes: IdentityVote[] = []
  let showAddVote = false
  let newVoteAction = ''
  let newVoteDirection: 'for' | 'against' = 'for'

  onMount(async () => {
    await loadVotes()
  })

  async function loadVotes() {
    todayVotes = await getTodayVotes()
  }

  async function handleAddVote() {
    if (!newVoteAction.trim()) {
      alert('Please describe the action')
      return
    }

    await addIdentityVote(newVoteAction.trim(), 'other', newVoteDirection)

    // Reset form
    newVoteAction = ''
    newVoteDirection = 'for'
    showAddVote = false

    // Reload and notify parent
    await loadVotes()
    dispatch('voteAdded')
  }

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  function getVoteIcon(vote: IdentityVote): string {
    const icons = {
      task: '✅',
      practice: '♻️',
      chore: '🏠',
      focus: '⏱️',
      other: '📝'
    }
    return icons[vote.actionType] || '📝'
  }

  $: votesFor = todayVotes.filter(v => v.direction === 'for')
  $: votesAgainst = todayVotes.filter(v => v.direction === 'against')
</script>

<div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-2xl font-bold">🗳️ Today's Votes</h2>
    <button
      on:click={() => showAddVote = !showAddVote}
      class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium"
    >
      + Manual Vote
    </button>
  </div>

  <p class="text-slate-400 text-sm mb-4">
    Every action is a vote for or against your identity. Track what you did today.
  </p>

  <!-- Add Vote Form -->
  {#if showAddVote}
    <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-4">
      <h3 class="font-medium mb-3">Add Manual Vote</h3>

      <input
        type="text"
        bind:value={newVoteAction}
        placeholder="What did you do? (e.g., 'Completed morning workout')"
        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 mb-3"
      />

      <div class="flex items-center gap-4 mb-3">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            bind:group={newVoteDirection}
            value="for"
            class="w-4 h-4"
          />
          <span class="text-green-400">✓ Vote FOR identity</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            bind:group={newVoteDirection}
            value="against"
            class="w-4 h-4"
          />
          <span class="text-red-400">✗ Vote AGAINST identity</span>
        </label>
      </div>

      <div class="flex gap-2">
        <button
          on:click={handleAddVote}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          Add Vote
        </button>
        <button
          on:click={() => {
            showAddVote = false
            newVoteAction = ''
          }}
          class="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}

  <!-- Votes Display -->
  {#if todayVotes.length === 0}
    <div class="text-center py-8 text-slate-400">
      <p class="text-4xl mb-2">🎯</p>
      <p>No votes yet today.</p>
      <p class="text-sm mt-1">Complete tasks, practices, or add manual votes to build your identity.</p>
    </div>
  {:else}
    <div class="space-y-4">
      <!-- Votes FOR -->
      {#if votesFor.length > 0}
        <div>
          <h3 class="font-medium text-green-400 mb-2 flex items-center gap-2">
            <span>✓ Votes FOR Identity</span>
            <span class="text-sm bg-green-900/30 px-2 py-1 rounded">{votesFor.length}</span>
          </h3>
          <div class="space-y-2">
            {#each votesFor as vote}
              <div class="bg-green-900/10 border border-green-900/30 rounded-lg p-3">
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-2">
                    <span class="text-xl">{getVoteIcon(vote)}</span>
                    <div>
                      <p class="font-medium">{vote.action}</p>
                      {#if vote.context}
                        <p class="text-sm text-slate-400">{vote.context}</p>
                      {/if}
                    </div>
                  </div>
                  <span class="text-xs text-slate-500">{formatTime(vote.timestamp)}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Votes AGAINST -->
      {#if votesAgainst.length > 0}
        <div>
          <h3 class="font-medium text-red-400 mb-2 flex items-center gap-2">
            <span>✗ Votes AGAINST Identity</span>
            <span class="text-sm bg-red-900/30 px-2 py-1 rounded">{votesAgainst.length}</span>
          </h3>
          <div class="space-y-2">
            {#each votesAgainst as vote}
              <div class="bg-red-900/10 border border-red-900/30 rounded-lg p-3">
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-2">
                    <span class="text-xl">{getVoteIcon(vote)}</span>
                    <div>
                      <p class="font-medium">{vote.action}</p>
                      {#if vote.context}
                        <p class="text-sm text-slate-400">{vote.context}</p>
                      {/if}
                    </div>
                  </div>
                  <span class="text-xs text-slate-500">{formatTime(vote.timestamp)}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Educational Note -->
  <div class="mt-4 bg-blue-900/10 border border-blue-900/30 rounded-lg p-3">
    <p class="text-sm text-slate-300">
      <strong>💡 Tip:</strong> Most votes are added automatically when you complete tasks and practices.
      Use manual votes for actions not tracked in Lifer.
    </p>
  </div>
</div>
