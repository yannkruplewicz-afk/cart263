// Dimensions
let rectW;
let rectH;

// Rectangle positions
let r1x, r2x, r3x;
let ry = 0;

// Colors (objects ONLY for color)
let blue1, blue2, blue3;
let white;

function setup() {
    createCanvas(600, 400);

    rectW = width / 3;
    rectH = height;

    // X positions
    r1x = 0;
    r2x = rectW;
    r3x = rectW * 2;

    // Color objects
    blue1 = { r: 0, g: 0, b: 120 };
    blue2 = { r: 0, g: 0, b: 180 };
    blue3 = { r: 0, g: 0, b: 240 };

    white = { r: 255, g: 255, b: 255 };
}

function draw() {
    background(220);

    // Rectangle 1
    if (mouseX >= r1x && mouseX < r1x + rectW) {
        fill(white.r, white.g, white.b);
    } else {
        fill(blue1.r, blue1.g, blue1.b);
    }
    rect(r1x, ry, rectW, rectH);

    // Rectangle 2
    if (mouseX >= r2x && mouseX < r2x + rectW) {
        fill(white.r, white.g, white.b);
    } else {
        fill(blue2.r, blue2.g, blue2.b);
    }
    rect(r2x, ry, rectW, rectH);

    // Rectangle 3
    if (mouseX >= r3x && mouseX < r3x + rectW) {
        fill(white.r, white.g, white.b);
    } else {
        fill(blue3.r, blue3.g, blue3.b);
    }
    rect(r3x, ry, rectW, rectH);
}
