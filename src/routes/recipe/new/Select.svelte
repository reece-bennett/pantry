<script lang="ts">
  import Select from 'svelte-select';

  interface Props {
    items: any[];
    value: any;
  }

  let { items = $bindable(), value = $bindable() }: Props = $props();

  let filterText = $state('');
  let justValue: any = $state();

  // $: console.log(filterText, value, justValue, items);

  function handleFilter(event: CustomEvent) {
    if (event.detail.length === 0 && filterText.length > 0) {
      const prev = items.filter((i) => !i.created);
      items = [...prev, { name: filterText, created: true }];
    }
  }

  function handleChange() {
    items = items.map((i) => {
      delete i.created;
      return i;
    });
  }
</script>

<Select
  on:change={handleChange}
  on:filter={handleFilter}
  bind:filterText
  {items}
  bind:value
  bind:justValue
  label="name"
  itemId="name"
  clearFilterTextOnBlur={false}
  clearable={false}
  --font-size="18px"
  --border-radius="0px"
  --background="var(--pico-form-element-background-color)"
  --input-color="var(--pico-color)"
  --item-color="var(--pico-color)"
  --border-focused="1px solid var(--pico-form-element-focus-color)"
>
  <div slot="item" let:item>
    {item.created ? 'Add new: ' : ''}
    {item.name}
  </div>
</Select>

<input type="hidden" name="ingredient" bind:value={justValue} />
