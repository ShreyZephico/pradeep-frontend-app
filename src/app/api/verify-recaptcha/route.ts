import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const params = new URLSearchParams();
    params.append('secret', secretKey!);
    params.append('response', token);

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    return NextResponse.json({ success: data.success });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}