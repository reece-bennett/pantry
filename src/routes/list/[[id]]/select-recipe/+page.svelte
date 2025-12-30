<script lang="ts">
  import { enhance } from '$app/forms';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import { filterListByKey } from '$lib/fuzzy';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let backUrl = $derived(data.listId ? `/list/${data.listId}/edit` : '/list');
  let search = $state('');
  let recipes = $derived(search ? filterListByKey(data.recipes, 'name', search) : data.recipes);
</script>

<div id="root">
  <Header {backUrl} showFilter={true} bind:filterValue={search} />
  <main class="container">
    {#if recipes.length > 0}
      <form method="post" use:enhance>
        <ul>
          {#each recipes as { id, name }}
            <li>
              <button type="submit" name="id" value={id}>{name}</button>
            </li>
          {/each}
        </ul>
      </form>
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

  li button {
    display: block;
    width: 100%;
    padding: 1rem 0;
    text-align: left;
    background: none;
    border: none;
    line-height: 1.5;
    font-weight: normal;
  }
</style>
