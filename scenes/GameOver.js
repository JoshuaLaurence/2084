import Phaser from "phaser";
import Button from "./utilities/Button";
import resetLives from "./utilities/ResetLives";

export default class GameOver extends Phaser.Scene {
	constructor() {
		super("game-over");

		this.restartButton;
		this.lives;
	}

	init(data) {
		this.lives = data.lives;
	}

	preload() {}

	create() {
		this.cameras.main.setBackgroundColor("rgb(0,0,0, 0.3)");
		this.add.text(0, 0, "Game Over", {fontFamily: "Game-Over"});
		this.add.text(150, 100, `${this.lives} lives remaining`);

		this.restartButton = new Button(100, 100, "Restart", this, () => {
			if (this.lives === 0) {
				this.scene.stop("Main");
				document.getElementsByClassName("currentScore")[0].innerText = "SCORE: 0";
				resetLives();
				this.scene.start("start", {musicPlaying: true});
			} else this.scene.start("Main", {playerDead: false, fromStart: false});
		});

		this.input.keyboard.on("keydown-" + "R", (event) => {
			if (this.lives === 0) {
				this.scene.stop("Main");
				this.scene.start("start", {musicPlaying: true});
			} else this.scene.start("Main", {playerDead: false, fromStart: false});
		});
	}

	update() {}
}
