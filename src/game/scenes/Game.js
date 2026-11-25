import { Scene } from "phaser";
import { ParallaxBackground } from "../ParallaxBackground";
import { Launchpad } from "../Launchpad";
import { Obstacles } from "../Obstacles";
import { loadHighScore } from "../highScore";
import { Hud } from "../Hud";
import { TouchControls } from "../TouchControls.js";
import { isTouchDevice } from "../device.js";
import { Searchlights } from "../Searchlights";

// --- tuning (px, seconds, radians) ---
const RAMP_UP = 2; // throttle per second while held (0 -> full in 0.5s)
const RAMP_DOWN = 3; // throttle per second after release
const MAX_THRUST = 150; // px/s² per booster at full throttle
const GRAVITY = 200; // px/s² down. One booster alone (150) can't lift off; both (300) can.
const SPIN = 0.04; // angular accel per unit of thrust imbalance
const ANG_DRAG = 1.5; // spin decay per second. Top spin speed = SPIN * MAX_THRUST / ANG_DRAG
const DRAG = 0.3; // linear air resistance per second

// Topple: gravity tips the rocket over, scaled by sin³θ so it's barely felt near upright.
// At 90° it's TOPPLE_STRENGTH of a full single booster's torque: below 1 = recoverable,
// but only just (0.85 leaves 15% of your authority to fight back). Higher = harder.
const TOPPLE_STRENGTH = 0.85;
const TOPPLE = TOPPLE_STRENGTH * SPIN * MAX_THRUST;

// Spin drag fades as the rocket tips over, so momentum built while tilted keeps carrying.
// Upright: full ANG_DRAG. Sideways or worse: only TILTED_DRAG_FRAC of it.
const TILTED_DRAG_FRAC = 0.2;

// Losing control: the danger meter fills while upside down (past 90°) or spinning faster than
// SPIN_LIMIT, drains when back in control. Full meter = break up. Gives a window to recover.
const SPIN_LIMIT = 5; // rad/s (~290°/s)
const LOST_TIME = 2.5; // seconds of danger before breaking up
const DANGER_DRAIN = 1; // meter drains this many seconds per second once safe

// rocket sprite: 48x101, centre of mass at (24, 62) — see rocket/manifest.json
const ROCKET_PIVOT_Y = 62 / 101;
const PIVOT_TO_NOZZLE = 101 - 62;
// booster nozzles relative to the centre of mass: (12, 99) and (36, 99) in the sprite
const NOZZLE_LEFT = { x: 12 - 24, y: 99 - 62 };
const NOZZLE_RIGHT = { x: 36 - 24, y: 99 - 62 };
// obstacle collision: circles along the body relative to the centre of mass (core, then boosters)
const ROCKET_HITBOX = [
  { x: 0, y: -50, r: 9 },
  { x: 0, y: -32, r: 10 },
  { x: 0, y: -8, r: 15 },
  { x: 0, y: 22, r: 16 },
];
const M_PER_PX = 2; // altitude scale used by the obstacle manifest

