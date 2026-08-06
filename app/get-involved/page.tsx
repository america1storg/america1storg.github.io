'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ExternalLinkModal } from '@/components/ExternalLinkModal';
import { BreadcrumbSchema } from '@/components/StructuredData';

interface Opportunity {
  title: string;
  url: string;
  description: string;
  image?: string;
  category: string;
}

const opportunities: Opportunity[] = [
  {
    title: 'Join Advisory Boards',
    url: 'https://www.jointab.us/find-your-seat',
    description: "There's an empty government seat near you. Many positions are filled by appointment, not election. Find open seats in your area and learn how to apply. Takes minutes to start—just enter your ZIP code.",
    image: 'https://www.google.com/s2/favicons?domain=jointab.us&sz=256',
    category: 'Civic Leadership',
  },
  {
    title: 'JustServe',
    url: 'https://www.justserve.org/',
    description: 'Built to help people find local service projects near them, with a strong community-service focus. Connect with organizations in your area that need volunteers for hands-on projects.',
    image: 'https://www.google.com/s2/favicons?domain=justserve.org&sz=256',
    category: 'Local Service',
  },
  {
    title: 'Volunteers of America',
    url: 'https://www.voa.org/volunteer/',
    description: 'National nonprofit with local affiliate opportunities across the country. Help vulnerable communities through health services, housing support, and community outreach programs.',
    image: 'https://www.google.com/s2/favicons?domain=voa.org&sz=256',
    category: 'National Nonprofit',
  },
  {
    title: 'AmeriCorps',
    url: 'https://www.americorps.gov/join/find-volunteer-opportunity#/',
    description: 'Huge national database with 100,000+ volunteer opportunities, including virtual and onsite roles. Search by location and cause—from education and environment to disaster relief and veterans services.',
    image: 'https://www.google.com/s2/favicons?domain=americorps.gov&sz=256',
    category: 'National Service',
  },
  {
    title: 'Volunteer.gov',
    url: 'https://www.volunteer.gov/s/',
    description: 'Official federal volunteer portal with opportunities at national parks, forests, wildlife areas, and other federal sites. Serve your country while preserving America\'s natural treasures.',
    image: 'https://www.google.com/s2/favicons?domain=volunteer.gov&sz=256',
    category: 'Federal Programs',
  },
];

export default function GetInvolvedPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

  const handleOpportunityClick = (url: string) => {
    setSelectedUrl(url);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    window.open(selectedUrl, '_blank', 'noopener,noreferrer');
    setModalOpen(false);
    setSelectedUrl('');
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedUrl('');
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: isDark ? '#000a2e' : '#f8f9fa',
        color: isDark ? '#fff' : '#000',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://america1stusa.com' },
          { name: 'Get Involved', url: 'https://america1stusa.com/get-involved' }
        ]}
      />
      <Navigation />

      {/* Header */}
      <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
        <p
          className="text-xs tracking-[0.4em] uppercase font-medium mb-4"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
        >
          Make a Difference
        </p>
        <h1
          className="text-6xl md:text-8xl font-extrabold leading-[1.0] tracking-tight mb-6"
          style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)' }}
        >
          <span style={{ color: isDark ? '#fff' : '#000' }}>Get </span>
          <span style={{ color: '#3b82f6' }}>Involved</span>
        </h1>
        <p
          className="text-lg md:text-2xl max-w-[750px] leading-relaxed"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
        >
          Opportunities for <strong style={{ color: isDark ? '#fff' : '#000' }}>volunteers</strong>,{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }}>ambassadors</strong>,{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }}>contributors</strong>,{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }}>researchers</strong>,{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }}>writers</strong>, and{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }}>local organizers</strong> to serve their communities
          and strengthen America.
        </p>
      </header>

      {/* Call-to-Action Cards */}
      <section className="px-[6vw] max-w-[1400px] mx-auto pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Direct Opportunities Card */}
          <div
            className="rounded-2xl p-8 transition-all hover:-translate-y-1"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(219, 234, 254, 0.8) 0%, rgba(191, 219, 254, 0.8) 100%)',
              border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4"
              style={{ color: isDark ? '#60a5fa' : '#3b82f6' }}
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3 className="text-2xl font-bold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>
              Find Volunteer Opportunities
            </h3>
            <p className="text-base leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.75)' }}>
              Browse trusted national platforms below to find local service projects, federal volunteer positions,
              and community outreach opportunities near you.
            </p>
          </div>

          {/* Join Our Mission Card */}
          <div
            className="rounded-2xl p-8 transition-all hover:-translate-y-1"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(254, 226, 226, 0.8) 0%, rgba(252, 165, 165, 0.8) 100%)',
              border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <div className="text-4xl mb-4">🇺🇸</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: isDark ? '#fff' : '#000' }}>
              Join America First
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.75)' }}>
              Interested in becoming an ambassador, researcher, writer, or local organizer for America First?
              We're building a network of civic-minded Americans.
            </p>
            <a
              href="/about#contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Grid */}
      <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
        <h2
          className="text-3xl md:text-5xl font-bold mb-8"
          style={{ color: isDark ? '#fff' : '#000' }}
        >
          National Volunteer Platforms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.url}
              onClick={() => handleOpportunityClick(opportunity.url)}
              className="rounded-2xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(0, 10, 35, 0.85) 0%, rgba(0, 15, 50, 0.9) 100%)'
                  : 'rgba(255, 255, 255, 0.9)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: isDark
                  ? '0 8px 32px rgba(0, 0, 0, 0.6)'
                  : '0 8px 32px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
              }}
            >
              {/* Favicon Image */}
              <div
                className="h-48 flex items-center justify-center"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                    : 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
                }}
              >
                {opportunity.image ? (
                  <Image
                    src={opportunity.image}
                    alt={`${opportunity.title} logo`}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-contain"
                    unoptimized
                    onError={(e) => {
                      // Fallback to icon if favicon fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const svg = target.nextElementSibling as HTMLElement;
                      if (svg) svg.style.display = 'block';
                    }}
                  />
                ) : null}
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)',
                    display: opportunity.image ? 'none' : 'block'
                  }}
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{
                    background: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                  }}
                >
                  {opportunity.category}
                </span>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: isDark ? '#fff' : '#000' }}
                >
                  {opportunity.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.7)' }}
                >
                  {opportunity.description}
                </p>

                {/* External Link Indicator */}
                <div
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#3b82f6' }}
                >
                  <span>Explore Opportunities</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom CTA Section */}
      <section className="px-[6vw] max-w-[1400px] mx-auto pb-24">
        <div
          className="rounded-3xl p-12 text-center"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(0, 10, 35, 0.9) 0%, rgba(30, 58, 138, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(219, 234, 254, 0.9) 100%)',
            border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.5)' : '0 20px 60px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ color: isDark ? '#fff' : '#000' }}
          >
            Every American Can Make a Difference
          </h2>
          <p
            className="text-lg md:text-xl max-w-[700px] mx-auto mb-8"
            style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }}
          >
            Whether you have an hour a week or want to dedicate yourself to national service,
            there's a role for you in strengthening our communities and country.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
            >
              Browse Opportunities
            </a>
            <a
              href="/about"
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                color: isDark ? '#fff' : '#000',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
              }}
            >
              Learn About Us
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* External Link Modal */}
      <ExternalLinkModal
        isOpen={modalOpen}
        url={selectedUrl}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
