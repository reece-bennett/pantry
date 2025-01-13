<script lang="ts">
  import { run } from 'svelte/legacy';

  import { enhance } from '$app/forms';
  import Modal from '$lib/components/Modal.svelte';
  import { fuzzySearch } from '$lib/fuzzy';
  import type { ActionData, PageData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  let filterString = $state('');

  let showOnlySimilar = $state(false);


  let modal: Modal = $state();
  let ingredientToDelete: string = $state();


  let searchResults = $derived(fuzzySearch(data.ingredients, filterString));
  let similarIngredients = $derived(data.ingredients.flatMap((ingredient) => {
    const result = fuzzySearch(data.ingredients, ingredient);
    if (result.length > 1) {
      return [...result, ingredient];
    } else {
      return [];
    }
  }));
  let ingredients = $derived(data.ingredients.map((ingredient) => ({
    original: ingredient,
    name: ingredient,
    shown:
      (searchResults.length === 0 || searchResults.includes(ingredient)) &&
      (!showOnlySimilar || similarIngredients.includes(ingredient))
  })));
  run(() => {
    if (modal?.isOpen() && form && form.success) {
      modal.close();
    }
  });
</script>

<main class="container">
  <p>
    <a href="/">Back</a>
  </p>

  <section>
    <h1>Ingredients</h1>

    <div class="search-container">
      <input type="search" placeholder="Filter" bind:value={filterString} />
      <fieldset>
        <input type="checkbox" id="simlar" bind:checked={showOnlySimilar} />
        <label for="similar">Similar</label>
      </fieldset>
    </div>

    <form
      method="post"
      action="?/rename"
      use:enhance={() => {
        return async ({ update }) => {
          update({ reset: false });
        };
      }}
    >
      <div class="ingredient-container">
        {#each ingredients as { name, shown }}
          <article hidden={!shown}>
            <div>
              <input type="text" {name} value={name} />
              <small>{name}</small>
            </div>
            <button
              type="button"
              onclick={() => {
                ingredientToDelete = name;
                modal.showModal();
              }}
            >
              Delete
            </button>
          </article>
        {/each}
      </div>

      <button type="submit">Save</button>
    </form>
  </section>
</main>

<Modal bind:this={modal}>
  <h2>Delete ingredient</h2>
  <p>The ingredient '{ingredientToDelete}' will be deleted and usages in recipes replaced with:</p>
  <form id="deleteForm" method="post" action="?/delete" use:enhance>
    <input type="hidden" name="ingredientToDelete" value={ingredientToDelete} />
    <select
      name="replacementIngredient"
      aria-invalid={form?.errors?.replacementIngredient ? 'true' : undefined}
    >
      {#each data.ingredients.filter((ingredient) => ingredient !== ingredientToDelete) as ingredient}
        <option value={ingredient}>{ingredient}</option>
      {/each}
    </select>
    {#if form?.errors?.replacementIngredient}
      <small>{form?.errors?.replacementIngredient}</small>
    {/if}
  </form>
  <p>This action cannot be undone!</p>
  <footer>
    <button type="button" class="secondary" onclick={() => modal.close()}>Cancel</button>
    <button form="deleteForm">Confirm</button>
  </footer>
</Modal>

<style>
  .container {
    max-width: 700px;
  }

  .search-container {
    display: flex;
    gap: var(--pico-spacing);
    align-items: center;
  }

  .search-container input[type='search'] {
    flex-grow: 1;
  }

  .search-container fieldset {
    max-width: fit-content;
  }

  article {
    display: flex;
    gap: var(--pico-spacing);
    align-items: flex-start;
  }

  article div {
    flex-grow: 1;
  }

  small {
    margin-bottom: 0;
  }

  form {
    position: relative;
  }

  button {
    position: sticky;
    bottom: var(--pico-spacing);
    margin: 0;
  }
</style>
