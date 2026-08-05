'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { SocialLinks } from '@/components/SocialLinks';

// Removed force-dynamic - about page is now static with client-side theme only

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
      <div className="min-h-screen" style={{ background: isDark ? '#000a2e' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
        {/* Navigation */}
        <Navigation />

        {/* Header */}
        <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase font-medium mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.4)' }}>Who We Are</p>
          <h1 className="text-6xl md:text-8xl font-extrabold leading-[1.0] tracking-tight mb-6" style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)' }}>
            <span style={{ color: isDark ? '#fff' : '#000' }}>About</span><br />
            <span style={{ color: '#3b82f6' }}>America First</span>
          </h1>
          <p className="text-lg md:text-2xl max-w-[650px]" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
            Nonpartisan civic education for <strong style={{ color: isDark ? '#fff' : '#000' }} className="font-semibold">informed citizenship</strong>
          </p>
        </header>

        {/* Content */}
        <main className="px-[6vw] max-w-[1100px] mx-auto pb-24 space-y-16">
          {/* Mission Section */}
          <section
            className="p-12 rounded-3xl"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#3b82f6' }}>Our Mission</h2>
            <p className="text-xl leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
              America First is a nonpartisan civic education organization in formation,
              committed to restoring logical reasoning, fairness, and principled
              decision-making in American civic life. We do not support any political
              party—we support truth, data, analysis, and the Constitution.
            </p>
          </section>

          {/* What We Believe */}
          <section
            className="p-12 rounded-3xl"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#3b82f6' }}>What We Believe</h2>
            <div className="space-y-6 text-xl leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
              <p>
                Our mission is to educate Americans and legal residents on the principles
                that make this country great. We believe in upholding the law, protecting
                national interests, and promoting informed, fact-based public discourse.
              </p>
              <p>
                We stand for America—its prosperity, its people, and its future—above all
                foreign interests. While we support global cooperation, we do not support
                compromising America's strength, resources, or values in the process. Our
                work is rooted in the belief that every nation puts its own interests
                first—and America should be no different.
              </p>
              <p>
                We welcome diversity, unity, and civic responsibility. But for those who
                serve, lead, or aspire to represent this nation—loyalty must be to America
                first.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section
            className="p-12 rounded-3xl"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <h2 className="text-4xl font-bold mb-8" style={{ color: '#3b82f6' }}>Our Values</h2>
            <ul className="space-y-5">
              {[
                { title: 'Truth & Data', desc: 'Every position must be backed by facts, evidence, and rigorous analysis' },
                { title: 'Constitutional Principles', desc: 'The Constitution is the foundation of American governance and civic life' },
                { title: 'Nonpartisan Approach', desc: 'We support principles, not parties; logic, not tribalism' },
                { title: 'National Interest', desc: 'America\'s prosperity, security, and values come first' },
                { title: 'Civic Responsibility', desc: 'Informed citizenship is the bedrock of democracy' }
              ].map((value) => (
                <li key={value.title} className="flex gap-4 items-start">
                  <span style={{ color: '#ef4444' }} className="text-2xl font-bold mt-1">•</span>
                  <div>
                    <strong className="font-semibold text-lg" style={{ color: isDark ? '#fff' : '#000' }}>{value.title}:</strong>
                    <span className="text-lg ml-2" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>{value.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact */}
          <section
            className="p-12 rounded-3xl"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#3b82f6' }}>Contact Us</h2>
            <p className="text-xl mb-8" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
              Have a question or want to get in touch? Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <ContactForm />
          </section>

          {/* Social Media Section */}
          <section
            className="p-12 rounded-3xl text-center"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(12px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#3b82f6' }}>Connect With Us</h2>
            <p className="text-lg mb-8" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
              Follow us on social media to stay updated on our latest articles and civic education initiatives.
            </p>
            <div className="flex justify-center">
              <SocialLinks size="lg" />
            </div>
          </section>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/articles"
              className="inline-block px-10 py-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-bold text-xl shadow-lg"
            >
              Read Our Articles →
            </Link>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
  );
}
