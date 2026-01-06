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

  let ingredientsTexts = $derived(
    ingredients.map(({ amount, name, unit }) => `${amount} ${unit !== 'x' ? unit : ''} ${name}`)
  );

  let copied = $state(false);
  let error = $state('');

  async function writeIngredientsToClipboard() {
    try {
      await navigator.clipboard.writeText(ingredientsTexts.join('\n'));
    } catch (err) {
      error = err as string;
    }
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<div id="root">
  <Header backUrl="/list">
    {#snippet actions()}
      <button
        type="button"
        class="icon"
        aria-label="Copy ingredients"
        onclick={writeIngredientsToClipboard}
        disabled={copied}
      >
        {#if copied}
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
            class="lucide lucide-copy-check-icon lucide-copy-check"
          >
            <path d="m12 15 2 2 4-4" />
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        {:else}
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
            class="lucide lucide-copy-icon lucide-copy"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        {/if}
      </button>
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
      {#each ingredientsTexts as ingredient}
        <li>{ingredient}</li>
      {/each}
    </ul>
  </main>
  <Footer />
</div>
