'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ExternalLinkModal } from '@/components/ExternalLinkModal';

interface Resource {
  title: string;
  url: string;
  description: string;
  image?: string;
  category: string;
}

const resources: Resource[] = [
  {
    title: 'Join Advisory Boards',
    url: 'https://www.jointab.us/find-your-seat',
    description: "There's an empty government seat near you. Many positions are filled by appointment, not election. Find open seats in your area and learn how to apply. Takes minutes to start—just enter your ZIP code.",
    image: 'https://www.google.com/s2/favicons?domain=jointab.us&sz=256',
    category: 'Civic Engagement',
  },
  {
    title: 'The White House',
    url: 'https://www.whitehouse.gov/',
    description: 'Official information from the presidency. Presidential statements, policy initiatives, executive actions, and administration updates.',
    image: 'https://www.google.com/s2/favicons?domain=whitehouse.gov&sz=256',
    category: 'Executive',
  },
  {
    title: 'National Constitution Center',
    url: 'https://constitutioncenter.org/',
    description: 'Learn about, debate, and celebrate the greatest vision of human freedom in history—the U.S. Constitution. Interactive exhibits, educational resources, and constitutional debates.',
    image: 'https://www.google.com/s2/favicons?domain=constitutioncenter.org&sz=256',
    category: 'Education',
  },
  {
    title: 'Senate Floor Activity',
    url: 'https://www.senate.gov/legislative/LIS/floor_activity/floor_activity.htm',
    description: 'Track real-time Senate legislative action. See what bills are being debated, voted on, and moving through the legislative process right now.',
    image: 'https://www.google.com/s2/favicons?domain=senate.gov&sz=256',
    category: 'Legislative',
  },
  {
    title: 'Ballotpedia Legislation Trackers',
    url: 'https://ballotpedia.org/Legislation_Trackers',
    description: 'Comprehensive tracking of candidates, ballot measures, and legislation across all 50 states. See who is running, what offices are on the ballot, and topic-based bill trackers.',
    image: 'https://www.google.com/s2/favicons?domain=ballotpedia.org&sz=256',
    category: 'Elections',
  },
];

export default function ResourcesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

  const handleResourceClick = (url: string) => {
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
      <Navigation />

      {/* Header */}
      <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
        <p
          className="text-xs tracking-[0.4em] uppercase font-medium mb-4"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}
        >
          Civic Resources
        </p>
        <h1
          className="text-6xl md:text-8xl font-extrabold leading-[1.0] tracking-tight mb-6"
          style={{ textShadow: isDark ? '0 0 80px rgba(0, 0, 0, 0.8)' : '0 0 80px rgba(255, 255, 255, 0.8)' }}
        >
          <span style={{ color: isDark ? '#fff' : '#000' }}>Resources</span>
        </h1>
        <p
          className="text-lg md:text-2xl max-w-[650px]"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }}
        >
          Trusted resources to help Americans stay <strong style={{ color: isDark ? '#fff' : '#000' }}>informed</strong>,{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }}>engaged</strong>, and{' '}
          <strong style={{ color: isDark ? '#fff' : '#000' }}>active</strong> in civic life.
        </p>
      </header>

      {/* Resources Grid */}
      <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div
              key={resource.url}
              onClick={() => handleResourceClick(resource.url)}
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
                {resource.image ? (
                  <Image
                    src={resource.image}
                    alt={`${resource.title} logo`}
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
                    display: resource.image ? 'none' : 'block'
                  }}
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
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
                  {resource.category}
                </span>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: isDark ? '#fff' : '#000' }}
                >
                  {resource.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.7)' }}
                >
                  {resource.description}
                </p>

                {/* External Link Indicator */}
                <div
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#3b82f6' }}
                >
                  <span>Visit Resource</span>
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
