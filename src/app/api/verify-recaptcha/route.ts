// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { token } = body;

//     if (!token) {
//       return NextResponse.json(
//         { success: false, error: 'No token provided' },
//         { status: 400 }
//       );
//     }

//     const secretKey = process.env.RECAPTCHA_SECRET_KEY;

//     if (!secretKey) {
//       console.error('RECAPTCHA_SECRET_KEY is not set');
//       return NextResponse.json(
//         { success: false, error: 'Server configuration error' },
//         { status: 500 }
//       );
//     }

//     const params = new URLSearchParams();
//     params.append('secret', secretKey);
//     params.append('response', token);

//     const response = await fetch(
//       'https://www.google.com/recaptcha/api/siteverify',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: params.toString(),
//       }
//     );

//     const data = await response.json();

//     if (data.success) {
//       return NextResponse.json({ success: true });
//     } else {
//       return NextResponse.json(
//         { success: false, error: 'reCAPTCHA verification failed' },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error('reCAPTCHA verification error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Verification failed' },
//       { status: 500 }
//     );
//   }
// }