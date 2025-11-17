<script lang="ts">
  import { onMount } from 'svelte'

  export let xpAmount: number
  export let x: number = 0
  export let y: number = 0
  export let onComplete: (() => void) | undefined = undefined

  let visible = true

  onMount(() => {
    // Auto-hide after animation completes
    const timer = setTimeout(() => {
      visible = false
      if (onComplete) onComplete()
    }, 1000)

    return () => clearTimeout(timer)
  })
</script>

{#if visible}
  <div
    class="fixed pointer-events-none z-50 animate-xp-float-up"
    style="left: {x}px; top: {y}px;"
  >
    <div class="badge-xp text-h6 font-bold shadow-elevation-3">
      +{xpAmount} XP
    </div>
  </div>
{/if}

<style>
  /* Styles are defined in app.css */
</style>
