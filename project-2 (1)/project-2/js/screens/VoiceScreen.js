/*
 * voice screen file
 * voice section content lives here
 */

"use strict";

class VoiceScreen extends Screen {
  constructor(app) {
    super(app);
    this.voicePanelX = 92;
    this.voicePanelY = 56;
    this.voicePanelWidth = 776;
    this.voicePanelHeight = 428;
    this.buttonWidth = 220;
    this.buttonHeight = 50;
    this.buttonSpacing = 18;
    this.visibleButtons = [];
    this.voiceStatusMessage = "Record a greeting for your robot";
    this.statusMessageOverride = null;
    this.mediaRecorder = null;
    this.mediaStream = null;
    this.recordedAudioChunks = [];
    this.recordingTimeoutId = null;
    this.recordingStartTime = 0;
    this.isRecording = false;
    this.previewAudioElement = null;
    this.processingAudioContext = null;
  }

  // voice screen state refreshes here when the screen opens
  enter() {
    this.stopPreviewAudio();
    this.refreshVoiceScreen();
  }

  // voice screen state keeps updating here
  update() {
    this.refreshVoiceScreen();
  }

  // voice screen drawing lives here
  display() {
    this.displayBackground();
    this.displayFrame();
    this.displayVoicePanel();
    this.displayTitleText();
    this.displayRecordingTimer();
    this.displayButtonRow();
    this.displayVoiceStatusText();
  }

  // the title is shown here
  displayTitleText() {
    push();
    fill(this.getVoiceStyleValue("--voice-text", "#2b2d42"));
    noStroke();
    textAlign(CENTER, TOP);
    textSize(this.getVoiceNumberValue("--voice-title-size", 30));
    text("Give your robot a voice", this.voicePanelX + 72, this.voicePanelY + 94, this.voicePanelWidth - 144);
    pop();
  }

  // mouse clicks check the current visible buttons here
  mousePressed() {
    const clickedButton = this.findClickedButton();

    if (clickedButton === null) {
      return;
    }

    this.handleButtonClick(clickedButton.buttonId);
  }

  // voice screen data and button visibility update here
  refreshVoiceScreen() {
    this.buildVisibleButtons();
    this.refreshVoiceStatusMessage();
  }

  // the current visible buttons are decided here
  buildVisibleButtons() {
    this.visibleButtons = [];

    const audioStatus = this.app.projectData.audioStatus;
    const tripleRowWidth = this.buttonWidth * 3 + this.buttonSpacing * 2;
    const buttonY = this.voicePanelY + 338;

    if (audioStatus.hasRecording === false) {
      this.visibleButtons.push({
        buttonId: "record",
        label: this.getRecordButtonLabel(),
        x: this.voicePanelX + (this.voicePanelWidth - this.buttonWidth) / 2,
        y: buttonY,
        width: this.buttonWidth,
        height: this.buttonHeight
      });

      return;
    }

    this.visibleButtons.push({
      buttonId: "preview",
      label: "preview",
      x: this.voicePanelX + (this.voicePanelWidth - tripleRowWidth) / 2,
      y: buttonY,
      width: this.buttonWidth,
      height: this.buttonHeight
    });

    this.visibleButtons.push({
      buttonId: "recordAgain",
      label: "record again",
      x: this.voicePanelX + (this.voicePanelWidth - tripleRowWidth) / 2 + this.buttonWidth + this.buttonSpacing,
      y: buttonY,
      width: this.buttonWidth,
      height: this.buttonHeight
    });

    this.visibleButtons.push({
      buttonId: "confirm",
      label: "confirm",
      x: this.voicePanelX + (this.voicePanelWidth - tripleRowWidth) / 2 + (this.buttonWidth + this.buttonSpacing) * 2,
      y: buttonY,
      width: this.buttonWidth,
      height: this.buttonHeight
    });
  }

