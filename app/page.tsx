'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Three.js will be loaded via CDN in the component
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

      // ─── SETUP ────────────────────────────────────────────
      const container = document.getElementById('three-container');
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 2, 14);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // ─── LIGHTS ───────────────────────────────────────────
      const ambient = new THREE.AmbientLight(0x222244, 0.6);
      scene.add(ambient);

      const mainLight = new THREE.DirectionalLight(0xffeedd, 2.2);
      mainLight.position.set(5, 10, 7);
      scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0x4488ff, 0.8);
      fillLight.position.set(-5, 0, 5);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xef4444, 0.5);
      rimLight.position.set(0, -3, -8);
      scene.add(rimLight);

      const hemi = new THREE.HemisphereLight(0x3b82f6, 0x1e1e3a, 0.7);
      scene.add(hemi);

      // ─── FLOATING PARTICLES (STARS) ──────────────────────
      const starCount = 1200;
      const starGeom = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
          const r = 18 + Math.random() * 20;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          starPos[i * 3 + 1] = r * Math.cos(phi) * 0.8;
          starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
          starSizes[i] = 0.03 + Math.random() * 0.12;
      }
      starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      starGeom.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

      const starMat = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.08,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
      });
      const stars = new THREE.Points(starGeom, starMat);
      scene.add(stars);

      // ─── MAIN 3D ELEMENT: ABSTRACT FLAG WAVE ─────────────
      const waveGroup = new THREE.Group();
      scene.add(waveGroup);

      const stripeCount = 18;
      const stripes = [];
      const colors = [0xef4444, 0xffffff, 0x3b82f6];

      for (let i = 0; i < stripeCount; i++) {
          const width = 0.6 + Math.random() * 0.3;
          const depth = 0.08 + Math.random() * 0.06;
          const length = 2.4 + Math.random() * 1.2;
          const geom = new THREE.BoxGeometry(width, depth, length);
          const col = colors[i % colors.length];
          const mat = new THREE.MeshPhysicalMaterial({
              color: col,
              metalness: 0.1,
              roughness: 0.3,
              clearcoat: 0.15,
              emissive: col,
              emissiveIntensity: 0.08,
              transparent: true,
              opacity: 0.7 + Math.random() * 0.3,
          });
          const mesh = new THREE.Mesh(geom, mat);
          const angle = (i / stripeCount) * Math.PI * 2 + Math.random() * 0.3;
          const radius = 2.6 + Math.random() * 0.8;
          mesh.position.set(
              Math.cos(angle) * radius * 0.7,
              (Math.random() - 0.5) * 2.2,
              Math.sin(angle) * radius * 0.6
          );
          mesh.rotation.y = -angle + Math.PI / 2;
          mesh.rotation.x = (Math.random() - 0.5) * 0.5;
          mesh.rotation.z = (Math.random() - 0.5) * 0.5;
          mesh.userData = {
              angle: angle,
              radius: radius,
              speed: 0.15 + Math.random() * 0.25,
              phaseX: Math.random() * Math.PI * 2,
              phaseY: Math.random() * Math.PI * 2,
              phaseZ: Math.random() * Math.PI * 2,
              amp: 0.08 + Math.random() * 0.15,
              basePos: mesh.position.clone(),
              baseRot: mesh.rotation.clone(),
          };
          waveGroup.add(mesh);
          stripes.push(mesh);
      }

      // ─── CENTER GLOW ─────────────────────
      const coreGeom = new THREE.SphereGeometry(0.6, 32, 32);
      const coreMat = new THREE.MeshPhysicalMaterial({
          color: 0x3b82f6,
          emissive: 0x3b82f6,
          emissiveIntensity: 0.6,
          metalness: 0.0,
          roughness: 0.1,
          transparent: true,
          opacity: 0.8,
      });
      const core = new THREE.Mesh(coreGeom, coreMat);
      waveGroup.add(core);

      const ringGeom = new THREE.RingGeometry(0.9, 1.6, 64);
      const ringMat = new THREE.MeshPhysicalMaterial({
          color: 0xef4444,
          emissive: 0xef4444,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      waveGroup.add(ring);

      const ring2Geom = new THREE.RingGeometry(1.8, 2.6, 64);
      const ring2Mat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 0.15,
          transparent: true,
          opacity: 0.12,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
      });
      const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
      ring2.rotation.x = Math.PI / 2;
      waveGroup.add(ring2);

      // ─── SPARKLES ───────────────────────────────────
      const sparkleCount = 300;
      const sparkGeom = new THREE.BufferGeometry();
      const sparkPos = new Float32Array(sparkleCount * 3);
      for (let i = 0; i < sparkleCount; i++) {
          const r = 1.5 + Math.random() * 6;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          sparkPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          sparkPos[i * 3 + 1] = r * Math.cos(phi) * 0.9;
          sparkPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
      const sparkMat = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.04,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
      });
      const sparkles = new THREE.Points(sparkGeom, sparkMat);
      waveGroup.add(sparkles);

      // ─── SCROLL TRACKING ─────────────────────────────────
      let scrollY = 0;
      let targetScroll = 0;
      window.addEventListener('scroll', () => {
          targetScroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      }, { passive: true });

      // ─── ANIMATION LOOP ──────────────────────────────────
      const clock = new THREE.Clock();

      function animate() {
          const dt = clock.getDelta();
          const elapsed = clock.getElapsedTime();

          scrollY += (targetScroll - scrollY) * 0.06;

          const camY = 2 + scrollY * 2.5;
          const camZ = 14 - scrollY * 4.5;
          camera.position.lerp(new THREE.Vector3(0, camY, camZ), 0.04);
          camera.lookAt(0, 0.6 + scrollY * 0.4, 0);

          stars.rotation.y += dt * 0.012;
          stars.rotation.x = Math.sin(elapsed * 0.005) * 0.05;

          waveGroup.rotation.y += dt * 0.08;
          waveGroup.rotation.x = Math.sin(elapsed * 0.03) * 0.06 + scrollY * 0.15;
          waveGroup.rotation.z = Math.cos(elapsed * 0.02) * 0.04;

          for (const stripe of stripes) {
              const d = stripe.userData;
              const wave = Math.sin(elapsed * d.speed + d.phaseX) * d.amp;
              const wave2 = Math.cos(elapsed * d.speed * 0.7 + d.phaseY) * d.amp * 0.6;
              const wave3 = Math.sin(elapsed * d.speed * 0.5 + d.phaseZ) * d.amp * 0.4;

              stripe.position.x = d.basePos.x + wave;
              stripe.position.y = d.basePos.y + wave2 + scrollY * 0.2;
              stripe.position.z = d.basePos.z + wave3;

              stripe.rotation.x = d.baseRot.x + wave * 0.3;
              stripe.rotation.y = d.baseRot.y + wave2 * 0.2;
              stripe.rotation.z = d.baseRot.z + wave3 * 0.2;

              const pulse = 0.6 + 0.4 * Math.sin(elapsed * 0.5 + d.phaseX);
              stripe.material.opacity = Math.min(1, pulse * 0.7 + 0.3);
          }

          const corePulse = 0.7 + 0.3 * Math.sin(elapsed * 0.6);
          core.material.emissiveIntensity = 0.4 + 0.4 * corePulse;
          core.scale.setScalar(1 + 0.08 * Math.sin(elapsed * 0.5));

          ring.rotation.x = Math.PI / 2 + Math.sin(elapsed * 0.08) * 0.05;
          ring.scale.setScalar(1 + 0.04 * Math.sin(elapsed * 0.4));
          ring2.rotation.x = Math.PI / 2 + Math.cos(elapsed * 0.06) * 0.05;
          ring2.scale.setScalar(1 + 0.03 * Math.sin(elapsed * 0.3 + 1));

          sparkles.rotation.y += dt * 0.02;
          sparkles.rotation.x = Math.sin(elapsed * 0.01) * 0.03;

          renderer.render(scene, camera);
          requestAnimationFrame(animate);
      }

      animate();

      // ─── RESIZE ──────────────────────────────────────────
      window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        body {
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          background: #0a0a12;
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

        .content-wrapper {
          position: relative;
          z-index: 1;
          pointer-events: none;
          padding: 0 5vw;
          max-width: 1400px;
          margin: 0 auto;
        }

        .content-wrapper > * {
          pointer-events: auto;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: float 2.2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
      `}</style>

      {/* Three.js canvas */}
      <div id="three-container" />

      {/* Scrollable content */}
      <div className="content-wrapper">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-auto" style={{
          background: 'rgba(10, 10, 18, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo-icon.png"
                  alt="America First"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold">America First</span>
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/articles" className="hover:text-blue-400 transition-colors">
                  Articles
                </Link>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About
                </Link>
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all text-sm font-semibold border border-white/10"
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center py-16 relative">
          <p className="text-sm md:text-base tracking-[0.35em] uppercase text-white/55 font-medium mb-2">
            Nonpartisan · Civic Education
          </p>
          <h1 className="text-6xl md:text-9xl font-extrabold leading-[0.95] tracking-tight text-white mb-4" style={{
            textShadow: '0 0 60px rgba(10, 10, 30, 0.6)'
          }}>
            America<br />
            <span style={{ color: '#3b82f6' }}>First</span>
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mt-8 leading-relaxed text-white/80">
            A <strong className="text-white font-semibold">nonpartisan</strong> civic education organization committed to
            restoring <strong className="text-white font-semibold">logical reasoning</strong>, <strong className="text-white font-semibold">fairness</strong>,
            and <strong className="text-white font-semibold">principled decision-making</strong> in American civic life.
          </p>
          <div className="flex gap-4 mt-12">
            <Link
              href="/articles"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
            >
              Read Articles
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Learn More
            </Link>
          </div>
          <div className="scroll-indicator">Scroll to explore</div>
        </section>

        {/* Mission */}
        <section className="min-h-[80vh] flex flex-col justify-center py-24" style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-medium mb-6">Our Mission</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight max-w-4xl">
            Educate Americans on the principles<br />
            that make <span style={{ color: '#3b82f6' }}>this country</span> great.
          </h2>
          <p className="text-lg md:text-2xl max-w-3xl mt-8 leading-relaxed text-white/75">
            We believe in <strong className="text-white font-semibold">upholding the law</strong>, protecting national
            interests, and promoting informed, fact-based public discourse. We
            support <strong className="text-white font-semibold">truth</strong>, <strong className="text-white font-semibold">data</strong>,
            <strong className="text-white font-semibold"> analysis</strong>, and the <strong className="text-white font-semibold">Constitution</strong> — not
            any political party.
          </p>
        </section>

        {/* Stand */}
        <section className="min-h-[80vh] flex flex-col justify-center py-24" style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-medium mb-6">Our Stance</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight max-w-4xl">
            America — its prosperity, its people,<br />
            its future — <span style={{ color: '#ef4444' }}>above all</span> foreign interests.
          </h2>
          <p className="text-lg md:text-2xl max-w-3xl mt-8 leading-relaxed text-white/75">
            We support <strong className="text-white font-semibold">global cooperation</strong>, but not at the cost of
            compromising America's strength, resources, or values. Every nation
            puts its own interests first — <strong className="text-white font-semibold">America should be no different</strong>.
          </p>
        </section>

        {/* Principles */}
        <section className="min-h-[80vh] flex flex-col justify-center py-24" style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-medium mb-6">Our Principles</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight max-w-4xl mb-12">
            Logic. Fairness. <span style={{ color: '#3b82f6' }}>Loyalty</span> to the{' '}
            <span style={{ color: '#ef4444' }}>Constitution</span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
            {[
              { icon: '⚖️', title: 'Rule of Law', desc: 'No one is above the law. Justice is blind, and the Constitution is our compass.' },
              { icon: '🧠', title: 'Logical Reasoning', desc: 'Decisions rooted in data, analysis, and clear thinking — not emotion or ideology.' },
              { icon: '🤝', title: 'Unity & Diversity', desc: 'We welcome all who embrace American values. Loyalty to country unites us.' },
              { icon: '🇺🇸', title: 'America First', desc: 'Our nation\'s prosperity and security come first — always, and without apology.' }
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-3xl transition-all hover:-translate-y-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="min-h-[80vh] flex flex-col justify-center py-24">
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-medium mb-6">Join the Mission</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight max-w-4xl">
            Loyalty to <span style={{ color: '#3b82f6' }}>America</span><br />
            must come <span style={{ color: '#ef4444' }}>first</span>.
          </h2>
          <p className="text-lg md:text-2xl max-w-2xl mt-8 leading-relaxed text-white/75">
            We welcome diversity, unity, and civic responsibility. For those who
            serve, lead, or aspire to represent this nation — loyalty must be to{' '}
            <strong className="text-white font-semibold">America first</strong>.
          </p>
          <p className="text-base text-white/30 mt-12">
            Nonpartisan · Civic Education · In Formation
          </p>
        </section>

        {/* Footer */}
        <footer className="py-12 flex justify-between items-center flex-wrap gap-6 text-white/35 text-sm" style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <span>© 2025 <strong className="text-white/60">America First</strong> — All rights reserved.</span>
          <span>Founded on <strong className="text-white/60">truth</strong>, <strong className="text-white/60">data</strong>, and the <strong className="text-white/60">Constitution</strong>.</span>
        </footer>
      </div>
    </>
  );
}
