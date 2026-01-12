<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';

  let activeSection = $derived.by(() => {
    const route = page.route.id;
    if (route === '/recipe' || route === '/list' || route === '/ingredient') {
      return route.substring(1);
    }
    if (browser) {
      return sessionStorage.getItem('activeSection') || 'recipe';
    }
    return 'recipe';
  });
  $effect(() => {
    if (browser && activeSection) {
      sessionStorage.setItem('activeSection', activeSection);
    }
  });
</script>

<footer class="container">
  <a href="/recipe" aria-label="Recipes" class={{ active: activeSection === 'recipe' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-book-open-icon lucide-book-open"
    >
      <path d="M12 7v14" />
      <path
        d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
      />
    </svg>
  </a>
  <a href="/list" aria-label="Lists" class={{ active: activeSection === 'list' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-clipboard-list-icon lucide-clipboard-list"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  </a>
  <a href="/ingredient" aria-label="Ingredients" class={{ active: activeSection === 'ingredient' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-cooking-pot-icon lucide-cooking-pot"
    >
      <path d="M2 12h20" />
      <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
      <path d="m4 8 16-4" />
      <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
    </svg>
  </a>
</footer>

<style>
  footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0;
  }

  a {
    line-height: 0;
    width: 20%;
    padding: 1rem 0;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
    color: var(--text-very-muted);
  }

  a.active {
    color: var(--text-primary);
  }
</style>
