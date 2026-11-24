// ShiftX UI kit loader for Phaser (JS). Generated from ui/manifest.json.
// Copy the ui folder to public/assets/ui/. Keys: ui_<folder>_<name>, fonts: shiftx_<name>.

export const UI_IMAGES = {"ui_kit_panel_night": "kit/panel_night.png", "ui_kit_panel_paper": "kit/panel_paper.png", "ui_kit_panel_accent": "kit/panel_accent.png", "ui_kit_panel_gold": "kit/panel_gold.png", "ui_kit_plate_inset": "kit/plate_inset.png", "ui_kit_button_normal": "kit/button_normal.png", "ui_kit_button_hover": "kit/button_hover.png", "ui_kit_button_pressed": "kit/button_pressed.png", "ui_kit_button_disabled": "kit/button_disabled.png", "ui_start_logo_static": "start/logo_static.png", "ui_start_tagline": "start/tagline.png", "ui_start_controls_card": "start/controls_card.png", "ui_start_best_score_plate": "start/best_score_plate.png", "ui_start_searchlight_beam": "start/searchlight_beam.png", "ui_start_searchlight_lamp": "start/searchlight_lamp.png", "ui_gameover_shiftter_icon": "gameover/shiftter_icon.png", "ui_gameover_shiftter_logo": "gameover/shiftter_logo.png", "ui_gameover_verified_badge": "gameover/verified_badge.png", "ui_gameover_shiftter_card_bg": "gameover/shiftter_card_bg.png", "ui_gameover_shiftter_feed_header": "gameover/shiftter_feed_header.png", "ui_gameover_shiftter_card_example": "gameover/shiftter_card_example.png", "ui_gameover_banner_crashed": "gameover/banner_crashed.png", "ui_gameover_banner_lost_balance": "gameover/banner_lost_balance.png", "ui_gameover_banner_bird_strike": "gameover/banner_bird_strike.png", "ui_gameover_banner_midair": "gameover/banner_midair.png", "ui_gameover_banner_zapped": "gameover/banner_zapped.png", "ui_gameover_banner_asteroid": "gameover/banner_asteroid.png", "ui_gameover_banner_space_junk": "gameover/banner_space_junk.png", "ui_gameover_banner_orbit": "gameover/banner_orbit.png", "ui_gameover_score_plate": "gameover/score_plate.png", "ui_hud_altitude_plate": "hud/altitude_plate.png"};

export const UI_SHEETS = {
  ui_kit_click_icon: { file: "kit/click_icon.png", frameWidth: 26, frameHeight: 26, frames: 4, fps: 6, loop: true },
  ui_start_logo_animated: { file: "start/logo_animated.png", frameWidth: 132, frameHeight: 34, frames: 24, fps: 12, loop: true },
  ui_start_countdown: { file: "start/countdown.png", frameWidth: 128, frameHeight: 52, frames: 52, fps: 12, loop: false, ranges: {"3": [0, 11], "2": [12, 23], "1": [24, 35], "liftoff": [36, 51]} },
  ui_gameover_shiftter_icons: { file: "gameover/shiftter_icons.png", frameWidth: 13, frameHeight: 13, frames: 8, fps: 0, loop: false },
  ui_gameover_like_pop: { file: "gameover/like_pop.png", frameWidth: 26, frameHeight: 26, frames: 10, fps: 24, loop: false },
  ui_gameover_avatars: { file: "gameover/avatars.png", frameWidth: 24, frameHeight: 24, frames: 23, fps: 0, loop: false },
  ui_gameover_new_best_ribbon: { file: "gameover/new_best_ribbon.png", frameWidth: 151, frameHeight: 38, frames: 8, fps: 12, loop: true },
  ui_hud_throttle_gauge_l: { file: "hud/throttle_gauge_l.png", frameWidth: 13, frameHeight: 64, frames: 11, fps: 0, loop: false },
  ui_hud_throttle_gauge_r: { file: "hud/throttle_gauge_r.png", frameWidth: 13, frameHeight: 64, frames: 11, fps: 0, loop: false },
  ui_hud_unstable_flasher: { file: "hud/unstable_flasher.png", frameWidth: 76, frameHeight: 15, frames: 4, fps: 8, loop: true },
  ui_hud_balance_meter_danger: { file: "hud/balance_meter_danger.png", frameWidth: 101, frameHeight: 11, frames: 4, fps: 8, loop: true },
};

