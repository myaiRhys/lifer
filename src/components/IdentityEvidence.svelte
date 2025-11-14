<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import { getIdentityEvidence, addIdentityEvidence, deleteIdentityEvidence } from '../lib/db'
  import type { IdentityEvidence } from '../lib/types'

  const dispatch = createEventDispatcher()

  let evidence: IdentityEvidence[] = []
  let showAddForm = false
  let newDescription = ''
  let newCategory: IdentityEvidence['category'] = 'custom'

  onMount(async () => {
    await loadEvidence()
  })

  async function loadEvidence() {
    evidence = await getIdentityEvidence()
    // Sort by date, newest first
    evidence.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  }

  async function handleAddEvidence() {
    if (!newDescription.trim()) {
      alert('Please describe the evidence')
      return
    }

    await addIdentityEvidence(newDescription.trim(), newCategory)

    // Reset form
    newDescription = ''
    newCategory = 'custom'
    showAddForm = false

    // Reload and notify parent
    await loadEvidence()
    dispatch('evidenceUpdated')
  }

  async function handleDeleteEvidence(evidenceId: string) {
    if (!confirm('Remove this evidence?')) return

    await deleteIdentityEvidence(evidenceId)
    await loadEvidence()
    dispatch('evidenceUpdated')
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  function getCategoryIcon(category: IdentityEvidence['category']): string {
    const icons = {
      achievement: '🏆',
      streak: '🔥',
      completion: '✅',
      custom: '⭐'
    }
    return icons[category] || '⭐'
  }

  function getCategoryLabel(category: IdentityEvidence['category']): string {
    const labels = {
      achievement: 'Achievement',
      streak: 'Streak Milestone',
      completion: 'Completion',
      custom: 'Custom Evidence'
    }
    return labels[category] || 'Evidence'
  }

  $: groupedEvidence = evidence.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<IdentityEvidence['category'], IdentityEvidence[]>)
</script>

<div>
  <!-- Add Evidence Button -->
  <div class="mb-4 flex justify-end">
    <button
      on:click={() => showAddForm = !showAddForm}
      class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium"
    >
      + Add Evidence
    </button>
  </div>

  <!-- Add Evidence Form -->
  {#if showAddForm}
    <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-4">
      <h3 class="font-medium mb-3">Add Evidence</h3>

      <textarea
        bind:value={newDescription}
        placeholder="Describe the proof that you are this person (e.g., '30-day meditation streak', 'Completed 100 high-leverage tasks')"
        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 mb-3 h-20 resize-none"
      />

      <div class="mb-3">
        <label class="block text-sm font-medium mb-2">Category</label>
        <select
          bind:value={newCategory}
          class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="custom">Custom Evidence</option>
          <option value="completion">Major Completion</option>
          <option value="streak">Streak Milestone</option>
          <option value="achievement">Achievement</option>
        </select>
      </div>

      <div class="flex gap-2">
        <button
          on:click={handleAddEvidence}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          Add Evidence
        </button>
        <button
          on:click={() => {
            showAddForm = false
            newDescription = ''
          }}
          class="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}

  <!-- Evidence Display -->
  {#if evidence.length === 0}
    <div class="text-center py-8 text-slate-400">
      <p class="text-4xl mb-2">📜</p>
      <p>No evidence collected yet.</p>
      <p class="text-sm mt-1">Build proof of your identity through achievements, streaks, and completions.</p>
    </div>
  {:else}
    <div class="space-y-6">
      {#each Object.entries(groupedEvidence) as [category, items]}
        <div>
          <h3 class="font-medium text-slate-300 mb-3 flex items-center gap-2">
            <span>{getCategoryIcon(category)}</span>
            <span>{getCategoryLabel(category)}</span>
            <span class="text-sm text-slate-500">({items.length})</span>
          </h3>

          <div class="space-y-2">
            {#each items as item}
              <div class="bg-slate-700/30 border border-slate-600 rounded-lg p-4 group hover:border-slate-500 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-medium mb-1">{item.description}</p>
                    <p class="text-xs text-slate-500">
                      Added {formatDate(item.addedAt)}
                    </p>
                  </div>
                  <button
                    on:click={() => handleDeleteEvidence(item.id)}
                    class="ml-4 px-2 py-1 text-red-400 hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove evidence"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Educational Note -->
  <div class="mt-6 bg-blue-900/10 border border-blue-900/30 rounded-lg p-3">
    <p class="text-sm text-slate-300">
      <strong>💡 Build Your Case:</strong> Evidence is proof to yourself that you are the person you claim to be.
      Celebrate every milestone, streak, and achievement. The more evidence you collect, the stronger your identity becomes.
    </p>
  </div>
</div>
