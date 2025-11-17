<script lang="ts">
  export let variant: 'success' | 'error' | 'info' | 'warning' = 'info'
  export let message: string
  export let duration: number = 3000
  export let onClose: (() => void) | undefined = undefined

  let visible = true

  if (duration > 0) {
    setTimeout(() => {
      visible = false
      if (onClose) onClose()
    }, duration)
  }
</script>

{#if visible}
  <div class="toast toast-{variant}" role="alert">
    <slot>
      {message}
    </slot>
  </div>
{/if}

<style>
  /* Styles are defined in app.css */
</style>
