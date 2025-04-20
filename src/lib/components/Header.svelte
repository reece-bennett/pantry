<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    backUrl?: string;
    showFilter?: boolean;
    filterValue?: string;
    actions?: Snippet;
  }

  let { title, backUrl, showFilter = false, filterValue = $bindable(), actions }: Props = $props();
</script>

<header class="container">
  <nav>
    {#if backUrl}
      <a href={backUrl} id="back-url" aria-label="Back">
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
          class="lucide lucide-arrow-left-icon lucide-arrow-left"
          ><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg
        >
      </a>
    {:else}
      <h1 id="logo">{title}</h1>
    {/if}
    <div id="header-actions">
      {@render actions?.()}
      <button id="theme-toggle" class="icon" aria-label="Toggle theme">
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
          class="lucide lucide-moon"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>
    </div>
  </nav>
  {#if showFilter}
    <div id="header-search">
      <input type="search" bind:value={filterValue} />
      <button class="icon" aria-label="Filter">
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
          class="lucide lucide-funnel"
        >
          <path
            d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
          />
        </svg>
      </button>
    </div>
  {/if}
</header>

<style>
  header {
    padding: 1rem;
  }

  #back-url {
    padding: 0.25rem;
    line-height: 0;
  }

  nav {
    height: 2.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #header-actions {
    display: flex;
    gap: 1rem;
  }

  #header-search {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;

    input {
      flex-grow: 1;
      font-size: 1rem;
      background: none;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 0.5rem;
    }
  }
</style>
