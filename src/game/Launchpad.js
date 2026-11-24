// Launch pad from launchpad/manifest.json: 480x210 frames, placed with origin (0.5, 1) at the
// bottom of the initial screen in world space. launch_back draws behind the rocket,
// launch_front in front. Idle loops until lift-off, then launch plays once and "after" loops.

// platform deck in frame pixels, either side of the flame trench
const DECK_LEFT = 155;
const DECK_RIGHT = 322;

export class Launchpad {
  constructor(scene, x, bottomY) {
    this.manifest = scene.cache.json.get("launchpad_manifest");
    this.launched = false;

    this.back = scene.add
      .sprite(0, 0, "launchpad_idle")
      .setOrigin(0.5, 1)
      .setDepth(-10)
      .play("launchpad_idle");
    this.front = scene.add
      .sprite(0, 0, "launchpad_launch_front")
      .setOrigin(0.5, 1)
      .setDepth(10)
      .setVisible(false);

    this.moveTo(x, bottomY);
  }

  /** Place the pad's bottom-centre at (x, bottomY) and recompute its surfaces. */
  moveTo(x, bottomY) {
    const m = this.manifest;
    const [w, h] = m.frame_size;
    const top = bottomY - h;

    this.x = x;
    this.groundLineY = top + m.ground_line_y; // world y of the ground surface
    this.nozzleY = top + m.rocket_nozzle_point[1]; // world y the rocket's nozzles rest on
    this.deckLeft = x - w / 2 + DECK_LEFT;
    this.deckRight = x - w / 2 + DECK_RIGHT;
    this.back.setPosition(x, bottomY);
    this.front.setPosition(x, bottomY);
  }

  /** World y of whatever the rocket would stand on at this x. */
  surfaceAt(x) {
    return x >= this.deckLeft && x <= this.deckRight
      ? this.nozzleY
      : this.groundLineY;
  }

  launch() {
    if (this.launched) return;
    this.launched = true;

    this.back.play("launchpad_launch_back");
    this.back.once("animationcomplete", () => this.back.play("launchpad_after"));

    this.front.setVisible(true).play("launchpad_launch_front");
    this.front.once("animationcomplete", () => this.front.setVisible(false));
  }
}
