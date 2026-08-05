import { NextRequest, NextResponse } from 'next/server';
import { newsletterRateLimiter } from '@/lib/rate-limit';
import { sanitizeEmail } from '@/lib/sanitize';

export async function POST(request: NextRequest) {
  // Rate limiting check
  const rateLimitResult = newsletterRateLimiter.check(request);
  if (rateLimitResult.limited) {
    return NextResponse.json(
      { error: 'Too many subscription attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  try {
    const { email } = await request.json();

    // Sanitize and validate email
    const { valid, sanitized } = sanitizeEmail(email);

    if (!valid) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
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

    // Add contact to Brevo (use sanitized email)
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: sanitized,
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
