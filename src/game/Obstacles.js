import { Math as PMath } from "phaser";

// Spawns obstacles from obstacles/manifest.json based on altitude. They appear just off-screen on
// the edge the rocket is flying into (mostly the top; the side too when moving sideways). How each
// type moves comes from BEHAVIOUR below: only things that would plausibly come for you (drones,
// birds) steer toward the rocket; planes cross level at full speed, asteroids fall, balloons and
// clouds drift. Aimed ones lead the rocket: placed where it will be when they meet, not where it
// is now. A warning triangle shows at the screen edge nearest each incoming obstacle.

const M_PER_PX = 2; // manifest altitudes: 1 px of climb = 2 m
const MIN_ALT_M = 50; // nothing spawns until the rocket is this high
const SPAWN_EVERY = [0.8, 2]; // seconds between spawns, random in range
const MAX_ACTIVE = 6;
const SPAWN_AHEAD = 80; // px off-screen they appear (warning lead distance)
const AIM_CHANCE = 0.5; // chance an obstacle is aimed at the rocket's path instead of anywhere
const AIM_SPREAD = 40; // px of randomness either side of the aimed point
const MAX_LEAD = 4; // s: cap on how far ahead the aim predicts
const WARN_RANGE = 250; // px: warnings only for obstacles this close to the screen
const DESPAWN_MARGIN = 300; // px off-screen (sides/top) before an obstacle is removed
// Tracking (for types with track > 0): while above the rocket, steer sideways into its lane, so
// stopping and waiting doesn't clear them. Capped so moving still beats it.
const TRACK_MIN_SPEED = 40; // px/s top sideways speed while tracking, at track = 1
const TRACK_ACCEL = 60; // px/s² how quickly they turn toward you, at track = 1
const TRACK_EASE = 30; // px: slow down within this distance of your lane instead of overshooting
const EDGE = 3; // px between the warning triangle and the screen edge

// Per type:
//   drift: fraction of the manifest's sideways speed
//   sink:  px/s downward in the world, random in range (negative = rises)
//   track: 0 = ignores you, 1 = full tracking strength
//   side:  always enters from a side edge (level fliers), instead of mostly from the top
const BEHAVIOUR = {
  bird: { drift: 0.5, sink: [10, 25], track: 0.6 }, // curious gull
  bird_flock: { drift: 0.5, sink: [10, 20], track: 0.4 }, // wheels toward you, loosely
  drone: { drift: 0.6, sink: [0, 15], track: 1 }, // hunts you
  hot_air_balloon: { drift: 1, sink: [5, 15], track: 0 }, // drifts with the wind
  prop_plane: { drift: 1, sink: [0, 0], track: 0, side: true }, // fast level pass
  airliner: { drift: 1, sink: [0, 0], track: 0, side: true },
  storm_cloud: { drift: 1, sink: [10, 20], track: 0 }, // slow and wide
  weather_balloon: { drift: 1, sink: [-15, -5], track: 0 }, // rises slowly
  satellite: { drift: 1, sink: [0, 5], track: 0, side: true }, // orbital pass
  asteroid_small: { drift: 1, sink: [50, 90], track: 0 }, // falls straight at where you'll be
  asteroid_medium: { drift: 1, sink: [40, 70], track: 0 },
  asteroid_large: { drift: 1, sink: [30, 50], track: 0 },
  space_junk: { drift: 1, sink: [20, 40], track: 0 }, // tumbling down
};
const DEFAULT_BEHAVIOUR = { drift: 0.5, sink: [15, 35], track: 0 };

export class Obstacles {
  /** groundRefY: world y that counts as 0 m (the rocket's rest y on the pad). */
  constructor(scene, groundRefY) {
    this.scene = scene;
    this.groundRefY = groundRefY;
    this.defs = Object.entries(
      scene.cache.json.get("obstacles_manifest").obstacles,
    ).map(([key, d]) => ({
      key,
      ...d,
      behaviour: BEHAVIOUR[key] || DEFAULT_BEHAVIOUR,
    }));
    this.active = [];
    this.spawnIn = SPAWN_EVERY[0];
  }

