<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: console.log(form);
  $: ingredients = form?.success ? form?.data?.recipe?.ingredients ?? [] : [];
</script>

<main class="container">
  <form method="post" use:enhance>
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <fieldset role="group">
      <input name="url" type="url" placeholder="Recipe URL" value={form?.data?.url ?? ''} />
      <button type="submit">Submit</button>
    </fieldset>
  </form>

  <ul>
    {#each ingredients as { amount, unit, name, original }}
      <li>
        <span class="amount">{amount}</span>
        <span class="unit">{unit}</span>
        <span class="ingredient">{name}</span>
        <span class="original">{original}</span>
      </li>
    {/each}
  </ul>
</main>

<style>
  .amount {
    background-color: rgb(234, 109, 109);
  }

  .unit {
    background-color: rgb(78, 184, 78);
  }

  .ingredient {
    background-color: rgb(124, 124, 239);
  }

  .original {
    background-color: rgb(182, 182, 182);
  }
</style>
