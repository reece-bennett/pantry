<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<main class="container">
  <p>
    <a href="/">Back</a>
  </p>

  <section>
    <h1>Recipes</h1>

    <p>
      <a href="/recipe/new">Add recipe</a>
    </p>

    <ul>
      {#each data.recipes as { id, name }}
        <li>
          <a href="/recipe/{id}">{name}</a>
        </li>
      {/each}
    </ul>
  </section>
</main>
