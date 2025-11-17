<script lang="ts">
  export let value: number = 0 // 0-100
  export let max: number = 100
  export let variant: 'linear' | 'circular' = 'linear'
  export let showLabel: boolean = false
  export let label: string = ''

  $: percentage = Math.min(100, Math.max(0, (value / max) * 100))
  $: circumference = variant === 'circular' ? 2 * Math.PI * 54 : 0
  $: strokeDashoffset = circumference - (percentage / 100) * circumference
</script>

{#if variant === 'linear'}
  <div class="space-y-2">
    {#if showLabel && label}
      <div class="flex justify-between items-center">
        <span class="text-body-small text-text-secondary">{label}</span>
        <span class="text-body-small text-text-secondary font-semibold">{Math.round(percentage)}%</span>
      </div>
    {/if}
    <div class="progress-bar">
      <div
        class="progress-bar-fill"
        style="width: {percentage}%"
      ></div>
    </div>
  </div>
{:else}
  <div class="progress-circular">
    <svg width="120" height="120" class="transform -rotate-90">
      <!-- Background circle -->
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        stroke-width="8"
      />
      <!-- Progress circle -->
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="url(#progress-gradient)"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={strokeDashoffset}
        class="transition-all duration-slower ease-smooth"
      />
      <defs>
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #2C7CEC" />
          <stop offset="100%" style="stop-color: #BB86FC" />
        </linearGradient>
      </defs>
    </svg>
    <div class="progress-circular-text text-accent">
      <slot>{Math.round(percentage)}%</slot>
    </div>
  </div>
{/if}

<style>
  /* Styles are defined in app.css */
</style>
