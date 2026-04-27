import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Get the actual site URL from the request
    const origin = request.headers.get('origin');
    
    if (!origin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Site URL not found' 
      }, { status: 500 });
    }
    
    // Prepare data for Netlify Forms
    const netlifyFormData = new URLSearchParams();
    netlifyFormData.append('form-name', 'consultation');
    netlifyFormData.append('name', formData.get('name') as string);
    netlifyFormData.append('email', formData.get('email') as string);
    netlifyFormData.append('phone', formData.get('phone') as string);
    netlifyFormData.append('message', formData.get('message') as string);
    
    // Send to Netlify
    const response = await fetch(`${origin}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: netlifyFormData.toString(),
    });
    
    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Form submitted successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission failed' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
}