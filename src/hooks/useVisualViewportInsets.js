import { useEffect } from 'react';

/**
 * Tracks the visual viewport and exposes keyboard insets as CSS vars on :root:
 *   --keyboard-inset-height : px the keyboard occupies
 *   --layout-viewport-offset-top : px Safari has shifted the layout viewport up
 *
 * Mounted once near the app root. Opts into the Chromium VirtualKeyboard API
 * when available so the keyboard overlays content rather than resizing it.
 */
export function useVisualViewportInsets() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('virtualKeyboard' in navigator) {
      try {
        navigator.virtualKeyboard.overlaysContent = true;
      } catch {
        /* no-op */
      }
    }

    const root = document.documentElement;
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const layoutHeight = window.innerHeight;
      const keyboardInset = Math.max(0, layoutHeight - vv.height - vv.offsetTop);
      const offsetTop = Math.max(0, vv.offsetTop);
      root.style.setProperty('--keyboard-inset-height', `${keyboardInset}px`);
      root.style.setProperty('--layout-viewport-offset-top', `${offsetTop}px`);
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);
}
