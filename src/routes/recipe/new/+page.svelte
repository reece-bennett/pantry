<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types.js';
  import IngredientRow from './IngredientRow.svelte';

  export let data: PageData;
  export let form: ActionData;

  let ingredientRows = [{ amount: '', unit: data.units[0], ingredient: '', original: '' }];
  $: initialiseIngredientRows(form);

  function initialiseIngredientRows(form: ActionData) {
    console.log('initialiseIngredientRows');
    if (form) {
      ingredientRows = form.data.amounts.map((amount, i) => ({
        amount,
        unit: form.data.units[i],
        ingredient: form.data.ingredients[i],
        original: form.data.originals[i]
      }));
    }
  }

  function addIngredient() {
    ingredientRows = [
      ...ingredientRows,
      { ingredient: '', unit: data.units[0], amount: '', original: '' }
    ];
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

  $: errors = (form?.errors ?? []) as { [x: string]: string };

  $: stepRows = form ? form.data.steps : [''];

  function addStep() {
    stepRows = [...stepRows, ''];
  }

  function removeStep(i: number) {
    stepRows = stepRows.toSpliced(i, 1);
  }

  $: console.log('data', data);
  $: console.log('form', form);
  $: console.log('ingredientRows', ingredientRows);
  $: console.log('stepRows', stepRows);
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
          value={form?.data.url ?? ''}
        />
        <button type="submit">Submit</button>
      </fieldset>
    </form>

    <hr />

    <form method="post" action="?/submit" use:enhance>
      <input type="hidden" name="url" value={form?.data.url ?? ''} />

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
      {#each ingredientRows as ingredient, index}
        <IngredientRow
          units={data.units}
          ingredients={data.ingredients}
          {errors}
          {index}
          enableRemove={ingredientRows.length > 1}
          remove={() => removeIngredient(index)}
          bind:amount={ingredient.amount}
          bind:unit={ingredient.unit}
          bind:ingredient={ingredient.ingredient}
          original={ingredient.original}
        />
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
  .error {
    color: var(--pico-del-color);
  }

  .bottom-error {
    display: block;
    margin-top: calc(var(--pico-spacing) * -0.75);
  }
</style>
