'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function TermsOfUse() {
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
          <span style={{ color: isDark ? '#fff' : '#000' }}>Terms</span>{' '}
          <span style={{ color: '#3b82f6' }}>of Use</span>
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
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Agreement to Terms</h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            By accessing and using this website ("Site"), you accept and agree to be bound by the terms and provision
            of this agreement. If you do not agree to these Terms of Use, please do not use this Site.
          </p>
        </section>

        {/* Use of the Site */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Use of the Site</h2>
          <div className="space-y-4 text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            <p>
              America First grants you a limited, non-exclusive, non-transferable license to access and use this Site
              for personal, non-commercial purposes. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Site for any unlawful purpose or in violation of these Terms</li>
              <li>Attempt to gain unauthorized access to any portion of the Site or any systems or networks</li>
              <li>Interfere with or disrupt the Site or servers or networks connected to the Site</li>
              <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Site without express written permission</li>
              <li>Use automated systems (such as robots, scrapers, or spiders) to access the Site without our permission</li>
              <li>Transmit any viruses, malware, or other harmful code</li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Intellectual Property</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            All content on this Site, including but not limited to text, graphics, logos, images, articles, and software,
            is the property of America First or its content suppliers and is protected by United States and international
            copyright laws. You may not use, reproduce, distribute, or create derivative works from any content on this
            Site without our express written permission.
          </p>
        </section>

        {/* User Content */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>User Submissions</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            If you submit content to us (including through contact forms or email), you grant America First a non-exclusive,
            worldwide, royalty-free license to use, reproduce, modify, and distribute such content for the purposes of
            operating and improving our services. You represent that you own or have the necessary rights to any content
            you submit.
          </p>
        </section>

        {/* Third-Party Links */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Third-Party Links and Services</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            This Site may contain links to third-party websites or services (such as social media platforms). We are not
            responsible for the content, privacy policies, or practices of any third-party sites or services. Your use
            of third-party sites is at your own risk, and we encourage you to review their terms and privacy policies.
          </p>
        </section>

        {/* Analytics */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Analytics</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            We use Vercel Analytics to collect privacy-friendly, cookie-free analytics about how you use our Site. This includes
            information such as page views, referrer sources, and general location data (country level). This information
            helps us improve our Site and understand our audience. Vercel Analytics does not use cookies and does not collect
            personally identifiable information. By using our Site, you consent to this analytics collection as described in our{' '}
            <Link href="/privacy" className="underline hover:no-underline" style={{ color: '#3b82f6' }}>
              Privacy Policy
            </Link>.
          </p>
        </section>

        {/* Disclaimer of Warranties */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Disclaimer of Warranties</h2>
          <div className="space-y-4 text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            <p>
              This Site and all content, materials, information, and services are provided "AS IS" and "AS AVAILABLE"
              without any warranties of any kind, either express or implied.
            </p>
            <p>
              America First does not warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The Site will be uninterrupted, timely, secure, or error-free</li>
              <li>The results that may be obtained from the use of the Site will be accurate or reliable</li>
              <li>Any errors in the Site will be corrected</li>
              <li>The Site or any content is free of viruses or other harmful components</li>
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Limitation of Liability</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            To the fullest extent permitted by law, America First shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
            or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mt-4 text-lg" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            <li>Your access to or use of (or inability to access or use) the Site</li>
            <li>Any conduct or content of any third party on the Site</li>
            <li>Any content obtained from the Site</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
        </section>

        {/* Indemnification */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Indemnification</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            You agree to indemnify, defend, and hold harmless America First, its officers, directors, employees, and
            agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable
            attorneys' fees) arising out of or in any way connected with your access to or use of the Site, your
            violation of these Terms, or your violation of any rights of another.
          </p>
        </section>

        {/* Changes to Terms */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Changes to Terms of Use</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            We reserve the right to modify these Terms of Use at any time. Any changes will be posted on this page with
            an updated "Last Updated" date. Your continued use of the Site after any such changes constitutes your
            acceptance of the new Terms of Use.
          </p>
        </section>

        {/* Governing Law */}
        <section
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#3b82f6' }}>Governing Law</h2>
          <p className="text-lg leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>
            These Terms of Use shall be governed by and construed in accordance with the laws of the United States,
            without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms
            shall be brought exclusively in the courts of the United States.
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
            If you have any questions about these Terms of Use, please get in touch with us.
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
