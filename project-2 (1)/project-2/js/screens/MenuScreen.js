/*
 * menu screen file
 * main menu content lives here
 */

"use strict";

class MenuScreen extends Screen {
  constructor(app) {
    super(app);
    this.titleText = "RoboShop";
    this.subtitleText = "Your ideal robot starts here";
    this.mainCard = {};
    this.guideButton = {
      buttonId: "guide",
      label: "Guide",
      variant: "blue"
    };
    this.guideVisible = false;
    this.guidePanel = {};
    this.closeButton = {
      buttonId: "closeGuide",
      label: ""
    };
    this.checkbox = {
      buttonId: "consent",
      size: 24
    };
    this.startButton = {
      buttonId: "start",
      label: "start",
      variant: "mint"
    };
    this.bulletItems = [
      "Answer a few quick questions so we can match you with a robot",
      "Choose a robot colour before the final reveal",
      "Record up to 5 seconds of your voice for your robot",
      "Open the package and meet the robot that fits you best"
    ];

    // the menu starts with consent unchecked
    this.app.projectData.consentGiven = false;
  }

  // the full menu view is drawn here
  display() {
    this.updateLayoutValues();
    this.displayBackground();
    this.displayMainCard();
    this.displayTitle();
    this.displayGuideButton();
    this.displayGuidePopup();
  }

  // the menu uses a soft pastel background here
  displayBackground() {
    background(this.getMenuStyleValue("--menu-background", "#fbf1ef"));
    const leftGlowX = CANVAS_WIDTH * 0.2;
    const leftGlowY = CANVAS_HEIGHT * 0.14;
    const rightGlowX = CANVAS_WIDTH * 0.82;
    const rightGlowY = CANVAS_HEIGHT * 0.8;
    const leftGlowSize = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.34;
    const rightGlowSize = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.42;

    noStroke();
    fill(this.getMenuStyleValue("--menu-glow-blue", "rgba(211, 229, 255, 0.58)"));
    ellipse(leftGlowX, leftGlowY, leftGlowSize, leftGlowSize);
    fill(this.getMenuStyleValue("--menu-glow-red", "rgba(248, 214, 221, 0.72)"));
    ellipse(rightGlowX, rightGlowY, rightGlowSize, rightGlowSize);
  }

