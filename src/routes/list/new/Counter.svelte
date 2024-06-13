<!-- 
  Input modifier idea adapted from https://github.com/sveltejs/svelte/issues/3937#issuecomment-1924718545
-->

<script lang="ts">
  export let name: string;
  export let number: number;
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
  <input
    {name}
    type="text"
    inputmode="numeric"
    value={String(number)}
    on:focus={(event) => event.currentTarget.select()}
    on:input={(event) => (event.currentTarget.value = event.currentTarget.value.replace(/\D/g, ''))}
    on:change={(event) => {
      const parsed = parseInt(event.currentTarget.value);
      if (!isNaN(parsed)) {
        number = parsed;
      }
    }}
  />
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
