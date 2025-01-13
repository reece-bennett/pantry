<!-- 
  Input modifier idea adapted from https://github.com/sveltejs/svelte/issues/3937#issuecomment-1924718545
-->

<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  interface Props {
    name: string;
    number: number;
  }

  let { name, number = $bindable() }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_redundant_roles -->
<fieldset role="group">
  <button
    type="button"
    onclick={preventDefault(() => {
      number = Math.max(0, number - 1);
    })}
  >
    -
  </button>
  <input
    {name}
    type="text"
    inputmode="numeric"
    value={String(number)}
    onfocus={(event) => event.currentTarget.select()}
    oninput={(event) => (event.currentTarget.value = event.currentTarget.value.replace(/\D/g, ''))}
    onchange={(event) => {
      const parsed = parseInt(event.currentTarget.value);
      if (!isNaN(parsed)) {
        number = parsed;
      }
    }}
  />
  <button
    type="button"
    onclick={preventDefault(() => {
      number++;
    })}
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
