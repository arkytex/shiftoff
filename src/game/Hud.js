import { addText } from "./UI.js";
import { isTouchDevice } from "./device.js";

// In-game HUD, fixed to the screen, built from hud/ and ui/hud/ art.
// Top: L SHIFT keycap + throttle gauge in the left corner, R SHIFT + gauge in the right, balance
// meter in the middle with the UNSTABLE flasher under it. Bottom centre: altitude plate, with
// peak and best above it.

const MARGIN = 6;
const TILT_RANGE_DEG = 90; // marker hits the end of the meter at this tilt
const METER_INSET = 4; // px of frame at each end of the meter art
const RED_ZONE_DEG = 60; // past this tilt the meter and flasher go into danger mode anyway
const DANGER_TINT = 0xff5040;
const GOLD = 0xffd25c;
const ALT_SLOT_X = 73; // altitude_plate number_slot: right edge
const ALT_SLOT_Y = 3;

export class Hud {
  constructor(scene) {
    this.scene = scene;
    const fixed = (obj) => obj.setScrollFactor(0).setDepth(100);

    this.keyL = fixed(scene.add.image(0, 0, "key_lshift_up").setOrigin(0));
    this.keyR = fixed(scene.add.image(0, 0, "key_rshift_up").setOrigin(0));
    this.gaugeL = fixed(scene.add.sprite(0, 0, "ui_hud_throttle_gauge_l", 0).setOrigin(0));
    this.gaugeR = fixed(scene.add.sprite(0, 0, "ui_hud_throttle_gauge_r", 0).setOrigin(0));
    this.meter = fixed(scene.add.sprite(0, 0, "balance_meter").setOrigin(0));
    this.marker = fixed(scene.add.image(0, 0, "balance_marker"));
    this.flasher = fixed(
      scene.add.sprite(0, 0, "ui_hud_unstable_flasher").setOrigin(0).setVisible(false),
    );

    this.altPlate = fixed(scene.add.image(0, 0, "ui_hud_altitude_plate").setOrigin(0));
    this.altText = fixed(addText(scene, 0, 0, "shiftx_body_outline", "0"));
    this.bestText = fixed(addText(scene, 0, 0, "shiftx_small_outline", "", { tint: GOLD }));
    this.inDanger = false;
    // on touch the big on-screen buttons show the shift state, so drop the small keycaps
    this.showKeys = !isTouchDevice();
    this.keyL.setVisible(this.showKeys);
    this.keyR.setVisible(this.showKeys);

    this.layout(scene.scale);
    scene.scale.on("resize", this.layout, this);
    scene.events.once("shutdown", () => scene.scale.off("resize", this.layout, this));
  }

  layout({ width, height }) {
    const cx = Math.round(width / 2);

    this.keyL.setPosition(MARGIN, MARGIN);
    this.keyR.setPosition(width - MARGIN - this.keyR.width, MARGIN);
    const gaugeY = this.showKeys ? MARGIN + this.keyL.height + 3 : MARGIN;
    this.gaugeL.setPosition(MARGIN, gaugeY);
    this.gaugeR.setPosition(width - MARGIN - this.gaugeR.width, gaugeY);

    this.meter.setPosition(Math.round(cx - this.meter.width / 2), MARGIN + 3);
    this.marker.setY(this.meter.y + Math.round(this.meter.height / 2));
    this.flasher.setPosition(
      Math.round(cx - this.flasher.width / 2),
      this.meter.y + this.meter.height + 4,
    );

    this.altPlate.setPosition(
      Math.round(cx - this.altPlate.width / 2),
      height - MARGIN - this.altPlate.height,
    );
    this.placeNumbers();
  }

  // bitmap text widths change with the number, so these are re-placed whenever the text changes
  placeNumbers() {
    this.altText.setPosition(
      this.altPlate.x + ALT_SLOT_X - this.altText.width,
      this.altPlate.y + ALT_SLOT_Y,
    );
    this.bestText.setPosition(
      Math.round(this.altPlate.x + this.altPlate.width / 2 - this.bestText.width / 2),
      this.altPlate.y - this.bestText.height - 3,
    );
  }

  /** s: { tL, tR, leftDown, rightDown, theta, danger (0..1), altM, peakM, best, time } */
  update(s) {
    this.keyL.setTexture(s.leftDown ? "key_lshift_down" : "key_lshift_up");
    this.keyR.setTexture(s.rightDown ? "key_rshift_down" : "key_rshift_up");
    this.gaugeL.setFrame(Math.round(s.tL * 10));
    this.gaugeR.setFrame(Math.round(s.tR * 10));

    // tilt -> marker position along the meter (wrapped to -180..180 so spins read correctly)
    const deg = ((((s.theta * 180) / Math.PI + 180) % 360) + 360) % 360 - 180;
    const t = Math.max(-1, Math.min(1, deg / TILT_RANGE_DEG));
    const travel = this.meter.width / 2 - METER_INSET;
    this.marker.setX(Math.round(this.meter.x + this.meter.width / 2 + t * travel));

    // danger: meter swaps to its flashing version and UNSTABLE! shows
    const danger = s.danger > 0 || Math.abs(deg) > RED_ZONE_DEG;
    if (danger !== this.inDanger) {
      this.inDanger = danger;
      if (danger) {
        this.meter.play("ui_hud_balance_meter_danger");
        this.flasher.setVisible(true).play("ui_hud_unstable_flasher");
      } else {
        this.meter.stop().setTexture("balance_meter");
        this.flasher.stop().setVisible(false);
      }
    }
    // marker blinks red while the break-up meter fills, faster as it gets closer
    const blinkMs = 200 - 150 * s.danger;
    if (s.danger > 0 && Math.floor(s.time / blinkMs) % 2 === 0) {
      this.marker.setTint(DANGER_TINT);
    } else {
      this.marker.clearTint();
    }

    const fmt = (n) => Math.floor(n).toLocaleString("en-US");
    // zero-padded like an odometer: 00,412
    const alt = Math.floor(s.altM);
    const padded = String(alt).padStart(5, "0");
    const altStr = alt < 100000 ? `${padded.slice(0, -3)},${padded.slice(-3)}` : fmt(alt);
    const bestStr = `PEAK ${fmt(s.peakM)}  BEST ${fmt(Math.max(s.best, s.peakM))}`;
    if (altStr !== this.altText.text || bestStr !== this.bestText.text) {
      this.altText.setText(altStr);
      this.bestText.setText(bestStr);
      this.placeNumbers();
    }
  }

  setVisible(visible) {
    for (const o of [
      ...(this.showKeys ? [this.keyL, this.keyR] : []), this.gaugeL, this.gaugeR, this.meter, this.marker,
      this.altPlate, this.altText, this.bestText,
    ]) {
      o.setVisible(visible);
    }
    if (!visible) this.flasher.setVisible(false);
  }
}
