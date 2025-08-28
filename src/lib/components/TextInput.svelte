<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    name: string;
    label?: string;
    value?: any;
    errors?: { [x: string]: string };
  }

  let { name, label, value = $bindable(''), errors, ...rest }: Props = $props();

  let error = $derived(errors?.[name]);
</script>

<div class="form-group">
  {#if label}
    <label for={name}>{label}</label>
  {/if}
  <input type="text" id={name} {name} {value} aria-invalid={error ? 'true' : undefined} {...rest} />
  {#if error}
    <small>{error}</small>
  {/if}
</div>

<style>
  .form-group {
    margin-bottom: var(--typography-spacing-bottom);
  }

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
