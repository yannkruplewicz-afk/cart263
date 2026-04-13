/*
 * question screen file
 * question flow lives here
 */

"use strict";

class QuestionScreen extends Screen {
  constructor(app) {
    super(app);
    this.currentQuestionData = null;
    this.currentQuestionId = null;
    this.optionButtons = [];
    this.visibleOptions = [];
    this.questionCardX = 92;
    this.questionCardY = 56;
    this.questionCardWidth = 776;
    this.questionCardHeight = 428;
    this.optionButtonWidth = 224;
    this.optionButtonHeight = 84;
    this.optionButtonSpacing = 16;
    this.backButton = {
      buttonId: "back",
      label: "back",
      x: this.questionCardX + 28,
      y: this.questionCardY + this.questionCardHeight - 64,
      width: 118,
      height: 42
    };
    this.nextButton = {
      buttonId: "next",
      label: "next",
      x: this.questionCardX + this.questionCardWidth - 146,
      y: this.questionCardY + this.questionCardHeight - 64,
      width: 118,
      height: 42
    };
  }

  // question data refreshes here when the screen opens
  enter() {
    this.currentQuestionId = null;
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
    this.displayQuestionText();
    this.displayOptionButtons();
    this.displayNavigationButtons();
  }

  // mouse clicks check the current option buttons here
  mousePressed() {
    const clickedNavigationButton = this.findClickedNavigationButton();

    if (clickedNavigationButton !== null) {
      this.handleNavigationButton(clickedNavigationButton);
      return;
    }

    const clickedButton = this.findClickedButton();

    if (clickedButton === null) {
      return;
    }

    this.handleSelectedOption(clickedButton.optionData);
  }

  // question screen state updates here from the shared app data
  refreshQuestionState() {
    const nextQuestionData = this.getCurrentQuestionData();
    const nextQuestionId = this.getQuestionId(nextQuestionData);

    if (nextQuestionId !== this.currentQuestionId) {
      this.currentQuestionData = nextQuestionData;
      this.currentQuestionId = nextQuestionId;
      this.visibleOptions = this.getShuffledOptions(nextQuestionData);
      this.buildOptionButtons();
    }
  }

