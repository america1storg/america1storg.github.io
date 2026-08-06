import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://america1stusa.vercel.app/resources',
  },
  title: 'Resources',
  description: 'Curated civic resources: government info, research, voter guides, and educational materials for informed citizenship.',
  openGraph: {
    title: 'Civic Resources | America First',
    description: 'Civic resources: government info, research, voter guides, and educational materials.',
    url: 'https://america1stusa.vercel.app/resources',
    type: 'website',
    images: [
      {
        url: 'https://america1stusa.vercel.app/api/og?v=3',
        width: 1200,
        height: 630,
        alt: 'America First Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civic Resources | America First',
    description: 'Curated civic resources for informed citizenship.',
    images: ['https://america1stusa.vercel.app/api/og?v=3'],
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
