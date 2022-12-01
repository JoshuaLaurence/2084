export default function resetLives() {
	const livesBar = document.getElementById("lives");
	const life = document.createElement("img");
	life.src = "assets/player-dead.png";
	livesBar.appendChild(life);
	livesBar.appendChild(life);
	livesBar.appendChild(life);
}
