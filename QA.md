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

`npm run test:e2e` exercises desktop (1440 × 1000) and mobile (390 × 844) catalogue filters, three WebGL canvases, room and lighting controls, module configuration, distinct samples, quantity changes, coupon application, reload persistence, drawer dismissal, matching cart/checkout totals, required-field validation, request preparation/export, the configured WhatsApp number and full encoded message, automated WCAG accessibility checks on the signature/shop/build/studio/ambiance/checkout sections, horizontal overflow and JavaScript errors. It also aborts local vendor script loads to verify the shop remains usable without 3D/animation libraries. Additional normal-motion layout checks cover 360, 768 and 1024-pixel widths. Screenshots and machine-readable outcomes are written to `qa-artifacts/`.

Scenes render only while visible and throttle reduced-motion previews. Local assets eliminate CDN availability as a prerequisite for shopping. Native pointers, visible focus, modal focus containment/Escape, labelled inputs, live status announcements, a skip link and mobile navigation improve interaction access.

## Limits

Browser QA verifies local frontend behaviour, not production deployment, physical material accuracy, fabrication fit, fulfillment, tax compliance or live order/payment processing. Full assistive-technology and real-device testing remains outside the automated checks. See README for the specific live-commerce requirements.

## Signature / EPS / ambiance update

Browser QA checks all three signature profile names and portrait assets, EPS section copy, room changes, real rendered lighting/comparison differences, slider endpoints, reset and transfer of the selected style/room/lighting into the studio. Screenshots include the designer profiles, EPS section and selected ambiance on desktop and mobile. Removed the old abstract corridor, simulated emissions readouts and diagnostic quiz from the try-on experience. See `design-qa.md` for visual comparison notes against the supplied profile references.

### Studio+ refresh film and affiliation update

- `npm test`: all seven commerce rules passed.
- `npm run test:e2e`: desktop/mobile commerce, room configuration, ambiance rendering, checkout validation, request export and WhatsApp handoff passed; normal-motion layout checks at 360, 768 and 1024 px passed; missing vendor libraries retained functional commerce.
- `npm run test:studio`: desktop 1440 px and mobile 390 px passed actual video playback/automatic completion, refresh replay, skip, Escape, reduced-motion bypass, blocked-media fallback, all three designer modals, focus containment/restoration, WCAG A/AA modal audit, palette transfer/focus, loaded affiliation logos, concept catalogue assets and horizontal-overflow checks.
- Opening asset verified with ffprobe: H.264, 960×540, 4.000 seconds, no audio stream. Screenshots retained in ignored `qa-artifacts/`.
- Live deployment is separate from a GitHub push. These checks run against the local static server; they do not verify an external hosting deployment or send a WhatsApp message.
