<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<h1>Recipes</h1>

<ul>
  {#each data.recipes as {slug, title}}
    <li>
      <a href="/recipe/{slug}">{title}</a>
    </li>
  {/each}
</ul>
