# Système de Notifications pour Tiki Restaurant

Ce module gère l'envoi de notifications par email (via EmailJS) et par SMS (via Twilio) pour différentes actions dans l'application du restaurant Tiki.

## Configuration Requise

### Variables d'Environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Twilio (pour les SMS)
TWILIO_ACCOUNT_SID=votre_sid
TWILIO_AUTH_TOKEN=votre_token
TWILIO_PHONE_NUMBER=votre_numero_twilio

# EmailJS (pour les emails)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_cle_publique
NEXT_PUBLIC_EMAILJS_SERVICE_ID=votre_service_id
NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID=id_template_client
NEXT_PUBLIC_EMAILJS_SEAFOOD_ADMIN_TEMPLATE_ID=id_template_admin_fruits_de_mer
NEXT_PUBLIC_EMAILJS_EVENT_ADMIN_TEMPLATE_ID=id_template_admin_evenement
NEXT_PUBLIC_EMAILJS_CONTACT_ADMIN_TEMPLATE_ID=id_template_admin_contact
```

### Configuration EmailJS

1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Créez un service (Gmail, Outlook, etc.)
3. Créez des templates pour:
   - Notifications clients
   - Notifications admin pour commandes de fruits de mer
   - Notifications admin pour demandes d'événements
   - Notifications admin pour formulaires de contact

### Configuration Twilio

1. Créez un compte sur [Twilio](https://www.twilio.com/)
2. Obtenez un numéro de téléphone Twilio
3. Récupérez votre Account SID et Auth Token

## Utilisation

### Types de Notifications

Le composant gère quatre types de notifications:

1. `reservation` - Réservations de table
2. `event` - Demandes d'événements 
3. `seafood` - Commandes de fruits de mer
4. `contact` - Formulaires de contact

### Actions

Pour les réservations, événements et commandes, trois actions sont possibles:

1. `confirmation` - Confirmation d'une nouvelle réservation/commande
2. `modification` - Modification d'une réservation/commande existante 
3. `cancellation` - Annulation d'une réservation/commande

### Exemples d'Utilisation

#### Confirmation de Réservation

```jsx
import Notifications from '@/components/Notifications';

// Dans votre composant ou fonction
const confirmReservation = async (reservationData) => {
  const result = await Notifications.notify({
    type: 'reservation',
    action: 'confirmation',
    data: {
      customerName: "Jean Dupont",
      email: "client@example.com",
      phone: "+33612345678", // Format international requis pour Twilio
      date: new Date("2023-12-25T19:30:00"),
      numberOfGuests: 4,
      tableNumber: "12"
    },
    sendSMS: true,
    sendEmail: true
  });
  
  console.log("Résultat:", result); // { sms: true/false, email: true/false }
};
```

#### Notification de Commande de Fruits de Mer

```jsx
const confirmSeafoodOrder = async (orderData) => {
  await Notifications.notify({
    type: 'seafood',
    action: 'confirmation',
    data: {
      customerName: "Marie Martin",
      email: "client@example.com",
      phone: "+33687654321",
      pickupDate: new Date("2023-12-24T12:00:00"),
      totalAmount: 85.50,
      items: [
        { name: "Plateau de l'écailler", quantity: 1, price: 49.00 },
        { name: "Huîtres fines de claire", quantity: 12, price: 36.50 }
      ]
    }
  });
};
```

#### Formulaire de Contact (notification à l'admin uniquement)

```jsx
const submitContactForm = async (formData) => {
  await Notifications.notify({
    type: 'contact',
    data: {
      name: "Sarah Bernard",
      email: "contact@example.com",
      phone: "+33601234567",
      subject: "Demande d'informations",
      message: "Bonjour, j'aimerais des informations..."
    },
    sendSMS: false, // Pas de SMS pour le formulaire de contact
    sendEmail: true
  });
};
```

## Structure des Templates EmailJS

### Template Client

Variables disponibles:
- `customerName` - Nom du client
- `subject` - Sujet de l'email
- `message` - Message principal
- Et toutes les variables spécifiques selon le type (par ex: `itemsList` pour les commandes)

### Template Admin Fruits de Mer

Variables disponibles:
- `customerName` - Nom du client
- `customerPhone` - Téléphone du client
- `customerEmail` - Email du client
- `pickupDate` - Date et heure de retrait
- `totalAmount` - Montant total
- `itemsList` - Liste des articles commandés

### Template Admin Événement

Variables disponibles:
- `customerName` - Nom du client
- `customerPhone` - Téléphone du client
- `customerEmail` - Email du client
- `eventDate` - Date de l'événement
- `eventType` - Type d'événement
- `numberOfGuests` - Nombre d'invités
- `specialRequests` - Demandes spéciales

## Notes Importantes

1. Les numéros de téléphone doivent être au format international (ex: `+33612345678`).
2. Pour les SMS, assurez-vous que votre compte Twilio est configuré correctement.
3. La fonctionnalité d'envoi d'emails ne fonctionne que côté client (pas en SSR). 