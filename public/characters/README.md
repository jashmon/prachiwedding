# Prachi & Pratik character rigs

Two original vector interpretations of the supplied references. Transparent backgrounds, 400 × 560 viewBox, editable paths, no embedded raster images or external fonts. The softened gradients and overlapping shapes suggest layered paper; they are not exact reproductions of the reference images' rendered texture.

## Preview

Run the website and visit `/characters/preview.html`. Wedding, haldi, casual and gym outfits plus five gestures are included. The invitation uses the Namaste pose in its welcome and the waving pose in its closing scene.

## Control an inline SVG

```js
const character = document.querySelector('[data-character="prachi"]');
character.setAttribute('data-look', 'haldi');
character.setAttribute('data-action', 'wave');
// Actions: idle, wave, namaste, nod, celebrate. Return to idle after a UI action.
character.style.setProperty('--fabric', '#488560');
character.style.setProperty('--fabric-light', '#80af86');
character.style.setProperty('--fabric-dark', '#285a3f');
```

Use inline SVG for control from your page. `<img src="/characters/prachi.svg">` displays the default illustration but does not expose its internal groups to page JavaScript. The preview loads only the two trusted local SVGs; do not inject user-supplied SVG markup without sanitization.

## Rig structure

`data-part` identifies body, shadow, neck, head, hair, eyes, pupils, brows, mouth, arms and legs. `data-outfit` layers align to the same body coordinates. All four wardrobes are bundled in each file; `data-look` selects their visibility and color palette. Sleeves inherit the active fabric palette and stay attached to their arm groups. Clothing silhouettes differ for traditional, casual and gym looks.

Pivots use SVG viewBox coordinates: head `(200,268)`, left arm `(155,286)`, right arm `(245,286)`. Left/right refers to the viewer's side. The regular arms are single articulated groups for waving; Namaste switches to a dedicated centered arm-and-hand layer. CSS gestures honor `prefers-reduced-motion`. For GSAP, set `data-action="idle"` first, then animate the relevant part with `svgOrigin` using these pivots.

For multiple copies of the same person inline, prefix every `id` and its `url(#...)`/ARIA reference per instance to avoid collisions. Prachi and Pratik already have different prefixes.

Suggested uses: wave on invitation entry; nod after a form choice; celebrate briefly after a successful RSVP; change wardrobe when the selected event changes. Keep decorative characters `aria-hidden="true"` when placed alongside equivalent UI text, and announce form success using text independently of the animation.

## Edit / rebuild

The geometry source is `scripts/build-characters.mjs`. Run `node scripts/build-characters.mjs` after editing it to regenerate the two SVGs. Modify silhouette paths inside an outfit group to add clothes; preserve body anchors. The original reference files are not bundled.
