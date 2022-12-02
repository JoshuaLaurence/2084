import Phaser from "phaser";

class Bullet extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, direction) {
		super(scene, x, y, "bullet");
	}

	fire(x, y, direction) {
		this.body.reset(x, y);

		this.setActive(true);
		this.setVisible(true);

		switch (direction) {
			case "up":
				this.setVelocityY(-750);
				break;
			case "down":
				this.setVelocityY(750);
				break;
			case "left":
				this.setVelocityX(-750);
				this.angle -= 90;
				break;
			case "right":
				this.angle += 90;
				this.setVelocityX(750);
				break;
			case "up-right":
				this.setVelocityY(-750);
				this.setVelocityX(750);
				this.angle += 45;
				break;
			case "down-right":
				this.setVelocityX(750);
				this.angle -= 45;
				this.setVelocityY(750);
				break;
			case "up-left":
				this.setVelocityX(-750);
				this.setVelocityY(-750);
				this.angle -= 45;
				break;
			case "down-left":
				this.setVelocityY(750);
				this.angle += 45;
				this.setVelocityX(-750);
				break;
		}
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		if (!this.scene.cameras.main.worldView.contains(this.x, this.y)) {
			console.log("deleted");
			this.destroy();
		}
	}
}

class Bullets extends Phaser.Physics.Arcade.Group {
	constructor(scene) {
		super(scene.physics.world, scene);

		this.createMultiple({
			frameQuantity: 200,
			key: "bullet",
			active: false,
			visible: false,
			classType: Bullet,
			"setScale.x": 0.3,
			"setScale.y": 0.3,
		});
	}

	getOppositeDirection(direction) {
		switch (direction) {
			case "up":
				return "down";
				break;
			case "down":
				return "up";
				break;
			case "left":
				return "right";
				break;
			case "right":
				return "left";
				break;
			case "up-right":
				return "down-left";
				break;
			case "down-right":
				return "up-left";
				break;
			case "up-left":
				return "down-right";
				break;
			case "down-left":
				return "up-right";
				break;
		}
	}

	fireBullet(x, y, direction, weaponType) {
		let bullet = this.getFirstDead(false);

		if (bullet) {
			bullet.fire(x, y, direction, weaponType);
			if (weaponType === "double-shot") {
				this.fireBullet(x, y, this.getOppositeDirection(direction), "normal");
			}
		}
	}
}

export default class Main extends Phaser.Scene {
	constructor() {
		super("Main");

		this.player;
		this.playerFire;
		this.playerBullets;
		this.playerBulletDirection = "down";
		this.enemy;
		this.robotEnemies;
		this.collectableInfo;
		this.playerDead = false;
		//this.cursor;
		this.keyW;
		this.lives = 3;
		this.previousLiveScore = 0;
		this.extraLife;
		this.highScore = localStorage.getItem("high-score-2084");
		this.keyA;
		this.keyS;
		this.keyD;
		this.fire;
		this.playerFiring;
		this.robotDeath;
		this.playerDeath;
		this.wave = 1;
		this.wonWave = false;
		this.weapon;
		this.waveMessage;
		this.theScore = 0;
		this.lastFired = 0;
		this.pauseButton;

		this.weaponType = "normal";
		this.deathParticles;

		//this.hasGrenades;

		this.currentScore = document.getElementsByClassName("currentScore")[0];
		this.bigScoreDisplay = document.getElementById("scoreAdditions");
		this.livesBar = document.getElementById("lives");
		this.previousScoreTimeouts = [];

		this.alreadyCollected = 0;
		this.alreadyCollectedThisRound = 0;
		this.deathBlocks;
	}

	init(data) {
		this.playerDead = data.playerDead;
		this.highScore = localStorage.getItem("high-score-2084");
		if (data.fromStart) {
			this.wave = 1;
			this.lives = 3;
			this.theScore = 0;
		}
	}

