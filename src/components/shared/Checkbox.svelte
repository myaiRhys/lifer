<script lang="ts">
  export let checked: boolean = false
  export let disabled: boolean = false
  export let label: string = ''
  export let id: string = `checkbox-${Math.random().toString(36).substr(2, 9)}`
</script>

<div class="flex items-center gap-12">
  <input
    {id}
    type="checkbox"
    {disabled}
    bind:checked
    class="checkbox"
    on:change
  />
  {#if label}
    <label for={id} class="text-body text-text-primary cursor-pointer select-none">
      {label}
    </label>
  {:else}
    <label for={id} class="cursor-pointer">
      <slot />
    </label>
  {/if}
</div>

<style>
  /* Styles are defined in app.css */
</style>
