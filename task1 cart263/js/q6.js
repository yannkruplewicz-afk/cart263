let txt = {
    str: "test",
    size: 28,
    color: { r: 255, g: 255, b: 255 }
};

const offset = 20;

function setup() {
    createCanvas(600, 400);
    textSize(txt.size);
    fill(txt.color.r, txt.color.g, txt.color.b);
    textAlign(CENTER, CENTER);
}

function draw() {
    background(0);

    let cx = width / 2;
    let cy = height / 2;

    text(txt.str, cx, cy);

    for (let i = 0; i <= 9; i++) {
        let xPos = i * offset;
        text(i, xPos, 50);
    }

    for (let i = 15; i >= 1; i--) {
        let yPos = (16 - i) * offset;
        text(i, cx, yPos);
    }
}