  // the current question is chosen here from the question index
  getCurrentQuestionData() {
    const scoredQuestions = this.app.getScoredQuestions();
    const currentQuestionIndex = this.app.projectData.currentQuestionIndex;

    if (currentQuestionIndex < scoredQuestions.length) {
      return scoredQuestions[currentQuestionIndex];
    }

    if (currentQuestionIndex === scoredQuestions.length) {
      return this.app.getColourQuestion();
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

    this.optionButtonHeight = this.getQuestionNumberValue("--question-option-height", 84);
    const topRowCount = 3;
    const topRowWidth = topRowCount * this.optionButtonWidth + (topRowCount - 1) * this.optionButtonSpacing;
    const topRowX = this.questionCardX + (this.questionCardWidth - topRowWidth) / 2;
    const topRowY = this.questionCardY + 176;
    const bottomRowCount = 2;
    const bottomRowWidth = bottomRowCount * this.optionButtonWidth + (bottomRowCount - 1) * this.optionButtonSpacing;
    const bottomRowX = this.questionCardX + (this.questionCardWidth - bottomRowWidth) / 2;
    const bottomRowY = topRowY + this.optionButtonHeight + this.optionButtonSpacing;

    this.backButton.x = this.questionCardX + 30;
    this.backButton.y = this.questionCardY + this.questionCardHeight - this.backButton.height - 28;
    this.nextButton.x = this.questionCardX + this.questionCardWidth - this.nextButton.width - 30;
    this.nextButton.y = this.questionCardY + this.questionCardHeight - this.nextButton.height - 28;

    this.visibleOptions.forEach((optionData, optionIndex) => {
      let buttonX = topRowX + optionIndex * (this.optionButtonWidth + this.optionButtonSpacing);
      let buttonY = topRowY;

      if (optionIndex >= topRowCount) {
        const bottomRowIndex = optionIndex - topRowCount;
        buttonX = bottomRowX + bottomRowIndex * (this.optionButtonWidth + this.optionButtonSpacing);
        buttonY = bottomRowY;
      }

      this.optionButtons.push({
        x: buttonX,
        y: buttonY,
        width: this.optionButtonWidth,
        height: this.optionButtonHeight,
        optionData: optionData
      });
    });
  }

  // the current question id is read here for stable option order
  getQuestionId(questionData) {
    if (questionData === null) {
      return null;
    }

    return questionData.id;
  }

  // the current question options are shuffled here one time
  getShuffledOptions(questionData) {
    if (questionData === null) {
      return [];
    }

    const shuffledOptions = [...questionData.options];

    for (let optionIndex = shuffledOptions.length - 1; optionIndex > 0; optionIndex -= 1) {
      const randomIndex = Math.floor(random(optionIndex + 1));
      const currentOption = shuffledOptions[optionIndex];

      shuffledOptions[optionIndex] = shuffledOptions[randomIndex];
      shuffledOptions[randomIndex] = currentOption;
    }

    return shuffledOptions;
  }

  // a simple panel behind the question content is drawn here
  displayQuestionPanel() {
    const panelRadius = this.getQuestionNumberValue("--question-panel-radius", 28);

    push();
    rectMode(CORNER);
    noStroke();
    fill(this.getQuestionStyleValue("--question-panel-shadow", "rgba(255, 255, 255, 0.35)"));
    rect(this.questionCardX + 10, this.questionCardY + 12, this.questionCardWidth, this.questionCardHeight, panelRadius);
    fill(this.getQuestionStyleValue("--question-panel", "#fff9f7"));
    stroke(this.getQuestionStyleValue("--question-text", "#2b2d42"));
    strokeWeight(this.getQuestionNumberValue("--question-stroke-weight", 2));
    rect(this.questionCardX, this.questionCardY, this.questionCardWidth, this.questionCardHeight, panelRadius);
    fill(this.getQuestionStyleValue("--question-panel-accent", "#ffd8d3"));
    noStroke();
    rect(this.questionCardX + 28, this.questionCardY + 24, this.questionCardWidth - 56, 18, 10);
    pop();
  }

  // progress text is drawn here above the question
  displayProgressText() {
    const totalQuestionCount = this.app.getTotalQuestionCount();
    const currentStepNumber = this.getCurrentStepNumber();
    const chipX = this.questionCardX + 30;
    const chipY = this.questionCardY + 58;
    const chipWidth = 148;
    const chipHeight = 34;

    push();
    rectMode(CORNER);
    fill(this.getQuestionStyleValue("--question-progress-fill", "#eef4ff"));
    stroke(this.getQuestionStyleValue("--question-option-stroke", "#2b2d42"));
    strokeWeight(this.getQuestionNumberValue("--question-stroke-weight", 2));
    rect(chipX, chipY, chipWidth, chipHeight, 12);
    fill(this.getQuestionStyleValue("--question-text", "#2b2d42"));
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.getQuestionNumberValue("--question-progress-size", 16));
    text(`question ${currentStepNumber} of ${totalQuestionCount}`, chipX + chipWidth / 2, chipY + chipHeight / 2 + 1);
    pop();
  }

  // the active question text is drawn here
  displayQuestionText() {
    push();
    fill(this.getQuestionStyleValue("--question-text", "#2b2d42"));
    noStroke();
    textAlign(CENTER, TOP);
    textSize(this.getQuestionNumberValue("--question-title-size", 30));
    textWrap(WORD);
    text(this.currentQuestionData.text, this.questionCardX + 72, this.questionCardY + 92, this.questionCardWidth - 144);
    pop();
  }

