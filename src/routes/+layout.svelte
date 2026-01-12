<script lang="ts">
  import { pwaInfo } from 'virtual:pwa-info';
  import '../app.css';

  let { children } = $props();

  let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

{@render children()}
