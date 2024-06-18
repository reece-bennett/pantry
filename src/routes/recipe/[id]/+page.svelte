<script lang="ts">
  import { enhance } from '$app/forms';
  import Modal from '$lib/components/Modal.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let modal: Modal;
</script>

<main class="container">
  <p>
    <a href="/recipe">Back</a>
  </p>

  <section>
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

    <form id="form" method="post" use:enhance>
      <input type="hidden" name="id" value={data.recipe.id} />
      <button on:click|preventDefault={() => modal.showModal()}>Delete recipe</button>
    </form>
  </section>
</main>

<Modal bind:this={modal}>
  <h2>Delete recipe '{data.recipe.name}'?</h2>
  <p>This action cannot be undone!</p>
  <footer>
    <button class="secondary" on:click={() => modal.close()}>Cancel</button>
    <button form="form" on:click={() => modal.close()}>Confirm</button>
  </footer>
</Modal>
