import React, { useEffect } from 'react';

export default function TripAdvisorReviews() {
  useEffect(() => {
    // Charger le script TripAdvisor
    const script = document.createElement('script');
    script.src = 'https://www.jscache.com/wejs?wtype=selfserveprop&uniq=796&locationId=YOUR_LOCATION_ID&lang=fr&rating=true&nreviews=5&writereviewlink=true&popIdx=true&iswide=false&border=true&display_version=2';
    script.async = true;
    document.body.appendChild(script);

    // Créer le conteneur pour le widget si nécessaire
    if (!document.getElementById('TA_selfserveprop')) {
      const div = document.createElement('div');
      div.id = 'TA_selfserveprop';
      div.className = 'TA_selfserveprop';
      document.getElementById('tripadvisor-widget-container')?.appendChild(div);
    }

    return () => {
      // Nettoyer le script lors du démontage du composant
      document.body.removeChild(script);
      const widgetContainer = document.getElementById('TA_selfserveprop');
      if (widgetContainer) {
        widgetContainer.remove();
      }
    };
  }, []);

  return (
    <div id="tripadvisor-widget-container" className="w-full">
      <div id="TA_selfserveprop" className="TA_selfserveprop">
        <div className="text-center text-sm text-gray-400">
          Chargement des avis TripAdvisor...
        </div>
      </div>
    </div>
  );
} 