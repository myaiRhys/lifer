<script lang="ts">
  import { onMount } from 'svelte'
  import { getTasks, createTask, updateTask, deleteTask, completeTask, createRecurringTaskTemplate, spawnTodaysRecurringTasks, isInBPTWindow } from '../lib/db'
  import { getUserState, addXP } from '../lib/db/userState'
  import { checkAndUnlockAchievements } from '../lib/db/achievements'
  import { celebrateTaskComplete, showFloatingXP, hapticSuccess } from '../lib/animations'
  import { soundSystem } from '../lib/sounds'
  import type { Task, Achievement } from '../lib/types'
  import LevelUpModal from './LevelUpModal.svelte'
  import AchievementNotification from './AchievementNotification.svelte'
  import FourLawsOptimizer from './FourLawsOptimizer.svelte'

  let tasks: Task[] = []
  let showAddForm = false
  let showQuickCapture = false
  let editingTask: Task | null = null
  let showLevelUp = false
  let newLevel = 1
  let newAchievement: Achievement | null = null

  // Form fields
  let title = ''
  let description = ''
  let leverageScore: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 5
  let isMorningTask = false
  let isRecurring = false
  let outcomeId = 'none'

  // Four Laws optimization
  let showFourLaws = false
  let fourLaws: Task['fourLaws'] = {
    obvious: { score: 5, cue: '', time: '', location: '' },
    attractive: { score: 5, bundle: '' },
    easy: { score: 5, frictionSteps: 1, gateway: '' },
    satisfying: { score: 5, reward: '' },
    totalScore: 20
  }

  // Quick capture
  let quickTitle = ''

  onMount(async () => {
    await loadTasks()

    // Keyboard shortcut for quick capture
    function handleKeyboard(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        showQuickCapture = !showQuickCapture
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  })

  async function loadTasks() {
    tasks = await getTasks()
    tasks.sort((a, b) => {
      if (b.leverageScore !== a.leverageScore) {
        return b.leverageScore - a.leverageScore
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  async function handleAddTask() {
    if (!title.trim()) return

    if (isRecurring) {
      // Create recurring task template
      await createRecurringTaskTemplate({
        title: title.trim(),
        description: description.trim() || undefined,
        leverageScore,
        outcomeId,
        isMorningTask,
        fourLaws: showFourLaws ? fourLaws : undefined
      })

      // Spawn today's instance
      await spawnTodaysRecurringTasks()
    } else {
      // Create one-time task
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        leverageScore,
        outcomeId,
        isMorningTask,
        isRecurring: false,
        fourLaws: showFourLaws ? fourLaws : undefined
      })
    }

    resetForm()
    await loadTasks()
  }

  async function handleUpdateTask() {
    if (!editingTask || !title.trim()) return

    await updateTask(editingTask.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      leverageScore,
      isMorningTask,
      fourLaws: showFourLaws ? fourLaws : undefined
    })

    resetForm()
    await loadTasks()
  }

  async function handleDeleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id)
      await loadTasks()
    }
  }

  async function handleCompleteTask(task: Task, event: MouseEvent) {
    // Check if in BPT window for multiplier
    const inBPT = await isInBPTWindow()
    const baseXP = task.leverageScore * 10
    const multiplier = inBPT ? 2 : 1
    const xp = baseXP * multiplier

    const oldState = await getUserState()
    const oldLevel = oldState?.level || 1

    // Complete task and add XP
    await completeTask(task.id, xp)
    const newState = await addXP(xp)

    // Animations and sounds
    celebrateTaskComplete(task.leverageScore)
    soundSystem.taskComplete(task.leverageScore)
    hapticSuccess()

    // Show floating XP with BPT indicator
    if (event.target instanceof HTMLElement) {
      showFloatingXP(event.target, xp)
    }

    // Alert with BPT bonus info
    if (inBPT) {
      setTimeout(() => {
        alert(`🔥 BPT BONUS! Task completed during your peak time.\n+${xp} XP (2x multiplier)`)
      }, 500)
    }

    // Check for level up
    if (newState && newState.level > oldLevel) {
      newLevel = newState.level
      showLevelUp = true
    }

    // Check for new achievements
    const achievements = await checkAndUnlockAchievements()
    if (achievements.length > 0) {
      newAchievement = achievements[0] // Show first achievement
    }

    await loadTasks()
  }

  function startEdit(task: Task) {
    editingTask = task
    title = task.title
    description = task.description || ''
    leverageScore = task.leverageScore
    isMorningTask = task.isMorningTask
    isRecurring = task.isRecurring

    // Load Four Laws data if it exists
    if (task.fourLaws) {
      showFourLaws = true
      fourLaws = task.fourLaws
    } else {
      showFourLaws = false
      fourLaws = {
        obvious: { score: 5, cue: '', time: '', location: '' },
        attractive: { score: 5, bundle: '' },
        easy: { score: 5, frictionSteps: 1, gateway: '' },
        satisfying: { score: 5, reward: '' },
        totalScore: 20
      }
    }

    showAddForm = true
  }

  function resetForm() {
    showAddForm = false
    editingTask = null
    title = ''
    description = ''
    leverageScore = 5
    isMorningTask = false
    isRecurring = false
    showFourLaws = false
    fourLaws = {
      obvious: { score: 5, cue: '', time: '', location: '' },
      attractive: { score: 5, bundle: '' },
      easy: { score: 5, frictionSteps: 1, gateway: '' },
      satisfying: { score: 5, reward: '' },
      totalScore: 20
    }
  }

  async function handleQuickCapture() {
    if (!quickTitle.trim()) return

    await createTask({
      title: quickTitle.trim(),
      leverageScore: 5, // Default to medium leverage
      outcomeId: 'none',
      isMorningTask: false,
      scheduledFor: new Date().toISOString()
    })

    quickTitle = ''
    showQuickCapture = false
    await loadTasks()
  }

  function getLeverageColor(score: number): string {
    if (score >= 8) return 'text-green-400'
    if (score >= 5) return 'text-yellow-400'
    return 'text-orange-400'
  }

  $: activeTasks = tasks.filter(t => !t.completed)
  $: completedTasks = tasks.filter(t => t.completed)
