/*
 * VoiceScreen.js
 * Manages the voice recording, preview, and processing for RobotShopApp
 */

"use strict";

class VoiceScreen extends Screen {
  constructor(app) {
    super(app);

    this.voicePanelX = 100;
    this.voicePanelY = 70;
    this.voicePanelWidth = 760;
    this.voicePanelHeight = 400;

    this.buttonWidth = 220;
    this.buttonHeight = 50;
    this.buttonSpacing = 18;

    this.visibleButtons = [];
    this.voiceStatusMessage = "record a short voice sample for your robot";
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

  /* --------------------------------------------
   * SCREEN LIFECYCLE
   * -------------------------------------------- */

  enter() {
    this.stopPreviewAudio();
    this.refreshVoiceScreen();
  }

  update() {
    this.refreshVoiceScreen();
  }

  display() {
    this.displayBackground();
    this.displayFrame();
    this.displayVoicePanel();
    this.displayTitleText();
    this.displayInstructionText();
    this.displayRobotSummary();
    this.displayRecordingTimer();
    this.displayButtonRow();
    this.displayVoiceStatusText();
  }

  mousePressed() {
    const clickedButton = this.findClickedButton();
    if (!clickedButton) return;
    this.handleButtonClick(clickedButton.buttonId);
  }

  /* --------------------------------------------
   * UI BUILD & DISPLAY
   * -------------------------------------------- */

  refreshVoiceScreen() {
    this.buildVisibleButtons();

    // Update voiceStatusMessage dynamically
    if (this.statusMessageOverride) {
      this.voiceStatusMessage = this.statusMessageOverride;
    } else if (this.isRecording) {
      this.voiceStatusMessage = "recording in progress...";
    } else if (this.app.projectData.audioStatus.hasRecording) {
      this.voiceStatusMessage = "your recording is ready for preview or confirmation";
    } else {
      this.voiceStatusMessage = "record a short voice sample for your robot";
    }
  }

  buildVisibleButtons() {
    this.visibleButtons = [];
    const audioStatus = this.app.projectData.audioStatus;
    const buttonStartX = this.voicePanelX + 40;
    const buttonY = this.voicePanelY + 320;

    if (!audioStatus.hasRecording) {
      this.visibleButtons.push({
        buttonId: "record",
        label: this.getRecordButtonLabel(),
        x: buttonStartX,
        y: buttonY,
        width: this.buttonWidth,
        height: this.buttonHeight
      });
      return;
    }

    this.visibleButtons.push({ buttonId: "preview", label: "preview", x: buttonStartX, y: buttonY, width: this.buttonWidth, height: this.buttonHeight });
    this.visibleButtons.push({ buttonId: "recordAgain", label: "record again", x: buttonStartX + this.buttonWidth + this.buttonSpacing, y: buttonY, width: this.buttonWidth, height: this.buttonHeight });
    this.visibleButtons.push({ buttonId: "confirm", label: "confirm", x: buttonStartX + 2 * (this.buttonWidth + this.buttonSpacing), y: buttonY, width: this.buttonWidth, height: this.buttonHeight });
  }

  displayVoicePanel() {
    rectMode(CORNER);
    fill(255);
    stroke(20);
    strokeWeight(2);
    rect(this.voicePanelX, this.voicePanelY, this.voicePanelWidth, this.voicePanelHeight);
  }

  displayTitleText() {
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(30);
    text("give your robot a voice", this.voicePanelX + 30, this.voicePanelY + 30);
  }

  displayInstructionText() {
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(18);
    text("record up to 5 seconds of your voice", this.voicePanelX + 30, this.voicePanelY + 80);
    text("preview the raw audio first, then confirm it for the robot filter", this.voicePanelX + 30, this.voicePanelY + 108);
  }

  displayRobotSummary() {
    const selectedRobotLabel = this.getSelectedRobotLabel();
    const selectedColorLabel = this.getSelectedColorLabel();

    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(20);
    text(`robot type: ${selectedRobotLabel}`, this.voicePanelX + 30, this.voicePanelY + 155);
    text(`robot color: ${selectedColorLabel}`, this.voicePanelX + 30, this.voicePanelY + 185);
  }

  displayButtonRow() {
    this.visibleButtons.forEach(btn => {
      const isHovered = this.isMouseInsideButton(btn);
      fill(isHovered ? 230 : 245);
      stroke(20);
      strokeWeight(2);
      rect(btn.x, btn.y, btn.width, btn.height);

      fill(20);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(18);
      text(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
    });
  }

  displayRecordingTimer() {
    const maxSeconds = this.app.projectData.recordingDurationSeconds;
    const currentSeconds = this.getVisibleRecordingSeconds();
    const ratio = currentSeconds / maxSeconds;

    const x = this.voicePanelX + 30;
    const y = this.voicePanelY + 225;
    const widthBar = this.voicePanelWidth - 60;
    const heightBar = 18;

    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    text(`${this.getRecordingTimerLabel()}: ${currentSeconds.toFixed(1)} / ${maxSeconds.toFixed(1)} seconds`, x, y);

    fill(235);
    stroke(20);
    strokeWeight(2);
    rect(x, y + 28, widthBar, heightBar);

    fill(20);
    noStroke();
    rect(x, y + 28, widthBar * ratio, heightBar);
  }

  displayVoiceStatusText() {
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(18);
    text(this.voiceStatusMessage, this.voicePanelX + 30, this.voicePanelY + 280, this.voicePanelWidth - 60);
  }

  /* --------------------------------------------
   * BUTTON LOGIC
   * -------------------------------------------- */

  findClickedButton() {
    for (const btn of this.visibleButtons) {
      if (this.isMouseInsideButton(btn)) return btn;
    }
    return null;
  }

  isMouseInsideButton(btn) {
    return mouseX >= btn.x && mouseX <= btn.x + btn.width && mouseY >= btn.y && mouseY <= btn.y + btn.height;
  }

  async handleButtonClick(buttonId) {
    if (buttonId === "record") await this.handleRecordButton();
    else if (buttonId === "preview") await this.handlePreviewButton();
    else if (buttonId === "recordAgain") this.handleRecordAgainButton();
    else if (buttonId === "confirm") await this.handleConfirmButton();
  }

  getRecordButtonLabel() {
    return this.isRecording ? "stop record" : "start record";
  }

  getVisibleRecordingSeconds() {
    if (this.isRecording) return Math.min(this.app.projectData.recordingDurationSeconds, (Date.now() - this.recordingStartTime) / 1000);
    if (this.app.projectData.rawAudio) return this.app.projectData.rawAudio.durationSeconds;
    return 0;
  }

  getRecordingTimerLabel() {
    if (this.isRecording) return "recording time";
    if (this.app.projectData.rawAudio) return "recorded time";
    return "recording time";
  }

  /* --------------------------------------------
   * VOICE LOGIC
   * -------------------------------------------- */

  async handleRecordButton() {
    if (this.isRecording) { this.stopRecording(); return; }
    if (this.app.projectData.audioStatus.isProcessing) return;

    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.clearStoredAudioUrls();
    this.app.resetAudioData();

    this.statusMessageOverride = "requesting microphone access";

    try { await this.startRecording(); this.clearStatusOverride(); }
    catch (err) { this.stopRecordingState(); this.statusMessageOverride = "microphone access did not work"; console.error(err); }
  }

  async handlePreviewButton() {
    if (this.isRecording) return;
    const rawAudio = this.app.projectData.rawAudio;
    if (!rawAudio) return;

    this.stopPreviewAudio();
    this.statusMessageOverride = "playing your recorded voice now";
    this.previewAudioElement = new Audio(rawAudio.url);
    this.previewAudioElement.onended = () => { this.previewAudioElement = null; this.clearStatusOverride(); };

    try { await this.previewAudioElement.play(); }
    catch (err) { this.previewAudioElement = null; this.statusMessageOverride = "preview playback could not start"; console.error(err); }
  }

  handleRecordAgainButton() {
    if (this.isRecording) return;
    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.clearStoredAudioUrls();
    this.app.resetAudioData();
    this.refreshVoiceScreen();
  }

  async handleConfirmButton() {
    if (this.isRecording || this.app.projectData.audioStatus.isProcessing) return;
    const rawAudio = this.app.projectData.rawAudio;
    if (!rawAudio) return;

    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.app.setAudioProcessingState(true);

    try {
      const filtered = await this.createFilteredAudioData(rawAudio);
      if (this.app.projectData.filteredAudio) this.revokeAudioUrl(this.app.projectData.filteredAudio.url);
      this.app.saveFilteredAudio(filtered);
      this.clearStatusOverride();
      this.app.setScreen("reveal");
    }
    catch (err) {
      this.app.setAudioProcessingState(false);
      this.statusMessageOverride = "your audio could not be processed";
      console.error(err);
    }
  }

  /* --------------------------------------------
   * RECORDING / AUDIO HELPERS
   * -------------------------------------------- */

  async startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("media devices not available");

    if (typeof userStartAudio === "function") await userStartAudio();

    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = this.getSupportedRecordingMimeType() || undefined;
    this.recordedAudioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.mediaStream, mimeType ? { mimeType } : undefined);

    this.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) this.recordedAudioChunks.push(e.data); };
    this.mediaRecorder.onstop = () => { this.finishRecording(); };

    this.recordingStartTime = Date.now();
    this.mediaRecorder.start();

    this.isRecording = true;
    this.recordingTimeoutId = setTimeout(() => this.stopRecording(), this.app.projectData.recordingDurationSeconds * 1000);
  }

  stopRecording() {
    if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") return;
    this.mediaRecorder.stop();
  }

  finishRecording() {
    if (this.recordedAudioChunks.length === 0) { this.stopRecordingState(); this.statusMessageOverride = "no audio was captured"; return; }

    const duration = Math.min(this.app.projectData.recordingDurationSeconds, (Date.now() - this.recordingStartTime) / 1000);
    const blob = new Blob(this.recordedAudioChunks, { type: this.mediaRecorder.mimeType || "audio/webm" });
    const url = URL.createObjectURL(blob);

    this.app.saveRawAudio({ blob, url, mimeType: this.mediaRecorder.mimeType || "audio/webm", durationSeconds: duration });

    this.stopRecordingState();
    this.clearStatusOverride();
    this.refreshVoiceScreen();
  }

  stopRecordingState() {
    this.isRecording = false;
    this.recordedAudioChunks = [];
    this.recordingStartTime = 0;

    if (this.recordingTimeoutId) { clearTimeout(this.recordingTimeoutId); this.recordingTimeoutId = null; }
    if (this.mediaStream) { this.mediaStream.getTracks().forEach(t => t.stop()); this.mediaStream = null; }
    this.mediaRecorder = null;
  }

  getSupportedRecordingMimeType() {
    if (!MediaRecorder || !MediaRecorder.isTypeSupported) return "";
    const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
    for (const t of types) if (MediaRecorder.isTypeSupported(t)) return t;
    return "";
  }

  /* --------------------------------------------
   * AUDIO PROCESSING
   * -------------------------------------------- */

  async createFilteredAudioData(rawAudioData) {
    const arrayBuffer = await rawAudioData.blob.arrayBuffer();
    const ctx = this.getProcessingAudioContext();
    const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const filtered = this.createBitcrushedAudioBuffer(decoded);
    const blob = this.convertAudioBufferToWaveBlob(filtered);
    const url = URL.createObjectURL(blob);

    return { blob, url, mimeType: "audio/wav", durationSeconds: rawAudioData.durationSeconds, filterType: "bitcrushStatic" };
  }

  getProcessingAudioContext() {
    if (this.processingAudioContext) return this.processingAudioContext;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("audio context not available");
    this.processingAudioContext = new AudioContextClass();
    return this.processingAudioContext;
  }

  createBitcrushedAudioBuffer(srcBuffer) {
    const ch = srcBuffer.numberOfChannels;
    const len = srcBuffer.length;
    const sr = srcBuffer.sampleRate;
    const outBuffer = this.getProcessingAudioContext().createBuffer(ch, len, sr);

    const bitDepth = 5;
    const holdSamples = 6;
    const quantizeSteps = Math.pow(2, bitDepth - 1);
    const staticAmt = 0.02;

    for (let c = 0; c < ch; c++) {
      const src = srcBuffer.getChannelData(c);
      const dst = outBuffer.getChannelData(c);
      let held = 0;
      for (let i = 0; i < len; i++) {
        const val = src[i];
        if (i % holdSamples === 0) held = Math.round(val * quantizeSteps) / quantizeSteps;
        dst[i] = Math.max(-1, Math.min(1, held * 0.92 + (Math.random() * 2 - 1) * staticAmt));
      }
    }

    return outBuffer;
  }

  convertAudioBufferToWaveBlob(audioBuffer) {
    const ch = audioBuffer.numberOfChannels, len = audioBuffer.length, sr = audioBuffer.sampleRate;
    const bytesPerSample = 2, blockAlign = ch * bytesPerSample, dataSize = len * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    const interleaved = this.createInterleavedSampleData(audioBuffer);
    let idx = 0;

    idx = this.writeWaveText(view, idx, "RIFF");
    view.setUint32(idx, 36 + dataSize, true); idx += 4;
    idx = this.writeWaveText(view, idx, "WAVE");
    idx = this.writeWaveText(view, idx, "fmt ");
    view.setUint32(idx, 16, true); idx += 4;
    view.setUint16(idx, 1, true); idx += 2;
    view.setUint16(idx, ch, true); idx += 2;
    view.setUint32(idx, sr, true); idx += 4;
    view.setUint32(idx, sr * blockAlign, true); idx += 4;
    view.setUint16(idx, blockAlign, true); idx += 2;
    view.setUint16(idx, bytesPerSample * 8, true); idx += 2;
    idx = this.writeWaveText(view, idx, "data");
    view.setUint32(idx, dataSize, true); idx += 4;

    interleaved.forEach(v => {
      const clamped = Math.max(-1, Math.min(1, v));
      const pcm = clamped < 0 ? clamped * 32768 : clamped * 32767;
      view.setInt16(idx, pcm, true); idx += 2;
    });

    return new Blob([buffer], { type: "audio/wav" });
  }

  createInterleavedSampleData(audioBuffer) {
    const ch = audioBuffer.numberOfChannels, len = audioBuffer.length;
    const interleaved = new Float32Array(len * ch);
    let idx = 0;
    for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) interleaved[idx++] = audioBuffer.getChannelData(c)[i];
    return interleaved;
  }

  writeWaveText(view, start, text) {
    let idx = start;
    for (let i = 0; i < text.length; i++) view.setUint8(idx++, text.charCodeAt(i));
    return idx;
  }

  /* --------------------------------------------
   * MISC
   * -------------------------------------------- */

  stopPreviewAudio() {
    if (!this.previewAudioElement) return;
    this.previewAudioElement.pause();
    this.previewAudioElement.currentTime = 0;
    this.previewAudioElement = null;
  }

  clearStoredAudioUrls() {
    if (this.app.projectData.rawAudio) this.revokeAudioUrl(this.app.projectData.rawAudio.url);
    if (this.app.projectData.filteredAudio) this.revokeAudioUrl(this.app.projectData.filteredAudio.url);
  }

  revokeAudioUrl(url) {
    if (typeof url !== "string" || url.length === 0) return;
    URL.revokeObjectURL(url);
  }

  clearStatusOverride() {
    this.statusMessageOverride = null;
  }

  getSelectedRobotLabel() {
    const type = this.app.projectData.selectedRobotType;
    if (!type || !this.app.robotsData) return "not selected yet";
    const robot = this.app.robotsData.robotTypes.find(r => r.id === type);
    return robot?.label || "not selected yet";
  }

  getSelectedColorLabel() {
    const color = this.app.projectData.selectedColor;
    if (!color || !this.app.robotsData) return "not selected yet";
    const c = this.app.robotsData.colors.find(c => c.id === color);
    return c?.label || "not selected yet";
  }
}