<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  type Ingredient = {
    name: string;
    unit: string;
    amount: number;
  };

  $: ingredients = data.list.meals
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
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
</script>

<main class="container">
  <p>
    <a href="/list">Back</a>
  </p>

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
