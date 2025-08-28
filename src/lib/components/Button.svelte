<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    fullWidth?: boolean
    danger?: boolean
  }

  let { children, type = 'button', fullWidth = false, danger = false, ...rest }: Props = $props();
</script>

<button class={{fullWidth, danger}} {type} {...rest}>
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

  .fullWidth {
    width: 100%;
  }

  .danger {
    color: var(--error);
  }
</style>
