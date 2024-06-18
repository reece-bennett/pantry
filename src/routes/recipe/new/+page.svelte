<script lang="ts">
  import type { ActionData } from './$types.js';
  import { enhance } from '$app/forms';
  import type { PageData } from './$types.js';

  export let data: PageData;
  export let form: ActionData;

  let ingredientRows = [
    {
      amount: '',
      unit: 'g',
      ingredient: ''
    }
  ];

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

  $: errors = form?.errors;

  function addIngredient() {
    ingredientRows = [...ingredientRows, { ingredient: '', unit: 'g', amount: '' }];
  }

  function removeIngredient(i: number) {
    ingredientRows = ingredientRows.toSpliced(i, 1);
    if (errors) {
      errors = Object.keys(errors)
        .filter((key) => !new RegExp(`\\D${i}$`).test(key))
        .reduce(
          (obj, key) => {
            const match = key.match(/^(\D+)(\d+)$/);
            let newKey = key;
            if (match && Number(match[2]) > i) {
              newKey = `${match[1]}${Number(match[2]) - 1}`;
            }
            obj[newKey] = errors![key];
            return obj;
          },
          {} as { [x: string]: string }
        );
    }
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
        aria-invalid={errors?.title ? 'true' : undefined}
      />
      {#if errors?.title}
        <small>{errors.title}</small>
      {/if}

      <label for="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={form?.data.description ?? ''}
        aria-invalid={errors?.description ? 'true' : undefined}
      ></textarea>
      {#if errors?.description}
        <small>{errors.description}</small>
      {/if}

      <label for="servings">Servings</label>
      <input
        name="servings"
        type="text"
        inputmode="numeric"
        value={form?.data.servings ?? ''}
        aria-invalid={errors?.servings ? 'true' : undefined}
      />
      {#if errors?.servings}
        <small>{errors.servings}</small>
      {/if}

      <label for="servings">Time taken (mins)</label>
      <input
        name="time"
        type="text"
        inputmode="numeric"
        value={form?.data.time ?? ''}
        aria-invalid={errors?.time ? 'true' : undefined}
      />
      {#if errors?.time}
        <small>{errors.time}</small>
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
            aria-invalid={errors?.[`amount${i}`] ? 'true' : undefined}
            autocomplete="off"
          />

          <select
            name="unit"
            class="unit"
            bind:value={ingredient.unit}
            aria-invalid={errors?.[`unit${i}`] ? 'true' : undefined}
          >
            {#each data.units as unit}
              <option value={unit.name}>{unit.name}</option>
            {/each}
          </select>

          <input
            name="ingredient"
            type="text"
            list="ingredient-list"
            autocomplete="off"
            bind:value={ingredient.ingredient}
            aria-invalid={errors?.[`ingredient${i}`] ? 'true' : undefined}
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
        <div class="ingredient-error-container">
          {#if errors?.[`amount${i}`]}
            <small class="error ingredient-error">Amount {errors[`amount${i}`]}</small>
          {/if}
          {#if errors?.[`unit${i}`]}
            <small class="error ingredient-error">Unit {errors[`unit${i}`]}</small>
          {/if}
          {#if errors?.[`ingredient${i}`]}
            <small class="error ingredient-error">Ingredient {errors[`ingredient${i}`]}</small>
          {/if}
        </div>
      {/each}
      <button type="button" on:click|preventDefault={addIngredient}>Add</button>

      <h2>Steps</h2>
      {#each stepRows as step, i}
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <fieldset role="group">
          <textarea
            name="step"
            bind:value={step}
            aria-invalid={errors?.['step' + i] ? 'true' : undefined}
          ></textarea>
          <button
            type="button"
            on:click|preventDefault={() => removeStep(i)}
            disabled={stepRows.length < 2}
          >
            ❌
          </button>
        </fieldset>
        {#if errors?.['step' + i]}
          <small class="error">{errors['step' + i]}</small>
        {/if}
      {/each}
      <button type="button" on:click|preventDefault={addStep}>Add</button>

      <button type="submit">Submit</button>
      {#if errors}
        <small class="error bottom-error">There are errors</small>
      {/if}
      <a href="/recipe">Cancel</a>
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

  .ingredient-error {
    display: block;
    margin-bottom: 0;
  }

  .ingredient-error-container {
    margin-bottom: var(--pico-spacing);
  }

  .ingredient-error:first-child {
    margin-top: calc(var(--pico-spacing) * -0.75);
  }

  .bottom-error {
    display: block;
    margin-top: calc(var(--pico-spacing) * -0.75);
  }
</style>
