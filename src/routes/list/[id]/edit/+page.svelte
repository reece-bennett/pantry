<script lang="ts">
  import { enhance } from '$app/forms';
  import Counter from '$lib/components/Counter.svelte';
  import type { ActionData, PageData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  let recipes = $state(data.recipes.map(({ id, name, servings }) => ({
    id,
    name,
    servings,
    number:
      form?.data.get(id) ?? data.list.meals.find((meal) => meal.recipeId === id)?.servings ?? 0
  })));

  let selectedRecipes = $derived(recipes.filter((recipe) => recipe.number > 0));
  let unselectedRecipes = $derived(recipes.filter((recipe) => recipe.number === 0));
</script>

<main class="container">
  <p>
    <a href="/list/{data.list.id}">Back</a>
  </p>

  <section>
    <h1>Editing list</h1>

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
            onclick={() => {
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
