// Two searchlights either side of the launch pad, sweeping out of phase. Used by the menu and
// the Game scene so the pad looks the same in both. World-space: they scroll away as you climb.

const SWING_DEG = 22; // beams sweep ±this much
const SPEED = 0.6; // radians per second of the sweep
const LAMP_GAP = 26; // px between the launch deck edge and each lamp
const LAMP_H = 14; // lamp art height; the beam starts at beam_origin_in_lamp (6, 2)
const BEAM_FROM_TOP = 2;

export class Searchlights {
  constructor(scene) {
    this.lights = [0, 1].map((i) => ({
      beam: scene.add
        .image(0, 0, "ui_start_searchlight_beam")
        .setOrigin(0.5, 1)
        .setBlendMode("ADD")
        .setDepth(-20),
      lamp: scene.add
        .image(0, 0, "ui_start_searchlight_lamp")
        .setOrigin(0.5, 1)
        .setDepth(-9),
      phase: i * Math.PI,
    }));
  }

  /** Stand the lamps on the ground just outside the pad's deck. */
  placeAt(pad) {
    const xs = [pad.deckLeft - LAMP_GAP, pad.deckRight + LAMP_GAP];
    this.lights.forEach((l, i) => {
      const x = Math.round(xs[i]);
      l.lamp.setPosition(x, pad.groundLineY);
      l.beam.setPosition(x, pad.groundLineY - LAMP_H + BEAM_FROM_TOP);
    });
  }

  update(time) {
    const t = time / 1000;
    for (const l of this.lights) {
      l.beam.setAngle(Math.sin(t * SPEED + l.phase) * SWING_DEG);
    }
  }
}
