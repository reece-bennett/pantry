<script lang="ts">
  export let name: string;
  export let number: number;

  let stringyNumber = '';

  const updateString = (x: number) => {
    // console.log('Input', x);
    stringyNumber = String(x);
  };

  const updateNumber = (x: string) => {
    // console.log('Output', x);
    if (x.replace(/\D/g, '') !== '') {
      number = parseInt(x);
    }
  };

  // $: console.log("Before", number, stringyNumber);
  $: stringyNumber = stringyNumber.replace(/\D/g, '')
  $: updateString(number);
  $: updateNumber(stringyNumber);
  // $: console.log("After", number, stringyNumber);
</script>

<!-- svelte-ignore a11y-no-redundant-roles -->
<fieldset role="group">
  <button
    type="button"
    on:click|preventDefault={() => {
      number = Math.max(0, number - 1);
    }}
  >
    -
  </button>
  <input {name} type="text" inputmode="numeric" bind:value={stringyNumber} />
  <button
    type="button"
    on:click|preventDefault={() => {
      number++;
    }}
  >
    +
  </button>
</fieldset>

<style>
  fieldset {
    width: fit-content;
    margin-bottom: 0;
  }

  button {
    max-width: fit-content;
    --pico-form-element-spacing-horizontal: 1rem !important;
  }

  input[type='text'] {
      max-width: 3em;
      text-align: center;
      --pico-form-element-spacing-horizontal: 0rem;
    }
</style>
