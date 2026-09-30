'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ExternalLinkModal } from '@/components/ExternalLinkModal';
import { BreadcrumbSchema } from '@/components/StructuredData';
import Image from 'next/image';

interface Opportunity {
  id?: number;
  title: string;
  url: string;
  description: string;
  domain: string;
  category: string;
  imageUrl?: string;
  image_url?: string;
}

export default function GetInvolvedPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch volunteers from database
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/volunteers');
        if (response.ok) {
          const data = await response.json();
          const normalized = data.map((v: Opportunity) => ({
            ...v,
            imageUrl: v.image_url || v.imageUrl,
          }));
          setOpportunities(normalized);
        }
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

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
          { name: 'Home', url: 'https://america1stusa.vercel.app' },
          { name: 'Get Involved', url: 'https://america1stusa.vercel.app/get-involved' }
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

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{
                  background: isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.9)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  className="h-48"
                  style={{
                    background: isDark
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(59, 130, 246, 0.1)',
                  }}
                />
                <div className="p-6">
                  <div
                    className="h-6 w-24 rounded-full mb-3"
                    style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <div
                    className="h-7 w-3/4 rounded mb-3"
                    style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <div
                    className="h-20 w-full rounded"
                    style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Volunteer Cards */}
        {!loading && (
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
                {/* Volunteer Image */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/30">
                  {(opportunity.imageUrl || opportunity.image_url) && (
                    <Image
                      src={opportunity.imageUrl || opportunity.image_url || ''}
                      alt={`${opportunity.title} preview`}
                      fill
                      className="object-cover transition-opacity duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="eager"
                    />
                  )}
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
        )}
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
