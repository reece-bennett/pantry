<script lang="ts">
  import { pwaInfo } from 'virtual:pwa-info';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '')
</script>

<svelte:head>
 	{@html webManifestLink}
</svelte:head>

{@render children?.()}

<style>
  @import 'https://unpkg.com/@picocss/pico@latest/css/pico.min.css';

  :global(body) {
    padding-top: 2rem;
  }

  @media (min-width: 768px) {
    :root {
      /* Stop pico increasing font size beyond 18px on larger breakpoints */
      --pico-font-size: 112.5%;
    }
  }
</style>
