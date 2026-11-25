import { Scene } from "phaser";
import { preloadUI, createUIAnims } from "../UI.js";

// Asset layout expected in public/assets/ (copy these folders from shiftx_assets/):
//   background/   sky gradient, star tiles, cloud layers, ground
//   hud/          logo, balance meter + marker, shift keycaps
//   rocket/       sprites/, flames/, manifest.json

const BACKGROUND = [
  "layer0_sky_gradient",
  "layer0_stars_far",
  "layer0_stars_near",
  "layer1_clouds_far",
  "layer1b_clouds_mid",
  "layer2_clouds_near",
  "layer3_ground",
];

const HUD = [
  "shiftoff_logo",
  "balance_meter",
  "balance_marker",
  "key_lshift_up",
  "key_lshift_down",
  "key_rshift_up",
  "key_rshift_down",
];

// Rotation sheet: 120 frames, 138x138, one every 3 degrees from -177 to 180.
// Frame for an angle: Phaser.Math.Wrap(Math.round((angleDeg + 177) / 3), 0, 120)
export const ROCKET_FRAME_SIZE = 138;
export const ROCKET_ANGLE_STEP = 3;

// Booster flame sheet (24 fps set): 11 rows (level 0 = off ... 10 = full), 16 frames per row, 22x58 each.
export const FLAME_FPS = 24;
export const FLAME_LOOP_FRAMES = 16;
export const FLAME_LEVELS = 11;

// Launchpad sheets: [texture/anim key, name in launchpad/manifest.json]. 24fps set, like the flames.
const LAUNCHPAD_ANIMS = [
  ["launchpad_idle", "idle"],
  ["launchpad_launch_back", "launch_back_24fps"],
  ["launchpad_launch_front", "launch_front_24fps"],
  ["launchpad_after", "after_24fps"],
];

export const LEFT_SHIFT = 1;
export const RIGHT_SHIFT = 2;

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // Simple progress bar sized for the 480x270 game.
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.add.rectangle(cx, cy, 200, 10).setStrokeStyle(1, 0xffffff);
    const bar = this.add
      .rectangle(cx - 98, cy, 4, 6, 0xff6a3d)
      .setOrigin(0, 0.5);

    this.load.on("progress", (progress) => {
      bar.width = 4 + 192 * progress;
    });
  }

  preload() {
    this.load.setPath("assets");

    // Background parallax layers
    for (const key of BACKGROUND) {
      this.load.image(key, `background/${key}.png`);
    }

    // HUD
    for (const key of HUD) {
      this.load.image(key, `hud/${key}.png`);
    }

    // Rocket
    this.load.image("shiftx_assembled", "rocket/sprites/shiftx_assembled.png");
    this.load.image("shiftx_core", "rocket/sprites/shiftx_core.png");
    this.load.image(
      "shiftx_booster_left",
      "rocket/sprites/shiftx_booster_left.png",
    );
    this.load.image(
      "shiftx_booster_right",
      "rocket/sprites/shiftx_booster_right.png",
    );
    this.load.spritesheet(
      "shiftx_rotation",
      "rocket/sprites/shiftx_rotation_sheet.png",
      {
        frameWidth: ROCKET_FRAME_SIZE,
        frameHeight: ROCKET_FRAME_SIZE,
      },
    );

    // Booster flames
    this.load.spritesheet(
      "booster_flame",
      `rocket/flames/${FLAME_FPS}fps/booster_flame_levels.png`,
      {
        frameWidth: 22,
        frameHeight: 58,
      },
    );

    // Pivot, nozzle anchors per rotation frame, etc.
    this.load.json("shiftx_manifest", "rocket/manifest.json");

    // Launchpad: idle loop plus the 24fps launch / after sheets (manifest loaded in Boot)
    const pad = this.cache.json.get("launchpad_manifest");
    const [padW, padH] = pad.frame_size;
    for (const [key, name] of LAUNCHPAD_ANIMS) {
      this.load.spritesheet(key, `launchpad/${pad.animations[name].file}`, {
        frameWidth: padW,
        frameHeight: padH,
      });
    }

    // Obstacles + warning indicator (manifest loaded in Boot)
    const obstacles = this.cache.json.get("obstacles_manifest");
    for (const [key, o] of Object.entries(obstacles.obstacles)) {
      this.load.spritesheet(key, `obstacles/${o.file}`, {
        frameWidth: o.frame_size[0],
        frameHeight: o.frame_size[1],
      });
    }
    const warn = obstacles.warning_indicator;
    this.load.spritesheet("warning_indicator", `obstacles/${warn.file}`, {
      frameWidth: warn.frame_size[0],
      frameHeight: warn.frame_size[1],
    });

    // UI kit: panels, buttons, bitmap fonts, menu / game over / HUD art (see ui/manifest.json)
    preloadUI(this);

    // Explosion / impact effects, 24fps set (manifest loaded in Boot)
    const effects = this.cache.json.get("effects_manifest").effects;
    for (const [key, e] of Object.entries(effects)) {
      this.load.spritesheet(key, `effects/${e.sets[`${FLAME_FPS}fps`].file}`, {
        frameWidth: e.frame_size[0],
        frameHeight: e.frame_size[1],
      });
    }
  }

  create() {
    // One looping animation per throttle level: "booster_flame_1" ... "booster_flame_10".
    // Level 0 is "off": hide the flame sprite instead of playing anything.
    for (let level = 1; level < FLAME_LEVELS; level++) {
      const start = level * FLAME_LOOP_FRAMES;
      this.anims.create({
        key: `booster_flame_${level}`,
        frames: this.anims.generateFrameNumbers("booster_flame", {
          start,
          end: start + FLAME_LOOP_FRAMES - 1,
        }),
        frameRate: FLAME_FPS,
        repeat: -1,
      });
    }

    // Launchpad: texture key = anim key, fps and looping from the manifest
    const pad = this.cache.json.get("launchpad_manifest");
    for (const [key, name] of LAUNCHPAD_ANIMS) {
      const a = pad.animations[name];
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(key, { end: a.frames - 1 }),
        frameRate: a.fps,
        repeat: a.loop ? -1 : 0,
      });
    }

    // Obstacles: one looping animation each, named after the obstacle
    const obstacles = this.cache.json.get("obstacles_manifest");
    for (const [key, o] of Object.entries(obstacles.obstacles)) {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(key, { end: o.frames - 1 }),
        frameRate: o.fps,
        repeat: -1,
      });
    }
    const warn = obstacles.warning_indicator;
    this.anims.create({
      key: "warning_indicator",
      frames: this.anims.generateFrameNumbers("warning_indicator", {
        end: warn.frames - 1,
      }),
      frameRate: warn.fps,
      repeat: -1,
    });

    // Effects: one-shot animations, named after the effect
    const effects = this.cache.json.get("effects_manifest").effects;
    for (const [key, e] of Object.entries(effects)) {
      const set = e.sets[`${FLAME_FPS}fps`];
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(key, { end: set.frames - 1 }),
        frameRate: set.fps,
        repeat: 0,
      });
    }

    createUIAnims(this);

    this.scene.start("MainMenu");
  }
}
