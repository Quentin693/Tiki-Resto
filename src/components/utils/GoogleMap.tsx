import React from "react";
import { MapPin, Anchor, Palmtree } from "lucide-react";

type GoogleMapProps = {
  mapEmbedUrl?: string;
  locationName?: string;
  decorative?: boolean;
  height?: string | number;
  showBorder?: boolean;
  filterStyle?: React.CSSProperties;
};

const GoogleMap: React.FC<GoogleMapProps> = ({
  mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2782.6075252015074!2d4.9783531762406425!3d45.77919567900309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f4c76abb734dcd%3A0x43c9f1c968fba11b!2sTIKI%20au%20bord%20de%20l&#39;eau!5e0!3m2!1sfr!2sfr!4v1716290171633!5m2!1sfr!2sfr&maptype=hybrid",
  locationName = "TIKI au bord de l'eau",
  decorative = true,
  height = {mobile: "250px", tablet: "350px", desktop: "400px"},
  showBorder = true,
  filterStyle = { filter: 'saturate(1.5) hue-rotate(10deg) brightness(0.95)' }
}) => {
  return (
    <div className="bg-gray-800 relative" style={{ 
      height: typeof height === 'object' 
        ? 'var(--map-height)' 
        : height,
      ['--map-height' as any]: typeof height === 'object' 
        ? `clamp(${height.mobile}, 50vw, ${height.desktop})` 
        : height
    }}>
      <iframe
        src={mapEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, ...filterStyle }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      
      {showBorder && (
        <div className="absolute inset-0 pointer-events-none border-[4px] sm:border-[6px] md:border-[8px] border-[#C4B5A2]/40 rounded-lg"></div>
      )}
      
      {decorative && (
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 flex space-x-1 sm:space-x-2">
          <div className="bg-[#C4B5A2]/80 p-1.5 sm:p-2 rounded-full">
            <Palmtree className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a1a1a]" />
          </div>
          <div className="bg-[#C4B5A2]/80 p-1.5 sm:p-2 rounded-full">
            <Anchor className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a1a1a]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap; 