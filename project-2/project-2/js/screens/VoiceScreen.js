/*
 * VoiceScreen.js
 * Handles voice recording, preview, and audio processing for RobotShopApp.
 * Sits between the question flow and the reveal screen.
 */

"use strict";

class VoiceScreen extends Screen {

  constructor(app) {
    super(app);

    // Panel layout
    this.panelX = 100;
    this.panelY = 70;
    this.panelW = 760;
    this.panelH = 400;

    // Button layout
    this.btnW = 220;
    this.btnH = 50;
    this.btnGap = 18;

    // UI state
    this.visibleButtons = [];
    this.statusMessage = "record a short voice sample for your robot";
    this.statusOverride = null;

    // Recording state
    this.mediaRecorder = null;
    this.mediaStream = null;
    this.audioChunks = [];
    this.recordingTimeoutId = null;
    this.recordingStartTime = 0;
    this.isRecording = false;

    // Playback / processing
    this.previewAudio = null;
    this.audioContext = null;
  }

  /* ─────────────────────────────────────────────
   * SCREEN LIFECYCLE
   * ───────────────────────────────────────────── */

  enter() {
    this.stopPreviewAudio();
    this.refresh();
  }

  update() {
    this.refresh();
  }

  display() {
    this.displayBackground();
    this.displayFrame();
    this.displayPanel();
    this.displayTitle();
    this.displayInstructions();
    this.displayRobotSummary();
    this.displayTimerBar();
    this.displayButtons();
    this.displayStatusText();
  }

  mousePressed() {
    const btn = this.getClickedButton();
    if (btn) this.handleButtonClick(btn.id);
  }

  /* ─────────────────────────────────────────────
   * STATE REFRESH
   * ───────────────────────────────────────────── */

  refresh() {
    this.buildButtons();
    this.updateStatusMessage();
  }

  updateStatusMessage() {
    if (this.statusOverride) {
      this.statusMessage = this.statusOverride;
      return;
    }

    if (this.isRecording) {
      this.statusMessage = "recording in progress...";
    } else if (this.app.projectData.audioStatus.hasRecording) {
      this.statusMessage = "your recording is ready — preview it or confirm to continue";
    } else {
      this.statusMessage = "record a short voice sample for your robot";
    }
  }

  /* ─────────────────────────────────────────────
   * BUTTON BUILDING
   * ───────────────────────────────────────────── */

  buildButtons() {
    this.visibleButtons = [];

    const startX = this.panelX + 40;
    const btnY = this.panelY + 320;
    const hasRecording = this.app.projectData.audioStatus.hasRecording;

    if (!hasRecording) {
      // Only show record / stop record
      this.visibleButtons.push(this.makeButton("record", this.getRecordLabel(), startX, btnY));
      return;
    }

    // Show preview / record again / confirm
    this.visibleButtons.push(this.makeButton("preview", "preview", startX, btnY));
    this.visibleButtons.push(this.makeButton("recordAgain", "record again", startX + (this.btnW + this.btnGap), btnY));
    this.visibleButtons.push(this.makeButton("confirm", "confirm", startX + 2 * (this.btnW + this.btnGap), btnY));
  }

  makeButton(id, label, x, y) {
    return { id, label, x, y, w: this.btnW, h: this.btnH };
  }

  getRecordLabel() {
    return this.isRecording ? "stop recording" : "start recording";
  }

  /* ─────────────────────────────────────────────
   * DISPLAY METHODS
   * ───────────────────────────────────────────── */

  displayPanel() {
    rectMode(CORNER);
    fill(255);
    stroke(20);
    strokeWeight(2);
    rect(this.panelX, this.panelY, this.panelW, this.panelH);
  }

  displayTitle() {
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(30);
    text("give your robot a voice", this.panelX + 30, this.panelY + 30);
  }

  displayInstructions() {
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(18);
    text("record up to 5 seconds of your voice", this.panelX + 30, this.panelY + 80);
    text("preview the raw audio first, then confirm it for robot filter", this.panelX + 30, this.panelY + 108);
  }

