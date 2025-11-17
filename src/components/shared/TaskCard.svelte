<script lang="ts">
  import Checkbox from './Checkbox.svelte'
  import Badge from './Badge.svelte'

  export let title: string
  export let completed: boolean = false
  export let category: string = ''
  export let categoryIcon: string = ''
  export let xpReward: number = 0
  export let description: string = ''
  export let onToggle: ((completed: boolean) => void) | undefined = undefined
  export let onClick: (() => void) | undefined = undefined

  function handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement
    completed = target.checked
    if (onToggle) onToggle(completed)
  }

  function handleCardClick(event: MouseEvent) {
    // Don't trigger card click if clicking the checkbox
    if ((event.target as HTMLElement).closest('.checkbox')) {
      return
    }
    if (onClick) onClick()
  }
</script>

<div
  class="task-card {completed ? 'completed' : ''} cursor-pointer"
  on:click={handleCardClick}
  on:keydown={(e) => e.key === 'Enter' && handleCardClick(e)}
  role="button"
  tabindex="0"
>
  <div class="flex items-start gap-16">
    <!-- Checkbox -->
    <div class="pt-4">
      <Checkbox bind:checked={completed} on:change={handleCheckboxChange} />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h3 class="task-title text-body-large font-medium text-text-primary mb-8">
        {title}
      </h3>

      {#if description}
        <p class="text-body-small text-text-secondary mb-12">
          {description}
        </p>
      {/if}

      <!-- Category and XP -->
      <div class="flex items-center gap-12 flex-wrap">
        {#if category}
          <div class="flex items-center gap-8 text-body-small text-text-muted">
            {#if categoryIcon}
              <span class="text-lg">{categoryIcon}</span>
            {/if}
            <span>{category}</span>
          </div>
        {/if}

        {#if xpReward > 0}
          <Badge variant="xp" value="+{xpReward}">
            XP
          </Badge>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  /* Additional custom styles if needed */
  .task-card {
    /* Inherits styles from app.css */
  }
</style>
