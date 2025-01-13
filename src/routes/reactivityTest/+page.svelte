<script lang="ts">
  import { run } from 'svelte/legacy';

  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }

  let { data, form }: Props = $props();

  // This doesn't let you type when `form.data` is populated
  // $: rows = form?.data ? [...form.data] : ['Nothing'];

  // This does
  let rows = $state(['Nothing']);
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

  run(() => {
    initialiseRows(form);
  });
  run(() => {
    console.log('data', data);
  });
  run(() => {
    console.log('form', form);
  });
  run(() => {
    console.log('rows', rows);
  });
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
      <!-- svelte-ignore a11y_no_redundant_roles -->
      <fieldset role="group">
        <input name="row" type="text" bind:value={row} />
        <button type="button" onclick={() => removeRow(i)}>Remove</button>
      </fieldset>
    {/each}
    <button type="button" onclick={addRow}>Add</button>
    <button type="submit">Submit</button>
  </form>

  {#if form?.message}
    <p>{form.message}</p>
  {/if}
</main>
