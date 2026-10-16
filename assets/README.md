Interior inspiration photography was downloaded from these Unsplash sources (the first three were already used by the repository). These photographs illustrate a design direction and do not depict the specific modular products being quoted.

- `interior-living.jpg`: https://images.unsplash.com/photo-1600607687920-4e2a09cf159d
- `interior-work.jpg`: https://images.unsplash.com/photo-1600596542815-ffad4c1539a9
- `interior-rest.jpg`: https://images.unsplash.com/photo-1593696140826-c58b021acf8b

Replace inspiration photography with approved SECHA product photography before presenting it as completed SECHA work.

## Typography

`fonts/Inter-Variable.ttf` is the Inter variable font from the Google Fonts repository: https://github.com/google/fonts/tree/main/ofl/inter. Downloaded from its official `Inter[opsz,wght].ttf` source and served locally through `css/fonts.css`. Licensed under the SIL Open Font License 1.1, included in `fonts/OFL.txt`.

- `modular-work.jpg`: https://images.unsplash.com/photo-1497366811353-6870744d04b2
- `modular-rest.jpg`: https://images.unsplash.com/photo-1611892440504-42a792e24d32

## Generated SECHA assets

- `designers/josephine.png`, `designers/daffa.png`, `designers/audina.png`: image-generated photographic reconstructions based on the three user-supplied SECHA profile references, preserving the half-monochrome / half-colour art direction. They are not exact source-image crops.
- `eps-material-study.png`: generated EPS-core decorative-panel and finished-wall study. An illustration of the material concept, not a certified or approved panel section.

- `playground-preview.png`: an actual local Chromium capture of the SECHA WebGL playground canvas, used to link into the interactive studio.

- `styling-boutique-concept.png`: Image Gen editorial styling concept created for The Styling Studio™ boutique presentation. The room, furniture and objects are illustrative; this is not a photograph of a completed SECHA project. The secondary detail is a CSS crop of the same image.

The Styling Studio™ residential collection galleries use sixteen Image Gen interior concepts, generated on 2026-10-16 and encoded as WebP at their original 1536 × 1024 resolution. They are photorealistic illustrations of a style, not photographs of built SECHA projects or exact furniture catalogues. Each collection is visibly labeled as a generated interior concept. Source PNGs remain in `/workspace/generated_images` in the creation workspace; the portable website uses only these local WebP assets:

- `styling/warm-modern-room.webp`, `styling/warm-modern-detail.webp`: honey oak, woven oatmeal linen, porous travertine and golden afternoon light; apartment living/dining composition and lounge corner detail.
- `styling/soft-contemporary-room.webp`, `styling/soft-contemporary-detail.webp`: ivory bouclé, powder blue upholstery, chalky plaster, limestone and brushed steel; sculptural living room and chair vignette.
- `styling/earthy-retreat-room.webp`, `styling/earthy-retreat-detail.webp`: walnut, flax linen, terracotta limewash and warm stone; bedroom sanctuary and tactile bedside detail.
- `styling/urban-studio-room.webp`, `styling/urban-studio-detail.webp`: concrete, smoked oak, charcoal wool, blackened steel and veined dark stone; creative loft workspace and desk detail.

The room and detail images are independently generated compositions with a coordinated material palette; they are not measured views of one exact floor plan. No third-party reference images were used in generation. The earlier `styling-boutique-concept.png` and the existing Unsplash photographs remain available for their other uses; they are not used in the new collection galleries.


## SECHA collection studio covers

The six catalogue covers are authored SVG graphics in `collection/`: `modular-living.svg`, `modular-work.svg`, `modular-bedroom.svg`, `design-lite.svg`, `design-pro.svg`, and `design-premium.svg`. They replace the generated room and service images in the SECHA collection and its linked style-shop product previews. Each uses original vector linework, a consistent studio-sheet grid, and outlined Inter typography from the bundled licensed font. They have no raster imagery, remote resources or font-loading dependency.

The drawings communicate catalogue scope and are schematic, not measured construction documents. Regenerate them from the repository root using `python3 scripts/create-collection-covers.py` with the optional `fonttools` package installed. The original concept PNGs remain archived assets and are no longer used as catalogue covers.


## Studio method and EPS assembly

`process/brief.svg`, `direction.svg`, `visualise.svg`, `detail.svg` and `handover.svg` are original vector studio graphics for the five project stages. They replace the earlier room photographs and generated service images within How we work. `eps-assembly-study.svg` is an original exploded vector study of a surface finish, EPS core and project-specific supports, replacing the generated EPS image on the page. It illustrates a concept; it is not a measured or approved manufacturing drawing. Regenerate these six assets with `python3 scripts/create-studio-graphics.py` (Python standard library only).

The Greenshift and Fjäll Group source PNGs remain unchanged. `css/studio-cards.css` uses their existing alpha silhouettes as CSS masks for an iridescent foil gradient, preserving logo proportions and accessible image names. The sheen shifts on hover, stays static with reduced motion, and falls back to a monochrome mark when masks are unsupported. This is a visual treatment of the existing supplied affiliation, not a new certification or partnership claim.


Eight complementary Styling Studio views were added on 2026-10-16, with each collection's original room image used as a palette and photographic reference:

- `styling/warm-modern-dining.webp`, `styling/warm-modern-kitchen.webp`: oak dining and kitchen spaces with linen, bronze, travertine and afternoon sunlight.
- `styling/soft-contemporary-dining.webp`, `styling/soft-contemporary-bedroom.webp`: pale limestone, ivory upholstery, silver accents and soft blue details.
- `styling/earthy-retreat-reading.webp`, `styling/earthy-retreat-dressing.webp`: clay plaster, walnut, woven flax and warm stone.
- `styling/urban-studio-meeting.webp`, `styling/urban-studio-workspace.webp`: concrete, smoked oak, black steel and charcoal seating.

These are generated complementary style studies, not measured views of the same built project. The new images retain their original 1536 × 1024 resolution and are encoded as WebP. The design-package and request sections reuse the authored SVG studio graphics in `process/`, with no new generated service covers.


## Commercial Styling Studio concepts

Ten Image Gen images were created on 2026-10-16, then encoded as WebP at their original 1536 × 1024 resolution (approximately 2.3 MB combined). Each style has a complete room composition and a separate material/detail composition:

- `styling/commercial/cafe-room.webp`, `cafe-detail.webp`: **Café Sol**, a sunlit café in porous travertine, pale yellow glazed tile, oak and linen.
- `styling/commercial/bar-room.webp`, `bar-detail.webp`: **Nocturne**, an intimate bar with green-black stone, dark walnut, oxblood velvet, aged brass and smoked mirror.
- `styling/commercial/wellness-room.webp`, `wellness-detail.webp`: **Still**, a wellness reception in pale limestone, ivory limewash, light oak and celadon linen.
- `styling/commercial/office-room.webp`, `office-detail.webp`: **Common Ground**, a warm office with smoked oak, sage acoustic felt, charcoal wool and blackened steel.
- `styling/commercial/salon-room.webp`, `salon-detail.webp`: **Contour**, a boutique salon with bone plaster, wine upholstery, oval mirrors, brushed metal and pale stone.

These are generated editorial style concepts, not photographs of completed SECHA work. Room and detail images are independently composed around a shared palette. The website labels the concepts and links to editable commercial starters; operational layouts, construction details and sourcing are project-specific. The source PNGs remain in `/workspace/generated_images` in the creation workspace.
