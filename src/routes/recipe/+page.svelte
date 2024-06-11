<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<main class="container">
  <p>
    <a href="/">Back</a>
  </p>

  <h1>Recipes</h1>

  <p>
    <a href="/recipe/new">Add recipe</a>
  </p>

  <ul>
    {#each data.recipes as { slug, name }}
      <li>
        <a href="/recipe/{slug}">{name}</a>
      </li>
    {/each}
  </ul>
</main>

<style>
  h1 {
    margin-top: 0;
  }
</style>
