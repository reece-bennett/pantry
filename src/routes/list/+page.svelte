<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<main class="container">
  <p>
    <a href="/">Back</a>
  </p>

  <h1>Lists</h1>

  <p>
    <a href="/list/new">Create list</a>
  </p>

  <ul>
    {#each data.lists as { id }}
      <li>
        <a href="/list/{id}">{id}</a>
      </li>
    {/each}
  </ul>
</main>

<style>
  h1 {
    margin-top: 0;
  }
</style>
