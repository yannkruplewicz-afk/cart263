class VideoObj {
  constructor(x, y, w, h, videoElement, context) {
    this.videoElement = videoElement;
    this.context = context;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.shapeX = 10;
    this.shapeY = 10;
    this.shapeCol = "#000000";
    this.userProvidedBlur = 0;
    this.userProvidedSepia = 0;
    this.userProvidedHue = 0;
    this.userProvidedInvert = 0;
    let self = this;

    let filterButton_blur = document.getElementById("filter_button_blur");
    let blurInput = document.getElementById("blurnum");
    let filterButton_sepia = document.getElementById("filter_button_sepia");
    let sepiaInput = document.getElementById("sepianum");
    let filterButton_hue = document.getElementById("filter_button_hue");
    let hueInput = document.getElementById("huenum");
    let filterButton_invert = document.getElementById("filter_button_invert");
    let invertInput = document.getElementById("invertnum");

    function readNumericValue(inputElement, minValue, maxValue) {
      let value = parseInt(inputElement.value);

      if (isNaN(value)) {
        value = 0;
      }

      if (value < minValue) {
        value = minValue;
      }

      if (value > maxValue) {
        value = maxValue;
      }

      return value;
    }

    if (filterButton_blur && blurInput) {
      filterButton_blur.addEventListener("click", function () {
        self.userProvidedBlur = readNumericValue(blurInput, 0, 8);
        console.log("Blur:", self.userProvidedBlur);
      });
    }

    if (filterButton_sepia && sepiaInput) {
      filterButton_sepia.addEventListener("click", function () {
        self.userProvidedSepia = readNumericValue(sepiaInput, 0, 100);
        console.log("Sepia:", self.userProvidedSepia);
      });
    }

    if (filterButton_hue && hueInput) {
      filterButton_hue.addEventListener("click", function () {
        self.userProvidedHue = readNumericValue(hueInput, 0, 360);
        console.log("Hue:", self.userProvidedHue);
      });
    }

    if (filterButton_invert && invertInput) {
      filterButton_invert.addEventListener("click", function () {
        self.userProvidedInvert = readNumericValue(invertInput, 0, 100);
        console.log("Invert:", self.userProvidedInvert);
      });
    }
  }

  display() {
    this.context.save();
    this.context.filter =
      `blur(${this.userProvidedBlur}px) ` +
      `sepia(${this.userProvidedSepia}%) ` +
      `hue-rotate(${this.userProvidedHue}deg) ` +
      `invert(${this.userProvidedInvert}%)`;
    this.context.drawImage(this.videoElement, this.x, this.y, this.w, this.h);
    this.context.fillStyle = this.shapeCol;
    this.context.fillRect(this.shapeX, this.shapeY, 50, 50);
    this.context.restore();
  }

  //called when rectangle color is to be updated
  changeColor(newCol) {
    this.shapeCol = newCol;
  }

  //called when rectangle Pos is to be updated
  updatePositionRect(mx, my) {
    let nextX = mx - 25;
    let nextY = my - 25;
    let maxX = this.context.canvas.width - 50;
    let maxY = this.context.canvas.height - 50;

    if (nextX < 0) {
      nextX = 0;
    }

    if (nextY < 0) {
      nextY = 0;
    }

    if (nextX > maxX) {
      nextX = maxX;
    }

    if (nextY > maxY) {
      nextY = maxY;
    }

    this.shapeX = nextX;
    this.shapeY = nextY;
  }

  update(videoElement) {
    this.videoElement = videoElement;
  }
}
