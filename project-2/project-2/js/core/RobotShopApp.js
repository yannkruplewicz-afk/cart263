/*
 * robot shop app class file
 * ray can manage the shared app flow here
 */

"use strict";

class RobotShopApp {
  constructor() {
    // shared project data lives here
    this.screens = {};
    this.currentScreenKey = undefined;
    this.currentScreen = undefined;
    this.isLoading = true;
    this.loadError = null;
    this.questionsData = null;
    this.robotsData = null;
    this.projectData = {
      consentGiven: false,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      robotScores: this.createEmptyRobotScores(),
      selectedRobotType: null,
      selectedColor: null,
      rawAudio: null,
      filteredAudio: null,
      audioStatus: {
        hasRecording: false,
        isConfirmed: false,
        isProcessing: false
      },
      recordingDurationSeconds: 5
    };
  }

  async setup() {
    // basic text settings start here
    textAlign(CENTER, CENTER);
    textFont("Arial");

    // project data loads before the screens start
    await this.loadData();

    if (this.loadError !== null) {
      return;
    }

    // main project screens are created here (except RevealScreen)
    this.createScreens();

    // the menu screen starts first
    this.setScreen("menu");
    this.isLoading = false;
  }

  draw() {
    if (this.isLoading === true) {
      this.displayLoadingScreen();
      return;
    }

    if (this.loadError !== null) {
      this.displayErrorScreen();
      return;
    }

    if (this.currentScreen !== undefined) {
      this.currentScreen.update();
      this.currentScreen.display();
    }
  }

  mousePressed() {
    if (this.currentScreen !== undefined) {
      this.currentScreen.mousePressed();
    }
  }

  // empty score totals start here for each robot type
  createEmptyRobotScores() {
    return {
      companion: 0,
      domestic: 0,
      security: 0,
      social: 0,
      utility: 0
    };
  }

  // json files load here before the project begins
  async loadData() {
    try {
      this.questionsData = await this.loadJsonFile("assets/data/questions-data.json");
      this.robotsData = await this.loadJsonFile("assets/data/robots-data.json");
      this.loadError = null;
    }
    catch (error) {
      this.loadError = "project data could not load";
      this.isLoading = false;
      console.error(error);
      return;
    }
  }

