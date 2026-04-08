/*
 * question screen file
 * ray can build the question flow here
 */

"use strict";

class QuestionScreen extends Screen {
  constructor(app) {
    super(app);
    this.currentQuestionData = null;
    this.optionButtons = [];
    this.questionCardX = 100;
    this.questionCardY = 70;
    this.questionCardWidth = 760;
    this.questionCardHeight = 400;
    this.optionButtonWidth = 680;
    this.optionButtonHeight = 48;
    this.optionButtonSpacing = 14;
  }

  // question data refreshes here when the screen opens
  enter() {
    this.refreshQuestionState();
  }

  // question data refreshes here while the screen is active
  update() {
    this.refreshQuestionState();
  }

  // question screen drawing lives here
  display() {
    this.displayBackground();
    this.displayFrame();

    if (this.currentQuestionData === null) {
      this.displayMissingQuestionMessage();
      return;
    }

    this.displayQuestionPanel();
    this.displayProgressText();
    this.displayQuestionText();
    this.displayOptionButtons();
  }

  // mouse clicks check the current option buttons here
  mousePressed() {
    const clickedButton = this.findClickedButton();

    if (clickedButton === null) {
      return;
    }

    this.handleSelectedOption(clickedButton.optionData);
  }

  // question screen state updates here from the shared app data
  refreshQuestionState() {
    this.currentQuestionData = this.getCurrentQuestionData();
    this.buildOptionButtons();
  }

  // the current question is chosen here from the question index
  getCurrentQuestionData() {
    const scoredQuestions = this.app.getScoredQuestions();
    const currentQuestionIndex = this.app.projectData.currentQuestionIndex;

    if (currentQuestionIndex < scoredQuestions.length) {
      return scoredQuestions[currentQuestionIndex];
    }

    if (currentQuestionIndex === scoredQuestions.length) {
      return this.app.getColorQuestion();
    }

    return null;
  }

  // the visible step number is worked out here for the progress text
  getCurrentStepNumber() {
    return this.app.projectData.currentQuestionIndex + 1;
  }

  // button data is laid out here for the current question
  buildOptionButtons() {
    this.optionButtons = [];

    if (this.currentQuestionData === null) {
      return;
    }

    const buttonStartX = this.questionCardX + 40;
    const buttonStartY = this.questionCardY + 130;

    this.currentQuestionData.options.forEach((optionData, optionIndex) => {
      const buttonY = buttonStartY + optionIndex * (this.optionButtonHeight + this.optionButtonSpacing);

      this.optionButtons.push({
        x: buttonStartX,
        y: buttonY,
        width: this.optionButtonWidth,
        height: this.optionButtonHeight,
        optionData: optionData
      });
    });
  }

  // a simple panel behind the question content is drawn here
  displayQuestionPanel() {
    rectMode(CORNER);
    fill(255);
    stroke(20);
    strokeWeight(2);
    rect(this.questionCardX, this.questionCardY, this.questionCardWidth, this.questionCardHeight);
  }

  // progress text is drawn here above the question
  displayProgressText() {
    const totalQuestionCount = this.app.getTotalQuestionCount();
    const currentStepNumber = this.getCurrentStepNumber();

    fill(20);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(18);
    text(`question ${currentStepNumber} of ${totalQuestionCount}`, this.questionCardX + 30, this.questionCardY + 35);
  }

  // the active question text is drawn here
  displayQuestionText() {
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(28);
    textWrap(WORD);
    text(this.currentQuestionData.text, this.questionCardX + 30, this.questionCardY + 65, this.questionCardWidth - 60);
  }

  // all current option buttons are drawn here
  displayOptionButtons() {
    this.optionButtons.forEach((buttonData) => {
      const isHovered = this.isMouseInsideButton(buttonData);

      if (isHovered === true) {
        fill(230);
      }
      else {
        fill(245);
      }

      stroke(20);
      strokeWeight(2);
      rect(buttonData.x, buttonData.y, buttonData.width, buttonData.height);

      fill(20);
      noStroke();
      textAlign(LEFT, CENTER);
      textSize(18);
      text(buttonData.optionData.text, buttonData.x + 20, buttonData.y + buttonData.height / 2);
    });
  }

  // a fallback message shows if question data is missing
  displayMissingQuestionMessage() {
    fill(20);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    text("question data is not ready yet", width / 2, height / 2);
  }

  // one button click is found here from the current mouse position
  findClickedButton() {
    for (const buttonData of this.optionButtons) {
      if (this.isMouseInsideButton(buttonData) === true) {
        return buttonData;
      }
    }

    return null;
  }

  // button hit testing runs here
  isMouseInsideButton(buttonData) {
    const isInsideX = mouseX >= buttonData.x && mouseX <= buttonData.x + buttonData.width;
    const isInsideY = mouseY >= buttonData.y && mouseY <= buttonData.y + buttonData.height;

    return isInsideX && isInsideY;
  }

  // one selected option is handled here
  handleSelectedOption(optionData) {
    if (this.currentQuestionData === null) {
      return;
    }

    if (this.currentQuestionData.scored === true) {
      this.handleScoredAnswer(optionData);
      return;
    }

    this.handleColorAnswer(optionData);
  }

  // scored answers save points and move to the next step here
  handleScoredAnswer(optionData) {
    this.app.saveAnswer(this.currentQuestionData.id, optionData.id);

    const scoredQuestionCount = this.app.getScoredQuestions().length;
    const currentQuestionIndex = this.app.projectData.currentQuestionIndex;
    const isLastScoredQuestion = currentQuestionIndex === scoredQuestionCount - 1;

    if (isLastScoredQuestion === true) {
      this.app.calculateFinalRobotType();
    }

    this.app.goToNextQuestion();
    this.refreshQuestionState();
  }

  // the color answer saves here and then moves into the voice screen
  handleColorAnswer(optionData) {
    this.app.saveColor(optionData.colorId);

    if (this.app.projectData.selectedRobotType === null) {
      this.app.calculateFinalRobotType();
    }

    this.app.setScreen("voice");
  }
}
