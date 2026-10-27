# Resident animation sources

`mixamo-motion.json` contains animation tracks only, extracted from the official
Three.js `Xbot.glb` example at revision
`d4aa9e00ea29808534a3e082f602c544e5f2419c` (r128). The example explicitly credits
Mixamo: https://github.com/mrdoob/three.js/blob/r128/examples/webgl_animation_skinning_additive_blending.html

The original character mesh, textures and glTF file are not included. The manifest
records the pinned source URL and SHA-256 hash. Extracted clips are `idle`, `walk`,
`run`, and `agree`. They retain Mixamo's asset terms; the CC0 license beside the
MakeHuman mesh does **not** license these motions. These tracks are embedded for
this application's resident, not offered as a standalone animation library.

Mixamo terms and usage FAQ: https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html

Regenerate with `python3 scripts/build-resident-motion.py`. No Adobe login,
external service, or runtime download is needed to play the bundled clips.

The sit/stand, wave, and coffee interaction clips are authored locally in
`js/resident-motion.js`. They are not described as Mixamo motion capture.

The official `@pixiv/three-vrm-animation` 2.1.3 UMD build is vendored separately
under its MIT license. This app uses its `VRMAnimation` and
`createVRMAnimationClip` APIs with a VRM-compatible normalized humanoid adapter
for the existing MakeHuman skeleton; it does not replace the renderer with React
or require a VRM character file. Only the clip APIs are used with the existing
Three.js r128 runtime; the full VRM model loader is not integrated.
