'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen" style={{ background: isDark ? '#000a2e' : '#f8f9fa', color: isDark ? '#fff' : '#000', fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase font-medium mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.4)' }}>Legal</p>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.0] tracking-tight mb-6" style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)' }}>
          <span style={{ color: isDark ? '#fff' : '#000' }}>Privacy</span>{' '}
          <span style={{ color: '#3b82f6' }}>Policy</span>
        </h1>
        <p className="text-lg md:text-xl max-w-[650px]" style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </header>

      {/* Content */}
      <main className="px-[6vw] max-w-[900px] mx-auto pb-24 space-y-12">
        {/* Introduction */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Introduction</h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            America First ("we," "us," or "our") respects your privacy and is committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or subscribe
            to our newsletter.
          </p>
        </section>

        {/* Information We Collect */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Information We Collect</h2>
          <div className="space-y-4 text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>Email Addresses</h3>
              <p>
                When you subscribe to our newsletter, we collect your email address. This is the primary personal information
                we collect and store.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>Analytics Data</h3>
              <p>
                We use Vercel Analytics to collect privacy-friendly, cookie-free website analytics. This includes page views,
                referrer sources, general location data (country level), device type, and browser information. Vercel Analytics
                does not use cookies and does not collect personally identifiable information. No IP addresses are stored.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>How We Use Your Information</h2>
          <div className="space-y-3 text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Send you newsletters and updates about new articles and resources</li>
              <li>Communicate important information about our organization</li>
              <li>Improve our website content and user experience</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Respond to your inquiries and provide support</li>
            </ul>
          </div>
        </section>

        {/* Third-Party Services */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Third-Party Services</h2>
          <div className="space-y-4 text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            <p>
              We use Brevo (formerly Sendinblue) as our email service provider to manage our newsletter subscriptions and
              send communications. By subscribing to our newsletter, you acknowledge that your email address will be
              processed by Brevo in accordance with their privacy policy.
            </p>
            <p>
              <strong style={{ color: isDark ? '#fff' : '#000' }}>Important:</strong> We are not responsible for how
              Brevo processes or stores your data. We recommend reviewing{' '}
              <a
                href="https://www.brevo.com/legal/privacypolicy/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
                style={{ color: '#3b82f6' }}
              >
                Brevo's Privacy Policy
              </a>{' '}
              to understand their data practices.
            </p>
          </div>
        </section>

        {/* Data Sharing and Sale */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Data Sharing and Sale</h2>
          <div className="space-y-4 text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            <p>
              <strong style={{ color: isDark ? '#fff' : '#000' }}>We do not sell, trade, or rent your email address
              or personal information to third parties.</strong> Your email address is used solely for the purposes
              described in this Privacy Policy.
            </p>
            <p>
              We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>With our email service provider (Brevo) to deliver newsletters and communications</li>
              <li>When required by law or to comply with legal processes</li>
              <li>To protect our rights, property, or safety, or that of others</li>
            </ul>
          </div>
        </section>

        {/* Your Rights */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Your Rights</h2>
          <div className="space-y-4 text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            <p>You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong style={{ color: isDark ? '#fff' : '#000' }}>Unsubscribe:</strong> You can unsubscribe from our newsletter at any time by clicking the "Unsubscribe" link at the bottom of any email we send you</li>
              <li><strong style={{ color: isDark ? '#fff' : '#000' }}>Access:</strong> You can request information about the personal data we hold about you</li>
              <li><strong style={{ color: isDark ? '#fff' : '#000' }}>Deletion:</strong> You can request that we delete your email address and any associated data from our records</li>
              <li><strong style={{ color: isDark ? '#fff' : '#000' }}>Correction:</strong> You can request that we correct any inaccurate information we hold about you</li>
            </ul>
            <p>
              To exercise any of these rights, please{' '}
              <Link
                href="/about#contact"
                className="underline hover:no-underline"
                style={{ color: '#3b82f6' }}
              >
                contact us through our contact form
              </Link>.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Data Security</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            We implement reasonable security measures to protect your personal information from unauthorized access,
            disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic
            storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* Children's Privacy */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Children's Privacy</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            Our website and services are not directed to children under the age of 13. We do not knowingly collect
            personal information from children under 13. If you believe we have collected information from a child
            under 13, please contact us immediately.
          </p>
        </section>

        {/* Changes to This Policy */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Changes to This Privacy Policy</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
            updated "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        {/* Contact */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Contact Us</h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            If you have any questions or concerns about this Privacy Policy or our data practices, please get in touch with us.
          </p>
          <Link
            href="/about#contact"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-semibold shadow-lg"
          >
            Contact Us
          </Link>
        </section>

        {/* Back to Home */}
        <div className="text-center pt-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
