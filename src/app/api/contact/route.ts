import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Get the form data from the request
    const formData = await request.formData();
    
    // 2. Dynamically get your site's URL (THIS IS CRITICAL)
    const origin = request.headers.get('origin') || process.env.URL;
    if (!origin) {
      return NextResponse.json({ success: false, error: 'Site URL not found' }, { status: 500 });
    }
    
    // 3. Prepare ALL data for Netlify, INCLUDING the honeypot field
    const netlifyFormData = new URLSearchParams();
    netlifyFormData.append('form-name', 'consultation');
    netlifyFormData.append('name', formData.get('name') as string);
    netlifyFormData.append('email', formData.get('email') as string);
    netlifyFormData.append('phone', formData.get('phone') as string);
    netlifyFormData.append('message', formData.get('message') as string);
    
    // 🔑 CRITICAL: Forward the honeypot field for Netlify's spam detection
    const botField = formData.get('bot-field');
    if (botField) {
      netlifyFormData.append('bot-field', botField as string);
    }
    
    // 4. Forward the data to Netlify's root form handler
    const response = await fetch(`${origin}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: netlifyFormData.toString(),
    });
    
    // 5. Check if Netlify accepted the submission
    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Form submitted successfully' });
    } else {
      // Log the error for debugging
      console.error('Netlify submission failed:', response.status, response.statusText);
      return NextResponse.json({ success: false, error: 'Submission failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}