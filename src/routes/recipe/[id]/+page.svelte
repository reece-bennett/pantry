<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import { enhance } from '$app/forms';
  import Modal from '$lib/components/Modal.svelte';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let modal: Modal = $state();
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

    <p>
      <a href="/recipe/{data.recipe.id}/edit">Edit recipe</a>
    </p>

    <form id="form" method="post" use:enhance>
      <input type="hidden" name="id" value={data.recipe.id} />
      <button onclick={preventDefault(() => modal.showModal())}>Delete recipe</button>
    </form>
  </section>
</main>

<Modal bind:this={modal}>
  <h2>Delete recipe '{data.recipe.name}'?</h2>
  <p>This action cannot be undone!</p>
  <footer>
    <button class="secondary" onclick={() => modal.close()}>Cancel</button>
    <button form="form" onclick={() => modal.close()}>Confirm</button>
  </footer>
</Modal>
