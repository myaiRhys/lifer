<script lang="ts">
  export let type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text'
  export let value: string | number = ''
  export let placeholder: string = ''
  export let disabled: boolean = false
  export let required: boolean = false
  export let label: string = ''
  export let error: string = ''
  export let maxlength: number | undefined = undefined
  export let id: string = `input-${Math.random().toString(36).substr(2, 9)}`
</script>

<div class="space-y-2">
  {#if label}
    <label for={id} class="block text-body-small font-medium text-text-primary">
      {label}
      {#if required}
        <span class="text-error-red">*</span>
      {/if}
    </label>
  {/if}

  <input
    {id}
    {type}
    {placeholder}
    {disabled}
    {required}
    {maxlength}
    bind:value
    class="input {error ? 'border-error-red' : ''}"
    on:input
    on:change
    on:focus
    on:blur
    on:keydown
    on:keyup
  />

  {#if error}
    <p class="text-body-small text-error-red animate-shake">
      {error}
    </p>
  {/if}
</div>

<style>
  /* Styles are defined in app.css */
</style>
