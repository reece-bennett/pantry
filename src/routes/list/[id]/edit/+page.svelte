<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/Button.svelte';
  import Counter from '$lib/components/Counter.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import type { ActionData, PageData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  let modal: Modal;

  let recipes = $state(
    data.list.meals.map(({ recipe: {id, name, servings} }) => ({
      id,
      name,
      servings,
      number:
        form?.data.get(id) ?? data.list.meals.find((meal) => meal.recipeId === id)?.servings ?? 0
    }))
  );
</script>

<div id="root">
  <Header backUrl="/list/{data.list.id}">
    {#snippet actions()}
      <button type="submit" form="edit-form" class="icon" aria-label="Save">
        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg> -->
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
          class="lucide lucide-save-icon lucide-save"
        >
          <path
            d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
          />
          <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
          <path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg
        >
      </button>
    {/snippet}
  </Header>
  <main class="container">
    <h1>Editing list {data.list.id}</h1>

    <form id="edit-form" method="post" action="?/save" use:enhance>
      <ul>
        {#each recipes as recipe}
          <li>
            <span>{recipe.name}</span>
            <Counter name={recipe.id} bind:number={recipe.number} />
          </li>
        {:else}
          <p>No recipes selected</p>
        {/each}
      </ul>

      <Button type="submit" formaction="?/addRecipe">Add recipe</Button>
    </form>

    <Button fullWidth danger onclick={() => modal.showModal()}>Delete list</Button>
  </main>
  <Footer />
</div>

<form id="delete-form" method="post" action="?/delete" use:enhance>
  <Modal bind:this={modal}>
    <h2>Delete 'List {data.list.id}'?</h2>
    <p>This action cannot be undone!</p>
  </Modal>
</form>

<style>
  ul {
    list-style: none;
    padding: 0rem;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0;
  }

  li:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }

  #edit-form {
    margin-bottom: var(--typography-spacing-top);
  }

  #delete-form h2 {
    margin-top: 0;
  }
</style>