  // the main centred menu card is drawn here
  displayMainCard() {
    const cardRadius = this.getMenuNumberValue("--menu-panel-radius", 28);

    push();
    noStroke();
    fill(this.getMenuStyleValue("--menu-panel-shadow", "rgba(255, 255, 255, 0.35)"));
    rect(this.mainCard.x + 10, this.mainCard.y + 12, this.mainCard.width, this.mainCard.height, cardRadius);
    fill(this.getMenuStyleValue("--menu-panel", "#fff9f7"));
    stroke(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    strokeWeight(this.getMenuNumberValue("--menu-stroke-weight", 2));
    rect(this.mainCard.x, this.mainCard.y, this.mainCard.width, this.mainCard.height, cardRadius);
    fill(this.getMenuStyleValue("--menu-panel-accent", "#ffd8d3"));
    noStroke();
    rect(this.mainCard.x + 26, this.mainCard.y + 26, this.mainCard.width - 52, 20, 10);
    pop();
  }

  // the title and subtitle sit in the centre here
  displayTitle() {
    const titleX = CANVAS_WIDTH / 2;
    const titleY = this.mainCard.y + 118;
    const titleFontName = this.getMenuStyleValue("--menu-title-font", "Trebuchet MS").replaceAll("\"", "");
    const titleSize = this.getMenuNumberValue("--menu-title-size", 80);
    const subtitleSize = this.getMenuNumberValue("--menu-subtitle-size", 24);

    push();
    textAlign(CENTER, CENTER);
    textFont(titleFontName);
    textStyle(BOLD);
    textSize(titleSize);
    fill(this.getMenuStyleValue("--menu-panel-accent", "#ffd8d3"));
    text(this.titleText, titleX + 3, titleY + 4);
    fill(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    text(this.titleText, titleX, titleY);
    textStyle(NORMAL);
    textSize(subtitleSize);
    fill(this.getMenuStyleValue("--menu-subtitle", "#6e7285"));
    text(this.subtitleText, titleX, this.mainCard.y + 192);
    pop();
  }

  // the main menu only shows the guide button here
  displayGuideButton() {
    if (this.guideVisible === true) {
      return;
    }

    this.displayButton(this.guideButton, true);
  }

  // the guide popup is drawn here
  displayGuidePopup() {
    if (this.guideVisible === false) {
      return;
    }

    const popupRadius = this.getMenuNumberValue("--menu-popup-radius", 24);

    push();
    noStroke();
    fill(0, 0, 0, 80);
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fill(this.getMenuStyleValue("--menu-popup", "#fff8f5"));
    stroke(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    strokeWeight(this.getMenuNumberValue("--menu-stroke-weight", 2));
    rect(this.guidePanel.x, this.guidePanel.y, this.guidePanel.width, this.guidePanel.height, popupRadius);
    fill(this.getMenuStyleValue("--menu-panel-accent", "#ffd8d3"));
    noStroke();
    rect(this.guidePanel.x + 20, this.guidePanel.y + 20, this.guidePanel.width - 40, 18, 10);
    pop();

    this.displayCloseButton();
    this.displayGuideText();
    this.displayConsentArea();

    if (this.app.projectData.consentGiven === true) {
      this.displayButton(this.startButton, true);
    }
  }

  // the guide title and bullet text are drawn here
  displayGuideText() {
    const titleX = this.guidePanel.x + 42;
    const titleY = this.guidePanel.y + 60;
    const bulletStartY = this.guidePanel.y + 126;
    const bulletDotX = this.guidePanel.x + 48;
    const bulletTextX = bulletDotX + 24;
    const bulletSpacing = 52;
    const bulletWidth = this.guidePanel.width - 122;
    const titleFontName = this.getMenuStyleValue("--menu-title-font", "Trebuchet MS").replaceAll("\"", "");
    const guideTitleSize = this.getMenuNumberValue("--menu-guide-title-size", 34);
    const bodySize = this.getMenuNumberValue("--menu-body-size", 18);

    push();
    fill(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    noStroke();
    textAlign(LEFT, TOP);
    textFont(titleFontName);
    textStyle(BOLD);
    textSize(guideTitleSize);
    text("Guide", titleX, titleY);
    textStyle(NORMAL);
    textSize(bodySize);
    fill(this.getMenuStyleValue("--menu-subtitle", "#6e7285"));

    for (let index = 0; index < this.bulletItems.length; index += 1) {
      const lineY = bulletStartY + index * bulletSpacing;

      fill(this.getMenuStyleValue("--menu-panel-accent", "#ffd8d3"));
      circle(bulletDotX, lineY + 8, 10);
      fill(this.getMenuStyleValue("--menu-subtitle", "#6e7285"));
      text(this.bulletItems[index], bulletTextX, lineY - 2, bulletWidth, 38);
    }

    pop();
  }

  // the consent card is drawn near the bottom here
  displayConsentArea() {
    const consentGiven = this.app.projectData.consentGiven;
    const consentCardX = this.guidePanel.x + 24;
    const consentCardWidth = this.guidePanel.width - 210;
    const consentCardHeight = 88;
    const consentCardY = this.guidePanel.y + this.guidePanel.height - consentCardHeight - 28;
    const helperTextX = consentCardX + 18;
    const helperTextY = consentCardY + 10;
    const checkboxRadius = this.getMenuNumberValue("--menu-checkbox-radius", 6);
    const smallSize = this.getMenuNumberValue("--menu-small-size", 15);
    const consentTextSize = this.getMenuNumberValue("--menu-consent-size", 14);

    this.checkbox.x = consentCardX + 18;
    this.checkbox.y = consentCardY + 42;
    const consentTextX = this.checkbox.x + this.checkbox.size + 14;
    const consentTextY = this.checkbox.y + this.checkbox.size / 2;

    push();
    fill(this.getMenuStyleValue("--menu-consent-card", "#eef4ff"));
    stroke(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    strokeWeight(this.getMenuNumberValue("--menu-stroke-weight", 2));
    rect(consentCardX, consentCardY, consentCardWidth, consentCardHeight, 18);
    noFill();
    rect(this.checkbox.x, this.checkbox.y, this.checkbox.size, this.checkbox.size, checkboxRadius);

    if (consentGiven === true) {
      line(this.checkbox.x + 4, this.checkbox.y + this.checkbox.size / 2, this.checkbox.x + this.checkbox.size / 2 - 1, this.checkbox.y + this.checkbox.size - 5);
      line(this.checkbox.x + this.checkbox.size / 2 - 1, this.checkbox.y + this.checkbox.size - 5, this.checkbox.x + this.checkbox.size - 4, this.checkbox.y + 5);
    }

    noStroke();
    textAlign(LEFT, TOP);
    fill(this.getMenuStyleValue("--menu-subtitle", "#6e7285"));
    textSize(smallSize - 1);
    text("Please agree to start", helperTextX, helperTextY);
    fill(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    textSize(consentTextSize);
    textAlign(LEFT, CENTER);
    text("I agree to let RoboShop record and sample my voice for my robot", consentTextX, consentTextY);

    pop();
  }

  // the close button is styled here
  displayCloseButton() {
    const closeRadius = this.getMenuNumberValue("--menu-close-radius", 10);

    push();
    fill(this.getMenuStyleValue("--menu-panel", "#fff9f7"));
    stroke(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    strokeWeight(this.getMenuNumberValue("--menu-stroke-weight", 2));
    rect(this.closeButton.x, this.closeButton.y, this.closeButton.width, this.closeButton.height, closeRadius);
    line(this.closeButton.x + 8, this.closeButton.y + 8, this.closeButton.x + this.closeButton.width - 8, this.closeButton.y + this.closeButton.height - 8);
    line(this.closeButton.x + 8, this.closeButton.y + this.closeButton.height - 8, this.closeButton.x + this.closeButton.width - 8, this.closeButton.y + 8);
    pop();
  }

  // the shared button style is drawn here
  displayButton(buttonData, isEnabled) {
    const isHovered = this.isMouseInsideButton(buttonData);
    let fillColour = this.getMenuStyleValue("--menu-button-blue", "#d3e5ff");
    let hoverColour = this.getMenuStyleValue("--menu-button-blue-hover", "#c2dbff");
    const buttonRadius = this.getMenuNumberValue("--menu-button-radius", 14);
    const titleFontName = this.getMenuStyleValue("--menu-title-font", "Trebuchet MS").replaceAll("\"", "");
    const bodySize = this.getMenuNumberValue("--menu-body-size", 18);

    if (buttonData.variant === "mint") {
      fillColour = this.getMenuStyleValue("--menu-button-green", "#d6f4e6");
      hoverColour = this.getMenuStyleValue("--menu-button-green-hover", "#c3e8d6");
    }

    push();
    rectMode(CORNER);
    stroke(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    strokeWeight(this.getMenuNumberValue("--menu-stroke-weight", 2));

    if (isEnabled === false) {
      fill(222);
    }
    else if (isHovered === true) {
      fill(hoverColour);
    }
    else {
      fill(fillColour);
    }

    rect(buttonData.x, buttonData.y, buttonData.width, buttonData.height, buttonRadius);
    fill(this.getMenuStyleValue("--menu-text", "#2b2d42"));
    noStroke();
    textAlign(CENTER, CENTER);
    textFont(titleFontName);
    textSize(bodySize + 4);
    text(buttonData.label, buttonData.x + buttonData.width / 2, buttonData.y + buttonData.height / 2 + 1);
    pop();
  }

  mousePressed() {
    const clickedItem = this.findClickedItem();

    if (clickedItem === null) {
      return;
    }

    this.handleSelectedItem(clickedItem);
  }

  // the active menu hit areas are checked here
  findClickedItem() {
    if (this.guideVisible === false) {
      if (this.isMouseInsideButton(this.guideButton) === true) {
        return this.guideButton;
      }

      return null;
    }

    if (this.isMouseInsideButton(this.closeButton) === true) {
      return this.closeButton;
    }

    if (this.isMouseInsideCheckbox() === true) {
      return this.checkbox;
    }

    if (this.app.projectData.consentGiven === true && this.isMouseInsideButton(this.startButton) === true) {
      return this.startButton;
    }

    return null;
  }

  // the guide, consent, and start actions are handled here
  handleSelectedItem(itemData) {
    if (itemData.buttonId === "guide") {
      this.app.playButtonBeep();
      this.app.projectData.consentGiven = false;
      this.guideVisible = true;
      return;
    }

    if (itemData.buttonId === "closeGuide") {
      this.app.playButtonBeep();
      this.guideVisible = false;
      return;
    }

    if (itemData.buttonId === "consent") {
      this.app.playButtonBeep();
      this.app.projectData.consentGiven = !this.app.projectData.consentGiven;
      return;
    }

    if (itemData.buttonId === "start") {
      this.app.playButtonBeep();
      this.guideVisible = false;
      this.app.resetQuestionFlow();
      this.app.resetAudioData();
      this.app.setScreen("questions");
    }
  }

  // the checkbox hit area is checked here
  isMouseInsideCheckbox() {
    const isInsideX = mouseX >= this.checkbox.x && mouseX <= this.checkbox.x + this.checkbox.size;
    const isInsideY = mouseY >= this.checkbox.y && mouseY <= this.checkbox.y + this.checkbox.size;

    return isInsideX && isInsideY;
  }

  // the shared button hit testing runs here
  isMouseInsideButton(buttonData) {
    const isInsideX = mouseX >= buttonData.x && mouseX <= buttonData.x + buttonData.width;
    const isInsideY = mouseY >= buttonData.y && mouseY <= buttonData.y + buttonData.height;

    return isInsideX && isInsideY;
  }

  // one css style value is read here for the menu
  getMenuStyleValue(variableName, fallbackValue) {
    const rootStyles = getComputedStyle(document.documentElement);
    const styleValue = rootStyles.getPropertyValue(variableName).trim();

    if (styleValue === "") {
      return fallbackValue;
    }

    return styleValue;
  }

  // one numeric css style value is read here for the menu
  getMenuNumberValue(variableName, fallbackValue) {
    const styleValue = this.getMenuStyleValue(variableName, `${fallbackValue}`);
    const parsedValue = Number(styleValue);

    if (Number.isNaN(parsedValue) === true) {
      return fallbackValue;
    }

    return parsedValue;
  }

  // the menu layout keeps the desktop ratio and scales from there
  updateLayoutValues() {
    const layoutScale = this.getMenuNumberValue("--menu-layout-scale", 1);
    const popupScale = this.getMenuNumberValue("--menu-popup-scale", 1);
    const scaledCardWidth = 640 * layoutScale;
    const scaledCardHeight = this.getMenuNumberValue("--menu-card-height", 352) * layoutScale;
    const scaledGuideButtonWidth = 196 * layoutScale;
    const scaledGuideButtonHeight = 54 * layoutScale;
    const scaledGuideButtonBottomGap = this.getMenuNumberValue("--menu-guide-button-bottom-gap", 36) * layoutScale;
    const scaledGuidePanelWidth = 760 * popupScale;
    const scaledGuidePanelHeight = 436 * popupScale;
    const scaledStartButtonWidth = 128 * layoutScale;
    const scaledStartButtonHeight = 44 * layoutScale;
    const scaledCheckboxSize = 24 * layoutScale;
    const scaledCloseSize = 30 * layoutScale;

    this.mainCard.x = (CANVAS_WIDTH - scaledCardWidth) / 2;
    this.mainCard.y = 88 - (scaledCardHeight - 324) / 2;
    this.mainCard.width = scaledCardWidth;
    this.mainCard.height = scaledCardHeight;

    this.guideButton.x = (CANVAS_WIDTH - scaledGuideButtonWidth) / 2;
    this.guideButton.y = this.mainCard.y + this.mainCard.height - scaledGuideButtonHeight - scaledGuideButtonBottomGap;
    this.guideButton.width = scaledGuideButtonWidth;
    this.guideButton.height = scaledGuideButtonHeight;

    this.guidePanel.x = (CANVAS_WIDTH - scaledGuidePanelWidth) / 2;
    this.guidePanel.y = (CANVAS_HEIGHT - scaledGuidePanelHeight) / 2;
    this.guidePanel.width = scaledGuidePanelWidth;
    this.guidePanel.height = scaledGuidePanelHeight;

    this.closeButton.x = this.guidePanel.x + this.guidePanel.width - scaledCloseSize - 18;
    this.closeButton.y = this.guidePanel.y + 18;
    this.closeButton.width = scaledCloseSize;
    this.closeButton.height = scaledCloseSize;

    this.checkbox.size = scaledCheckboxSize;
    this.checkbox.x = this.guidePanel.x + 42;
    this.checkbox.y = this.guidePanel.y + this.guidePanel.height - 82;

    this.startButton.x = this.guidePanel.x + this.guidePanel.width - scaledStartButtonWidth - 40;
    this.startButton.y = this.guidePanel.y + this.guidePanel.height - scaledStartButtonHeight - 28;
    this.startButton.width = scaledStartButtonWidth;
    this.startButton.height = scaledStartButtonHeight;
  }
}
