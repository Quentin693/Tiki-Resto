import { Menu, X, Instagram, Facebook, Clock, MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#1a1a1a] border-t border-#C4B5A2 z-50">
        <div className="container mx-auto px-4 py-8 sm:py-12">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Suivez-nous</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="https://www.instagram.com/tiki_aubordeleau/" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-[#C4B5A2] hover:text-[#A69783] transition-colors duration-300">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/pierre.muguet.33" 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-[#C4B5A2] hover:text-[#A69783] transition-colors duration-300">
                  <Facebook size={20} />
                </a>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Horaires</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-start justify-center">
                  <Clock className="w-4 h-4 mr-2 text-[#C4B5A2] mt-1 flex-shrink-0" />
                  <div className="text-white text-sm sm:text-base">
                    <p>Mar - Dim: 12h00 - 14h30</p>
                    <p>Mer - Sam: 19h00 - 22h30</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Contact</h3>
              <div className="flex items-center justify-center md:justify-end mb-2">
                <MapPin className="w-4 h-4 mr-2 text-[#C4B5A2] flex-shrink-0" />
                <p className="text-white text-sm sm:text-base">Chemin du Pontet, Decines</p>
              </div>
              <div className="flex items-center justify-center md:justify-end mb-2">
                <Phone className="w-4 h-4 mr-2 text-[#C4B5A2] flex-shrink-0" />
                <p className="text-white text-sm sm:text-base">04 78 49 02 39</p>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <Mail className="w-4 h-4 mr-2 text-[#C4B5A2] flex-shrink-0" />
                <a href="mailto:contact@tikilyon.fr" 
                   className="text-white text-sm sm:text-base hover:text-[#C4B5A2] transition-colors duration-300">
                  contact@tikilyon.fr
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-#C4B5A2">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              {/* Liens légaux en tableau 2x2 */}
              <div className="mb-4 sm:mb-0">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <Link 
                    href="/mentions-legales" 
                    className="text-gray-400 hover:text-[#C4B5A2] text-xs sm:text-sm transition-colors duration-300"
                    prefetch={false}
                    passHref
                  >
                    Mentions légales
                  </Link>
                  <Link 
                    href="/politique-confidentialite" 
                    className="text-gray-400 hover:text-[#C4B5A2] text-xs sm:text-sm transition-colors duration-300"
                    prefetch={false}
                    passHref
                  >
                    Politique de confidentialité
                  </Link>
                  <Link 
                    href="/cookies" 
                    className="text-gray-400 hover:text-[#C4B5A2] text-xs sm:text-sm transition-colors duration-300"
                    prefetch={false}
                    passHref
                  >
                    Gestion des cookies
                  </Link>
                  <Link 
                    href="/conditions-utilisation" 
                    className="text-gray-400 hover:text-[#C4B5A2] text-xs sm:text-sm transition-colors duration-300"
                    prefetch={false}
                    passHref
                  >
                    CGU
                  </Link>
                </div>
              </div>

              {/* Copyright centré */}
              <p className="text-gray-400 text-xs sm:text-sm text-center mb-4 sm:mb-0">
                © {new Date().getFullYear()} Restaurant Tiki Au bord de l'eau. Tous droits réservés.
              </p>

              {/* Logo à droite */}
              <div className="flex items-center gap-3">
                <Link href="/" className="relative w-16 h-16">
                  <Image
                    src="/logos/TikiLogo.png"
                    alt="Tiki Logo"
                    fill
                    className="object-contain"
                  />
                </Link>
                <span className="text-[#C4B5A2] font-didot text-2xl">TIKI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }