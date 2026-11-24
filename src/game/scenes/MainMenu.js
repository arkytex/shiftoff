import { Scene } from "phaser";
import { ParallaxBackground } from "../ParallaxBackground.js";
import { Launchpad } from "../Launchpad.js";
import { Searchlights } from "../Searchlights.js";
import { addText } from "../UI.js";
import { loadHighScore } from "../highScore.js";

// rocket sprite: 48x101, centre of mass at (24, 62) — same placement as the Game scene
const ROCKET_PIVOT_Y = 62 / 101;
const PIVOT_TO_NOZZLE = 101 - 62;

// layout follows ui/mock_start.png
const MARGIN = 8;

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
    this.tagline = this.add.image(0, 0, "ui_start_tagline").setOrigin(0);
    this.clickIcon = this.add.sprite(0, 0, "ui_kit_click_icon").setOrigin(0).play("ui_kit_click_icon");
    this.prompt = addText(this, 0, 0, "shiftx_body_outline", "Click or press Shift to launch");
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
    const launch = () => this.scene.start("Game");
    this.input.once("pointerdown", launch);
    this.input.keyboard.once("keydown-SHIFT", launch);
  }

  update(time) {
    this.bg.update(0, 0, time / 1000);
    this.lights.update(time);
  }
}
