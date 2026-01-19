function setup() {
    createCanvas(400, 400);
    background(220);

    drawEllipse(100, 150, 80, 50, 255, 0, 0);
    drawEllipse(250, 120, 60, 90, 0, 255, 0);
    drawEllipse(200, 280, 120, 40, 0, 0, 255);
}

function drawEllipse(x, y, w, h, r, g, b) {
    fill(r, g, b);
    ellipse(x, y, w, h);
}