// crash: touching the ground faster or more tilted than this explodes
const CRASH_SPEED = 120; // px/s downward
const CRASH_ANGLE_DEG = 20;
const GAME_OVER_DELAY = 2200; // ms of explosion before the GameOver scene (rocket blast is 2s)
const SPACE_M = 30000; // above this, explosions use the no-smoke space versions

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    // game state
    this.isLeftShiftDown = false;
    this.isRightShiftDown = false;
    this.tL = 0; // throttles, 0..1
    this.tR = 0;
    this.vx = 0; // velocity, px/s
    this.vy = 0;
    this.theta = 0; // angle, radians, 0 = upright, clockwise positive
    this.omega = 0; // angular velocity, rad/s
    this.crashed = false;
    this.danger = 0; // seconds spent out of control, 0..LOST_TIME
    this.peakAltM = 0; // score: highest altitude reached this run
    this.best = loadHighScore();

    // scene set up
    this.bg = new ParallaxBackground(this);

    // pad sits at the bottom of the initial screen; the rocket stands on its nozzle point
    this.pad = new Launchpad(this, this.scale.width / 2, this.scale.height);
    this.groundY = this.pad.nozzleY - PIVOT_TO_NOZZLE; // rocket's rest y on the pad = 0 m
    this.lights = new Searchlights(this);
    this.lights.placeAt(this.pad);
    this.obstacles = new Obstacles(this, this.groundY);

    // flames: added before the rocket so they draw behind it. Anchor is top-centre (11, 0).
    this.flameL = this.add
      .sprite(0, 0, "booster_flame")
      .setOrigin(0.5, 0)
      .setVisible(false);
    this.flameR = this.add
      .sprite(0, 0, "booster_flame")
      .setOrigin(0.5, 0)
      .setVisible(false);

    this.rocket = this.add
      .image(this.scale.width / 2, this.groundY, "shiftx_assembled")
      .setOrigin(0.5, ROCKET_PIVOT_Y);

    this.hud = new Hud(this);
    this.touch = isTouchDevice() ? new TouchControls(this) : null;

    // physics readout for tuning, hidden until ` (backtick) is pressed
    this.debug = this.add
      .text(4, 4, "", { fontFamily: "monospace", fontSize: 8, color: "#ffffff" })
      .setScrollFactor(0)
      .setDepth(101)
      .setVisible(false);
    this.input.keyboard.on("keydown-BACKTICK", () =>
      this.debug.setVisible(!this.debug.visible),
    );

    // input logic
    this.input.keyboard.on("keydown-SHIFT", (event) => {
      if (event.location === 1) {
        this.isLeftShiftDown = true;
      } else if (event.location === 2) {
        this.isRightShiftDown = true;
      }
    });

    this.input.keyboard.on("keyup-SHIFT", (event) => {
      if (event.location === 1) {
        this.isLeftShiftDown = false;
      } else if (event.location === 2) {
        this.isRightShiftDown = false;
      }
    });
  }

  update(time, delta) {
    const dt = delta / 1000;
    this.lights.update(time);

    if (this.crashed) {
      // physics stops; keep the clouds and obstacles moving behind the explosion
      const cam = this.cameras.main;
      this.bg.update(cam.scrollX, -cam.scrollY, time / 1000);
      this.obstacles.update(dt, this.rocketState(), 0);
      return;
    }

    // keyboard or the on-screen buttons
    const leftDown = this.isLeftShiftDown || !!this.touch?.leftDown;
    const rightDown = this.isRightShiftDown || !!this.touch?.rightDown;

    // throttle: ramps up while held, drains when released
    this.tL = leftDown
      ? Math.min(1, this.tL + RAMP_UP * dt)
      : Math.max(0, this.tL - RAMP_DOWN * dt);
    this.tR = rightDown
      ? Math.min(1, this.tR + RAMP_UP * dt)
      : Math.max(0, this.tR - RAMP_DOWN * dt);

    const FL = MAX_THRUST * this.tL;
    const FR = MAX_THRUST * this.tR;

    // sum pushes along the nose: up vector is (sin θ, -cos θ) with y pointing down
    const T = FL + FR;
    const ax = T * Math.sin(this.theta) - this.vx * DRAG;
    const ay = -T * Math.cos(this.theta) + GRAVITY - this.vy * DRAG;

    // difference twists: left booster stronger -> clockwise (tilt right).
    // Topple pulls further in whichever direction it's already leaning.
    const alpha =
      SPIN * (FL - FR) +
      TOPPLE * Math.sin(this.theta) ** 3 -
      this.omega * ANG_DRAG * this.spinDragFactor();

    // semi-implicit Euler: velocities first, then positions
    this.vx += ax * dt;
    this.vy += ay * dt;
    this.omega += alpha * dt;
    this.rocket.x += this.vx * dt;
    this.rocket.y += this.vy * dt;
    this.theta += this.omega * dt;
    this.rocket.rotation = this.theta;

    // lost: past horizontal (cos θ < 0) the topple has won, no way back
    const outOfControl =
      Math.cos(this.theta) < 0 || Math.abs(this.omega) > SPIN_LIMIT;
    this.danger = outOfControl
      ? this.danger + dt
      : Math.max(0, this.danger - DANGER_DRAIN * dt);
    if (this.danger >= LOST_TIME) {
      this.explode("Lost control", { cause: "lost" });
      return;
    }

    // warning: rocket blinks red while in danger, faster as the meter fills
    const blinkMs = 200 - 150 * (this.danger / LOST_TIME);
    if (this.danger > 0 && Math.floor(time / blinkMs) % 2 === 0) {
      this.rocket.setTint(0xff5040);
    } else {
      this.rocket.clearTint();
    }

    // crash: lowest point of the rotated sprite touches the pad/ground too fast or too tilted
    const surfaceY = this.pad.surfaceAt(this.rocket.x);
    const tiltDeg = Math.abs((this.theta * 180) / Math.PI);
    if (
      this.rocket.getBounds().bottom >= surfaceY &&
      (this.vy > CRASH_SPEED || tiltDeg > CRASH_ANGLE_DEG)
    ) {
      this.explode("Crashed", { cause: "crash" });
      return;
    }

    // obstacles
    const hit = this.obstacles.hit(this.rocketHitCircles());
    if (hit) {
      const key = hit.def.key;
      const name = key.replace(/_/g, " ");
      this.explode(`Hit ${/^[aeiou]/.test(name) ? "an" : "a"} ${name}`, {
        cause: "hit",
        obstacle: key,
      });
      this.destroyObstacle(hit);
      return;
    }

    // lift-off: play the pad's launch sequence the first time the rocket leaves it
    if (this.rocket.y < this.groundY - 1) this.pad.launch();

    // ground: stand upright and stop. Also keeps it from spinning on the pad before lift-off.
    const restY = surfaceY - PIVOT_TO_NOZZLE;
    if (this.rocket.y >= restY) {
      this.rocket.y = restY;
      this.vx = 0;
      this.vy = Math.min(0, this.vy);
      this.omega = 0;
      this.theta = 0;
    }

    this.rocket.rotation = this.theta;
    this.placeFlame(this.flameL, NOZZLE_LEFT, this.tL);
    this.placeFlame(this.flameR, NOZZLE_RIGHT, this.tR);

    // camera: follows x always. For y, rocket climbs freely until it reaches the follow line,
    // then the camera scrolls up with it so it stays pinned there. Never scroll below the ground.
    const cam = this.cameras.main;
    const followLineY = this.scale.height * 0.55;
    cam.scrollX = this.rocket.x - this.scale.width / 2;
    cam.scrollY = Math.min(0, this.rocket.y - followLineY);

    // bg wants "px climbed" (positive = up); camera scrollY goes negative going up
    this.bg.update(cam.scrollX, -cam.scrollY, time / 1000); // clouds drift gently

    const altM = Math.max(0, (this.groundY - this.rocket.y) * M_PER_PX);
    this.peakAltM = Math.max(this.peakAltM, altM);
    this.obstacles.update(dt, this.rocketState(), altM);

    this.hud.update({
      tL: this.tL,
      tR: this.tR,
      leftDown,
      rightDown,
      theta: this.theta,
      danger: this.danger / LOST_TIME,
      altM,
      peakM: this.peakAltM,
      best: this.best,
      time,
    });

    this.debug.setText(
      [
        `tL ${this.tL.toFixed(2)}  tR ${this.tR.toFixed(2)}`,
        `vx ${this.vx.toFixed(0)}  vy ${this.vy.toFixed(0)}`,
        `θ ${((this.theta * 180) / Math.PI).toFixed(0)}°  ω ${this.omega.toFixed(2)}`,
        `alt ${altM.toFixed(0)} m`,
        `danger ${this.danger.toFixed(1)}/${LOST_TIME}`,
      ].join("\n"),
    );
  }

  // 1 when upright, fading to TILTED_DRAG_FRAC at 90° and staying there past it.
  spinDragFactor() {
    const upright = Math.max(0, Math.cos(this.theta)) ** 2;
    return TILTED_DRAG_FRAC + (1 - TILTED_DRAG_FRAC) * upright;
  }

  // position + velocity, for obstacles to aim at where the rocket is going
  rocketState() {
    return { x: this.rocket.x, y: this.rocket.y, vx: this.vx, vy: this.vy };
  }

  // ROCKET_HITBOX rotated with the rocket, in world space.
  rocketHitCircles() {
    const cos = Math.cos(this.theta);
    const sin = Math.sin(this.theta);
    return ROCKET_HITBOX.map((c) => ({
      x: this.rocket.x + c.x * cos - c.y * sin,
      y: this.rocket.y + c.x * sin + c.y * cos,
      r: c.r,
    }));
  }

  // Pin a flame to its nozzle (rotated with the rocket) and pick the level from throttle.
  placeFlame(flame, nozzle, throttle) {
    const level = Math.round(throttle * 10);
    if (level === 0) {
      flame.setVisible(false);
      return;
    }

    const cos = Math.cos(this.theta);
    const sin = Math.sin(this.theta);
    flame
      .setVisible(true)
      .setPosition(
        this.rocket.x + nozzle.x * cos - nozzle.y * sin,
        this.rocket.y + nozzle.x * sin + nozzle.y * cos,
      )
      .setRotation(this.theta)
      .play(`booster_flame_${level}`, true); // true = don't restart if already playing
  }

  // Blow up at the rocket's position, then lay the GameOver screen over this scene, so the
  // wreckage and sky stay exactly where the crash happened.
  // details: { cause: "crash" | "lost" | "hit", obstacle?: manifest key } — picks the post there.
  explode(reason, details) {
    this.crashed = true;
    const { x, y } = this.rocket;
    this.rocket.setVisible(false);
    this.flameL.setVisible(false);
    this.flameR.setVisible(false);
    this.hud.setVisible(false);
    this.touch?.setVisible(false);

    const altM = Math.max(0, (this.groundY - y) * M_PER_PX);
    const peakM = Math.max(this.peakAltM, altM);
    this.playEffect(
      altM >= SPACE_M ? "rocket_explosion_space" : "rocket_explosion",
      x,
      y,
    );

    this.cameras.main.shake(300, 0.01);
    this.time.delayedCall(GAME_OVER_DELAY, () =>
      this.scene.launch("GameOver", {
        reason,
        score: Math.floor(peakM),
        death: { ...details, altM, peakM },
      }),
    );
  }

  // The obstacle's own effect from effects/manifest.json. Storm clouds survive: they zap the rocket.
  destroyObstacle(o) {
    const fx = this.cache.json.get("effects_manifest").obstacle_effect[o.def.key];
    if (o.def.key === "storm_cloud") {
      this.playEffect(fx.effect, this.rocket.x, this.rocket.y, fx.scale);
      return;
    }
    this.playEffect(fx.effect, o.sprite.x, o.sprite.y, fx.scale);
    this.obstacles.remove(o);
  }

  // One-shot effect centred on (x, y), drawn above everything in the world, gone when finished.
  playEffect(key, x, y, scale = 1) {
    const fx = this.add.sprite(x, y, key).setScale(scale).setDepth(20).play(key);
    fx.once("animationcomplete", () => fx.destroy());
  }
}
