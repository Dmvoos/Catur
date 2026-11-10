/**
 * GrandChess 3D Engine — Gothic Royal Edition
 * Inspired by Antique Pewter/Bronze-Iron Busts on Burled Walnut Pedestals
 * & Ornate Carved Walnut Chest Board with Silver Filigree Tiles & Lion Corner Mounts
 */

class Chess3DRenderer {
  constructor(game, containerEl, onSquarePick) {
    this.game = game;
    this.container = containerEl;
    this.onSquarePick = onSquarePick;

    this.enabled = true;
    this.currentPOV = 'cinematic'; // 'player', 'cinematic', 'top', 'side'
    this.lightingPreset = 'rtx_ultra';

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.pmremGenerator = null;

    this.boardGroup = new THREE.Group();
    this.squaresGroup = new THREE.Group();
    this.piecesGroup = new THREE.Group();
    this.markersGroup = new THREE.Group();

    this.squareMeshes = [];
    this.pieceMeshes = {};
    this.geometries = {};
    this.materials = {};
    this.textures = {};
    this.lights = {};

    // Camera Spherical Orbit
    this.camSpherical = {
      radius: 12.2,
      phi: 0.82,
      theta: 0.35
    };
    this.targetSpherical = { ...this.camSpherical };
    this.camLookAt = new THREE.Vector3(0, 0.25, 0);
    this.targetLookAt = new THREE.Vector3(0, 0.25, 0);

    // Raycaster & Pointer
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isPointerDown = false;
    this.isDraggingOrbit = false;
    this.pointerDownPos = { x: 0, y: 0 };

    this.activeAnimations = [];
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // 1. Dark Studio Backdrop (Matches the moody charcoal backdrop in the reference photos)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x141518);
    this.scene.fog = new THREE.FogExp2(0x141518, 0.018);

    // 2. Camera
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);

    // 3. WebGL Renderer with ACES Filmic Tone Mapping & Soft Contact Shadows
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
    this.renderer.toneMappingExposure = 1.22;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;

    this.renderer.domElement.className = 'chess-canvas-3d';
    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Softbox HDRI Environment for metallic pewter & lacquered walnut reflections
    this.buildStudioHDRI();

    // 5. Generate Gothic Filigree, Rosette Ebony, Burled Walnut & Armor Relief Textures
    this.generateGothicTextures();

    // 6. Initialize PBR Materials & Sculpted Bust/Tower Geometries
    this.initMaterials();
    this.initGeometries();

    // 7. Build Ornate Carved Chest Chessboard with Lion Corner Mounts & Claw Feet
    this.buildGothicBoardMesh();

    // 8. Setup DLSS 5 / Studio Rim + Key Lighting Rig
    this.setupLights();

    this.scene.add(this.boardGroup);
    this.boardGroup.add(this.squaresGroup);
    this.boardGroup.add(this.piecesGroup);
    this.boardGroup.add(this.markersGroup);

    // 9. Default POV
    this.setPOV('player', true);

