<script lang="ts">
  import { enhance } from '$app/forms';
  import Modal from '$lib/components/Modal.svelte';
  import { fuzzySearch } from '$lib/fuzzy';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let filterString = '';
  $: searchResults = fuzzySearch(data.ingredients, filterString);

  $: ingredients = data.ingredients.map((ingredient) => ({
    original: ingredient,
    name: ingredient,
    shown: searchResults.length === 0 || searchResults.includes(ingredient)
  }));

  let modal: Modal;
  let ingredientToDelete: string;

  $: {
    if (modal?.isOpen() && form && form.success) {
      modal.close();
    }
  }

  $: console.log('data', data);
  $: console.log('form', form);
  $: console.log('ingredients', ingredients);
</script>

<main class="container">
  <p>
    <a href="/">Back</a>
  </p>

  <section>
    <h1>Ingredients</h1>

    <div role="search">
      <input type="search" placeholder="Filter" bind:value={filterString} />
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
              on:click={() => {
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
    <button type="button" class="secondary" on:click={() => modal.close()}>Cancel</button>
    <button form="deleteForm">Confirm</button>
  </footer>
</Modal>

<style>
  .container {
    max-width: 700px;
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