  // one json file loads at a time through this helper
  async loadJsonFile(filePath) {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`could not load ${filePath}`);
    }

    return await response.json();
  }

  // scored questions can be read here from the loaded data
  getScoredQuestions() {
    if (this.questionsData === null) return [];
    return this.questionsData.scoredQuestions;
  }

  // the color question can be read here from the loaded data
  getColorQuestion() {
    if (this.questionsData === null) return null;
    return this.questionsData.colorQuestion;
  }

  // the full question count can be read here for progress text
  getTotalQuestionCount() {
    const scoredQuestionCount = this.getScoredQuestions().length;
    const colorQuestion = this.getColorQuestion();
    return colorQuestion === null ? scoredQuestionCount : scoredQuestionCount + 1;
  }

  // one scored question can be found here by its id
  findScoredQuestionById(questionId) {
    const scoredQuestions = this.getScoredQuestions();
    return scoredQuestions.find(q => q.id === questionId);
  }

  // one option inside a question can be found here by its id
  findOptionById(questionData, optionId) {
    if (!questionData) return undefined;
    return questionData.options.find(opt => opt.id === optionId);
  }

  // selected answers save here and update the score totals
  saveAnswer(questionId, optionId) {
    const questionData = this.findScoredQuestionById(questionId);
    if (!questionData) return;

    const selectedOption = this.findOptionById(questionData, optionId);
    if (!selectedOption) return;

    const previousOptionId = this.projectData.selectedAnswers[questionId];
    if (previousOptionId !== undefined) {
      const previousOption = this.findOptionById(questionData, previousOptionId);
      if (previousOption) {
        this.projectData.robotScores[previousOption.robotTypeId] -= questionData.points;
      }
    }

    this.projectData.selectedAnswers[questionId] = optionId;
    this.projectData.robotScores[selectedOption.robotTypeId] += questionData.points;
  }

  // question flow progress
  setCurrentQuestionIndex(index) { this.projectData.currentQuestionIndex = index; }
  goToNextQuestion() { this.projectData.currentQuestionIndex += 1; }
  resetQuestionFlow() {
    this.projectData.currentQuestionIndex = 0;
    this.projectData.selectedAnswers = {};
    this.projectData.robotScores = this.createEmptyRobotScores();
    this.projectData.selectedRobotType = null;
    this.projectData.selectedColor = null;
  }

  // scored questions can be sorted here for tie-break
  getQuestionPriorityOrder() {
    const scoredQuestions = this.getScoredQuestions();
    const questionOrderList = scoredQuestions.map((q, i) => ({ questionData: q, questionIndex: i }));
    questionOrderList.sort((a, b) => {
      const diff = b.questionData.points - a.questionData.points;
      return diff !== 0 ? diff : a.questionIndex - b.questionIndex;
    });
    return questionOrderList.map(qItem => qItem.questionData);
  }

  // final robot result
  calculateFinalRobotType() {
    const scoreEntries = Object.entries(this.projectData.robotScores);
    const selectedAnswerCount = Object.keys(this.projectData.selectedAnswers).length;

    if (scoreEntries.length === 0 || selectedAnswerCount === 0) {
      this.projectData.selectedRobotType = null;
      return null;
    }

    let highestScore = -Infinity;
    scoreEntries.forEach(([_, score]) => { if (score > highestScore) highestScore = score; });

    const tiedRobotTypes = scoreEntries.filter(([_, score]) => score === highestScore).map(([type, _]) => type);

    if (tiedRobotTypes.length === 0) return null;
    if (tiedRobotTypes.length === 1) return (this.projectData.selectedRobotType = tiedRobotTypes[0]);

    return (this.projectData.selectedRobotType = this.breakRobotTypeTie(tiedRobotTypes));
  }

  breakRobotTypeTie(tiedRobotTypes) {
    const questionOrder = this.getQuestionPriorityOrder();
    for (const qData of questionOrder) {
      const selectedOptionId = this.projectData.selectedAnswers[qData.id];
      if (!selectedOptionId) continue;
      const selectedOption = this.findOptionById(qData, selectedOptionId);
      if (!selectedOption) continue;
      if (tiedRobotTypes.includes(selectedOption.robotTypeId)) return selectedOption.robotTypeId;
    }
    return tiedRobotTypes[0];
  }

  saveColor(colorId) {
    const availableColors = this.getAvailableColors();
    const selectedColorData = availableColors.find(c => c.id === colorId);
    if (!selectedColorData) return;
    this.projectData.selectedColor = colorId;
  }

  getAvailableColors() {
    if (!this.robotsData) return [];
    return this.robotsData.colors;
  }

  getRobotTypeData(robotTypeId) {
    if (!this.robotsData) return null;
    return this.robotsData.robotTypes.find(r => r.id === robotTypeId) || null;
  }

  getSelectedRobotImagePath() {
    const type = this.projectData.selectedRobotType;
    const color = this.projectData.selectedColor;
    if (!type || !color) return null;
    const data = this.getRobotTypeData(type);
    if (!data) return null;
    return data.imagePaths[color] || null;
  }

  saveRawAudio(data) {
    this.projectData.rawAudio = data;
    this.projectData.filteredAudio = null;
    this.projectData.audioStatus = { hasRecording: true, isConfirmed: false, isProcessing: false };
  }

  setAudioProcessingState(isProcessing) { this.projectData.audioStatus.isProcessing = isProcessing; }

  saveFilteredAudio(data) {
    this.projectData.filteredAudio = data;
    this.projectData.audioStatus = { hasRecording: true, isConfirmed: true, isProcessing: false };
  }

  resetAudioData() {
    this.projectData.rawAudio = null;
    this.projectData.filteredAudio = null;
    this.projectData.audioStatus = { hasRecording: false, isConfirmed: false, isProcessing: false };
  }

  createScreens() {
    this.screens.menu = new MenuScreen(this);
    this.screens.questions = new QuestionScreen(this);
    this.screens.voice = new VoiceScreen(this);

    // Delay RevealScreen creation until needed
    this.screens.reveal = null;
  }
  setScreen(screenKey) {
    if (screenKey === "reveal") {
      if (this.screens.reveal === null) {
        if (typeof THREE === "undefined") {
          console.warn("THREE.js not loaded yet. Retrying in 50ms...");
          setTimeout(() => this.setScreen(screenKey), 50);
          return;
        }
        this.screens.reveal = new RevealScreen(this);
      }
    }

    const screen = this.screens[screenKey];
    if (!screen) {
      console.warn(`Screen "${screenKey}" does not exist`);
      return;
    }

    this.currentScreenKey = screenKey;
    this.currentScreen = screen;

    if (typeof screen.enter === "function") {
      screen.enter();
    }
  }
  displayLoadingScreen() {
    background(247, 241, 232);
    fill(20);
    noStroke();
    textSize(24);
    text("loading robot shop...", width / 2, height / 2);
  }

  displayErrorScreen() {
    background(247, 241, 232);
    fill(20);
    noStroke();
    textSize(24);
    text(this.loadError, width / 2, height / 2);
  }
}