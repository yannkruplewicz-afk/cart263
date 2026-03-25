class CircularObj {
  constructor(x, y, radius, f_color, s_color, context) {
    // We write instructions to set up a Flower here
    // Position and size information
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill_color = f_color;
    this.stroke_color = s_color;
    this.startAngle = 0;
    this.endAngle = Math.PI * 2; //full rotation
    this.context = context;

    // Values used for task 1
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
    this.growth = 0.2;
    this.maxRadius = radius + 10;
    this.minRadius = radius - 5;
    this.targetX = x;
    this.targetY = y;
    this.isUserCreated = false;
  }

  display() {
    this.context.fillStyle = this.fill_color;
    this.context.strokeStyle = this.stroke_color;
    this.context.beginPath();
    this.context.arc(
      this.x,
      this.y,
      this.radius,
      this.startAngle,
      this.endAngle,
      true
    );
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.closePath();
    this.context.stroke();
  }

  update(mouseX, mouseY) {
    if (typeof mouseX === "number") {
      this.targetX = mouseX;
    }

    if (typeof mouseY === "number") {
      this.targetY = mouseY;
    }

    // move toward the mouse position
    this.x += this.dx + (this.targetX - this.x) * 0.02;
    this.y += this.dy + (this.targetY - this.y) * 0.02;

    // pulse the circle
    this.radius += this.growth;
    if (this.radius > this.maxRadius || this.radius < this.minRadius) {
      this.growth *= -1;
    }
  }
}
