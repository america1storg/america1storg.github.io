# Brevo (Sendinblue) Newsletter Setup Guide

This guide will help you set up Brevo for managing email subscriptions and sending newsletters.

## Step 1: Create a Brevo Account

1. Go to [Brevo.com](https://www.brevo.com/) (formerly Sendinblue)
2. Click **Sign Up Free**
3. Fill in your details:
   - Email address
   - Organization name: **America First**
   - Password
4. Verify your email address
5. Complete the onboarding questionnaire

## Step 2: Get Your API Key

1. Log into your Brevo account
2. Click your name in the top right corner
3. Go to **SMTP & API** → **API Keys**
4. Click **Generate a new API key**
5. Give it a name (e.g., "America First Website")
6. Copy the API key (you'll only see it once!)
7. Save it securely

## Step 3: Create a Contact List

1. In Brevo dashboard, go to **Contacts** → **Lists**
2. Click **Create a list**
3. Name it: **Newsletter Subscribers**
4. Add a description (optional)
5. Click **Create**
6. Note the **List ID** (you'll see it in the URL or list details)

## Step 4: Configure Environment Variables

1. Open your `.env.local` file in the project root
2. Add your Brevo credentials:

```env
BREVO_API_KEY="your-actual-api-key-here"
BREVO_LIST_ID="your-list-id-number"
```

Example:
```env
BREVO_API_KEY="xkeysib-abc123def456..."
BREVO_LIST_ID="2"
```

3. Save the file

## Step 5: Deploy to Vercel (Production)

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add both variables:
   - `BREVO_API_KEY` = your API key
   - `BREVO_LIST_ID` = your list ID
5. Click **Save**
6. Redeploy your site

## Step 6: Test the Subscription

1. Visit your website
2. Find the newsletter subscription form (on home page and about page)
3. Enter a test email address
4. Click **Subscribe**
5. Check Brevo dashboard → **Contacts** to verify the contact was added

## How to Send Newsletters

### Option A: Manual Newsletter (Recommended to Start)

1. Log into Brevo
2. Go to **Campaigns** → **Email**
3. Click **Create an email campaign**
4. Choose a template or design from scratch
5. Write your newsletter content
6. Select recipients: Choose your **Newsletter Subscribers** list
7. Preview and test
8. Schedule or send immediately

### Option B: Automated Transactional Emails (Advanced)

You can set up automated emails for:
- Welcome email when someone subscribes
- Notification when a new article is published
- Weekly digest of new content

To set this up:
1. Go to **Automation** in Brevo
2. Create a workflow
3. Set triggers (e.g., "Contact added to list")
4. Design the email template
5. Activate the automation

## Free Tier Limits

- **Contacts**: Unlimited
- **Email sends**: 300 per day (9,000 per month)
- **SMTP relay**: Unlimited
- Perfect for weekly newsletters + article notifications!

## Best Practices

1. **Welcome Email**: Set up an automated welcome email when someone subscribes
2. **Confirmation**: Consider using double opt-in for GDPR compliance
3. **Unsubscribe**: Brevo automatically includes unsubscribe links
4. **Analytics**: Track open rates and clicks in the Brevo dashboard
5. **Segments**: Create segments for different types of subscribers later

## Troubleshooting

### "Newsletter service is not configured"
- Check that `BREVO_API_KEY` is set in `.env.local`
- Restart your dev server after adding environment variables

### "Failed to subscribe"
- Verify your API key is correct
- Check that the list ID is a number, not a string
- Look at the browser console for detailed error messages

### "This email is already subscribed"
- This is normal - the person is already in your list
- They can manage their subscription through email links

## Managing Subscribers

### View Subscribers
1. Go to **Contacts** in Brevo
2. Click on your list name
3. See all subscribers and their details

### Export Subscribers
1. Go to your list
2. Click **Export**
3. Choose CSV or Excel format

### Remove Subscribers
1. Find the contact in your list
2. Click on their email
3. Click **Delete contact**

## Analytics & Reporting

Track your newsletter performance:
1. Go to **Campaigns** → **Statistics**
2. View metrics for each campaign:
   - Opens
   - Clicks
   - Unsubscribes
   - Bounces

## Support

- Brevo Help: [help.brevo.com](https://help.brevo.com)
- API Documentation: [developers.brevo.com](https://developers.brevo.com)

## Next Steps

After basic setup:
1. ✅ Set up welcome email automation
2. ✅ Design a newsletter template
3. ✅ Plan your newsletter schedule (weekly/bi-weekly)
4. ✅ Create segments for different content types
5. ✅ Set up email domain authentication (SPF/DKIM) for better deliverability
