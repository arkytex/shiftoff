// On-screen L / R SHIFT buttons for touch devices, in the bottom-left and bottom-right corners.
// Each button tracks the fingers on it, so holding both at once works and sliding a finger off
// a button releases it.

const MARGIN = 6;
const KEY_W = 35; // hud/key_*shift art
const HIT_PAD = 12; // extra px around each button that still counts as a press

export class TouchControls {
  constructor(scene) {
    this.scene = scene;
    this.buttons = ["l", "r"].map((side) => {
      const image = scene.add
        .image(0, 0, `key_${side}shift_up`)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(100);
      const zone = scene.add
        .zone(0, 0, 1, 1)
        .setOrigin(0)
        .setScrollFactor(0)
        .setInteractive();
      const button = { side, image, zone, pointers: new Set() };
      const press = (p) => this.set(button, p.id, true);
      const release = (p) => this.set(button, p.id, false);
      zone.on("pointerdown", press);
      zone.on("pointerover", (p) => p.isDown && press(p)); // finger slid onto the button
      zone.on("pointerup", release);
      zone.on("pointerout", release);
      return button;
    });
    // a finger lifted anywhere (even off the canvas) lets go of whatever it held
    const releaseAll = (p) => this.buttons.forEach((b) => this.set(b, p.id, false));
    scene.input.on("pointerup", releaseAll);
    scene.input.on("pointerupoutside", releaseAll);

    this.layout(scene.scale);
    scene.scale.on("resize", this.layout, this);
    scene.events.once("shutdown", () => scene.scale.off("resize", this.layout, this));
  }

  get leftDown() {
    return this.buttons[0].pointers.size > 0;
  }

  get rightDown() {
    return this.buttons[1].pointers.size > 0;
  }

  set(button, id, down) {
    if (down) button.pointers.add(id);
    else button.pointers.delete(id);
    button.image.setTexture(`key_${button.side}shift_${button.pointers.size ? "down" : "up"}`);
  }

  layout({ width, height }) {
    // whole-pixel scale, as big as fits beside the altitude plate (84px) in the bottom centre
    const scale = Math.max(2, Math.min(4, Math.floor((width - 84 - 8 * MARGIN) / 2 / KEY_W)));
    for (const b of this.buttons) {
      b.image.setScale(scale);
      const w = b.image.displayWidth;
      const h = b.image.displayHeight;
      const x = b.side === "l" ? MARGIN : width - MARGIN - w;
      const y = height - MARGIN - h;
      b.image.setPosition(x, y);
      // setSize resizes the zone's hit area too
      b.zone.setPosition(x - HIT_PAD, y - HIT_PAD).setSize(w + HIT_PAD * 2, h + HIT_PAD * 2);
    }
  }

  setVisible(visible) {
    for (const b of this.buttons) {
      b.image.setVisible(visible);
      if (visible) b.zone.setInteractive();
      else {
        b.zone.disableInteractive();
        b.pointers.clear();
      }
    }
  }
}
