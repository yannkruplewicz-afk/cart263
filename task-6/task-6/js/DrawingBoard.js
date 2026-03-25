class DrawingBoard {
  /* Constructor */
  constructor(canvas, context,drawingBoardId) {
    this.canvas = canvas;
    this.context = context;
    this.objectsOnCanvas = [];
    let self = this;
    this.drawingBoardId = drawingBoardId;
    //each element has a mouse clicked and a mouse over
    this.canvas.addEventListener("click", function (e) {
      self.clickCanvas(e);
    });

    this.canvas.addEventListener("mousemove", function (e) {
      self.overCanvas(e);
    });

    this.canvas.addEventListener("contextmenu", function (e) {
      self.rightClickCanvas(e);
    });
  }

  overCanvas(e) {
    //console.log("over");
    this.canvasBoundingRegion = this.canvas.getBoundingClientRect();
    this.mouseOffsetX = parseInt(e.clientX - this.canvasBoundingRegion.x);
    this.mouseOffsetY = parseInt(e.clientY - this.canvasBoundingRegion.y);
    console.log(this.mouseOffsetX, this.mouseOffsetY);
    //differentiate which canvas
    //you can remove the console.logs /// 
    if(this.drawingBoardId ==="partA"){
      console.log("in A")
    }
    if(this.drawingBoardId ==="partB"){
      console.log("in B")
    }
    if(this.drawingBoardId ==="partC"){
      console.log("in C")
    }
    if(this.drawingBoardId ==="partD"){
      console.log("in D")
      for (let i = 0; i < this.objectsOnCanvas.length; i++) {
        let currentObj = this.objectsOnCanvas[i];

        if (typeof currentObj.updatePositionRect === "function") {
          currentObj.updatePositionRect(this.mouseOffsetX, this.mouseOffsetY);
        }
      }
   }
  }

  clickCanvas(e) {
   // console.log("clicked");
    this.canvasBoundingRegion = this.canvas.getBoundingClientRect();
    this.mouseOffsetX = parseInt(e.clientX - this.canvasBoundingRegion.x);
    this.mouseOffsetY = parseInt(e.clientY - this.canvasBoundingRegion.y);
    //console.log(this.mouseOffsetX, this.mouseOffsetY);
     
    //differentiate which canvas
   //you can remove the console.logs /// 
     if(this.drawingBoardId ==="partA"){
      console.log("in A")
      this.addCircleToBoardA(this.mouseOffsetX, this.mouseOffsetY);
    }
    if(this.drawingBoardId ==="partB"){
      console.log("in B")
    }
    if(this.drawingBoardId ==="partC"){
      console.log("in C")
    }
    if(this.drawingBoardId ==="partD"){
      console.log("in D")
      let randomColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

      for (let i = 0; i < this.objectsOnCanvas.length; i++) {
        let currentObj = this.objectsOnCanvas[i];

        if (typeof currentObj.changeColor === "function") {
          currentObj.changeColor(randomColor);
        }
      }
      }
  }

  rightClickCanvas(e) {
    this.canvasBoundingRegion = this.canvas.getBoundingClientRect();
    this.mouseOffsetX = parseInt(e.clientX - this.canvasBoundingRegion.x);
    this.mouseOffsetY = parseInt(e.clientY - this.canvasBoundingRegion.y);

    if (this.drawingBoardId === "partA") {
      e.preventDefault();
      this.removeCircleFromBoardA();
    }
  }

  addCircleToBoardA(mouseX, mouseY) {
    let radius = Math.random() * 20 + 10;
    let circle = new CircularObj(
      mouseX,
      mouseY,
      radius,
      `hsl(${Math.random() * 360}, 70%, 60%)`,
      "#000000",
      this.context
    );

    circle.isUserCreated = true;
    this.addObj(circle);
  }

  removeCircleFromBoardA() {
    for (let i = this.objectsOnCanvas.length - 1; i >= 0; i--) {
      let currentObj = this.objectsOnCanvas[i];

      if (currentObj.isUserCreated === true) {
        this.objectsOnCanvas.splice(i, 1);
        break;
      }
    }
  }
  /* method to add obj to canvas */
  addObj(objToAdd) {
    this.objectsOnCanvas.push(objToAdd);
  }

  /* method to add display objects on canvas */
  display() {
    for (let i = 0; i < this.objectsOnCanvas.length; i++) {
      this.objectsOnCanvas[i].display();
    }
  }

  /* method to add animate objects on canvas */
  animate() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
    for (let i = 0; i < this.objectsOnCanvas.length; i++) {
     if (this.drawingBoardId === "partA") {
      this.objectsOnCanvas[i].update(this.mouseOffsetX, this.mouseOffsetY);
     }
     else {
      this.objectsOnCanvas[i].update();
     }
     this.objectsOnCanvas[i].display();
    }
  }

  run(videoElement){
    for (let i = 0; i < this.objectsOnCanvas.length; i++) {
      this.objectsOnCanvas[i].update(videoElement);
      this.objectsOnCanvas[i].display();
    }

  }
}
