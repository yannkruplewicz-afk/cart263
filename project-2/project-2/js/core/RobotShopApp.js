/*
 * RobotShopApp.js
 * Central app controller — manages shared state, screen routing, and data loading.
 */

"use strict";

class RobotShopApp {

  constructor() {
    this.screens = {};
    this.currentScreenKey = undefined;
    this.currentScreen = undefined;

    this.isLoading = true;
    this.loadError = null;

    this.questionsData = null;
    this.robotsData = null;

    // Guard against double-constructing RevealScreen during THREE.js retry
    this._revealPending = false;

    // UI click sound — preloaded once, reused on every interaction
    this._beepAudio = null;

    // Background music
    this._bgMusic = null;
    this._bgMusicPlaying = false;

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

  /* ─────────────────────────────────────────────
   * P5 LIFECYCLE
   * ───────────────────────────────────────────── */

  async setup() {
    textAlign(CENTER, CENTER);
    textFont("Arial");

    this.preloadBeep();
    this.preloadMusic();
    await this.loadData();

    if (this.loadError !== null) return;

    this.createScreens();
    this.setScreen("menu");
  }

  draw() {
    if (this.isLoading) {
      this.displayLoadingScreen();
      return;
    }

    if (this.loadError !== null) {
      this.displayErrorScreen();
      return;
    }

    if (this.currentScreen) {
      this.currentScreen.update();
      this.currentScreen.display();
    }
  }

  mousePressed() {
    this.ensureMusic();

    // Unlock beep on first click, then play it
    if (this._beepAudio && this._beepAudio.paused) {
      this._beepAudio.play().then(() => {
        this._beepAudio.pause();
        this._beepAudio.currentTime = 0;
      }).catch(() => { });
    }

    this.playBeep(); // ← add this line

    if (this.currentScreen) {
      this.currentScreen.mousePressed();
    }
  }
  /* ─────────────────────────────────────────────
   * UI SOUND
   * ───────────────────────────────────────────── */

  preloadBeep() {
    this._beepAudio = new Audio("assets/sounds/beep1.mp3");
    this._beepAudio.volume = 0.2; // ← add this (0.0 to 1.0)
    this._beepAudio.load();
  }

  preloadMusic() {
    this._bgMusic = new Audio("assets/sounds/song100.mp3");
    this._bgMusic.loop = true;
    this._bgMusic.volume = 0.35;
    this._bgMusic.load();
    this._bgMusicPlaying = false;
  }

  playMusic() {
    if (!this._bgMusic || this._bgMusicPlaying) return;
    this._bgMusic.play().catch(() => {
      // Browser may block autoplay until first user gesture —
      // ensureMusic() handles that by retrying on every click
    });
    this._bgMusicPlaying = true;
  }

  // Call at the top of mousePressed() in every screen.
  // Silently starts music on the first click if autoplay was blocked.
  ensureMusic() {
    if (!this._bgMusicPlaying) this.playMusic();
  }

  stopMusic() {
    if (!this._bgMusic) return;
    this._bgMusic.pause();
    this._bgMusic.currentTime = 0;
    this._bgMusicPlaying = false;
  }

  playBeep() {
    if (!this._beepAudio) return;

    const beep = this._beepAudio.cloneNode(); // key fix
    beep.currentTime = 0;
    beep.play().catch(() => { });
  }

  /* ─────────────────────────────────────────────
   * DATA LOADING
   * ───────────────────────────────────────────── */

  async loadData() {
    try {
      this.questionsData = await this.loadJson("assets/data/questions-data.json");
      this.robotsData = await this.loadJson("assets/data/robots-data.json");
      this.loadError = null;
    } catch (err) {
      this.loadError = "project data could not load";
      console.error(err);
    } finally {
      // Always clear the loading flag whether we succeeded or failed
      this.isLoading = false;
    }
  }

  async loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`could not load ${path}`);
    return response.json();
  }

  /* ─────────────────────────────────────────────
   * SCREEN MANAGEMENT
   * ───────────────────────────────────────────── */

  createScreens() {
    this.screens.menu = new MenuScreen(this);
    this.screens.questions = new QuestionScreen(this);
    this.screens.voice = new VoiceScreen(this);
    this.screens.reveal = null; // created lazily when THREE.js is ready
  }

  setScreen(screenKey) {
    if (screenKey === "reveal") {
      if (this.screens.reveal === null) {
        // THREE.js may not be loaded yet — retry until it is
        if (typeof THREE === "undefined") {
          if (!this._revealPending) {
            this._revealPending = true;
            setTimeout(() => {
              this._revealPending = false;
              this.setScreen(screenKey);
            }, 50);
          }
          return;
        }
        this.screens.reveal = new RevealScreen(this);
      }
    }

    const screen = this.screens[screenKey];
    if (!screen) {
      console.warn(`setScreen: screen "${screenKey}" does not exist`);
      return;
    }

    this.currentScreenKey = screenKey;
    this.currentScreen = screen;

    if (typeof screen.enter === "function") screen.enter();
  }

  /* ─────────────────────────────────────────────
   * QUESTION DATA ACCESSORS
   * ───────────────────────────────────────────── */

  getScoredQuestions() {
    return this.questionsData?.scoredQuestions ?? [];
  }

  getColorQuestion() {
    return this.questionsData?.colorQuestion ?? null;
  }

  getTotalQuestionCount() {
    const colorQuestion = this.getColorQuestion();
    return this.getScoredQuestions().length + (colorQuestion ? 1 : 0);
  }

  findScoredQuestionById(questionId) {
    return this.getScoredQuestions().find(q => q.id === questionId);
  }

  findOptionById(questionData, optionId) {
    return questionData?.options.find(opt => opt.id === optionId);
  }

  /* ─────────────────────────────────────────────
   * ANSWER & SCORE MANAGEMENT
   * ───────────────────────────────────────────── */

  createEmptyRobotScores() {
    return {
      companion: 0,
      domestic: 0,
      security: 0,
      social: 0,
      utility: 0
    };
  }

  saveAnswer(questionId, optionId) {
    const question = this.findScoredQuestionById(questionId);
    if (!question) return;

    const selectedOption = this.findOptionById(question, optionId);
    if (!selectedOption) return;

    // Subtract previous answer's score if one exists
    const previousOptionId = this.projectData.selectedAnswers[questionId];
    if (previousOptionId !== undefined) {
      const previousOption = this.findOptionById(question, previousOptionId);
      if (previousOption) {
        this.projectData.robotScores[previousOption.robotTypeId] -= question.points;
      }
    }

    this.projectData.selectedAnswers[questionId] = optionId;
    this.projectData.robotScores[selectedOption.robotTypeId] += question.points;
  }

  /* ─────────────────────────────────────────────
   * QUESTION FLOW
   * ───────────────────────────────────────────── */

  setCurrentQuestionIndex(index) {
    this.projectData.currentQuestionIndex = index;
  }

  goToNextQuestion() {
    this.projectData.currentQuestionIndex += 1;
  }

  resetQuestionFlow() {
    this.projectData.currentQuestionIndex = 0;
    this.projectData.selectedAnswers = {};
    this.projectData.robotScores = this.createEmptyRobotScores();
    this.projectData.selectedRobotType = null;
    this.projectData.selectedColor = null;

    // Destroy stale RevealScreen so it rebuilds fresh next time
    this.screens.reveal = null;
  }

  /* ─────────────────────────────────────────────
   * ROBOT TYPE CALCULATION
   * ───────────────────────────────────────────── */

  calculateFinalRobotType() {
    const selectedAnswerCount = Object.keys(this.projectData.selectedAnswers).length;

    // Nothing answered yet
    if (selectedAnswerCount === 0) {
      this.projectData.selectedRobotType = null;
      return null;
    }

    const scoreEntries = Object.entries(this.projectData.robotScores);
    let highestScore = -Infinity;
    scoreEntries.forEach(([, score]) => {
      if (score > highestScore) highestScore = score;
    });

    const tied = scoreEntries
      .filter(([, score]) => score === highestScore)
      .map(([type]) => type);

    if (tied.length === 0) return null;

    const result = tied.length === 1 ? tied[0] : this.breakTie(tied);
    this.projectData.selectedRobotType = result;
    return result;
  }

  // Tie-break: favour the robot type from the highest-weighted question answered
  breakTie(tiedTypes) {
    const questionsByPriority = this.getQuestionsByPriority();

    for (const question of questionsByPriority) {
      const answeredOptionId = this.projectData.selectedAnswers[question.id];
      if (!answeredOptionId) continue;

      const option = this.findOptionById(question, answeredOptionId);
      if (option && tiedTypes.includes(option.robotTypeId)) {
        return option.robotTypeId;
      }
    }

    // Fallback — return first tied type alphabetically for determinism
    return tiedTypes[0];
  }

  // Returns scored questions sorted by points descending, then by original index ascending
  getQuestionsByPriority() {
    const scored = this.getScoredQuestions();
    return [...scored].sort((a, b) => {
      const diff = b.points - a.points;
      return diff !== 0 ? diff : scored.indexOf(a) - scored.indexOf(b);
    });
  }

  /* ─────────────────────────────────────────────
   * COLOR
   * ───────────────────────────────────────────── */

  saveColor(colorId) {
    const valid = this.getAvailableColors().find(c => c.id === colorId);
    if (!valid) {
      console.warn(`saveColor: unknown colorId "${colorId}"`);
      return;
    }
    this.projectData.selectedColor = colorId;
  }

  getAvailableColors() {
    return this.robotsData?.colors ?? [];
  }

  /* ─────────────────────────────────────────────
   * ROBOT DATA ACCESSORS
   * ───────────────────────────────────────────── */

  getRobotTypeData(robotTypeId) {
    return this.robotsData?.robotTypes.find(r => r.id === robotTypeId) ?? null;
  }

  getSelectedRobotImagePath() {
    const { selectedRobotType, selectedColor } = this.projectData;
    if (!selectedRobotType || !selectedColor) return null;

    const data = this.getRobotTypeData(selectedRobotType);
    return data?.imagePaths[selectedColor] ?? null;
  }

  /* ─────────────────────────────────────────────
   * AUDIO STATE
   * ───────────────────────────────────────────── */

  saveRawAudio(data) {
    this.projectData.rawAudio = data;
    this.projectData.filteredAudio = null;
    this.projectData.audioStatus = {
      hasRecording: true,
      isConfirmed: false,
      isProcessing: false
    };
  }

  saveFilteredAudio(data) {
    this.projectData.filteredAudio = data;
    this.projectData.audioStatus = {
      hasRecording: true,
      isConfirmed: true,
      isProcessing: false
    };
  }

  setAudioProcessingState(isProcessing) {
    this.projectData.audioStatus.isProcessing = isProcessing;
  }

  resetAudioData() {
    this.projectData.rawAudio = null;
    this.projectData.filteredAudio = null;
    this.projectData.audioStatus = {
      hasRecording: false,
      isConfirmed: false,
      isProcessing: false
    };
  }

  /* ─────────────────────────────────────────────
   * FALLBACK SCREENS
   * ───────────────────────────────────────────── */

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