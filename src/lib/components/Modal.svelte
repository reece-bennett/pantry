<script lang="ts">
  import { browser } from '$app/environment';
  import { onDestroy, type Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const IS_OPEN_CLASS = 'modal-is-open';
  const OPENING_CLASS = 'modal-is-opening';
  const CLOSING_CLASS = 'modal-is-closing';
  const SCROLLBAR_WIDTH_CSS_VAR = '--pico-scrollbar-width';
  const ANIMATION_DURATION_MS = 400;

  let html: HTMLElement;
  let dialog: HTMLDialogElement;
  let closing = $state(false);

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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={() => {
    closing = false;
  }}
  onclick={() => close()}
>
  <article onclick={(event) => event.stopPropagation() }>
    {@render children()}
  </article>
</dialog>
