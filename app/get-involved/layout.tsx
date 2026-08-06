import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Volunteer opportunities and civic engagement programs. Join advisory boards, serve locally, and make a difference.',
  openGraph: {
    title: 'Get Involved | America First',
    description: 'Volunteer opportunities and civic engagement programs to serve your community.',
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
