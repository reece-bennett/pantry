<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  type Ingredient = {
    name: string;
    unit: string;
    amount: number;
  };

  let ingredients = $derived(
    data.list.meals
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
      })
  );
</script>

<div id="root">
  <Header backUrl="/list">
    {#snippet actions()}
      <a href="/list/{data.list.id}/edit" class="icon" aria-label="Edit list">
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
          class="lucide lucide-pencil-icon lucide-pencil"
          ><path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          /><path d="m15 5 4 4" /></svg
        >
      </a>
    {/snippet}
  </Header>
  <main class="container">
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
  </main>
  <Footer />
</div>
