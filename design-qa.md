# Design QA

final result: passed

## References and rendered comparison

Source: the three supplied SECHA profile posters for Josephine, Daffa and Audina. Reviewed alongside rendered profile cards at desktop (1440 × 1000) and mobile (390 × 844). The responsive section presents three columns on large screens and individual stacked posters on smaller screens.

The cards retain the near-black background, editorial SECHA masthead, thin rules, split monochrome/colour portrait treatment, oversized uppercase name, monospace role and the supplied profile copy. Reference photographs were reconstructed through Image Gen; they are not exact pixel crops. The footer count is adapted to the three-profile website section rather than the original five-page presentation.

Component captures remove global fixed navigation solely to avoid long-screenshot stitching artifacts. Normal viewport and functional checks retain the real navigation. Representative captures are in the generated, ignored `qa-artifacts/` directory, including `mobile-signature-card.png`, the desktop/mobile designer and EPS sections, and `mobile-live-ambiance.png`.

## EPS section

The previous cabinet illustration is replaced by a generated material photograph showing a recognisable white EPS bead core, separate surface layers and a finished modular interior wall. Copy explains expanded polystyrene and keeps the pictured build-up illustrative rather than claiming an approved specification or unprovided performance certification. Both desktop columns and the stacked mobile presentation were visually inspected.

## Ambiance try-on

The abstract sculpture and simulated sensor readouts are replaced with the same furnished-room engine used by the room studio. Customers can compare a neutral daylight room with six styled palettes, switch among living/work/bedroom layouts, try daylight/warm evening, adjust the split with a labelled native range input, reset and carry the selected room, palette and light into the studio. Mobile keeps a compact preview visible while choices scroll below it.

Corrected excessive highlights with colour-space conversion and tone mapping. Visually inspected the neutral/Japandi daylight comparison and Gallery/evening mobile comparison. Tests check rendered canvas changes for room, lighting and slider endpoints, not only changed labels.

## Checks and residual notes

Desktop/mobile commerce E2E and automated WCAG checks cover the signature, EPS, ambiance, shop, room studio and checkout sections. Additional layout checks cover 360, 768 and 1024-pixel widths. No JavaScript errors or horizontal overflow were found. Vendor-failure fallback, cart persistence, checkout totals and the WhatsApp destination/message remain verified.

No unresolved P0/P1/P2 findings. P3 follow-up: supplied original portrait assets can replace generated reconstructions for pixel-exact photographic fidelity. The room preview remains an illustrative design aid rather than a measured-room or fabrication model.

### Collection, affiliation, film and direction cards

Reviewed generated living/work/rest concept visuals and both supplied-logo reconstructions before integration. Reviewed browser screenshots of the catalogue, green affiliation panel, opening film and responsive designer modal. The EPS section retains its layered material study and build specification caveat, with an explicit SECHA → Greenshift → Fjäll Group path. Designer modals use the supplied portrait language, a readable material/style card and a direct connection into room try-on. Desktop/mobile browser checks cover actual film playback and keyboard-accessible modal journeys.
