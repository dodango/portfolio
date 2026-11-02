# Laminate — publishing navigation fix

Fixed the repeated-click navigation bug affecting homepage Selected Work and Contact buttons, Gaucho Racing Explore chips, and other same-page anchors. Clicking the same section link again now scrolls to the corresponding section, even if that hash is already in the address bar. Links between pages, new-tab documents, lightbox actions and reduced-motion behavior remain unchanged.

Checked all 282 HTML anchor links across 10 pages for resolved local files and fragment targets. All pass.

Changed: site.js, 10 HTML files (JS cache-busting), this note.