  // the main voice panel is drawn here
  displayVoicePanel() {
    const panelRadius = this.getVoiceNumberValue("--voice-panel-radius", 28);

    push();
    rectMode(CORNER);
    noStroke();
    fill(this.getVoiceStyleValue("--voice-panel-shadow", "rgba(255, 255, 255, 0.35)"));
    rect(this.voicePanelX + 10, this.voicePanelY + 12, this.voicePanelWidth, this.voicePanelHeight, panelRadius);
    fill(this.getVoiceStyleValue("--voice-panel", "#fff9f7"));
    stroke(this.getVoiceStyleValue("--voice-text", "#2b2d42"));
    strokeWeight(this.getVoiceNumberValue("--voice-stroke-weight", 2));
    rect(this.voicePanelX, this.voicePanelY, this.voicePanelWidth, this.voicePanelHeight, panelRadius);
    fill(this.getVoiceStyleValue("--voice-panel-accent", "#d6f4e6"));
    noStroke();
    rect(this.voicePanelX + 28, this.voicePanelY + 24, this.voicePanelWidth - 56, 18, 10);
    pop();
  }

  // the current voice buttons are drawn here
  displayButtonRow() {
    this.visibleButtons.forEach((buttonData) => {
      const isHovered = this.isMouseInsideButton(buttonData);
      const buttonRadius = this.getVoiceNumberValue("--voice-button-radius", 14);
      const buttonColours = this.getButtonColours(buttonData.buttonId);

      push();
      if (isHovered === true) {
        fill(buttonColours.hoverColour);
      }
      else {
        fill(buttonColours.fillColour);
      }

      stroke(this.getVoiceStyleValue("--voice-text", "#2b2d42"));
      strokeWeight(this.getVoiceNumberValue("--voice-stroke-weight", 2));
      rect(buttonData.x, buttonData.y, buttonData.width, buttonData.height, buttonRadius);

      fill(this.getVoiceStyleValue("--voice-text", "#2b2d42"));
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(this.getVoiceNumberValue("--voice-body-size", 18));
      text(buttonData.label, buttonData.x + buttonData.width / 2, buttonData.y + buttonData.height / 2);
      pop();
    });
  }

  // the timer bar and time text are shown here
  displayRecordingTimer() {
    const maxRecordingSeconds = this.app.projectData.recordingDurationSeconds;
    const currentRecordingSeconds = this.getVisibleRecordingSeconds();
    const remainingSeconds = Math.max(0, Math.ceil(maxRecordingSeconds - currentRecordingSeconds));
    const timerRatio = currentRecordingSeconds / maxRecordingSeconds;
    const timerBarX = this.voicePanelX + 78;
    const timerBarY = this.voicePanelY + 176;
    const timerBarWidth = this.voicePanelWidth - 156;
    const timerBarHeight = 20;
    const timerFillHeight = 12;
    const timerFillY = timerBarY + 30 + (timerBarHeight - timerFillHeight) / 2;
    const timerFillWidth = timerBarWidth * timerRatio;

    push();
    fill(this.getVoiceStyleValue("--voice-subtitle", "#6e7285"));
    noStroke();
    textAlign(CENTER, TOP);
    textSize(this.getVoiceNumberValue("--voice-small-size", 16));
    text(`Countdown: ${remainingSeconds} seconds`, timerBarX + timerBarWidth / 2, timerBarY);

    fill(this.getVoiceStyleValue("--voice-timer-track", "#eef4ff"));
    stroke(this.getVoiceStyleValue("--voice-text", "#2b2d42"));
    strokeWeight(this.getVoiceNumberValue("--voice-stroke-weight", 2));
    rect(timerBarX, timerBarY + 30, timerBarWidth, timerBarHeight, 10);

    fill(this.getVoiceStyleValue("--voice-timer-fill", "#9ed8ff"));
    noStroke();
    rect(timerBarX + 4, timerFillY, Math.max(0, timerFillWidth - 8), timerFillHeight, 8);
    pop();
  }

  // the current voice status text is shown here
  displayVoiceStatusText() {
    push();
    fill(this.getVoiceStyleValue("--voice-subtitle", "#6e7285"));
    noStroke();
    textAlign(CENTER, TOP);
    textSize(this.getVoiceNumberValue("--voice-body-size", 18));
    text(this.voiceStatusMessage, this.voicePanelX + 100, this.voicePanelY + 278, this.voicePanelWidth - 200);
    pop();
  }

