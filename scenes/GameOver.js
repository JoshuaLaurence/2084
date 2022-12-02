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
		const screenCenterX =
			this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY =
			this.cameras.main.worldView.y + this.cameras.main.height / 2;

		if (this.lives === 0) {
			this.add
				.text(screenCenterX, screenCenterY - 200, "Game Over", {
					fontFamily: "GameFont",
					color: "#ff455e",
				})
				.setScale(5)
				.setResolution(3)
				.setOrigin(0.5, 0.5);
		} else {
			this.add
				.text(screenCenterX, screenCenterY - 200, `${this.lives} lives remaining`, {
					fontFamily: "GameFont",
				})
				.setScale(5)
				.setResolution(3)
				.setOrigin(0.5, 0.5);
		}

		this.restartButton = new Button(
			screenCenterX,
			screenCenterY + 200,
			"Retry",
			this,
			() => {
				if (this.lives === 0) {
					this.scene.stop("Main");
					document.getElementsByClassName("currentScore")[0].innerText = "SCORE: 0";
					resetLives();
					this.scene.start("start", {musicPlaying: true});
				} else this.scene.start("Main", {playerDead: false, fromStart: false});
			},
			3
		);

		if (this.lives === 0) {
			this.restartButton = "Restart";
		}

		this.input.keyboard.on("keydown-" + "R", (event) => {
			if (this.lives === 0) {
				this.scene.stop("Main");
				this.scene.start("start", {musicPlaying: true});
			} else this.scene.start("Main", {playerDead: false, fromStart: false});
		});
	}

	update() {}
}
