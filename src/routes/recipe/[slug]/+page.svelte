<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<h1>{data.recipe.title}</h1>

<p>{data.recipe.description}</p>

<p>
  <a href="/recipe">Back</a>
</p>
