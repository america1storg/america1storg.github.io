'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SocialLinks } from '@/components/SocialLinks';

// Removed force-dynamic - homepage is now static with client-side theme only

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

      const container = document.getElementById('three-container');
      const scene = new THREE.Scene();
      const isDarkMode = document.body.classList.contains('dark');
      scene.background = new THREE.Color(isDarkMode ? 0x00164D : 0xf8f9fa);

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

      const hemi = new THREE.HemisphereLight(
        isDarkMode ? 0x1e40af : 0xffffff,
        isDarkMode ? 0x000000 : 0x999999,
        isDarkMode ? 0.6 : 1.2
      );
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
          size: 0.015,
          transparent: true,
          opacity: 0.3,
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
  }, [theme]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        body {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          transition: background 0.3s ease, color 0.3s ease;
        }

        body.dark {
          background: #00164D;
          color: #fff;
        }

        body.light {
          background: #f8f9fa;
          color: #000;
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
          animation: pulseFloat 2.4s ease-in-out infinite;
        }

        body.dark .scroll-hint {
          color: rgba(255, 255, 255, 0.45);
        }

        body.light .scroll-hint {
          color: rgba(0, 0, 0, 0.5);
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
        <Navigation />

        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto relative pt-32">
          <p
            className="text-xs tracking-[0.4em] uppercase font-medium mb-4"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
          >
            Nonpartisan · Civic Education
          </p>
          <h1
            className="text-6xl md:text-9xl font-extrabold leading-[1.0] tracking-tight mb-6"
            style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)' }}
          >
            <span style={{ color: isDark ? '#fff' : '#000' }}>America</span><br />
            <span style={{ color: '#3b82f6' }}>First</span>
          </h1>
          <p
            className="text-lg md:text-2xl max-w-[650px] mt-4 leading-relaxed"
            style={{
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              textShadow: isDark ? '0 0 40px rgba(0, 0, 0, 0.9)' : '0 0 40px rgba(255, 255, 255, 0.9)',
            }}
          >
            A <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">nonpartisan</strong> civic education organization committed to
            restoring <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">logical reasoning</strong>, <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">fairness</strong>,
            and <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">principled decision-making</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
            <Link
              href="/articles"
              className="px-6 py-3 sm:px-7 sm:py-3.5 bg-blue-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg text-center"
            >
              Read Articles
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 sm:px-7 sm:py-3.5 backdrop-blur-sm rounded-lg font-semibold text-base sm:text-lg hover:scale-105 transition-all text-center"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                color: isDark ? '#fff' : '#000',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
              }}
            >
              Learn More
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="mt-8 mb-20">
            <p
              className="text-xs tracking-[0.3em] uppercase font-medium mb-4"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}
            >
              Follow Us
            </p>
            <SocialLinks size="lg" />
          </div>

          <div className="scroll-hint">Scroll to explore</div>
        </section>

        {/* Mission */}
        <section className="min-h-[110vh] flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase font-medium mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>Our Mission</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight" style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)', color: isDark ? '#fff' : '#000' }}>
            Educate Americans on the<br />
            <span style={{ color: '#3b82f6' }}>principles</span> that make<br />
            this country <span style={{ color: '#ef4444' }}>great</span>.
          </h2>
          <p className="text-lg md:text-2xl max-w-[650px] mt-6 leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)', textShadow: isDark ? '0 0 40px rgba(0, 0, 0, 0.9)' : '0 0 40px rgba(255, 255, 255, 0.9)' }}>
            We uphold the <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">law</strong>, protect national interests, and
            promote <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">fact-based discourse</strong>. We support
            <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold"> truth</strong>, <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">data</strong>, and the
            <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold"> Constitution</strong> — not any party.
          </p>
        </section>

        {/* Stand */}
        <section className="min-h-[110vh] flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase font-medium mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>Our Stance</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight" style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)', color: isDark ? '#fff' : '#000' }}>
            America — its people,<br />
            its <span style={{ color: '#3b82f6' }}>future</span> —<br />
            <span style={{ color: '#ef4444' }}>above all</span> foreign interests.
          </h2>
          <p className="text-lg md:text-2xl max-w-[650px] mt-6 leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)', textShadow: isDark ? '0 0 40px rgba(0, 0, 0, 0.9)' : '0 0 40px rgba(255, 255, 255, 0.9)' }}>
            We support <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">global cooperation</strong>, but never at the cost
            of compromising America's strength or values. Every nation puts its
            own interests first — <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">America should be no different</strong>.
          </p>
        </section>

        {/* Principles */}
        <section className="min-h-[110vh] flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase font-medium mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>Our Principles</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight mb-12" style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)' }}>
            <span style={{ color: '#3b82f6' }}>Logic</span> · <span style={{ color: isDark ? '#fff' : '#000' }}>Fairness</span> · <span style={{ color: '#ef4444' }}>Loyalty</span>
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
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(0, 10, 35, 0.85) 0%, rgba(0, 15, 50, 0.9) 100%)'
                    : 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(20px)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: isDark
                    ? '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="min-h-[120vh] flex flex-col justify-center px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase font-medium mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>Join the Mission</p>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight" style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)', color: isDark ? '#fff' : '#000' }}>
            Loyalty to <span style={{ color: '#3b82f6' }}>America</span><br />
            must come <span style={{ color: '#ef4444' }}>first</span>.
          </h2>
          <p className="text-lg md:text-2xl max-w-[540px] mt-6 leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)', textShadow: isDark ? '0 0 40px rgba(0, 0, 0, 0.9)' : '0 0 40px rgba(255, 255, 255, 0.9)' }}>
            For those who serve, lead, or aspire to represent this nation —
            <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold"> loyalty must be to America first</strong>.
          </p>
          <p className="text-base mt-8" style={{ color: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)' }}>
            Nonpartisan · Civic Education · In Formation
          </p>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
