import Phaser from "phaser";

export default class Button {
	constructor(x, y, label, scene, callback, scale) {
		const button = scene.add
			.text(x, y, label, {fontFamily: "GameFont"})
			.setOrigin(0.5)
			.setPadding(10)
			.setScale(scale)
			.setResolution(scale / 1.5)
			.setStyle({backgroundColor: "#111"})
			.setInteractive({useHandCursor: true})
			.on("pointerdown", () => callback())
			.on("pointerover", () => button.setStyle({fill: "#f39c12"}))
			.on("pointerout", () => button.setStyle({fill: "#FFF"}));
	}
}
