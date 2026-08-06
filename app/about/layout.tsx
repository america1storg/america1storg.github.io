import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://america1stusa.com/about',
  },
  title: 'About Us',
  description: 'Independent civic education and advocacy organization. Learn about our mission to promote logical reasoning and principled decision-making.',
  openGraph: {
    title: 'About America First',
    description: 'Civic education and advocacy promoting logical reasoning and principled decision-making.',
    url: 'https://america1stusa.com/about',
    type: 'website',
    images: [
      {
        url: 'https://america1stusa.com/api/og?v=2',
        width: 1200,
        height: 630,
        alt: 'About America First',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About America First',
    description: 'Civic education and advocacy promoting logical reasoning and principled decision-making.',
    images: ['https://america1stusa.com/api/og?v=2'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
