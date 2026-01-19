// Rectangle 1 variables
let r1x, r1y, r1w, r1h;
let r1r, r1g, r1b;

// Rectangle 2 variables
let r2x, r2y, r2w, r2h;
let r2r, r2g, r2b;

// Rectangle 3 variables
let r3x, r3y, r3w, r3h;
let r3r, r3g, r3b;

let speed = 2;

function setup() {
    createCanvas(400, 400);

    // Rectangle 1
    r1x = 50;
    r1y = 50;
    r1w = 60;
    r1h = 60;
    r1r = 255;
    r1g = 0;
    r1b = 0;

    // Rectangle 2
    r2x = 150;
    r2y = 50;
    r2w = 60;
    r2h = 60;
    r2r = 0;
    r2g = 255;
    r2b = 0;

    // Rectangle 3
    r3x = 250;
    r3y = 0;
    r3w = 60;
    r3h = 60;
    r3r = 0;
    r3g = 0;
    r3b = 255;
}

function draw() {
    background(220);

    // Rectangle 1
    fill(r1r, r1g, r1b);
    rect(r1x, r1y, r1w, r1h);

    // Rectangle 2
    fill(r2r, r2g, r2b);
    rect(r2x, r2y, r2w, r2h);

    // Rectangle 3 (moves every frame)
    r3y = r3y + speed;

    if (r3y > height) {
        r3y = 0;
    }

    fill(r3r, r3g, r3b);
    rect(r3x, r3y, r3w, r3h);
}

function mousePressed() {
    // Update positio
    r1x = mouseX;
    r1y = mouseY;
}

function keyPressed() {

    if (key === ' ') {
        r2x = random(width);
        r2y = random(height);
    }
}

function mouseMoved() {

    r3r = random(255);
    r3g = random(255);
    r3b = random(255);
}
