import Phaser from "phaser";
import GameOver from "./scenes/GameOver.js";
import Main from "./scenes/Main.js";
import Pause from "./scenes/Pause.js";
import Start from "./scenes/Start.js";
const game = new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth * 0.9,
	height: window.innerHeight * 0.9,
	pixelArt: true,
	parent: "app",
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 0},
			debug: false,
		},
	},
	scene: [Start, Main, GameOver, Pause],
});

window.addEventListener("resize", (event) => {
	console.log("Resizing");
	game.scale.resize(window.innerWidth * 0.9, window.innerHeight * 0.9);
});

for (let i = 0; i < 3; i++) {
	const img = document.createElement("img");
	img.src = "assets/player-dead.png";
	document.getElementById("lives").appendChild(img);
}
