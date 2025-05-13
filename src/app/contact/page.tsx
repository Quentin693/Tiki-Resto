"use client";

import React, { useRef, useState } from "react";
import { Phone, Mail, Clock, MapPin, Send, CheckCircle, X, Anchor, Palmtree } from "lucide-react";
import Image from "next/image";
import Notifications from "@/components/Notifications";

// Type definitions to fix linter errors
type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

type ContactInfoProps = {
  icon: React.ReactNode;
  title: string;
  info: React.ReactNode;
}

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

type TextAreaProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

type SubmitButtonProps = {
  submitted: boolean;
}

// Composant GoogleMap
const GoogleMap = () => (
  <div className="h-[400px] bg-gray-800 relative">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.6075252015074!2d4.9783531762406425!3d45.77919567900309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4c76abb734dcd%3A0x43c9f1c968fba11b!2sTIKI%20au%20bord%20de%20l&#39;eau!5e0!3m2!1sfr!2sfr!4v1716290171633!5m2!1sfr!2sfr&maptype=hybrid"
      width="100%"
      height="100%"
      style={{ border: 0, filter: 'saturate(1.5) hue-rotate(10deg) brightness(0.95)' }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
    <div className="absolute inset-0 pointer-events-none border-[8px] border-[#C4B5A2]/40 rounded-lg"></div>
    <div className="absolute bottom-4 left-4 flex space-x-2">
      <div className="bg-[#C4B5A2]/80 p-2 rounded-full">
        <Palmtree className="w-5 h-5 text-[#1a1a1a]" />
      </div>
      <div className="bg-[#C4B5A2]/80 p-2 rounded-full">
        <Anchor className="w-5 h-5 text-[#1a1a1a]" />
      </div>
    </div>
  </div>
);

// Composant Toast
const Toast = ({ message, type, onClose }: ToastProps) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`}>
    {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
    <p>{message}</p>
    <button onClick={onClose} className="ml-4">
      <X className="w-4 h-4" />
    </button>
  </div>
);

// Composant Info Contact
const ContactInfo = ({ icon, title, info }: ContactInfoProps) => (
  <div className="flex items-start gap-4">
    <div className="p-2 rounded-full border border-[#C4B5A2]">{icon}</div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-gray-400">{info}</p>
    </div>
  </div>
);

// Composant Champ de texte
const TextField = ({ id, name, label, value, onChange, placeholder, type = "text" }: TextFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 text-white focus:outline-none focus:border-[#C4B5A2] transition-colors"
      placeholder={placeholder}
    />
  </div>
);

// Composant Zone de texte
const TextArea = ({ id, name, label, value, onChange }: TextAreaProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required
      rows={6}
      className="w-full px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#C4B5A2]/30 text-white focus:outline-none focus:border-[#C4B5A2] transition-colors"
      placeholder="Votre message..."
    />
  </div>
);

// Composant Bouton d'envoi
const SubmitButton = ({ submitted }: SubmitButtonProps) => (
  <button
    type="submit"
    className="w-full bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    disabled={submitted}
  >
    {submitted ? (
      <>
        <CheckCircle className="w-5 h-5" />
        Envoyé
      </>
    ) : (
      <>
        <Send className="w-5 h-5" />
        Envoyer
      </>
    )}
  </button>
);

// Composant principal
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Message depuis le site web",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitted(true);
    
    try {
      // Utiliser le système de notifications
      await Notifications.notify({
        type: 'contact',
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.subject,
          message: formData.message
        },
        sendSMS: false, // Pas de SMS pour les formulaires de contact
        sendEmail: true
      });
      
      // Toujours afficher un succès car le mail est bien envoyé
      showToast("Message envoyé avec succès !", "success");
      setFormData({ 
        name: "", 
        email: "", 
        phone: "", 
        subject: "Message depuis le site web", 
        message: "" 
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      showToast("Une erreur s'est produite. Veuillez réessayer.", "error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white relative">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Background de base sombre */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Contenu principal */}
      <main className="flex-grow relative">
        <div className="relative h-full">
          {/* Conteneur des feuilles et du contenu central */}
          <div className="absolute inset-0 flex">
            {/* Feuilles gauches */}
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            {/* Zone centrale */}
            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

            {/* Feuilles droites */}
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          {/* Zone de contenu superposée */}
          <div className="relative max-w-6xl mt-40 mx-auto px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-didot-bold mb-4">Contactez-nous</h1>
              <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-4"></div>
              <p className="text-gray-300">Nous sommes à votre écoute</p>
            </div>

            {/* Grille principale */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Colonne de gauche */}
              <div className="space-y-8">
                <div className="bg-[#2a2a2a]/90 rounded-xl shadow-lg overflow-hidden border border-[#C4B5A2]/20">
                  <GoogleMap />
                </div>

                <div className="bg-[#2a2a2a]/90 rounded-xl p-8 space-y-6 border border-[#C4B5A2]/20 shadow-xl">
                  <ContactInfo
                    icon={<Phone />}
                    title="Téléphone"
                    info="04 78 49 02 39"
                  />
                  <ContactInfo
                    icon={<Mail />}
                    title="Email"
                    info="contact@tikilyon.fr"
                  />
                  <ContactInfo
                    icon={<MapPin />}
                    title="Adresse"
                    info={<span>TIKI au bord de l'eau, Chem. du Pontet, 69150 Décines-Charpieu</span>}
                  />
                  <ContactInfo
                    icon={<Clock />}
                    title="Horaires"
                    info="Lundi - Dimanche : 12h - 14h30 | Jeudi - Samedi : 19h - 22h30"
                  />
                </div>
              </div>

              {/* Colonne de droite - Formulaire */}
              <div className="bg-[#2a2a2a]/90 rounded-xl p-8 border border-[#C4B5A2]/20 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <TextField
                    id="name"
                    name="name"
                    label="Nom complet"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                  />
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    type="email"
                  />
                  <TextField
                    id="phone"
                    name="phone"
                    label="Téléphone (optionnel)"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+33612345678"
                    type="tel"
                  />
                  <TextField
                    id="subject"
                    name="subject"
                    label="Sujet"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Objet de votre message"
                  />
                  <TextArea
                    id="message"
                    name="message"
                    label="Message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                  <SubmitButton submitted={submitted} />
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}