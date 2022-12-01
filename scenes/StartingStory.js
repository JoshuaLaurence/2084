import Phaser from "phaser";
import Button from "./utilities/Button";

export default class Story extends Phaser.Scene {
	constructor() {
		super("story");

		this.storyContent = [
			"The year is 2084, although time is beginning to blur.",
			"You'll be sent to a rouge alien planet",
			"This place used to harbour lifeforms similar to humans back in the early 2050s",
			"Now, over the last thirty years,",
			"it has become a chaotic inferno ruled by animatronics we've named the 'Robotrons'",
			"How or why this has happened we don't know. Yet.",
			"The task is simple, gather as much information as possible,",
			"stored within these capsules",
			"",
			"And don't die trying.",
			"Return to earth with what you have and maybe,",
			"maybe we can learn from the mistakes this planet made.",
			"Ensure our planet doesn't fall into the same traps",
			"Technology now rules our lives, we just don't want it to start taking them.",
			"That is the mission",
			"Do you accept?",
			"If so, press ENTER to continue",
		];

		this.story;
		this.line = [];

		this.wordIndex = 0;
		this.lineIndex = 0;

		this.wordDelay = 120;
		this.lineDelay = 400;

		this.skip;
		this.storyOver = false;
		this.done;
	}

	preload() {}

	nextLine() {
		if (this.lineIndex === this.storyContent.length) {
			this.storyOver = true;
			return;
		}

		this.line = this.storyContent[this.lineIndex].split(" ");
		this.wordIndex = 0;
		// this.time.events.repeat(
		// 	this.wordDelay,
		// 	this.line.length,
		// 	this.nextWord,
		// 	this
		// );
		this.time.addEvent({
			delay: this.wordDelay,
			repeat: this.line.length - 1,
			callback: this.nextWord,
			callbackScope: this,
		});
		this.lineIndex++;
	}

	nextWord() {
		this.story.text = this.story.text.concat(this.line[this.wordIndex] + " ");
		this.wordIndex++;
		if (this.wordIndex === this.line.length) {
			this.story.text = this.story.text.concat("\n");
			// this.time.events.add(this.lineDelay, this.nextLine, this);
			this.time.addEvent({
				delay: this.lineDelay,
				callback: this.nextLine,
				callbackScope: this,
			});
		}
	}

	create() {
		this.story = this.add.text(0, 0, "Press BACKSPACE To Skip\n", {
			fontFamily: "Segeo UI",
			fontSize: "40px",
			color: "#ffffff",
		});

		this.skip = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.BACKSPACE
		);
		this.done = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

		this.nextLine();
	}

	update() {
		if (this.skip.isDown) {
			this.scene.stop();
			this.scene.start("Main", {playerDead: false, fromStart: false});
		}

		if (this.done.isDown && this.storyOver) {
			this.scene.stop();
			this.scene.start("Main", {playerDead: false, fromStart: false});
		}
	}
}
