/*
 * base screen class for the project
 * gives each screen shared functions
 */

"use strict";

class Screen {
  constructor(app) {
    this.app = app;
  }

  // screen setup can run here when it starts
  enter() {
  }

  // screen logic can run here later
  update() {
  }

  // each screen draws its own content here
  display() {
  }

  // screen clicks can be handled here later
  mousePressed() {
  }

  // the background style stays the same here
  displayBackground() {
    background(247, 241, 232);
  }

  // shared guide visuals can live here later
  displayFrame() {
  }
}
