import Phaser, {Tilemaps} from "phaser";
import Button from "./utilities/Button";
import resetLives from "./utilities/ResetLives";

export default class Start extends Phaser.Scene {
	constructor() {
		super("start");

		this.startButton;
		this.background;
		this.rgb;
		this.changeRGB = 0;
		this.backgroundMusic;
		this.musicPlaying = false;
	}

	init(data) {
		this.musicPlaying = data.musicPlaying;
	}

	preload() {
		this.load.audio("titleMusic", "./assets/2084.wav");
	}

	create() {
		const screenCenterX =
			this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY =
			this.cameras.main.worldView.y + this.cameras.main.height / 2;

		this.add
			.text(screenCenterX, screenCenterY - 200, "2084", {
				fontFamily: "GameFont",
			})
			.setScale(7)
			.setResolution(3)
			.setOrigin(0.5, 0.5);
		this.startButton = new Button(
			screenCenterX,
			screenCenterY + 200,
			"Start",
			this,
			() => {
				this.backgroundMusic.volume = 0.3;
				resetLives();
				this.scene.start("story");
			},
			3
		);

		this.rgb = {
			red: 0,
			blue: 0,
			green: 0,
			redIncrease: true,
			greenIncrease: true,
			blueIncrease: true,
		};

		this.backgroundMusic = this.sound.add("titleMusic");
		this.backgroundMusic.loop = true;
		if (!this.musicPlaying) {
			this.backgroundMusic.volume = 1;
			this.backgroundMusic.play();
		}
	}

	update(time, delta) {
		this.changeRGB += time;
		if (this.changeRGB / 1000 >= 10) {
			this.changeRGB = 0;
			if (this.rgb.redIncrease) {
				this.rgb.red += 0.001;
				if (this.rgb.red >= 255) {
					this.rgb.redIncrease = false;
				}
			} else if (this.rgb.redIncrease === false) {
				this.rgb.red -= 0.001;
				if (this.rgb.red <= 1) {
					this.rgb.redIncrease = true;
				}
			}

			if (this.rgb.greenIncrease) {
				this.rgb.green += 0.01;
				if (this.rgb.green >= 255) {
					this.rgb.greenIncrease = false;
				}
			} else if (this.rgb.greenIncrease === false) {
				this.rgb.green -= 0.01;
				if (this.rgb.green <= 1) {
					this.rgb.greenIncrease = true;
				}
			}

			if (this.rgb.blueIncrease) {
				this.rgb.blue += 0.1;
				if (this.rgb.blue >= 255) {
					this.rgb.blueIncrease = false;
				}
			} else if (this.rgb.blueIncrease === false) {
				this.rgb.blue -= 0.1;
				if (this.rgb.blue <= 1) {
					this.rgb.blueIncrease = true;
				}
			}
		}

		this.cameras.main.backgroundColor.setTo(
			this.rgb.red,
			this.rgb.green,
			this.rgb.blue
		);
	}
}
