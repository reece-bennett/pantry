<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  // This doesn't let you type when `form.data` is populated
  // $: rows = form?.data ? [...form.data] : ['Nothing'];

  // This does
  let rows = ['Nothing'];
  $: initialiseRows(form);
  function initialiseRows(form: ActionData) {
    if (form?.data) {
      rows = form.data;
    }
  }

  function addRow() {
    rows = [...rows, ''];
  }

  function removeRow(index: number) {
    rows = rows.toSpliced(index, 1);
  }

  $: console.log('data', data);
  $: console.log('form', form);
  $: console.log('rows', rows);
</script>

<main class="container">
  <form method="post" action="?/preload" use:enhance>
    <label for="values">Comma separated values to preload</label>
    <input id="values" name="values" type="text" />
    <button type="submit">Submit</button>
  </form>

  <hr />

  <form method="post" action="?/submit" use:enhance>
    {#each rows as row, i}
      <!-- svelte-ignore a11y-no-redundant-roles -->
      <fieldset role="group">
        <input name="row" type="text" bind:value={row} />
        <button type="button" on:click={() => removeRow(i)}>Remove</button>
      </fieldset>
    {/each}
    <button type="button" on:click={addRow}>Add</button>
    <button type="submit">Submit</button>
  </form>

  {#if form?.message}
    <p>{form.message}</p>
  {/if}
</main>
