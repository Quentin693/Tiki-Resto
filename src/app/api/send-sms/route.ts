import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Configuration Twilio côté serveur
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Interface pour la requête
interface SmsRequest {
  to: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier la disponibilité des informations d'identification Twilio
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('Configuration Twilio manquante');
      return NextResponse.json(
        { success: false, message: 'Configuration Twilio manquante' },
        { status: 500 }
      );
    }

    // Initialiser le client Twilio
    const client = twilio(accountSid, authToken);

    // Récupérer les données de la requête
    const data: SmsRequest = await request.json();
    
    if (!data.to || !data.message) {
      return NextResponse.json(
        { success: false, message: 'Numéro de téléphone ou message manquant' },
        { status: 400 }
      );
    }

    // Envoyer le SMS via Twilio
    const message = await client.messages.create({
      body: data.message,
      from: twilioPhoneNumber,
      to: data.to
    });

    console.log('SMS envoyé avec succès, SID:', message.sid);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'SMS envoyé avec succès',
        sid: message.sid 
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi du SMS:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erreur lors de l'envoi du SMS: ${error.message}`,
        error: error.message 
      },
      { status: 500 }
    );
  }
} 