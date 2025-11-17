<script lang="ts">
  import { onMount } from 'svelte'
  import { getUserState, getSettings, updateSettings } from '../lib/db'
  import { applyTheme, themes, getStoredTheme, type Theme } from '../lib/themes'
  import DashboardStats from './DashboardStats.svelte'
  import Badge from './shared/Badge.svelte'
  import Button from './shared/Button.svelte'
  import SkeletonLoader from './shared/SkeletonLoader.svelte'
  import type { UserState, AppSettings } from '../lib/types'

  let userState: UserState | null = null
  let settings: AppSettings | null = null
  let loading = true
  let currentTheme: Theme = getStoredTheme()

  onMount(async () => {
    await loadProfile()
  })

  async function loadProfile() {
    loading = true
    userState = await getUserState()
    settings = await getSettings()
    loading = false
  }

  async function handleThemeChange(theme: Theme) {
    currentTheme = theme
    applyTheme(theme)
    if (settings) {
      await updateSettings({ theme })
      settings = await getSettings()
    }
  }

  async function toggleSound() {
    if (!settings) return
    await updateSettings({ soundEnabled: !settings.soundEnabled })
    settings = await getSettings()
  }

  async function toggleNotifications() {
    if (!settings) return
    await updateSettings({ notificationsEnabled: !settings.notificationsEnabled })
    settings = await getSettings()
  }

  function formatDate(date: Date | null): string {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function getMembershipDays(): number {
    if (!userState?.createdAt) return 0
    const created = new Date(userState.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
</script>

<div class="profile-page max-w-4xl mx-auto px-4 pb-24">
  {#if loading}
    <SkeletonLoader variant="profile" count={1} />
  {:else if userState}
    <!-- Profile Header -->
    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>

      <div class="relative z-10">
        <div class="flex items-start gap-6 mb-6">
          <!-- Avatar -->
          <div class="avatar-wrapper flex flex-col items-center gap-3">
            <div class="avatar w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl rounded-full border-4 border-slate-700">
              L
            </div>
            <div class="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg">
              Lvl {userState.level}
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-white mb-2">Lifer Member</h1>
            <p class="text-sm text-slate-300 mb-4">
              Member for {getMembershipDays()} days • Joined {formatDate(userState.createdAt)}
            </p>

            <!-- Quick Stats -->
            <div class="flex flex-wrap gap-3">
              <div class="bg-blue-500/20 border border-blue-500/30 px-3 py-2 rounded-lg text-sm">
                <span class="mr-1">✨</span> {userState.totalXPEarned.toLocaleString()} XP
              </div>
              <div class="bg-orange-500/20 border border-orange-500/30 px-3 py-2 rounded-lg text-sm">
                <span class="mr-1">🔥</span> {userState.currentStreak} Streak
              </div>
              <div class="bg-green-500/20 border border-green-500/30 px-3 py-2 rounded-lg text-sm">
                <span class="mr-1">🏆</span> {userState.tasksCompleted || 0} Tasks
              </div>
            </div>
          </div>
        </div>

        <!-- Bio / Description -->
        <div class="bg-slate-900/50 border border-slate-600 rounded-xl p-4">
          <p class="text-sm text-slate-300 text-center italic">
            "Building a better life, one day at a time."
          </p>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <span>📊</span> Your Progress
      </h2>
      <DashboardStats {userState} />
    </div>

    <!-- Settings Section -->
    {#if settings}
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6 shadow-lg">
        <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <span>⚙️</span> Settings
        </h2>

        <!-- Theme Selection -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-white mb-3">Theme</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {#each Object.entries(themes) as [key, theme]}
              <button
                on:click={() => handleThemeChange(key)}
                class="bg-slate-700 border-2 rounded-xl p-4 text-center transition-all hover:scale-105 active:scale-95 {currentTheme === key ? 'border-blue-500 shadow-lg shadow-blue-500/30' : 'border-slate-600 hover:border-slate-500'}"
              >
                <div class="text-2xl mb-2">{theme.name}</div>
                <div class="text-xs text-slate-400">{key}</div>
                {#if currentTheme === key}
                  <div class="mt-2 text-blue-400 text-xs font-semibold">✓ Active</div>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <!-- Preferences -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-white mb-3">Preferences</h3>

          <!-- Sound Toggle -->
          <div class="flex items-center justify-between bg-slate-700 border border-slate-600 rounded-xl p-4">
            <div>
              <p class="text-sm font-medium text-white">Sound Effects</p>
              <p class="text-xs text-slate-400">Play sounds for interactions</p>
            </div>
            <button
              on:click={toggleSound}
              class="toggle-button {settings.soundEnabled ? 'active' : ''}"
              aria-label="Toggle sound effects"
            >
              <div class="toggle-slider"></div>
            </button>
          </div>

          <!-- Notifications Toggle -->
          <div class="flex items-center justify-between bg-slate-700 border border-slate-600 rounded-xl p-4">
            <div>
              <p class="text-sm font-medium text-white">Notifications</p>
              <p class="text-xs text-slate-400">Receive reminder notifications</p>
            </div>
            <button
              on:click={toggleNotifications}
              class="toggle-button {settings.notificationsEnabled ? 'active' : ''}"
              aria-label="Toggle notifications"
            >
              <div class="toggle-slider"></div>
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Account Actions -->
    <div class="space-y-3">
      <Button variant="secondary" fullWidth={true} onclick={() => window.location.reload()}>
        <span class="mr-2">🔄</span> Refresh Data
      </Button>
      <Button variant="ghost" fullWidth={true}>
        <span class="mr-2">📤</span> Export Data
      </Button>
    </div>
  {/if}
</div>

<style>
  /* Toggle Button */
  .toggle-button {
    position: relative;
    width: 56px;
    height: 32px;
    background: var(--color-bg-secondary, #1e293b);
    border: 2px solid var(--color-border, #475569);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .toggle-button.active {
    background: var(--color-accent, #3b82f6);
    border-color: var(--color-accent, #3b82f6);
  }

  .toggle-slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .toggle-button.active .toggle-slider {
    transform: translateX(24px);
  }
</style>
