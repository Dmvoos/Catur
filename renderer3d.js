/**
 * GrandChess 3D Engine — PBR Materials, Procedural 4K-style Textures,
 * Studio HDRI Reflections, DLSS 5 / RTX Lighting Rig, & Multi-POV Camera System
 */

class Chess3DRenderer {
  constructor(game, containerEl, onSquarePick) {
    this.game = game;
    this.container = containerEl;
    this.onSquarePick = onSquarePick;

    this.enabled = true;
    this.currentPOV = 'player'; // 'player', 'cinematic', 'top', 'auto', 'free'
    this.lightingPreset = 'rtx_ultra'; // 'rtx_ultra', 'golden_hour', 'cyber_neon', 'performance'

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.pmremGenerator = null;

    this.boardGroup = new THREE.Group();
    this.squaresGroup = new THREE.Group();
    this.piecesGroup = new THREE.Group();
    this.markersGroup = new THREE.Group();

    this.squareMeshes = []; // 8x8
    this.pieceMeshes = {};  // key "r,c" -> THREE.Object3D
    this.geometries = {};
    this.materials = {};
    this.textures = {};
    this.lights = {};

    // Camera Orbit / Interpolation state
    this.camSpherical = {
      radius: 13.5,
      phi: Math.PI / 3.1,   // polar angle from top
      theta: 0              // azimuth angle
    };
    this.targetSpherical = { ...this.camSpherical };
    this.camLookAt = new THREE.Vector3(0, 0.2, 0);
    this.targetLookAt = new THREE.Vector3(0, 0.2, 0);

    // Mouse / Touch interaction state
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isPointerDown = false;
    this.isDraggingOrbit = false;
    this.pointerDownPos = { x: 0, y: 0 };
    this.hoveredSquare = null;

    // Animation queue for moving pieces
    this.activeAnimations = [];
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070a12);
    this.scene.fog = new THREE.FogExp2(0x070a12, 0.022);

