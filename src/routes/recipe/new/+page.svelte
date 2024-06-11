<script lang="ts">
  import type { ActionData } from './$types.js';
  import { enhance } from '$app/forms';
  import type { PageData } from './$types.js';
  // @ts-expect-error
  import AutoComplete from 'simple-svelte-autocomplete';

  export let data: PageData;
  export let form: ActionData;

  let ingredients = [
    {
      ingredient: '',
      unit: data.units[0].name,
      amount: ''
    }
  ];

  if (form?.data.amounts) {
    ingredients = form?.data.amounts.map((amount, i) => ({
      amount,
      unit: form?.data.units[i] ?? data.units[0].name,
      ingredient: form?.data.ingredients[i] ?? ''
    }));
  }

  function addIngredient() {
    ingredients = [...ingredients, { ingredient: '', unit: data.units[0].name, amount: '' }];
  }

  function removeIngredient(i: number) {
    ingredients = ingredients.toSpliced(i, 1);
  }

  let steps = form?.data.steps ?? [''];

  function addStep() {
    steps = [...steps, ''];
  }

  function removeStep(i: number) {
    steps = steps.toSpliced(i, 1);
  }
</script>

<main class="container">
  <h1>Create new recipe</h1>

  <form method="post" use:enhance>
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
    {#each ingredients as ingredient, i}
      <!-- svelte-ignore a11y-no-redundant-roles -->
      <fieldset role="group">
        <input
          name="amount"
          class="amount"
          type="text"
          inputmode="numeric"
          bind:value={ingredient.amount}
          aria-invalid={form?.errors?.[`amount${i}`] ? 'true' : undefined}
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

        <AutoComplete
          name="ingredient"
          items={data.ingredients}
          bind:value={ingredient.ingredient}
          labelFieldName="name"
          valueFieldName="name"
          noInputStyles
          hideArrow
          create=true
          createText="New ingredient will be created."
        />

        <button
          type="button"
          on:click|preventDefault={() => removeIngredient(i)}
          disabled={ingredients.length < 2}
        >
          ❌
        </button>
      </fieldset>
    {/each}
    <button type="button" on:click|preventDefault={addIngredient}>Add</button>

    <h2>Steps</h2>
    {#each steps as step, i}
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
          disabled={steps.length < 2}
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

  <style>
    input.amount,
    select.unit {
      width: 25%;
    }

    [data-svelte-typeahead] {
      width: 50%;
    }

    .error {
      color: var(--pico-del-color);
    }
  </style>
</main>
