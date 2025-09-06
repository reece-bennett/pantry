<script lang="ts">
  import { fuzzySearch } from '$lib/fuzzy';
  import LinkButton from './LinkButton.svelte';

  interface Props {
    units: string[];
    ingredients: string[];
    errors: { [x: string]: string } | undefined;
    index: number;
    enableRemove: boolean;
    remove: () => void;
    amount: string;
    unit: string;
    ingredient: string;
    original?: string;
  }

  let {
    units,
    ingredients,
    errors,
    index,
    enableRemove = false,
    remove,
    amount = $bindable(''),
    unit = $bindable(units[0]),
    ingredient = $bindable(''),
    original = ''
  }: Props = $props();

  let isNewIngredient = $derived(ingredient && !ingredients.includes(ingredient));
  let suggestion = $derived(isNewIngredient ? fuzzySearch(ingredients, ingredient)[0] : '');

  function acceptSuggestion() {
    ingredient = suggestion;
  }
</script>

<div class="row">
  <fieldset>
    <input
      name="amount"
      class="amount"
      type="text"
      inputmode="decimal"
      bind:value={amount}
      aria-invalid={errors?.[`amount${index}`] ? 'true' : undefined}
      autocomplete="off"
    />

    <select
      name="unit"
      class="unit"
      bind:value={unit}
      aria-invalid={errors?.[`unit${index}`] ? 'true' : undefined}
    >
      {#each units as unit}
        <option value={unit}>{unit}</option>
      {/each}
    </select>

    <input
      name="ingredient"
      type="text"
      list="ingredient-list"
      autocomplete="off"
      bind:value={ingredient}
      aria-invalid={errors?.[`ingredient${index}`] ? 'true' : undefined}
    />
    <input name="original" type="hidden" value={original} />

    <datalist id="ingredient-list">
      {#each ingredients as ingredient}
        <option value={ingredient}></option>
      {/each}
    </datalist>

    <button
      type="button"
      class="icon"
      onclick={remove}
      disabled={!enableRemove}
      aria-label="Remove"
    >
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
  <div class="message-container">
    {#if original}
      <small>Original text: {original}</small>
    {/if}
    {#if isNewIngredient}
      <small>A new ingredient will be created</small>
    {/if}
    {#if suggestion}
      <small>
        Did you mean <LinkButton onclick={acceptSuggestion}>{suggestion}</LinkButton>?
      </small>
    {/if}
    {#if errors?.[`amount${index}`]}
      <small class="error">Amount {errors[`amount${index}`]}</small>
    {/if}
    {#if errors?.[`unit${index}`]}
      <small class="error">Unit {errors[`unit${index}`]}</small>
    {/if}
    {#if errors?.[`ingredient${index}`]}
      <small class="error">Ingredient {errors[`ingredient${index}`]}</small>
    {/if}
  </div>
</div>

<style>
  .row {
    margin-bottom: 1rem;
  }

  fieldset {
    display: flex;
    padding: 0;
    border: 0;
    margin-bottom: 0.5rem;
  }

  input,
  select {
    background: none;
    border: 1px solid var(--border);
    padding: 0.5rem;
    margin-left: -1px;
    color: inherit;
    border-radius: 0;
  }

  input.amount {
    border-radius: 0.5rem 0 0 0.5rem;
    margin-left: 0;
  }

  input.amount,
  select.unit {
    width: 25%;
  }

  button {
    background: none;
    border: 1px solid var(--border);
    border-radius: 0 0.5rem 0.5rem 0;
    margin-left: -1px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .error {
    color: var(--error);
  }

  .message-container small {
    display: block;
  }
</style>
