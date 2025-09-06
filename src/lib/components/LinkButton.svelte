<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  let { children, type = 'button', ...rest }: HTMLButtonAttributes = $props();
</script>

<button {type} {...rest}>
  {@render children?.()}
</button>

<style>
  button {
    padding: 0;
    border: 0;

    text-decoration: underline;
    text-underline-offset: 0.125em;
    cursor: pointer;
  }
</style>
