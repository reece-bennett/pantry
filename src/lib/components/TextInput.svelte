<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    name: string;
    label: string;
    value?: any;
    errors: { [x: string]: string } | undefined;
  }

  let { name, label, value = $bindable(''), errors, ...rest }: Props = $props();

  let error = $derived(errors?.[name]);
</script>

<label for={name}>{label}</label>
<input type="text" id={name} {name} {value} aria-invalid={error ? 'true' : undefined} {...rest} />
{#if error}
  <small>{error}</small>
{/if}

<style>
  label {
    display: block;
  }

  input {
    display: block;
    width: 100%;
    background: none;
    border: 1px solid var(--border);
    padding: 0.5rem;
    border-radius: var(--border-radius);
  }

  input[aria-invalid='true'] {
    border-color: var(--error);
  }

  small {
    font-size: 0.875rem;
    color: var(--error);
  }
</style>
