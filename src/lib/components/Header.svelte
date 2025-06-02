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

  let searchInputRef: HTMLInputElement | undefined = $state();
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
      <input type="search" bind:value={filterValue} bind:this={searchInputRef} />
      <svg
        id="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-search-icon lucide-search"
      >
        <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
      </svg>
      {#if filterValue}
        <button
          id="clear-search"
          class="icon"
          aria-label="Clear search"
          onclick={() => {
            filterValue = '';
            searchInputRef?.focus();
          }}
        >
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
            class="lucide lucide-x-icon lucide-x"
          >
            <path d="M20 4 4 20" /><path d="m4 4 16 16" />
          </svg>
        </button>
      {/if}
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
    position: relative;
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;

    input {
      flex-grow: 1;
      font-size: 1rem;
      line-height: 1.5;
      background: none;
      border: 0;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 0.5rem;
      padding-inline-start: 2.325rem;

      &::-webkit-search-cancel-button {
        display: none;
      }
    }

    #search-icon {
      position: absolute;
      width: 1rem;
      height: 1rem;
      left: 0.8125rem;
      top: 0.8125rem;
    }

    #clear-search {
      position: absolute;
      right: 0.8125rem;
      top: 0.8125rem;
      padding: 0;

      svg {
        width: 1rem;
        height: 1rem;
      }
    }
  }
</style>
