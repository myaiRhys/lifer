<script lang="ts">
  import { onMount } from 'svelte'
  import { getUserState, updateUserState, AVAILABLE_POWERUPS, purchasePowerUp, getUnusedPowerUps, activatePowerUp, getActivePowerUps } from '../lib/db'
  import type { UserState, PurchasedPowerUp, PowerUpType } from '../lib/types'
  import { celebrateAchievement } from '../lib/animations'
  import { soundSystem } from '../lib/sounds'

  let userState: UserState | null = null
  let inventory: PurchasedPowerUp[] = []
  let activePowerUps: PurchasedPowerUp[] = []
  let selectedTab: 'shop' | 'inventory' = 'shop'

  onMount(async () => {
    await loadData()
  })

  async function loadData() {
    userState = await getUserState()
    inventory = await getUnusedPowerUps()
    activePowerUps = await getActivePowerUps()
  }

  async function handlePurchase(type: PowerUpType, cost: number) {
    if (!userState || userState.xp < cost) return

    const result = await purchasePowerUp(type, cost, userState.xp)

    if (result.success && result.newXP !== undefined) {
      await updateUserState({ xp: result.newXP })
      celebrateAchievement()
      soundSystem.powerUpActivated()
      await loadData()
    }
  }

  async function handleActivate(powerUpId: string) {
    const activated = await activatePowerUp(powerUpId)
    if (activated) {
      celebrateAchievement()
      soundSystem.powerUpActivated()
      await loadData()
    }
  }

  function getRemainingTime(expiresAt: string): string {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()

    if (diff <= 0) return 'Expired'

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  function getPowerUpIcon(type: PowerUpType): string {
    const powerUp = AVAILABLE_POWERUPS.find(p => p.type === type)
    return powerUp?.icon || '✨'
  }

  function getPowerUpName(type: PowerUpType): string {
    const powerUp = AVAILABLE_POWERUPS.find(p => p.type === type)
    return powerUp?.name || 'Power-Up'
  }

  function getPowerUpDescription(type: PowerUpType): string {
    const powerUp = AVAILABLE_POWERUPS.find(p => p.type === type)
    return powerUp?.description || ''
  }
</script>

<div class="max-w-4xl mx-auto">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-3xl font-bold">Power-Up Shop</h2>
    {#if userState}
      <div class="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2">
        <span class="text-sm text-slate-400">Your XP:</span>
        <span class="text-xl font-bold text-blue-400 ml-2">{userState.xp}</span>
      </div>
    {/if}
  </div>

  <!-- Tab Navigation -->
  <div class="flex gap-2 mb-6 border-b border-slate-700">
    <button
      class="px-4 py-2 font-medium transition-colors {selectedTab === 'shop' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'}"
      on:click={() => selectedTab = 'shop'}
    >
      Shop
    </button>
    <button
      class="px-4 py-2 font-medium transition-colors {selectedTab === 'inventory' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'}"
      on:click={() => selectedTab = 'inventory'}
    >
      Inventory {inventory.length > 0 ? `(${inventory.length})` : ''}
    </button>
  </div>

  {#if selectedTab === 'shop'}
    <!-- Shop View -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each AVAILABLE_POWERUPS as powerUp}
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <span class="text-4xl">{powerUp.icon}</span>
              <div>
                <h3 class="font-bold text-lg">{powerUp.name}</h3>
                <p class="text-xs text-slate-400">
                  {#if powerUp.duration}
                    {powerUp.duration >= 60 ? `${powerUp.duration / 60}h` : `${powerUp.duration}m`} duration
                  {/if}
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-slate-400">Cost</div>
              <div class="text-xl font-bold text-yellow-400">{powerUp.cost} XP</div>
            </div>
          </div>

          <p class="text-sm text-slate-300 mb-4">{powerUp.description}</p>

          <button
            class="w-full py-2 rounded-lg font-medium transition-all {userState && userState.xp >= powerUp.cost ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}"
            disabled={!userState || userState.xp < powerUp.cost}
            on:click={() => handlePurchase(powerUp.type, powerUp.cost)}
          >
            {userState && userState.xp >= powerUp.cost ? 'Purchase' : 'Not Enough XP'}
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Inventory View -->
    <div class="space-y-6">
      {#if activePowerUps.length > 0}
        <div>
          <h3 class="text-xl font-bold mb-3 text-green-400">Active Power-Ups</h3>
          <div class="space-y-2">
            {#each activePowerUps as powerUp}
              <div class="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-3xl">{getPowerUpIcon(powerUp.powerUpType)}</span>
                    <div>
                      <h4 class="font-bold">{getPowerUpName(powerUp.powerUpType)}</h4>
                      <p class="text-xs text-slate-400">{getPowerUpDescription(powerUp.powerUpType)}</p>
                    </div>
                  </div>
                  {#if powerUp.expiresAt}
                    <div class="text-right">
                      <div class="text-sm font-medium text-green-400">Active</div>
                      <div class="text-xs text-slate-400">{getRemainingTime(powerUp.expiresAt)}</div>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if inventory.length > 0}
        <div>
          <h3 class="text-xl font-bold mb-3">Unused Power-Ups</h3>
          <div class="space-y-2">
            {#each inventory as powerUp}
              <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-3xl">{getPowerUpIcon(powerUp.powerUpType)}</span>
                    <div>
                      <h4 class="font-bold">{getPowerUpName(powerUp.powerUpType)}</h4>
                      <p class="text-xs text-slate-400">{getPowerUpDescription(powerUp.powerUpType)}</p>
                    </div>
                  </div>
                  <button
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    on:click={() => handleActivate(powerUp.id)}
                  >
                    Activate
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {:else if activePowerUps.length === 0}
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <p class="text-slate-400">No power-ups in your inventory</p>
          <p class="text-sm text-slate-500 mt-2">Purchase some from the shop to get started!</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
