<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  interface Props extends HTMLTextareaAttributes {
    name: string;
    label: string;
    value?: any;
    errors: { [x: string]: string } | undefined;
  }

  let { name, label, value = $bindable(''), errors, ...rest }: Props = $props();

  let error = $derived(errors?.[name]);
</script>

<div class="form-group">
  <label for={name}>{label}</label>
  <textarea id={name} {name} {value} aria-invalid={error ? 'true' : undefined} {...rest}></textarea>
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
    margin-bottom: 0.375rem;
  }

  textarea {
    display: block;
    width: 100%;
    background: none;
    border: 1px solid var(--border);
    padding: 0.5rem;
    border-radius: var(--border-radius);
  }

  textarea[aria-invalid='true'] {
    border-color: var(--error);
  }

  small {
    font-size: 0.875rem;
    color: var(--error);
  }
</style>