  // all current option buttons are drawn here
  displayOptionButtons() {
    this.optionButtons.forEach((buttonData) => {
      const isHovered = this.isMouseInsideButton(buttonData);
      const buttonRadius = this.getQuestionNumberValue("--question-option-radius", 16);
      const isSelected = this.isOptionSelected(buttonData.optionData);

      push();

      if (isSelected === true) {
        fill(this.getQuestionStyleValue("--question-option-selected", "#dbeeff"));
      }
      else if (isHovered === true) {
        fill(this.getQuestionStyleValue("--question-option-hover", "#e3f1ff"));
      }
      else {
        fill(this.getQuestionStyleValue("--question-option-fill", "#fff6f3"));
      }

      stroke(this.getQuestionStyleValue("--question-option-stroke", "#2b2d42"));
      strokeWeight(this.getQuestionNumberValue("--question-stroke-weight", 2));
      rect(buttonData.x, buttonData.y, buttonData.width, buttonData.height, buttonRadius);

      fill(this.getQuestionStyleValue("--question-text", "#2b2d42"));
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(this.getQuestionNumberValue("--question-option-text-size", 16));
      textLeading(this.getQuestionNumberValue("--question-option-text-leading", 20));
      text(buttonData.optionData.text, buttonData.x + 16, buttonData.y + 12, buttonData.width - 32, buttonData.height - 24);
      pop();
    });
  }

  // the back and next buttons are drawn here
  displayNavigationButtons() {
    if (this.canGoBack() === true) {
      this.displayNavigationButton(this.backButton, true);
    }

    this.displayNavigationButton(this.nextButton, this.canGoNext());
  }

