// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Setup canvas
  // =========================
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const context = canvas.getContext("2d");

  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Store circles
  let circles = [];

  // =========================
  // Circle Class
  // =========================
  class CircularObj {
    constructor(x, y, radius, f_color, s_color, context) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.fill_color = f_color;
      this.stroke_color = s_color;
      this.context = context;

      this.dx = Math.random() * 2 - 1;
      this.dy = Math.random() * 2 - 1;
      this.growth = 0.3;
      this.maxRadius = radius + 8;
      this.minRadius = radius - 5;
    }

    display() {
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.context.fillStyle = this.fill_color;
      this.context.fill();
      this.context.lineWidth = 2;
      this.context.strokeStyle = this.stroke_color;
      this.context.stroke();
      this.context.closePath();
    }

    update() {
      this.x += this.dx + (mouseX - this.x) * 0.03;
      this.y += this.dy + (mouseY - this.y) * 0.03;

      this.radius += this.growth;
      if (this.radius > this.maxRadius || this.radius < this.minRadius) {
        this.growth *= -1;
      }
    }
  }

  // =========================
  // Function using CircularObj
  // =========================
  function go_all_stuff() {
    circles.push(new CircularObj(mouseX, mouseY, 20, "red", "black", context));
  }

  // =========================
  // Mouse events
  // =========================
  canvas.addEventListener("click", () => {
    go_all_stuff();
  });

  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    circles.pop();
  });

  // =========================
  // Animation
  // =========================
  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
      circle.update();
      circle.display();
    });
    requestAnimationFrame(animate);
  }

  animate();

  // Handle resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});