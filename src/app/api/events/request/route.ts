import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, formatEventEmailContent } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire
    const eventData = await request.json();
    
    // Validation des données requises
    if (!eventData.customerName || !eventData.customerEmail || !eventData.customerPhone) {
      return NextResponse.json(
        { error: 'Informations de contact manquantes' },
        { status: 400 }
      );
    }
    
    // Formater le contenu de l'email
    const emailHtml = formatEventEmailContent(eventData);
    
    // Envoyer l'email à la même adresse que celle du client
    const sendResult = await sendEmail({
      to: eventData.customerEmail, // Envoi à l'email du client
      subject: 'Votre demande d\'événement - Tiki Au Bord de l\'Eau',
      html: emailHtml,
    });
    
    // En développement, ne pas envoyer une seconde copie au restaurant
    if (process.env.NODE_ENV === 'production') {
      // Envoyer une copie au restaurant
      await sendEmail({
        to: 'contact@tikiaubordeleau.com', // Adresse du restaurant
        subject: 'Nouvelle demande d\'événement via le site web',
        html: emailHtml,
      });
    }
    
    // Retourner l'URL de prévisualisation pour le développement
    return NextResponse.json({ 
      success: true,
      previewUrl: sendResult.previewUrl
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la demande d\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la demande' },
      { status: 500 }
    );
  }
} 