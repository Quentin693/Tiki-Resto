"use client"

import { useState } from 'react';
import emailjs from '@emailjs/browser';

// Types for notification system
type NotificationType = 'reservation' | 'seafood' | 'event' | 'contact';
type NotificationAction = 'confirmation' | 'modification' | 'update' | 'cancellation' | 'reminder';
type EmailJSParams = Record<string, any>;

interface NotificationProps {
  type: NotificationType;
  action?: NotificationAction;
  data: any;
  sendSMS?: boolean;
  sendEmail?: boolean;
}

interface TwilioMessage {
  to: string;
  body: string;
}

const Notifications = {
  // Initialize EmailJS
  initEmailJS: () => {
    if (typeof window !== 'undefined') {
      emailjs.init(process.env.EMAILJS_PUBLIC_KEY || 'gqW9Mpq_cBBEtVQH_');
    }
  },

  // Send SMS via Twilio
  sendSMS: async (to: string, body: string): Promise<boolean> => {
    try {
      console.log(`Tentative d'envoi de SMS à ${to}`);
      
      // Formater le numéro au format international si nécessaire
      let formattedPhone = to;
      
      // Si le numéro ne commence pas par un +, on suppose que c'est un numéro français
      if (!to.startsWith('+')) {
        // Enlever les espaces et tirets
        formattedPhone = to.replace(/[\s-]/g, '');
        
        // Si le numéro commence par un 0, le remplacer par +33
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+33' + formattedPhone.substring(1);
        } else {
          // Sinon juste ajouter le +33
          formattedPhone = '+33' + formattedPhone;
        }
      }
      
      console.log(`Numéro formaté pour Twilio: ${formattedPhone}`);
      
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: formattedPhone, message: body }),
      });

      const responseText = await response.text();
      console.log(`Réponse de l'API SMS (status ${response.status}):`, responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Erreur lors du parsing de la réponse JSON:', e);
        return false;
      }

      if (!response.ok) {
        console.error('Erreur lors de l\'envoi du SMS:', result);
        return false;
      }

      return result.success;
    } catch (error) {
      console.error('Exception lors de l\'envoi du SMS:', error);
      return false;
    }
  },

  // Send Email via EmailJS
  sendEmail: async (templateId: string, templateParams: any): Promise<boolean> => {
    try {
      const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_u9tg3i7';
      
      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams
      );

      return result.status === 200;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },

  // Craft notification messages based on type and action
  getNotificationContent: (type: NotificationType, action: NotificationAction = 'confirmation', data: any): { smsBody: string, emailParams: any } => {
    let smsBody = '';
    let emailParams: any = { ...data };
    const restaurantName = "Restaurant Tiki Au bord de l'eau";
    
    switch (type) {
      case 'reservation':
        // Format date for readable display
        const date = new Date(data.date);
        
        // Ajuster explicitement la date au fuseau horaire français (UTC+2)
        const franceDate = new Date(date.getTime());
        // Si nécessaire, ajuster manuellement le fuseau horaire
        // Ceci est préférable à l'utilisation de toLocaleString car cela assure que l'heure est correcte
        // indépendamment du fuseau horaire du serveur
        
        const formattedDate = franceDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Europe/Paris' // Utiliser le fuseau horaire français
        });
        
        const formattedTime = franceDate.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Paris' // Utiliser le fuseau horaire français
        });

        switch (action) {
          case 'confirmation':
            smsBody = `Bonjour ${data.customerName}, votre réservation au ${restaurantName} est confirmée pour le ${formattedDate} à ${formattedTime} pour ${data.numberOfGuests} personne(s). Pour toute modification, veuillez nous contacter au 04 78 49 02 39. À bientôt !`;
            emailParams.subject = `Confirmation de votre réservation - ${restaurantName}`;
            break;
          case 'modification':
            smsBody = `Bonjour ${data.customerName}, votre réservation au ${restaurantName} a été modifiée avec succès. Nouvelle date: ${formattedDate} à ${formattedTime} pour ${data.numberOfGuests} personne(s). Pour toute question, veuillez nous contacter au 04 78 49 02 39.`;
            emailParams.subject = `Modification de votre réservation - ${restaurantName}`;
            break;
          case 'cancellation':
            smsBody = `Bonjour ${data.customerName}, votre réservation au ${restaurantName} pour le ${formattedDate} à ${formattedTime} a été annulée. Nous espérons vous revoir bientôt !`;
            emailParams.subject = `Annulation de votre réservation - ${restaurantName}`;
            break;
        }
        emailParams.message = smsBody;
        break;

      case 'event':
        const eventDate = new Date(data.eventDate || data.date);
        const eventFormattedDate = eventDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        
        // Assurons-nous que tous les champs sont présents dans emailParams
        emailParams.customerName = data.customerName;
        emailParams.customerEmail = data.customerEmail || data.email;
        emailParams.customerPhone = data.customerPhone || data.phone;
        emailParams.eventType = data.eventType;
        emailParams.formattedEventDate = eventFormattedDate;
        emailParams.guestCount = data.guestCount || data.numberOfGuests;
        emailParams.specialRequests = data.specialRequests || 'Aucune demande spéciale';
        
        // Création d'un récapitulatif détaillé pour l'email
        emailParams.details = `
            Type d'événement: ${data.eventType}
            Date: ${eventFormattedDate}
            Nombre d'invités: ${data.guestCount || data.numberOfGuests}
            Demandes spéciales: ${data.specialRequests || 'Aucune'}
        `;
        
        switch (action) {
          case 'confirmation':
            smsBody = `Bonjour ${data.customerName}, votre demande d'événement au ${restaurantName} pour le ${eventFormattedDate} a été confirmée. Un membre de notre équipe vous contactera pour finaliser les détails.`;
            emailParams.subject = `Confirmation de votre événement - ${restaurantName}`;
            break;
          case 'modification':
            smsBody = `Bonjour ${data.customerName}, les détails de votre événement au ${restaurantName} ont été modifiés. Un récapitulatif vous a été envoyé par email.`;
            emailParams.subject = `Modification de votre événement - ${restaurantName}`;
            break;
          case 'cancellation':
            smsBody = `Bonjour ${data.customerName}, votre événement au ${restaurantName} prévu le ${eventFormattedDate} a été annulé. Pour toute question, veuillez nous contacter.`;
            emailParams.subject = `Annulation de votre événement - ${restaurantName}`;
            break;
        }
        emailParams.message = smsBody;
        break;

      case 'seafood':
        // Traitement des plateaux
        let plateauxDetails = [];
        if (data.plateaux && Array.isArray(data.plateaux) && data.plateaux.length > 0) {
          plateauxDetails = data.plateaux.map((plateau: any) => 
            `${plateau.name} x${plateau.quantity}: ${plateau.price * plateau.quantity}€`
          );
        } else if (data.plateauxStr) {
          // Si nous avons une chaîne formatée, l'utiliser
          plateauxDetails.push(data.plateauxStr);
        } else if (data.plateaux) {
          plateauxDetails.push(data.plateaux);
        }
        
        // Traitement des produits individuels
        let itemsDetails = [];
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          itemsDetails = data.items.map((item: any) => {
            let name = item.name || '';
            if (item.half) name += ' (demi-douzaine)';
            return `${name} x${item.quantity}: ${(item.price * item.quantity).toFixed(2)}€`;
          });
        } else if (data.itemsStr) {
          // Si nous avons une chaîne formatée des items, la diviser et l'utiliser
          const items = data.itemsStr.split(', ');
          itemsDetails = items.map((item: string) => item.trim()).filter((item: string) => item !== 'Aucun');
        } else if (data.items) {
          itemsDetails.push(data.items);
        }
        
        // Calculer le prix total
        let totalPrice = data.totalPrice || data.totalAmount || 0;
        if (typeof totalPrice === 'number') {
          totalPrice = totalPrice.toFixed(2);
        }
        
        // Créer un message détaillé au format demandé
        const details = `
${plateauxDetails.length > 0 ? 'PLATEAUX:\n' + plateauxDetails.map((p: string) => `- ${p}`).join('\n') + '\n\n' : ''}
${itemsDetails.length > 0 ? 'PRODUITS INDIVIDUELS:\n' + itemsDetails.map((i: string) => `- ${i}`).join('\n') + '\n\n' : ''}
${data.specialRequests ? `DEMANDES SPÉCIALES:\n${data.specialRequests}\n\n` : ''}
MONTANT TOTAL: ${totalPrice}€
Mode: ${data.isPickup === false ? 'Sur place' : 'À emporter'}
        `.trim();
        
        console.log("Détails de la commande pour EmailJS:", details);
        
        const customerName = data.customerName || data.customer?.name || data.name || 'Client';
        
        switch (action) {
          case 'confirmation':
            smsBody = `Bonjour ${customerName}, votre commande de fruits de mer au ${restaurantName} est confirmée. À récupérer le ${data.pickupDate} à ${data.pickupTime}. Montant total: ${totalPrice}€.`;
            emailParams.subject = `Confirmation de votre commande de fruits de mer - ${restaurantName}`;
            break;
          case 'modification':
            smsBody = `Bonjour ${customerName}, votre commande de fruits de mer au ${restaurantName} a été modifiée. Nouvelle date de retrait: ${data.pickupDate} à ${data.pickupTime}. Un email récapitulatif vous a été envoyé.`;
            emailParams.subject = `Modification de votre commande de fruits de mer - ${restaurantName}`;
            break;
          case 'cancellation':
            smsBody = `Bonjour ${customerName}, votre commande de fruits de mer au ${restaurantName} a été annulée. Pour toute question, veuillez nous contacter au 04 78 49 02 39.`;
            emailParams.subject = `Annulation de votre commande de fruits de mer - ${restaurantName}`;
            break;
        }
        
        // Informations pour debug
        console.log("Données envoyées:", JSON.stringify(data, null, 2));
        
        // Paramètres pour l'email - simplifiés pour correspondre au template
        emailParams = {
          customerName: customerName,
          customerEmail: data.customerEmail || data.customer?.email || data.email || 'Non fourni',
          customerPhone: data.customerPhone || data.customer?.phone || data.phone || 'Non fourni',
          orderTime: `${data.pickupDate || 'Date non spécifiée'} à ${data.pickupTime || 'Heure non spécifiée'}`,
          details: details,
          message: smsBody,
          subject: emailParams.subject,
          
          // Ajouter des champs bruts pour faciliter le débogage et assurer que tous les champs sont disponibles
          plateaux: JSON.stringify(data.plateaux || []),
          items: JSON.stringify(data.items || []),
          totalPrice: totalPrice
        };
        break;

      case 'contact':
        // For contact forms, we don't need SMS to the customer
        smsBody = '';
        

        emailParams = {
          message: data.message,
          customerName: data.name || data.customerName,
          customerEmail: data.email || data.customerEmail,
          customerPhone: data.phone || data.customerPhone || 'Non fourni'
        };
        break;
    }

    return { smsBody, emailParams };
  },

  // Notify admin
  notifyAdmin: async (type: NotificationType, data: any): Promise<boolean> => {
    Notifications.initEmailJS();
    const adminTemplate = process.env.EMAILJS_ADMIN_TEMPLATE_ID || 'template_7hdjtxp';
    const adminEmail = process.env.ADMIN_EMAIL || 'sanchit.jain3107@gmail.com';
    
    const from_name = data.name || data.customerName || 'Client';
    
    let emailParams: EmailJSParams = {};
    let subject = '';
    
    if (type === 'seafood') {
      // Traitement des plateaux
      let plateauxDetails = [];
      if (data.plateaux && Array.isArray(data.plateaux) && data.plateaux.length > 0) {
        plateauxDetails = data.plateaux.map((plateau: any) => 
          `${plateau.name} x${plateau.quantity}: ${plateau.price * plateau.quantity}€`
        );
      } else if (data.plateauxStr) {
        // Si nous avons une chaîne formatée, l'utiliser
        plateauxDetails.push(data.plateauxStr);
      } else if (data.plateaux) {
        plateauxDetails.push(data.plateaux);
      }
      
      // Traitement des produits individuels
      let itemsDetails = [];
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        itemsDetails = data.items.map((item: any) => {
          let name = item.name || '';
          if (item.half) name += ' (demi-douzaine)';
          return `${name} x${item.quantity}: ${(item.price * item.quantity).toFixed(2)}€`;
        });
      } else if (data.itemsStr) {
        // Si nous avons une chaîne formatée des items, la diviser et l'utiliser
        const items = data.itemsStr.split(', ');
        itemsDetails = items.map((item: string) => item.trim()).filter((item: string) => item !== 'Aucun');
      } else if (data.items) {
        itemsDetails.push(data.items);
      }
      
      // Calculer le prix total
      let totalPrice = data.totalPrice || data.totalAmount || 0;
      if (typeof totalPrice === 'number') {
        totalPrice = totalPrice.toFixed(2);
      }
      
      // Créer le message détaillé pour l'admin
      const adminDetails = `
NOUVELLE COMMANDE DE FRUITS DE MER

CLIENT:
Nom: ${data.customerName || data.customer?.name || data.name || 'Non fourni'}
Email: ${data.customerEmail || data.customer?.email || data.email || 'Non fourni'}
Téléphone: ${data.customerPhone || data.customer?.phone || data.phone || 'Non fourni'}

INFORMATIONS DE RETRAIT:
Date: ${data.pickupDate || 'Non spécifiée'}
Heure: ${data.pickupTime || 'Non spécifiée'}
Mode: ${data.isPickup === false ? 'Sur place' : 'À emporter'}

${plateauxDetails.length > 0 ? 'PLATEAUX:\n' + plateauxDetails.map((p: string) => `- ${p}`).join('\n') + '\n\n' : ''}
${itemsDetails.length > 0 ? 'PRODUITS INDIVIDUELS:\n' + itemsDetails.map((i: string) => `- ${i}`).join('\n') + '\n\n' : ''}

${data.specialRequests ? `DEMANDES SPÉCIALES:\n${data.specialRequests}\n\n` : ''}

MONTANT TOTAL: ${totalPrice}€
      `.trim();
      
      subject = 'Nouvelle commande de fruits de mer';
      emailParams = {
        from_name,
        to_name: "Admin",
        from_email: data.email || data.customer?.email || 'client@example.com',
        to_email: adminEmail,
        subject,
        customerName: data.customerName || data.customer?.name || data.name || 'Client',
        customerEmail: data.customerEmail || data.customer?.email || data.email || 'Non fourni',
        customerPhone: data.customerPhone || data.customer?.phone || data.phone || 'Non fourni',
        orderTime: `${data.pickupDate || 'Date non spécifiée'} à ${data.pickupTime || 'Heure non spécifiée'}`,
        details: adminDetails,
        message: `Nouvelle commande de fruits de mer de ${from_name} pour le ${data.pickupDate || 'Date non spécifiée'} à ${data.pickupTime || 'Heure non spécifiée'}. Total: ${totalPrice}€`
      };
    } 
    else if (type === 'event') {
      // Format event date for admin notification
      const eventDate = data.eventDate ? new Date(data.eventDate) : new Date();
      const formattedEventDate = eventDate.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      // Create details summary
      const details = `
        Type d'événement: ${data.eventType || 'Non spécifié'}
        Date: ${formattedEventDate}
        Nombre d'invités: ${data.guestCount || data.numberOfGuests || 'Non spécifié'}
        Demandes spéciales: ${data.specialRequests || 'Aucune'}
      `;
      
      subject = `Nouvelle demande d'événement: ${data.eventType || 'Événement'}`;
      emailParams = {
        from_name,
        to_name: "Admin",
        from_email: data.email || data.customerEmail || 'client@example.com',
        to_email: adminEmail,
        subject,
        message: `Nouvelle demande d'événement de ${from_name}.`,
        details,
        customerName: data.customerName || data.name || 'Non fourni',
        customerEmail: data.customerEmail || data.email || 'Non fourni',
        customerPhone: data.customerPhone || data.phone || 'Non fourni',
        eventType: data.eventType || 'Non spécifié',
        formattedEventDate,
        guestCount: data.guestCount || data.numberOfGuests || 'Non spécifié',
        specialRequests: data.specialRequests || 'Aucune',
      };
    }
    else if (type === 'contact') {
      // Créer un message détaillé pour le formulaire de contact
      const completeMessage = `
        Nom: ${data.name || 'Non fourni'}
        Email: ${data.email || 'Non fourni'}
        Téléphone: ${data.phone || 'Non fourni'}
        Message: ${data.message || 'Aucun message'}
      `;
      
      subject = 'Nouveau message du formulaire de contact';
      emailParams = {
        from_name,
        to_name: "Admin",
        from_email: data.email || 'client@example.com',
        to_email: adminEmail,
        subject,
        message: completeMessage,
        details: completeMessage,
        name: data.name || 'Non fourni',
        email: data.email || 'Non fourni',
        phone: data.phone || 'Non fourni',
      };
    }
    
    return await Notifications.sendEmail(adminTemplate, emailParams);
  },

  // Main notification handler
  notify: async ({ type, action = 'confirmation', data, sendSMS = true, sendEmail = true }: NotificationProps): Promise<{ sms: boolean, email: boolean }> => {
    const result = { sms: false, email: false };
    
    // Initialize EmailJS if sending email
    if (sendEmail) {
      Notifications.initEmailJS();
    }
    
    // Get content for notification
    const { smsBody, emailParams } = Notifications.getNotificationContent(type, action, data);
    
    // Send SMS if requested and we have a phone number and message body
    if (sendSMS && data.phone && smsBody) {
      result.sms = await Notifications.sendSMS(data.phone, smsBody);
    }
    
    // Send email if requested
    if (sendEmail) {
      // Utiliser un template ID différent selon le type de notification
      let templateId = '';
      switch (type) {
        case 'contact':
          templateId = 'template_qjj36uy';
          break;
        case 'event':
          templateId = 'template_w96gc7k';
          break;
        case 'reservation':
          templateId = process.env.EMAILJS_RESERVATION_TEMPLATE_ID || 'template_w96gc7k';
          break;
        case 'seafood':
          // Utiliser le template spécifique pour les commandes de fruits de mer
          templateId = 'template_xt2walv';
          break;
        default:
          templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_w96gc7k';
      }
      
      if (templateId) {
        result.email = await Notifications.sendEmail(templateId, emailParams);
      }
      
      // For certain actions, also notify admin
      if (type === 'seafood' || type === 'event' || type === 'contact') {
        await Notifications.notifyAdmin(type, data);
      }
    }
    
    return result;
  }
};

export default Notifications;
