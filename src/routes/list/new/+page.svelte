<script lang="ts">
  import type { ActionData } from './$types.js';
  import { enhance } from '$app/forms';
  import type { PageData } from './$types.js';
  import Counter from '$lib/components/Counter.svelte';
  import { filterListByKey } from '$lib/fuzzy';

  interface Recipe {
    id: string;
    name: string;
    servings: number;
    number: number;
  }

  export let data: PageData;
  export let form: ActionData;

  let recipes: Recipe[] = data.recipes.map(({ id, name, servings }) => ({
    id,
    name,
    servings,
    number: form?.data.get(id) ?? 0
  }));

  $: selectedRecipes = recipes.filter((recipe) => recipe.number > 0);
  $: unselectedRecipes = filterUnselected(recipes, search);

  let search = '';

  function filterUnselected(recipes: Recipe[], search: string): Recipe[] {
    const unselected = recipes.filter((recipe) => recipe.number === 0);
    if (search) {
      return filterListByKey(recipes, 'name', search);
    } else {
      return unselected;
    }
  }
</script>

<main class="container">
  <p>
    <a href="/list">Back</a>
  </p>

  <section>
    <h1>Create list</h1>

    <div role="search">
      <input type="search" placeholder="Search" bind:value={search} />
    </div>

    <form method="post" use:enhance>
      {#each selectedRecipes as recipe}
        <article class="recipe-row">
          <span>{recipe.name}</span>
          <Counter name={recipe.id} bind:number={recipe.number} />
        </article>
      {:else}
        <p>No recipes selected</p>
      {/each}

      <hr />

      {#each unselectedRecipes as recipe}
        <article class="recipe-row">
          <span>{recipe.name}</span>
          <button
            type="button"
            on:click={() => {
              recipe.number = recipe.servings;
              recipes = recipes;
            }}
          >
            +
          </button>
        </article>
      {:else}
        <p>No recipes found</p>
      {/each}

      <div>
        <button type="submit">Submit</button>
        <a href="/recipe">Cancel</a>
      </div>
    </form>
  </section>
</main>

<style>
  .recipe-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .recipe-row button {
    margin-bottom: 0;
  }
</style>
