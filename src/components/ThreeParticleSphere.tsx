import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeParticleSphereProps {
  isWarping?: boolean;
  onSphereClick?: () => void;
}

export const ThreeParticleSphere: React.FC<ThreeParticleSphereProps> = ({
  isWarping = false,
  onSphereClick
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isWarpingRef = useRef(isWarping);
  isWarpingRef.current = isWarping;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const getDimensions = () => {
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      return { width: w, height: h };
    };

    const { width, height } = getDimensions();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // --- Generate Circular Soft Glow Particle Texture ---
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.18, 'rgba(120, 230, 255, 0.95)');
        grad.addColorStop(0.45, 'rgba(20, 140, 255, 0.6)');
        grad.addColorStop(0.75, 'rgba(10, 60, 240, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();

    // --- Construct Particles Matching the Reference Image ---
    // Total ~34,000 particles across 3 layers:
    // 1. Base Spherical Shell (uniform starry points on the sphere)
    // 2. Swirling Curled Ribbon Vortexes (dense glowing cyan & white wave filaments)
    // 3. Corona Outer Sparks (loose floating dust around perimeter)
    const SHELL_COUNT = 18000;
    const RIBBON_COUNT = 13000;
    const SPARK_COUNT = 3000;
    const TOTAL_COUNT = SHELL_COUNT + RIBBON_COUNT + SPARK_COUNT;
    const R = 2.15;

    const positions = new Float32Array(TOTAL_COUNT * 3);
    const colors = new Float32Array(TOTAL_COUNT * 3);
    const sphericalData = new Float32Array(TOTAL_COUNT * 4); // [r, theta, phi, layerType]

    const colDeepBlue = new THREE.Color(0x0a4bf0);
    const colBrightBlue = new THREE.Color(0x1e88e5);
    const colCyan = new THREE.Color(0x00f5ff);
    const colWhite = new THREE.Color(0xffffff);
    const colPinkTip = new THREE.Color(0xf472b6);

    let idx = 0;

    // --- Layer 1: Base Spherical Shell ---
    for (let i = 0; i < SHELL_COUNT; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / SHELL_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = R + (Math.random() - 0.5) * 0.08;

      sphericalData[idx * 4] = r;
      sphericalData[idx * 4 + 1] = theta;
      sphericalData[idx * 4 + 2] = phi;
      sphericalData[idx * 4 + 3] = 0; // Shell

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      const pColor = new THREE.Color();
      const rand = Math.random();
      if (rand < 0.65) {
        pColor.lerpColors(colDeepBlue, colBrightBlue, Math.random());
      } else {
        pColor.lerpColors(colBrightBlue, colCyan, Math.random() * 0.8);
      }

      colors[idx * 3] = pColor.r;
      colors[idx * 3 + 1] = pColor.g;
      colors[idx * 3 + 2] = pColor.b;
      idx++;
    }

    // --- Layer 2: Swirling Curled Ribbon Filaments ---
    for (let i = 0; i < RIBBON_COUNT; i++) {
      const isTopRibbon = i < RIBBON_COUNT * 0.55;
      const t = Math.random();
      const theta = t * Math.PI * 4; // Multiple spiral turns

      let phi: number;
      let rOffset: number;
      const pColor = new THREE.Color();

      if (isTopRibbon) {
        // Upper swirling curled wave (like in reference image)
        phi = Math.PI * 0.35 + Math.sin(theta * 1.5) * 0.22 + (Math.random() - 0.5) * 0.16;
        rOffset = Math.sin(theta * 2.2) * 0.09 + (Math.random() - 0.5) * 0.06;

        // Intense cyan to white crest
        if (Math.sin(theta * 2) > 0.3) {
          pColor.lerpColors(colCyan, colWhite, Math.random() * 0.9);
        } else {
          pColor.lerpColors(colBrightBlue, colCyan, Math.random());
        }
      } else {
        // Lower sweeping curled vortex with slight pink tip
        phi = Math.PI * 0.72 + Math.cos(theta * 1.3) * 0.20 + (Math.random() - 0.5) * 0.16;
        rOffset = Math.cos(theta * 1.8) * 0.08 + (Math.random() - 0.5) * 0.06;

        if (Math.cos(theta * 1.5) > 0.5) {
          pColor.lerpColors(colCyan, colPinkTip, Math.random() * 0.75);
        } else {
          pColor.lerpColors(colDeepBlue, colCyan, Math.random());
        }
      }

      const r = R + rOffset;

      sphericalData[idx * 4] = r;
      sphericalData[idx * 4 + 1] = theta;
      sphericalData[idx * 4 + 2] = phi;
      sphericalData[idx * 4 + 3] = 1; // Ribbon

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      colors[idx * 3] = pColor.r;
      colors[idx * 3 + 1] = pColor.g;
      colors[idx * 3 + 2] = pColor.b;
      idx++;
    }

    // --- Layer 3: Outer Corona Floating Sparks ---
    for (let i = 0; i < SPARK_COUNT; i++) {
      const phi = Math.acos(1 - 2 * Math.random());
      const theta = Math.random() * Math.PI * 2;
      // Floats slightly outside the sphere radius (R + 0.05 to R + 0.65)
      const r = R + 0.06 + Math.pow(Math.random(), 2) * 0.55;

      sphericalData[idx * 4] = r;
      sphericalData[idx * 4 + 1] = theta;
      sphericalData[idx * 4 + 2] = phi;
      sphericalData[idx * 4 + 3] = 2; // Spark

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      const pColor = new THREE.Color();
      pColor.lerpColors(colBrightBlue, colCyan, Math.random() * 0.9);

      colors[idx * 3] = pColor.r;
      colors[idx * 3 + 1] = pColor.g;
      colors[idx * 3 + 2] = pColor.b;
      idx++;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.048,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- Radial Blue Glow Core Sprite ---
    const createGlowSprite = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(128, 128, 40, 128, 128, 128);
        grad.addColorStop(0, 'rgba(0, 140, 255, 0.35)');
        grad.addColorStop(0.45, 'rgba(10, 60, 240, 0.20)');
        grad.addColorStop(0.8, 'rgba(2, 6, 23, 0.05)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.8
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(5.2, 5.2, 1);
      return sprite;
    };

    const glowSprite = createGlowSprite();
    scene.add(glowSprite);

    // --- Mouse Drag Interaction & 3D Tilt ---
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotX = 0.12;
    let rotY = 0;
    let targetRotX = 0.12;
    let targetRotY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouse = { x: cx, y: cy };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const dx = cx - prevMouse.x;
        const dy = cy - prevMouse.y;
        targetRotY += dx * 0.007;
        targetRotX += dy * 0.007;
        prevMouse = { x: cx, y: cy };
      } else {
        const nx = (cx / window.innerWidth - 0.5) * 2;
        const ny = (cy / window.innerHeight - 0.5) * 2;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, nx * 0.25, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, -ny * 0.25, 0.05);
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    const onCanvasClick = () => {
      if (onSphereClick) onSphereClick();
    };
    dom.addEventListener('click', onCanvasClick);

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver(() => {
      const dims = getDimensions();
      camera.aspect = dims.width / dims.height;
      camera.updateProjectionMatrix();
      renderer.setSize(dims.width, dims.height);
    });
    resizeObserver.observe(container);

    // --- Animation Loop ---
    let animId: number;
    const clock = new THREE.Clock();
    let warpDist = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      // Handle hyperspace expansion when entering platform
      if (isWarpingRef.current) {
        warpDist += 0.09;
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 2.0, 0.06);
        material.size = THREE.MathUtils.lerp(material.size, 0.14, 0.08);
      }

      // Smooth 3D rotation
      if (!isDragging) {
        targetRotY += 0.004; // Continuous organic spin
      }
      rotY = THREE.MathUtils.lerp(rotY, targetRotY, 0.07);
      rotX = THREE.MathUtils.lerp(rotX, targetRotX, 0.07);
      particles.rotation.y = rotY;
      particles.rotation.x = rotX;

      // Dynamic surface wave undulation (creates the fluid swirling motion)
      for (let i = 0; i < TOTAL_COUNT; i++) {
        const baseR = sphericalData[i * 4];
        const theta = sphericalData[i * 4 + 1];
        const phi = sphericalData[i * 4 + 2];
        const layer = sphericalData[i * 4 + 3];

        let wave = 0;
        if (layer === 1) {
          // Swirling wave ribbons undulate along their curves
          wave = Math.sin(theta * 2.5 + time * 1.6) * 0.05 + Math.cos(phi * 3 - time * 1.2) * 0.04;
        } else if (layer === 2) {
          // Sparks gently drift
          wave = Math.sin(theta * 1.5 + time * 0.8) * 0.06;
        } else {
          // Subtle breathing on shell
          wave = Math.sin(time * 1.8 + phi * 2) * 0.015;
        }

        const curR = baseR + wave + (warpDist > 0 ? baseR * warpDist * 2.2 : 0);

        posArr[i * 3] = curR * Math.sin(phi) * Math.cos(theta);
        posArr[i * 3 + 1] = curR * Math.cos(phi);
        posArr[i * 3 + 2] = curR * Math.sin(phi) * Math.sin(theta);
      }
      posAttr.needsUpdate = true;

      // Pulse glow
      glowSprite.scale.set(
        5.2 + Math.sin(time * 2) * 0.2,
        5.2 + Math.sin(time * 2) * 0.2,
        1
      );

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);

      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      dom.removeEventListener('click', onCanvasClick);

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, [onSphereClick]);

  return (
    <div 
      ref={mountRef} 
      className="three-particle-sphere-wrapper"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        touchAction: 'none'
      }}
    />
  );
};
