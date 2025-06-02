<!--
  Input modifier idea adapted from https://github.com/sveltejs/svelte/issues/3937#issuecomment-1924718545
-->

<script lang="ts">
  interface Props {
    name: string;
    number: number;
  }

  let { name, number = $bindable() }: Props = $props();
</script>

<fieldset>
  <button
    type="button"
    onclick={() => {
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
    onclick={() => {
      number++;
    }}
  >
    +
  </button>
</fieldset>

<style>
  fieldset {
    border: 0;
    padding: 0;
    display: flex;
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
  }

  button {
    padding: 1rem 1.25rem;
    background: none;
    border: 0;
  }


  input {
    width: 2.5em;
    text-align: center;
    background: none;
    border: 1px solid var(--border);
    border-top: 0;
    border-bottom: 0;
    border-radius: 0;
  }
</style>
