import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const token = cookieHeader?.match(/customerAccessToken=([^;]+)/)?.[1];
  const email = cookieHeader?.match(/customerEmail=([^;]+)/)?.[1];
  const loginMethod = cookieHeader?.match(/loginMethod=([^;]+)/)?.[1];
  
  if (!token) {
    return NextResponse.json({ isAuthenticated: false });
  }

  return NextResponse.json({
    isAuthenticated: true,
    email: email ? decodeURIComponent(email) : null,
    loginMethod: loginMethod ? decodeURIComponent(loginMethod) : null,
  });
}
