import { Menu, X, Instagram, Facebook, Clock, MapPin, Phone, Contact, Calendar1Icon } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#1a1a1a] border-t border-#C4B5A2 z-50">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white" >Suivez-nous</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="https://www.instagram.com/tiki_aubordeleau/" className="text-[#C4B5A2] hover:text-[#A69783]">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/pierre.muguet.33" className="text-[#C4B5A2] hover:text-[#A69783]">
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Horaires</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
                <Clock className="w-4 h-4 mr-2 text-[#C4B5A2]" />
                <p className="text-white text-sm sm:text-base text-center">
                  <span className="block sm:inline">Mar - Dim: 12h00 - 14h30</span>
                  <span className="hidden sm:inline"> | </span>
                  <span className="block sm:inline">Mer - Sam: 19h00 - 22h30</span>
                </p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Contact</h3>
              <div className="flex items-center justify-center md:justify-end mb-2">
                <MapPin className="w-4 h-4 mr-2 text-[#C4B5A2]" />
                <p className="text-white text-sm sm:text-base">Chemin du Pontet, Decines</p>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <Phone className="w-4 h-4 mr-2 text-[#C4B5A2]" />
                <p className="text-white text-sm sm:text-base">04 78 49 02 39</p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-#C4B5A2 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} Restaurant Tiki Au bord de l'eau. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    )
  }