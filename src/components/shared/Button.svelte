<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary'
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let disabled: boolean = false
  export let fullWidth: boolean = false
  export let type: 'button' | 'submit' | 'reset' = 'button'
  export let onclick: (() => void) | undefined = undefined

  const sizeClasses = {
    sm: 'text-body-small px-16 py-8',
    md: 'text-body px-24 py-12',
    lg: 'text-body-large px-32 py-16'
  }
</script>

<button
  {type}
  {disabled}
  class="btn btn-{variant} {sizeClasses[size]} {fullWidth ? 'w-full' : ''}"
  on:click={onclick}
>
  <slot />
</button>

<style>
  /* Styles are defined in app.css */
</style>
