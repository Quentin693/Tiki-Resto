import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Fonction pour créer un compte de test Ethereal
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Compte de test Ethereal créé:');
    console.log('- Email:', testAccount.user);
    console.log('- Mot de passe:', testAccount.pass);
    console.log('Interface Ethereal:', 'https://ethereal.email');
    
    return {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };
  } catch (error) {
    console.error('Erreur lors de la création du compte de test:', error);
    return null;
  }
};

// Variable pour stocker la configuration du transporteur
let transporterConfig: any = null;

// Initialiser le transporteur
export const initTransporter = async () => {
  // Si des variables d'environnement sont définies, on les utilise
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    transporterConfig = {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    };
  } else {
    // Sinon, on crée un compte de test Ethereal
    transporterConfig = await createTestAccount();
    if (!transporterConfig) {
      throw new Error('Impossible de créer un compte de test Ethereal');
    }
  }
  
  return nodemailer.createTransport(transporterConfig);
};

/**
 * Envoyer un email
 * @param emailData Données de l'email (destinataire, sujet, contenu HTML)
 * @returns Promise avec le résultat de l'envoi
 */
export const sendEmail = async (emailData: EmailData) => {
  const { to, subject, html } = emailData;

  // S'assurer que le transporteur est initialisé
  const transporter = transporterConfig 
    ? nodemailer.createTransport(transporterConfig) 
    : await initTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Tiki Au Bord de l\'Eau" <contact@tikiaubordeleau.com>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé: %s', info.messageId);
    
    // Si c'est un compte Ethereal, afficher le lien de prévisualisation
    if (info.preview) {
      console.log('Email preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

/**
 * Formater les données d'un formulaire d'événement en HTML pour l'email
 * @param eventData Données du formulaire d'événement
 * @returns Contenu HTML formaté
 */
export const formatEventEmailContent = (eventData: any) => {
  // Traduire le type d'événement
  const eventTypeLabels: Record<string, string> = {
    'birthday': 'Anniversaire',
    'wedding': 'Mariage',
    'christening': 'Baptême',
    'communion': 'Communion',
    'corporate': 'Événement d\'entreprise',
    'other': 'Autre événement',
  };

  // Formatage de la date pour l'affichage
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #8B4513; border-bottom: 2px solid #C4B5A2; padding-bottom: 10px;">
        Nouvelle demande d'événement - Tiki Au Bord de l'Eau
      </h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 8px; font-weight: bold; width: 200px;">Nom :</td>
          <td style="padding: 8px;">${eventData.customerName}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 8px; font-weight: bold;">Email :</td>
          <td style="padding: 8px;">${eventData.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Téléphone :</td>
          <td style="padding: 8px;">${eventData.customerPhone}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 8px; font-weight: bold;">Type d'événement :</td>
          <td style="padding: 8px;">${eventTypeLabels[eventData.eventType] || eventData.eventType}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Date souhaitée :</td>
          <td style="padding: 8px;">${formatDate(eventData.eventDate)}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 8px; font-weight: bold;">Nombre d'invités :</td>
          <td style="padding: 8px;">${eventData.guestCount}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Demandes spéciales :</td>
          <td style="padding: 8px;">${eventData.specialRequests || 'Aucune demande spéciale'}</td>
        </tr>
      </table>
      
      <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <p style="margin: 0; font-style: italic;">
          Ce message a été envoyé depuis le formulaire de demande d'événement sur le site Tiki Au Bord de l'Eau.
        </p>
      </div>
    </div>
  `;
};

// Initialiser le transporteur au chargement du module
initTransporter();

export default { sendEmail, formatEventEmailContent }; 