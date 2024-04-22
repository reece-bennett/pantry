<script lang="ts">
  export let form;

  let ingredients = [
    {
      ingredient: '',
      unit: 'g',
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

<main class="container">
  <h1>Create new recipe</h1>
  
  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}
  
  <form method="post">
    <label for="title">Title</label>
    <input name="title" type="text" value={form?.data.title ?? ''} />
  
    <label for="description">Description</label>
    <textarea name="description" value={form?.data.description.toString() ?? ''}></textarea>
  
    <h2>Ingredients</h2>
    {#each ingredients as ingredient, i}
      <!-- svelte-ignore a11y-no-redundant-roles -->
      <fieldset role="group">
        <input
          name="amount-{i}"
          class="amount"
          type="text"
          inputmode="numeric"
          placeholder="0"
          bind:value={ingredient.amount}
        />
        <select name="unit-{i}" bind:value={ingredient.unit}>
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="tsp">tsp</option>
          <option value="tbsp">tbsp</option>
        </select>
        <input name="ingredient-{i}" type="text" placeholder="Ingredient" bind:value={ingredient.ingredient} />
        <button
          type="button"
          on:click|preventDefault={() => removeIngredient(i)}
          disabled={ingredients.length < 2}
        >
          ❌
        </button>
      </fieldset>
    {/each}
    <button type="button" on:click|preventDefault={addIngredient}>Add</button>
  
    <h2>Steps</h2>
    {#each steps as step, i}
      <!-- svelte-ignore a11y-no-redundant-roles -->
      <fieldset role="group">
        <textarea name="step-{1}" bind:value={step}></textarea>
        <button
          type="button"
          on:click|preventDefault={() => removeStep(i)}
          disabled={steps.length < 2}
        >
          ❌
        </button>
      </fieldset>
    {/each}
    <button type="button" on:click|preventDefault={addStep}>Add</button>
  
    <div>
      <button type="submit">Submit</button>
      <a href="/recipe">Cancel</a>
    </div>
  </form>
  
  <style>
    input.amount {
      width: 25%;
    }
  </style>
</main>
