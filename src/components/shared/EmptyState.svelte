<!--
@component
Empty State Component
Displays a friendly empty state with optional action button.

Props:
- icon: Emoji or icon to display (default: '📭')
- title: Main heading text
- description: Supporting description text
- actionText: Optional button text
- onAction: Optional button click handler
- gradient: Tailwind gradient classes for styling
-->
<script lang="ts">
  export let icon: string = '📭'
  export let title: string = 'Nothing here yet'
  export let description: string = 'Get started by adding your first item'
  export let actionText: string = ''
  export let onAction: (() => void) | null = null
  export let gradient: string = 'from-blue-500 to-purple-500'
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 animate-fade-in" role="status" aria-live="polite">
  <!-- Icon with gradient background -->
  <div class="relative mb-6" aria-hidden="true">
    <div class="absolute inset-0 bg-gradient-to-r {gradient} rounded-full blur-2xl opacity-20 scale-110"></div>
    <div class="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-full flex items-center justify-center border border-slate-700/50">
      <span class="text-5xl md:text-6xl opacity-40">{icon}</span>
    </div>
  </div>

  <!-- Title -->
  <h3 class="text-xl md:text-2xl font-bold text-slate-200 mb-2 text-center">
    {title}
  </h3>

  <!-- Description -->
  <p class="text-sm md:text-base text-slate-400 text-center max-w-md mb-6">
    {description}
  </p>

  <!-- Optional Action Button -->
  {#if actionText && onAction}
    <button
      on:click={onAction}
      class="px-6 py-3 bg-gradient-to-r {gradient} rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label={actionText}
    >
      {actionText}
    </button>
  {/if}
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
</style>
