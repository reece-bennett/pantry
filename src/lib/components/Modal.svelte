<script lang="ts">
  import { browser } from '$app/environment';
  import { onDestroy } from 'svelte';

  const IS_OPEN_CLASS = 'modal-is-open';
  const OPENING_CLASS = 'modal-is-opening';
  const CLOSING_CLASS = 'modal-is-closing';
  const SCROLLBAR_WIDTH_CSS_VAR = '--pico-scrollbar-width';
  const ANIMATION_DURATION_MS = 400;

  let html: HTMLElement;
  let dialog: HTMLDialogElement;
  let closing = false;

  export function isOpen() {
    return dialog.open;
  }

  export function showModal() {
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
      html.style.setProperty(SCROLLBAR_WIDTH_CSS_VAR, `${scrollbarWidth}px`);
    }
    html.classList.add(IS_OPEN_CLASS, OPENING_CLASS);
    setTimeout(() => {
      html.classList.remove(OPENING_CLASS);
    }, ANIMATION_DURATION_MS);
    dialog.showModal();
  }

  export function close() {
    html.classList.add(CLOSING_CLASS);
    closing = true;
    setTimeout(() => {
      if (closing) {
        html.classList.remove(CLOSING_CLASS, IS_OPEN_CLASS);
        html.style.removeProperty(SCROLLBAR_WIDTH_CSS_VAR);
        dialog.close();
      }
    }, ANIMATION_DURATION_MS);
  }

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  if (browser) {
    html = document.documentElement;
    document.addEventListener('keydown', handleEscapeClose);
  }

  function handleEscapeClose(event: KeyboardEvent) {
    // Fix ESC in Chrome closing the modal without triggering the animation
    if (dialog.open && event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  onDestroy(() => {
    if (closing) {
      html.classList.remove(CLOSING_CLASS, IS_OPEN_CLASS);
      html.style.removeProperty(SCROLLBAR_WIDTH_CSS_VAR);
      closing = false;
    }
    if (browser) {
      document.removeEventListener('keydown', handleEscapeClose);
    }
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => {
    closing = false;
  }}
  on:click|self={() => close()}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <article on:click|stopPropagation>
    <slot />
  </article>
</dialog>
