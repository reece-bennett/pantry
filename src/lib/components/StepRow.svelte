<script lang="ts">
  interface Props {
    errors: { [x: string]: string } | undefined;
    index: number;
    id: string;
    enableRemove: boolean;
    remove: () => void;
    value: string;
  }

  let { errors, index, id, enableRemove = false, remove, value = $bindable('') }: Props = $props();
</script>

<input name="stepId" type="hidden" value={id} />
<fieldset>
  <textarea name="step" bind:value aria-invalid={errors?.['step' + index] ? 'true' : undefined}
  ></textarea>
  <button type="button" class="icon" onclick={remove} disabled={!enableRemove} aria-label="Remove">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
    >
  </button>
</fieldset>
{#if errors?.['step' + index]}
  <small class="error">{errors['step' + index]}</small>
{/if}

<style>
  fieldset {
    display: flex;
    padding: 0;
    border: 0;
    margin-bottom: 0.5rem;
  }

  textarea {
    display: block;
    width: 100%;
    background: none;
    border: 1px solid var(--border);
    padding: 0.5rem;
    border-radius: 0.5rem 0 0 0.5rem;
  }

  button {
    background: none;
    border: 1px solid var(--border);
    border-radius: 0 0.5rem 0.5rem 0;
    margin-left: -1px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
</style>
