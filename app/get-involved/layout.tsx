import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Find volunteer opportunities, civic engagement programs, and ways to make a difference in your community. Join advisory boards, serve locally, and engage in meaningful civic action.',
  openGraph: {
    title: 'Get Involved | America First',
    description: 'Volunteer opportunities and civic engagement programs. Find ways to serve your community and make a difference.',
    url: 'https://america1stusa.com/get-involved',
    type: 'website',
    images: [
      {
        url: 'https://america1stusa.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Get Involved with America First',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Involved | America First',
    description: 'Volunteer opportunities and civic engagement programs.',
    images: ['https://america1stusa.com/api/og'],
  },
};

export default function GetInvolvedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
