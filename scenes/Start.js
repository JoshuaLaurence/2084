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
		const highScore = localStorage.getItem("high-score");
		if (highScore === undefined) {
			console.log("None present");
			localStorage.setItem("high-score", 10000);
			console.log(localStorage.getItem("high-score"));
		}

		document.getElementsByClassName(
			"highScore"
		)[0].innerText = `HIGH SCORE: ${localStorage.getItem("high-score")}`;
		this.startButton = new Button(100, 100, "Start", this, () => {
			this.backgroundMusic.volume = 0.3;
			resetLives();
			this.scene.start("story");
		});

		this.rgb = {
			red: 0,
			blue: 0,
			green: 0,
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
		console.log(this.changeRGB);
		if (this.changeRGB / 1000 >= 10) {
			this.changeRGB = 0;
			this.rgb.red += 0.1;
			this.rgb.green += 0.1;
		}

		this.cameras.main.backgroundColor.setTo(
			this.rgb.red,
			this.rgb.green,
			this.rgb.blue
		);
	}
}