    // 10. Events & Loop
    this.bindEvents();
    this.animate();
  }

  // ==================== STUDIO SOFTBOX HDRI ENVIRONMENT ====================
  buildStudioHDRI() {
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x181a1f);

    const softboxGeo = new THREE.PlaneGeometry(14, 14);

    // Main Top-Front Warm Studio Softbox
    const keyBox = new THREE.Mesh(
      softboxGeo,
      new THREE.MeshBasicMaterial({ color: 0xfff5e4, side: THREE.DoubleSide })
    );
    keyBox.position.set(5, 12, 6);
    keyBox.lookAt(0, 0, 0);
    envScene.add(keyBox);

    // Cool Silver Rim Softbox
    const rimBox = new THREE.Mesh(
      softboxGeo,
      new THREE.MeshBasicMaterial({ color: 0xcbd5e1, side: THREE.DoubleSide })
    );
    rimBox.position.set(-10, 8, -8);
    rimBox.lookAt(0, 0, 0);
    envScene.add(rimBox);

    // Warm Bronze Side Strip
    const warmStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 4),
      new THREE.MeshBasicMaterial({ color: 0xd97706, side: THREE.DoubleSide })
    );
    warmStrip.position.set(0, 4, -12);
    warmStrip.lookAt(0, 0, 0);
    envScene.add(warmStrip);

    const rt = this.pmremGenerator.fromScene(envScene, 0.035);
    this.scene.environment = rt.texture;
  }

  // ==================== PROCEDURAL GOTHIC ROYAL TEXTURES ====================
  generateGothicTextures() {
    // 1. Light Square: Engraved Antique Silver/Pewter Filigree Tile
    const createSilverFiligreeTile = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');

      // Brushed pewter base
      const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 360);
      grad.addColorStop(0, '#d6d3cd');
      grad.addColorStop(0.7, '#a8a298');
      grad.addColorStop(1, '#787269');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Fine brushed metal lines
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      for (let i = 0; i < 400; i++) {
        ctx.beginPath();
        const y = Math.random() * 512;
        ctx.moveTo(0, y);
        ctx.lineTo(512, y + (Math.random() - 0.5) * 6);
        ctx.stroke();
      }

      // Double recessed border frame
      ctx.strokeStyle = '#524d46';
      ctx.lineWidth = 14;
      ctx.strokeRect(18, 18, 476, 476);
      ctx.strokeStyle = '#e5e0d8';
      ctx.lineWidth = 4;
      ctx.strokeRect(28, 28, 456, 456);

      // Symmetrical Baroque Filigree / Acanthus Motif in center
      ctx.save();
      ctx.translate(256, 256);
      for (let rot = 0; rot < 8; rot++) {
        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = '#4a453e';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(70, 0, 42, -0.8, 0.8);
        ctx.stroke();

        ctx.strokeStyle = '#ece8e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(68, -2, 42, -0.8, 0.8);
        ctx.stroke();

        // Floral petal curves
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.bezierCurveTo(60, 45, 120, 45, 165, 0);
        ctx.bezierCurveTo(120, -45, 60, -45, 20, 0);
        ctx.strokeStyle = 'rgba(60, 55, 48, 0.55)';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      ctx.restore();

      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 8;
      return tex;
    };

    // 2. Dark Square: Deep Charred Ebony Carved Rosette Tile
    const createDarkRosetteTile = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');

      ctx.fillStyle = '#1b1918';
      ctx.fillRect(0, 0, 512, 512);

      // Subtle dark wood grain
      ctx.strokeStyle = 'rgba(255, 240, 220, 0.04)';
      for (let y = 0; y < 512; y += 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y + Math.sin(y * 0.05) * 4);
        ctx.stroke();
      }

      // Carved border
      ctx.strokeStyle = '#0d0c0b';
      ctx.lineWidth = 16;
      ctx.strokeRect(18, 18, 476, 476);
      ctx.strokeStyle = '#332f2c';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 452, 452);

      // Carved Gothic Rosette in center
      ctx.save();
      ctx.translate(256, 256);
      for (let rot = 0; rot < 8; rot++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.quadraticCurveTo(85, 55, 155, 0);
        ctx.quadraticCurveTo(85, -55, 15, 0);
        ctx.strokeStyle = '#090807';
        ctx.lineWidth = 7;
        ctx.stroke();

        ctx.strokeStyle = '#38332e';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.restore();

      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 8;
      return tex;
    };

    // 3. High-Gloss Burled Walnut Wood Texture (For Piece Pedestal Bases & Carved Chest Frame)
    const createBurledWalnut = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');

      ctx.fillStyle = '#3b2412';
      ctx.fillRect(0, 0, 512, 512);

      // Rich walnut burl swirls
      for (let i = 0; i < 65; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 30 + Math.random() * 95;
        const g = ctx.createRadialGradient(x, y, 4, x, y, r);
        g.addColorStop(0, 'rgba(110, 68, 32, 0.42)');
        g.addColorStop(0.5, 'rgba(28, 16, 7, 0.38)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 512);
      }

      // Flowing wood grain fibers
      for (let y = 0; y < 512; y += 2) {
        const wave = Math.sin(y * 0.035) * 18 + Math.cos(y * 0.08) * 6;
        ctx.strokeStyle = y % 5 === 0 ? 'rgba(18, 10, 4, 0.45)' : 'rgba(138, 88, 45, 0.2)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(170, y + wave, 340, y - wave, 512, y);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      return tex;
    };

    // 4. Medieval Armor / Quilted Diamond & Filigree Bump Map (For Knights, Kings, Queens, Rooks)
    const createArmorReliefBump = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');

      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 512, 512);

      // Diamond quilted pattern (seen on the Knight & King chest in the reference photos!)
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 4;
      const step = 32;
      for (let i = -512; i < 1024; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 512, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i + 512, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
      }

      // Ornamental rivets inside diamonds
      ctx.fillStyle = '#d0d0d0';
      for (let y = 16; y < 512; y += step) {
        for (let x = 16; x < 512; x += step) {
          ctx.beginPath();
          ctx.arc(x, y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    this.textures.silverTile = createSilverFiligreeTile();
    this.textures.darkTile = createDarkRosetteTile();
    this.textures.burledWalnut = createBurledWalnut();
    this.textures.armorBump = createArmorReliefBump();
  }

  // ==================== PBR MATERIALS ====================
  initMaterials() {
    // Light Squares: Brushed Antique Silver/Pewter with Baroque Filigree Relief
    this.materials.squareLight = new THREE.MeshStandardMaterial({
      map: this.textures.silverTile,
      bumpMap: this.textures.silverTile,
      bumpScale: 0.018,
      color: 0xdcd7ce,
      roughness: 0.32,
      metalness: 0.72
    });

    // Dark Squares: Deep Charred Ebony with Gothic Rosette Carving
    this.materials.squareDark = new THREE.MeshStandardMaterial({
      map: this.textures.darkTile,
      bumpMap: this.textures.darkTile,
      bumpScale: 0.02,
      color: 0x24211f,
      roughness: 0.42,
      metalness: 0.18
    });

    // Carved Antique Walnut Board Chest
    this.materials.carvedWalnut = new THREE.MeshPhysicalMaterial({
      map: this.textures.burledWalnut,
      bumpMap: this.textures.burledWalnut,
      bumpScale: 0.016,
      color: 0x472e19,
      roughness: 0.35,
      metalness: 0.08,
      clearcoat: 0.45,
      clearcoatRoughness: 0.25
    });

    // Turned High-Gloss Lacquered Burled Walnut Pedestal (Bottom of all Chess Pieces)
    this.materials.pedestalWalnut = new THREE.MeshPhysicalMaterial({
      map: this.textures.burledWalnut,
      bumpMap: this.textures.burledWalnut,
      bumpScale: 0.008,
      color: 0x5c381c,
      roughness: 0.16,
      metalness: 0.05,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08
    });

    // Antique Silver / Pewter Mounts (Lion Heads, Corner Brackets, Studs)
    this.materials.antiquePewter = new THREE.MeshStandardMaterial({
      map: this.textures.armorBump,
      bumpMap: this.textures.armorBump,
      bumpScale: 0.012,
      color: 0x9ca3af,
      roughness: 0.3,
      metalness: 0.85
    });

    // WHITE ARMY UPPER BUST: Polished Antique Silver / Bright Pewter with Engraved Armor
    this.materials.bustWhite = new THREE.MeshPhysicalMaterial({
      bumpMap: this.textures.armorBump,
      bumpScale: 0.014,
      color: 0xdde2e8,
      roughness: 0.25,
      metalness: 0.82,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2
    });

    // WHITE ARMY ACCENT TRIM (Champagne Gold / Warm Brass)
    this.materials.trimWhite = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.88
    });

    // BLACK ARMY UPPER BUST: Darkened Bronze-Iron / Gunmetal with Warm Patina (Matches Reference Photos!)
    this.materials.bustBlack = new THREE.MeshPhysicalMaterial({
      bumpMap: this.textures.armorBump,
      bumpScale: 0.015,
      color: 0x3b3530,
      roughness: 0.28,
      metalness: 0.78,
      clearcoat: 0.4,
      clearcoatRoughness: 0.22
    });

    // BLACK ARMY ACCENT TRIM (Burnished Copper-Bronze Patina)
    this.materials.trimBlack = new THREE.MeshStandardMaterial({
      color: 0x855836,
      roughness: 0.3,
      metalness: 0.82
    });

    // Interactive Highlights
    this.materials.selectedGlow = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });

    this.materials.lastMoveGlow = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });

    this.materials.legalMoveDot = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9
    });

    this.materials.captureRing = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.0,
      roughness: 0.2,
      transparent: true,
      opacity: 0.92
    });

    this.materials.hintGlow = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.1,
      transparent: true,
      opacity: 0.9
    });
  }

  // ==================== SCULPTED GOTHIC ROYAL PIECE GEOMETRIES ====================
  initGeometries() {
    // Turned Burled Walnut Pedestal Base (exact match to the bottom of every piece in the photos!)
    const pedestalProfile = [
      [0, 0],
      [0.95, 0],
      [0.98, 0.07],
      [0.86, 0.13],
      [0.92, 0.24],
      [0.90, 0.36],
      [0.68, 0.52],
      [0.54, 0.64],
      [0.66, 0.72],
      [0.72, 0.78],
      [0, 0.78]
    ].map(([x, y]) => new THREE.Vector2(x * 0.39, y * 0.42));

    this.geometries.pedestal = new THREE.LatheGeometry(pedestalProfile, 36);
    this.geometries.pedestal.computeVertexNormals();
  }

  createPieceMesh(pieceCode) {
    const color = pieceCode[0];
    const type = pieceCode[1];
    const bustMat = color === 'w' ? this.materials.bustWhite : this.materials.bustBlack;
    const trimMat = color === 'w' ? this.materials.trimWhite : this.materials.trimBlack;

    const group = new THREE.Group();

    // 1. Turned Burled Walnut Pedestal Base (Shared by all pieces, y: 0 -> 0.33)
    const pedestal = new THREE.Mesh(this.geometries.pedestal, this.materials.pedestalWalnut);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    // Metallic Collar Ring between Walnut Base and Metallic Bust
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 12, 32), trimMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.33;
    group.add(collar);

    const baseH = 0.33;
    const bustGroup = new THREE.Group();
    bustGroup.position.y = baseH;
    // Face opponent
    bustGroup.rotation.y = color === 'w' ? Math.PI : 0;

    if (type === 'P') {
      // PRAJURIT (Armored Medieval Infantry Bust with Visored Helmet & Plume Orb)
      // Torso & Cuirass
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.21, 0.28, 20), bustMat);
      torso.position.y = 0.14;
      torso.scale.set(1.15, 1, 0.82);
      torso.castShadow = true;
      bustGroup.add(torso);

      // Left & Right Armored Pauldrons (Shoulders)
      [-0.24, 0.24].forEach(xPos => {
        const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), bustMat);
        pauldron.position.set(xPos, 0.2, 0);
        pauldron.scale.set(0.9, 1.1, 0.95);
        pauldron.castShadow = true;
        bustGroup.add(pauldron);
      });

      // Chest Heraldic Shield
      const shield = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.06), trimMat);
      shield.position.set(0, 0.15, 0.17);
      shield.rotation.z = Math.PI / 4;
      bustGroup.add(shield);

      // Visored Sallet Helmet
      const helm = new THREE.Mesh(new THREE.SphereGeometry(0.175, 24, 24), bustMat);
      helm.position.y = 0.42;
      helm.scale.set(0.95, 1.12, 1.05);
      helm.castShadow = true;
      bustGroup.add(helm);

      // Pointed Visor Beak
      const visor = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.16, 4), trimMat);
      visor.rotation.x = Math.PI / 2;
      visor.position.set(0, 0.4, 0.14);
      bustGroup.add(visor);

      // Top Plume Finial Orb
      const plume = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 14), trimMat);
      plume.position.y = 0.63;
      bustGroup.add(plume);

    } else if (type === 'R') {
      // BENTENG (Medieval Castle Fortress Tower with Arched Gate, Shield, & 8 Battlements)
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.62, 24), bustMat);
      tower.position.y = 0.31;
      tower.castShadow = true;
      tower.receiveShadow = true;
      bustGroup.add(tower);

      // Gothic Arched Gateway on front
      const gate = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.26, 0.08), trimMat);
      gate.position.set(0, 0.15, 0.25);
      bustGroup.add(gate);

      // Heraldic Shield above gate
      const shield = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.16, 4), trimMat);
      shield.rotation.x = Math.PI;
      shield.position.set(0, 0.38, 0.26);
      bustGroup.add(shield);

      // Upper Corbel Ring
      const corbel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.1, 24), trimMat);
      corbel.position.y = 0.64;
      bustGroup.add(corbel);

      // 8 Crenellated Battlement Merlons around top rim
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.11, 0.085), bustMat);
        merlon.position.set(Math.cos(angle) * 0.23, 0.73, Math.sin(angle) * 0.23);
        merlon.rotation.y = -angle;
        merlon.castShadow = true;
        bustGroup.add(merlon);
      }

    } else if (type === 'N') {
      // KUDA (Armored Warhorse Bust with Quilted Barding, Flowing Mane & Mini-Crown)
      // Chest Scroll Base
      const chest = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 20), bustMat);
      chest.position.y = 0.16;
      chest.scale.set(1.05, 0.85, 1.0);
      chest.castShadow = true;
      bustGroup.add(chest);

      // Muscular Arched Warhorse Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.23, 0.52, 20), bustMat);
      neck.position.set(0, 0.42, -0.02);
      neck.rotation.x = 0.28;
      neck.castShadow = true;
      bustGroup.add(neck);

      // Sculpted Horse Head & Muzzle
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.155, 0.44, 16), bustMat);
      head.position.set(0, 0.56, 0.16);
      head.rotation.x = Math.PI * 0.62;
      head.castShadow = true;
      bustGroup.add(head);

      // Bridle Straps
      const bridle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 20), trimMat);
      bridle.position.set(0, 0.5, 0.24);
      bustGroup.add(bridle);

      // Flowing Sculpted Mane Plates along back of neck
      for (let m = 0; m < 4; m++) {
        const lock = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), trimMat);
        lock.scale.set(0.6, 1.3, 1.1);
        lock.position.set(0, 0.28 + m * 0.11, -0.16 - m * 0.02);
        bustGroup.add(lock);
      }

      // Twin Ears
      [-0.08, 0.08].forEach(ex => {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 8), bustMat);
        ear.position.set(ex, 0.74, 0.02);
        bustGroup.add(ear);
      });

      // Small Royal Crown perched on Horse's Head (exact detail from photo!)
      const horseCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 0.09, 12), trimMat);
      horseCrown.position.set(0, 0.76, -0.04);
      horseCrown.rotation.x = -0.2;
      bustGroup.add(horseCrown);

    } else if (type === 'B') {
      // GAJAH / USKUP (Armored Templar Prelate Bust with Mitre & Cross)
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.21, 0.34, 20), bustMat);
      torso.position.y = 0.17;
      torso.scale.set(1.18, 1, 0.84);
      torso.castShadow = true;
      bustGroup.add(torso);

      [-0.25, 0.25].forEach(xPos => {
        const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 16), trimMat);
        pauldron.position.set(xPos, 0.24, 0);
        bustGroup.add(pauldron);
      });

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 20), bustMat);
      head.position.y = 0.45;
      head.castShadow = true;
      bustGroup.add(head);

      // Gothic Pointed Mitre Hat
      const mitre = new THREE.Mesh(new THREE.ConeGeometry(0.155, 0.32, 16), trimMat);
      mitre.position.y = 0.68;
      mitre.castShadow = true;
      bustGroup.add(mitre);

      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), bustMat);
      orb.position.y = 0.85;
      bustGroup.add(orb);

    } else if (type === 'Q') {
      // RATU (Regal Queen Bust with Ornate Bodice, Pauldrons, Hair & Imperial Crown)
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.21, 0.36, 24), bustMat);
      torso.position.y = 0.18;
      torso.scale.set(1.2, 1, 0.85);
      torso.castShadow = true;
      bustGroup.add(torso);

      // Ornate Shoulder Pauldrons & Cloak
      [-0.26, 0.26].forEach(xPos => {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), bustMat);
        p.position.set(xPos, 0.25, -0.02);
        p.castShadow = true;
        bustGroup.add(p);
      });

      // Queen Head & Flowing Hair
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.155, 24, 24), bustMat);
      head.position.y = 0.48;
      head.castShadow = true;
      bustGroup.add(head);

      // Royal Fluted Crown
      const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.18, 16), trimMat);
      crownBase.position.y = 0.66;
      crownBase.castShadow = true;
      bustGroup.add(crownBase);

      const crownDome = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), bustMat);
      crownDome.position.y = 0.72;
      crownDome.scale.set(1, 0.7, 1);
      bustGroup.add(crownDome);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), trimMat);
      finial.position.y = 0.85;
      bustGroup.add(finial);

    } else if (type === 'K') {
      // RAJA (Bearded Medieval King Bust with Broad Pauldrons, Lion Chest Emblem, & Arched Crown + Cross)
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.23, 0.4, 24), bustMat);
      torso.position.y = 0.2;
      torso.scale.set(1.25, 1, 0.88);
      torso.castShadow = true;
      bustGroup.add(torso);

      // Broad Royal Pauldrons
      [-0.29, 0.29].forEach(xPos => {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.155, 18, 18), bustMat);
        p.position.set(xPos, 0.27, 0);
        p.castShadow = true;
        bustGroup.add(p);
      });

      // Lion Medallion on Chest
      const lionCrest = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), trimMat);
      lionCrest.scale.set(1, 1.1, 0.45);
      lionCrest.position.set(0, 0.22, 0.21);
      bustGroup.add(lionCrest);

      // Bearded King Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.165, 24, 24), bustMat);
      head.position.y = 0.52;
      head.castShadow = true;
      bustGroup.add(head);

      const beard = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.18, 12), bustMat);
      beard.rotation.x = Math.PI;
      beard.position.set(0, 0.42, 0.08);
      bustGroup.add(beard);

      // Grand Arched Imperial Crown
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.155, 0.2, 18), trimMat);
      crown.position.y = 0.72;
      crown.castShadow = true;
      bustGroup.add(crown);

      // Crown Arches
      const arch1 = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 10, 24, Math.PI), trimMat);
      arch1.position.y = 0.78;
      bustGroup.add(arch1);

      const arch2 = arch1.clone();
      arch2.rotation.y = Math.PI / 2;
      bustGroup.add(arch2);

      // Royal Cross on Top
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.16, 0.045), trimMat);
      crossV.position.y = 0.99;
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.045), trimMat);
      crossH.position.y = 1.01;
      bustGroup.add(crossV, crossH);
    }

    group.add(bustGroup);
    return group;
  }

  // ==================== BUILD ORNATE CARVED GOTHIC CHESSBOARD ====================
  buildGothicBoardMesh() {
    // 1. Inner Riveted Walnut Frame (Surrounding the 8x8 tiles)
    const innerFrameGeo = new THREE.BoxGeometry(8.55, 0.56, 8.55);
    const innerFrame = new THREE.Mesh(innerFrameGeo, this.materials.carvedWalnut);
    innerFrame.position.y = -0.28;
    innerFrame.receiveShadow = true;
    innerFrame.castShadow = true;
    this.boardGroup.add(innerFrame);

    // Metallic Rivet Studs around the inner perimeter (exact detail from DETAIL SUDUT!)
    const studGeo = new THREE.SphereGeometry(0.045, 12, 12);
    for (let i = -3.5; i <= 3.5; i += 1.0) {
      [
        [i, 4.14], [i, -4.14],
        [4.14, i], [-4.14, i]
      ].forEach(([sx, sz]) => {
        const stud = new THREE.Mesh(studGeo, this.materials.antiquePewter);
        stud.position.set(sx, 0.01, sz);
        this.boardGroup.add(stud);
      });
    }

    // 2. Outer Deeply Carved Walnut Chest Cabinet
    const chestTopRim = new THREE.Mesh(
      new THREE.BoxGeometry(9.85, 0.62, 9.85),
      this.materials.carvedWalnut
    );
    chestTopRim.position.y = -0.32;
    chestTopRim.castShadow = true;
    chestTopRim.receiveShadow = true;
    this.boardGroup.add(chestTopRim);

    const chestBody = new THREE.Mesh(
      new THREE.BoxGeometry(9.45, 1.05, 9.45),
      this.materials.carvedWalnut
    );
    chestBody.position.y = -0.82;
    chestBody.castShadow = true;
    chestBody.receiveShadow = true;
    this.boardGroup.add(chestBody);

    const chestBasePlinth = new THREE.Mesh(
      new THREE.BoxGeometry(9.9, 0.28, 9.9),
      this.materials.carvedWalnut
    );
    chestBasePlinth.position.y = -1.35;
    chestBasePlinth.castShadow = true;
    chestBasePlinth.receiveShadow = true;
    this.boardGroup.add(chestBasePlinth);

    // 3. Four Antique Pewter Lion-Head Corner Mounts & Claw Feet
    const corners = [
      [-4.85, -4.85],
      [4.85, -4.85],
      [-4.85, 4.85],
      [4.85, 4.85]
    ];

    corners.forEach(([cx, cz]) => {
      // Corner Pewter Plate on Top
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.66, 0.85),
        this.materials.antiquePewter
      );
      plate.position.set(cx * 0.94, -0.31, cz * 0.94);
      this.boardGroup.add(plate);

      // Sculpted Lion Head Boss on Corner
      const lionHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 16, 16),
        this.materials.antiquePewter
      );
      lionHead.position.set(cx * 0.98, -0.25, cz * 0.98);
      this.boardGroup.add(lionHead);

      // Carved Claw Foot under each corner
      const clawFoot = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 16, 16),
        this.materials.carvedWalnut
      );
      clawFoot.scale.set(1.1, 0.75, 1.1);
      clawFoot.position.set(cx * 0.95, -1.58, cz * 0.95);
      clawFoot.castShadow = true;
      this.boardGroup.add(clawFoot);
    });

    // 4. Side Heraldic Shields on all 4 sides of the chest
    [
      [0, 4.78, 0],
      [0, -4.78, Math.PI],
      [4.78, 0, Math.PI / 2],
      [-4.78, 0, -Math.PI / 2]
    ].forEach(([hx, hz, rotY]) => {
      const shield = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.75, 0.14),
        this.materials.antiquePewter
      );
      shield.position.set(hx, -0.78, hz);
      shield.rotation.y = rotY;
      this.boardGroup.add(shield);
    });

    // 5. Studio Matte Floor Plane (for rich contact shadows under the claw feet)
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x121316,
      roughness: 0.75,
      metalness: 0.15
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -1.82;
    floorMesh.receiveShadow = true;
    this.boardGroup.add(floorMesh);

    // 6. 64 Individual Engraved Tiles
    this.squareMeshes = Array.from({ length: 8 }, () => Array(8).fill(null));
    const sqGeo = new THREE.BoxGeometry(0.98, 0.1, 0.98);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0;
        const mesh = new THREE.Mesh(
          sqGeo,
          isLight ? this.materials.squareLight : this.materials.squareDark
        );
        const pos = this.boardToWorld(r, c);
        mesh.position.set(pos.x, -0.04, pos.z);
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

  // ==================== DLSS 5 / STUDIO DRAMATIC LIGHTING RIG ====================
  setupLights() {
    this.lights.hemi = new THREE.HemisphereLight(0xe2e8f0, 0x1c1917, 0.95);
    this.scene.add(this.lights.hemi);

    // Overhead Studio Key Spotlight (creates crisp silver filigree highlights & soft shadows)
    this.lights.keySpot = new THREE.SpotLight(0xfff7ed, 46);
    this.lights.keySpot.position.set(6.5, 14, 7.5);
    this.lights.keySpot.angle = Math.PI / 3.0;
    this.lights.keySpot.penumbra = 0.72;
    this.lights.keySpot.decay = 1.6;
    this.lights.keySpot.distance = 38;
    this.lights.keySpot.castShadow = true;
    this.lights.keySpot.shadow.mapSize.width = 2048;
    this.lights.keySpot.shadow.mapSize.height = 2048;
    this.lights.keySpot.shadow.camera.near = 3;
    this.lights.keySpot.shadow.camera.far = 28;
    this.lights.keySpot.shadow.bias = -0.0005;
    this.scene.add(this.lights.keySpot);

    // Cool Silver Rim Backlight (sculpts the silhouettes of the busts like the reference photos)
    this.lights.rimLight = new THREE.DirectionalLight(0xcbd5e1, 4.2);
    this.lights.rimLight.position.set(-8, 7, -9);
    this.scene.add(this.lights.rimLight);

    // Warm Bronze Side Fill Light (brings out the burled walnut wood grain)
    this.lights.warmBounce = new THREE.PointLight(0xd97706, 7.5, 20, 1.8);
    this.lights.warmBounce.position.set(8, 3.5, -6);
    this.scene.add(this.lights.warmBounce);

    // Check Alert Crimson Light
    this.lights.checkLight = new THREE.PointLight(0xef4444, 0, 5.5, 2);
    this.lights.checkLight.position.set(0, 2.2, 0);
    this.scene.add(this.lights.checkLight);
  }

  setLightingPreset(preset) {
    this.lightingPreset = preset;

    if (preset === 'rtx_ultra') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.35, 2.5));
      this.renderer.shadowMap.enabled = true;
      this.renderer.toneMappingExposure = 1.25;
      this.lights.keySpot.color.setHex(0xfff7ed);
      this.lights.keySpot.intensity = 46;
      this.lights.rimLight.color.setHex(0xcbd5e1);
      this.lights.rimLight.intensity = 4.2;
      this.lights.warmBounce.color.setHex(0xd97706);
      this.lights.warmBounce.intensity = 7.5;
      this.scene.background.setHex(0x141518);
    } else if (preset === 'golden_hour') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.25, 2.2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.toneMappingExposure = 1.32;
      this.lights.keySpot.color.setHex(0xfde68a);
      this.lights.keySpot.intensity = 50;
      this.lights.rimLight.color.setHex(0xf59e0b);
      this.lights.rimLight.intensity = 4.5;
      this.lights.warmBounce.color.setHex(0xb45309);
      this.lights.warmBounce.intensity = 10.0;
      this.scene.background.setHex(0x17120e);
    } else if (preset === 'cyber_neon') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.25, 2.2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.toneMappingExposure = 1.35;
      this.lights.keySpot.color.setHex(0xe0e7ff);
      this.lights.keySpot.intensity = 40;
      this.lights.rimLight.color.setHex(0x38bdf8);
      this.lights.rimLight.intensity = 6.5;
      this.lights.warmBounce.color.setHex(0xa855f7);
      this.lights.warmBounce.intensity = 11.0;
      this.scene.background.setHex(0x090a14);
    } else if (preset === 'performance') {
      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.enabled = false;
      this.renderer.toneMappingExposure = 1.18;
      this.lights.keySpot.intensity = 32;
      this.lights.rimLight.intensity = 2.5;
      this.lights.warmBounce.intensity = 4.0;
    }
  }

  setBoardTheme3D(theme) {
    if (theme === 'wood') {
      // Classic Warm Bronze & Walnut
      this.materials.squareLight.color.setHex(0xe6ccb2);
      this.materials.squareDark.color.setHex(0x3b2313);
    } else if (theme === 'ocean') {
      // Cold Steel & Deep Slate
      this.materials.squareLight.color.setHex(0xdbeafe);
      this.materials.squareDark.color.setHex(0x0f172a);
    } else if (theme === 'midnight') {
      // Royal Gold & Obsidian
      this.materials.squareLight.color.setHex(0xfde68a);
      this.materials.squareDark.color.setHex(0x18181b);
    } else {
      // Default Gothic Silver Filigree & Charred Ebony (Photo Reference Match)
      this.materials.squareLight.color.setHex(0xdcd7ce);
      this.materials.squareDark.color.setHex(0x24211f);
    }
  }

  // ==================== CAMERA POV PERSPECTIVES ====================
  setPOV(pov, instant = false) {
    this.currentPOV = pov;
    const isBlackSide = this.game.flipped;
    const baseTheta = isBlackSide ? Math.PI : 0;

    if (pov === 'player') {
      this.targetSpherical = {
        radius: 10.8,
        phi: 1.04,
        theta: baseTheta
      };
      this.targetLookAt.set(0, 0.3, isBlackSide ? 0.45 : -0.45);
    } else if (pov === 'cinematic') {
      this.targetSpherical = {
        radius: 12.4,
        phi: 0.82,
        theta: baseTheta + 0.45
      };
      this.targetLookAt.set(0, 0.1, 0);
    } else if (pov === 'top') {
      this.targetSpherical = {
        radius: 12.5,
        phi: 0.1,
        theta: baseTheta
      };
      this.targetLookAt.set(0, 0, 0);
    } else if (pov === 'side') {
      this.targetSpherical = {
        radius: 12.6,
        phi: 0.92,
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

  // ==================== SYNC BOARD & MARKERS ====================
  syncWithGame(animateMove = null) {
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

    if (this.game.selectedSquare) {
      const { r, c } = this.game.selectedSquare;
      const pos = this.boardToWorld(r, c);
      const selMesh = new THREE.Mesh(planeGeo, this.materials.selectedGlow);
      selMesh.position.set(pos.x, 0.015, pos.z);
      this.markersGroup.add(selMesh);

      const selectedPiece = this.pieceMeshes[`${r},${c}`];
      if (selectedPiece) {
        selectedPiece.position.y = 0.16;
      }
    }

    if (this.game.lastMove) {
      const { fromR, fromC, toR, toC } = this.game.lastMove;
      [[fromR, fromC], [toR, toC]].forEach(([r, c]) => {
        const pos = this.boardToWorld(r, c);
        const m = new THREE.Mesh(planeGeo, this.materials.lastMoveGlow);
        m.position.set(pos.x, 0.01, pos.z);
        this.markersGroup.add(m);
      });
    }

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

    if (this.game.isInCheck(this.game.turn)) {
      const kingPos = this.game.findKing(this.game.turn);
      if (kingPos) {
        const worldPos = this.boardToWorld(kingPos.r, kingPos.c);
        this.lights.checkLight.position.set(worldPos.x, 2.0, worldPos.z);
        this.lights.checkLight.intensity = 18;

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

  // ==================== RAYCASTING & ORBIT CAMERA ====================
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
          0.1,
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
        7.0,
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

    const pieceHits = this.raycaster.intersectObjects(this.piecesGroup.children, true);
    if (pieceHits.length > 0) {
      let obj = pieceHits[0].object;
      while (obj && (!obj.userData || obj.userData.r === undefined)) {
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
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.enabled) return;

    const dt = Math.min(this.clock.getDelta(), 0.1);

    const lerpFactor = 1 - Math.pow(0.001, dt);
    this.camSpherical.radius += (this.targetSpherical.radius - this.camSpherical.radius) * lerpFactor;
    this.camSpherical.phi += (this.targetSpherical.phi - this.camSpherical.phi) * lerpFactor;
    this.camSpherical.theta += (this.targetSpherical.theta - this.camSpherical.theta) * lerpFactor;
    this.camLookAt.lerp(this.targetLookAt, lerpFactor);
    this.updateCameraTransform();

    for (let i = this.activeAnimations.length - 1; i >= 0; i--) {
      const anim = this.activeAnimations[i];
      anim.elapsed += dt;
      const t = Math.min(1, anim.elapsed / anim.duration);
      const ease = 1 - Math.pow(1 - t, 3);

      anim.mesh.position.x = anim.startX + (anim.endX - anim.startX) * ease;
      anim.mesh.position.z = anim.startZ + (anim.endZ - anim.startZ) * ease;
      anim.mesh.position.y = Math.sin(t * Math.PI) * 0.78;

      if (t >= 1) {
        anim.mesh.position.y = 0;
        this.activeAnimations.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.Chess3DRenderer = Chess3DRenderer;
