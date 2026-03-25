class RectangularObj {
  constructor(x, y, w, h, f_color, s_color, context) {
    // We write instructions to set up a Flower here
    // Position and size information
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fill_color = f_color;
    this.stroke_color = s_color;
    this.startAngle = 0;
    this.endAngle = Math.PI * 2;
    this.context = context;

    // Values used for task 2
    this.baseWidth = w;
    this.baseHeight = h;
    this.middleY = y + (h / 2);
    this.micLevel = 0;
    this.displayMicLevel = 0;
    this.slideSpeed = 1;
  }

  display() {
    this.context.fillStyle = this.fill_color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.strokeStyle = this.stroke_color;
    this.context.lineWidth = 2;
    this.context.strokeRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.displayMicLevel = this.displayMicLevel + (this.micLevel - this.displayMicLevel) * 0.08;

    // gets bigger from sound input
    this.width = this.baseWidth + (this.displayMicLevel * 0.12);
    this.height = this.baseHeight + (this.displayMicLevel * 1.0);

    if (this.height > this.context.canvas.height - 10) {
      this.height = this.context.canvas.height - 10;
    }

    // rectangle centered as it gets bigger
    this.y = this.middleY - (this.height / 2);

    // from red to green
    let greenValue = parseInt(this.displayMicLevel * 2);
    if (greenValue > 255) {
      greenValue = 255;
    }

    let redValue = 255 - greenValue;
    if (redValue < 0) {
      redValue = 0;
    }

    this.fill_color = "rgb(" + redValue + "," + greenValue + ",0)";

    // slide left and right across the canvas
    this.x += this.slideSpeed;

    if (this.x <= 0) {
      this.x = 0;
      this.slideSpeed = 1;
    }

    if (this.x + this.width >= this.context.canvas.width) {
      this.x = this.context.canvas.width - this.width;
      this.slideSpeed = -1;
    }
  }
}
