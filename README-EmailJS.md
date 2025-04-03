# Setting Up EmailJS for Verification Emails

This project uses EmailJS to send verification emails. Follow these steps to set up EmailJS in your project:

## 1. Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up for an account
2. Verify your account by clicking the link in the verification email

## 2. Set Up an Email Service

1. Log in to your EmailJS dashboard
2. Go to "Email Services" from the sidebar
3. Click "Add New Service"
4. Choose a service provider (Gmail, Outlook, etc.)
5. Follow the steps to authenticate with your email provider
6. Give your service a name and save it
7. Copy the Service ID for use in environment variables

## 3. Create an Email Template

1. Go to "Email Templates" from the sidebar
2. Click "Create New Template"
3. Design your template with the following variables:
   - `{{to_name}}` - The user's first name
   - `{{to_email}}` - The user's email address
   - `{{verification_url}}` - The verification URL with token

Example template:

```html
<h1>Welcome, {{to_name}}!</h1>
<p>
  Thank you for signing up for CodeSync. Please verify your email address by
  clicking the link below:
</p>
<p>
  <a
    href="{{verification_url}}"
    style="display: inline-block; padding: 10px 20px; background-color: #111; color: #fff; text-decoration: none; border-radius: 4px;"
  >
    Verify Email
  </a>
</p>
<p>If you did not create this account, please ignore this email.</p>
```

4. Save your template and copy the Template ID for use in environment variables

## 4. Get Your Public Key

1. Go to "Account" → "API Keys"
2. Copy your Public Key for use in environment variables

## 5. Configure Environment Variables

Add the following variables to your `.env.local` file:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## 6. Server-Side Email Sending

EmailJS is primarily designed for client-side use, but this project includes a workaround for server-side email sending:

1. When an email needs to be sent from a server-side API route, we detect this context
2. Instead of calling EmailJS directly (which would fail due to missing browser APIs), we:
   - Make a request to our own `/api/email/send-verification` endpoint
   - This endpoint returns an HTML page with embedded JavaScript
   - The JavaScript uses EmailJS in a browser context to send the email
   - The success/failure status is reported back via another endpoint

This approach allows you to use EmailJS from both client-side and server-side code without any code changes.

## 7. Testing

To test the email verification flow:

1. Sign up for an account in your application
2. Check your email for the verification link
3. Click the link to verify your account

If you encounter any issues, check the server logs and browser console for errors and ensure your EmailJS configuration is correct.
