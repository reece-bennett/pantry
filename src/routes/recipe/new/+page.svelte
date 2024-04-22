<script lang="ts">
  export let form;

  let ingredients = [
    {
      ingredient: '',
      unit: '',
      amount: ''
    }
  ];

  function addIngredient() {
    ingredients = [...ingredients, { ingredient: '', unit: '', amount: '' }];
  }

  function removeIngredient(i: number) {
    ingredients = ingredients.toSpliced(i, 1);
  }

  let steps = [''];

  function addStep() {
    steps = [...steps, ''];
  }

  function removeStep(i: number) {
    steps = steps.toSpliced(i, 1);
  }
</script>

<h1>Create new recipe</h1>

{#if form?.error}
  <p class="error">{form.error}</p>
{/if}

<form method="post">
  <div class="form-group">
    <label for="title">Title:</label>
    <input name="title" type="text" value={form?.data.title ?? ''} />
  </div>

  <div class="form-group">
    <label for="description">Description:</label>
    <textarea name="description" value={form?.data.description.toString() ?? ''}></textarea>
  </div>

  <div class="form-group">
    <span>Ingredients:</span>
    {#each ingredients as ingredient, i}
      <div class="row">
        <input
          name="amount-{i}"
          class="amount"
          type="text"
          inputmode="numeric"
          bind:value={ingredient.amount}
        />
        <select name="unit-{i}" bind:value={ingredient.unit}>
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="tsp">tsp</option>
          <option value="tbsp">tbsp</option>
        </select>
        <input name="ingredient-{i}" type="text" bind:value={ingredient.ingredient} />
        <button
          type="button"
          on:click|preventDefault={() => removeIngredient(i)}
          disabled={ingredients.length < 2}
        >
          X
        </button>
      </div>
    {/each}
    <button type="button" on:click|preventDefault={addIngredient}>Add</button>
  </div>

  <div class="form-group">
    <span>Steps:</span>
    {#each steps as step, i}
      <div class="row">
        <textarea name="step-{1}" bind:value={step}></textarea>
        <button
          type="button"
          on:click|preventDefault={() => removeStep(i)}
          disabled={steps.length < 2}
        >
          X
        </button>
      </div>
    {/each}
    <button type="button" on:click|preventDefault={addStep}>Add</button>
  </div>

  <div>
    <button type="submit">Submit</button>
    <a href="/recipe">Cancel</a>
  </div>
</form>

<style>
  .form-group {
    margin-bottom: 1em;
    width: 300px;
    position: relative;
  }

  label {
    display: block;
  }

  .form-group > input,
  .form-group > textarea {
    width: 100%;
  }

  button[type='submit'] {
    margin-right: 0.5em;
  }

  .amount {
    width: 3em;
  }

  .row {
    display: flex;
  }
</style>
