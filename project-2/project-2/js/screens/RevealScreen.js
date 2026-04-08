class RevealScreen {
  constructor(app) {
    this.app = app;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.packageMesh = null;
    this.robotMesh = null;

    this.isOpened = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  init() {
    this.setupThree();
    this.addLights();
    this.createPackage();
    this.addClick();
    this.animate();
  }

  setupThree() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0";

    document.body.appendChild(this.renderer.domElement);
  }

  addLights() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.scene.add(light);
  }

  createPackage() {
    const geo = new THREE.BoxGeometry(2, 2, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.app.projectData.selectedColor)
    });

    this.packageMesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.packageMesh);
  }

  addClick() {
    window.addEventListener("click", (e) => this.handleClick(e));
  }

  handleClick(e) {
    if (this.isOpened) return;

    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hit = this.raycaster.intersectObject(this.packageMesh);

    if (hit.length > 0) this.openPackage();
  }

  openPackage() {
    this.isOpened = true;

    let s = 1;

    const shrink = () => {
      s -= 0.05;

      if (s <= 0) {
        this.scene.remove(this.packageMesh);
        this.revealRobot();
        return;
      }

      this.packageMesh.scale.set(s, s, s);
      requestAnimationFrame(shrink);
    };

    shrink();
  }

  revealRobot() {
    const tex = new THREE.TextureLoader().load(
      this.app.getSelectedRobotImagePath()
    );

    const geo = new THREE.PlaneGeometry(3, 3);
    const mat = new THREE.MeshBasicMaterial({ map: tex });

    this.robotMesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.robotMesh);

    this.playAudio();
  }

  playAudio() {
    if (!this.app.projectData.audioStatus.isConfirmed) return;

    const audio = new Audio(this.app.projectData.filteredAudio);
    audio.play();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.packageMesh && !this.isOpened) {
      this.packageMesh.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  draw() { }
}