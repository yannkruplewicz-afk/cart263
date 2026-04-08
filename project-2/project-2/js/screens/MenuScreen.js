"use strict";

class MenuScreen {
  constructor(app) {
    this.app = app;
    this.title = "Robot Shop";
    this.startButton = {
      width: 200,
      height: 60
    };
    this.isHovering = false;
  }

  enter() {
    // center button on screen
    this.startButton.x = width / 2 - this.startButton.width / 2;
    this.startButton.y = height / 2 - this.startButton.height / 2;
  }

  update() {
    this.isHovering = this.isMouseOverButton();
  }

  display() {
    background(180, 220, 250);

    // title
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(48);
    text(this.title, width / 2, height / 3);

    // button
    if (this.isHovering) fill(100, 200, 100);
    else fill(50, 150, 50);

    rect(
      this.startButton.x,
      this.startButton.y,
      this.startButton.width,
      this.startButton.height,
      10
    );

    // button text
    fill(255);
    textSize(24);
    text(
      "Start",
      this.startButton.x + this.startButton.width / 2,
      this.startButton.y + this.startButton.height / 2
    );
  }

  mousePressed() {
    if (this.isMouseOverButton()) {
      this.app.setScreen("questions");
    }
  }

  isMouseOverButton() {
    return (
      mouseX >= this.startButton.x &&
      mouseX <= this.startButton.x + this.startButton.width &&
      mouseY >= this.startButton.y &&
      mouseY <= this.startButton.y + this.startButton.height
    );
  }
}