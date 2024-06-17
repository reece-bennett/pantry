<script lang="ts">
  import type { ActionData } from './$types.js';
  import { enhance } from '$app/forms';
  import type { PageData } from './$types.js';
  // @ts-expect-error
  import AutoComplete from 'simple-svelte-autocomplete';
  import Select from './Select.svelte';

  export let data: PageData;
  export let form: ActionData;

  // $: ingredients = data.ingredients.map((ingredient) => ingredient.name);

  let ingredientRows = [
    {
      amount: '',
      unit: 'g',
      ingredient: ''
    }
  ];

  // $: ingredientRows = form
  //   ? form.data.amounts.map((amount, i) => ({
  //       amount,
  //       unit: form.data.units[i],
  //       ingredient: form.data.ingredients[i]
  //     }))
  //   : [
  //       {
  //         amount: '',
  //         unit: data.units[0].name,
  //         ingredient: ''
  //       }
  //     ];

  function updateIngredientRows(form: ActionData) {
    if (form) {
      ingredientRows = form.data.amounts.map((amount, i) => ({
        amount,
        unit: form.data.units[i],
        ingredient: form.data.ingredients[i]
      }));
    }
  }

  $: updateIngredientRows(form);

  function addIngredient() {
    ingredientRows = [...ingredientRows, { ingredient: '', unit: 'g', amount: '' }];
  }

  function removeIngredient(i: number) {
    ingredientRows = ingredientRows.toSpliced(i, 1);
  }

  $: stepRows = form ? form.data.steps : [''];

  function addStep() {
    stepRows = [...stepRows, ''];
  }

  function removeStep(i: number) {
    stepRows = stepRows.toSpliced(i, 1);
  }

  // $: console.log(ingredientRows);
  // $: console.log(data);
  // $: console.log(form);
</script>

<main class="container">
  <p>
    <a href="/recipe">Back</a>
  </p>

  <section>
    <h1>Create new recipe</h1>

    <form method="post" action="?/url" use:enhance>
      <label for="url">Import from a URL</label>
      <!-- svelte-ignore a11y-no-redundant-roles -->
      <fieldset role="group">
        <input
          id="url"
          name="url"
          type="url"
          placeholder="Recipe URL"
          value={form?.data?.url ?? ''}
        />
        <button type="submit">Submit</button>
      </fieldset>
    </form>

    <hr />

    <form method="post" action="?/submit" use:enhance>
      <label for="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={form?.data.title ?? ''}
        aria-invalid={form?.errors?.title ? 'true' : undefined}
      />
      {#if form?.errors?.title}
        <small>{form.errors.title}</small>
      {/if}

      <label for="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={form?.data.description ?? ''}
        aria-invalid={form?.errors?.description ? 'true' : undefined}
      ></textarea>
      {#if form?.errors?.description}
        <small>{form.errors.description}</small>
      {/if}

      <h2>Ingredients</h2>
      {#each ingredientRows as ingredient, i}
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <fieldset role="group">
          <input
            name="amount"
            class="amount"
            type="text"
            inputmode="numeric"
            bind:value={ingredient.amount}
            aria-invalid={form?.errors?.[`amount${i}`] ? 'true' : undefined}
            autocomplete="off"
          />

          <select
            name="unit"
            class="unit"
            bind:value={ingredient.unit}
            aria-invalid={form?.errors?.[`unit${i}`] ? 'true' : undefined}
          >
            {#each data.units as unit}
              <option value={unit.name}>{unit.name}</option>
            {/each}
          </select>

          <!-- <AutoComplete
            name="ingredient"
            items={data.ingredients}
            labelFieldName="name"
            valueFieldName="name"
            noInputStyles
            hideArrow
            create="true"
            createText="New ingredient will be created."
            debug="true"
          /> -->

          <!-- <Select items={data.ingredients} value={ingredient.ingredient} /> -->

          <input
            name="ingredient"
            type="text"
            list="ingredient-list"
            autocomplete="off"
            bind:value={ingredient.ingredient}
          />

          <datalist id="ingredient-list">
            {#each data.ingredients as ingredient}
              <option value={ingredient.name}></option>
            {/each}
          </datalist>

          <button
            type="button"
            on:click|preventDefault={() => removeIngredient(i)}
            disabled={ingredientRows.length < 2}
          >
            ❌
          </button>
        </fieldset>
      {/each}
      <button type="button" on:click|preventDefault={addIngredient}>Add</button>

      <h2>Steps</h2>
      {#each stepRows as step, i}
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <fieldset role="group">
          <textarea
            name="step"
            bind:value={step}
            aria-invalid={form?.errors?.['step' + i] ? 'true' : undefined}
          ></textarea>
          <button
            type="button"
            on:click|preventDefault={() => removeStep(i)}
            disabled={stepRows.length < 2}
          >
            ❌
          </button>
        </fieldset>
        {#if form?.errors?.['step' + i]}
          <small class="error">{form.errors['step' + i]}</small>
        {/if}
      {/each}
      <button type="button" on:click|preventDefault={addStep}>Add</button>

      <div>
        <button type="submit">Submit</button>
        <a href="/recipe">Cancel</a>
      </div>
    </form>
  </section>
</main>

<style>
  input.amount,
  select.unit {
    width: 25%;
  }

  .error {
    color: var(--pico-del-color);
  }
</style>
