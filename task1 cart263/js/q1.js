function setup() {
    createCanvas(400, 400);
    background(220);

    // Variables (reused)
    let x, y, w, h;
    let r, g, b;

    // Ellipse 1
    x = 100;
    y = 150;
    w = 80;
    h = 50;
    r = 255;
    g = 0;
    b = 0;
    fill(r, g, b);
    ellipse(x, y, w, h);

    // Ellipse 2
    x = 250;
    y = 120;
    w = 60;
    h = 90;
    r = 0;
    g = 255;
    b = 0;
    fill(r, g, b);
    ellipse(x, y, w, h);

    // Ellipse 3
    x = 200;
    y = 280;
    w = 120;
    h = 40;
    r = 0;
    g = 0;
    b = 255;
    fill(r, g, b);
    ellipse(x, y, w, h);
}
