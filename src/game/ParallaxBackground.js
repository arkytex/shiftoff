// key, horizontal factor, vertical factor, drift (px/s), tiles vertically?
const LAYERS = [
  ["layer0_sky_gradient", 0.05, 0.12, 0, false],
  ["layer0_stars_far", 0.04, 0.05, 0, true],
  ["layer0_stars_near", 0.09, 0.11, 0, true],
  ["layer1_clouds_far", 0.2, 0.3, 3, false],
  ["layer1b_clouds_mid", 0.35, 0.5, 5, false],
  ["layer2_clouds_near", 0.55, 0.75, 8, false],
  ["layer3_ground", 1.0, 1.0, 0, false],
];

export class ParallaxBackground {
  constructor(scene, depth = -100) {
    this.layers = [];

    LAYERS.forEach(([key, fx, fy, drift, tileY], i) => {
      const texH = scene.textures.get(key).getSourceImage().height;
      const sprite = scene.add
        .tileSprite(0, 0, 1, 1, key)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(depth + i);

      this.layers.push({ sprite, fx, fy, drift, tileY, texH, baseY: 0 });
    });

    this.layout(scene.scale.width, scene.scale.height);

    // refit every layer when the window changes size
    const onResize = (gameSize) => this.layout(gameSize.width, gameSize.height);
    scene.scale.on("resize", onResize);
    scene.events.once("shutdown", () => scene.scale.off("resize", onResize));
  }

  layout(width, height) {
    for (const l of this.layers) {
      // Star tiles fill the whole screen and repeat forever.
      // Everything else is only as tall as its image and sits on the bottom edge.
      const h = l.tileY ? height : l.texH;
      l.baseY = l.tileY ? 0 : height - l.texH;
      l.sprite.setSize(width, h);
      l.sprite.y = l.baseY;
    }
  }

  /** camX: px moved right from the start. camY: px climbed (positive = higher). */
  update(camX, camY, timeSec) {
    for (const l of this.layers) {
      l.sprite.tilePositionX = Math.round(camX * l.fx + timeSec * l.drift);
      if (l.tileY) {
        l.sprite.tilePositionY = Math.round(-camY * l.fy);
      } else {
        l.sprite.y = l.baseY + Math.round(camY * l.fy);
      }
    }
  }
}
