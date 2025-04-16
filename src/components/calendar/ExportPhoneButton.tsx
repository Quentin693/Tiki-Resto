import { Download } from 'lucide-react';
import { Reservation } from '@/types/reservation';

interface ExportPhoneButtonProps {
  reservations: Reservation[];
}

export default function ExportPhoneButton({ reservations }: ExportPhoneButtonProps) {
  const handleExport = () => {
    // Récupérer tous les numéros de téléphone uniques en supprimant les espaces
    const uniquePhones = [...new Set(reservations.map(r => r.customerPhone.replace(/\s+/g, '')))];
    
    // Créer le contenu du fichier
    const content = uniquePhones.join('\n');
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Configurer le lien
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    link.href = url;
    link.download = `Numéros de téléphone Au Tiki, ${month} ${year}.txt`;
    
    // Simuler le clic et nettoyer
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-[#C4B5A2] text-black px-4 py-2 rounded-md hover:bg-[#a39482] transition-colors"
    >
      <Download size={20} />
      Exporter les numéros de téléphone
    </button>
  );
} 