  /**
   * rocket: { x, y, vx, vy } in world space, used to aim spawns. Pass rocketAltM = 0 to stop
   * spawning (e.g. after a crash) while existing ones keep moving.
   */
  update(dt, rocket, rocketAltM) {
    if (rocketAltM >= MIN_ALT_M && this.active.length < MAX_ACTIVE) {
      this.spawnIn -= dt;
      if (this.spawnIn <= 0) {
        this.spawn(rocket);
        this.spawnIn = PMath.FloatBetween(...SPAWN_EVERY);
      }
    }

    const cam = this.scene.cameras.main;
    const { width, height } = this.scene.scale;

    this.active = this.active.filter((o) => {
      o.sprite.x += o.vx * dt;
      o.sprite.y += o.vy * dt;

      // track: while above the rocket, steer toward its lane
      const track = o.def.behaviour.track;
      if (track > 0 && o.sprite.y < rocket.y) {
        const dx = rocket.x - o.sprite.x;
        const target =
          Math.sign(dx) * o.trackSpeed * Math.min(1, Math.abs(dx) / TRACK_EASE);
        const maxStep = TRACK_ACCEL * track * dt;
        o.vx += PMath.Clamp(target - o.vx, -maxStep, maxStep);
        if (Math.abs(o.vx) > 1) o.sprite.setFlipX(o.vx < 0); // art faces right
      }

      const halfW = o.sprite.width / 2;
      const halfH = o.sprite.height / 2;
      const screenX = o.sprite.x - cam.scrollX;
      const screenY = o.sprite.y - cam.scrollY;

      // gone: fell below the screen, or left far behind off a side / the top
      if (
        screenY - halfH > height + 50 ||
        screenX + halfW < -DESPAWN_MARGIN ||
        screenX - halfW > width + DESPAWN_MARGIN ||
        screenY + halfH < -DESPAWN_MARGIN
      ) {
        o.sprite.destroy();
        o.warning.destroy();
        return false;
      }

      // warning: while fully off-screen and close, pin it to the nearest point on the screen edge
      const gapX = Math.max(-(screenX + halfW), screenX - halfW - width, 0);
      const gapY = Math.max(-(screenY + halfH), 0);
      const offScreen = gapX > 0 || gapY > 0;
      o.warning.setVisible(offScreen && Math.max(gapX, gapY) < WARN_RANGE);
      if (o.warning.visible) {
        const wHalf = o.warning.width / 2;
        const hHalf = o.warning.height / 2;
        o.warning.setPosition(
          PMath.Clamp(screenX, EDGE + wHalf, width - EDGE - wHalf),
          PMath.Clamp(screenY, EDGE + hHalf, height - EDGE - hHalf),
        );
      }
      return true;
    });
  }

