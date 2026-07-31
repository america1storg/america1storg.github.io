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
      scene.background = new THREE.Color(0x020208);

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
      const ambient = new THREE.AmbientLight(0x0a0a1a, 0.4);
      scene.add(ambient);

      const keyLight = new THREE.DirectionalLight(0xffeedd, 2.8);
      keyLight.position.set(6, 12, 8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x2563eb, 1.2);
      fillLight.position.set(-6, 2, 6);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xdc2626, 0.8);
      rimLight.position.set(0, -4, -10);
      scene.add(rimLight);

      const hemi = new THREE.HemisphereLight(0x1e40af, 0x000000, 0.6);  // Very dark ground, lower intensity
      scene.add(hemi);

      // ─── NO GROUND PLANE (removes lighter bottom section) ─────────────────────────────────
      // Ground removed to maintain uniform dark background

      // ─── THE AMERICAN FLAG (BIGGER) ──────────────────────────────
      const flagWidth = 8.0;  // BIGGER
      const flagHeight = 4.6;  // BIGGER
      const flagSegW = 60;
      const flagSegH = 35;
      const flagGeom = new THREE.PlaneGeometry(flagWidth, flagHeight, flagSegW, flagSegH);
      const flagMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          roughness: 0.4,
          metalness: 0.0,
          clearcoat: 0.1,
          transparent: false,
          emissive: 0x0a0a1a,
          emissiveIntensity: 0.02,
      });
      const flag = new THREE.Mesh(flagGeom, flagMat);
      flag.position.set(0, 2.5, -3.0);
      flag.rotation.x = -0.1;
      flag.rotation.y = 0.12;
      flag.castShadow = true;
      flag.receiveShadow = true;
      scene.add(flag);

      const posAttr = flagGeom.attributes.position;
      const origPos = new Float32Array(posAttr.array);
      const flagVerts = posAttr.count;

      function createFlagTexture() {
          const canvas = document.createElement('canvas');
          canvas.width = 1000;
          canvas.height = 580;
          const ctx = canvas.getContext('2d');

          // RICHER, DARKER COLORS
          const stripeH = canvas.height / 13;
          for (let i = 0; i < 13; i++) {
              ctx.fillStyle = i % 2 === 0 ? '#b91c1c' : '#ffffff';  // Darker red
              ctx.fillRect(0, i * stripeH, canvas.width, stripeH + 0.5);
          }
          const cantonW = canvas.width * 0.4;
          const cantonH = canvas.height * (7 / 13);
          ctx.fillStyle = '#1e3a8a';  // Darker blue
          ctx.fillRect(0, 0, cantonW, cantonH);

          // 50 stars
          const cols = 6;
          const rows = 5;
          const starSpacingX = cantonW / (cols + 1.5);
          const starSpacingY = cantonH / (rows + 1.5);
          ctx.fillStyle = '#ffffff';

          // Row pattern: 6-5-6-5-6-5-6-5-6
          let starRow = 0;
          for (let r = 0; r < 9; r++) {
              const starsInRow = r % 2 === 0 ? 6 : 5;
              const offsetX = r % 2 === 0 ? 0 : starSpacingX * 0.5;
              for (let c = 0; c < starsInRow; c++) {
                  const x = starSpacingX * 0.8 + c * starSpacingX + offsetX;
                  const y = starSpacingY * 0.8 + r * (starSpacingY * 0.55);

                  // Draw 5-pointed star
                  ctx.save();
                  ctx.translate(x, y);
                  ctx.beginPath();
                  for (let i = 0; i < 5; i++) {
                      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                      const radius = 4.5;
                      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
                  }
                  ctx.closePath();
                  ctx.fill();
                  ctx.restore();
              }
          }
          return new THREE.CanvasTexture(canvas);
      }
      const flagTexture = createFlagTexture();
      flag.material.map = flagTexture;
      flag.material.needsUpdate = true;

      // ─── ATMOSPHERIC PARTICLES (SUBTLE) ──────────────────────────────
      const particleCount = 800;
      const partGeom = new THREE.BufferGeometry();
      const partPos = new Float32Array(particleCount * 3);
      const partColors = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
          const r = 4 + Math.random() * 14;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          partPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          partPos[i * 3 + 1] = r * Math.cos(phi) * 0.7 + 1.0;
          partPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2;

          // Darker patriotic colors
          const c = Math.random();
          if (c < 0.35) {
              partColors[i * 3] = 0.7;     // Darker red
              partColors[i * 3 + 1] = 0.1;
              partColors[i * 3 + 2] = 0.1;
          } else if (c < 0.7) {
              partColors[i * 3] = 0.1;
              partColors[i * 3 + 1] = 0.3;  // Darker blue
              partColors[i * 3 + 2] = 0.7;
          } else {
              partColors[i * 3] = 0.6;     // Dimmer white
              partColors[i * 3 + 1] = 0.6;
              partColors[i * 3 + 2] = 0.6;
          }
      }
      partGeom.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
      partGeom.setAttribute('color', new THREE.BufferAttribute(partColors, 3));
      const partMat = new THREE.PointsMaterial({
          size: 0.05,
          transparent: true,
          opacity: 0.4,
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

          const camX = scrollProgress * 1.4;
          const camY = 2.8 + scrollProgress * 2.0;
          const camZ = 12 - scrollProgress * 8.0;
          camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
          camera.lookAt(0, 1.0 + scrollProgress * 1.0, -1.0);

          // FLAG WAVE (MORE DRAMATIC)
          const positions = flagGeom.attributes.position.array;
          const time = elapsed * 1.0;
          for (let i = 0; i < flagVerts; i++) {
              const i3 = i * 3;
              const ox = origPos[i3];
              const oy = origPos[i3 + 1];
              const oz = origPos[i3 + 2];

              const wx = Math.sin(ox * 2.0 + time * 0.9) * 0.15;
              const wy = Math.sin(ox * 1.5 + oy * 1.3 + time * 0.7) * 0.10;
              const wz = Math.sin(ox * 1.3 + oy * 2.0 + time * 0.8) * 0.22;

              const scrollWave = 1 + scrollProgress * 1.0;
              positions[i3] = ox + wx * scrollWave;
              positions[i3 + 1] = oy + wy * scrollWave;
              positions[i3 + 2] = oz + wz * scrollWave;
          }
          flagGeom.attributes.position.needsUpdate = true;
          flagGeom.computeVertexNormals();

          flag.position.y = 2.5 + scrollProgress * 0.8;
          flag.rotation.z = Math.sin(elapsed * 0.12) * 0.03;
          flag.rotation.y = 0.12 + scrollProgress * 0.3;

          // PARTICLES
          particles.rotation.y += dt * 0.008;
          particles.rotation.x = Math.sin(elapsed * 0.004) * 0.03;

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
          background: #020208;
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
          background: 'rgba(2, 2, 8, 0.85)',
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
