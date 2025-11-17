<script lang="ts">
  import { onMount } from 'svelte'
  import confetti from 'canvas-confetti'

  export let newLevel: number
  export let onClose: (() => void) | undefined = undefined

  let visible = true
  let flashVisible = false

  onMount(() => {
    // Screen flash effect
    flashVisible = true
    setTimeout(() => {
      flashVisible = false
    }, 200)

    // Confetti burst
    const duration = 1500
    const animationEnd = Date.now() + duration

    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCF7F', '#BB86FC', '#FFD700']

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        particleCount: Math.floor(particleCount),
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2
        },
        colors: colors,
        gravity: 1.2,
        drift: 0.1,
        decay: 0.94,
        scalar: 1.2,
        ticks: 200
      })
    }, 250)

    // Auto-close after animation
    const closeTimer = setTimeout(() => {
      visible = false
      if (onClose) onClose()
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(closeTimer)
    }
  })
</script>

{#if visible}
  <!-- Screen Flash -->
  {#if flashVisible}
    <div class="fixed inset-0 bg-white pointer-events-none z-50 animate-level-up-flash"></div>
  {/if}

  <!-- Level Up Modal -->
  <div
    class="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50 animate-modal-enter"
    on:click={() => {
      visible = false
      if (onClose) onClose()
    }}
    on:keydown={(e) => e.key === 'Escape' && onClose && onClose()}
    role="dialog"
    tabindex="-1"
  >
    <div
      class="bg-bg-secondary border-2 border-accent rounded-2xl p-48 text-center shadow-elevation-5 max-w-md mx-16"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="document"
      tabindex="-1"
    >
      <!-- Level Badge -->
      <div class="flex justify-center mb-24">
        <div class="badge-level text-display animate-badge-pulse px-32 py-16">
          {newLevel}
        </div>
      </div>

      <!-- Text -->
      <h2 class="text-h2 font-bold text-text-primary mb-16 bg-gradient-to-r from-accent via-deep-purple to-accent bg-clip-text text-transparent">
        Level Up!
      </h2>
      <p class="text-body-large text-text-secondary mb-24">
        You've reached Level {newLevel}!
      </p>
      <p class="text-body text-text-muted">
        Keep up the great work!
      </p>

      <!-- Close Button -->
      <button
        class="btn btn-primary mt-32"
        on:click={() => {
          visible = false
          if (onClose) onClose()
        }}
      >
        Continue
      </button>
    </div>
  </div>
{/if}

<style>
  /* Styles are defined in app.css */
</style>
