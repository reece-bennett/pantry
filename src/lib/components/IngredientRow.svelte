<script lang="ts">
  import { run, preventDefault } from 'svelte/legacy';

  import { fuzzySearch } from '$lib/fuzzy';




  interface Props {
    units: string[];
    ingredients: string[];
    errors: { [x: string]: string } | undefined;
    index: number;
    enableRemove?: boolean;
    remove: () => void;
    amount?: string;
    unit?: any;
    ingredient?: string;
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

  let _ingredient;
  run(() => {
    _ingredient = ingredient;
  });
  let isExistingValue = $derived(!ingredient || ingredients.includes(ingredient));
  let suggestion;
  run(() => {
    suggestion = isExistingValue ? '' : fuzzySearch(ingredients, ingredient)[0];
  });

  function updateIngredient() {
    ingredient = _ingredient;
  }

  function acceptSuggestion() {
    ingredient = suggestion;
    suggestion = '';
  }
</script>

<!-- svelte-ignore a11y_no_redundant_roles -->
<fieldset role="group">
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
    bind:value={_ingredient}
    aria-invalid={errors?.[`ingredient${index}`] ? 'true' : undefined}
    onchange={updateIngredient}
  />
  <input name="original" type="hidden" value={original} />

  <datalist id="ingredient-list">
    {#each ingredients as ingredient}
      <option value={ingredient}></option>
    {/each}
  </datalist>

  <button type="button" onclick={preventDefault(remove)} disabled={!enableRemove}> ❌ </button>
</fieldset>
<div class="message-container">
  {#if original}
    <small>Original text: {original}</small>
  {/if}
  {#if !isExistingValue}
    <small>A new ingredient will be created</small>
  {/if}
  {#if suggestion}
    <small>Did you mean <button type="button" class="link-button" onclick={acceptSuggestion}>{suggestion}</button>?</small>
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

<style>
  input.amount,
  select.unit {
    width: 25%;
  }

  .error {
    color: var(--pico-del-color);
  }

  .message-container small {
    display: block;
    margin-bottom: 0;
  }

  .message-container small:first-child {
    margin-top: calc(var(--pico-spacing) * -0.75);
  }

  .message-container small:last-child {
    margin-bottom: var(--pico-spacing);
  }

  .link-button {
    /* Undoing <button> styles */
    padding: 0;
    border: 0;
    font-size: unset;
    margin: 0;

    /* <a> styles */
    --pico-text-decoration: underline;
    --pico-color: var(--pico-primary);
    --pico-background-color: transparent;
    --pico-underline: var(--pico-primary-underline);
    outline: 0;
    background-color: var(--pico-background-color);
    color: var(--pico-color);
    -webkit-text-decoration: var(--pico-text-decoration);
    text-decoration: var(--pico-text-decoration);
    text-decoration-color: var(--pico-underline);
    text-underline-offset: 0.125em;
    transition:
      background-color var(--pico-transition),
      color var(--pico-transition),
      box-shadow var(--pico-transition),
      -webkit-text-decoration var(--pico-transition);
    transition:
      background-color var(--pico-transition),
      color var(--pico-transition),
      text-decoration var(--pico-transition),
      box-shadow var(--pico-transition);
    transition:
      background-color var(--pico-transition),
      color var(--pico-transition),
      text-decoration var(--pico-transition),
      box-shadow var(--pico-transition),
      -webkit-text-decoration var(--pico-transition);
  }

  .link-button:hover,
  .link-button:active,
  .link-button:focus {
    --pico-color: var(--pico-primary-hover);
    --pico-underline: var(--pico-primary-hover-underline);
    --pico-text-decoration: underline;
    --pico-box-shadow: 0;
  }
</style>
