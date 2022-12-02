import Phaser from "phaser";
import GameOver from "./scenes/GameOver.js";
import Main from "./scenes/Main.js";
import Pause from "./scenes/Pause.js";
import Start from "./scenes/Start.js";
import Story from "./scenes/StartingStory.js";

const highScore = localStorage.getItem("high-score-2084");
if (
	typeof highScore === undefined ||
	highScore === null ||
	highScore.length === 0
) {
	localStorage.setItem("high-score-2084", 10000);
}

document.getElementsByClassName(
	"highScore"
)[0].innerText = `HIGH SCORE: ${localStorage.getItem("high-score-2084")}`;

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
	scene: [Start, Story, Main, GameOver, Pause],
});

for (let i = 0; i < 3; i++) {
	const img = document.createElement("img");
	img.src = "assets/player-dead.png";
	document.getElementById("lives").appendChild(img);
}

window.addEventListener("resize", (event) => {
	game.scale.resize(window.innerWidth - 90, window.innerHeight - 200);
});
