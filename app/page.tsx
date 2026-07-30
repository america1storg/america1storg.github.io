'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

      const container = document.getElementById('three-container');
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x06060f);

      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
      camera.position.set(0, 3, 14);

      const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // ─── LIGHTS ───────────────────────────────────────────
      const ambient = new THREE.AmbientLight(0x1a1a2e, 0.6);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5);
      keyLight.position.set(6, 12, 8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x3b82f6, 0.9);
      fillLight.position.set(-6, 2, 6);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xef4444, 0.6);
      rimLight.position.set(0, -4, -10);
      scene.add(rimLight);

      const hemi = new THREE.HemisphereLight(0x3b82f6, 0x0a0a1a, 0.8);
      scene.add(hemi);

      // ─── GROUND ─────────────────────────────────
      const groundGeom = new THREE.PlaneGeometry(40, 40);
      const groundMat = new THREE.MeshStandardMaterial({
          color: 0x0a0a14,
          roughness: 1,
          metalness: 0,
          transparent: true,
          opacity: 0.6,
      });
      const ground = new THREE.Mesh(groundGeom, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.8;
      ground.receiveShadow = true;
      scene.add(ground);

      // ─── THE FLAG ──────────────────────────────
      const flagWidth = 5.6;
      const flagHeight = 3.2;
      const flagSegW = 48;
      const flagSegH = 28;
      const flagGeom = new THREE.PlaneGeometry(flagWidth, flagHeight, flagSegW, flagSegH);
      const flagMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          roughness: 0.3,
          metalness: 0.0,
          clearcoat: 0.05,
          transparent: true,
          opacity: 0.95,
          emissive: 0x222244,
          emissiveIntensity: 0.05,
      });
      const flag = new THREE.Mesh(flagGeom, flagMat);
      flag.position.set(0, 2.2, -2.5);
      flag.rotation.x = -0.08;
      flag.rotation.y = 0.1;
      scene.add(flag);

      const posAttr = flagGeom.attributes.position;
      const origPos = new Float32Array(posAttr.array);
      const flagVerts = posAttr.count;

      function createFlagTexture() {
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 460;
          const ctx = canvas.getContext('2d');

          const stripeH = canvas.height / 13;
          for (let i = 0; i < 13; i++) {
              ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#ffffff';
              ctx.fillRect(0, i * stripeH, canvas.width, stripeH + 0.5);
          }
          const cantonW = canvas.width * 0.42;
          const cantonH = canvas.height * (7 / 13);
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(0, 0, cantonW, cantonH);

          const cols = 10;
          const rows = 5;
          const starSpacingX = cantonW / (cols + 1);
          const starSpacingY = cantonH / (rows + 1);
          ctx.fillStyle = '#ffffff';
          for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                  const offsetX = r % 2 === 0 ? 0 : starSpacingX / 2;
                  const x = starSpacingX + c * starSpacingX + offsetX;
                  const y = starSpacingY + r * starSpacingY;
                  ctx.beginPath();
                  ctx.arc(x, y, 3.2, 0, Math.PI * 2);
                  ctx.fill();
              }
          }
          return new THREE.CanvasTexture(canvas);
      }
      const flagTexture = createFlagTexture();
      flag.material.map = flagTexture;
      flag.material.needsUpdate = true;

      // ─── CONSTITUTION BOOK ──────────────────────────────
      const bookGroup = new THREE.Group();
      bookGroup.position.set(-2.8, 0.6, 0.5);
      scene.add(bookGroup);

      const pageGeom = new THREE.BoxGeometry(1.2, 0.06, 0.9);
      const pageMat = new THREE.MeshPhysicalMaterial({
          color: 0xf5f0e8,
          roughness: 0.7,
          metalness: 0.0,
          emissive: 0x332211,
          emissiveIntensity: 0.02,
      });
      for (let i = 0; i < 6; i++) {
          const page = new THREE.Mesh(pageGeom, pageMat);
          page.position.y = i * 0.04;
          page.scale.x = 1 - i * 0.02;
          page.scale.z = 1 - i * 0.02;
          bookGroup.add(page);
      }
      const coverMat = new THREE.MeshPhysicalMaterial({
          color: 0x1e3a5f,
          roughness: 0.5,
          metalness: 0.1,
          emissive: 0x0a1a2f,
          emissiveIntensity: 0.1,
      });
      const coverGeom = new THREE.BoxGeometry(1.35, 0.08, 1.05);
      const cover = new THREE.Mesh(coverGeom, coverMat);
      cover.position.y = -0.08;
      bookGroup.add(cover);
      const spineMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, emissive: 0xd4af37, emissiveIntensity: 0.1 });
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.7), spineMat);
      spine.position.set(0.68, 0.1, 0);
      bookGroup.add(spine);

      // ─── PILLARS ──────────────────────────────
      const pillarMat = new THREE.MeshPhysicalMaterial({
          color: 0x8899bb,
          roughness: 0.2,
          metalness: 0.6,
          clearcoat: 0.2,
          emissive: 0x224466,
          emissiveIntensity: 0.05,
      });
      const pillarPositions = [[-1.2, -0.6, 2.8], [1.2, -0.6, 2.8], [0, -0.6, 3.6]];
      const pillars = [];
      for (const pos of pillarPositions) {
          const pillarGeom = new THREE.CylinderGeometry(0.25, 0.3, 1.2, 12);
          const pillar = new THREE.Mesh(pillarGeom, pillarMat);
          pillar.position.set(pos[0], pos[1] + 0.6, pos[2]);
          pillar.castShadow = true;
          pillar.receiveShadow = true;
          scene.add(pillar);
          pillars.push(pillar);

          const capGeom = new THREE.CylinderGeometry(0.35, 0.25, 0.1, 12);
          const cap = new THREE.Mesh(capGeom, pillarMat);
          cap.position.set(pos[0], pos[1] + 1.2 + 0.05, pos[2]);
          scene.add(cap);
          pillars.push(cap);
      }

      // ─── 3D STARS ──────────────────────────────
      const starGroup = new THREE.Group();
      scene.add(starGroup);

      function createStar3D() {
          const shape = new THREE.Shape();
          const outerR = 0.12;
          const innerR = 0.05;
          const points = 5;
          for (let i = 0; i < points * 2; i++) {
              const r = i % 2 === 0 ? outerR : innerR;
              const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
              if (i === 0) shape.moveTo(r * Math.cos(angle), r * Math.sin(angle));
              else shape.lineTo(r * Math.cos(angle), r * Math.sin(angle));
          }
          shape.closePath();
          const extrudeSettings = { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.005 };
          const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const mat = new THREE.MeshPhysicalMaterial({
              color: 0xffdd44,
              emissive: 0xffaa22,
              emissiveIntensity: 0.4,
              metalness: 0.2,
              roughness: 0.3,
          });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.castShadow = true;
          return mesh;
      }

      const starData = [];
      for (let i = 0; i < 85; i++) {
          const star = createStar3D();
          const radius = 1.6 + Math.random() * 5.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          star.position.set(
              radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.cos(phi) * 0.8 + 1.2,
              radius * Math.sin(phi) * Math.sin(theta) - 1
          );
          star.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          const scale = 0.4 + Math.random() * 1.0;
          star.scale.setScalar(scale);
          starGroup.add(star);
          starData.push({
              mesh: star,
              basePos: star.position.clone(),
              baseRot: star.rotation.clone(),
              speed: 0.2 + Math.random() * 0.4,
              phase: Math.random() * Math.PI * 2,
              radius: radius,
              scale: scale,
          });
      }

      // ─── PARTICLES ──────────────────────────────
      const particleCount = 1200;
      const partGeom = new THREE.BufferGeometry();
      const partPos = new Float32Array(particleCount * 3);
      const partColors = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
          const r = 3 + Math.random() * 12;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          partPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          partPos[i * 3 + 1] = r * Math.cos(phi) * 0.8 + 0.5;
          partPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 1;
          const c = Math.random();
          if (c < 0.33) { partColors[i * 3] = 0.9; partColors[i * 3 + 1] = 0.2; partColors[i * 3 + 2] = 0.2; }
          else if (c < 0.66) { partColors[i * 3] = 0.2; partColors[i * 3 + 1] = 0.5; partColors[i * 3 + 2] = 0.9; }
          else { partColors[i * 3] = 0.9; partColors[i * 3 + 1] = 0.9; partColors[i * 3 + 2] = 0.9; }
      }
      partGeom.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
      partGeom.setAttribute('color', new THREE.BufferAttribute(partColors, 3));
      const partMat = new THREE.PointsMaterial({
          size: 0.06,
          transparent: true,
          opacity: 0.5,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
          depthWrite: false,
      });
      const particles = new THREE.Points(partGeom, partMat);
      scene.add(particles);

      // ─── SCROLL TRACKING ─────────────────────────────────
      let scrollProgress = 0;
      let targetProgress = 0;

      window.addEventListener('scroll', () => {
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          targetProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      }, { passive: true });

      // ─── ANIMATION ───────────────────────────────────────
      const clock = new THREE.Clock();

      function animate() {
          const dt = clock.getDelta();
          const elapsed = clock.getElapsedTime();

          scrollProgress += (targetProgress - scrollProgress) * 0.06;

          const camX = scrollProgress * 1.2;
          const camY = 2.6 + scrollProgress * 1.8;
          const camZ = 12 - scrollProgress * 7.0;
          camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
          camera.lookAt(0, 0.6 + scrollProgress * 0.8, -0.5);

          // FLAG WAVE
          const positions = flagGeom.attributes.position.array;
          const time = elapsed * 0.9;
          for (let i = 0; i < flagVerts; i++) {
              const i3 = i * 3;
              const ox = origPos[i3];
              const oy = origPos[i3 + 1];
              const oz = origPos[i3 + 2];

              const wx = Math.sin(ox * 2.2 + time * 0.8) * 0.12;
              const wy = Math.sin(ox * 1.6 + oy * 1.2 + time * 0.6) * 0.08;
              const wz = Math.sin(ox * 1.4 + oy * 1.8 + time * 0.7) * 0.18;

              const scrollWave = 1 + scrollProgress * 0.8;
              positions[i3] = ox + wx * scrollWave;
              positions[i3 + 1] = oy + wy * scrollWave;
              positions[i3 + 2] = oz + wz * scrollWave;
          }
          flagGeom.attributes.position.needsUpdate = true;
          flagGeom.computeVertexNormals();

          flag.position.y = 2.2 + scrollProgress * 0.6;
          flag.rotation.z = Math.sin(elapsed * 0.1) * 0.02;
          flag.rotation.y = 0.1 + scrollProgress * 0.25;

          bookGroup.position.x = -2.8 + scrollProgress * 1.6;
          bookGroup.position.y = 0.6 + scrollProgress * 0.4;
          bookGroup.rotation.y = scrollProgress * 0.4;
          bookGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.03;

          for (let i = 0; i < pillars.length; i++) {
              const p = pillars[i];
              const baseY = 0.6;
              p.position.y = baseY + scrollProgress * 0.3 + Math.sin(elapsed * 0.2 + i) * 0.02;
          }

          starGroup.rotation.y += dt * 0.03;
          starGroup.rotation.x = Math.sin(elapsed * 0.01) * 0.02 + scrollProgress * 0.06;
          for (const d of starData) {
              const wave = Math.sin(elapsed * d.speed + d.phase) * 0.08;
              d.mesh.position.x = d.basePos.x + wave * 0.5;
              d.mesh.position.y = d.basePos.y + wave * 0.3 + scrollProgress * 0.2;
              d.mesh.rotation.x = d.baseRot.x + elapsed * 0.2;
              d.mesh.rotation.y = d.baseRot.y + elapsed * 0.3;
              d.mesh.rotation.z = d.baseRot.z + elapsed * 0.1;
              const twinkle = 0.6 + 0.4 * Math.sin(elapsed * 1.2 + d.phase);
              d.mesh.material.emissiveIntensity = 0.2 + 0.6 * twinkle;
          }

          particles.rotation.y += dt * 0.005;
          particles.rotation.x = Math.sin(elapsed * 0.003) * 0.02;

          renderer.render(scene, camera);
          requestAnimationFrame(animate);
      }

      animate();

      window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
      });
    `;
    document.body.appendChild(script);

    return () => {
      const canvas = document.querySelector('#three-container canvas');
      if (canvas) canvas.remove();
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        body {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          background: #06060f;
          color: #fff;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }

        #three-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
        }

        .scroll-wrap {
          position: relative;
          z-index: 1;
          pointer-events: none;
          width: 100%;
        }

        .scroll-wrap > * {
          pointer-events: auto;
        }

        .scroll-hint {
          position: absolute;
          bottom: 2.5rem;
          left: 6vw;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.15);
          animation: pulseFloat 2.4s ease-in-out infinite;
        }

        @keyframes pulseFloat {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(12px);
            opacity: 0.8;
          }
        }
      `}</style>

      {/* Three.js canvas */}
      <div id="three-container" />

      {/* Scrollable content */}
      <div className="scroll-wrap">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-auto" style={{
          background: 'rgba(6, 6, 15, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo-icon.png" alt="America First" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold">America First</span>
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/articles" className="hover:text-blue-400 transition-colors">Articles</Link>
                <Link href="/about" className="hover:text-blue-400 transition-colors">About</Link>
                <Link href="/admin" className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all text-sm font-semibold border border-white/10">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto relative">
          <p className="text-xs tracking-[0.4em] uppercase text-white/25 font-medium mb-4">Nonpartisan · Civic Education</p>
          <h1 className="text-6xl md:text-9xl font-extrabold leading-[1.0] tracking-tight mb-6" style={{ textShadow: '0 0 80px rgba(0, 0, 0, 0.8)' }}>
            <span className="text-white">America</span><br />
            <span style={{ color: '#3b82f6' }}>First</span>
          </h1>
          <p className="text-lg md:text-2xl max-w-[650px] mt-6 leading-relaxed text-white/70" style={{ textShadow: '0 0 40px rgba(0, 0, 0, 0.9)' }}>
            A <strong className="text-white font-semibold">nonpartisan</strong> civic education organization committed to
            restoring <strong className="text-white font-semibold">logical reasoning</strong>, <strong className="text-white font-semibold">fairness</strong>,
            and <strong className="text-white font-semibold">principled decision-making</strong>.
          </p>
          <div className="flex gap-4 mt-12">
            <Link href="/articles" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg">
              Read Articles
            </Link>
            <Link href="/about" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-all border border-white/20">
              Learn More
            </Link>
          </div>
          <div className="scroll-hint">Scroll to explore</div>
        </section>

        {/* Mission */}
        <section className="min-h-[110vh] flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/25 font-medium mb-4">Our Mission</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight" style={{ textShadow: '0 0 80px rgba(0, 0, 0, 0.8)' }}>
            Educate Americans on the<br />
            <span style={{ color: '#3b82f6' }}>principles</span> that make<br />
            this country <span style={{ color: '#ef4444' }}>great</span>.
          </h2>
          <p className="text-lg md:text-2xl max-w-[650px] mt-6 leading-relaxed text-white/70" style={{ textShadow: '0 0 40px rgba(0, 0, 0, 0.9)' }}>
            We uphold the <strong className="text-white font-semibold">law</strong>, protect national interests, and
            promote <strong className="text-white font-semibold">fact-based discourse</strong>. We support
            <strong className="text-white font-semibold"> truth</strong>, <strong className="text-white font-semibold">data</strong>, and the
            <strong className="text-white font-semibold"> Constitution</strong> — not any party.
          </p>
        </section>

        {/* Stand */}
        <section className="min-h-[110vh] flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/25 font-medium mb-4">Our Stance</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight" style={{ textShadow: '0 0 80px rgba(0, 0, 0, 0.8)' }}>
            America — its people,<br />
            its <span style={{ color: '#3b82f6' }}>future</span> —<br />
            <span style={{ color: '#ef4444' }}>above all</span> foreign interests.
          </h2>
          <p className="text-lg md:text-2xl max-w-[650px] mt-6 leading-relaxed text-white/70" style={{ textShadow: '0 0 40px rgba(0, 0, 0, 0.9)' }}>
            We support <strong className="text-white font-semibold">global cooperation</strong>, but never at the cost
            of compromising America's strength or values. Every nation puts its
            own interests first — <strong className="text-white font-semibold">America should be no different</strong>.
          </p>
        </section>

        {/* Principles */}
        <section className="min-h-[110vh] flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/25 font-medium mb-4">Our Principles</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight mb-12" style={{ textShadow: '0 0 80px rgba(0, 0, 0, 0.8)' }}>
            <span style={{ color: '#3b82f6' }}>Logic</span> · <span className="text-white">Fairness</span> · <span style={{ color: '#ef4444' }}>Loyalty</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 max-w-[960px]">
            {[
              { icon: '⚖️', title: 'Rule of Law', desc: 'No one is above the law. The Constitution is our compass.' },
              { icon: '🧠', title: 'Logical Reasoning', desc: 'Decisions rooted in data, analysis, and clear thinking.' },
              { icon: '🤝', title: 'Unity & Diversity', desc: 'We welcome all who embrace American values.' },
              { icon: '🇺🇸', title: 'America First', desc: 'Our nation\'s prosperity and security come first.' }
            ].map((item) => (
              <div
                key={item.title}
                className="p-7 rounded-3xl transition-all hover:-translate-y-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="min-h-[120vh] flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/25 font-medium mb-4">Join the Mission</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight" style={{ textShadow: '0 0 80px rgba(0, 0, 0, 0.8)' }}>
            Loyalty to <span style={{ color: '#3b82f6' }}>America</span><br />
            must come <span style={{ color: '#ef4444' }}>first</span>.
          </h2>
          <p className="text-lg md:text-2xl max-w-[540px] mt-6 leading-relaxed text-white/70" style={{ textShadow: '0 0 40px rgba(0, 0, 0, 0.9)' }}>
            For those who serve, lead, or aspire to represent this nation —
            <strong className="text-white font-semibold"> loyalty must be to America first</strong>.
          </p>
          <p className="text-base text-white/20 mt-8">
            Nonpartisan · Civic Education · In Formation
          </p>
        </section>

        {/* Footer */}
        <footer className="px-[6vw] py-12 max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-6 text-white/20 text-sm border-t border-white/4">
          <span>© 2025 <strong className="text-white/50">America First</strong></span>
          <span>Truth · Data · Constitution</span>
        </footer>
      </div>
    </>
  );
}
