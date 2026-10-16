# SECHA Studio+

A static interior commerce experience: catalogue → furnished room configuration → persistent bag → validated order request. It includes modular living, work and bedroom concepts, design services, and physical material samples.

## Run and maintain

Requirements: Python 3, Node 20+ and npm. Chromium is needed for browser QA. The committed site, CSS, photography and browser libraries work without installing npm dependencies.

```sh
npm ci --cache /tmp/secha-npm-cache
npm run build
npm test
npm run dev
```

`npm run build` regenerates `css/utilities.css` after changing utility classes in HTML or JavaScript. `css/commerce.css` contains the storefront styles. Serve the repository root; there is no backend or database.

```sh
npm run test:e2e
```

Browser QA starts its own Python server on port 8001 and uses `/usr/bin/chromium`. Set `CHROMIUM_PATH` for another Chromium binary, `QA_BASE_URL` to test an existing server, or `QA_ARTIFACTS` to choose the screenshot/results directory. Artifacts default to the ignored `qa-artifacts/` directory. QA uses synthetic contact details and does not submit orders.

## The Styling Studio™ collections

The section directly below the designers presents four interior themes: Warm Modern, Soft Contemporary, Earthy Retreat, and Urban Studio. Each has four photorealistic generated interior concepts: a complete room, a tactile detail, and two complementary spaces. Sixteen local WebP images are served from `assets/styling/` with lazy loading. The section labels these as generated concepts, not completed SECHA projects. Visitors can filter by theme, switch among four view thumbnails, open a full-screen gallery with its own thumbnail strip, and continue to **Shop my style** for that collection. Gallery controls support arrow keys, touch swipes, Escape, and focus restoration; no automatic slideshow runs. The full-screen viewer preserves the entire image without cropping.

Each shop dialog presents a curated SECHA modular concept, a choice of three finishes from the shared moodboard catalogue, and three physical finish samples. Selected builds and samples carry the collection name and correct material into the existing persistent bag and order-request checkout. These are curated catalogue options, rather than an exact list of furniture in the generated interiors. Prices remain the existing catalogue estimates. The gallery and shopping flow live in `js/style-collections.js`, `css/site-refresh.css` and `css/studio-expansion.css`; `npm run test:e2e` covers filters, all four room/detail galleries, arrow and swipe navigation, gallery-to-shop handoff, material identity, focus restoration, accessibility and bag persistence.

### Commercial Styling Studio

A commercial collection inside The Styling Studio adds five independent directions: **Café Sol** (café / soft brutalism), **Ember** (bar / contemporary listening bar), **Still** (wellness / mineral calm), **Common Ground** (office / warm precision), and **Contour** (salon / sculptural modernism). A five-way selector keeps one commercial concept visible, with room and detail imagery, a dimensioned furniture-plan view, a colour palette and material notes per concept. Residential filters remain independent.

The shared full-screen gallery switches its action to **Plan this space** for commercial concepts, linking to the matching commercial starter and moodboard in the existing playground. Commercial styling does not create new priced catalogue packages. `css/commercial-styling.css` supplies the responsive layout; `npm run test:commercial` verifies all five selectors, all three gallery views, gallery focus, correct playground handoffs, residential-gallery compatibility, accessibility and overflow at 1440, 390 and 320 pixels.

## Renovation playground

Open `playground.html` from the development server, or use **Playground** in the main navigation. This standalone WebGL workspace provides a 48 m² studio apartment, 80 m² residence, and 80 m² commercial café. Each starts with an editable furnished layout. It uses the locally bundled Three.js and requires no API keys or backend.

Choose **Build from scratch** for an empty shell with no furniture, rugs, artwork, or internal dividers. Set its width (4–16 m) and depth (4–14 m) in 0.5 m steps, then add your own pieces. Resizing rejects boundaries that would cut through placed furniture. Commercial spaces offer **Office, Café, Bar, Wellness, and Salon** starter layouts, with counter stools, treatment beds, and salon styling stations in the catalogue. Starting-layout and commercial-type changes support undo. Scratch dimensions are retained when switching commercial types or resetting the same space.

The six SECHA moodboards, eighteen finishes, and six ambiance directions come from the same `js/design-options.js` catalogue as the main website. A moodboard applies its matching ambiance and first finish, and changes the workspace's color tone; finishing and ambiance can then be selected independently. Apply the chosen finish to furniture and joinery, flooring, or walls, including in an empty scratch build. Daylight/evening and the four quick color variations remain available. These choices persist with saved and exported projects, and older local saves are migrated. Inter is bundled locally for the playground and storefront; its license and source details are under `assets/fonts/` and `assets/README.md`.

