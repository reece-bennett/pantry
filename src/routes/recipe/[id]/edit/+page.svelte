<script lang="ts">
  import { enhance } from '$app/forms';
  import IngredientRow from '$lib/components/IngredientRow.svelte';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let ingredientRows = [{ amount: '', unit: data.units[0], ingredient: '' }];
  $: initialiseIngredientRows(form, data);

  function initialiseIngredientRows(form: ActionData, data: PageData) {
    if (form) {
      ingredientRows = form.data.amounts.map((amount, i) => ({
        amount,
        unit: form.data.units[i],
        ingredient: form.data.ingredients[i]
      }));
    } else if (data) {
      ingredientRows = data.recipe.ingredients.map(({ amount, unitName, ingredientName }) => ({
        amount: String(amount),
        unit: unitName,
        ingredient: ingredientName
      }));
    }
  }

  function addIngredient() {
    ingredientRows = [...ingredientRows, { ingredient: '', unit: data.units[0], amount: '' }];
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

  $: errors = form?.errors;

  let stepRows = [{ id: '', content: '' }];
  $: initialiseStepRows(form, data);
  
  function initialiseStepRows(form: ActionData, data: PageData) {
    if (form) {
      stepRows = form.data.steps.map((step, i) => ({ id: form.data.stepIds[i], content: step }));
    } else if (data) {
      stepRows = data.recipe.steps.map(({ id, content }) => ({ id: String(id), content }));
    }
  }

  function addStep() {
    stepRows = [...stepRows, { id: '', content: '' }];
  }

  function removeStep(i: number) {
    stepRows = stepRows.toSpliced(i, 1);
  }

  // $: console.log('data', data);
  // $: console.log('form', form);
  // $: console.log('ingredientRows', ingredientRows);
  // $: console.log('stepRows', stepRows);
</script>

<main class="container">
  <p>
    <a href="/recipe/{data.recipe.id}">Back</a>
  </p>

  <section>
    <hgroup>
      <h1>Editing recipe</h1>
      <p>{data.recipe.name}</p>
    </hgroup>

    <form method="post" use:enhance>
      <label for="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={form?.data.title ?? data.recipe.name}
        aria-invalid={form?.errors.title ? 'true' : undefined}
      />
      {#if form?.errors.title}
        <small>{form?.errors.title}</small>
      {/if}

      <label for="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={form?.data.description ?? data.recipe.description}
        aria-invalid={form?.errors.description ? 'true' : undefined}
      ></textarea>
      {#if form?.errors.description}
        <small>{form?.errors.description}</small>
      {/if}

      <label for="servings">Servings</label>
      <input
        id="servings"
        name="servings"
        type="text"
        inputmode="numeric"
        value={form?.data.servings ?? data.recipe.servings}
        aria-invalid={form?.errors.servings ? 'true' : undefined}
      />
      {#if form?.errors.servings}
        <small>{form?.errors.servings}</small>
      {/if}

      <label for="time">Time taken (mins)</label>
      <input
        id="time"
        name="time"
        type="text"
        inputmode="numeric"
        value={form?.data.time ?? data.recipe.time}
        aria-invalid={form?.errors.time ? 'true' : undefined}
      />
      {#if form?.errors.time}
        <small>{form?.errors.time}</small>
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
        />
      {/each}
      <button type="button" on:click|preventDefault={addIngredient}>Add</button>

      <h2>Steps</h2>
      {#each stepRows as step, i}
        <input name="stepId" type="hidden" value={step.id} />
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <fieldset role="group">
          <textarea
            name="step"
            bind:value={step.content}
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
      <a href="/recipe/{data.recipe.id}">Cancel</a>
    </form>
  </section>
</main>
