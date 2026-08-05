import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error('BREVO_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Newsletter service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Add contact to Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(process.env.BREVO_LIST_ID || '0')],
        updateEnabled: true,
        attributes: {
          SUBSCRIBED_AT: new Date().toISOString(),
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle case where contact already exists
      if (response.status === 400 && data.code === 'duplicate_parameter') {
        return NextResponse.json(
          { error: 'This email is already subscribed!' },
          { status: 400 }
        );
      }

      console.error('Brevo API error:', data);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
