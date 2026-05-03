import { useEffect } from 'react';

/**
 * Writes three CSS vars on :root that describe the keyboard / viewport state:
 *   --inner-height        : window.innerHeight in px (true layout viewport height)
 *   --keyboard-height     : how many px the keyboard occupies
 *   --vv-offset-top       : how many px iOS Safari has shifted the layout viewport up
 *
 * Mount once near the app root. Opts into the Chromium VirtualKeyboard API
 * (overlays-content) when available so no JS is needed on Chrome/Firefox.
 */
export function useVisualViewportInsets() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('virtualKeyboard' in navigator) {
      try { navigator.virtualKeyboard.overlaysContent = true; } catch { /* no-op */ }
    }

    const root = document.documentElement;

    const update = () => {
      const vv = window.visualViewport;
      const innerHeight = window.innerHeight;
      root.style.setProperty('--inner-height', `${innerHeight}px`);

      if (vv) {
        const keyboardHeight = Math.max(0, innerHeight - vv.height - vv.offsetTop);
        const offsetTop = Math.max(0, vv.offsetTop);
        root.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
        root.style.setProperty('--vv-offset-top', `${offsetTop}px`);
      }
    };

    update();
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
}