	preload() {
		//Set up code and loading assets goes here
		this.load.spritesheet("player-idle", "./assets/player-idle.png", {
			frameWidth: 7,
			frameHeight: 12,
		});
		this.load.spritesheet("player-up", "./assets/player-up.png", {
			frameWidth: 7,
			frameHeight: 12,
		});
		this.load.spritesheet("player-down", "./assets/player-down.png", {
			frameWidth: 7,
			frameHeight: 12,
		});
		this.load.spritesheet("player-left", "./assets/player-left.png", {
			frameWidth: 5,
			frameHeight: 12,
		});
		this.load.spritesheet("player-right", "./assets/player-right.png", {
			frameWidth: 5,
			frameHeight: 12,
		});
		this.load.spritesheet("mainRobots", "./assets/mainRobots.png", {
			frameWidth: 10,
			frameHeight: 13,
		});
		this.load.image("bullet", "./assets/playerBullet.png");
		this.load.image("background", "./assets/background.jpg");

		this.load.audio("pickupCollectable", "assets/pickupCollectable.wav");
		this.load.audio("player-firing", "assets/playerShoots.wav");
		this.load.audio("playerDeath", "assets/playerDeath.wav");
		this.load.audio("robotDeath", "assets/robotDeath.wav");
		this.load.audio("extraLife", "assets/extraLife.wav");
		this.load.audio("powerUp", "assets/powerUp.wav");

		this.load.image("collectable", "assets/collectable.png");
		this.load.image("deathCube", "./assets/deathCube.png");
		this.load.image("deathParticle", "./assets/deathParticle.png");
	}

	create() {
		//Creating objects for the game and setting up game logic goes here

		//Adding Test Background
		// var background = this.add.image(800, 600, "background");
		// background.setOrigin(0.5, 0.5).setDisplaySize(1200, 900);

		//Setting the world bounds
		this.physics.world.setBounds(0, 0, 1600, 1200);
		this.waveMessage = this.add
			.text(this.game.scale.width / 2, this.game.scale.height / 2, "Wave 1", {
				fontFamily: "GameFont",
			})
			.setOrigin(0.5, 0.5)
			.setResolution(100);
		this.waveMessage.setRotation(-100);
		this.waveMessage.setScale(2000);
		this.waveMessage.alpha = 0;

		//Player Declaration
		this.player = this.physics.add.sprite(600, 450, "player-idle");
		this.player.setScale(3.8);
		this.player.setCollideWorldBounds(true);

		this.playerBullets = new Bullets(this);

		//Enemy Declaration
		this.robotEnemies = this.physics.add.group();
		this.deathBlocks = this.physics.add.group();

		this.collectableInfo = this.physics.add.group();

		for (let i = 0; i < 20 + 15 * (this.wave - 1); i++) {
			const enemyCoOrds = this.generateRandomCoOrds();
			const enemy = this.robotEnemies.create(
				enemyCoOrds[0],
				enemyCoOrds[1],
				"mainRobots"
			);
			enemy.setScale(3.8);
			enemy.setCollideWorldBounds(true);
			this.physics.add.existing(enemy);
		}
		this.add.rectangle;

		for (let g = 0; g < 5 - this.alreadyCollected; g++) {
			const collectableCoOrds = this.generateRandomCoOrds();
			const collectable = this.collectableInfo.create(
				collectableCoOrds[0],
				collectableCoOrds[1],
				"collectable"
			);
			collectable.setScale(3.8);
			this.physics.add.existing(collectable);
		}

		for (let j = 0; j < 3 + this.wave * 2; j++) {
			const enemyCoOrds = this.generateRandomCoOrds();
			const deathblock = this.deathBlocks.create(
				enemyCoOrds[0],
				enemyCoOrds[1],
				"deathCube"
			);
			deathblock.setScale(Math.floor(Math.random() * (8 - 2 + 1) + 2));
			//deathblock.setCollideWorldBounds(true);
			this.physics.add.existing(deathblock).setImmovable();
		}

		this.playerFire = this.sound.add("player-firing");
		this.playerDeath = this.sound.add("playerDeath");
		this.robotDeath = this.sound.add("robotDeath");
		this.pickupCollectable = this.sound.add("pickupCollectable");
		this.extraLife = this.sound.add("extraLife");

		this.playerFire.volume = 0.2;
		this.playerDeath.volume = 0.5;
		this.robotDeath.volume = 0.5;

		const deathParticle = this.add.particles("deathParticle");

		this.deathParticles = deathParticle.createEmitter({
			x: 400,
			y: 300,
			speed: {min: -800, max: 800},
			angle: {min: 0, max: 360},
			scale: {start: 0.5, end: 0},
			blendMode: "SCREEN",
			lifespan: 300,
			gravityY: 800,
		});

		this.deathParticles.stop();

		this.physics.add.collider(this.robotEnemies, this.robotEnemies);

		this.physics.add.collider(this.robotEnemies, this.deathBlocks);

		this.physics.add.collider(
			this.player,
			this.collectableInfo,
			(player, collectable) => {
				this.alreadyCollected += 1;
				this.alreadyCollectedThisRound += 1;
				this.bumpUpScore("collectable");
				this.pickupCollectable.play();
				collectable.destroy();
			}
		);

		this.physics.add.collider(
			this.player,
			this.robotEnemies,
			this.playerDyingFunction,
			() => {
				return !this.playerDead;
			},
			this
		);

		this.physics.add.collider(
			this.player,
			this.deathBlocks,
			this.playerDyingFunction,
			() => {
				return !this.playerDead;
			},
			this
		);

		this.physics.add.collider(
			this.playerBullets,
			this.robotEnemies,
			(bullet, enemy) => {
				this.bumpUpScore("robot");
				this.deathParticles.setPosition(bullet.x, bullet.y);
				this.deathParticles.explode();
				this.deathParticles.explode();
				this.robotDeath.play();
				enemy.destroy();
				bullet.destroy();
			}
		);
		this.physics.add.collider(
			this.playerBullets,
			this.deathBlocks,
			(bullet, enemy) => {
				bullet.destroy();
			}
		);

		this.cursor = this.input.keyboard.createCursorKeys();

		//Making the camera zoomed in by a factor of x2
		this.cameras.main.zoom = 2;

		this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.pauseButton = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.ESC
		);

