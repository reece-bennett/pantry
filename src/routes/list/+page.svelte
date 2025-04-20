<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import type { PageData } from './$types';
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<div id="root">
  <Header title="lists" />
  <main class="container">
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
  <Footer />
</div>
