<script lang="ts">
  import { enhance } from '$app/forms';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let modal: Modal;
</script>

<div id="root">
  <Header backUrl="/recipe">
    {#snippet actions()}
      <a href="/recipe/{data.recipe.id}/edit" class="icon" aria-label="Edit recipe">
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
          class="lucide lucide-pencil-icon lucide-pencil"
          ><path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          /><path d="m15 5 4 4" /></svg
        >
      </a>
    {/snippet}
  </Header>
  <main class="container">
    <h1>{data.recipe.name}</h1>

    <p>{data.recipe.description}</p>

    <p>Serves: {data.recipe.servings}<br />Time: {data.recipe.time} mins</p>

    <h2>Ingredients</h2>

    <ul>
      {#each data.recipe.ingredients as { amount, ingredient, unit }}
        <li>
          {amount}
          {#if unit.name !== 'x'}{unit.name}{/if}
          {ingredient.name}
        </li>
      {/each}
    </ul>

    <h2>Steps</h2>

    <ol>
      {#each data.recipe.steps as step}
        <li>
          {#each step.content.split('\n') as paragraph}
            <p>{paragraph}</p>
          {/each}
        </li>
      {/each}
    </ol>

    <p>
      <a href="/recipe/{data.recipe.id}/edit">Edit recipe</a>
    </p>

    <form id="form" method="post" use:enhance>
      <input type="hidden" name="id" value={data.recipe.id} />
      <button type="button" onclick={() => modal.showModal()}>Delete recipe</button>
    </form>
  </main>
  <Footer />
</div>

<Modal bind:this={modal}>
  <h2>Delete recipe '{data.recipe.name}'?</h2>
  <p>This action cannot be undone!</p>
  <footer>
    <button class="secondary" onclick={() => modal.close()}>Cancel</button>
    <button form="form" onclick={() => modal.close()}>Confirm</button>
  </footer>
</Modal>
