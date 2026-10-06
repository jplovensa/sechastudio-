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

## Structure

- `index.html`: page sections and accessible controls.
- `js/commerce-core.js`: catalogue, canonical prices, totals, item identity, safe cart restoration.
- `js/commerce.js`: catalogue, bag, checkout validation and request export.
- `js/ambiance.js`: same-room neutral/styled comparison, six directions, day/evening lighting and transfer to the studio.
- `js/interior.js`: shared furnished living room, home office and bedroom previews with room dimensions, storage modules, lighting and surface finishes.
- `js/studio.js`: existing moodboard and style exploration scenes.
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

Ambiance try-on uses the same furnished-room renderer as the build studio. A draggable, keyboard-accessible slider compares the neutral daylight room with a chosen palette and lighting, with three room types and six style directions. The selected room, lighting and palette transfer to the studio without modifying the customer's bag.

## Studio+ film, affiliation and design directions

The opening film is a locally hosted, silent H.264 MP4 (four seconds, 960×540, approximately 108 KB). It plays on every full page load or refresh. Skip and Escape dismiss it, reduced-motion visitors bypass it, and errors, blocked autoplay or a 6.5-second timeout release the page. Background content is inert while the film is open. Site animations start after dismissal. Rebuild the film with `npm run render:intro`; this optional asset-generation command requires system Chromium and ffmpeg, in addition to npm dependencies. Ordinary development uses the committed MP4.

The EPS section displays the user-provided affiliation: SECHA is affiliated with Fjäll Group through Greenshift. Brand images are generated reproductions of the supplied inline references; they are not original brand source files. The section does not invent certifications, ownership terms or environmental performance claims. The three new modular catalogue images are generated concept visualisations, not photographs of installed SECHA projects; their visible modules illustrate the listed room packages.

Each signature designer opens an accessible modal with a design narrative, suggested style card, material direction and three-colour palette. These directions interpret the supplied profile narratives and are starting points for a customer brief. The modal CTA applies the corresponding Earth, Noir or Japandi direction to the existing ambiance preview and moves keyboard focus to its controls.

Run `npm run test:studio` for desktop/mobile film and designer checks, alongside `npm test` and `npm run test:e2e` for commerce and room-preview regression coverage.

### Affiliation editorial and service presentations

The affiliation article now tells the relationship through SECHA’s design perspective and the EPS material approach. Both logo PNGs have genuine alpha transparency, with the white backdrops removed using Image Gen; they sit directly on the editorial paper surface. The live CSS motion study separates and assembles illustrative core/finish layers and traces SECHA → Greenshift → Fjäll Group. A visible pause/play control, reduced-motion still view, viewport observer and hidden-tab handling control the animation. It adds no video download and remains readable without JavaScript.

Design / Lite, Pro and Premium use generated studio presentations showing, respectively, a concept/material moodboard, floor plan plus 3D presentation, and detailed drawings plus a scale model. These images illustrate the type of service deliverable; they are not completed project photographs or contractual drawing sets. Existing package inclusions and prices remain the catalogue source of truth.
