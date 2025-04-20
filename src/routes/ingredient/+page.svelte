<script lang="ts">
  import { enhance } from '$app/forms';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { fuzzySearch } from '$lib/fuzzy';
  import type { ActionData, PageData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  let filterString = $state('');
  let searchResults = $derived(fuzzySearch(data.ingredients, filterString));

  let showOnlySimilar = $state(false);

  let ingredients = $derived(
    data.ingredients.map((ingredient) => ({
      original: ingredient,
      name: ingredient,
      shown:
        (searchResults.length === 0 || searchResults.includes(ingredient)) &&
        (!showOnlySimilar || similarIngredients.includes(ingredient))
    }))
  );

  let modal: Modal;
  let ingredientToDelete: string = $state('');

  $effect(() => {
    if (modal.isOpen() && form && form.success) {
      modal.close();
    }
  });

  let similarIngredients = $derived(
    data.ingredients.flatMap((ingredient) => {
      const result = fuzzySearch(data.ingredients, ingredient);
      if (result.length > 1) {
        return [...result, ingredient];
      } else {
        return [];
      }
    })
  );
</script>

<div id="root">
  <Header title="ingredients" />
  <main class="container">
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
  </main>
  <Footer />
</div>

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
