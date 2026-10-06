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
- `js/interior.js`: furnished living room, home office and bedroom previews with room dimensions, storage modules, lighting and surface finishes.
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
