export default function resetLives() {
	const livesBar = document.getElementById("lives");
	livesBar.innerHTML = "";
	for (let i = 0; i < 3; i++) {
		const life = document.createElement("img");
		life.src = "assets/player-dead.png";
		life.style.opacity = 1;
		livesBar.appendChild(life);
	}
}