  // the voice screen uses a soft pastel background here
  displayBackground() {
    background(this.getVoiceStyleValue("--voice-background", "#fbf2ef"));
    const leftGlowX = CANVAS_WIDTH * 0.18;
    const leftGlowY = CANVAS_HEIGHT * 0.16;
    const rightGlowX = CANVAS_WIDTH * 0.84;
    const rightGlowY = CANVAS_HEIGHT * 0.78;
    const leftGlowSize = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.3;
    const rightGlowSize = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.36;

    noStroke();
    fill(this.getVoiceStyleValue("--voice-glow-blue", "rgba(211, 229, 255, 0.5)"));
    ellipse(leftGlowX, leftGlowY, leftGlowSize, leftGlowSize);
    fill(this.getVoiceStyleValue("--voice-glow-red", "rgba(248, 214, 221, 0.6)"));
    ellipse(rightGlowX, rightGlowY, rightGlowSize, rightGlowSize);
  }

  // one button colour set is chosen here
  getButtonColours(buttonId) {
    if (buttonId === "preview") {
      return {
        fillColour: this.getVoiceStyleValue("--voice-button-secondary", "#e3f1ff"),
        hoverColour: this.getVoiceStyleValue("--voice-button-secondary-hover", "#d3e7fb")
      };
    }

    if (buttonId === "recordAgain") {
      return {
        fillColour: this.getVoiceStyleValue("--voice-button-danger", "#ffe2dd"),
        hoverColour: this.getVoiceStyleValue("--voice-button-danger-hover", "#ffd4cd")
      };
    }

    return {
      fillColour: this.getVoiceStyleValue("--voice-button-primary", "#d6f4e6"),
      hoverColour: this.getVoiceStyleValue("--voice-button-primary-hover", "#c3e8d6")
    };
  }

  // one css style value is read here for the voice screen
  getVoiceStyleValue(variableName, fallbackValue) {
    const rootStyles = getComputedStyle(document.documentElement);
    const styleValue = rootStyles.getPropertyValue(variableName).trim();

    if (styleValue === "") {
      return fallbackValue;
    }

    return styleValue;
  }

  // one numeric css style value is read here for the voice screen
  getVoiceNumberValue(variableName, fallbackValue) {
    const styleValue = this.getVoiceStyleValue(variableName, `${fallbackValue}`);
    const parsedValue = Number(styleValue);

    if (Number.isNaN(parsedValue) === true) {
      return fallbackValue;
    }

    return parsedValue;
  }

  // the current status text is worked out here from the shared app state
  refreshVoiceStatusMessage() {
    const audioStatus = this.app.projectData.audioStatus;

    if (this.statusMessageOverride !== null) {
      this.voiceStatusMessage = this.statusMessageOverride;
      return;
    }

    if (this.isRecording === true) {
      this.voiceStatusMessage = "Recording now and it will stop automatically after 5 seconds";
      return;
    }

    if (audioStatus.isProcessing === true) {
      this.voiceStatusMessage = "Your robot voice is processing right now";
      return;
    }

    if (audioStatus.isConfirmed === true) {
      this.voiceStatusMessage = "Your robot voice is ready for the reveal";
      return;
    }

    if (audioStatus.hasRecording === true) {
      this.voiceStatusMessage = "Preview your audio or record again before you confirm it";
      return;
    }

    this.voiceStatusMessage = "Record a greeting for your robot";
  }

  // the record button label changes here while recording is active
  getRecordButtonLabel() {
    if (this.isRecording === true) {
      return "stop record";
    }

    return "start record";
  }

  // the visible recording seconds are worked out here for the timer
  getVisibleRecordingSeconds() {
    if (this.isRecording === true) {
      const elapsedSeconds = (Date.now() - this.recordingStartTime) / 1000;

      return Math.min(this.app.projectData.recordingDurationSeconds, elapsedSeconds);
    }

    if (this.app.projectData.rawAudio !== null) {
      return this.app.projectData.rawAudio.durationSeconds;
    }

    return 0;
  }

