import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://america1stusa.vercel.app/about',
  },
  title: 'About Us',
  description: 'Independent civic education and advocacy organization. Learn about our mission to promote logical reasoning and principled decision-making.',
  openGraph: {
    title: 'About America First',
    description: 'Civic education and advocacy promoting logical reasoning and principled decision-making.',
    url: 'https://america1stusa.vercel.app/about',
    type: 'website',
    images: [
      {
        url: 'https://america1stusa.vercel.app/api/og?v=8',
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
    images: ['https://america1stusa.vercel.app/api/og?v=8'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
