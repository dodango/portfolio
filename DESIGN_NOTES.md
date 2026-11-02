# Design notes

## 1. What I found in V1 and V5

**V1** has the strongest content: complete project write-ups, real numbers, captions, tables, documents, the clarinet surprise.
Its weakness is structure: one long single-page app with hash-switched "views", so projects have no URLs, and a lot of media sits in a generic "Media gallery" away from the project it belongs to.

**V5** is tidier but mostly a re-skin of V1's content. The vertical rail and large numbered chapters read as a template; the project index is a list of cards; several blurbs were rewritten (some more vaguely than V1, e.g. the bracket entry), and the V5 "Currently" line paraphrases the Disney project more strongly than V1 does. Its best contributions are the rear-wing cutout image, the splitting of Sidepod and Bracket into their own entries, and the note-burst for Music Mode.

Neither version used the real media as the *structure* of the site; images were decoration around text.

## 2. Directions I considered

| | Idea | Navigation | Why / why not |
|---|---|---|---|
| **A. Laminate** (built) | Carbon twill surface lit by a moving light; each project is a "ply" with its own colour | Ply index + a Work menu; page changes lay a new ply over the old | Ties to composites work, reuses the real exploded-wing cutout, makes per-project colour a *system*, nearly free to run (CSS only) |
| B. Drawing set | Each project is a numbered sheet with title block, revision table, section callouts | Drawing-list index | Very coherent and credible, but a familiar "blueprint" trope, and static |
| C. Z-axis archive | A 3D tunnel of project plates; depth = time | Scroll through the tunnel | Memorable, but heavy on weak devices and slow for someone who wants one project |
| D. Capability matrix | Projects × disciplines grid (CFD, FEA, composites, controls…); hover a column to light up matching projects | The matrix is the index | Great for recruiters, but dry and relies on tagging judgements I'd be inventing |

**Recommendation: A.** It is the only one where the visual idea comes from the work itself, the media stays unfiltered, and the performance cost is small.

## 3. How direction A works

- **Carbon surface:** a procedurally generated 2/2 twill (tiny PNGs inlined in the CSS). A soft light is masked *through* the weave, so glints appear only on fibre crowns and slide over the texture as the pointer moves. On touch devices the light drifts with scroll. Reduced motion: static.
- **Project colours:** each project has its own accent, used for its page glow, readouts, links, index row edge and the colour ticks in the Work menu. The top-left logo is a plain wordmark.
- **Hero:** the real exploded rear-wing render floats in front of the name, tilts slightly with the pointer, and is annotated with five callouts that use only terms from your own caption.
- **Page transitions:** native cross-document View Transitions (zero JavaScript cost). A 45° "ply" wipe lays the new page over the old one, and the project image morphs from the index row into the page header. Unsupported browsers just navigate normally.
- **Media as structure:** the CFD velocity video and the capillary high-speed video play (muted, looping) only while on screen, with native controls. The manufacturing strips follow the CAD, PDFs appear as real first-page cover sheets, and the bracket page is built from figures in your own report.
- **Tables:** the GR26/GR25 table is real HTML with tabular numerals and a quiet GR26 column. I added a neutral "Change" column (GR26 − GR25, plain arithmetic, no good/bad colouring) so the drag increase and efficiency drop are as visible as the downforce gain.
- **Music Mode:** unchanged in spirit, redesigned in motion. Notes burst from the click, a warm flare spreads, and a circular reveal carries the burgundy-and-gold theme out from the click point. The carbon disappears, leaving a burgundy stage with a gold light that follows the pointer; five-line staves draw across the page and notes land on them. The mode persists across pages for the browser session; a pill (or Esc) returns with the same circular reveal in reverse.
- **Small details:** ←/→ move between projects; the Laziness Detector page changes the tab title when you switch away from it.

## 4. Differences from the supplied content (please review)

**Structure**
- Sidepod and Bracket are standalone pages (as in V5). They are cross-linked from the Gaucho Racing page, as in V1.
- The home thumbnail and page hero for Gaucho Racing are the full aero package (the exploded rear wing appears in the home hero and again before the manufacturing strip on the Gaucho page).
- Project order follows V5 (GR, Hydration, Sidepod, Disney, Thumb rest, Capillary, Bracket, ME 10). V1's home order was GR, Sidepod, Hydration, Thumb rest, Capillary, Disney. Easy to change.
- Gaucho Racing "Media gallery" photographs, the jig CAD and the bottom-view CFD moved from Extras into the Gaucho Racing page, where they belong.
- V1's embedded Disney "placeholder" sketch is used as-is and **should be replaced** when you have real hardware images.

**Text added or derived (everything else is V1 wording, extracted programmatically)**
- Bracket card and the three Bracket readouts (41.08 MPa, 0.364 mm, ≈6.7) are assembled from numbers already in V1's bracket paragraph. V5's vaguer blurb was not used.
- Bracket figure captions are mine, based on the report text and the plot legends (the redesign values 2.918×10⁸ and 2.391×10⁸ N/m² are read off the legends).
- "Change" column in the GR26 table; the iteration-mass bars on the thumb-rest page (bar lengths are the three masses stated in your text); the Disney "Currently" line uses V1's wording ("Disney Imagineering senior capstone, in progress"), not V5's "guest interactions".
- Hero text still says "Senior" as in V1; you described yourself as fourth-year, which is consistent.

**Things I tried and rejected**
- A CAD ↔ CFD wipe slider for the diffuser: the SolidWorks and Fluent images have different camera angles, so a wipe would misalign the geometry. They stay side by side.
- Water, ZZZ, and airflow-line animations: none looked convincing enough to justify the cost, so none are included. The Sidepod/Hydration/Disney pages rely on colour and real media.

**Worth checking in your Bracket report (not changed):** the mesh-convergence plot levels off at ≈35.1 MPa while the text reports a 41.08 MPa peak, and yield strength appears as both 276 MPa and 275 MPa.

## 5. Performance

- No libraries. `site.css` 43 KB (≈12 KB gzipped, includes two inlined texture tiles), `site.js` 12 KB (≈4 KB gzipped).
- Home page first load: ≈22 KB of HTML/CSS/JS (gzipped) + ≈330 KB of images + ≈60 KB of fonts. Project pages load only their hero eagerly; everything else is lazy.
- Index thumbnails are 720 px WebPs (originals untouched on the project pages). Video posters and PDF cover thumbnails are generated; videos use `preload="none"` and start only when visible. YouTube players are click-to-load facades.
- The only continuous work is the pointer-following light: one masked layer moved with `transform`, run in `requestAnimationFrame` only while it is catching up to the pointer, then idle. Touch devices update on scroll. Nothing animates when the tab is hidden.
- `prefers-reduced-motion`: no light follow, no tilt, no scroll entrance, no view transitions, no autoplay, instant Music Mode. Data-saver mode disables video autoplay.
- Backdrop blur is used on the top bar and menu only.

## 6. Limits of my testing
I tested in Chromium at 360–1440 px (layout, overflow, links, transition, lightbox, menu, Music Mode frames). I could not load Google Fonts in my environment, so I verified layouts against fallback fonts (the real condensed face is narrower). Headless Chromium has no H.264 decoder, so I verified the in-view play logic but not actual playback. Safari and Firefox were not available; View Transitions and `animation-timeline` degrade to normal navigation and plain content there.


V6.2: Replaced cross-document view transitions with short content-only fade; same-page links do not reload and in-page anchors are unanimated.
