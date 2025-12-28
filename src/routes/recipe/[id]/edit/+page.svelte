<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/Button.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import IngredientRow from '$lib/components/IngredientRow.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import StepRow from '$lib/components/StepRow.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import TextInput from '$lib/components/TextInput.svelte';
  import type { ActionData, PageData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  let modal: Modal;

  $effect(() => {
    initialiseIngredientRows(form, data);
    initialiseStepRows(form, data);
    initialiseErrors(form);
  });

  let ingredientRows = $state([{ amount: '', unit: data.units[0], ingredient: '' }]);

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

  let errors: { [x: string]: string } | undefined = $state();

  function initialiseErrors(form: ActionData) {
    if (form) {
      errors = form.errors;
    }
  }

  let stepRows = $state([{ id: '', content: '' }]);

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

<div id="root">
  <Header backUrl="/recipe/{data.recipe.id}">
    {#snippet actions()}
      <button type="submit" form="edit-form" class="icon" aria-label="Save">
        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg> -->
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
          class="lucide lucide-save-icon lucide-save"
        >
          <path
            d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
          />
          <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
          <path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg
        >
      </button>
    {/snippet}
  </Header>

  <main class="container">
    <hgroup>
      <h1>Editing recipe</h1>
      <p>{data.recipe.name}</p>
    </hgroup>

    <form id="edit-form" method="post" action="?/save" use:enhance>
      <TextInput name="title" label="Title" value={form?.data.title ?? data.recipe.name} {errors} />

      <TextArea
        name="description"
        label="Description"
        value={form?.data.description ?? data.recipe.description}
        {errors}
      />

      <TextInput
        name="servings"
        label="Servings"
        value={form?.data.servings ?? data.recipe.servings}
        {errors}
        inputmode="numeric"
      />

      <TextInput
        name="time"
        label="Time taken (mins)"
        value={form?.data.time ?? data.recipe.time}
        {errors}
        inputmode="numeric"
      />

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
      <Button onclick={addIngredient}>Add</Button>

      <h2>Steps</h2>
      {#each stepRows as step, index}
        <StepRow
          {errors}
          {index}
          id={step.id}
          enableRemove={stepRows.length > 1}
          remove={() => removeStep(index)}
          bind:value={step.content}
        />
      {/each}
      <Button onclick={addStep}>Add</Button>
    </form>

    <Button fullWidth danger onclick={() => modal.showModal()}>Delete recipe</Button>
  </main>

  <Footer />
</div>

<form id="delete-form" method="post" action="?/delete" use:enhance>
  <Modal bind:this={modal}>
    <h2>Delete recipe '{data.recipe.name}'?</h2>
    <p>This action cannot be undone!</p>
  </Modal>
</form>

<style>
  #edit-form {
    margin-bottom: var(--typography-spacing-top);
  }

  #delete-form h2 {
    margin-top: 0;
  }
</style>