export const UI_FONTS = {
  shiftx_body: { png: "fonts/shiftx_body.png", xml: "fonts/shiftx_body.xml" },
  shiftx_body_outline: { png: "fonts/shiftx_body_outline.png", xml: "fonts/shiftx_body_outline.xml" },
  shiftx_small: { png: "fonts/shiftx_small.png", xml: "fonts/shiftx_small.xml" },
  shiftx_small_outline: { png: "fonts/shiftx_small_outline.png", xml: "fonts/shiftx_small_outline.xml" },
  shiftx_title: { png: "fonts/shiftx_title.png", xml: "fonts/shiftx_title.xml" },
  shiftx_digits: { png: "fonts/shiftx_digits.png", xml: "fonts/shiftx_digits.xml" },
};

// 9-slice insets for scene.add.nineslice(x, y, key, undefined, width, height, left, right, top, bottom)
export const UI_NINE_SLICE = {"ui_kit_panel_night": {"left": 6, "right": 6, "top": 6, "bottom": 6}, "ui_kit_panel_paper": {"left": 6, "right": 6, "top": 6, "bottom": 6}, "ui_kit_panel_accent": {"left": 6, "right": 6, "top": 6, "bottom": 6}, "ui_kit_panel_gold": {"left": 6, "right": 6, "top": 6, "bottom": 6}, "ui_kit_plate_inset": {"left": 4, "right": 4, "top": 4, "bottom": 4}, "ui_kit_button_normal": {"left": 5, "right": 5, "top": 4, "bottom": 6}, "ui_kit_button_hover": {"left": 5, "right": 5, "top": 4, "bottom": 6}, "ui_kit_button_pressed": {"left": 5, "right": 5, "top": 4, "bottom": 6}, "ui_kit_button_disabled": {"left": 5, "right": 5, "top": 4, "bottom": 6}};

/** Call from Preloader.preload() (after this.load.setPath("assets")). */
export function preloadUI(scene, base = "ui/") {
  for (const [key, file] of Object.entries(UI_IMAGES)) scene.load.image(key, base + file);
  for (const [key, s] of Object.entries(UI_SHEETS))
    scene.load.spritesheet(key, base + s.file, { frameWidth: s.frameWidth, frameHeight: s.frameHeight });
  for (const [key, f] of Object.entries(UI_FONTS)) scene.load.bitmapFont(key, base + f.png, base + f.xml);
}

/** Call once from Preloader.create(). Animated sheets get an anim with the same key (plus key_<range> for named ranges). */
export function createUIAnims(scene) {
  for (const [key, s] of Object.entries(UI_SHEETS)) {
    if (!s.fps || scene.anims.exists(key)) continue; // fps 0 = static strip (icons, avatars, gauge levels)
    scene.anims.create({ key, frames: scene.anims.generateFrameNumbers(key, { start: 0, end: s.frames - 1 }),
                         frameRate: s.fps, repeat: s.loop ? -1 : 0 });
    for (const [name, [a, b]] of Object.entries(s.ranges ?? {}))
      scene.anims.create({ key: `${key}_${name}`, frames: scene.anims.generateFrameNumbers(key, { start: a, end: b }),
                           frameRate: s.fps, repeat: 0 });
  }
}

/** Stretchable panel / button using the manifest's slice insets. */
export function addPanel(scene, key, x, y, width, height) {
  const s = UI_NINE_SLICE[key];
  return scene.add.nineslice(x, y, key, undefined, width, height, s.left, s.right, s.top, s.bottom);
}

/** Bitmap text on whole pixels. setOrigin(0.5) can land text on a half pixel, and pixel-art sampling then drops columns. */
export function addText(scene, x, y, font, text, { align = "left", tint } = {}) {
  const t = scene.add.bitmapText(0, 0, font, text);
  const w = t.width;
  const left = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  t.setPosition(Math.round(left), Math.round(y));
  if (tint !== undefined) t.setTint(tint);
  return t;
}
