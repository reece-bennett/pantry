<script lang="ts">
  import { browser } from '$app/environment';
  import { onDestroy, type Snippet } from 'svelte';
  import Button from './Button.svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const IS_OPEN_CLASS = 'modal-is-open';
  const SCROLLBAR_WIDTH_CSS_VAR = '--scrollbar-width';

  let html: HTMLElement;
  let dialog: HTMLDialogElement;

  export function isOpen() {
    return dialog.open;
  }

  export function showModal() {
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth) {
      html.style.setProperty(SCROLLBAR_WIDTH_CSS_VAR, `${scrollbarWidth}px`);
    }
    html.classList.add(IS_OPEN_CLASS);
    dialog.showModal();
  }

  export function close() {
    html.classList.remove(IS_OPEN_CLASS);
    html.style.removeProperty(SCROLLBAR_WIDTH_CSS_VAR);
    dialog.close();
  }

  function getScrollbarWidth() {
    return window.innerWidth - (document.querySelector('main')?.clientWidth ?? 0);
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
    if (browser) {
      document.removeEventListener('keydown', handleEscapeClose);
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclick={() => close()}
>
  <article onclick={(event) => event.stopPropagation()}>
    {@render children()}

    <footer>
      <Button type="button" fullWidth onclick={close}>Cancel</Button>
      <Button type="submit" danger fullWidth onclick={close}>Confirm</Button>
    </footer>
  </article>
</dialog>

<style>
  dialog {
    padding: 0;
    border: 0;
    background: none;

    display: flex;
    position: fixed;
    justify-content: center;
    align-items: center;
    min-width: 100%;
    min-height: 100%;

    &:not([open]) {
      display: none;
    }
  }

  article {
    background: white;
    padding: 1rem;
    margin: 1rem;
  }

  footer {
    display: flex;
    gap: 0.5rem;
  }
</style>
