# ShiftOff! house style guide

How every ShiftOff! asset is drawn, sized, packed and described. Follow this for anything new so it sits next to the existing art without looking out of place.

Companion files in this folder: `palette.png` (swatches), `palette.json`, `shiftx.gpl` (GIMP / Aseprite), `shiftx.hex` (Lospec / Pixelorama).

---

## 1. The look in one paragraph

Moonlit pixel art. A cool indigo night with lilac clouds, lit from the **upper left**. Hard-edged forms, 4-tone shading ramps, a 1px dark **ink** outline on everything you can touch (rocket, obstacles, UI) and no outline on scenery (sky, clouds, ground) or on effects (fire, smoke, light). Warm colours are rare and meaningful: ShiftX orange is the brand (the OFF! in the game logo, the rocket's livery), flame colours mean thrust or danger, gold means a record.

## 2. Resolution and scale

| Rule | Value |
|---|---|
| Design height | **270 px**. Every screen is laid out for a 270 px tall view; width varies with the window (480 at 16:9). |
| Zoom | Whole numbers only: `zoom = floor(windowHeight / 270)`, game size = window / zoom. Never scale by fractions. |
| Engine settings | `pixelArt: true`, `roundPixels: true`; position sprites on whole pixels. |
| Rotation | Pre-render rotations (RotSprite-style: Scale2x ×3, rotate, sample down) for anything that rotates a lot. Rotating in-engine is fine for organic shapes (flames, smoke, beams). |
| Previews | `@4x` PNGs are nearest-neighbour upscales for viewing only. Never load them in-game. |

## 3. Palette

97 colours in 22 ramps. Every ramp runs **light → dark**. Don't invent colours: if something new needs a colour, add a ramp here first.

| Ramp | Colours (light → dark) | Used for |
|---|---|---|
| `ink` | `#16142a` | All outlines, dark text, shadows under text |
| `sky` | `#3b3a79` `#363471` `#322f6b` `#2e2b64` `#2a275c` | Sky gradient (bottom → top). Game background colour = `#2a275c` |
| `star` | `#f4f7ff` `#c9d4f5` `#6f78c4` | Stars, sparkles |
| `cloud_near` | `#eef3fc` `#dde6f8` `#bccbf0` `#9fb2e6` `#8496d6` `#6e7fc4` | Front cumulus |
| `cloud_mid` | `#838bca` `#7279bd` `#6469b1` `#585ca4` `#4d4f97` `#43428a` | Middle cloud bank |
| `cloud_far` | `#56589e` `#4c4c91` `#424184` `#3a3878` | Far stratus |
| `ground` | `#5d8a8f` `#3f6a78` `#2f5066` (grass) · `#56507e` `#4a4470` `#3a345c` `#2a2546` `#1e1a36` (rock/soil) | Floor, crater, rubble |
| `hull` | `#f7f8fc` `#dde0ea` `#b0b5c9` `#7f86a2` | Rocket body, white objects, light text on dark |
| `carbon` | `#4b4e5e` `#2c2e3a` `#20212b` `#15161d` | Interstage, legs, black parts |
| `steel` | `#a9aec9` `#7d82a6` `#565a80` `#3a3c5e` | Engines, tower, metal |
| `shiftx` | `#ffb08a` `#ff6a3d` `#c4502f` `#8a3a26` | Brand orange: OFF! in the game logo, ShiftX X mark, rocket stripes, primary buttons, "boom" |
| `flame` | `#fffdf0` `#ffe98a` `#ffb547` `#ff7a3a` `#e2434b` `#9b2b55` | Thrust, fire, explosions (hot → cool) |
| `smoke` | `#e3e6f3` `#c3c8de` `#9ea4c4` `#7c82a6` `#5d6286` `#454868` | Smoke, dust, steam |
| `ui_night` | `#8b95cf` `#6469b1` `#3b3a6e` `#2a2954` `#1f1d40` | Dark panels, plates, HUD frames |
| `ui_paper` | `#ffffff` `#f3f4fa` `#dfe2ee` `#b9bedb` `#8b91b5` | Light cards (Shiftter), grey icons (`#8b91b5`) |
| `gold` | `#fff2b3` `#ffd25c` `#e09a2a` `#9a5a1a` | Records, BEST, NEW BEST, labels on dark plates |
| `shiftter` | `#a6f5e8` `#3fc7b4` `#28907f` `#1b5f56` | Shiftter brand, verified badge, active reshift |
| `like` | `#ff9ab0` `#ff4f74` `#c22c52` `#7e1d3c` | Likes, hearts |
| `hud_green` / `hud_amber` / `hud_red` | see `palette.json` | Balance meter zones, warnings |
| `elec` | `#ffffff` `#e8f6ff` `#9fe2ff` `#5fa8ff` `#5a63d8` | Lightning, electric sparks, ignition igniter |

**Text colours.** On dark panels use `hull[1]` (`#dde0ea`) for body, `hull[2]` for secondary, `gold[1]` for labels. On paper cards use `ink` for body and `ui_paper[4]` (`#8b91b5`) for secondary.

## 4. Light, shading, outlines

- **Light comes from the upper left.** A surface facing up-left takes the lightest tone of its ramp, a surface facing down-right the darkest.
- **Four tones per form:** highlight, base, shade, dark. Cylinders (rocket, boosters) band left to right: base, highlight, base, shade, dark.
- **Outline:** 1px `ink` around touchable objects (rocket, boosters, obstacles, debris pieces, UI, icons, avatars). No outline on sky, clouds, ground, fire, smoke or light beams.
- **Text** that sits over the scene uses an outlined font (`*_outline`, `title`, `digits`).
- **No anti-aliasing**, no soft brushes and no partial transparency, except light beams (banded alpha, ADD blend) and in-engine fades.

## 5. Dithering

- Use the **4×4 Bayer** pattern only:
  - at the boundary between two tones (a 1–3 px band),
  - for dissolving something out over time,
  - for fading something near a frame edge.
- **Never** fill a large area with a dither pattern. It reads as noise at native size and turns into checker blocks when stretched. Use flat tone bands instead.
- Nothing dithered goes inside the stretchable middle of a 9-slice.

## 6. Size reference

| Thing | Size (px) | Notes |
|---|---|---|
| Background layers | 480×270 | Tile horizontally; bottom edge on the screen bottom |
| Star tiles | 512×512, 384×384 | Tile in every direction; different sizes and speeds so they never visibly repeat |
| Launch pad frames | 480×210 | Ground line y=154; rocket nozzles rest at (240, 144) |
| Rocket (assembled) | 48×101 | Pivot (centre of mass) at (24, 62) |
| Rocket rotation frames | 138×138 | 120 frames, every 3°, pivot at the frame centre |
| Booster flame frames | 22×58 | Anchor top-centre = nozzle |
| Obstacles | 15×10 (bird) to 84×26 (airliner) | Face right; flip for left |
| Effects | 24² (spark) to 192² (rocket explosion) | Square frames, anchor centre |
| Keycaps / balance meter | 35×16 / 101×11 | HUD, bottom corners / bottom centre |
| Throttle gauge | 13×64 | 11 frames = levels 0–10 |
| Panels | 24×24 (slice 6), plate 16×16 (slice 4) | Stretch with 9-slice |
| Button | 48×18 | Slices L5 R5 T4 B6; pressed face drops 2 px |
| Avatars | 24×24 | Rounded square, ink frame |
| Shiftter card | 208×66 | Layout in the manifest |
| Banners | ~150–200 × 32 | Width follows the text |

**Screen margins:** 6–8 px from every screen edge for HUD and UI. **Gaps** between UI blocks: 3–4 px inside panels, 6–8 px between panels.

## 7. Type

| Font | Glyphs | Line height | Use |
|---|---|---|---|
| `shiftx_body` | 5×7 caps, lowercase with ascenders and descenders, full printable ASCII, proportional | 10 | Body copy, posts, buttons |
| `shiftx_body_outline` | Same, with a 1px ink outline | 12 | Text over the scene |
| `shiftx_small` / `_outline` | 3×5 caps, digits, basic punctuation | 6 / 8 | HUD labels (uppercase only) |
| `shiftx_title` | Body caps at 2×, shaded, outlined, drop shadow | 20 | Banners, headings, countdown words |
| `shiftx_digits` | Bold 2× digits + `, . : + - x m !` | 21 | Scores and big numbers |

All fonts are white or the white family, so use the engine's tint to colour them. **Keep bitmap text on whole pixels**: centring with `setOrigin(0.5)` can land text on a half pixel and drop glyph columns, so centre with `Math.round(x - width / 2)` instead (`addText()` in `UI.js` does this). Fonts come as BMFont XML + PNG (`load.bitmapFont`). Don't scale fonts by fractions; for bigger text use `title`/`digits` rather than scaling `body`.

## 8. Animation

- **Frame-rate sets:** every animation ships at **24 fps** and **12 fps**. The 12 fps sheet is every other frame of the 24 fps one, so they last the same time.
- **Loops are seamless.** Particle positions and flicker are driven by a phase that wraps (`phase = frame / loopFrames`).
- **One-shots end clean.** Everything has faded out by the last frame, so the sprite can be destroyed on `animationcomplete`.
- **Anchors:** effects and countdowns anchor at the frame centre. Flames anchor top-centre on the nozzle. Pads and scenery anchor bottom-centre at origin (0.5, 1). Beams anchor bottom-centre.
- **Motion feel:** fast in, slow out (ease-out). Explosions: flash on frame 0, the peak by about 20% of the length, then a long dissolve.

## 9. Sprite sheets

- One animation per PNG, all frames the same size, transparent padding.
- **Grid layout, up to 8 columns**, frames in reading order (left to right, then down). Phaser's `load.spritesheet` indexes frames in that same order.
- **No sheet wider or taller than 4096 px.** Most GPUs refuse bigger textures.
- Static icon sets use the same strip format, with names in the manifest.
- **9-slice art** keeps any detail (highlights, bevels) inside the corner insets, so stretching never distorts it.

## 10. Manifest format

Every asset folder has a `manifest.json`. All coordinates are native pixels, local to the frame or image. The canonical shape is:

```json
{
  "notes": ["Free-text notes that apply to the whole folder."],
  "assets": {
    "<relative/path.png>": {
      "size": [w, h],                       // whole PNG
      "frame_size": [w, h],                 // animations only
      "frames": 24, "fps": 24, "loop": false,
      "layout": "grid, 8 columns, reading order",
      "ranges": {"three": [0, 11]},         // named sub-animations inside one sheet
      "origin": [0.5, 1.0],                 // anchor as a fraction of the frame
      "anchor": {"x": 11, "y": 0},          // anchor in pixels (flames, nozzles)
      "type": "nine_slice", "slice": {"left": 6, "right": 6, "top": 6, "bottom": 6},
      "number_slot": {"x": 73, "y": 3, "align": "right", "font": "shiftx_body_outline"},
      "hitbox": {"type": "rect", "x": 2, "y": 1, "w": 11, "h": 8},   // or {"type":"circle","x","y","r"}
      "blend": "ADD",
      "note": "How to use it, in one sentence."
    }
  }
}
```

Older packs (rocket, launch pad, obstacles, effects) use the same field names under slightly different top-level keys. Keep new packs to the shape above.

## 11. Naming

- `snake_case`, singular nouns: `throttle_gauge_l.png`, `banner_lost_balance.png`.
- Frame-rate variants end in `_24fps` / `_12fps`.
- States end in the state: `button_normal`, `button_pressed`, `key_lshift_down`.
- Folders by screen or system: `background/`, `rocket/`, `launchpad/`, `obstacles/`, `effects/`, `ui/kit`, `ui/start`, `ui/gameover`, `ui/hud`, `ui/fonts`.

## 12. Brand notes

- **ShiftOff!** is the game's title. The logo is SHIFT in white and OFF! in ShiftX orange, with the **"!" drawn as a shift-key arrow over a dot**. Use that "!" alone wherever the name won't fit (favicon, small badges). Files: `ui/start/logo_static.png`, `ui/start/logo_animated.png` (the "!" lifts off) and `shiftx/hud/shiftoff_logo.png` (1× HUD version).
- **ShiftX** is the fictional rocket company inside the game: the SHIFTX lettering on the rocket, the @ShiftX accounts on Shiftter, #ShiftXFail. Its mark is an **X whose top-right arm ends in a shift-key arrow**. Don't use any real space company's logo, lettering or swoosh.
- Asset, font and palette names keep the `shiftx_` prefix. It's the studio-wide namespace, so renaming the game doesn't break any keys.
- **Shiftter** is a fictional social app. Its mark is a teal speech bubble with a shift arrow. The icons (reply, reshift, like, views, share) and the 8-point verified seal are original. Don't copy any real network's bird, X, badge shape or layout details.
- Avatars are invented characters. Don't base one on a real person.

## 13. Checklist for a new asset

1. Uses only palette colours; lit from the upper left; 4-tone ramp.
2. Outline rule followed (touchable = ink outline, scenery/FX = none).
3. Looks right at 1× on the night background (check against `ui/mock_*.png`).
4. Animations: seamless loop or clean end; 24 + 12 fps sheets.
5. Sheet ≤ 8 columns, ≤ 4096 px.
6. Manifest entry with size, frames, fps, anchor/origin, plus hitbox or slices if relevant.
7. File named per section 11, in the right folder.