Choose a furniture piece and click an open floor spot to place it; the placement guide turns red for blocked spots. Drag furniture, or select it from **In your space** and use the move, rotate, and remove controls. Keyboard users can activate a catalogue piece and press Enter in the focused room to place it in the first available spot. Escape cancels placement. Orbit by dragging empty floor, zoom, or switch to a plan view. **Walk through** adds a controllable avatar: use WASD, arrow keys, tap a clear destination, or hold the on-screen directional buttons. Furniture and walls block movement. Straight-line destination walking stops at obstructions; use the directional controls to navigate around them.

**Save project** stores the active layout in this browser; **Export layout** downloads a JSON copy. Only one active project is saved. Template changes and resets can be undone; unsaved edits do not survive a reload. Budget figures are illustrative styling estimates, and all room geometry is conceptual, rather than a construction plan. Run `npm run test:playground` for browser regression coverage, including mobile controls and accessibility. The suite starts its own server on port 8004, accepts `CHROMIUM_PATH` / `QA_BASE_URL`, and writes screenshots under ignored `qa-artifacts/`.

## Structure

- `index.html`: page sections and accessible controls.
- `js/commerce-core.js`: catalogue, canonical prices, totals, item identity, safe cart restoration.
- `js/commerce.js`: catalogue, bag, checkout validation and request export.
- `js/material-showcase.js`: textured WebGL material slabs, six moodboard directions, physical samples and exact finish links into the playground.
- `js/site-process.js`: five interactive project stages with deliverables and keyboard navigation.
- `js/studio.js`: shared storefront state, modal content, intro and page initialization. Legacy room renderers remain in `js/interior.js` and `js/ambiance.js` but are no longer loaded by the homepage.
- `vendor/`: pinned Three.js and GSAP distributions, served locally.
- `assets/`: locally served inspiration photography with source notes.
- `tests/`: pricing/restoration rules and desktop/mobile browser journeys.

## Commerce status and launch requirements

This is an **order-request storefront**, not a live payment integration. Requests are prepared on the visitor's device, can be downloaded or copied, and can be sent to SECHA through the configured WhatsApp number **+62 877-8601-0290**. The customer reviews the prefilled message and taps Send in WhatsApp. The site does not claim submission or payment success. It does not store contact details in localStorage or transmit them automatically. Continuing in WhatsApp passes the request text to WhatsApp for the customer to review and send. Only non-personal cart selections and the sample coupon are persisted.

Existing sample and design starting prices were retained. **Modular pricing, lead times, inclusions and module-count pricing are illustrative proposals for SECHA review**, not an approved commercial catalogue. Dimension changes are reference-room inputs; they do not calculate fabrication area or guarantee fit. The room preview and photography are illustrative; loose furniture is not automatically included in a modular package. Final scope, installation, delivery and taxes require confirmation. STUDIO10 applies only to material samples; sample delivery is an estimate.

Before accepting real orders:

1. Confirm the catalogue, pricing, service area, lead times and product imagery with SECHA.
2. The supplied SECHA WhatsApp destination is configured. Verify delivery using a real customer-controlled WhatsApp session; automated QA only validates the handoff URL and message.
3. If accepting online payments, choose a payment provider and implement server-validated prices, order persistence, payment verification/webhooks and status handling. Never collect card information in the current static form.
4. Publish approved delivery, cancellation, refund and privacy terms for the chosen transaction flow.

Use the existing isolated checkout during cloud tasks; do not create Git worktrees unless explicitly requested.

## Signature designers and EPS materials

The signature section uses Josephine (Founder & CEO), Daffa (Architect of Form) and Audina (The Soul of Space), with the editorial copy from the supplied profile posters. Portrait assets are generated reconstructions of the supplied references, rather than original pixel crops. Original portrait files can replace `assets/designers/*.png` without changing the layout.

The modular section explains the use of expanded polystyrene (EPS)-based interior panels. Its generated exploded-panel image is an illustrative material study, not a manufacturing drawing. Actual panel build-ups, finishes, supports and fixings need project-specific specifications; the site does not assert unprovided fire, structural, acoustic or environmental certifications.

The homepage now uses one Playground feature instead of separate Architect room and ambiance try-on sections. Curated moodboards are presented as an interactive material library: inspect three textured sample slabs for each of the six directions, drag or use keyboard arrows to turn them, adjust the light angle, select a finish, or order a physical sample. The material-to-playground link carries the selected moodboard and finish. Designer direction links and catalogue preview links also open the playground with the relevant choices; existing local layouts are not overwritten until Save is used.

