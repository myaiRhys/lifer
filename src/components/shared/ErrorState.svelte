<!--
@component
Error State Component
Displays error, warning, or info messages with optional retry action.

Props:
- message: Main error/warning/info message
- description: Supporting description text
- actionText: Button text for retry action (default: 'Try Again')
- onRetry: Optional retry handler function
- type: Message type - 'error', 'warning', or 'info' (default: 'error')
-->
<script lang="ts">
  export let message: string = 'Something went wrong'
  export let description: string = 'Please try again or contact support if the problem persists.'
  export let actionText: string = 'Try Again'
  export let onRetry: (() => void) | null = null
  export let type: 'error' | 'warning' | 'info' = 'error'

  const icons = {
    error: '⚠️',
    warning: '⚡',
    info: 'ℹ️'
  }

  const gradients = {
    error: 'from-red-500 to-orange-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-cyan-500'
  }
</script>

<div class="flex flex-col items-center justify-center py-12 px-4 animate-shake" role="alert" aria-live="assertive">
  <!-- Icon -->
  <div class="relative mb-6" aria-hidden="true">
    <div class="absolute inset-0 bg-gradient-to-r {gradients[type]} rounded-full blur-2xl opacity-30 scale-110"></div>
    <div class="relative w-20 h-20 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-{type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500/50">
      <span class="text-4xl">{icons[type]}</span>
    </div>
  </div>

  <!-- Message -->
  <h3 class="text-xl font-bold text-{type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-400 mb-2 text-center">
    {message}
  </h3>

  <!-- Description -->
  <p class="text-sm text-slate-400 text-center max-w-md mb-6">
    {description}
  </p>

  <!-- Retry Button -->
  {#if onRetry}
    <button
      on:click={onRetry}
      class="px-6 py-3 bg-gradient-to-r {gradients[type]} rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label={actionText}
    >
      {actionText}
    </button>
  {/if}
</div>

<style>
  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-2px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(2px);
    }
  }

  .animate-shake {
    animation: shake 0.5s ease-out;
  }
</style>
