<script lang="ts">
  export let units: string[];
  export let ingredients: string[];

  export let errors: { [x: string]: string };

  export let index: number;
  export let enableRemove = false;
  export let remove: () => void;

  export let amount = '';
  export let unit = units[0];
  export let ingredient = '';
  export let original = '';
</script>

<!-- svelte-ignore a11y-no-redundant-roles -->
<fieldset role="group">
  <input
    name="amount"
    class="amount"
    type="text"
    inputmode="numeric"
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

  <button type="button" on:click|preventDefault={remove} disabled={!enableRemove}> ❌ </button>
</fieldset>
<div class="message-container">
  {#if original}
    <small>Original text: {original}</small>
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
</style>
