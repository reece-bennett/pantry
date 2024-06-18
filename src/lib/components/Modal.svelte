<script lang="ts">
  import { browser } from '$app/environment';

  const IS_OPEN_CLASS = 'modal-is-open';
  const OPENING_CLASS = 'modal-is-opening';
  const CLOSING_CLASS = 'modal-is-closing';
  const SCROLLBAR_WIDTH_CSS_VAR = '--pico-scrollbar-width';
  const ANIMATION_DURATION_MS = 400;

  export let open = false;

  let dialog: HTMLDialogElement;

  export function showModal() {
    const html = document.documentElement;
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
      html.style.setProperty(SCROLLBAR_WIDTH_CSS_VAR, `${scrollbarWidth}px`);
    }
    html.classList.add(IS_OPEN_CLASS, OPENING_CLASS);
    setTimeout(() => {
      html.classList.remove(OPENING_CLASS);
    }, ANIMATION_DURATION_MS);
    dialog.showModal();
    open = true;
  }

  export function close() {
    const html = document.documentElement;
    html.classList.add(CLOSING_CLASS);
    setTimeout(() => {
      html.classList.remove(CLOSING_CLASS, IS_OPEN_CLASS);
      html.style.removeProperty(SCROLLBAR_WIDTH_CSS_VAR);
      dialog.close();
    }, ANIMATION_DURATION_MS);
  }

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  if (browser) {
    document.addEventListener('keydown', (event) => {
      // By default (in Chrome) ESC closes the modal without triggering the animation
      if (open && event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={() => (open = false)} on:click|self={() => close()}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <article on:click|stopPropagation>
    <slot />
  </article>
</dialog>
