<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<main class="container">
  <p>
    <a href="/">Back</a>
  </p>

  <section>
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
  </section>
</main>
