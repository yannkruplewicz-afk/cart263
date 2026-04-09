/*
 * RevealScreen.js
 *
 * Robots are built entirely from Three.js geometry — no image files needed.
 * Style reference: rounded plastic body, black rubber joints, glowing eyes,
 * humanoid proportions (like the yellow robot in the reference image).
 *
 * Each robot type has unique proportions / silhouette:
 *   companion → warm humanoid, rounded, friendly proportions
 *   domestic  → compact, squat, wide stable base
 *   security  → tall, broad shoulders, angular, heavy
 *   social    → slim, expressive, large emotive eyes
 *   utility   → asymmetric, one large tool arm, utilitarian
 *
 * Body color comes from the player's selected color.
 * Joints are always dark rubber (#1a1a1a).
 * Eyes always glow cyan (#00eeff) with a PointLight behind them.
 *
 * Animation layers:
 *   Layer 1 — robot-type entrance + idle  (character personality)
 *   Layer 2 — color theme particles/FX   (mood atmosphere)
 */

"use strict";

class RevealScreen {

  constructor(app) {
    this.app = app;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.robotGroup = null;  // entire robot lives here
    this.packageMesh = null;
    this.accentLight = null;
    this.eyeLight = null;
    this.extraMeshes = [];

    // Robot limb references for animation
    this.limbs = {};

    this.isOpened = false;
    this.animStartTime = 0;
    this._loopCancelled = false;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.audioElement = null;
  }

  /* ─────────────────────────────────────────────
   * LIFECYCLE
   * ───────────────────────────────────────────── */

  enter() {
    this.cleanup();
    this._loopCancelled = false;
    this.init();
  }

  update() { }
  display() { }

  mousePressed() {
    this.mouse.x = (mouseX / width) * 2 - 1;
    this.mouse.y = -(mouseY / height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 🎁 BEFORE opening → click on box
    if (!this.isOpened && this.packageMesh) {
      if (this.raycaster.intersectObject(this.packageMesh, true).length > 0) {
        this.playFilteredAudio(); // first play
        this.openPackage();
      }
      return;
    }

    // 🔁 AFTER reveal → ANY click replays song
    if (this.isOpened) {
      this.playFilteredAudio();
    }
  }

  /* ─────────────────────────────────────────────
   * INIT
   * ───────────────────────────────────────────── */

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.createPackage();
    this.renderLoop();
  }

