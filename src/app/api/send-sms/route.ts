import { NextResponse } from 'next/server';

// Access environment variables for Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { to, message } = body;

    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Le numéro de téléphone et le message sont requis' },
        { status: 400 }
      );
    }

    // Format phone number to ensure it has the country code
    let formattedPhone = to;
    if (!to.startsWith('+')) {
      // Add French country code if not already present
      formattedPhone = to.startsWith('0') ? `+33${to.substring(1)}` : `+33${to}`;
    }

    // Only send SMS if in production environment
    if (process.env.NODE_ENV === 'production' && accountSid && authToken && twilioPhoneNumber) {
      // Import Twilio only when needed
      const twilio = require('twilio');
      const client = twilio(accountSid, authToken);

      // Send SMS via Twilio
      await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: formattedPhone
      });

      return NextResponse.json({ success: true, message: 'SMS envoyé avec succès' });
    } else {
      // In development, just log the SMS details
      console.log('DEVELOPMENT MODE - SMS would be sent:', {
        to: formattedPhone,
        from: twilioPhoneNumber || 'TWILIO_PHONE_NUMBER',
        message
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'Mode développement - SMS simulé',
        details: { to: formattedPhone, message }
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du SMS' },
      { status: 500 }
    );
  }
} 