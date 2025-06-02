<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let { children, type = 'button', ...rest }: HTMLButtonAttributes = $props();
</script>

<button {type} {...rest}>
  {@render children?.()}
</button>

<style>
  button {
    display: block;
    background: none;
    border: 1px solid var(--border);
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-weight: normal;
  }
</style>