  // one clicked button is found here from the current mouse position
  findClickedButton() {
    for (const buttonData of this.visibleButtons) {
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

  // button clicks are sorted here by button id
  async handleButtonClick(buttonId) {
    this.app.playButtonBeep();

    if (buttonId === "record") {
      await this.handleRecordButton();
      return;
    }

    if (buttonId === "preview") {
      await this.handlePreviewButton();
      return;
    }

    if (buttonId === "recordAgain") {
      this.handleRecordAgainButton();
      return;
    }

    if (buttonId === "confirm") {
      await this.handleConfirmButton();
    }
  }

  // recording begins here after the microphone is allowed
  async handleRecordButton() {
    if (this.isRecording === true) {
      this.statusMessageOverride = "Stopping your recording now";
      this.stopRecording();
      return;
    }

    if (this.app.projectData.audioStatus.isProcessing === true) {
      return;
    }

    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.clearStoredAudioUrls();
    this.app.resetAudioData();

    try {
      await this.startRecording();
      this.clearStatusOverride();
    }
    catch (error) {
      this.stopRecordingState();
      this.statusMessageOverride = "Microphone access did not work";
      console.error(error);
    }
  }

  // the preview button plays the saved raw audio here
  async handlePreviewButton() {
    if (this.isRecording === true) {
      return;
    }

    const rawAudioData = this.app.projectData.rawAudio;

    if (rawAudioData === null) {
      return;
    }

    this.stopPreviewAudio();
    this.statusMessageOverride = "Playing your recorded voice now";
    this.previewAudioElement = new Audio(rawAudioData.url);
    this.previewAudioElement.onended = () => {
      this.previewAudioElement = null;
      this.clearStatusOverride();
    };

    try {
      await this.previewAudioElement.play();
    }
    catch (error) {
      this.previewAudioElement = null;
      this.statusMessageOverride = "Preview playback could not start";
      console.error(error);
    }
  }

  // the record again button resets the shared audio data here
  handleRecordAgainButton() {
    if (this.isRecording === true) {
      return;
    }

    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.clearStoredAudioUrls();
    this.app.resetAudioData();
    this.refreshVoiceScreen();
  }

  // the confirm button filters the raw audio and then moves into reveal
  async handleConfirmButton() {
    if (this.isRecording === true || this.app.projectData.audioStatus.isProcessing === true) {
      return;
    }

    const rawAudioData = this.app.projectData.rawAudio;

    if (rawAudioData === null) {
      return;
    }

    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.app.setAudioProcessingState(true);

    try {
      const filteredAudioData = await this.createFilteredAudioData(rawAudioData);

      if (this.app.projectData.filteredAudio !== null) {
        this.revokeAudioUrl(this.app.projectData.filteredAudio.url);
      }

      this.app.saveFilteredAudio(filteredAudioData);
      this.clearStatusOverride();
      this.app.setScreen("reveal");
    }
    catch (error) {
      this.app.setAudioProcessingState(false);
      this.statusMessageOverride = "your audio could not be processed";
      console.error(error);
    }
  }

  // microphone recording setup starts here
  async startRecording() {
    if (
      typeof navigator === "undefined" ||
      navigator.mediaDevices === undefined ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      throw new Error("media devices are not available");
    }

    if (typeof userStartAudio === "function") {
      await userStartAudio();
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    const supportedMimeType = this.getSupportedRecordingMimeType();
    let recorderOptions = undefined;

    if (supportedMimeType !== "") {
      recorderOptions = {
        mimeType: supportedMimeType
      };
    }

    this.recordedAudioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.mediaStream, recorderOptions);
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedAudioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.finishRecording();
    };

    this.recordingStartTime = Date.now();
    this.mediaRecorder.start();
    this.isRecording = true;
    this.recordingTimeoutId = window.setTimeout(() => {
      this.stopRecording();
    }, this.app.projectData.recordingDurationSeconds * 1000);
  }

  // the recorder stops here after the time limit or the next action
  stopRecording() {
    if (this.mediaRecorder === null) {
      return;
    }

    if (this.mediaRecorder.state === "inactive") {
      return;
    }

    this.mediaRecorder.stop();
  }

  // raw recording data is saved here after recording finishes
  finishRecording() {
    if (this.recordedAudioChunks.length === 0) {
      this.stopRecordingState();
      this.statusMessageOverride = "no audio was captured from the microphone";
      return;
    }

    const recordingDurationSeconds = Math.min(
      this.app.projectData.recordingDurationSeconds,
      (Date.now() - this.recordingStartTime) / 1000
    );
    const recordedMimeType = this.mediaRecorder.mimeType || "audio/webm";
    const rawAudioBlob = new Blob(this.recordedAudioChunks, {
      type: recordedMimeType
    });
    const rawAudioUrl = URL.createObjectURL(rawAudioBlob);

    this.app.saveRawAudio({
      blob: rawAudioBlob,
      url: rawAudioUrl,
      mimeType: recordedMimeType,
      durationSeconds: recordingDurationSeconds
    });

    this.stopRecordingState();
    this.clearStatusOverride();
    this.refreshVoiceScreen();
  }

  // recording helpers reset here after the recorder stops
  stopRecordingState() {
    this.isRecording = false;
    this.recordedAudioChunks = [];
    this.recordingStartTime = 0;

    if (this.recordingTimeoutId !== null) {
      window.clearTimeout(this.recordingTimeoutId);
      this.recordingTimeoutId = null;
    }

    if (this.mediaStream !== null) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });

