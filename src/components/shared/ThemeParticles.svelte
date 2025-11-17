<script lang="ts">
  import { onMount } from 'svelte'
  import type { Theme } from '$lib/types'

  export let theme: Theme
  export let particleCount: number = 10

  let particles: Array<{ id: number; delay: number; left: string; size: number }> = []

  onMount(() => {
    // Generate random particles
    particles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 10 + 10
    }))
  })
</script>

{#if theme === 'fire'}
  <!-- Fire Theme: Ember Particles -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {#each particles as particle (particle.id)}
      <div
        class="fire-particle animate-ember-rise"
        style="
          left: {particle.left};
          bottom: -20px;
          width: {particle.size}px;
          height: {particle.size}px;
          animation-delay: {particle.delay}s;
          --drift: {(Math.random() - 0.5) * 40}px;
        "
      ></div>
    {/each}
  </div>

{:else if theme === 'ocean'}
  <!-- Ocean Theme: Bubbles -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {#each particles as particle (particle.id)}
      <div
        class="ocean-bubble animate-wave"
        style="
          left: {particle.left};
          bottom: {Math.random() * 100}%;
          width: {particle.size * 2}px;
          height: {particle.size * 2}px;
          animation-delay: {particle.delay}s;
        "
      ></div>
    {/each}
  </div>

{:else if theme === 'forest'}
  <!-- Forest Theme: Falling Leaves -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {#each particles as particle (particle.id)}
      <div
        class="forest-leaf animate-leaf-fall"
        style="
          left: {particle.left};
          animation-delay: {particle.delay}s;
          animation-duration: {6 + Math.random() * 4}s;
        "
      ></div>
    {/each}
  </div>

{:else if theme === 'cyberpunk'}
  <!-- Cyber Theme: Grid + Scan Lines -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="cyber-grid absolute inset-0"></div>
    <div class="cyber-scan-line"></div>
  </div>
{/if}

<style>
  /* Styles are defined in app.css */
</style>
