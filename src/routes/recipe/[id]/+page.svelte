<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<main class="container">
  <p>
    <a href="/recipe">Back</a>
  </p>

  <section>
    <h1>{data.recipe.name}</h1>

    <p>{data.recipe.description}</p>

    <p>Serves: {data.recipe.servings}<br />Time: {data.recipe.time} mins</p>

    <h2>Ingredients</h2>

    <ul>
      {#each data.recipe.ingredients as { amount, ingredient, unit }}
        <li>
          {amount}
          {#if unit.name !== 'x'}{unit.name}{/if}
          {ingredient.name}
        </li>
      {/each}
    </ul>

    <h2>Steps</h2>

    <ol>
      {#each data.recipe.steps as step}
        <li>
          {#each step.content.split('\n') as paragraph}
            <p>{paragraph}</p>
          {/each}
        </li>
      {/each}
    </ol>

    <form method="post" use:enhance>
      <input type="hidden" name="id" value={data.recipe.id} />
      <button>Delete recipe</button>
    </form>
  </section>
</main>
