import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, subject } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || 'contact@pradeepjewellers.com', // Your business email
      subject: subject || `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #FDF8F0 0%, #FFFFFF 100%);
              border-radius: 12px;
            }
            .header {
              text-align: center;
              padding: 20px;
              background: #0A2B2E;
              border-radius: 12px 12px 0 0;
              color: #D4AF37;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
              background: #FFFFFF;
              border-radius: 0 0 12px 12px;
            }
            .field {
              margin-bottom: 20px;
              padding: 15px;
              background: #F9F6EE;
              border-left: 4px solid #D4AF37;
              border-radius: 8px;
            }
            .field-label {
              font-weight: bold;
              color: #0A2B2E;
              margin-bottom: 8px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .field-value {
              color: #2C2C2C;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #E2DFD7;
              margin-top: 20px;
            }
            .gold-text {
              color: #D4AF37;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pradeep Jewellers</h1>
              <p>New Consultation Request</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Customer Name</div>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email Address</div>
                <div class="field-value">${email}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Phone Number</div>
                <div class="field-value">${phone}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Message / Requirements</div>
                <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent from the contact form on Pradeep Jewellers website.</p>
              <p>© ${new Date().getFullYear()} Pradeep Jewellers. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Contact Form Submission from Pradeep Jewellers
        
        Customer Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
        
        This message was sent from the contact form on Pradeep Jewellers website.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send auto-reply to customer
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Pradeep Jewellers',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #FFFFFF;
              border-radius: 12px;
            }
            .header {
              text-align: center;
              padding: 20px;
              background: #0A2B2E;
              border-radius: 12px 12px 0 0;
              color: #D4AF37;
            }
            .content {
              padding: 30px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #D4AF37;
              color: #0A2B2E;
              text-decoration: none;
              border-radius: 8px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank You for Reaching Out!</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for contacting <strong>Pradeep Jewellers</strong>. We have received your inquiry and one of our jewellery experts will get back to you within <strong>24 hours</strong>.</p>
              <p>Our team will assist you with:</p>
              <ul>
                <li>Personalized jewellery consultation</li>
                <li>Custom design options</li>
                <li>Pricing and availability</li>
                <li>Schedule a private viewing</li>
              </ul>
              <p>In the meantime, feel free to:</p>
              <a href="https://wa.me/919876543210" class="button">Chat on WhatsApp</a>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Warm regards,<br>
                <strong>Pradeep Jewellers Team</strong>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(autoReplyOptions);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}