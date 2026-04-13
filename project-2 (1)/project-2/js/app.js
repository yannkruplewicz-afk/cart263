/*
 * main entry file for RoboShop
 * p5 starts the project here
 */

"use strict";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const START_SCREEN = "menu";

let app = undefined;
let projectCanvas = undefined;

// p5 starts the project here
function setup() {
  projectCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  updateCanvasDisplaySize();

  app = new RobotShopApp();
  app.setup();
}

// p5 keeps calling draw every frame
function draw() {
  if (app !== undefined) {
    app.draw();
  }
}

// mouse clicks pass through the app here
function mousePressed() {
  if (app !== undefined) {
    app.mousePressed();
  }
}

// the displayed canvas size adjusts here for smaller screens
function updateCanvasDisplaySize() {
  if (projectCanvas === undefined) {
    return;
  }

  let displayWidth = CANVAS_WIDTH;
  const availableWidth = window.innerWidth;

  if (availableWidth < CANVAS_WIDTH) {
    displayWidth = availableWidth;
  }

  displayWidth = Math.max(240, displayWidth);

  const displayHeight = displayWidth * (CANVAS_HEIGHT / CANVAS_WIDTH);

  projectCanvas.elt.style.width = `${displayWidth}px`;
  projectCanvas.elt.style.height = `${displayHeight}px`;
}

// the displayed canvas size updates here when the window changes
function windowResized() {
  updateCanvasDisplaySize();
}
