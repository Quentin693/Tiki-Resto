"use client"

import { useState } from 'react';
import Notifications from './Notifications';

export default function NotificationsExample() {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ sms: boolean; email: boolean } | null>(null);

  // Example of sending a reservation confirmation
  const sendReservationConfirmation = async () => {
    setIsSending(true);
    try {
      const reservationData = {
        customerName: "Jean Dupont",
        email: "jean.dupont@example.com",
        phone: "+33612345678", // Format international requis pour Twilio
        date: new Date("2023-12-25T19:30:00"),
        numberOfGuests: 4,
        tableNumber: "12"
      };

      const result = await Notifications.notify({
        type: 'reservation',
        action: 'confirmation',
        data: reservationData,
        sendSMS: true,
        sendEmail: true
      });

      setResult(result);
      console.log("Notification result:", result);
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Example of sending a seafood order confirmation
  const sendSeafoodOrderConfirmation = async () => {
    setIsSending(true);
    try {
      const orderData = {
        customerName: "Marie Martin",
        email: "marie.martin@example.com",
        phone: "+33687654321",
        pickupDate: new Date("2023-12-24T12:00:00"),
        totalAmount: 85.50,
        items: [
          { name: "Plateau de l'écailler", quantity: 1, price: 49.00 },
          { name: "Huîtres fines de claire", quantity: 12, price: 36.50 }
        ]
      };

      const result = await Notifications.notify({
        type: 'seafood',
        action: 'confirmation',
        data: orderData,
        sendSMS: true,
        sendEmail: true
      });

      setResult(result);
      console.log("Notification result:", result);
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Example of sending a contact form submission
  const sendContactNotification = async () => {
    setIsSending(true);
    try {
      const contactData = {
        name: "Sarah Bernard",
        email: "sarah.bernard@example.com",
        phone: "+33601234567",
        subject: "Demande d'informations",
        message: "Bonjour, j'aimerais savoir si vous pouvez accueillir un groupe de 15 personnes pour un anniversaire le mois prochain. Cordialement, Sarah."
      };

      const result = await Notifications.notify({
        type: 'contact',
        data: contactData,
        sendSMS: false, // Usually no SMS for contact forms
        sendEmail: true
      });

      setResult(result);
      console.log("Notification result:", result);
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Exemples de notifications</h2>
      
      <div className="space-y-4">
        <button
          onClick={sendReservationConfirmation}
          disabled={isSending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSending ? "Envoi en cours..." : "Envoyer confirmation de réservation"}
        </button>
        
        <button
          onClick={sendSeafoodOrderConfirmation}
          disabled={isSending}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {isSending ? "Envoi en cours..." : "Envoyer confirmation de commande de fruits de mer"}
        </button>
        
        <button
          onClick={sendContactNotification}
          disabled={isSending}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300"
        >
          {isSending ? "Envoi en cours..." : "Envoyer notification de formulaire de contact"}
        </button>
      </div>
      
      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Résultat :</h3>
          <p>SMS : {result.sms ? "✅ Envoyé" : "❌ Échec"}</p>
          <p>Email : {result.email ? "✅ Envoyé" : "❌ Échec"}</p>
        </div>
      )}
    </div>
  );
} 