EPS content is consolidated into a compact panel illustration, three-layer key, affiliation logos and expandable project-scope notes. How we work is a five-step selectable timeline with imagery and clear deliverables; its steps support arrow, Home and End keys. The new sections use `css/site-refresh.css`. Sample textures are procedural visual approximations, not scans or performance specifications.

## Studio+ film, affiliation and design directions

The opening film is a locally hosted, silent H.264 MP4 (four seconds, 960×540, approximately 108 KB). It plays on every full page load or refresh. Skip and Escape dismiss it, reduced-motion visitors bypass it, and errors, blocked autoplay or a 6.5-second timeout release the page. Background content is inert while the film is open. Site animations start after dismissal. Rebuild the film with `npm run render:intro`; this optional asset-generation command requires system Chromium and ffmpeg, in addition to npm dependencies. Ordinary development uses the committed MP4.

The EPS section displays the user-provided affiliation: SECHA is affiliated with Fjäll Group through Greenshift. Brand images are generated reproductions of the supplied inline references; they are not original brand source files. The section does not invent certifications, ownership terms or environmental performance claims. The SECHA catalogue uses six authored vector studio covers with outlined Inter typography: modular system drawings and design-service dossiers. The schematic drawings illustrate catalogue scope and are not measured construction documents. The earlier generated catalogue PNGs remain unused assets. Cover artwork and regeneration notes are documented in `assets/README.md`.

Each signature designer opens an accessible modal with a design narrative, suggested style card, material direction and three-colour palette. These directions interpret the supplied profile narratives and are starting points for a customer brief. The modal CTA opens the corresponding Earth, Noir or Japandi direction in the playground.

Run `npm run test:studio` for desktop/mobile film and designer checks, alongside `npm test` and `npm run test:e2e` for commerce and room-preview regression coverage.

### Compact affiliation and service presentations

The EPS section preserves the supplied SECHA → Greenshift → Fjäll Group relationship and transparent logo assets, alongside a compact panel illustration and expandable scope details. The previous long affiliation article, animated layer study and repeated build-step cards have been consolidated into this section and the main project timeline.

Design / Lite, Pro and Premium retain their generated service presentation images. These illustrate deliverable types rather than completed projects or contractual drawing sets. Existing package inclusions and prices remain the catalogue source of truth.


The How we work section uses a five-card graphic index with an illustrated stage detail. All stages support click and arrow/Home/End navigation, with a horizontally scrollable index on small screens. The EPS section uses a schematic exploded assembly and an affiliation strip with holographic logo silhouettes. These components use `css/studio-cards.css`; the original vector assets can be regenerated using `scripts/create-studio-graphics.py`. The affiliation wording and project-specific scope remain as supplied.


## Commercial composition and simulation

`js/commercial-layouts.js` is the metric source for five commercial starters, the website plans and the live furniture schedule. Café and salon use 10 × 8 m shells; bar, wellness and office use 12 × 8 m shells. The café has four two-seat dining tables and separate espresso/display/preparation units. Ember has a 4.8 m counter, six stools, two four-seat banquettes and four bistro tables. Wellness includes three screened treatment beds; the office has six workstations and a four-seat meeting area; the salon has three styling stations, a shampoo unit, reception and waiting.

`js/commercial-furniture.js` models the equipment, counters, seating, cabinets and screens, with procedural wood, stone and fabric textures, softened upholstery edges and operating details. These are interactive concept models; the editorial images establish the design direction. The generated plan and simulation use the same exact positions and metric footprints. The entry routes and starter furniture clearances are tested. Users can move, rotate and remove pieces, and inspect the live furniture schedule. Budgets and furniture values remain illustrative.

Run `node scripts/render-commercial-plans.cjs` after changing the shared layouts. `npm test` includes commercial collision, boundary and entry-route checks. `npm run test:playground` covers editing, undo, save/restore, walkthrough and export. Existing saved layouts are retained; choosing a new commercial starter loads its coordinated composition and default palette.

## Design guidance and project brief

Section 03, **Design before you build**, is a compact guide with three choices: a starting direction, layout and 3D visualisation, or detailed drawings. Each choice filters the existing collection to design services and focuses the matching Lite, Pro or Premium card. Prices, inclusions and add-to-bag actions appear once, in the catalogue.

Section 04, **Make it yours**, presents a single entry into the brief. An empty bag links to the collection; a populated bag offers **Prepare my brief**, which opens the existing contact form and request summary. The repeated package grid, journey steps, empty-state illustration and extra bag estimate have been removed. Cart changes publish `secha:bag-updated` to keep this entry current without overwriting an active form. Validation, consent and WhatsApp handoff retain their existing behavior. The sections use `js/design-journey.js` and `css/studio-expansion.css`.

