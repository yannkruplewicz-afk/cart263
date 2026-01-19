let counter = 0;

let square = {
    x: 100,
    y: 100,
    w: 100,
    h: 100,
    color: { r: 255, g: 165, b: 0 },
    light: { r: 255, g: 200, b: 120 }
};

let redSquare = {
    x: 250,
    y: 100,
    w: 100,
    h: 100,
    color: { r: 200, g: 0, b: 0 },
    light: { r: 255, g: 100, b: 100 }
};

let radius = 30;
let ellipseAlpha = 20;

function setup() {
    createCanvas(600, 400);
}

function draw() {
    background(30);

    displaySquare(square);
    displaySquare(redSquare);

    let cx = width / 2;
    let cy = height / 2;

    if (counter >= 1 && counter <= 10) {
        let i = 0;
        let r = radius;
        let a = ellipseAlpha;

        while (i < counter) {
            drawCircle(cx, cy, r, a);
            r += 15;
            a += 20;
            i++;
        }
    }
}

function displaySquare(sq) {
    if (checkCollisionWithSquare(sq)) {
        fill(sq.light.r, sq.light.g, sq.light.b);
    } else {
        fill(sq.color.r, sq.color.g, sq.color.b);
    }
    rect(sq.x, sq.y, sq.w, sq.h);
}

function checkCollisionWithSquare(sq) {
    return (
        mouseX > sq.x &&
        mouseX < sq.x + sq.w &&
        mouseY > sq.y &&
        mouseY < sq.y + sq.h
    );
}

function mousePressed() {
    if (checkCollisionWithSquare(square)) {
        counter++;
    }
    if (checkCollisionWithSquare(redSquare)) {
        counter--;
    }
}

function drawCircle(x, y, r, a) {
    fill(255, 255, 255, a);
    noStroke();
    ellipse(x, y, r * 2, r * 2);
}