		this.anims.create({
			key: "right",
			frameRate: 9,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("player-right", {start: 0, end: 2}),
		});

		// this.anims.create({
		// 	key: "idle",
		// 	frameRate: 1,
		// 	frames: this.anims.generateFrameNumbers("player-idle"),
		// });

		this.anims.create({
			key: "robot-walk",
			frameRate: 9,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("mainRobots", {start: 0, end: 2}),
		});

		this.anims.create({
			key: "left",
			frameRate: 9,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("player-left", {start: 0, end: 2}),
		});

		this.anims.create({
			key: "up",
			frameRate: 9,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("player-up", {start: 0, end: 2}),
		});

		this.anims.create({
			key: "down",
			frameRate: 9,
			repeat: -1,
			frames: this.anims.generateFrameNumbers("player-down", {start: 0, end: 2}),
		});

		this.cameras.main.startFollow(this.player, false, 0.05, 0.05);

		// this.theScoreText = this.add.text(
		// 	this.player.x,
		// 	50,
		// 	`SCORE: ${this.theScore}`,
		// 	{
		// 		fontSize: "28px",
		// 		color: "#fff",
		// 	}
		// );

		//this.weaponType = "double-shot";
	}

	playerDyingFunction(player, enemy) {
		localStorage.setItem("high-score-2084", this.highScore);

		console.log(localStorage.getItem("high-score-2084"));
		this.playerDead = true;
		this.playerDeath.play();
		// this.player.anims.play("idle", true);
		this.player.setVelocity(0);
		this.alreadyCollectedThisRound = 0;
		this.robotEnemies.children.iterate((child) => {
			child.body.reset(child.x, child.y);
			child.anims.stop();
		});
		player.anims.stop();
		this.lives -= 1;
		this.updateLives("remove");
		this.scene.launch("game-over", {lives: this.lives});
	}

	generateRandomCoOrds() {
		const enemyY = Math.floor(Math.random() * this.physics.world.bounds.height);
		let enemyX = Math.floor(Math.random() * this.physics.world.bounds.width);
		if (this.player.y - 150 < enemyY && enemyY < this.player.y + 150) {
			const ranges = [
				{min: this.player.x + 150, max: this.physics.world.bounds.width},
				{min: 0, max: this.player.x - 150},
			];
			console.log(this);
			const range = ranges[Math.floor(Math.random() * ranges.length)];
			enemyX = Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
		}

		console.log([enemyX, enemyY]);

		return [enemyX, enemyY];
	}

	bumpUpScore(scoreType) {
		localStorage.setItem("high-score-2084", this.highScore);
		if (scoreType === "robot") {
			this.theScore += 100;
			this.currentScore.innerText = `SCORE: ${this.theScore}`;
			this.bigScoreDisplay.innerHTML = "";
			const smallScore = document.createElement("label");
			this.bigScoreDisplay.appendChild(smallScore);
			smallScore.classList.add("smallScore");
			smallScore.innerText = "+100";
			if (this.previousScoreTimeouts.length > 0) {
				clearTimeout(this.previousScoreTimeouts[0]);
				this.previousScoreTimeouts = [];
			}
			// setTimeout(() => {
			// 	smallScore.
			// }, 1200);
			const timout = setTimeout(() => {
				this.bigScoreDisplay.innerHTML = "";
			}, 1200);
			console.log(timout);
			this.previousScoreTimeouts.push(timout);
		} else if (scoreType === "collectable") {
			this.theScore += this.alreadyCollectedThisRound * 1000;
			this.currentScore.innerText = `SCORE: ${this.theScore}`;
			this.bigScoreDisplay.innerHTML = "";
			const largeScore = document.createElement("label");
			this.bigScoreDisplay.appendChild(largeScore);
			largeScore.classList.add("largeScore");
			largeScore.innerText = `+${this.alreadyCollectedThisRound * 1000}`;
			if (this.previousScoreTimeouts.length > 0) {
				clearTimeout(this.previousScoreTimeouts[0]);
				this.previousScoreTimeouts = [];
			}
			// setTimeout(() => {
			// 	smallScore.
			// }, 1200);
			const timout = setTimeout(() => {
				this.bigScoreDisplay.innerHTML = "";
			}, 1200);
			console.log(timout);
			this.previousScoreTimeouts.push(timout);
		}
	}

	updateLives(lifeType) {
		if (lifeType === "remove") {
			this.livesBar.lastChild.classList.toggle("fadeOut");
			setTimeout(() => {
				this.livesBar.removeChild(this.livesBar.lastChild);
			}, 850);
		} else if (lifeType === "add") {
			const newLife = document.createElement("img");
			newLife.src = "assets/player-dead.png";
			newLife.style.opacity = 0;
			this.livesBar.appendChild(newLife);
			setTimeout(() => {
				newLife.classList.add("fadeIn");
			}, 0);

			this.bigScoreDisplay.innerHTML = "";
			const largeScore = document.createElement("label");
			this.bigScoreDisplay.appendChild(largeScore);
			largeScore.classList.add("largeScore");
			largeScore.innerText = `+EXTRA LIFE`;
			if (this.previousScoreTimeouts.length > 0) {
				clearTimeout(this.previousScoreTimeouts[0]);
				this.previousScoreTimeouts = [];
			}
			// setTimeout(() => {
			// 	smallScore.
			// }, 1200);
			const timout = setTimeout(() => {
				this.bigScoreDisplay.innerHTML = "";
			}, 1200);
			console.log(timout);
			this.previousScoreTimeouts.push(timout);
		}
	}

	update(time, delta) {
		//Any logic that needs to update continously goes here
		//Update runs every frame of the browser
		const up = this.cursor.up.isDown || this.keyW.isDown;
		const down = this.cursor.down.isDown || this.keyS.isDown;
		const left = this.cursor.left.isDown || this.keyA.isDown;
		const right = this.cursor.right.isDown || this.keyD.isDown;

		// this.theScoreText.x = this.player.x;
		// this.theScoreText.y = this.player.y - 50;
		// this.theScoreText.text = `SCORE: ${this.theScore}`;

		console.log(this.playerBullets.children.entries.length);

		if (!this.playerDead && !this.wonWave) {
			console.log("playing");
			if (this.theScore >= this.previousLiveScore + 15000) {
				console.log("new score");
				this.lives += 1;
				this.previousLiveScore += 15000;
				this.extraLife.play();
				this.updateLives("add");
			}

			if (this.theScore >= this.highScore) {
				this.highScore = this.theScore;
				document.getElementsByClassName(
					"highScore"
				)[0].innerText = `HIGH SCORE: ${this.highScore}`;
			}

			this.robotEnemies.children.iterate((child) => {
				this.physics.moveToObject(child, this.player, 20 + 10 * (this.wave - 1));
				child.anims.play("robot-walk", true);
			});

			if (this.fire.isDown) {
				this.playerFiring = true;
				this.cameras.main.shake(100, 0.0009);
			} else {
				this.playerFiring = false;
			}

			if (this.playerFiring && !this.playerFire.isPlaying) {
				this.playerBullets.fireBullet(
					this.player.x,
					this.player.y,
					this.playerBulletDirection,
					this.weaponType
				);
				this.playerFire.play();
			} else if (!this.playerFiring && this.playerFire.isPlaying) {
				this.playerFire.stop();
			}

			if (left) {
				this.playerBulletDirection = "left";
				this.player.anims.play("left", true);
				this.player.setVelocityX(-300);
				if (up) {
					this.playerBulletDirection = "up-left";
					this.player.setVelocityY(-300);
				} else if (down) {
					this.playerBulletDirection = "down-left";
					this.player.setVelocityY(300);
				}
			} else if (up) {
				this.playerBulletDirection = "up";
				this.player.anims.play("up", true);
				this.player.setVelocityY(-300);
				if (left) {
					this.playerBulletDirection = "up-left";
					this.player.setVelocityX(-300);
				} else if (right) {
					this.playerBulletDirection = "up-right";
					this.player.setVelocityX(300);
				}
			} else if (down) {
				this.playerBulletDirection = "down";
				this.player.anims.play("down", true);
				this.player.setVelocityY(300);
				if (left) {
					this.playerBulletDirection = "down-left";
					this.player.setVelocityX(-300);
				} else if (right) {
					this.playerBulletDirection = "down-right";
					this.player.setVelocityX(300);
				}
			} else if (right) {
				this.playerBulletDirection = "right";
				this.player.setVelocityX(300);
				this.player.anims.play("right", true);
				if (up) {
					this.playerBulletDirection = "up-right";
					this.player.setVelocityY(-300);
				} else if (down) {
					this.playerBulletDirection = "down-right";
					this.player.setVelocityY(300);
				}
			} else if (this.pauseButton.isDown) {
				console.log("Paused");
				localStorage.setItem("high-score-2084", this.highScore);
				this.scene.pause();
				this.scene.launch("pause");
			} else {
				this.player.anims.stop();
				this.player.setVelocityX(0);
				this.player.setVelocityY(0);
			}

			if (this.robotEnemies.children.entries.length === 0) {
				this.wonWave = true;
				console.log("YOU WIN");
				this.player.setVelocityY(0);
				this.player.setVelocityX(0);
				this.cameras.main.zoomTo(0.005, 1000);
				this.cameras.main.rotateTo(100, 1000);
				this.waveMessage.text = `Wave ${this.wave + 1}`;
				this.add.tween({
					targets: this.waveMessage,
					duration: 1000,
					alpha: 1,
				});

				setTimeout(() => {
					this.wonWave = false;
					this.wave += 1;
					this.alreadyCollected = 0;
					this.alreadyCollectedThisRound = 0;
					this.scene.restart({playerDead: false});
				}, 2000);
			}
		}
	}
}

//TODO:
// Story Page
// - Fix Positioning
// More Robots
// Improved UI
// - Move Start Button
// - Animate GameOver
// - Move Re-Try button
// - Move Pause Button
// - Fix CSS Elements so their position is static
// Collectable particle emitter
// Two Players?