  displayRobotSummary() {
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(20);
    text(`robot type:  ${this.getRobotLabel()}`, this.panelX + 30, this.panelY + 155);
    text(`robot color: ${this.getColorLabel()}`, this.panelX + 30, this.panelY + 185);
  }

  displayTimerBar() {
    const maxSec = this.app.projectData.recordingDurationSeconds;
    const currentSec = this.getVisibleSeconds();
    const ratio = Math.min(1, currentSec / maxSec);

    const x = this.panelX + 30;
    const y = this.panelY + 225;
    const barW = this.panelW - 60;
    const barH = 18;

    // Label
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    text(`${this.getTimerLabel()}: ${currentSec.toFixed(1)} / ${maxSec.toFixed(1)} seconds`, x, y);

    // Background bar
    fill(235);
    stroke(20);
    strokeWeight(2);
    rect(x, y + 28, barW, barH);

    // Fill bar
    if (ratio > 0) {
      fill(20);
      noStroke();
      rect(x, y + 28, barW * ratio, barH);
    }
  }

  displayButtons() {
    this.visibleButtons.forEach(btn => {
      const hovered = this.isInsideButton(btn);

      fill(hovered ? 220 : 245);
      stroke(20);
      strokeWeight(2);
      rectMode(CORNER);
      rect(btn.x, btn.y, btn.w, btn.h);

      fill(20);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(18);
      text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    });
  }

  displayStatusText() {
    fill(20);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(18);
    text(this.statusMessage, this.panelX + 30, this.panelY + 280, this.panelW - 60);
  }

  /* ─────────────────────────────────────────────
   * BUTTON INTERACTION
   * ───────────────────────────────────────────── */

  getClickedButton() {
    return this.visibleButtons.find(btn => this.isInsideButton(btn)) || null;
  }

  isInsideButton(btn) {
    return mouseX >= btn.x && mouseX <= btn.x + btn.w &&
      mouseY >= btn.y && mouseY <= btn.y + btn.h;
  }

  async handleButtonClick(id) {
    switch (id) {
      case "record": await this.handleRecord(); break;
      case "preview": await this.handlePreview(); break;
      case "recordAgain": this.handleRecordAgain(); break;
      case "confirm": await this.handleConfirm(); break;
    }
  }

  /* ─────────────────────────────────────────────
   * BUTTON HANDLERS
   * ───────────────────────────────────────────── */

  async handleRecord() {
    // Toggle: if already recording, stop
    if (this.isRecording) {
      this.stopRecording();
      return;
    }

    // Block if audio is mid-processing
    if (this.app.projectData.audioStatus.isProcessing) return;

    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.revokeStoredAudioUrls();
    this.app.resetAudioData();

    this.setStatus("requesting microphone access...");

    try {
      await this.startRecording();
      this.clearStatusOverride();
    } catch (err) {
      this.stopRecordingState();
      this.setStatus("microphone access was denied or unavailable");
      console.error(err);
    }
  }

  async handlePreview() {
    if (this.isRecording) return;

    const raw = this.app.projectData.rawAudio;
    if (!raw) return;

    this.stopPreviewAudio();
    this.setStatus("playing your recorded voice...");

    this.previewAudio = new Audio(raw.url);
    this.previewAudio.onended = () => {
      this.previewAudio = null;
      this.clearStatusOverride();
    };

    try {
      await this.previewAudio.play();
    } catch (err) {
      this.previewAudio = null;
      this.setStatus("preview playback could not start");
      console.error(err);
    }
  }

  handleRecordAgain() {
    if (this.isRecording) return;
    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.revokeStoredAudioUrls();
    this.app.resetAudioData();
    this.refresh();
  }