</script>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="flex justify-between items-center mb-8 animate-fade-in-scale">
    <div class="animate-slide-in-left">
      <h2 class="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Tasks</h2>
      <p class="text-slate-300 text-base mt-2 font-medium">
        <span class="text-blue-400 font-bold">{activeTasks.length}</span> active ·
        <span class="text-green-400 font-bold">{completedTasks.length}</span> completed
      </p>
    </div>
    <button
      on:click={() => showAddForm = !showAddForm}
      class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-purple-500/50 transition-all hover:scale-105 border-2 border-blue-400/30 animate-slide-in-right"
    >
      {showAddForm ? '❌ Cancel' : '✨ New Task'}
    </button>
  </div>

  <!-- Add/Edit Form -->
  {#if showAddForm}
    <div class="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl p-6 mb-8 shadow-2xl shadow-purple-500/30 animate-fade-in-scale">
      <h3 class="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{editingTask ? '✏️ Edit Task' : '✨ New Task'}</h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            bind:value={title}
            placeholder="What needs to be done?"
            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea
            bind:value={description}
            placeholder="Add more details..."
            rows="3"
            class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">
              Leverage Score: <span class={getLeverageColor(leverageScore)}>{leverageScore}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              bind:value={leverageScore}
              class="w-full"
            />
            <div class="flex justify-between text-xs text-slate-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={isMorningTask}
                class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-sm font-medium">Morning Task (1st 90min)</span>
            </label>
            <p class="text-xs text-slate-500 mt-2">
              Complete in first 90 minutes for bonus XP
            </p>
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={isRecurring}
                class="w-5 h-5 rounded border-slate-600"
              />
              <span class="text-sm font-medium">Recurring (Daily)</span>
            </label>
            <p class="text-xs text-slate-500 mt-2">
              Auto-creates this task every day
            </p>
          </div>
        </div>

        <!-- Four Laws Optimizer Toggle -->
        <div class="border-t border-slate-700 pt-4">
          <button
            type="button"
            on:click={() => showFourLaws = !showFourLaws}
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg transition-colors"
          >
            <span>⚡</span>
            <span class="font-medium">{showFourLaws ? 'Hide' : 'Optimize with'} Four Laws</span>
            <span class="text-xs opacity-75">(James Clear)</span>
          </button>
          <p class="text-xs text-slate-400 mt-2">
            Use behavioral science to make this habit stick. Target: 32/40 points (80%+)
          </p>
        </div>

        <!-- Four Laws Optimizer Component -->
        {#if showFourLaws}
          <div class="border-t border-slate-700 pt-4">
            <FourLawsOptimizer
              bind:fourLaws={fourLaws}
              habitName={title || 'this task'}
              on:update={(e) => fourLaws = e.detail}
            />
          </div>
        {/if}

        <div class="flex gap-4">
          <button
            on:click={editingTask ? handleUpdateTask : handleAddTask}
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/50 hover:shadow-purple-500/50 transition-all hover:scale-105 border-2 border-blue-400/30"
          >
            {editingTask ? '💾 Update Task' : '✨ Add Task'}
          </button>
          <button
            on:click={resetForm}
            class="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl font-bold text-lg backdrop-blur-sm transition-all hover:scale-105 border-2 border-slate-500/30"
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Active Tasks -->
  {#if activeTasks.length > 0}
    <div class="space-y-4 mb-6">
      {#each activeTasks as task, index (task.id)}
        <div class="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 {task.leverageScore >= 8 ? 'border-red-500/50 hover:border-red-400 hover:shadow-2xl hover:shadow-red-500/30' : task.leverageScore >= 5 ? 'border-orange-500/50 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/30' : 'border-blue-500/50 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/30'} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up {index === 0 ? 'stagger-1' : index === 1 ? 'stagger-2' : index === 2 ? 'stagger-3' : index === 3 ? 'stagger-4' : index === 4 ? 'stagger-5' : 'stagger-6'} opacity-0">
          <div class="flex items-start gap-4">
            <button
              on:click={(e) => handleCompleteTask(task, e)}
              class="mt-1 w-8 h-8 border-3 border-slate-500 rounded-xl hover:border-green-400 hover:bg-green-500/20 hover:scale-110 transition-all duration-200 flex-shrink-0 flex items-center justify-center group-hover:border-green-400"
              title="Complete task"
            >
              <span class="opacity-0 group-hover:opacity-100 text-green-400 text-sm transition-opacity">✓</span>
            </button>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">{task.title}</h3>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <div class="px-4 py-2 rounded-xl font-black text-lg bg-gradient-to-br {task.leverageScore >= 8 ? 'from-red-600 to-red-700 shadow-lg shadow-red-500/50' : task.leverageScore >= 5 ? 'from-orange-600 to-orange-700 shadow-lg shadow-orange-500/50' : 'from-blue-600 to-blue-700 shadow-lg shadow-blue-500/50'} border border-white/20">
                    L{task.leverageScore}
                  </div>
                  {#if task.isMorningTask}
                    <span class="text-3xl animate-pulse" title="Morning task">☀️</span>
                  {/if}
                  {#if task.isRecurring}
                    <span class="text-2xl text-blue-400" title="Recurring daily">🔄</span>
                  {/if}
                </div>
              </div>

              {#if task.description}
                <p class="text-base text-slate-300 mt-3 leading-relaxed">{task.description}</p>
              {/if}

              <div class="flex gap-3 mt-4">
                <button
                  on:click={() => startEdit(task)}
                  class="px-4 py-2 text-sm font-medium text-blue-300 hover:text-blue-200 bg-blue-900/30 hover:bg-blue-800/50 rounded-lg transition-all hover:scale-105"
                >
                  ✏️ Edit
                </button>
                <button
                  on:click={() => handleDeleteTask(task.id)}
                  class="px-4 py-2 text-sm font-medium text-red-300 hover:text-red-200 bg-red-900/30 hover:bg-red-800/50 rounded-lg transition-all hover:scale-105"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center py-12 text-slate-500">
      <p class="text-lg">No active tasks</p>
      <p class="text-sm mt-2">Click "New Task" to add your first high-leverage task</p>
    </div>
  {/if}

  <!-- Completed Tasks -->
  {#if completedTasks.length > 0}
    <details class="mt-6">
      <summary class="cursor-pointer text-sm font-medium text-slate-400 hover:text-slate-300">
        Completed Tasks ({completedTasks.length})
      </summary>
      <div class="space-y-2 mt-3">
        {#each completedTasks as task (task.id)}
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 opacity-60">
            <div class="flex items-start gap-3">
              <div class="mt-1 w-5 h-5 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
                <span class="text-white text-xs">✓</span>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-medium line-through">{task.title}</h3>
                  <span class="text-slate-500 text-xs flex-shrink-0">
                    +{task.xpEarned || 0} XP
                  </span>
                </div>
                {#if task.completedAt}
                  <p class="text-xs text-slate-500 mt-1">
                    Completed {new Date(task.completedAt).toLocaleDateString()}
                  </p>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </details>
  {/if}
</div>

<!-- Quick Capture Modal -->
{#if showQuickCapture}
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" on:click={() => showQuickCapture = false}>
    <div class="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-blue-500/80 rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-blue-500/50 animate-in" on:click|stopPropagation>
      <div class="mb-6">
        <h3 class="text-3xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">⚡ Quick Capture</h3>
        <p class="text-base text-slate-300">Press <kbd class="px-3 py-1.5 bg-slate-700/80 rounded-lg text-sm font-mono border border-slate-500">Ctrl+K</kbd> or <kbd class="px-3 py-1.5 bg-slate-700/80 rounded-lg text-sm font-mono border border-slate-500">⌘K</kbd> anytime</p>
      </div>

      <form on:submit|preventDefault={handleQuickCapture}>
        <input
          type="text"
          bind:value={quickTitle}
          placeholder="What needs to be done?"
          autofocus
          class="w-full bg-slate-900/80 border-2 border-slate-600 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/30 mb-5 transition-all placeholder-slate-500"
        />

        <div class="bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded-xl p-4 mb-6 text-base text-slate-300 border border-slate-700/50">
          <div class="mb-2 font-bold text-blue-400">Defaults:</div>
          <ul class="list-disc list-inside space-y-1.5">
            <li>Leverage: 5 (medium)</li>
            <li>You can edit details after creating</li>
          </ul>
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            class="flex-1 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl font-bold text-lg backdrop-blur-sm transition-all hover:scale-105 border-2 border-slate-500/30"
            on:click={() => showQuickCapture = false}
          >
            Cancel (Esc)
          </button>
          <button
            type="submit"
            class="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/50 hover:shadow-purple-500/50 transition-all hover:scale-105 border-2 border-blue-400/30 disabled:opacity-50 disabled:scale-100"
            disabled={!quickTitle.trim()}
          >
            Create (Enter)
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Modals -->
<LevelUpModal bind:visible={showLevelUp} level={newLevel} onClose={() => showLevelUp = false} />
<AchievementNotification achievement={newAchievement} onClose={() => newAchievement = null} />
