# Benson Lin — portfolio (static site)

Plain HTML, one stylesheet (`site.css`), one script (`site.js`). No build step, no frameworks, no tracking.

## Preview locally
- **Quickest:** double-click `index.html`. Everything works from `file://` except embedded YouTube players
  (YouTube blocks embeds from local files), so those buttons open YouTube in a new tab instead.
- **Closer to production:** in this folder run `python3 -m http.server 8000` and open http://localhost:8000.
  Embedded YouTube players work here and on GitHub Pages.

## Publish on GitHub Pages
1. Put the **contents of this folder** (not the folder itself) at the root of your repository, e.g. `username.github.io`.
   `.nojekyll` is included so Pages serves the files as-is.
2. Repo **Settings → Pages →** deploy from branch `main`, folder `/ (root)`.
3. Wait about a minute. Old `#hash` links from the previous single-page site (e.g. `/#hydration-bot`) redirect to the new pages.

## Files
| File | What it is |
|---|---|
| `index.html` | Home: hero, project index, about |
| `gaucho-racing.html` … `laziness-detector.html` | One page per project (8) |
| `extras.html` | Side projects, concept sketches, Music Mode |
| `site.css`, `site.js` | All styling and behaviour |
| `assets/` | Your original images and videos, plus `thumbs/`, `posters/`, `docs/` (generated previews) |
| `*.pdf` | Your reports, posters and résumé (unchanged) |

## Editing
- **Project colours:** the block `/* per-project accents (generated) */` in `site.css` (`body[data-p="gr"]{--acc:...}`), and the matching `--c` values on the project index rows.
- **Text:** edit the HTML directly. Figures use `<figure class="fig">`; keep the `width`/`height` attributes so the page doesn't jump while loading.
- **New PDF:** add the file, then copy an existing `<a class="doc">` block and change the link and thumbnail.
- Fonts (Barlow Condensed, Barlow, IBM Plex Mono) load from Google Fonts. To self-host, download the woff2 files and replace the `<link>` in each page head with `@font-face` rules.


V6.2 navigation: disabled browser-managed cross-page view transitions to resolve intermittent snapshots/typography glitches. Uses a 230ms content-only fade on ordinary page navigation (no animation when entering at an anchor). Music Mode's separate animation is retained.


## V6.3 navigation changes
- Cross-document snapshot animation disabled; no main-content fade.
- Small accent-slash animates briefly along header edge on navigation to another HTML page.
- Scroll-linked content entrance animation removed (was causing figures to flash on navigated/anchored scroll positions).
- Clicking current page does not reload; files now include ?v=6.3 cache-busting queries.
- Music Mode is unchanged.
