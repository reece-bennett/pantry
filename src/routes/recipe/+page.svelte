<script lang="ts">
  import type { PageData } from './$types';
  import { filterListByKey } from '$lib/fuzzy';

  export let data: PageData;

  let search = '';

  $: recipes = search ? filterListByKey(data.recipes, 'name', search) : data.recipes;
</script>

<main class="container">
  <p>
    <a href="/">Back</a>
  </p>

  <section>
    <h1>Recipes</h1>

    <p>
      <a href="/recipe/new">Create recipe</a>
    </p>

    <div role="search">
      <input type="search" placeholder="Search" bind:value={search} />
    </div>

    {#if recipes.length > 0}
      <ul>
        {#each recipes as { id, name }}
          <li>
            <a href="/recipe/{id}">{name}</a>
          </li>
        {/each}
      </ul>
    {:else}
      <p>No recipes found</p>
    {/if}
  </section>
</main>