  // one navigation button is drawn here
  displayNavigationButton(buttonData, isEnabled) {
    const isHovered = this.isMouseInsideButton(buttonData);
    const isBackButton = buttonData.buttonId === "back";
    const buttonRadius = this.getQuestionNumberValue("--question-nav-radius", 14);
    let fillColour = this.getQuestionStyleValue("--question-next-fill", "#d6f4e6");
    let hoverColour = this.getQuestionStyleValue("--question-next-hover", "#c3e8d6");

    if (isBackButton === true) {
      fillColour = this.getQuestionStyleValue("--question-back-fill", "#ffe2dd");
      hoverColour = this.getQuestionStyleValue("--question-back-hover", "#ffd4cd");
    }

    push();
    rectMode(CORNER);
    stroke(this.getQuestionStyleValue("--question-option-stroke", "#2b2d42"));
    strokeWeight(this.getQuestionNumberValue("--question-stroke-weight", 2));

    if (isEnabled === false) {
      fill(228);
    }
    else if (isHovered === true) {
      fill(hoverColour);
    }
    else {
      fill(fillColour);
    }

    rect(buttonData.x, buttonData.y, buttonData.width, buttonData.height, buttonRadius);
    fill(this.getQuestionStyleValue("--question-text", "#2b2d42"));
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.getQuestionNumberValue("--question-body-size", 18));
    text(buttonData.label, buttonData.x + buttonData.width / 2, buttonData.y + buttonData.height / 2 + 1);
    pop();
  }

  // the question screen uses a soft pastel background here
  displayBackground() {
    background(this.getQuestionStyleValue("--question-background", "#fbf2ef"));
    const leftGlowX = CANVAS_WIDTH * 0.16;
    const leftGlowY = CANVAS_HEIGHT * 0.2;
    const rightGlowX = CANVAS_WIDTH * 0.84;
    const rightGlowY = CANVAS_HEIGHT * 0.76;
    const leftGlowSize = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.3;
    const rightGlowSize = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.36;

    noStroke();
    fill(this.getQuestionStyleValue("--question-glow-blue", "rgba(211, 229, 255, 0.5)"));
    ellipse(leftGlowX, leftGlowY, leftGlowSize, leftGlowSize);
    fill(this.getQuestionStyleValue("--question-glow-red", "rgba(248, 214, 221, 0.6)"));
    ellipse(rightGlowX, rightGlowY, rightGlowSize, rightGlowSize);
  }

  // one css style value is read here for the question screen
  getQuestionStyleValue(variableName, fallbackValue) {
    const rootStyles = getComputedStyle(document.documentElement);
    const styleValue = rootStyles.getPropertyValue(variableName).trim();

    if (styleValue === "") {
      return fallbackValue;
    }

    return styleValue;
  }

  // one numeric css style value is read here for the question screen
  getQuestionNumberValue(variableName, fallbackValue) {
    const styleValue = this.getQuestionStyleValue(variableName, `${fallbackValue}`);
    const parsedValue = Number(styleValue);

    if (Number.isNaN(parsedValue) === true) {
      return fallbackValue;
    }

    return parsedValue;
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

  // one clicked navigation button is found here
  findClickedNavigationButton() {
    if (this.isMouseInsideButton(this.backButton) === true && this.canGoBack() === true) {
      return this.backButton;
    }

    if (this.isMouseInsideButton(this.nextButton) === true && this.canGoNext() === true) {
      return this.nextButton;
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

    this.app.playButtonBeep();

    if (this.currentQuestionData.scored === true) {
      this.app.saveAnswer(this.currentQuestionData.id, optionData.id);
      return;
    }

    this.app.saveColour(optionData.colourId);
  }

  // one selected option can be checked here
  isOptionSelected(optionData) {
    if (this.currentQuestionData === null) {
      return false;
    }

    if (this.currentQuestionData.scored === true) {
      return this.app.projectData.selectedAnswers[this.currentQuestionData.id] === optionData.id;
    }

    return this.app.projectData.selectedColour === optionData.colourId;
  }

  // the screen can move back when there is a previous step
  canGoBack() {
    return this.app.projectData.currentQuestionIndex > 0;
  }

  // the screen can move next after a choice is made
  canGoNext() {
    if (this.currentQuestionData === null) {
      return false;
    }

    if (this.currentQuestionData.scored === true) {
      return this.app.projectData.selectedAnswers[this.currentQuestionData.id] !== undefined;
    }

    return this.app.projectData.selectedColour !== null;
  }

  // the back and next flow is handled here
  handleNavigationButton(buttonData) {
    if (buttonData.buttonId === "back") {
      this.app.playButtonBeep();
      this.handleBackButton();
      return;
    }

    if (buttonData.buttonId === "next") {
      this.app.playButtonBeep();
      this.handleNextButton();
    }
  }

  // the back button moves to the previous step or menu
  handleBackButton() {
    const currentQuestionIndex = this.app.projectData.currentQuestionIndex;

    if (currentQuestionIndex <= 0) {
      this.app.setScreen("menu");
      return;
    }

    this.app.setCurrentQuestionIndex(currentQuestionIndex - 1);
    this.refreshQuestionState();
  }

  // the next button moves forward from the current step
  handleNextButton() {
    if (this.currentQuestionData === null) {
      return;
    }

    if (this.currentQuestionData.scored === true) {
      this.handleNextScoredStep();
      return;
    }

    this.handleNextColourStep();
  }

  // one scored question can move forward here
  handleNextScoredStep() {
    const scoredQuestionCount = this.app.getScoredQuestions().length;
    const currentQuestionIndex = this.app.projectData.currentQuestionIndex;
    const isLastScoredQuestion = currentQuestionIndex === scoredQuestionCount - 1;

    if (isLastScoredQuestion === true) {
      this.app.calculateFinalRobotType();
    }

    this.app.goToNextQuestion();
    this.refreshQuestionState();
  }

  // the colour step moves into the voice screen here
  handleNextColourStep() {
    if (this.app.projectData.selectedRobotType === null) {
      this.app.calculateFinalRobotType();
    }

    this.app.setScreen("voice");
  }
}
