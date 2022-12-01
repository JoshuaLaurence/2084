import Phaser from "phaser";
import Button from "./utilities/Button";

export default class Pause extends Phaser.Scene {
	constructor() {
		super("pause");

		this.resumeButton;
	}

	preload() {}

	create() {
		this.cameras.main.setBackgroundColor("rgb(0,0,0, 0.3)");
		this.add.text(0, 0, "Paused", {fontFamily: "Game-Over"});

		this.restartButton = new Button(100, 100, "Resume", this, () => {
			this.scene.stop();
			this.scene.resume("Main", {playerDead: false, fromStart: false});
		});
	}

	update() {}
}
