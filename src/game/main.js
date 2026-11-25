import { AUTO, Game, Scale } from "phaser";
import { Boot } from "./scenes/Boot.js";
import { Preloader } from "./scenes/Preloader.js";
import { MainMenu } from "./scenes/MainMenu.js";
import { Game as MainGame } from "./scenes/Game.js";
import { GameOver } from "./scenes/GameOver.js";

export const ART_HEIGHT = 270;
const MIN_VIEW_HEIGHT = ART_HEIGHT * 1.5;

function fitToWindow() {
  const zoom = Math.max(1, Math.floor(window.innerHeight / MIN_VIEW_HEIGHT));
  return {
    width: Math.ceil(window.innerWidth / zoom),
    height: Math.ceil(window.innerHeight / zoom),
    zoom,
  };
}

const config = {
  type: AUTO,
  ...fitToWindow(),
  backgroundColor: "#2a275c", // top colour of the sky gradient, shown above it
  pixelArt: true,
  // mouse + up to 3 fingers, so both on-screen shift buttons can be held at once
  input: { activePointers: 3 },
  roundPixels: true,
  // NONE + integer zoom: we size the game ourselves, so Phaser must not rescale the canvas.
  scale: { mode: Scale.NONE, autoCenter: Scale.CENTER_BOTH },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

const StartGame = (parent) => {
  const game = new Game({ ...config, parent });
  window.addEventListener("resize", () => {
    const { width, height, zoom } = fitToWindow();
    game.scale.setGameSize(width, height);
    game.scale.setZoom(zoom);
  });
  return game;
};

export default StartGame;
