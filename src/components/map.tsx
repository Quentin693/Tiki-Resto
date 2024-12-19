"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet-routing-machine'
import { Navigation } from 'lucide-react'

// Position du restaurant
const RESTAURANT_POSITION = [45.7769682,4.981032]

export default function CustomMap() {
  const [routing, setRouting] = useState(null)
  const [map, setMap] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  // Corriger les icônes Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'marker-icon-2x.png',
      iconUrl: '/icons/pointer.png',
      shadowUrl: 'marker-shadow.png',
    })
  }, [])

  // Gérer la navigation
  const handleNavigation = () => {
    // Ouvrir l'application de navigation par défaut
    const url = `https://www.google.com/maps/dir/?api=1&destination=${RESTAURANT_POSITION[0]},${RESTAURANT_POSITION[1]}`
    window.open(url, '_blank')
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Itinéraire</h2>
        <div className="text-gray-300 mb-4">
          <p>Notre adresse :</p>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${RESTAURANT_POSITION[0]},${RESTAURANT_POSITION[1]}`}
            className="text-[#C4B5A2] hover:text-white transition-colors text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chemin du Pontet, 69150 Décines-Charpieu
          </a>
        </div>
      </div>

      <div className="relative">
        {/* Conteneur de la carte avec contrôles de zoom */}
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
          <MapContainer
            center={RESTAURANT_POSITION}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenCreated={setMap}
            zoomControl={false} // Désactiver les contrôles de zoom par défaut
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={RESTAURANT_POSITION}>
              <Popup>
                Au Tiki<br />
                Chemin du Pontet, 69150 Décines-Charpieu
              </Popup>
            </Marker>
            
            {/* Contrôles de zoom personnalisés */}
            <div className="absolute left-4 top-4 z-[1000] flex flex-col space-y-2">
              <button 
                onClick={() => map.zoomIn()}
                className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded shadow hover:bg-gray-200"
              >
                +
              </button>
              <button 
                onClick={() => map.zoomOut()}
                className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded shadow hover:bg-gray-200"
              >
                -
              </button>
            </div>
          </MapContainer>
        </div>

        {/* Bouton de navigation */}
        <button
          onClick={handleNavigation}
          className="w-full mt-4 bg-[#4CAF50] hover:bg-[#45a049] text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Navigation className="w-6 h-6" />
          <span>Lancer la navigation</span>
        </button>
      </div>
    </div>
  );
}