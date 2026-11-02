# Navigation V6.3 — exact changes

1. All cross-document View Transitions and entrance fades are disabled.
2. A subtle ~0.42 s accent line within the sticky header is the sole navigation animation. It does not cover or resize content.
3. Removed the view-timeline animation on technical figures, media, and documentation because it made those elements fade/shift when navigating into a scrolled page.
4. CSS and JS URLs in every HTML page carry `?v=6.3` so the browser requests these exact versions instead of stale cached files.
5. Music Mode keeps its separate same-document transition.

No visual browser regression test was possible in this environment; test locally before replacing your published site.
