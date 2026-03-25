class FreeStyleObj {
  constructor(x, y, length, f_color, s_color, context) {
    // We write instructions to set up a Flower here
    // Position and size information
    this.x = x;
    this.y = y;
    this.fill_color = f_color;
    this.stroke_color = s_color;
    this.theta = 0;
    this.length = length;
    this.yOffset = 20;
    this.angularSpeed = .07;
    this.context = context;

    // Values used for task 3
    this.baseColorGreen = 216;
    this.baseColorBlue = 230;
    this.baseWaveHeight = 1;
    this.waveHeight = 1;
    this.baseYOffset = 4;
    this.micLevel = 0;
    this.displayMicLevel = 0;
    this.waveOffset = 0;
  }

  display() {
    this.theta = this.waveOffset;
    this.context.fillStyle = this.fill_color;
    this.context.strokeStyle = this.stroke_color;
    this.context.beginPath();
    this.context.moveTo(this.x, this.y)
    for (let i = this.x; i < this.x + this.length; i++) {
      this.context.lineTo(i, (Math.sin(this.theta) * this.waveHeight) + this.y)
      this.context.lineTo(i, (Math.sin(this.theta) * this.waveHeight) + this.y + this.yOffset)
      this.theta += this.angularSpeed;
    }
    this.context.stroke();
  }

  update() {
    this.displayMicLevel = this.displayMicLevel + (this.micLevel - this.displayMicLevel) * 0.08;

    // 2 properties to change
    this.waveHeight = this.baseWaveHeight + (this.displayMicLevel * 0.12);
    this.yOffset = this.baseYOffset + (this.displayMicLevel * 0.08);

    // wave keeps moving even when the sound is quiet
    this.waveOffset += 0.04 + (this.displayMicLevel * 0.0015);

    let greenValue = this.baseColorGreen + parseInt(this.displayMicLevel * 0.25);
    if (greenValue > 255) {
      greenValue = 255;
    }

    let blueValue = this.baseColorBlue - parseInt(this.displayMicLevel * 0.9);
    if (blueValue < 0) {
      blueValue = 0;
    }

    this.fill_color = "rgb(0," + greenValue + "," + blueValue + ")";
    this.stroke_color = this.fill_color;
  }
}

