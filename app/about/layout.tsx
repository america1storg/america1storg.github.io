import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'America First is an independent 501(c)(4) civic education and advocacy organization. Learn about our mission to restore logical reasoning, fairness, and principled decision-making in American civic life.',
  openGraph: {
    title: 'About America First',
    description: 'Independent civic education and advocacy organization committed to restoring logical reasoning and principled decision-making.',
    url: 'https://america1stusa.com/about',
    type: 'website',
    images: [
      {
        url: 'https://america1stusa.com/api/og',
        width: 1200,
        height: 630,
        alt: 'About America First',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About America First',
    description: 'Independent civic education and advocacy organization committed to restoring logical reasoning and principled decision-making.',
    images: ['https://america1stusa.com/api/og'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
