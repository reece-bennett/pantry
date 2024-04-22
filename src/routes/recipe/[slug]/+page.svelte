<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<main class="container">
  <h1>{data.recipe.name}</h1>

  <p>{data.recipe.description}</p>

  <h2>Ingredients</h2>

  <ul>
    {#each data.recipe.ingredients as { amount, ingredient, unit }}
      <li>{amount} {#if unit !== 'x'}{unit}{/if} {ingredient}</li>
    {/each}
  </ul>

  <p>
    <a href="/recipe">Back</a>
  </p>
</main>