### Residence palettes and multiple floors

The four Styling Studio collection palettes (Warm Modern, Soft Contemporary, Earthy Retreat and Urban Studio) are defined in `js/design-options.js` and shared with the residence playground. Each collection has a direct “Try this palette” link. Choosing a custom moodboard, ambiance, finish or quick colour variation releases the collection palette.

Use **Add floor** to create up to six independently editable levels. A new level is empty, inherits the active floor’s dimensions and direction, and can be resized and furnished separately. The floor selector opens each level for editing or walking; stairs and continuous travel between levels are not simulated. Each floor keeps its own layout, dimensions, collection, finishing and lighting. The budget covers furniture on all floors, with a concept allowance per floor. Removing a floor, resetting its layout, and other edits can be undone. Switching space type starts a new project; Undo restores the previous project.

Browser saves and JSON exports include every floor and the active level. Older single-level browser saves open as a ground-floor project. Run `npm run test:floors` for multi-floor isolation, persistence, export, undo, collection, limit, mobile and accessibility checks.

### Collection furniture and tiers

The residence uses collection-specific procedural furniture: exposed oak frames for **Warm Modern**, rounded wraparound seating and pale stone for **Soft Contemporary**, low walnut plinths for **Earthy Retreat**, and slim angular steel frames for **Urban Studio**. Selecting a collection updates existing furniture silhouettes and materials while retaining positions and footprints. Custom finish controls remain available.

The home catalogue now includes 19 pieces across Living, Work, Dining, Storage and Details. Ten additions are a dining table and chair, sideboard, bookcase, wardrobe, entry console, ottoman, end-of-bed bench, bedside cabinet and sculpted side table. Home and commercial catalogues show relevant furniture separately.

**Standard**, **Premium** and **Lux** are illustrative furniture tiers. Standard uses base prices, Premium uses 1.65× base prices, and Lux uses 2.8× base prices (rounded to the nearest IDR 1,000). Higher tiers add upholstery layers, joinery, hardware or stone/metal details. Tier selection applies to new pieces; the selected-piece tier control upgrades or downgrades one existing piece. Tiers retain the same footprints, are saved per item across floors, affect the project budget and export, and support undo. Older pieces default to Standard. These are simulation estimates, not products available for checkout or manufacturer replicas.

`js/residential-furniture.js` defines home pieces, tier pricing and procedural geometry. Run `npm run test:residential` to check all 228 model/collection/tier footprints, distinct collection silhouettes, tier prices and upgrades, save/export, multi-floor persistence, invalid-tier rejection, mobile layout and accessibility.

### Tier models, screen-sized editions and custom art

Each home furniture family now has a different model at every tier: straight / chaise / modular sofas; frame / wing / swivel lounge chairs; slab / pedestal / nested coffee tables; platform / split / winged beds; and panel / reeded / arched storage. All 19 families retain the same declared bounding footprint across tiers so upgrades preserve the layout and collision rules. Collection palettes and forms remain active. The models interpret the current collection references; no manufacturer CAD or measured site plan was supplied.

Catalogue previews are rendered from the actual Three.js model factory and cached, with an authored SVG fallback when WebGL is unavailable. Model names and dimensions accompany the previews. **Apply tier to this floor** upgrades all supported pieces on the active floor with undo. **Live floor plan & model schedule** shows the exact saved positions, rotations, footprints and model names; JSON exports include a per-floor `furnitureModels` schedule.

The commercial collection uses a viewport-sized edition with a horizontal selector, previous/next controls, keyboard arrows and touch swiping. Desktop places the image beside its brief; mobile stacks them with a scrollable brief and visible playground CTA. Full galleries and shared commercial plan handoffs remain available.

**Custom Art** follows Styling Studio with three generated editorial directions: sculpted 3D textured paintings, painted walls and murals, and hand-painted art. Visitors choose a palette and prepare a local commission brief specifying size/pieces and ideas. They review the brief, then explicitly continue to WhatsApp and send it themselves; no message is sent automatically, no payment is taken, and artwork is quoted to the brief. No new customer information is persisted.

Run `npm run test:residential` for 228 model footprints and all 76 collection/furniture families’ three-tier geometry checks, preview rendering, plan positions, bulk/per-piece upgrades, prices, floor persistence, exports, invalid-tier rejection and accessibility. Run `npm run test:art` for commercial viewport fit/navigation and art-direction selection, brief preparation/editing, WhatsApp handoff, focus, content escaping, mobile overflow and WCAG at 1440, 768, 390 and 320 px.
