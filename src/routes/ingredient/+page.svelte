<script lang="ts">
  import { enhance } from '$app/forms';
  import { fuzzySearch } from '$lib/fuzzy';
  import type { PageData } from './$types';

  export let data: PageData;

  let filterString = '';
  $: searchResults = fuzzySearch(data.ingredients, filterString);

  $: ingredients = data.ingredients.map((ingredient) => ({
    original: ingredient,
    name: ingredient,
    shown: searchResults.length === 0 || searchResults.includes(ingredient)
  }));
</script>

<main class="container">
  <p>
    <a href="/">Back</a>
  </p>

  <section>
    <h1>Ingredients</h1>

    <div role="search">
      <input type="search" placeholder="Filter" bind:value={filterString} />
    </div>

    <form
      method="post"
      use:enhance={() => {
        return async ({ update }) => {
          update({ reset: false });
        };
      }}
    >
      <div class="ingredient-container">
        {#each ingredients as { name, shown }}
          <article hidden={!shown}>
            <input type="text" {name} value={name} />
            <small>{name}</small>
          </article>
        {/each}
      </div>

      <button type="submit">Save</button>
    </form>
  </section>
</main>

<style>
  .container {
    max-width: 700px;
  }

  small {
    margin-bottom: 0;
  }

  form {
    position: relative;
  }

  button {
    position: sticky;
    bottom: var(--pico-spacing);
    margin: 0;
  }
</style>
