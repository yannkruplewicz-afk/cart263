"use strict";

let app;

function setup() {
  createCanvas(960, 540);
  app = new RobotShopApp();
  app.setup();
}

function draw() {
  if (app) app.draw();
}

function mousePressed() {
  if (app !== undefined) {
    app.mousePressed();
  }
}