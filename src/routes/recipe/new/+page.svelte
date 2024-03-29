<script lang="ts">
  export let form;
</script>

<h1>Create new recipe</h1>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

<form method="post">
  <label>
    Title
    <input name="title" type="text" value={form?.data.title ?? ''}>
  </label>
  <label>
    Description
    <textarea name="description" value={form?.data.description.toString() ?? ''}></textarea>
  </label>
  <button>Submit</button>
</form>

<p>
  <a href="/recipe">Cancel</a>
</p>
