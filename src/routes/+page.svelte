<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
</script>

<div id="root">
  <Header title="pantry" />
  <main class="container">
    <ul>
      <li>
        <a href="/recipe">Recipes</a>
      </li>
      <li>
        <a href="/list">Lists</a>
      </li>
      <li>
        <a href="/ingredient">Ingredients</a>
      </li>
    </ul>
  </main>
  <Footer />
</div>
