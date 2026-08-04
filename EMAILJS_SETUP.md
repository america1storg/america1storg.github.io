# EmailJS Setup Instructions

The contact form on the About page uses EmailJS to send emails. Follow these steps to configure it:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your `americafirstusateam@gmail.com` account
5. Copy the **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```
Subject: New Contact Form Submission - {{subject}}

From: {{from_name}}
Email: {{from_email}}

Subject: {{subject}}

Message:
{{message}}

---
This message was sent via the America First contact form.
```

4. Save the template and copy the **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `abcdefghijklmnop`)

## Step 5: Update the Code

Open `components/ContactForm.tsx` and replace these values on lines 72-75:

```typescript
await emailjs.send(
  'YOUR_SERVICE_ID',  // Replace with your Service ID from Step 2
  'YOUR_TEMPLATE_ID', // Replace with your Template ID from Step 3
  {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: formData.message,
    to_email: 'americafirstusateam@gmail.com'
  },
  'YOUR_PUBLIC_KEY' // Replace with your Public Key from Step 4
);
```

### Example:
```typescript
await emailjs.send(
  'service_9x3x5df',
  'template_a1ethkb',
  {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: formData.message,
    to_email: 'americafirstusateam@gmail.com'
  },
  'abcdefghijklmnop'
);
```

## Step 6: Test the Form

1. Run `npm run dev`
2. Go to `/about`
3. Fill out the contact form
4. Submit and check your email!

## Troubleshooting

- **Emails not sending?** Check your EmailJS dashboard for error logs
- **Template not working?** Make sure variable names match: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
- **Rate limit exceeded?** Free tier has 200 emails/month limit

## Security Note

The EmailJS keys are intentionally in the client-side code. EmailJS is designed for this and has rate limiting and domain restrictions to prevent abuse. You can further secure it by:

1. In EmailJS dashboard, go to **Settings** → **Security**
2. Add your domain (e.g., `america1storg.github.io`) to allowed domains
3. This prevents others from using your EmailJS keys on different websites
