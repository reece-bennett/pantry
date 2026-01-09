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
  <Header title="lists">
    {#snippet actions()}
      <a href="/list/select-recipe" class="icon" aria-label="Add list">
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
          class="lucide lucide-plus-icon lucide-plus"
          ><path d="M5 12h14" /><path d="M12 5v14" /></svg
        >
      </a>
    {/snippet}
  </Header>
  <main class="container">
    {#if data.lists.length > 0}
      <ul>
      {#each data.lists.toReversed() as { id }}
        <li>
          <a href="/list/{id}">{id}</a>
        </li>
      {/each}
    </ul>
    {:else}
      <p>No lists created</p>
    {/if}
  </main>
  <Footer />
</div>

<style>
  ul {
    list-style: none;
    padding: 0rem;
  }

  li:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }

  li a {
    display: block;
    padding: 1rem 0;
    text-decoration: none;
  }
</style>