  setupRenderer() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.055);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const el = this.renderer.domElement;
    el.style.position = "absolute";
    el.style.top = "0";
    el.style.left = "0";
    el.style.pointerEvents = "none";
    document.body.appendChild(el);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      55, window.innerWidth / window.innerHeight, 0.1, 100
    );
    this.camera.position.set(0, 1, 7);
    this.camera.lookAt(0, 0.5, 0);
  }

  setupLights() {
    // Soft ambient
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    // Main key light — warm from top-right
    const key = new THREE.DirectionalLight(0xfff4e0, 1.4);
    key.position.set(4, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    this.scene.add(key);

    // Cool fill from left
    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.4);
    fill.position.set(-5, 2, 3);
    this.scene.add(fill);

    // Rim light from behind
    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(0, -2, -5);
    this.scene.add(rim);

    // Color accent point light — tinted by robot color
    this.accentLight = new THREE.PointLight(this.getColorHex(), 2.0, 10);
    this.accentLight.position.set(0, 1, 2);
    this.scene.add(this.accentLight);

    // Ground shadow plane
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.2;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);
  }

  /* ─────────────────────────────────────────────
   * PACKAGE (spinning box before reveal)
   * ───────────────────────────────────────────── */

  createPackage() {
    const geo = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.getColorHex()),
      roughness: 0.3,
      metalness: 0.4,
      envMapIntensity: 1.0
    });
    this.packageMesh = new THREE.Mesh(geo, mat);
    this.packageMesh.castShadow = true;
    this.scene.add(this.packageMesh);

    // Subtle wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    this.packageMesh.add(wireMesh);
  }
  openPackage() {
    this.isOpened = true;
    this.animStartTime = performance.now();

    // ✅ ADD THIS HERE
    this.playFilteredAudio();


    const shrink = () => {
      if (this._loopCancelled) return;
      const t = Math.min(1, (performance.now() - this.animStartTime) / 600);
      const s = 1 - this.easeInCubic(t);

      if (this.packageMesh) {
        this.packageMesh.scale.setScalar(Math.max(0.001, s));
        this.packageMesh.rotation.y += 0.06;
        this.packageMesh.rotation.x += 0.03;
      }

      if (t < 1) {
        requestAnimationFrame(shrink);
      } else {
        this.scene.remove(this.packageMesh);
        this.packageMesh = null;
        this.buildAndRevealRobot();
      }
    };
    requestAnimationFrame(shrink);
  }

  /* ─────────────────────────────────────────────
   * ROBOT BUILDER — dispatches by type
   * ───────────────────────────────────────────── */

  buildAndRevealRobot() {
    this.robotGroup = new THREE.Group();
    this.limbs = {};

    const type = this.app.projectData.selectedRobotType;
    switch (type) {
      case "companion": this.buildCompanion(); break;
      case "domestic": this.buildDomestic(); break;
      case "security": this.buildSecurity(); break;
      case "social": this.buildSocial(); break;
      case "utility": this.buildUtility(); break;
      default: this.buildCompanion(); break;
    }

    this.scene.add(this.robotGroup);
    this.startRobotAnimation();
    this.startColorTheme();
  }

  /* ─────────────────────────────────────────────
   * SHARED MATERIAL FACTORIES
   * ───────────────────────────────────────────── */

  bodyMat(opacity = 1) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.getColorHex()),
      roughness: 0.25,
      metalness: 0.35,
      transparent: opacity < 1,
      opacity
    });
  }

  jointMat() {
    return new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0.1
    });
  }

  eyeMat() {
    return new THREE.MeshStandardMaterial({
      color: 0x00eeff,
      emissive: new THREE.Color(0x00eeff),
      emissiveIntensity: 2.5,
      roughness: 0.0,
      metalness: 0.0
    });
  }

  // Helpers to add mesh and optionally cast shadows
  add(mesh, parent, castShadow = true) {
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    (parent ?? this.robotGroup).add(mesh);
    return mesh;
  }

  sphere(r, mat, parent, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), mat);
    m.position.set(x, y, z);
    return this.add(m, parent);
  }

  box(w, h, d, mat, parent, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    return this.add(m, parent);
  }

  cyl(rt, rb, h, mat, parent, x = 0, y = 0, z = 0, rx = 0) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 20), mat);
    m.position.set(x, y, z);
    m.rotation.x = rx;
    return this.add(m, parent);
  }

  addEyeLight(parent, x = 0, y = 0, z = 0) {
    this.eyeLight = new THREE.PointLight(0x00eeff, 1.8, 3.5);
    this.eyeLight.position.set(x, y, z + 0.3);
    parent.add(this.eyeLight);
  }

  /* ─────────────────────────────────────────────
   * ROBOT BUILDS
   * ───────────────────────────────────────────── */

  // ── COMPANION ── warm humanoid, friendly rounded proportions
  buildCompanion() {
    const g = this.robotGroup;
    const B = this.bodyMat(), J = this.jointMat(), E = this.eyeMat();

    // Head
    const head = new THREE.Group();
    head.position.set(0, 2.55, 0);
    g.add(head);
    this.sphere(0.52, B, head);
    // Eyes
    this.sphere(0.13, E, head, -0.18, 0.08, 0.43);
    this.sphere(0.13, E, head, 0.18, 0.08, 0.43);
    this.addEyeLight(head, 0, 0.08, 0.43);
    // Ear nubs
    this.sphere(0.08, J, head, -0.52, 0, 0);
    this.sphere(0.08, J, head, 0.52, 0, 0);
    // Mouth indicator
    this.cyl(0.04, 0.04, 0.28, J, head, 0, -0.22, 0.46, Math.PI / 2);
    this.limbs.head = head;

    // Neck
    this.cyl(0.14, 0.16, 0.28, J, g, 0, 2.18, 0);

    // Torso
    const torso = new THREE.Group();
    torso.position.set(0, 1.3, 0);
    g.add(torso);
    this.add(new THREE.Mesh(new THREE.SphereGeometry(0.68, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55), B), torso);
    // Chest core glow
    this.sphere(0.18, E, torso, 0, 0.05, 0.6);
    this.limbs.torso = torso;

    // Pelvis
    this.sphere(0.44, B, g, 0, 0.5, 0);
    this.sphere(0.22, J, g, 0, 0.32, 0);

    // LEFT ARM
    const lArm = new THREE.Group();
    lArm.position.set(-0.85, 1.7, 0);
    g.add(lArm);
    this.sphere(0.22, J, lArm);                         // shoulder joint
    this.cyl(0.14, 0.12, 0.65, B, lArm, 0, -0.38, 0);  // upper arm
    this.sphere(0.14, J, lArm, 0, -0.72, 0);            // elbow
    this.cyl(0.11, 0.09, 0.55, B, lArm, 0, -1.06, 0);  // forearm
    this.sphere(0.13, J, lArm, 0, -1.37, 0);            // wrist
    // Hand
    this.box(0.26, 0.22, 0.18, B, lArm, 0, -1.58, 0);
    // Fingers
    for (let i = -1; i <= 1; i++) {
      this.cyl(0.035, 0.03, 0.18, B, lArm, i * 0.085, -1.76, 0.04);
    }
    this.limbs.lArm = lArm;

    // RIGHT ARM — slightly raised (waving)
    const rArm = new THREE.Group();
    rArm.position.set(0.85, 1.7, 0);
    rArm.rotation.z = -0.5;
    g.add(rArm);
    this.sphere(0.22, J, rArm);
    this.cyl(0.14, 0.12, 0.65, B, rArm, 0, -0.38, 0);
    this.sphere(0.14, J, rArm, 0, -0.72, 0);
    this.cyl(0.11, 0.09, 0.55, B, rArm, 0, -1.06, 0);
    this.sphere(0.13, J, rArm, 0, -1.37, 0);
    this.box(0.26, 0.22, 0.18, B, rArm, 0, -1.58, 0);
    for (let i = -1; i <= 1; i++) {
      this.cyl(0.035, 0.03, 0.18, B, rArm, i * 0.085, -1.76, 0.04);
    }
    this.limbs.rArm = rArm;

    // LEGS
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.32, 0.3, 0);
      g.add(leg);
      this.sphere(0.2, J, leg);
      this.cyl(0.16, 0.14, 0.75, B, leg, 0, -0.48, 0);
      this.sphere(0.16, J, leg, 0, -0.88, 0);
      this.cyl(0.13, 0.11, 0.65, B, leg, 0, -1.26, 0);
      this.sphere(0.13, J, leg, 0, -1.62, 0);
      this.box(0.28, 0.12, 0.42, B, leg, 0.04 * side, -1.8, 0.06);
      if (side === -1) this.limbs.lLeg = leg;
      else this.limbs.rLeg = leg;
    }

    this.robotGroup.position.y = -2.2;
  }

  // ── DOMESTIC ── compact, squat, wide stable base — cleaner helper
  buildDomestic() {
    const g = this.robotGroup;
    const B = this.bodyMat(), J = this.jointMat(), E = this.eyeMat();

    // Wide rounded torso (main body)
    const torso = new THREE.Group();
    torso.position.set(0, 0.6, 0);
    g.add(torso);
    this.add(new THREE.Mesh(new THREE.SphereGeometry(0.78, 28, 28), B), torso);
    // Chest panel recess
    this.box(0.5, 0.35, 0.05, J, torso, 0, 0.1, 0.76);
    // Status light strip
    this.cyl(0.06, 0.06, 0.4, E, torso, 0, 0.1, 0.77, Math.PI / 2);
    this.limbs.torso = torso;

    // Head (small, nestled on top)
    const head = new THREE.Group();
    head.position.set(0, 1.52, 0);
    g.add(head);
    this.sphere(0.38, B, head);
    // Wide visor eyes
    this.box(0.52, 0.12, 0.06, E, head, 0, 0.06, 0.36);
    this.addEyeLight(head, 0, 0.06, 0.3);
    this.limbs.head = head;

    // Short neck
    this.cyl(0.18, 0.22, 0.2, J, g, 0, 1.3, 0);

    // SHORT ARMS — stubby, practical
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.88, 0.85, 0);
      arm.rotation.z = side * 0.3;
      g.add(arm);
      this.sphere(0.18, J, arm);
      this.cyl(0.13, 0.11, 0.52, B, arm, 0, -0.31, 0);
      this.sphere(0.12, J, arm, 0, -0.6, 0);
      // Tool/gripper end
      this.cyl(0.1, 0.14, 0.28, B, arm, 0, -0.82, 0);
      this.box(0.3, 0.08, 0.22, J, arm, 0, -1.02, 0);
      if (side === -1) this.limbs.lArm = arm;
      else this.limbs.rArm = arm;
    }

    // WIDE SQUAT BASE (no legs, disc base)
    this.cyl(0.7, 0.85, 0.28, J, g, 0, -0.48, 0);
    this.cyl(0.85, 0.9, 0.14, B, g, 0, -0.68, 0);

    // Small wheels visible at base
    for (const wx of [-0.6, 0, 0.6]) {
      this.sphere(0.1, J, g, wx, -0.82, 0.6);
    }

    this.robotGroup.position.y = -1.5;
  }

  // ── SECURITY ── tall, broad, angular, heavy — intimidating
  buildSecurity() {
    const g = this.robotGroup;
    const B = this.bodyMat(), J = this.jointMat(), E = this.eyeMat();

    // BROAD ANGULAR TORSO
    const torso = new THREE.Group();
    torso.position.set(0, 1.1, 0);
    g.add(torso);
    this.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 0.72), B), torso);
    // Shoulder pads
    this.box(0.42, 0.22, 0.68, B, torso, -0.88, 0.44, 0);
    this.box(0.42, 0.22, 0.68, B, torso, 0.88, 0.44, 0);
    // Chest grill
    for (let i = -2; i <= 2; i++) {
      this.box(0.72, 0.04, 0.05, J, torso, 0, i * 0.1, 0.37);
    }
    // Sensor eye (single, centered)
    this.sphere(0.16, E, torso, 0, 0.3, 0.38);
    this.limbs.torso = torso;

    // HEAVY ANGULAR HEAD
    const head = new THREE.Group();
    head.position.set(0, 1.88, 0);
    g.add(head);
    this.add(new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.68, 0.72), B), head);
    // Visor
    this.box(0.62, 0.18, 0.06, E, head, 0, 0.08, 0.37);
    this.addEyeLight(head, 0, 0.08, 0.3);
    // Antenna
    this.cyl(0.03, 0.03, 0.34, J, head, 0.28, 0.52, 0);
    this.sphere(0.06, E, head, 0.28, 0.7, 0);
    this.limbs.head = head;

    // Thick neck
    this.box(0.38, 0.22, 0.36, J, g, 0, 1.58, 0);

    // HEAVY ARMS
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 1.12, 1.35, 0);
      g.add(arm);
      this.sphere(0.2, J, arm);
      this.box(0.28, 0.68, 0.28, B, arm, 0, -0.44, 0);
      this.sphere(0.18, J, arm, 0, -0.82, 0);
      this.box(0.24, 0.58, 0.24, B, arm, 0, -1.18, 0);
      // Fist / sensor block
      this.box(0.32, 0.32, 0.32, J, arm, 0, -1.56, 0);
      if (side === -1) this.limbs.lArm = arm;
      else this.limbs.rArm = arm;
    }

    // THICK LEGS
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.42, 0.38, 0);
      g.add(leg);
      this.sphere(0.22, J, leg);
      this.box(0.34, 0.72, 0.34, B, leg, 0, -0.46, 0);
      this.sphere(0.2, J, leg, 0, -0.86, 0);
      this.box(0.3, 0.66, 0.3, B, leg, 0, -1.24, 0);
      this.box(0.36, 0.16, 0.52, B, leg, 0.03 * side, -1.66, 0.06);
      if (side === -1) this.limbs.lLeg = leg;
      else this.limbs.rLeg = leg;
    }

    this.robotGroup.position.y = -2.5;
  }

  // ── SOCIAL ── slim, expressive, large emotive eyes, elegant
  buildSocial() {
    const g = this.robotGroup;
    const B = this.bodyMat(), J = this.jointMat(), E = this.eyeMat();

    // SLIM ELEGANT HEAD — large expressive eyes
    const head = new THREE.Group();
    head.position.set(0, 2.7, 0);
    g.add(head);
    this.sphere(0.48, B, head);
    // Large emotive eyes
    this.sphere(0.17, E, head, -0.2, 0.1, 0.42);
    this.sphere(0.17, E, head, 0.2, 0.1, 0.42);
    // Eye rings
    this.add(new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.025, 8, 32), J), head).position.set(-0.2, 0.1, 0.41);
    this.add(new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.025, 8, 32), J), head).position.set(0.2, 0.1, 0.41);
    this.addEyeLight(head, 0, 0.1, 0.4);
    // Smile curve
    this.add(new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 16, Math.PI), J), head).position.set(0, -0.16, 0.44);
    this.limbs.head = head;

    // Slim neck
    this.cyl(0.1, 0.13, 0.36, J, g, 0, 2.34, 0);

    // SLIM TORSO with elegant waist
    const torso = new THREE.Group();
    torso.position.set(0, 1.5, 0);
    g.add(torso);
    // Chest
    this.add(new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), B), torso).position.y = 0.1;
    // Waist pinch
    this.cyl(0.28, 0.36, 0.38, B, torso, 0, -0.3, 0);
    // Chest heart/speaker grill
    this.add(new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 32), E), torso).position.set(0, 0.18, 0.5);
    this.limbs.torso = torso;

    // SLIM EXPRESSIVE ARMS
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.7, 1.88, 0);
      arm.rotation.z = side * 0.2;
      g.add(arm);
      this.sphere(0.16, J, arm);
      this.cyl(0.1, 0.08, 0.62, B, arm, 0, -0.36, 0);
      this.sphere(0.11, J, arm, 0, -0.7, 0);
      this.cyl(0.08, 0.06, 0.52, B, arm, 0, -1.0, 0);
      this.sphere(0.1, J, arm, 0, -1.28, 0);
      // Elegant hand
      this.sphere(0.12, B, arm, 0, -1.46, 0);
      for (let i = -1; i <= 1; i++) {
        this.cyl(0.025, 0.02, 0.2, B, arm, i * 0.065, -1.66, 0.02);
      }
      if (side === -1) this.limbs.lArm = arm;
      else this.limbs.rArm = arm;
    }

    // SLIM LEGS
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.26, 0.62, 0);
      g.add(leg);
      this.sphere(0.16, J, leg);
      this.cyl(0.12, 0.1, 0.72, B, leg, 0, -0.46, 0);
      this.sphere(0.12, J, leg, 0, -0.84, 0);
      this.cyl(0.09, 0.08, 0.62, B, leg, 0, -1.18, 0);
      this.sphere(0.1, J, leg, 0, -1.52, 0);
      this.box(0.24, 0.1, 0.38, B, leg, 0.03 * side, -1.68, 0.06);
      if (side === -1) this.limbs.lLeg = leg;
      else this.limbs.rLeg = leg;
    }

    this.robotGroup.position.y = -2.3;
  }

  // ── UTILITY ── asymmetric, one big tool arm, rugged practical
  buildUtility() {
    const g = this.robotGroup;
    const B = this.bodyMat(), J = this.jointMat(), E = this.eyeMat();

    // BOXY RUGGED TORSO
    const torso = new THREE.Group();
    torso.position.set(0, 1.05, 0);
    g.add(torso);
    this.add(new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 0.68), B), torso);
    // Panel details
    this.box(0.3, 0.3, 0.06, J, torso, -0.28, 0.18, 0.36);
    this.box(0.3, 0.3, 0.06, J, torso, 0.22, -0.1, 0.36);
    this.box(0.12, 0.12, 0.06, E, torso, 0.3, 0.22, 0.36);
    this.limbs.torso = torso;

    // HEAD — angular, asymmetric
    const head = new THREE.Group();
    head.position.set(-0.08, 1.76, 0);
    g.add(head);
    this.add(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.62, 0.66), B), head);
    // Asymmetric eyes — one big scanner, one small
    this.sphere(0.16, E, head, -0.16, 0.06, 0.36);
    this.sphere(0.09, E, head, 0.2, 0.06, 0.36);
    this.addEyeLight(head, 0, 0.06, 0.3);
    // Vent slats
    for (let i = 0; i < 3; i++) {
      this.box(0.22, 0.04, 0.06, J, head, 0.18, -0.08 + i * 0.1, 0.35);
    }
    this.limbs.head = head;

    // Neck
    this.box(0.3, 0.2, 0.3, J, g, -0.08, 1.5, 0);

    // LEFT ARM — normal
    const lArm = new THREE.Group();
    lArm.position.set(-0.68, 1.42, 0);
    lArm.rotation.z = 0.15;
    g.add(lArm);
    this.sphere(0.17, J, lArm);
    this.cyl(0.12, 0.1, 0.58, B, lArm, 0, -0.35, 0);
    this.sphere(0.13, J, lArm, 0, -0.66, 0);
    this.cyl(0.1, 0.08, 0.5, B, lArm, 0, -0.98, 0);
    this.box(0.24, 0.2, 0.16, J, lArm, 0, -1.28, 0);
    this.limbs.lArm = lArm;

    // RIGHT ARM — large hydraulic tool arm
    const rArm = new THREE.Group();
    rArm.position.set(0.72, 1.52, 0);
    rArm.rotation.z = -0.2;
    g.add(rArm);
    this.sphere(0.22, J, rArm);
    this.cyl(0.2, 0.17, 0.7, B, rArm, 0, -0.42, 0);
    this.sphere(0.19, J, rArm, 0, -0.8, 0);
    this.cyl(0.16, 0.14, 0.6, B, rArm, 0, -1.18, 0);
    // Tool head — claw / drill
    this.box(0.38, 0.14, 0.38, J, rArm, 0, -1.55, 0);
    this.cyl(0.12, 0.04, 0.34, B, rArm, 0, -1.78, 0.1);
    this.cyl(0.12, 0.04, 0.34, B, rArm, 0.12, -1.72, -0.08);
    this.cyl(0.12, 0.04, 0.34, B, rArm, -0.12, -1.72, -0.08);
    this.limbs.rArm = rArm;

    // LEGS — stocky
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.34, 0.4, 0);
      g.add(leg);
      this.sphere(0.2, J, leg);
      this.box(0.3, 0.7, 0.3, B, leg, 0, -0.44, 0);
      this.sphere(0.18, J, leg, 0, -0.84, 0);
      this.box(0.26, 0.6, 0.26, B, leg, 0, -1.2, 0);
      this.box(0.36, 0.14, 0.5, B, leg, 0.04 * side, -1.58, 0.08);
      if (side === -1) this.limbs.lLeg = leg;
      else this.limbs.rLeg = leg;
    }

    this.robotGroup.position.y = -2.4;
  }

  /* ═══════════════════════════════════════════════
   * LAYER 1 — ROBOT TYPE ANIMATIONS
   * ═══════════════════════════════════════════════ */

  startRobotAnimation() {
    const type = this.app.projectData.selectedRobotType;
    switch (type) {
      case "companion": this.anim_companion(); break;
      case "domestic": this.anim_domestic(); break;
      case "security": this.anim_security(); break;
      case "social": this.anim_social(); break;
      case "utility": this.anim_utility(); break;
      default: this.anim_companion(); break;
    }
  }

  // ── COMPANION — elastic float up, idle wave + gentle bob
  anim_companion() {
    const g = this.robotGroup;
    const t0 = performance.now();
    const DUR = 1400;

    g.scale.setScalar(0.01);
    g.position.y -= 3;

    const enter = () => {
      if (this._loopCancelled || !this.robotGroup) return;
      const t = Math.min(1, (performance.now() - t0) / DUR);
      const e = this.easeOutElastic(t);
      g.scale.setScalar(Math.max(0.01, e));
      g.position.y = -2.2 - 3 + 3 * e;
      if (t < 1) { requestAnimationFrame(enter); return; }

      g.position.y = -2.2;
      // Idle: wave right arm + body bob
      const idle = () => {
        if (this._loopCancelled || !this.robotGroup) return;
        const s = performance.now() * 0.001;
        g.position.y = -2.2 + Math.sin(s * 1.2) * 0.12;
        g.rotation.y = Math.sin(s * 0.6) * 0.08;
        if (this.limbs.rArm) this.limbs.rArm.rotation.z = -0.5 + Math.sin(s * 2.5) * 0.4;
        if (this.limbs.lArm) this.limbs.lArm.rotation.z = 0.05 + Math.sin(s * 1.1) * 0.06;
        if (this.limbs.head) this.limbs.head.rotation.y = Math.sin(s * 0.9) * 0.12;
        if (this.eyeLight) this.eyeLight.intensity = 1.8 + Math.sin(s * 2.2) * 0.4;
        requestAnimationFrame(idle);
      };
      requestAnimationFrame(idle);
    };
    requestAnimationFrame(enter);
  }

  // ── DOMESTIC — spin-drop, bounce, tidy compact idle
  anim_domestic() {
    const g = this.robotGroup;
    const t0 = performance.now();
    const DUR = 900;

    g.position.y = 4;
    g.rotation.y = Math.PI * 4;

    const enter = () => {
      if (this._loopCancelled || !this.robotGroup) return;
      const t = Math.min(1, (performance.now() - t0) / DUR);
      const e = this.easeOutBounce(t);
      g.position.y = 4 - (4 + 1.5) * e;
      g.rotation.y = Math.PI * 4 * (1 - t);
      if (t < 1) { requestAnimationFrame(enter); return; }

      g.position.y = -1.5;
      g.rotation.y = 0;

      const idle = () => {
        if (this._loopCancelled || !this.robotGroup) return;
        const s = performance.now() * 0.001;
        g.rotation.y = Math.sin(s * 0.8) * 0.35; // scanning side to side
        if (this.limbs.lArm) this.limbs.lArm.rotation.z = 0.3 + Math.sin(s * 1.8) * 0.2;
        if (this.limbs.rArm) this.limbs.rArm.rotation.z = -0.3 - Math.sin(s * 1.8) * 0.2;
        if (this.limbs.head) this.limbs.head.rotation.y = Math.sin(s * 1.2) * 0.18;
        if (this.eyeLight) this.eyeLight.intensity = 1.5 + Math.sin(s * 3) * 0.5;
        requestAnimationFrame(idle);
      };
      requestAnimationFrame(idle);
    };
    requestAnimationFrame(enter);
  }

  // ── SECURITY — hard stomp in from above, scale punch, surveillance idle
  anim_security() {
    const g = this.robotGroup;
    const t0 = performance.now();
    const DUR = 420;

    g.scale.setScalar(0.01);
    g.position.y = -2.5;

    const enter = () => {
      if (this._loopCancelled || !this.robotGroup) return;
      const t = Math.min(1, (performance.now() - t0) / DUR);
      g.scale.setScalar(t); // hard linear — mechanical
      if (t < 1) { requestAnimationFrame(enter); return; }

      // Double punch
      g.scale.setScalar(1.14);
      setTimeout(() => {
        if (!this.robotGroup) return;
        g.scale.setScalar(0.97);
        setTimeout(() => {
          if (!this.robotGroup) return;
          g.scale.setScalar(1.0);

          const idle = () => {
            if (this._loopCancelled || !this.robotGroup) return;
            const s = performance.now() * 0.001;
            // Slow deliberate surveillance pan
            g.rotation.y = Math.sin(s * 0.45) * 0.5;
            if (this.limbs.lArm) this.limbs.lArm.rotation.z = 0.1 + Math.sin(s * 0.5) * 0.08;
            if (this.limbs.rArm) this.limbs.rArm.rotation.z = -0.1 - Math.sin(s * 0.5) * 0.08;
            if (this.eyeLight) {
              // Occasional scan flash
              this.eyeLight.intensity = Math.random() > 0.97 ? 4.0 : 1.6 + Math.sin(s * 0.9) * 0.3;
            }
            requestAnimationFrame(idle);
          };
          requestAnimationFrame(idle);
        }, 55);
      }, 65);
    };
    requestAnimationFrame(enter);
  }

  // ── SOCIAL — back-ease pop, expressive bounce idle with arm gestures
  anim_social() {
    const g = this.robotGroup;
    const t0 = performance.now();
    const DUR = 680;

    g.scale.setScalar(0.01);
    g.rotation.z = -0.3;

    const enter = () => {
      if (this._loopCancelled || !this.robotGroup) return;
      const t = Math.min(1, (performance.now() - t0) / DUR);
      const e = this.easeOutBack(t);
      g.scale.setScalar(Math.max(0.01, e));
      g.rotation.z = -0.3 * (1 - t);
      if (t < 1) { requestAnimationFrame(enter); return; }

      g.scale.setScalar(1);
      g.rotation.z = 0;

      const idle = () => {
        if (this._loopCancelled || !this.robotGroup) return;
        const s = performance.now() * 0.001;
        // Bouncy happy idle
        g.position.y = -2.3 + Math.abs(Math.sin(s * 2.6)) * 0.2;
        g.rotation.z = Math.sin(s * 2.8) * 0.06;
        g.rotation.y = Math.sin(s * 1.1) * 0.15;
        if (this.limbs.lArm) this.limbs.lArm.rotation.z = 0.2 + Math.sin(s * 2.2) * 0.35;
        if (this.limbs.rArm) this.limbs.rArm.rotation.z = -0.2 - Math.sin(s * 2.2 + 1) * 0.35;
        if (this.limbs.head) this.limbs.head.rotation.z = Math.sin(s * 2.8) * 0.1;
        if (this.eyeLight) this.eyeLight.intensity = 2.0 + Math.sin(s * 4) * 0.6;
        requestAnimationFrame(idle);
      };
      requestAnimationFrame(idle);
    };
    requestAnimationFrame(enter);
  }

  // ── UTILITY — panels slide in, snap, then tool arm cycles
  anim_utility() {
    const g = this.robotGroup;

    // Start off-screen right, slide in
    g.position.x = 8;
    g.rotation.y = -1.2;

    const t0 = performance.now();
    const DUR = 950;

    const enter = () => {
      if (this._loopCancelled || !this.robotGroup) return;
      const t = Math.min(1, (performance.now() - t0) / DUR);
      const e = this.easeInOutQuart(t);
      g.position.x = 8 * (1 - e);
      g.rotation.y = -1.2 * (1 - e);
      if (t < 1) { requestAnimationFrame(enter); return; }

      g.position.x = 0;
      g.rotation.y = 0;

      const idle = () => {
        if (this._loopCancelled || !this.robotGroup) return;
        const s = performance.now() * 0.001;
        // Tool arm cycles — work motion
        if (this.limbs.rArm) {
          this.limbs.rArm.rotation.z = -0.2 + Math.sin(s * 1.8) * 0.5;
          this.limbs.rArm.rotation.x = Math.sin(s * 1.4) * 0.3;
        }
        if (this.limbs.lArm) {
          this.limbs.lArm.rotation.z = 0.15 + Math.sin(s * 0.9) * 0.1;
        }
        // Quantised body jitter — mechanical
        g.position.y = -2.4 + Math.round(Math.sin(s * 2) * 3) / 3 * 0.04;
        g.rotation.y = Math.sin(s * 0.55) * 0.12;
        if (this.eyeLight) this.eyeLight.intensity = 1.4 + Math.sin(s * 6) * 0.3;
        requestAnimationFrame(idle);
      };
      requestAnimationFrame(idle);
    };
    requestAnimationFrame(enter);
  }

  /* ═══════════════════════════════════════════════
   * LAYER 2 — COLOR THEME EFFECTS (unchanged from before)
   * ═══════════════════════════════════════════════ */

  startColorTheme() {
    switch (this.app.projectData.selectedColor) {
      case "white": this.theme_white(); break;
      case "red": this.theme_red(); break;
      case "green": this.theme_green(); break;
      case "blue": this.theme_blue(); break;
      case "black": this.theme_black(); break;
      default: this.theme_white(); break;
    }
  }

  theme_white() {
    const orbs = [];
    for (let i = 0; i < 18; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.055 + Math.random() * 0.04, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
      );
      m.position.set((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2);
      m.userData = { speed: 0.15 + Math.random() * 0.25, offset: Math.random() * Math.PI * 2, fadeIn: 0 };
      this.scene.add(m); this.extraMeshes.push(m); orbs.push(m);
    }
    const ringM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.15, 64), ringM);
    ring.position.z = -0.5; this.scene.add(ring); this.extraMeshes.push(ring);

    const tick = () => {
      if (this._loopCancelled) return;
      const s = performance.now() * 0.001;
      orbs.forEach(o => {
        o.userData.fadeIn = Math.min(1, o.userData.fadeIn + 0.008);
        o.material.opacity = o.userData.fadeIn * (0.4 + Math.sin(s * o.userData.speed + o.userData.offset) * 0.2);
        o.position.y += o.userData.speed * 0.004;
        if (o.position.y > 3.5) o.position.y = -3.5;
      });
      ringM.opacity = 0.12 + Math.sin(s * 0.9) * 0.06;
      ring.scale.setScalar(1 + Math.sin(s * 0.7) * 0.04);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  theme_red() {
    const sparks = [];
    for (let i = 0; i < 32; i++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(0.04, 0.18),
        new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xff6600 : 0xff2200, transparent: true, opacity: 0 })
      );
      const a = (i / 32) * Math.PI * 2;
      m.userData = { angle: a, dist: 0, phase: "burst" };
      m.rotation.z = a + Math.PI / 2;
      m.position.z = 0.1;
      this.scene.add(m); this.extraMeshes.push(m); sparks.push(m);
    }
    const embers = [];
    for (let i = 0; i < 20; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 5, 5),
        new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xff6600 : 0xff2200, transparent: true, opacity: 0 })
      );
      m.position.set((Math.random() - 0.5) * 4, -3 - Math.random() * 2, (Math.random() - 0.5) * 1.5);
      m.userData = { riseSpeed: 0.008 + Math.random() * 0.012, sway: Math.random() * Math.PI * 2, fadeIn: 0 };
      this.scene.add(m); this.extraMeshes.push(m); embers.push(m);
    }
    const tick = () => {
      if (this._loopCancelled) return;
      const s = performance.now() * 0.001;
      sparks.forEach(sp => {
        if (sp.userData.phase !== "burst") return;
        sp.userData.dist += 0.06;
        sp.position.x = Math.cos(sp.userData.angle) * sp.userData.dist;
        sp.position.y = Math.sin(sp.userData.angle) * sp.userData.dist;
        sp.material.opacity = Math.max(0, 1 - sp.userData.dist / 3.5);
        if (sp.userData.dist > 3.5) sp.userData.phase = "done";
      });
      embers.forEach((em, i) => {
        em.userData.fadeIn = Math.min(1, em.userData.fadeIn + 0.004);
        em.material.opacity = em.userData.fadeIn * (0.55 + Math.sin(s * 1.5 + i) * 0.2);
        em.position.y += em.userData.riseSpeed;
        em.position.x += Math.sin(s * 0.8 + em.userData.sway) * 0.003;
        if (em.position.y > 4) em.position.y = -3;
      });
      if (this.accentLight) this.accentLight.intensity = 1.2 + Math.sin(s * 3.5) * 0.6;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  theme_green() {
    const orbs = [];
    for (let i = 0; i < 22; i++) {
      const r = 0.04 + Math.random() * 0.09;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 10, 10),
        new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? 0x88ffaa : 0x33cc55, transparent: true, opacity: 0 })
      );
      m.position.set((Math.random() - 0.5) * 7, -4 - Math.random() * 3, (Math.random() - 0.5) * 2);
      m.userData = { riseSpeed: 0.004 + Math.random() * 0.006, pulseSpeed: 0.5 + Math.random(), offset: Math.random() * Math.PI * 2, fadeIn: 0 };
      this.scene.add(m); this.extraMeshes.push(m); orbs.push(m);
    }
    const ringM = new THREE.MeshBasicMaterial({ color: 0x44ff88, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.8, 1.98, 64), ringM);
    ring.position.z = -0.5; this.scene.add(ring); this.extraMeshes.push(ring);

    const tick = () => {
      if (this._loopCancelled) return;
      const s = performance.now() * 0.001;
      orbs.forEach(o => {
        o.userData.fadeIn = Math.min(1, o.userData.fadeIn + 0.005);
        o.scale.setScalar(1 + Math.sin(s * o.userData.pulseSpeed + o.userData.offset) * 0.3);
        o.material.opacity = o.userData.fadeIn * (0.35 + Math.sin(s * o.userData.pulseSpeed + o.userData.offset) * 0.15);
        o.position.y += o.userData.riseSpeed;
        if (o.position.y > 4.5) o.position.y = -4.5;
      });
      ringM.opacity = 0.15 + Math.sin(s * 1.1) * 0.08;
      ring.scale.setScalar(1 + Math.sin(s * 1.1) * 0.06);
      ring.rotation.z += 0.002;
      if (this.accentLight) this.accentLight.intensity = 1.0 + Math.sin(s * 1.3) * 0.3;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  theme_blue() {
    const lines = [];
    for (let i = 0; i < 14; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)]);
      const mat = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0 });
      const line = new THREE.Line(geo, mat);
      line.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 1.5);
      line.scale.y = 0.3 + Math.random() * 2;
      line.userData = { speed: 0.01 + Math.random() * 0.02, fadeIn: 0 };
      this.scene.add(line); this.extraMeshes.push(line); lines.push(line);
    }
    const arcMat = new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0 });
    const arc = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.025, 8, 80), arcMat);
    arc.position.z = -0.5; this.scene.add(arc); this.extraMeshes.push(arc);

    const tick = () => {
      if (this._loopCancelled) return;
      const s = performance.now() * 0.001;
      lines.forEach((ln, i) => {
        ln.userData.fadeIn = Math.min(1, ln.userData.fadeIn + 0.006);
        ln.material.opacity = ln.userData.fadeIn * 0.6 * (Math.random() > 0.04 ? 1 : 0);
        ln.position.y -= ln.userData.speed;
        ln.scale.y = 0.4 + Math.abs(Math.sin(s * 2 + i)) * 2;
        if (ln.position.y < -4) ln.position.y = 4;
      });
      arcMat.opacity = 0.3 + Math.random() * 0.4;
      arc.rotation.z += 0.008;
      if (this.accentLight) this.accentLight.intensity = Math.random() > 0.05 ? 1.4 + Math.sin(s * 4) * 0.5 : 2.8;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  theme_black() {
    const smokes = [];
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2 + Math.random(), 1.2 + Math.random()),
        new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0, depthWrite: false })
      );
      m.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5, -1 - Math.random() * 1.5);
      m.userData = { riseSpeed: 0.002 + Math.random() * 0.003, fadeIn: 0, offset: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.004 };
      this.scene.add(m); this.extraMeshes.push(m); smokes.push(m);
    }
    const shaftMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
    const shaft = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 5), shaftMat);
    shaft.position.set(0.6, 0, 0.15); this.scene.add(shaft); this.extraMeshes.push(shaft);

    const tick = () => {
      if (this._loopCancelled) return;
      const s = performance.now() * 0.001;
      smokes.forEach(sm => {
        sm.userData.fadeIn = Math.min(1, sm.userData.fadeIn + 0.004);
        sm.material.opacity = sm.userData.fadeIn * (0.25 + Math.sin(s * 0.4 + sm.userData.offset) * 0.1);
        sm.position.y += sm.userData.riseSpeed;
        sm.rotation.z += sm.userData.rotSpeed;
        if (sm.position.y > 4.5) sm.position.y = -4.5;
      });
      shaftMat.opacity = 0.06 + Math.abs(Math.sin(s * 0.6)) * 0.12;
      shaft.position.x = Math.sin(s * 0.3) * 1.2;
      if (this.accentLight) this.accentLight.intensity = 0.5 + Math.sin(s * 0.7) * 0.3;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────────────────
   * AUDIO
   * ───────────────────────────────────────────── */

  playFilteredAudio() {
    const audio = this.app.projectData.filteredAudio;
    if (!audio?.url || !this.app.projectData.audioStatus.isConfirmed) return;

    // If already exists → just restart it
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.play().catch(err => {
        console.warn("Replay blocked:", err);
      });
      return;
    }

    // First time → create it
    this.audioElement = new Audio(audio.url);
    this.audioElement.play().catch(err => {
      console.warn("RevealScreen: audio autoplay blocked —", err);
    });
  }

  /* ─────────────────────────────────────────────
   * RENDER LOOP
   * ───────────────────────────────────────────── */

  renderLoop() {
    const loop = () => {
      if (this._loopCancelled) return;
      requestAnimationFrame(loop);

      if (this.packageMesh && !this.isOpened) {
        this.packageMesh.rotation.y += 0.013;
        this.packageMesh.rotation.x += 0.005;
      }

      this.renderer.render(this.scene, this.camera);
    };
    requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────
   * CLEANUP
   * ───────────────────────────────────────────── */

  cleanup() {
    this._loopCancelled = true;
    if (this.audioElement) { this.audioElement.pause(); this.audioElement = null; }
    if (this.renderer) { this.renderer.domElement.remove(); this.renderer.dispose(); }
    this.scene = this.camera = this.renderer = null;
    this.packageMesh = this.robotGroup = this.accentLight = this.eyeLight = null;
    this.extraMeshes = [];
    this.limbs = {};
    this.isOpened = false;
  }

  /* ─────────────────────────────────────────────
   * HELPERS
   * ───────────────────────────────────────────── */

  getColorHex() {
    return { white: 0xf0ede8, red: 0xdd1111, green: 0x22bb44, blue: 0x1166dd, black: 0x222222 }
    [this.app.projectData.selectedColor] ?? 0xaaaaaa;
  }

  easeInCubic(t) { return t * t * t; }
  easeInOutQuart(t) { return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; }
  easeOutBack(t) { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  easeOutElastic(t) {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * (2 * Math.PI) / 0.4) + 1;
  }
  easeOutBounce(t) {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.500 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.250 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
}