  spawn(rocket) {
    const cam = this.scene.cameras.main;
    const { width, height } = this.scene.scale;
    const climb = Math.max(0, -rocket.vy);

    // pick the type from the altitude just above the screen, where most things enter
    const altM = (this.groundRefY - (cam.scrollY - SPAWN_AHEAD)) * M_PER_PX;
    const options = this.defs.filter(
      (d) => altM >= d.altitude_m[0] && altM <= d.altitude_m[1],
    );
    if (options.length === 0) return;
    const def = PMath.RND.pick(options);
    const b = def.behaviour;

    // Which edge: level fliers always come from a side. Everything else is weighted by how fast
    // the rocket is heading into each edge: straight up = top, 45° = top or side about equally.
    const fromSide =
      b.side ||
      Math.random() < Math.abs(rocket.vx) / (Math.abs(rocket.vx) + climb + 1);
    // side spawns enter from the side the rocket is heading toward (random if barely moving)
    const onRight =
      Math.abs(rocket.vx) > 5 ? rocket.vx > 0 : Math.random() < 0.5;
    const aimed = Math.random() < AIM_CHANCE;

    // side spawns fly inward; top spawns drift either way
    const dir = fromSide ? (onRight ? -1 : 1) : Math.random() < 0.5 ? 1 : -1;
    const vx = dir * PMath.FloatBetween(...def.speed_px_per_s) * b.drift;
    const vy = PMath.FloatBetween(...b.sink);

    // Lead = time until rocket and obstacle meet; the spawn point is shifted by how far the
    // rocket moves (relative to the obstacle) in that time.
    let x, y;
    if (fromSide) {
      x = onRight ? cam.scrollX + width + SPAWN_AHEAD : cam.scrollX - SPAWN_AHEAD;
      const lead = clampLead((x - rocket.x) / (rocket.vx - vx));
      y = aimed
        ? rocket.y + (rocket.vy - vy) * lead
        : cam.scrollY + PMath.FloatBetween(0, height) + (rocket.vy - vy) * lead;
      // no higher than the top spawn line, or it'd be culled before arriving
      y = Math.max(y, cam.scrollY - SPAWN_AHEAD);
    } else {
      y = cam.scrollY - SPAWN_AHEAD;
      const lead = clampLead((rocket.y - y) / (vy - rocket.vy));
      x = aimed
        ? rocket.x + (rocket.vx - vx) * lead
        : cam.scrollX + PMath.FloatBetween(0, width) + rocket.vx * lead;
    }
    if (aimed) {
      x += PMath.FloatBetween(-AIM_SPREAD, AIM_SPREAD);
      if (fromSide) y += PMath.FloatBetween(-AIM_SPREAD, AIM_SPREAD);
    }
    // push fully off-screen past the edge it's coming from
    const [fw, fh] = def.frame_size;
    if (fromSide) x += (onRight ? 1 : -1) * (fw / 2);
    else y -= fh / 2;

    const sprite = this.scene.add
      .sprite(x, y, def.key)
      .setFlipX(dir < 0) // art faces right
      .play(def.key);
    const warning = this.scene.add
      .sprite(0, 0, "warning_indicator")
      .setScrollFactor(0)
      .setDepth(90)
      .setVisible(false)
      .play("warning_indicator");

    const trackSpeed = Math.max(TRACK_MIN_SPEED * b.track, Math.abs(vx));
    this.active.push({ def, sprite, warning, vx, vy, trackSpeed });
  }

  /** Take an obstacle out of play (e.g. it was destroyed in a collision). */
  remove(o) {
    o.sprite.destroy();
    o.warning.destroy();
    this.active = this.active.filter((a) => a !== o);
  }

  /**
   * circles: [{x, y, r}] in world space. Returns the first obstacle hit ({ def, sprite, ... }),
   * or null.
   */
  hit(circles) {
    for (const o of this.active) {
      const box = this.worldHitbox(o);
      for (const c of circles) {
        if (box.type === "circle") {
          const r = box.r + c.r;
          if ((c.x - box.x) ** 2 + (c.y - box.y) ** 2 <= r * r) return o;
        } else {
          // circle vs rect: distance from the circle centre to the nearest point on the rect
          const nx = PMath.Clamp(c.x, box.x, box.x + box.w);
          const ny = PMath.Clamp(c.y, box.y, box.y + box.h);
          if ((c.x - nx) ** 2 + (c.y - ny) ** 2 <= c.r * c.r) return o;
        }
      }
    }
    return null;
  }

  // Manifest hitboxes are frame-local (top-left origin); move them to world space, mirrored if flipped.
  worldHitbox(o) {
    const [fw, fh] = o.def.frame_size;
    const hb = o.def.hitbox;
    const left = o.sprite.x - fw / 2;
    const top = o.sprite.y - fh / 2;
    const flip = o.sprite.flipX;

    if (hb.type === "circle") {
      return {
        type: "circle",
        x: left + (flip ? fw - hb.x : hb.x),
        y: top + hb.y,
        r: hb.r,
      };
    }
    return {
      type: "rect",
      x: left + (flip ? fw - hb.x - hb.w : hb.x),
      y: top + hb.y,
      w: hb.w,
      h: hb.h,
    };
  }
}

// Time until meeting, kept sane: negative/NaN (moving apart) = no lead, very slow closing = capped.
function clampLead(t) {
  return Number.isFinite(t) ? PMath.Clamp(t, 0, MAX_LEAD) : 0;
}