  async handleConfirm() {
    if (this.isRecording || this.app.projectData.audioStatus.isProcessing) return;

    const raw = this.app.projectData.rawAudio;
    if (!raw) return;

    this.stopPreviewAudio();
    this.clearStatusOverride();
    this.app.setAudioProcessingState(true);
    this.setStatus("processing your audio...");

    try {
      const filtered = await this.applyRobotFilter(raw);

      // Revoke old filtered URL if one exists
      if (this.app.projectData.filteredAudio) {
        this.revokeUrl(this.app.projectData.filteredAudio.url);
      }

      this.app.saveFilteredAudio(filtered);
      this.clearStatusOverride();
      this.app.setScreen("reveal");
    } catch (err) {
      this.app.setAudioProcessingState(false);
      this.setStatus("audio could not be processed — please try recording again");
      console.error(err);
    }
  }

  /* ─────────────────────────────────────────────
   * RECORDING
   * ───────────────────────────────────────────── */

  async startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("mediaDevices.getUserMedia is not available in this browser");
    }

    // p5.js sound library sometimes requires this before audio can run
    if (typeof userStartAudio === "function") await userStartAudio();

    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType = this.getBestMimeType();
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(
      this.mediaStream,
      mimeType ? { mimeType } : undefined
    );

    this.mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };

    this.mediaRecorder.onstop = () => this.finishRecording();

    this.recordingStartTime = Date.now();
    this.isRecording = true;
    this.mediaRecorder.start();

    // Auto-stop after the max duration
    const maxMs = this.app.projectData.recordingDurationSeconds * 1000;
    this.recordingTimeoutId = setTimeout(() => this.stopRecording(), maxMs);
  }

  stopRecording() {
    if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") return;
    this.mediaRecorder.stop();
  }

  finishRecording() {
    if (this.audioChunks.length === 0) {
      this.stopRecordingState();
      this.setStatus("no audio was captured — please try again");
      return;
    }

    const duration = Math.min(
      this.app.projectData.recordingDurationSeconds,
      (Date.now() - this.recordingStartTime) / 1000
    );

    const mimeType = this.mediaRecorder.mimeType || "audio/webm";
    const blob = new Blob(this.audioChunks, { type: mimeType });
    const url = URL.createObjectURL(blob);

    this.app.saveRawAudio({ blob, url, mimeType, durationSeconds: duration });
    this.stopRecordingState();
    this.clearStatusOverride();
    this.refresh();
  }

  stopRecordingState() {
    this.isRecording = false;
    this.audioChunks = [];
    this.recordingStartTime = 0;

    if (this.recordingTimeoutId) {
      clearTimeout(this.recordingTimeoutId);
      this.recordingTimeoutId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }

    this.mediaRecorder = null;
  }

  getBestMimeType() {
    if (!window.MediaRecorder?.isTypeSupported) return "";
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
    return candidates.find(t => MediaRecorder.isTypeSupported(t)) || "";
  }

  /* ─────────────────────────────────────────────
   * AUDIO PROCESSING  (bitcrush + static filter)
   * ───────────────────────────────────────────── */

  async applyRobotFilter(rawAudio) {
    const arrayBuffer = await rawAudio.blob.arrayBuffer();
    const ctx = this.getAudioContext();
    const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const filtered = this.bitcrush(decoded);
    const blob = this.encodeToWav(filtered);
    const url = URL.createObjectURL(blob);

    return {
      blob,
      url,
      mimeType: "audio/wav",
      durationSeconds: rawAudio.durationSeconds,
      filterType: "bitcrushStatic"
    };
  }

  getAudioContext() {
    if (this.audioContext) return this.audioContext;

    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) throw new Error("Web Audio API is not available in this browser");

    this.audioContext = new Ctx();
    return this.audioContext;
  }

  bitcrush(srcBuffer) {
    const channels = srcBuffer.numberOfChannels;
    const length = srcBuffer.length;
    const sampleRate = srcBuffer.sampleRate;
    const outBuffer = this.getAudioContext().createBuffer(channels, length, sampleRate);

    const BIT_DEPTH = 5;
    const HOLD_SAMPLES = 6;
    const STATIC_AMT = 0.02;
    const steps = Math.pow(2, BIT_DEPTH - 1);

    for (let c = 0; c < channels; c++) {
      const src = srcBuffer.getChannelData(c);
      const dst = outBuffer.getChannelData(c);
      let held = 0;

      for (let i = 0; i < length; i++) {
        if (i % HOLD_SAMPLES === 0) {
          held = Math.round(src[i] * steps) / steps;
        }
        const noise = (Math.random() * 2 - 1) * STATIC_AMT;
        dst[i] = Math.max(-1, Math.min(1, held * 0.92 + noise));
      }
    }

    return outBuffer;
  }

  encodeToWav(audioBuffer) {
    const channels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = channels * bytesPerSample;
    const dataSize = length * blockAlign;

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    const pcm = this.interleave(audioBuffer);
    let offset = 0;

    // WAV header
    offset = this.writeStr(view, offset, "RIFF");
    view.setUint32(offset, 36 + dataSize, true); offset += 4;
    offset = this.writeStr(view, offset, "WAVE");
    offset = this.writeStr(view, offset, "fmt ");
    view.setUint32(offset, 16, true); offset += 4; // PCM chunk size
    view.setUint16(offset, 1, true); offset += 2; // PCM format
    view.setUint16(offset, channels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * blockAlign, true); offset += 4;
    view.setUint16(offset, blockAlign, true); offset += 2;
    view.setUint16(offset, bytesPerSample * 8, true); offset += 2;
    offset = this.writeStr(view, offset, "data");
    view.setUint32(offset, dataSize, true); offset += 4;

    // PCM samples
    pcm.forEach(v => {
      const clamped = Math.max(-1, Math.min(1, v));
      const pcmVal = clamped < 0 ? clamped * 32768 : clamped * 32767;
      view.setInt16(offset, pcmVal, true);
      offset += 2;
    });

    return new Blob([buffer], { type: "audio/wav" });
  }

  interleave(audioBuffer) {
    const channels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const result = new Float32Array(length * channels);
    let idx = 0;

    for (let i = 0; i < length; i++) {
      for (let c = 0; c < channels; c++) {
        result[idx++] = audioBuffer.getChannelData(c)[i];
      }
    }

    return result;
  }

  writeStr(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset++, str.charCodeAt(i));
    }
    return offset;
  }

  /* ─────────────────────────────────────────────
   * HELPERS
   * ───────────────────────────────────────────── */

  stopPreviewAudio() {
    if (!this.previewAudio) return;
    this.previewAudio.pause();
    this.previewAudio.currentTime = 0;
    this.previewAudio = null;
  }

  revokeStoredAudioUrls() {
    if (this.app.projectData.rawAudio) this.revokeUrl(this.app.projectData.rawAudio.url);
    if (this.app.projectData.filteredAudio) this.revokeUrl(this.app.projectData.filteredAudio.url);
  }

  revokeUrl(url) {
    if (typeof url === "string" && url.length > 0) URL.revokeObjectURL(url);
  }

  setStatus(msg) {
    this.statusOverride = msg;
  }

  clearStatusOverride() {
    this.statusOverride = null;
  }

  getVisibleSeconds() {
    if (this.isRecording) {
      return Math.min(
        this.app.projectData.recordingDurationSeconds,
        (Date.now() - this.recordingStartTime) / 1000
      );
    }
    return this.app.projectData.rawAudio?.durationSeconds ?? 0;
  }

  getTimerLabel() {
    if (this.isRecording) return "recording time";
    if (this.app.projectData.rawAudio) return "recorded time";
    return "recording time";
  }

  getRobotLabel() {
    const type = this.app.projectData.selectedRobotType;
    if (!type || !this.app.robotsData) return "not selected yet";
    return this.app.robotsData.robotTypes.find(r => r.id === type)?.label ?? "not selected yet";
  }

  getColorLabel() {
    const colorId = this.app.projectData.selectedColor;
    if (!colorId || !this.app.robotsData) return "not selected yet";
    return this.app.robotsData.colors.find(c => c.id === colorId)?.label ?? "not selected yet";
  }
}