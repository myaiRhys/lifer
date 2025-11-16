<!--
@component
Loading Skeleton Component
Displays animated loading placeholders while content is loading.

Props:
- rows: Number of skeleton rows to display (default: 3)
- type: Layout type - 'list', 'card', or 'table' (default: 'list')
-->
<script lang="ts">
  export let rows: number = 3
  export let type: 'list' | 'card' | 'table' = 'list'
</script>

<div class="space-y-4 animate-pulse" role="status" aria-live="polite" aria-label="Loading content">
  <span class="sr-only">Loading...</span>
  {#if type === 'list'}
    {#each Array(rows) as _, i}
      <div class="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
        <div class="flex items-center gap-4">
          <!-- Avatar/Icon skeleton -->
          <div class="w-12 h-12 bg-slate-700/50 rounded-full"></div>

          <!-- Content skeleton -->
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-slate-700/50 rounded w-3/4"></div>
            <div class="h-3 bg-slate-700/30 rounded w-1/2"></div>
          </div>

          <!-- Action skeleton -->
          <div class="w-20 h-8 bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
    {/each}
  {:else if type === 'card'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each Array(rows) as _, i}
        <div class="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
          <!-- Icon skeleton -->
          <div class="w-16 h-16 bg-slate-700/50 rounded-2xl mb-4"></div>

          <!-- Title skeleton -->
          <div class="h-5 bg-slate-700/50 rounded w-2/3 mb-3"></div>

          <!-- Description skeleton -->
          <div class="space-y-2 mb-4">
            <div class="h-3 bg-slate-700/30 rounded w-full"></div>
            <div class="h-3 bg-slate-700/30 rounded w-4/5"></div>
          </div>

          <!-- Button skeleton -->
          <div class="h-10 bg-slate-700/50 rounded-lg w-full"></div>
        </div>
      {/each}
    </div>
  {:else if type === 'table'}
    <div class="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden">
      <!-- Header skeleton -->
      <div class="grid grid-cols-4 gap-4 p-4 border-b border-slate-700/50">
        {#each Array(4) as _}
          <div class="h-4 bg-slate-700/50 rounded"></div>
        {/each}
      </div>

      <!-- Rows skeleton -->
      {#each Array(rows) as _, i}
        <div class="grid grid-cols-4 gap-4 p-4 border-b border-slate-700/30">
          {#each Array(4) as _}
            <div class="h-3 bg-slate-700/30 rounded"></div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
