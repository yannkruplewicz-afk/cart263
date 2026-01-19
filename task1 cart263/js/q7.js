let size = 40;            // must be multiple of 5  
let cols, rows;

let r, g, b;
let swap = false;

function setup() {
    createCanvas(600, 400);
    cols = width / size;
    rows = height / size;

    r = random(255);
    g = random(255);
    b = random(255);
}

function draw() {
    background(20);
    fill(r, g, b);
    noStroke();

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let px = x * size + size / 2;
            let py = y * size + size / 2;

            let evenRow = y % 2 === 0;
            let drawCircle = evenRow;

            if (swap) {
                drawCircle = !drawCircle;
            }

            if (drawCircle) {
                ellipse(px, py, size, size);
            } else {
                rectMode(CENTER);
                rect(px, py, size, size);
            }
        }
    }
}

function mousePressed() {
    swap = !swap;
}

function keyPressed() {
    if (key === ' ') {
        r = random(255);
        g = random(255);
        b = random(255);
    }
}
