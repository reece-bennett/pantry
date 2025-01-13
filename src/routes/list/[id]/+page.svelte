<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import Modal from '$lib/components/Modal.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  type Ingredient = {
    name: string;
    unit: string;
    amount: number;
  };

  let ingredients = $derived(data.list.meals
    .flatMap((meal) =>
      meal.recipe.ingredients.map(
        (ingredient) =>
          ({
            name: ingredient.ingredientName,
            unit: ingredient.unitName,
            amount: ingredient.amount * (meal.servings / meal.recipe.servings)
          }) as Ingredient
      )
    )
    .reduce((acc, cur) => {
      const existing = acc.find((x) => x.name === cur.name);
      if (existing) {
        existing.amount += cur.amount;
      } else {
        acc.push(cur);
      }
      return acc;
    }, [] as Ingredient[])
    .sort((a, b) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      return 0;
    }));

  let modal: Modal = $state();
</script>

<main class="container">
  <p>
    <a href="/list">Back</a>
  </p>

  <section>
    <h1>List {data.list.id}</h1>

    <h2>Recipes</h2>

    <ul>
      {#each data.list.meals as meal}
        <li>{meal.servings} x <a href="/recipe/{meal.recipeId}">{meal.recipe.name}</a></li>
      {/each}
    </ul>

    <h2>Ingredients</h2>

    <ul>
      {#each ingredients as { amount, name, unit }}
        <li>
          {amount}
          {#if unit !== 'x'}{unit}{/if}
          {name}
        </li>
      {/each}
    </ul>

    <p>
      <a href="/list/{data.list.id}/edit">Edit list</a>
    </p>

    <form id="form" method="post" use:enhance>
      <input type="hidden" name="id" value={data.list.id} />
      <button onclick={preventDefault(() => modal.showModal())}>Delete list</button>
    </form>
  </section>
</main>

<Modal bind:this={modal}>
  <h2>Delete 'List {data.list.id}'?</h2>
  <p>This action cannot be undone!</p>
  <footer>
    <button class="secondary" onclick={() => modal.close()}>Cancel</button>
    <button form="form" onclick={() => modal.close()}>Confirm</button>
  </footer>
</Modal>
