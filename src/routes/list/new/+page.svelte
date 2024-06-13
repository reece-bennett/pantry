<script lang="ts">
  import type { ActionData } from './$types.js';
  import { enhance } from '$app/forms';
  import type { PageData } from './$types.js';
  import Counter from './Counter.svelte';

  export let data: PageData;
  export let form: ActionData;

  let recipes = data.recipes.map(({ id, name, servings }) => ({
    id,
    name,
    servings,
    number: form?.data.get(id) ?? 0
  }));

  $: console.log(recipes);
  $: selectedRecipes = recipes.filter((recipe) => recipe.number > 0);
  $: unselectedRecipes = recipes.filter((recipe) => recipe.number === 0);
</script>

<main class="container">
  <p>
    <a href="/list">Back</a>
  </p>

  <h1>Create list</h1>

  <div role="search">
    <input type="search" placeholder="Search" />
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
    {/each}

    <div>
      <button type="submit">Submit</button>
      <a href="/recipe">Cancel</a>
    </div>
  </form>

  <style>
    h1 {
      margin-top: 0;
    }

    .error {
      color: var(--pico-del-color);
    }

    .recipe-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .recipe-row-controls {
      display: flex;
      align-items: center;
      gap: 1em;
    }

    .recipe-row button {
      margin-bottom: 0;
    }

    .recipe-row input[type='checkbox'] {
      margin: 0;
    }
  </style>
</main>
