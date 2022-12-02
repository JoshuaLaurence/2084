import Phaser from "phaser";
import Button from "./utilities/Button";

export default class Pause extends Phaser.Scene {
	constructor() {
		super("pause");

		this.resumeButton;
	}

	preload() {}

	create() {
		const screenCenterX =
			this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY =
			this.cameras.main.worldView.y + this.cameras.main.height / 2;
		this.cameras.main.setBackgroundColor("rgb(0,0,0, 0.3)");
		this.add
			.text(screenCenterX, screenCenterY - 200, "Paused", {
				fontFamily: "GameFont",
			})
			.setScale(5)
			.setResolution(3)
			.setOrigin(0.5, 0.5);

		this.restartButton = new Button(
			screenCenterX,
			screenCenterY + 200,
			"Resume",
			this,
			() => {
				this.scene.stop();
				this.scene.resume("Main", {playerDead: false, fromStart: false});
			},
			3
		);
	}

	update() {}
}
