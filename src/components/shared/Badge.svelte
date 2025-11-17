<script lang="ts">
  export let variant: 'xp' | 'level' | 'streak' | 'achievement' = 'xp'
  export let value: string | number
  export let tier: 'bronze' | 'silver' | 'gold' | undefined = undefined
  export let animate: boolean = false
</script>

{#if variant === 'achievement'}
  <div class="badge-achievement {tier} {animate ? 'animate-pulse-glow' : ''}">
    <slot />
  </div>
{:else}
  <div class="badge badge-{variant} {animate ? 'animate-badge-pulse' : ''}">
    <slot />
    {#if value}
      <span class="xp-counter">{value}</span>
    {/if}
  </div>
{/if}

<style>
  /* Styles are defined in app.css */
</style>
