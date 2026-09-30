'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ExternalLinkModal } from '@/components/ExternalLinkModal';
import { BreadcrumbSchema } from '@/components/StructuredData';

interface Resource {
  id?: number;
  title: string;
  url: string;
  description: string;
  domain: string;
  category: string;
  imageUrl?: string;
  image_url?: string;
}

// Fallback resources (used while loading or if API fails)
const fallbackResources: Resource[] = [
  {
    title: 'White House Fact Sheets',
    url: 'https://www.whitehouse.gov/briefing-room/statements-releases/',
    description: 'Official White House fact sheets, policy statements, and press releases. Detailed information on administration initiatives, policies, and executive actions.',
    domain: 'whitehouse.gov',
    category: 'Executive',
    imageUrl: `${BLOB_BASE_URL}/whitehouse-factsheets.jpg`,
  },
  {
    title: 'Guides.vote',
    url: 'https://guides.vote/',
    description: 'Nonpartisan candidate guide with researched comparisons and credible sourcing. Side-by-side candidate comparisons with verified facts and citations.',
    domain: 'guides.vote',
    category: 'Elections',
    imageUrl: `${BLOB_BASE_URL}/guides-vote.jpg`,
  },
  {
    title: 'GovTrack',
    url: 'https://www.govtrack.us/congress/bills/',
    description: 'Good for federal bill tracking, voting records, and legislative history. Track Congress with clear visualizations and email alerts for bills you care about.',
    domain: 'govtrack.us',
    category: 'Legislative',
    imageUrl: `${BLOB_BASE_URL}/govtrack.jpg`,
  },
  {
    title: 'The White House',
    url: 'https://www.whitehouse.gov/',
    description: 'Official information from the presidency. Presidential statements, policy initiatives, executive actions, and administration updates.',
    domain: 'whitehouse.gov',
    category: 'Executive',
    imageUrl: `${BLOB_BASE_URL}/whitehouse.jpg`,
  },
  {
    title: 'Congress.gov',
    url: 'https://www.congress.gov/',
    description: 'Official federal bill site; best for bill status, sponsors, and legislative text. The authoritative source for all congressional legislation and records.',
    domain: 'congress.gov',
    category: 'Legislative',
    imageUrl: `${BLOB_BASE_URL}/congress.jpg`,
  },
  {
    title: 'Vote Smart',
    url: 'https://www.votesmart.org/',
    description: 'Best for candidates, voting records, issue positions, public comments, and factual profiles. Nonpartisan research on elected officials and candidates across America.',
    domain: 'votesmart.org',
    category: 'Elections',
    imageUrl: `${BLOB_BASE_URL}/votesmart.jpg`,
  },
  {
    title: 'National Constitution Center',
    url: 'https://constitutioncenter.org/',
    description: 'Learn about, debate, and celebrate the greatest vision of human freedom in history—the U.S. Constitution. Interactive exhibits, educational resources, and constitutional debates.',
    domain: 'constitutioncenter.org',
    category: 'Education',
    imageUrl: `${BLOB_BASE_URL}/constitutioncenter.jpg`,
  },
  {
    title: 'Senate Floor Activity',
    url: 'https://www.senate.gov/legislative/LIS/floor_activity/floor_activity.htm',
    description: 'Track real-time Senate legislative action. See what bills are being debated, voted on, and moving through the legislative process right now.',
    domain: 'senate.gov',
    category: 'Legislative',
    imageUrl: `${BLOB_BASE_URL}/senate.jpg`,
  },
  {
    title: 'Ballotpedia Legislation Trackers',
    url: 'https://ballotpedia.org/Legislation_Trackers',
    description: 'Comprehensive tracking of candidates, ballot measures, and legislation across all 50 states. See who is running, what offices are on the ballot, and topic-based bill trackers.',
    domain: 'ballotpedia.org',
    category: 'Elections',
    imageUrl: `${BLOB_BASE_URL}/ballotpedia.jpg`,
  },
  {
    title: 'America.gov',
    url: 'https://america.gov/',
    description: 'Official U.S. government portal providing comprehensive information about American government, society, and values. Access federal resources, services, and information across all branches of government.',
    domain: 'america.gov',
    category: 'Government',
    imageUrl: `${BLOB_BASE_URL}/america.jpg`,
  },
];

export default function ResourcesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [resources, setResources] = useState<Resource[]>(fallbackResources);
  const [loading, setLoading] = useState(true);

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources');
        if (response.ok) {
          const data = await response.json();
          // Normalize the data (handle both imageUrl and image_url)
          const normalized = data.map((r: Resource) => ({
            ...r,
            imageUrl: r.image_url || r.imageUrl,
          }));
          setResources(normalized);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        // Fallback resources already set as default
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Track when all images have loaded
  useEffect(() => {
    if (imagesLoaded.size === resources.length) {
      setAllImagesLoaded(true);
    }
  }, [imagesLoaded, resources.length]);

  const handleImageLoad = (domain: string) => {
    setImagesLoaded(prev => new Set(prev).add(domain));
  };

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

  // If images are still loading, show the loading skeleton
  if (!allImagesLoaded) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: isDark ? '#000a2e' : '#f8f9fa',
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        }}
      >
        <Navigation />

        {/* Preload images in hidden container */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          {resources.map((resource) => (
            <Image
              key={resource.domain}
              src={resource.imageUrl || resource.image_url || ''}
              alt={resource.title}
              width={1200}
              height={520}
              onLoad={() => handleImageLoad(resource.domain)}
              priority
            />
          ))}
        </div>

        {/* Header Skeleton */}
        <header className="pt-32 pb-16 px-[6vw] max-w-[1400px] mx-auto">
          <div
            className="h-4 w-32 rounded mb-4 animate-pulse"
            style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
          />
          <div
            className="h-20 w-96 max-w-full rounded mb-6 animate-pulse"
            style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
          />
          <div
            className="h-16 w-full max-w-[650px] rounded animate-pulse"
            style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
          />
        </header>

        {/* Grid Skeleton */}
        <main className="px-[6vw] max-w-[1400px] mx-auto pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, i) => (
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
                    className="h-20 w-full rounded mb-4"
                    style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <div
                    className="h-6 w-32 rounded"
                    style={{ background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

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
          { name: 'Resources', url: 'https://america1stusa.vercel.app/resources' }
        ]}
      />
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
              {/* Resource Image */}
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={resource.imageUrl || resource.image_url || ''}
                  alt={`${resource.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
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
