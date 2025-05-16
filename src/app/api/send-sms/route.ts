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
    console.log('Démarrage de la requête d\'envoi de SMS');
    
    // Log des variables d'environnement (masquées pour la sécurité)
    console.log('Twilio SID configuré:', accountSid ? 'Oui (masqué)' : 'Non');
    console.log('Twilio Auth Token configuré:', authToken ? 'Oui (masqué)' : 'Non');
    console.log('Twilio Phone Number:', twilioPhoneNumber);
    
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
    console.log('Requête d\'envoi de SMS reçue:', { 
      to: data.to ? `${data.to.substring(0, 4)}...` : 'manquant', // Pour la sécurité, n'affiche que le début
      messageLength: data.message ? data.message.length : 0 
    });
    
    if (!data.to || !data.message) {
      console.error('Données manquantes:', { to: !!data.to, message: !!data.message });
      return NextResponse.json(
        { success: false, message: 'Numéro de téléphone ou message manquant' },
        { status: 400 }
      );
    }

    // Valider le format du numéro de téléphone (doit commencer par +)
    if (!data.to.startsWith('+')) {
      console.error('Format de numéro invalide:', data.to.substring(0, 4) + '...');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Le numéro de téléphone doit être au format international commençant par +' 
        },
        { status: 400 }
      );
    }

    // Envoyer le SMS via Twilio
    console.log('Envoi du SMS via Twilio...');
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
    console.error('Détails de l\'erreur Twilio:', {
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
      details: error.details
    });
    
    let errorMessage = `Erreur lors de l'envoi du SMS: ${error.message}`;
    let statusCode = 500;
    
    // Traiter les erreurs spécifiques de Twilio
    if (error.code === 21211) {
      errorMessage = 'Le numéro de téléphone est invalide.';
      statusCode = 400;
    } else if (error.code === 21608) {
      errorMessage = 'Le numéro de téléphone n\'est pas vérifié pour l\'envoi de SMS dans ce pays.';
      statusCode = 400;
    } else if (error.code === 21610) {
      errorMessage = 'Le message est trop long.';
      statusCode = 400;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        errorCode: error.code,
        errorStatus: error.status,
        error: error.message 
      },
      { status: statusCode }
    );
  }
} 