      this.mediaStream = null;
    }

    this.mediaRecorder = null;
  }

  // a browser-friendly recording mime type is chosen here
  getSupportedRecordingMimeType() {
    if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") {
      return "";
    }

    const mimeTypeList = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4"
    ];

    for (const mimeType of mimeTypeList) {
      if (MediaRecorder.isTypeSupported(mimeType) === true) {
        return mimeType;
      }
    }

    return "";
  }

  // the raw recording is turned into filtered robot audio here
  async createFilteredAudioData(rawAudioData) {
    const arrayBuffer = await rawAudioData.blob.arrayBuffer();
    const processingAudioContext = this.getProcessingAudioContext();
    const decodedAudioBuffer = await processingAudioContext.decodeAudioData(arrayBuffer.slice(0));
    const filteredAudioBuffer = this.createBitcrushedAudioBuffer(decodedAudioBuffer);
    const filteredAudioBlob = this.convertAudioBufferToWaveBlob(filteredAudioBuffer);
    const filteredAudioUrl = URL.createObjectURL(filteredAudioBlob);

    return {
      blob: filteredAudioBlob,
      url: filteredAudioUrl,
      mimeType: "audio/wav",
      durationSeconds: rawAudioData.durationSeconds,
      filterType: "softBitcrushHighPitch",
      playbackRate: 1.16
    };
  }

  // the shared audio context for decoding and filtering is created here
  getProcessingAudioContext() {
    if (this.processingAudioContext !== null) {
      return this.processingAudioContext;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (AudioContextClass === undefined) {
      throw new Error("audio context is not available");
    }

    this.processingAudioContext = new AudioContextClass();
    return this.processingAudioContext;
  }

  // a softer bitcrush effect is built here for the robot voice
  createBitcrushedAudioBuffer(sourceAudioBuffer) {
    const channelCount = sourceAudioBuffer.numberOfChannels;
    const sampleCount = sourceAudioBuffer.length;
    const sampleRate = sourceAudioBuffer.sampleRate;
    const filteredAudioBuffer = this.getProcessingAudioContext().createBuffer(channelCount, sampleCount, sampleRate);
    const bitDepth = 5;
    const holdSampleCount = 5;
    const quantizeStepCount = Math.pow(2, bitDepth - 1);

    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
      const sourceChannelData = sourceAudioBuffer.getChannelData(channelIndex);
      const filteredChannelData = filteredAudioBuffer.getChannelData(channelIndex);
      let heldSampleValue = 0;

      for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
        const sourceSampleValue = sourceChannelData[sampleIndex];

        if (sampleIndex % holdSampleCount === 0) {
          heldSampleValue = Math.round(sourceSampleValue * quantizeStepCount) / quantizeStepCount;
        }

        const filteredSampleValue = sourceSampleValue * 0.24 + heldSampleValue * 0.76;
        filteredChannelData[sampleIndex] = Math.max(-1, Math.min(1, filteredSampleValue));
      }
    }

    return filteredAudioBuffer;
  }

  // the processed audio buffer is turned into a wav blob here
  convertAudioBufferToWaveBlob(audioBuffer) {
    const channelCount = audioBuffer.numberOfChannels;
    const sampleCount = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = channelCount * bytesPerSample;
    const dataSize = sampleCount * blockAlign;
    const waveArrayBuffer = new ArrayBuffer(44 + dataSize);
    const dataView = new DataView(waveArrayBuffer);
    const interleavedSampleData = this.createInterleavedSampleData(audioBuffer);
    let writeIndex = 0;

    writeIndex = this.writeWaveText(dataView, writeIndex, "RIFF");
    dataView.setUint32(writeIndex, 36 + dataSize, true);
    writeIndex += 4;
    writeIndex = this.writeWaveText(dataView, writeIndex, "WAVE");
    writeIndex = this.writeWaveText(dataView, writeIndex, "fmt ");
    dataView.setUint32(writeIndex, 16, true);
    writeIndex += 4;
    dataView.setUint16(writeIndex, 1, true);
    writeIndex += 2;
    dataView.setUint16(writeIndex, channelCount, true);
    writeIndex += 2;
    dataView.setUint32(writeIndex, sampleRate, true);
    writeIndex += 4;
    dataView.setUint32(writeIndex, sampleRate * blockAlign, true);
    writeIndex += 4;
    dataView.setUint16(writeIndex, blockAlign, true);
    writeIndex += 2;
    dataView.setUint16(writeIndex, bytesPerSample * 8, true);
    writeIndex += 2;
    writeIndex = this.writeWaveText(dataView, writeIndex, "data");
    dataView.setUint32(writeIndex, dataSize, true);
    writeIndex += 4;

    interleavedSampleData.forEach((sampleValue) => {
      const clampedSampleValue = Math.max(-1, Math.min(1, sampleValue));
      let pcmSampleValue = clampedSampleValue * 32767;

      if (clampedSampleValue < 0) {
        pcmSampleValue = clampedSampleValue * 32768;
      }

      dataView.setInt16(writeIndex, pcmSampleValue, true);
      writeIndex += 2;
    });

    return new Blob([waveArrayBuffer], {
      type: "audio/wav"
    });
  }

  // audio channel data is interleaved here for the wav file
  createInterleavedSampleData(audioBuffer) {
    const channelCount = audioBuffer.numberOfChannels;
    const sampleCount = audioBuffer.length;
    const interleavedSampleData = new Float32Array(sampleCount * channelCount);
    let sampleWriteIndex = 0;

    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
        interleavedSampleData[sampleWriteIndex] = audioBuffer.getChannelData(channelIndex)[sampleIndex];
        sampleWriteIndex += 1;
      }
    }

    return interleavedSampleData;
  }

  // wav header text is written here one letter at a time
  writeWaveText(dataView, startIndex, textValue) {
    let currentIndex = startIndex;

    for (let letterIndex = 0; letterIndex < textValue.length; letterIndex += 1) {
      dataView.setUint8(currentIndex, textValue.charCodeAt(letterIndex));
      currentIndex += 1;
    }

    return currentIndex;
  }

  // audio preview playback is stopped here if needed
  stopPreviewAudio() {
    if (this.previewAudioElement === null) {
      return;
    }

    this.previewAudioElement.pause();
    this.previewAudioElement.currentTime = 0;
    this.previewAudioElement = null;
  }

  // saved object urls are cleared here before replacing audio
  clearStoredAudioUrls() {
    if (this.app.projectData.rawAudio !== null) {
      this.revokeAudioUrl(this.app.projectData.rawAudio.url);
    }

    if (this.app.projectData.filteredAudio !== null) {
      this.revokeAudioUrl(this.app.projectData.filteredAudio.url);
    }
  }

  // one object url can be released here
  revokeAudioUrl(audioUrl) {
    if (typeof audioUrl !== "string" || audioUrl.length === 0) {
      return;
    }

    URL.revokeObjectURL(audioUrl);
  }

  // temporary status override text clears here
  clearStatusOverride() {
    this.statusMessageOverride = null;
  }
}
