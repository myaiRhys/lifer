<script lang="ts">
  import { onMount } from 'svelte'
  import { celebrateLevelUp } from '../lib/animations'
  import { soundSystem } from '../lib/sounds'

  export let visible = false
  export let level: number
  export let onClose: () => void

  onMount(() => {
    if (visible) {
      celebrateLevelUp()
      soundSystem.levelUp()
    }
  })

  function handleClose() {
    visible = false
    onClose()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose()
    }
  }
</script>

{#if visible}
  <div
    class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in"
    role="dialog"
    aria-modal="true"
    on:click={handleClose}
    on:keydown={handleKeydown}
  >
    <div class="relative bg-gradient-to-br from-yellow-500/95 via-orange-500/95 to-red-600/95 backdrop-blur-2xl rounded-3xl p-10 max-w-md animate-scale-in border-4 border-yellow-300/50 shadow-2xl shadow-yellow-500/50" on:click|stopPropagation role="document">
      <!-- Glow Effects -->
      <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-2xl opacity-50 -z-10"></div>

      <div class="text-center">
        <div class="text-8xl mb-6 animate-bounce drop-shadow-2xl">🎉</div>
        <h2 class="text-5xl font-black text-white mb-3 drop-shadow-lg tracking-wider">LEVEL UP!</h2>
        <div class="relative inline-block mb-6">
          <div class="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
          <div class="relative text-7xl font-black text-white px-8 py-4 bg-gradient-to-br from-white/20 to-transparent rounded-2xl border-2 border-white/30 backdrop-blur-sm">{level}</div>
        </div>
        <p class="text-xl text-white font-medium mb-8 drop-shadow-md">You're getting stronger! Keep pushing forward!</p>
        <button
          class="bg-white text-orange-600 px-10 py-4 rounded-2xl font-black text-xl hover:scale-110 hover:shadow-2xl hover:shadow-white/50 transition-all border-4 border-orange-200"
          on:click={handleClose}
        >
          🚀 AWESOME!
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scale-in {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  .animate-scale-in {
    animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
</style>
