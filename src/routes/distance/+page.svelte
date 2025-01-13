<script lang="ts">
  import { distance } from 'fastest-levenshtein';
  import Fuse, { type FuseResult } from 'fuse.js';
  import type { PageData } from './$types';
  import uFuzzy from '@leeoniya/ufuzzy';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const fuse = new Fuse(data.ingredients, {
    includeScore: true,
    threshold: 0.6, // default 0.6
    distance: 100 // default 100
  });

  const uf = new uFuzzy({
    intraMode: 1
  });

  let levenshteinResults: { ingredient: string; distance: number }[] = $state([]);

  let fuseResults: FuseResult<string>[] = $state([]);

  let ufResults: string[] = $state([]);

  function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const value = event.currentTarget.value;

    levenshteinResults = data.ingredients
      .map((ingredient) => ({
        ingredient,
        distance: distance(value, ingredient)
      }))
      .sort((a, b) => a.distance - b.distance);

    fuseResults = fuse.search(value);

    const [indexes, info, order] = uf.search(data.ingredients, value);
    ufResults = order?.map((o) => data.ingredients[info.idx[o]]) ?? [];
  }
</script>

<main class="container">
  <input type="text" oninput={(event) => handleInput(event)} />

  <div class="grid">
    <div>
      <h2>Levenshtein</h2>
      <p>{levenshteinResults.length} results</p>
      <ol>
        {#each levenshteinResults as { ingredient, distance }}
          <li>{ingredient} ({distance})</li>
        {/each}
      </ol>
    </div>
    <div>
      <h2>Fuse.js</h2>
      <p>{fuseResults.length} results</p>
      <ol>
        {#each fuseResults as { item, score }}
          <li>{item} ({score})</li>
        {/each}
      </ol>
    </div>
    <div>
      <h2>uFuzzy</h2>
      <p>{ufResults.length} results</p>
      <ol>
        {#each ufResults as item}
          <li>{item}</li>
        {/each}
      </ol>
    </div>
  </div>
</main>
