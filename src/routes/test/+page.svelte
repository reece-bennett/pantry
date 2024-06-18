<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;

  let rows = [{ value: 'Nothing' }];
  $: initialiseRows(data);

  function initialiseRows(data: PageData) {
    console.log('Initialise rows');
    if (data.recipe) {
      rows = data.recipe.ingredients.map((ingredient) => ({ value: ingredient.name }));
    }
  }

  function addRow() {
    rows = [...rows, { value: '' }];
  }

  function removeRow(index: number) {
    rows = rows.toSpliced(index, 1);
  }

  $: console.log('data', data);
  $: console.log('rows', rows);
</script>

<main class="container">
  <form method="post" action="?/url" use:enhance>
    <label for="url">Import from a URL</label>
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <fieldset role="group">
      <input id="url" name="url" type="url" placeholder="Recipe URL" value={data.importUrl} />
      <button type="submit">Submit</button>
    </fieldset>
  </form>

  <hr />

  {#each rows as row, i}
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <fieldset role="group">
      <input type="text" bind:value={row.value} />
      <button on:click={() => removeRow(i)}>Remove</button>
    </fieldset>
  {/each}
  <button on:click={() => addRow()}>Add</button>
</main>
