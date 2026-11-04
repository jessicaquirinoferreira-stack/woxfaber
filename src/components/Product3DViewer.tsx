import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Product } from '../types';
import { RotateCw, Eye, Sparkles, Layers, Sliders, X, Check } from 'lucide-react';

interface Product3DViewerProps {
  product: Product;
  onClose?: () => void;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({ product, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [activePreset, setActivePreset] = useState<'hero' | 'rear' | 'woofer' | 'horn'>('hero');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // References to threejs scene elements for dynamic controls
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080808);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(2.8, 1.4, 3.6);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Main acoustic product group
    const speakerGroup = new THREE.Group();
    groupRef.current = speakerGroup;
    scene.add(speakerGroup);

    // Materials list for wireframe toggles
    const materials: THREE.Material[] = [];
    materialsRef.current = materials;

    // 1. Cabinet Plywood & Polyurea Material
    const cabinetMaterial = new THREE.MeshStandardMaterial({
      color: 0x161616,
      roughness: 0.78,
      metalness: 0.15,
      bumpScale: 0.05,
    });
    materials.push(cabinetMaterial);

    // 2. Front Acoustic Steel Grille Material
    const grilleMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.45,
      metalness: 0.65,
      wireframe: false,
    });
    materials.push(grilleMaterial);

    // 3. Champagne Gold Accent Metal Material (WOX Emblem & Screws)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xC9A96E,
      roughness: 0.28,
      metalness: 0.88,
    });
    materials.push(goldMaterial);

    // 4. Woofer Cone Polypropylene / Paper Pulp
    const coneMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.55,
      metalness: 0.2,
    });
    materials.push(coneMaterial);

    // 5. Blue LCD DSP Display screen
    const lcdMaterial = new THREE.MeshBasicMaterial({
      color: 0x1E88E5,
    });
    materials.push(lcdMaterial);

    const isSubwoofer = product.category === 'subwoofers' || product.slug.includes('212sb');

    // Build realistic 3D acoustic geometry:
    if (!isSubwoofer) {
      // --- KRS315A 2-Way 15" Active Speaker Geometry ---

      // A. Main Trapezoidal Cabinet
      const cabinetGeo = new THREE.BoxGeometry(1.4, 2.2, 1.2);
      const cabinetMesh = new THREE.Mesh(cabinetGeo, cabinetMaterial);
      cabinetMesh.castShadow = true;
      cabinetMesh.receiveShadow = true;
      speakerGroup.add(cabinetMesh);

      // B. Beveled Front Baffle Inset
      const baffleGeo = new THREE.BoxGeometry(1.3, 2.1, 0.08);
      const baffleMesh = new THREE.Mesh(baffleGeo, new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.9 }));
      baffleMesh.position.set(0, 0, 0.61);
      speakerGroup.add(baffleMesh);

      // C. High-Frequency Constant Directivity Horn Waveguide (Upper half)
      const hornOuterGeo = new THREE.BoxGeometry(1.0, 0.65, 0.25);
      const hornOuter = new THREE.Mesh(hornOuterGeo, new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.3, metalness: 0.4 }));
      hornOuter.position.set(0, 0.6, 0.62);
      speakerGroup.add(hornOuter);

      // Horn throat interior cone (90° x 60° flare)
      const hornFlareGeo = new THREE.ConeGeometry(0.35, 0.35, 16, 1, true);
      hornFlareGeo.rotateX(Math.PI / 2);
      const hornFlare = new THREE.Mesh(hornFlareGeo, new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 }));
      hornFlare.position.set(0, 0.6, 0.65);
      speakerGroup.add(hornFlare);

      // Horn phase plug tip (champagne gold)
      const phasePlugGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const phasePlug = new THREE.Mesh(phasePlugGeo, goldMaterial);
      phasePlug.position.set(0, 0.6, 0.58);
      speakerGroup.add(phasePlug);

      // D. 15" High-Excursion Woofer Cone (Lower half)
      const wooferFrameGeo = new THREE.TorusGeometry(0.52, 0.05, 16, 32);
      const wooferFrame = new THREE.Mesh(wooferFrameGeo, new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 }));
      wooferFrame.position.set(0, -0.38, 0.65);
      speakerGroup.add(wooferFrame);

      // Ribbed woofer cone
      const coneGeo = new THREE.ConeGeometry(0.48, 0.24, 32, 1, true);
      coneGeo.rotateX(-Math.PI / 2);
      const coneMesh = new THREE.Mesh(coneGeo, coneMaterial);
      coneMesh.position.set(0, -0.38, 0.55);
      speakerGroup.add(coneMesh);

      // Center dust cap
      const dustCapGeo = new THREE.SphereGeometry(0.16, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      dustCapGeo.rotateX(Math.PI / 2);
      const dustCap = new THREE.Mesh(dustCapGeo, new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.4 }));
      dustCap.position.set(0, -0.38, 0.64);
      speakerGroup.add(dustCap);

      // E. Acoustic Bass Reflex Ports (twin reflex tunnels)
      const portGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.2, 16);
      portGeo.rotateX(Math.PI / 2);
      const portLeft = new THREE.Mesh(portGeo, new THREE.MeshBasicMaterial({ color: 0x020202 }));
      portLeft.position.set(-0.45, -0.9, 0.6);
      speakerGroup.add(portLeft);

      const portRight = new THREE.Mesh(portGeo, new THREE.MeshBasicMaterial({ color: 0x020202 }));
      portRight.position.set(0.45, -0.9, 0.6);
      speakerGroup.add(portRight);

      // F. Front Acoustic Hexagonal Perforated Grille (partial cutaway for aesthetic luxury)
      const grillGeo = new THREE.BoxGeometry(1.28, 2.08, 0.02);
      const grillMesh = new THREE.Mesh(
        grillGeo,
        new THREE.MeshStandardMaterial({
          color: 0x181818,
          roughness: 0.6,
          metalness: 0.7,
          transparent: true,
          opacity: 0.45,
        })
      );
      grillMesh.position.set(0, 0, 0.68);
      speakerGroup.add(grillMesh);

      // G. WOX FABER Signature Gold Emblem
      const badgeGeo = new THREE.BoxGeometry(0.38, 0.08, 0.03);
      const badge = new THREE.Mesh(badgeGeo, goldMaterial);
      badge.position.set(0, -0.92, 0.7);
      speakerGroup.add(badge);

      // H. Rear Amplifier Plate (Monoblock Classe D)
      const ampPlateGeo = new THREE.BoxGeometry(0.85, 1.4, 0.04);
      const ampPlate = new THREE.Mesh(ampPlateGeo, new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.3 }));
      ampPlate.position.set(0, 0, -0.62);
      speakerGroup.add(ampPlate);

      // Rear Heat Sink Fins
      for (let f = -4; f <= 4; f++) {
        const finGeo = new THREE.BoxGeometry(0.02, 0.9, 0.12);
        const fin = new THREE.Mesh(finGeo, new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 }));
        fin.position.set(f * 0.08, -0.15, -0.68);
        speakerGroup.add(fin);
      }

      // Blue LCD DSP Screen
      const lcdGeo = new THREE.BoxGeometry(0.3, 0.16, 0.02);
      const lcd = new THREE.Mesh(lcdGeo, lcdMaterial);
      lcd.position.set(0, 0.45, -0.63);
      speakerGroup.add(lcd);

      // Dual XLR/Combo In jacks
      const xlrGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.05, 12);
      xlrGeo.rotateX(Math.PI / 2);
      const xlr1 = new THREE.Mesh(xlrGeo, new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7 }));
      xlr1.position.set(-0.15, 0.2, -0.63);
      speakerGroup.add(xlr1);

      const xlr2 = new THREE.Mesh(xlrGeo, new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7 }));
      xlr2.position.set(0.15, 0.2, -0.63);
      speakerGroup.add(xlr2);

    } else {
      // --- KRS212SB Active 12" Subwoofer Geometry ---

      // A. Heavy-Duty Subwoofer Enclosure (Cube style)
      const subGeo = new THREE.BoxGeometry(1.6, 1.7, 1.6);
      const subMesh = new THREE.Mesh(subGeo, cabinetMaterial);
      subMesh.castShadow = true;
      subMesh.receiveShadow = true;
      speakerGroup.add(subMesh);

      // B. Recessed Front Baffle
      const baffleGeo = new THREE.BoxGeometry(1.48, 1.58, 0.08);
      const baffle = new THREE.Mesh(baffleGeo, new THREE.MeshStandardMaterial({ color: 0x090909 }));
      baffle.position.set(0, 0, 0.81);
      speakerGroup.add(baffle);

      // C. Heavy-Duty 12" Sub-Bass Transducer with 75mm Voice Coil
      const rimGeo = new THREE.TorusGeometry(0.55, 0.06, 16, 32);
      const rim = new THREE.Mesh(rimGeo, new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6 }));
      rim.position.set(0, 0.05, 0.85);
      speakerGroup.add(rim);

      const subConeGeo = new THREE.ConeGeometry(0.5, 0.28, 32, 1, true);
      subConeGeo.rotateX(-Math.PI / 2);
      const subCone = new THREE.Mesh(subConeGeo, coneMaterial);
      subCone.position.set(0, 0.05, 0.73);
      speakerGroup.add(subCone);

      const subCapGeo = new THREE.SphereGeometry(0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      subCapGeo.rotateX(Math.PI / 2);
      const subCap = new THREE.Mesh(subCapGeo, new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 0.3 }));
      subCap.position.set(0, 0.05, 0.85);
      speakerGroup.add(subCap);

      // Large Slot Port / Bass Tunnel along bottom
      const slotPortGeo = new THREE.BoxGeometry(1.3, 0.2, 0.3);
      const slotPort = new THREE.Mesh(slotPortGeo, new THREE.MeshBasicMaterial({ color: 0x020202 }));
      slotPort.position.set(0, -0.65, 0.75);
      speakerGroup.add(slotPort);

      // WOX Gold Badge on Subwoofer
      const badgeGeo = new THREE.BoxGeometry(0.42, 0.09, 0.03);
      const badge = new THREE.Mesh(badgeGeo, goldMaterial);
      badge.position.set(0, 0.68, 0.86);
      speakerGroup.add(badge);

      // Top Pole Mount M20 Cup
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24);
      const poleCup = new THREE.Mesh(poleGeo, new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.8 }));
      poleCup.position.set(0, 0.86, 0);
      speakerGroup.add(poleCup);

      // Rear Monoblock 1000W Amp module
      const rearPlateGeo = new THREE.BoxGeometry(0.9, 1.0, 0.04);
      const rearPlate = new THREE.Mesh(rearPlateGeo, new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8 }));
      rearPlate.position.set(0, 0, -0.82);
      speakerGroup.add(rearPlate);

      // Blue LCD
      const subLcd = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.02), lcdMaterial);
      subLcd.position.set(0, 0.32, -0.83);
      speakerGroup.add(subLcd);
    }

    // Studio Lighting Rig
    // 1. Key Light (Soft White Studio Diffuser)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // 2. Warm Champagne Gold Rim Light
    const rimLight = new THREE.DirectionalLight(0xC9A96E, 2.8);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // 3. Subtle Fill Light from bottom
    const fillLight = new THREE.DirectionalLight(0x404040, 0.8);
    fillLight.position.set(0, -4, 2);
    scene.add(fillLight);

    // 4. Ambient studio glow
    const ambientLight = new THREE.AmbientLight(0x222222, 1.2);
    scene.add(ambientLight);

    // Floor Reflection Plane
    const floorGeo = new THREE.PlaneGeometry(15, 15);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.8,
      metalness: 0.3,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = isSubwoofer ? -0.86 : -1.12;
    floor.receiveShadow = true;
    scene.add(floor);

    setIsReady(true);

    // Mouse drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !speakerGroup) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      speakerGroup.rotation.y += deltaX * 0.008;
      speakerGroup.rotation.x += deltaY * 0.006;
      speakerGroup.rotation.x = Math.max(-0.6, Math.min(0.6, speakerGroup.rotation.x));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      if (speakerGroup && autoRotate && !isDragging) {
        speakerGroup.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, [product]);

  // Update wireframe state across materials
  useEffect(() => {
    materialsRef.current.forEach(mat => {
      if ('wireframe' in mat) {
        (mat as THREE.MeshStandardMaterial).wireframe = wireframe;
      }
    });
  }, [wireframe]);

  // Camera presets
  const applyPreset = (preset: 'hero' | 'rear' | 'woofer' | 'horn') => {
    setActivePreset(preset);
    const camera = cameraRef.current;
    const group = groupRef.current;
    if (!camera || !group) return;

    if (preset === 'hero') {
      camera.position.set(2.8, 1.4, 3.6);
      camera.lookAt(0, 0, 0);
      group.rotation.set(0, 0.4, 0);
    } else if (preset === 'rear') {
      camera.position.set(0, 0.2, -3.8);
      camera.lookAt(0, 0, 0);
      group.rotation.set(0, Math.PI, 0);
    } else if (preset === 'woofer') {
      camera.position.set(0, -0.4, 2.4);
      camera.lookAt(0, -0.3, 0);
      group.rotation.set(0, 0, 0);
    } else if (preset === 'horn') {
      camera.position.set(0, 0.8, 2.2);
      camera.lookAt(0, 0.6, 0);
      group.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] bg-[#080808] rounded-sm border border-white/10 overflow-hidden flex flex-col">
      {/* Top Studio HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-black/70 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-white uppercase">
            3D STUDIO · {product.name}
          </span>
          <span className="text-[10px] font-mono text-[#C9A96E]">96kHz DSP CHASSIS</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-[#C9A96E] transition-colors"
              aria-label="Fechar visualizador 3D"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3D Canvas Mounting Container */}
      <div
        ref={mountRef}
        className="w-full flex-1 cursor-grab active:cursor-grabbing relative"
      />

      {/* Bottom Floating Control Deck */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Preset Angle Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-sm bg-black/80 border border-white/10 backdrop-blur-md pointer-events-auto">
          <button
            onClick={() => applyPreset('hero')}
            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-sm transition-all ${
              activePreset === 'hero' ? 'bg-[#C9A96E] text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Perspectiva
          </button>
          <button
            onClick={() => applyPreset('rear')}
            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-sm transition-all ${
              activePreset === 'rear' ? 'bg-[#C9A96E] text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Painel DSP Traseiro
          </button>
          <button
            onClick={() => applyPreset('woofer')}
            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-sm transition-all ${
              activePreset === 'woofer' ? 'bg-[#C9A96E] text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Transdutor LF
          </button>
          {product.category !== 'subwoofers' && (
            <button
              onClick={() => applyPreset('horn')}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-sm transition-all ${
                activePreset === 'horn' ? 'bg-[#C9A96E] text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Corneta 90°×60°
            </button>
          )}
        </div>

        {/* Feature Toggles (Auto Rotate & Wireframe) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-[11px] font-mono uppercase tracking-wider transition-all backdrop-blur-md ${
              autoRotate
                ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-[#C9A96E]'
                : 'bg-black/80 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>360° Órbita</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-[11px] font-mono uppercase tracking-wider transition-all backdrop-blur-md ${
              wireframe
                ? 'bg-[#C9A96E]/20 border-[#C9A96E] text-[#C9A96E]'
                : 'bg-black/80 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>
        </div>
      </div>

      {/* Drag instruction notice */}
      <div className="absolute top-16 left-4 pointer-events-none text-[10px] font-mono text-neutral-400 uppercase tracking-widest bg-black/40 px-2 py-1 rounded border border-white/5">
        Arraste com o mouse para orbitar em 360°
      </div>
    </div>
  );
};
