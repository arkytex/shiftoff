import { Scene } from "phaser";
import { ParallaxBackground } from "../ParallaxBackground.js";
import { Launchpad } from "../Launchpad.js";
import { Searchlights } from "../Searchlights.js";
import { addPanel, addText } from "../UI.js";
import { loadHighScore, hasSeenIntro, markIntroSeen } from "../highScore.js";
import { isTouchDevice } from "../device.js";

// rocket sprite: 48x101, centre of mass at (24, 62) — same placement as the Game scene
const ROCKET_PIVOT_Y = 62 / 101;
const PIVOT_TO_NOZZLE = 101 - 62;

// layout follows ui/mock_start.png
const MARGIN = 8;

// mission briefing, shown over the menu the first time this browser loads the game
const INTRO_W = 240;
const INTRO_PAD = 10;
const INTRO = [
  "You're the astronaut on ShiftX's revolutionary new rocket, bound for Mars.",
  "To save money, it's been stripped down to the bare minimum it needs for the mission.",
  "The Shift keys.",
];
const ORANGE = 0xff6a3d;

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.bg = new ParallaxBackground(this);

    this.lights = new Searchlights(this);

    // the rocket waiting on the pad, exactly where the Game scene starts it
    this.pad = new Launchpad(this, 0, 0);
    this.rocket = this.add
      .image(0, 0, "shiftx_assembled")
      .setOrigin(0.5, ROCKET_PIVOT_Y);

    this.logo = this.add.sprite(0, 0, "ui_start_logo_animated").setOrigin(0).play("ui_start_logo_animated");
    this.tagline = addText(this, 0, 0, "shiftx_body_outline", "Two buttons. It's not rocket science.");
    this.clickIcon = this.add.sprite(0, 0, "ui_kit_click_icon").setOrigin(0).play("ui_kit_click_icon");
    this.prompt = addText(this, 0, 0, "shiftx_body_outline", isTouchDevice() ? "Tap to launch" : "Click or press Shift to launch");
    this.controls = this.add.image(0, 0, "ui_start_controls_card").setOrigin(0);

    // best altitude, right-aligned in the plate's number slot (x 40..98, y 4)
    this.bestPlate = this.add.image(0, 0, "ui_start_best_score_plate").setOrigin(0);
    this.bestText = addText(
      this,
      0,
      0,
      "shiftx_body_outline",
      `${loadHighScore().toLocaleString("en-US")}m`,
    );

    // keep everything placed and the pad on the ground when the window changes size
    const place = () => {
      const { width, height } = this.scale;
      const cx = Math.round(width / 2);

      this.pad.moveTo(cx, height);
      this.rocket.setPosition(cx, this.pad.nozzleY - PIVOT_TO_NOZZLE);
      this.lights.placeAt(this.pad);

      this.logo.setPosition(Math.round(cx - this.logo.width / 2), MARGIN + 4);
      const tagY = this.logo.y + this.logo.height + 4;
      this.tagline.setPosition(Math.round(cx - this.tagline.width / 2), tagY);

      const rowY = tagY + this.tagline.height + 10;
      const rowW = this.clickIcon.width + 4 + this.prompt.width;
      const rowX = Math.round(cx - rowW / 2);
      this.clickIcon.setPosition(rowX, rowY);
      this.prompt.setPosition(
        rowX + this.clickIcon.width + 4,
        Math.round(rowY + (this.clickIcon.height - this.prompt.height) / 2),
      );

      this.controls.setPosition(MARGIN, rowY + this.clickIcon.height + 8);
      this.bestPlate.setPosition(width - MARGIN - this.bestPlate.width, MARGIN);
      this.bestText.setPosition(this.bestPlate.x + 98 - this.bestText.width, this.bestPlate.y + 4);
    };
    place();
    this.scale.on("resize", place);
    this.events.once("shutdown", () => this.scale.off("resize", place));

    // click or either shift key launches straight away
    const armLaunch = () => {
      const launch = () => this.scene.start("Game");
      this.input.once("pointerdown", launch);
      this.input.keyboard.once("keydown-SHIFT", launch);
    };
    if (hasSeenIntro()) armLaunch();
    else this.showIntro(armLaunch);
  }

  // Briefing panel over a dim layer. Any click or Shift closes it; the launch controls only
  // start listening a moment later, so the same press doesn't also launch.
  showIntro(onClose) {
    const { width, height } = this.scale;
    const w = Math.min(INTRO_W, width - 2 * MARGIN);
    const textW = w - 2 * INTRO_PAD;
    const dim = this.add.rectangle(0, 0, width, height, 0x0b0a18, 0.7).setOrigin(0).setDepth(50);

    const lines = INTRO.map((line, i) => {
      const last = i === INTRO.length - 1;
      return addText(this, 0, 0, "shiftx_body_outline", line, last ? { tint: ORANGE } : {}).setMaxWidth(textW);
    });
    const prompt = addText(this, 0, 0, "shiftx_small_outline",
      isTouchDevice() ? "TAP TO CONTINUE" : "CLICK OR PRESS SHIFT TO CONTINUE");
    const h = INTRO_PAD * 2 + lines.reduce((sum, t) => sum + t.height + 6, 0) + prompt.height + 4;

    const x = Math.round((width - w) / 2);
    const y = Math.round((height - h) / 2);
    const panel = addPanel(this, "ui_kit_panel_night", x, y, w, h).setOrigin(0).setDepth(51);
    let ty = y + INTRO_PAD;
    for (const t of lines) {
      t.setPosition(x + INTRO_PAD, ty).setDepth(52);
      ty += t.height + 6;
    }
    prompt.setPosition(Math.round(x + w / 2 - prompt.width / 2), ty + 4).setDepth(52);

    const close = () => {
      this.input.off("pointerdown", close);
      this.input.keyboard.off("keydown-SHIFT", close);
      markIntroSeen();
      for (const o of [dim, panel, prompt, ...lines]) o.destroy();
      this.time.delayedCall(150, onClose);
    };
    this.input.on("pointerdown", close);
    this.input.keyboard.on("keydown-SHIFT", close);
  }

  update(time) {
    this.bg.update(0, 0, time / 1000);
    this.lights.update(time);
  }
}
