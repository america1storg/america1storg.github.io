import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Curated civic resources: government info, research, voter guides, and educational materials for informed citizenship.',
  openGraph: {
    title: 'Civic Resources | America First',
    description: 'Civic resources: government info, research, voter guides, and educational materials.',
    url: 'https://america1stusa.com/resources',
    type: 'website',
    images: [
      {
        url: 'https://america1stusa.com/api/og',
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
    images: ['https://america1stusa.com/api/og'],
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
