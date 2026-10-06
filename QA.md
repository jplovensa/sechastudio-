# QA and implementation notes

## Defects addressed

- Cart checkout previously recalculated an unrelated design price and ignored swatch totals.
- A payment button simulated success without a gateway, customer validation or actual submission.
- Different materials from one style collapsed into the same cart line.
- Cart selections disappeared on reload; drawer positioning was tied to one section.
- External animation failure prevented page initialization and left a preloader covering the page.
- Cursor initialization repeatedly attached mouse and hover handlers.
- Desktop navigation contained a missing anchor; mobile commerce navigation was absent.

## Verification

`npm test` covers distinct finish identity, quantity bounds, sample-only discounts, delivery rules, corrupt/duplicate persisted data, authoritative re-pricing, configured build restoration and HTML escaping.

`npm run test:e2e` exercises desktop (1440 × 1000) and mobile (390 × 844) catalogue filters, three WebGL canvases, room and lighting controls, module configuration, distinct samples, quantity changes, coupon application, reload persistence, drawer dismissal, matching cart/checkout totals, required-field validation, request preparation/export, the configured WhatsApp number and full encoded message, automated WCAG accessibility checks on the new shop/build/studio/checkout sections, horizontal overflow and JavaScript errors. It also aborts local vendor script loads to verify the shop remains usable without 3D/animation libraries. Additional normal-motion layout checks cover 360, 768 and 1024-pixel widths. Screenshots and machine-readable outcomes are written to `qa-artifacts/`.

Scenes render only while visible and throttle reduced-motion previews. Local assets eliminate CDN availability as a prerequisite for shopping. Native pointers, visible focus, modal focus containment/Escape, labelled inputs, live status announcements, a skip link and mobile navigation improve interaction access.

## Limits

Browser QA verifies local frontend behaviour, not production deployment, physical material accuracy, fabrication fit, fulfillment, tax compliance or live order/payment processing. Full assistive-technology and real-device testing remains outside the automated checks. See README for the specific live-commerce requirements.
