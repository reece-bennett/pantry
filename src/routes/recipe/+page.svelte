<script lang="ts">
  import type { PageData } from './$types';
  import { filterListByKey } from '$lib/fuzzy';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let search = $state('');

  let recipes = $derived(search ? filterListByKey(data.recipes, 'name', search) : data.recipes);
</script>

<div id="root">
  <Header title="recipes" showFilter={true} bind:filterValue={search}>
    {#snippet actions()}
      <a href="/recipe/new" class="icon" aria-label="Add recipe">
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
  }
</style>