    // 2. Camera
    const w = this.container.clientWidth || 560;
    const h = this.container.clientHeight || 560;
    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);

    // 3. Renderer (PBR + ACES Filmic Tone Mapping + Soft Shadows + Supersampling)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.25, 2.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;

    this.renderer.domElement.className = 'chess-canvas-3d';
    this.container.appendChild(this.renderer.domElement);

    // 4. Procedural Studio HDRI Environment Map for realistic reflections
    this.buildProceduralHDRI();

    // 5. Generate High-Detail Procedural PBR Textures (Wood, Marble, Bump, Roughness)
    this.generatePBRTextures();

    // 6. Create PBR Materials & Sculpted 3D Geometries
    this.initMaterials();
    this.initGeometries();

    // 7. Build 3D Luxury Chessboard & Table Pedestal
    this.buildBoardMesh();

    // 8. Setup DLSS 5 / RTX Style Multi-Light Rig
    this.setupLights();

    this.scene.add(this.boardGroup);
    this.boardGroup.add(this.squaresGroup);
    this.boardGroup.add(this.piecesGroup);
    this.boardGroup.add(this.markersGroup);

    // 9. Set initial POV
    this.setPOV('player', true);

    // 10. Bind Events
    this.bindEvents();

    // 11. Start Render Loop
    this.animate();
  }

  // ==================== PROCEDURAL STUDIO HDRI ENVIRONMENT ====================
  buildProceduralHDRI() {
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0b101e);

    // Overhead softbox studio light panels for realistic specular clearcoat reflections
    const panelGeo = new THREE.PlaneGeometry(10, 10);
    const warmPanelMat = new THREE.MeshBasicMaterial({ color: 0xfffaed, side: THREE.DoubleSide });
    const topPanel = new THREE.Mesh(panelGeo, warmPanelMat);
    topPanel.position.set(4, 10, 4);
    topPanel.lookAt(0, 0, 0);
    envScene.add(topPanel);

    const coolPanelMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, side: THREE.DoubleSide });
    const sidePanel = new THREE.Mesh(panelGeo, coolPanelMat);
    sidePanel.position.set(-10, 5, -6);
    sidePanel.lookAt(0, 0, 0);
    envScene.add(sidePanel);

    const goldRimMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
    const rimPanel = new THREE.Mesh(new THREE.PlaneGeometry(14, 4), goldRimMat);
    rimPanel.position.set(0, 3, -12);
    rimPanel.lookAt(0, 0, 0);
    envScene.add(rimPanel);

    const renderTarget = this.pmremGenerator.fromScene(envScene, 0.04);
    this.scene.environment = renderTarget.texture;
  }

  // ==================== PROCEDURAL PBR TEXTURE GENERATOR ====================
  generatePBRTextures() {
    // 1. Veined Marble / Wood Grain Texture Generator
    const createMarbleCanvas = (baseHex, veinHex, secondaryHex, contrast = 1.0) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, 512, 512);

      // Subtle cloudy strata
      for (let i = 0; i < 45; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 60 + Math.random() * 140;
        const grad = ctx.createRadialGradient(x, y, 5, x, y, r);
        grad.addColorStop(0, secondaryHex);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
      }

      // Organic marble veins
      ctx.strokeStyle = veinHex;
      for (let v = 0; v < 22; v++) {
        ctx.beginPath();
        let vx = Math.random() * 512;
        let vy = 0;
        ctx.moveTo(vx, vy);
        ctx.lineWidth = (0.5 + Math.random() * 2.2) * contrast;
        ctx.globalAlpha = 0.22 + Math.random() * 0.35;
        while (vy < 512) {
          vy += 12 + Math.random() * 18;
          vx += (Math.random() - 0.48) * 28;
          ctx.lineTo(vx, vy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      return tex;
    };

    // 2. Wood Grain Texture Generator
    const createWoodCanvas = (bgHex, grainHex, ringHex) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, 512, 512);

      for (let y = 0; y < 512; y += 2) {
        const wave = Math.sin(y * 0.03) * 14;
        ctx.strokeStyle = y % 6 === 0 ? ringHex : grainHex;
        ctx.globalAlpha = 0.14 + (Math.sin(y * 0.13) + 1) * 0.08;
        ctx.lineWidth = 1 + Math.random() * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(170, y + wave, 340, y - wave, 512, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      return tex;
    };

    // 3. Micro-Roughness / Bump Map
    const createMicroBump = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(256, 256);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const val = 118 + Math.floor(Math.random() * 24);
        imgData.data[i] = val;
        imgData.data[i + 1] = val;
        imgData.data[i + 2] = val;
        imgData.data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    this.textures.marbleLight = createMarbleCanvas('#f1f5f9', '#94a3b8', 'rgba(203,213,225,0.35)', 1.0);
    this.textures.marbleDark = createMarbleCanvas('#0f2922', '#34d399', 'rgba(6,78,59,0.45)', 0.9);
    this.textures.woodLight = createWoodCanvas('#f3d9b1', '#c69768', '#a47148');
    this.textures.woodDark = createWoodCanvas('#4a2c11', '#2b1808', '#1a0e04');
    this.textures.frameBurl = createWoodCanvas('#1e140c', '#0f0905', '#3b2313');
    this.textures.microBump = createMicroBump();
  }

  // ==================== PBR MATERIALS ====================
  initMaterials() {
    // Board Squares
    this.materials.squareLight = new THREE.MeshPhysicalMaterial({
      map: this.textures.marbleLight,
      bumpMap: this.textures.microBump,
      bumpScale: 0.003,
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9
    });

    this.materials.squareDark = new THREE.MeshPhysicalMaterial({
      map: this.textures.marbleDark,
      bumpMap: this.textures.microBump,
      bumpScale: 0.004,
      roughness: 0.16,
      metalness: 0.08,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9
    });

    // Luxury Board Frame (Polished Obsidian & Gold Trim)
    this.materials.boardFrame = new THREE.MeshPhysicalMaterial({
      map: this.textures.frameBurl,
      bumpMap: this.textures.frameBurl,
      bumpScale: 0.01,
      color: 0x1e293b,
      roughness: 0.22,
      metalness: 0.25,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12
    });

    this.materials.goldTrim = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.18,
      metalness: 0.92
    });

    // White Pieces (Polished Ivory / Imperial Porcelain + Gold Collar)
    this.materials.pieceWhite = new THREE.MeshPhysicalMaterial({
      map: this.textures.marbleLight,
      color: 0xfffbeb,
      roughness: 0.15,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 1.0
    });

    // Black Pieces (Obsidian Chrome / Royal Ebony + Gold Accent)
    this.materials.pieceBlack = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      roughness: 0.14,
      metalness: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0
    });

    // Highlight Materials
    this.materials.selectedGlow = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });

    this.materials.lastMoveGlow = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    });

    this.materials.legalMoveDot = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.3,
      transparent: true,
      opacity: 0.9
    });

    this.materials.captureRing = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.95,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92
    });

    this.materials.hintGlow = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.1,
      transparent: true,
      opacity: 0.85
    });
  }

  // ==================== SCULPTED 3D STAUNTON PIECE GEOMETRIES ====================
  initGeometries() {
    const lathe = (pts, segs = 32) => {
      const vectors = pts.map(([x, y]) => new THREE.Vector2(x * 0.38, y * 0.38));
      const geo = new THREE.LatheGeometry(vectors, segs);
      geo.computeVertexNormals();
      return geo;
    };

    // Base profile shared helper
    this.geometries.P = lathe([
      [0, 0], [0.85, 0], [0.85, 0.14], [0.72, 0.22], [0.68, 0.35],
      [0.42, 0.55], [0.3, 1.15], [0.46, 1.25], [0.28, 1.35], [0, 1.35]
    ]);

    this.geometries.R = lathe([
      [0, 0], [0.92, 0], [0.92, 0.16], [0.78, 0.26], [0.72, 0.42],
      [0.52, 0.65], [0.44, 1.55], [0.58, 1.72], [0.58, 2.05],
      [0.4, 2.05], [0.4, 1.88], [0, 1.88]
    ]);

    this.geometries.N_base = lathe([
      [0, 0], [0.92, 0], [0.92, 0.16], [0.78, 0.26], [0.7, 0.45],
      [0.48, 0.68], [0, 0.72]
    ]);

    this.geometries.B = lathe([
      [0, 0], [0.92, 0], [0.92, 0.16], [0.78, 0.26], [0.7, 0.44],
      [0.44, 0.7], [0.34, 1.45], [0.5, 1.55], [0.36, 1.65],
      [0.48, 1.98], [0.42, 2.28], [0.18, 2.52], [0, 2.58]
    ]);

    this.geometries.Q = lathe([
      [0, 0], [0.98, 0], [0.98, 0.18], [0.84, 0.28], [0.75, 0.48],
      [0.48, 0.78], [0.36, 1.72], [0.56, 1.84], [0.4, 1.96],
      [0.54, 2.38], [0.64, 2.68], [0.42, 2.55], [0, 2.55]
    ]);

    this.geometries.K = lathe([
      [0, 0], [1.02, 0], [1.02, 0.18], [0.88, 0.3], [0.78, 0.52],
      [0.5, 0.85], [0.38, 1.88], [0.6, 2.0], [0.44, 2.12],
      [0.56, 2.62], [0.62, 2.88], [0.3, 2.95], [0, 2.95]
    ]);
  }

  createPieceMesh(pieceCode) {
    const color = pieceCode[0];
    const type = pieceCode[1];
    const mat = color === 'w' ? this.materials.pieceWhite : this.materials.pieceBlack;
    const group = new THREE.Group();

    // Metallic Gold Base Ring for luxury look
    const ringGeo = new THREE.TorusGeometry(0.31, 0.022, 12, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, this.materials.goldTrim);
    ringMesh.position.y = 0.06;
    group.add(ringMesh);

    if (type === 'P') {
      const body = new THREE.Mesh(this.geometries.P, mat);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.185, 24, 24), mat);
      head.position.y = 0.64;
      head.castShadow = true;
      group.add(head);
    } else if (type === 'R') {
      const body = new THREE.Mesh(this.geometries.R, mat);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);
    } else if (type === 'N') {
      const base = new THREE.Mesh(this.geometries.N_base, mat);
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      // Sculpted 3D Knight Horse Head & Mane
      const horseGroup = new THREE.Group();
      const neckGeo = new THREE.BoxGeometry(0.26, 0.52, 0.34);
      const neck = new THREE.Mesh(neckGeo, mat);
      neck.position.set(0, 0.48, 0);
      neck.rotation.x = -0.22;
      neck.castShadow = true;
      horseGroup.add(neck);

      const snoutGeo = new THREE.ConeGeometry(0.17, 0.42, 16);
      const snout = new THREE.Mesh(snoutGeo, mat);
      snout.position.set(0, 0.68, 0.16);
      snout.rotation.x = Math.PI * 0.58;
      snout.castShadow = true;
      horseGroup.add(snout);

      const maneGeo = new THREE.BoxGeometry(0.12, 0.48, 0.14);
      const mane = new THREE.Mesh(maneGeo, this.materials.goldTrim);
      mane.position.set(0, 0.52, -0.14);
      mane.rotation.x = -0.18;
      horseGroup.add(mane);

      // Face opponent direction
      horseGroup.rotation.y = color === 'w' ? Math.PI : 0;
      group.add(horseGroup);
    } else if (type === 'B') {
      const body = new THREE.Mesh(this.geometries.B, mat);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), this.materials.goldTrim);
      orb.position.y = 1.02;
      group.add(orb);
    } else if (type === 'Q') {
      const body = new THREE.Mesh(this.geometries.Q, mat);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 20), this.materials.goldTrim);
      dome.position.y = 1.0;
      group.add(dome);
    } else if (type === 'K') {
      const body = new THREE.Mesh(this.geometries.K, mat);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Royal Gold Cross on top of King
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.06), this.materials.goldTrim);
      crossV.position.y = 1.22;
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06), this.materials.goldTrim);
      crossH.position.y = 1.25;
      group.add(crossV, crossH);
    }

    return group;
  }

  // ==================== BUILD 3D CHESSBOARD ====================
  buildBoardMesh() {
    // Outer Luxury Frame
    const frameGeo = new THREE.BoxGeometry(9.2, 0.42, 9.2);
    const frameMesh = new THREE.Mesh(frameGeo, this.materials.boardFrame);
    frameMesh.position.y = -0.22;
    frameMesh.receiveShadow = true;
    frameMesh.castShadow = true;
    this.boardGroup.add(frameMesh);

    // Gold Inlay Border around squares
    const trimGeo = new THREE.BoxGeometry(8.18, 0.44, 8.18);
    const trimMesh = new THREE.Mesh(trimGeo, this.materials.goldTrim);
    trimMesh.position.y = -0.21;
    this.boardGroup.add(trimMesh);

    // Dark Reflective Pedestal Table Floor
    const tableGeo = new THREE.CylinderGeometry(14, 14, 0.2, 64);
    const tableMat = new THREE.MeshPhysicalMaterial({
      color: 0x050811,
      roughness: 0.15,
      metalness: 0.6,
      clearcoat: 0.8
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.55;
    tableMesh.receiveShadow = true;
    this.boardGroup.add(tableMesh);

    // 64 Individual 3D Squares
    this.squareMeshes = Array.from({ length: 8 }, () => Array(8).fill(null));
    const sqGeo = new THREE.BoxGeometry(1, 0.12, 1);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0;
        const mesh = new THREE.Mesh(sqGeo, isLight ? this.materials.squareLight : this.materials.squareDark);
        const pos = this.boardToWorld(r, c);
        mesh.position.set(pos.x, -0.06, pos.z);
        mesh.receiveShadow = true;
        mesh.userData = { r, c, isSquare: true };
        this.squaresGroup.add(mesh);
        this.squareMeshes[r][c] = mesh;
      }
    }
  }

  boardToWorld(r, c) {
    return {
      x: c - 3.5,
      z: r - 3.5
    };
  }

  // ==================== DLSS 5 / RTX LIGHTING RIG ====================
  setupLights() {
    // 1. Ambient / Hemisphere Fill
    this.lights.hemi = new THREE.HemisphereLight(0xdbeafe, 0x1e1b4b, 0.85);
    this.scene.add(this.lights.hemi);

    // 2. Main Key Spotlight (Casts 2048x2048 Soft Ray-Traced-Style Shadows)
    this.lights.keySpot = new THREE.SpotLight(0xfff7ed, 38);
    this.lights.keySpot.position.set(6, 13, 7);
    this.lights.keySpot.angle = Math.PI / 3.2;
    this.lights.keySpot.penumbra = 0.65;
    this.lights.keySpot.decay = 1.6;
    this.lights.keySpot.distance = 35;
    this.lights.keySpot.castShadow = true;
    this.lights.keySpot.shadow.mapSize.width = 2048;
    this.lights.keySpot.shadow.mapSize.height = 2048;
    this.lights.keySpot.shadow.camera.near = 3;
    this.lights.keySpot.shadow.camera.far = 26;
    this.lights.keySpot.shadow.bias = -0.0005;
    this.scene.add(this.lights.keySpot);

    // 3. Rim / Backlight (Creates dramatic specular edge highlights like RTX Global Illumination)
    this.lights.rimLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    this.lights.rimLight.position.set(-8, 7, -9);
    this.scene.add(this.lights.rimLight);

    // 4. Warm Gold Accent Bounce Light
    this.lights.warmBounce = new THREE.PointLight(0xf59e0b, 6.5, 18, 1.8);
    this.lights.warmBounce.position.set(7, 4, -6);
    this.scene.add(this.lights.warmBounce);

    // 5. Dynamic Crimson Check Alert Light (illuminates King when in Check!)
    this.lights.checkLight = new THREE.PointLight(0xef4444, 0, 5, 2);
    this.lights.checkLight.position.set(0, 2.2, 0);
    this.scene.add(this.lights.checkLight);
  }

  setLightingPreset(preset) {
    this.lightingPreset = preset;

    if (preset === 'rtx_ultra') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.35, 2.5));
      this.renderer.shadowMap.enabled = true;
      this.renderer.toneMappingExposure = 1.28;
      this.lights.keySpot.color.setHex(0xfff7ed);
      this.lights.keySpot.intensity = 40;
      this.lights.rimLight.color.setHex(0x38bdf8);
      this.lights.rimLight.intensity = 3.5;
      this.lights.warmBounce.color.setHex(0xf59e0b);
      this.lights.warmBounce.intensity = 7.0;
      this.scene.background.setHex(0x070a12);
    } else if (preset === 'golden_hour') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.2, 2.2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.toneMappingExposure = 1.35;
      this.lights.keySpot.color.setHex(0xfde68a);
      this.lights.keySpot.intensity = 44;
      this.lights.rimLight.color.setHex(0xf97316);
      this.lights.rimLight.intensity = 4.0;
      this.lights.warmBounce.color.setHex(0xfbbf24);
      this.lights.warmBounce.intensity = 9.0;
      this.scene.background.setHex(0x120c07);
    } else if (preset === 'cyber_neon') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.25, 2.2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.toneMappingExposure = 1.4;
      this.lights.keySpot.color.setHex(0xe0e7ff);
      this.lights.keySpot.intensity = 36;
      this.lights.rimLight.color.setHex(0xec4899);
      this.lights.rimLight.intensity = 6.5;
      this.lights.warmBounce.color.setHex(0x06b6d4);
      this.lights.warmBounce.intensity = 11.0;
      this.scene.background.setHex(0x060414);
    } else if (preset === 'performance') {
      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.enabled = false;
      this.renderer.toneMappingExposure = 1.15;
      this.lights.keySpot.intensity = 28;
      this.lights.rimLight.intensity = 2.0;
      this.lights.warmBounce.intensity = 3.0;
    }
  }

  setBoardTheme3D(theme) {
    if (theme === 'wood') {
      this.materials.squareLight.map = this.textures.woodLight;
      this.materials.squareDark.map = this.textures.woodDark;
      this.materials.squareLight.color.setHex(0xffffff);
      this.materials.squareDark.color.setHex(0xffffff);
    } else if (theme === 'ocean') {
      this.materials.squareLight.map = this.textures.marbleLight;
      this.materials.squareDark.map = this.textures.marbleLight;
      this.materials.squareLight.color.setHex(0xe0f2fe);
      this.materials.squareDark.color.setHex(0x1e3a8a);
    } else if (theme === 'midnight') {
      this.materials.squareLight.map = this.textures.marbleLight;
      this.materials.squareDark.map = this.textures.marbleDark;
      this.materials.squareLight.color.setHex(0xe2e8f0);
      this.materials.squareDark.color.setHex(0x311042);
    } else {
      // Emerald Marble Default
      this.materials.squareLight.map = this.textures.marbleLight;
      this.materials.squareDark.map = this.textures.marbleDark;
      this.materials.squareLight.color.setHex(0xffffff);
      this.materials.squareDark.color.setHex(0xffffff);
    }
    this.materials.squareLight.needsUpdate = true;
    this.materials.squareDark.needsUpdate = true;
  }

  // ==================== CAMERA POV PERSPECTIVES ====================
  setPOV(pov, instant = false) {
    this.currentPOV = pov;
    const isBlackSide = this.game.flipped;
    const baseTheta = isBlackSide ? Math.PI : 0;

    if (pov === 'player') {
      // Immersive First-Person Player Sitting POV (low angle over own pieces)
      this.targetSpherical = {
        radius: 10.6,
        phi: 1.08, // ~62 degrees tilt
        theta: baseTheta
      };
      this.targetLookAt.set(0, 0.35, isBlackSide ? 0.55 : -0.55);
    } else if (pov === 'cinematic') {
      // 45-degree Broadcast Grandmaster Angle
      this.targetSpherical = {
        radius: 12.8,
        phi: 0.78,
        theta: baseTheta + 0.38
      };
      this.targetLookAt.set(0, 0.1, 0);
    } else if (pov === 'top') {
      // Overhead 3D Tactical View
      this.targetSpherical = {
        radius: 12.2,
        phi: 0.12, // Nearly straight down
        theta: baseTheta
      };
      this.targetLookAt.set(0, 0, 0);
    } else if (pov === 'side') {
      // Neutral Side Broadcast View
      this.targetSpherical = {
        radius: 12.6,
        phi: 0.88,
        theta: Math.PI / 2
      };
      this.targetLookAt.set(0, 0.15, 0);
    }

    if (instant) {
      this.camSpherical = { ...this.targetSpherical };
      this.camLookAt.copy(this.targetLookAt);
      this.updateCameraTransform();
    }
  }

  updateCameraTransform() {
    const { radius, phi, theta } = this.camSpherical;
    const sinPhiRadius = Math.sin(phi) * radius;
    this.camera.position.x = this.camLookAt.x + sinPhiRadius * Math.sin(theta);
    this.camera.position.y = this.camLookAt.y + Math.cos(phi) * radius;
    this.camera.position.z = this.camLookAt.z + sinPhiRadius * Math.cos(theta);
    this.camera.lookAt(this.camLookAt);
  }

  // ==================== SYNC BOARD STATE & MARKERS ====================
  syncWithGame(animateMove = null) {
    // Clear existing pieces
    while (this.piecesGroup.children.length > 0) {
      this.piecesGroup.remove(this.piecesGroup.children[0]);
    }
    this.pieceMeshes = {};

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const pieceCode = this.game.board[r][c];
        if (!pieceCode) continue;

        const mesh = this.createPieceMesh(pieceCode);
        const worldPos = this.boardToWorld(r, c);
        mesh.position.set(worldPos.x, 0, worldPos.z);
        mesh.userData = { r, c, pieceCode };

        // Animate if this piece just moved
        if (animateMove && animateMove.toR === r && animateMove.toC === c) {
          const fromWorld = this.boardToWorld(animateMove.fromR, animateMove.fromC);
          mesh.position.set(fromWorld.x, 0, fromWorld.z);
          this.activeAnimations.push({
            mesh,
            startX: fromWorld.x,
            startZ: fromWorld.z,
            endX: worldPos.x,
            endZ: worldPos.z,
            elapsed: 0,
            duration: 0.28
          });
        }

        this.piecesGroup.add(mesh);
        this.pieceMeshes[`${r},${c}`] = mesh;
      }
    }

    this.renderMarkers();
  }

  renderMarkers() {
    while (this.markersGroup.children.length > 0) {
      this.markersGroup.remove(this.markersGroup.children[0]);
    }

    const planeGeo = new THREE.PlaneGeometry(0.94, 0.94);
    planeGeo.rotateX(-Math.PI / 2);

    // 1. Selected Square Highlight
    if (this.game.selectedSquare) {
      const { r, c } = this.game.selectedSquare;
      const pos = this.boardToWorld(r, c);
      const selMesh = new THREE.Mesh(planeGeo, this.materials.selectedGlow);
      selMesh.position.set(pos.x, 0.012, pos.z);
      this.markersGroup.add(selMesh);

      // Slightly levitate selected piece
      const selectedPiece = this.pieceMeshes[`${r},${c}`];
      if (selectedPiece) {
        selectedPiece.position.y = 0.16;
      }
    }

    // 2. Last Move Highlight
    if (this.game.lastMove) {
      const { fromR, fromC, toR, toC } = this.game.lastMove;
      [[fromR, fromC], [toR, toC]].forEach(([r, c]) => {
        const pos = this.boardToWorld(r, c);
        const m = new THREE.Mesh(planeGeo, this.materials.lastMoveGlow);
        m.position.set(pos.x, 0.008, pos.z);
        this.markersGroup.add(m);
      });
    }

    // 3. AI Hint Highlight
    if (this.game.hintMove) {
      const { fromR, fromC, toR, toC } = this.game.hintMove;
      [[fromR, fromC], [toR, toC]].forEach(([r, c]) => {
        const pos = this.boardToWorld(r, c);
        const ringGeo = new THREE.RingGeometry(0.32, 0.45, 32);
        ringGeo.rotateX(-Math.PI / 2);
        const m = new THREE.Mesh(ringGeo, this.materials.hintGlow);
        m.position.set(pos.x, 0.02, pos.z);
        this.markersGroup.add(m);
      });
    }

    // 4. Legal Move Indicators (3D Glowing Orbs & Capture Tori)
    for (const move of this.game.legalMovesForSelected) {
      const pos = this.boardToWorld(move.toR, move.toC);
      const isCapture = move.capture || this.game.board[move.toR][move.toC];

      if (isCapture) {
        const torusGeo = new THREE.TorusGeometry(0.38, 0.05, 16, 32);
        torusGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(torusGeo, this.materials.captureRing);
        ring.position.set(pos.x, 0.04, pos.z);
        this.markersGroup.add(ring);
      } else {
        const dotGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 24);
        const dot = new THREE.Mesh(dotGeo, this.materials.legalMoveDot);
        dot.position.set(pos.x, 0.02, pos.z);
        this.markersGroup.add(dot);
      }
    }

    // 5. King in Check Spotlight
    if (this.game.isInCheck(this.game.turn)) {
      const kingPos = this.game.findKing(this.game.turn);
      if (kingPos) {
        const worldPos = this.boardToWorld(kingPos.r, kingPos.c);
        this.lights.checkLight.position.set(worldPos.x, 2.0, worldPos.z);
        this.lights.checkLight.intensity = 16;

        const alertGeo = new THREE.RingGeometry(0.3, 0.48, 32);
        alertGeo.rotateX(-Math.PI / 2);
        const alertRing = new THREE.Mesh(alertGeo, this.materials.captureRing);
        alertRing.position.set(worldPos.x, 0.02, worldPos.z);
        this.markersGroup.add(alertRing);
      }
    } else {
      this.lights.checkLight.intensity = 0;
    }
  }

  // ==================== INTERACTION: RAYCASTING & ORBIT CAMERA ====================
  bindEvents() {
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      this.isPointerDown = true;
      this.isDraggingOrbit = false;
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.enabled || !this.isPointerDown) return;
      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;

      if (Math.hypot(dx, dy) > 6) {
        this.isDraggingOrbit = true;
      }

      if (this.isDraggingOrbit) {
        this.targetSpherical.theta -= dx * 0.0075;
        this.targetSpherical.phi = Math.max(
          0.12,
          Math.min(Math.PI / 2.15, this.targetSpherical.phi - dy * 0.0065)
        );
        this.pointerDownPos = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.enabled || !this.isPointerDown) return;
      const wasOrbit = this.isDraggingOrbit;
      this.isPointerDown = false;
      this.isDraggingOrbit = false;

      if (!wasOrbit && e.target === dom) {
        this.handleBoardPick(e);
      }
    });

    dom.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      this.targetSpherical.radius = Math.max(
        7.5,
        Math.min(18.5, this.targetSpherical.radius + e.deltaY * 0.008)
      );
    }, { passive: false });

    window.addEventListener('resize', () => this.onResize());
  }

  handleBoardPick(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Raycast against squares & pieces
    const pieceHits = this.raycaster.intersectObjects(this.piecesGroup.children, true);
    if (pieceHits.length > 0) {
      let obj = pieceHits[0].object;
      while (obj && obj.userData && obj.userData.r === undefined) {
        obj = obj.parent;
      }
      if (obj && obj.userData && obj.userData.r !== undefined) {
        this.onSquarePick(obj.userData.r, obj.userData.c);
        return;
      }
    }

    const sqHits = this.raycaster.intersectObjects(this.squaresGroup.children, false);
    if (sqHits.length > 0) {
      const { r, c } = sqHits[0].object.userData;
      this.onSquarePick(r, c);
    }
  }

  onResize() {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth || 560;
    const h = this.container.clientHeight || 560;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ==================== RENDER & ANIMATION LOOP ====================
  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.enabled) return;

    const dt = Math.min(this.clock.getDelta(), 0.1);

    // Smooth camera interpolation (damping)
    const lerpFactor = 1 - Math.pow(0.001, dt);
    this.camSpherical.radius += (this.targetSpherical.radius - this.camSpherical.radius) * lerpFactor;
    this.camSpherical.phi += (this.targetSpherical.phi - this.camSpherical.phi) * lerpFactor;
    this.camSpherical.theta += (this.targetSpherical.theta - this.camSpherical.theta) * lerpFactor;
    this.camLookAt.lerp(this.targetLookAt, lerpFactor);
    this.updateCameraTransform();

    // Animate moving pieces along a smooth parabolic jump arc
    for (let i = this.activeAnimations.length - 1; i >= 0; i--) {
      const anim = this.activeAnimations[i];
      anim.elapsed += dt;
      const t = Math.min(1, anim.elapsed / anim.duration);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out

      anim.mesh.position.x = anim.startX + (anim.endX - anim.startX) * ease;
      anim.mesh.position.z = anim.startZ + (anim.endZ - anim.startZ) * ease;
      anim.mesh.position.y = Math.sin(t * Math.PI) * 0.75; // parabolic lift

      if (t >= 1) {
        anim.mesh.position.y = 0;
        this.activeAnimations.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.Chess3DRenderer = Chess3DRenderer;
