# ShiftX — asset requests: start screen, game over, HUD

Goal: make the menu, HUD and game-over screen feel like one game instead of plain text over the sky.

## House style (same as existing assets)

- Pixel art at native size; the game is built around a **270 px tall** screen (480x270 reference). Every PNG gets a nearest-neighbour `@4x` copy, as now.
- Outlines and dark UI fill: `#16142a`. Sky top: `#2a275c`. ShiftX orange: `#ff6a3d` (highlight `#ff8a3d`, light `#ffb36b`). Warning red `#ff5040`, success yellow `#ffe066`.
- UI should match the existing keycaps / balance meter: chunky 1 px dark outline, flat fills, 1 px top highlight, 1 px bottom shadow.
- Animated sheets: grids of up to 8 columns, frames in reading order, with a `manifest.json` per folder (frame size, frame count, fps, loop, anchors), like `effects/` and `obstacles/`.
- Put each group in its own folder: `assets/ui/`, `assets/menu/`, `assets/gameover/`.

---

## 1. Shared UI kit (`assets/ui/`) — used by all three screens

| File | Size | Frames | Notes |
|---|---|---|---|
| `panel_9slice.png` | 24x24 | 1 | Dark navy panel, 8 px borders, for the HUD plates, menu boxes and buttons. Manifest: slice insets. |
| `panel_9slice_orange.png` | 24x24 | 1 | Same, orange-trimmed, for highlighted / "new best" states. |
| `font_pixel.png` + `font_pixel.json` | 6x9 glyph cell | — | Pixel font, ASCII 32–126, white fill + 1 px `#16142a` outline baked in. Monospaced is fine. JSON: glyph order + cell size (or a BMFont `.fnt`). Replaces Arial Black everywhere. |
| `font_digits_big.png` | 10x14 per glyph | 13 | `0–9`, `,`, `m`, space. Chunky digits for the altitude readout. |
| `button_click.png` | 120x20 | 2 | "CLICK TO …" button, idle + pressed. Text left blank (drawn with the pixel font) so it works for "LAUNCH" and "TRY AGAIN". |
| `icon_mouse_click.png` | 11x14 | 2 | Mouse with left button flashing, 4 fps. Sits next to the button prompt. |

## 2. Start screen (`assets/menu/`)

| File | Size | Frames | Notes |
|---|---|---|---|
| `title_logo.png` | 200x56 | 8 @ 12 fps, loop | Big ShiftX wordmark drawn at native size (the current 39x11 scaled 4x looks blocky). Light glint sweeps across every ~2 s. Little rocket or flame accent built into the "X". |
| `title_tagline.png` | 160x12 | 1 | "BALANCE OR BUST" (or similar) under the logo. |
| `controls_card.png` | 140x56 | 1 | Small panel: L SHIFT keycap → left booster, R SHIFT → right booster, arrows showing the tilt each one causes, and "HOLD BOTH TO CLIMB". Explains the game at a glance. |
| `best_plate.png` | 96x24 | 1 | "BEST" label plate; the number is drawn on top in the big digits. |
| `pad_spotlights.png` | 480x210 | 4 @ 6 fps, loop | Optional overlay matching `launchpad` frame size: two searchlight beams sweeping behind the tower, plus a blinking red beacon on the tower tip. Makes the menu pad feel alive. |
| `countdown.png` | 64x40 | 4 | "3", "2", "1", "LIFTOFF!" frames for the menu → launch transition. |

## 3. Game over: Shiftter post (`assets/gameover/`)

The game-over screen is a fake social post from the in-game app **Shiftter**, laid over the frozen crash site.

| File | Size | Frames | Notes |
|---|---|---|---|
| `shiftter_card_9slice.png` | 32x32 | 1 | Rounded dark card (`#15181f`, 1 px `#2f3340` border, 8 px corner radius), 12 px slice insets. |
| `shiftter_logo.png` | 64x14 | 1 | Shiftter wordmark plus an icon: a little rocket inside a speech bubble. Orange on dark. Must not resemble any real app's logo. |
| `shiftter_icons.png` | 9x9 each | 5 | Reply, repost, like, views, more (`…`). Muted grey `#8b929c`. |
| `shiftter_like_pop.png` | 15x15 | 6 @ 24 fps | Heart fills red and bursts. Plays once on the like count. |
| `verified_badge.png` | 9x9 | 1 | Orange rosette with a dark tick. |
| `avatars.png` | 22x22 each | 30 | One portrait per account, in this order: `shiftx` (logo), `intern` (stressed kid with a lanyard), `ceo` (Brent: sunglasses, turtleneck), `mom` (curly hair, phone held up filming), `gulls` (seagull in a hard hat), `faa` (official seal), `insurance` (Gary: tie, coffee), `stan` (heart eyes, rocket hoodie), `hater` (grumpy guy, arms crossed), `news` ("BREAKING" bug), `physics` (apple + Newton wig), `ground` (patch of dirt with a face), `local` (guy in a cap holding a hot dog), `drone` (quadcopter with eyes), `airline` (captain's hat), `pilot` (Dave: goggles, scarf), `sat` (satellite with a face), `astro` (smug asteroid), `meteo` (Deb pointing at a weather map), `balloon` (Harold in a balloon basket), `cloud` (angry storm cloud), `gravity` (black circle pulling things down), `rival` (generic corp logo), `dev` (hoodie, headphones, tired eyes), `chat` (speech bubble full of emoji), `lshift` (L SHIFT keycap with a sweaty face), `rshift` (R SHIFT keycap, lonely), `speedrun` (stopwatch), `therapist` (notepad and glasses), `reviewer` (critic with a scorecard). |
| `result_banner.png` | 180x28 | 4 | Banner above the card: "CRASHED", "LOST CONTROL", "IMPACT", "ROCKET DISASSEMBLED". |
| `new_best_ribbon.png` | 96x20 | 8 @ 12 fps, loop | Yellow "NEW BEST!" ribbon with shimmer, sits on the score plate. |
| `score_plate.png` | 140x28 | 1 | "ALTITUDE ___ m" plate under the card, matching `best_plate`. |

## 4. HUD (`assets/hud/`, additions)

Current layout: keycaps + balance meter across the **top**, altitude readout at the **bottom**.

| File | Size | Frames | Notes |
|---|---|---|---|
| `throttle_bar.png` | 35x5 | 11 | Throttle gauge under each keycap, levels 0–10 (matches the flame levels): segmented, orange to yellow as it fills. Replaces the plain rectangles. |
| `altitude_plate.png` | 96x26 | 1 | Bottom-centre plate the big altitude digits sit in. Small "ALT" label on the left. |
| `peak_best_strip.png` | 120x10 | 1 | Thin strip under the altitude plate with "PEAK" and "BEST" labels; numbers drawn in the pixel font. |
| `danger_flasher.png` | 52x12 | 2 @ 6 fps | "UNSTABLE!" warning that flashes above the balance meter while the danger meter fills. |
| `balance_meter_danger.png` | 101x11 | 1 | Red-shifted version of `balance_meter` to swap in while in danger (currently a code tint). |
| `obstacle_warning_arrow.png` | 11x10 | 2 | Optional companion to `warning_indicator`: a triangle with an arrow that can rotate toward the incoming obstacle's direction. |

---

### Delivery checklist
- PNG + `@4x` PNG for everything.
- `manifest.json` per folder: frame size, frame count, fps, loop, plus 9-slice insets and font glyph order where relevant.
- Transparent backgrounds; no baked-in text except where noted (labels like "ALT", "PEAK", "BEST", the banners and the countdown).
