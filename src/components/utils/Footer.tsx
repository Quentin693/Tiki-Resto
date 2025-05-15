"use client"

import { Menu, X, Instagram, Facebook, Clock, MapPin, Phone, Mail, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    
    return (
        <footer className="bg-[#1a1a1a] border-t border-#C4B5A2 mt-auto w-full z-[-1]">
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
                    <p>Lun - Dim: 12h00 - 14h30</p>
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
            <div className="flex flex-col md:flex-row">
              {/* Liens légaux à gauche uniquement */}
              <div className="w-full md:w-1/3">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <a 
                    href="/mentions-legales" 
                    className="text-gray-400 hover:text-[#C4B5A2] text-xs sm:text-sm transition-colors duration-300"
                  >
                    Mentions légales
                  </a>
                  <a 
                    href="/politique-confidentialite" 
                    className="text-gray-400 hover:text-[#C4B5A2] text-xs sm:text-sm transition-colors duration-300"
                  >
                    Politique de confidentialité
                  </a>
                  <a 
                    href="/cookies" 
                    className="text-gray-400 hover:text-[#C4B5A2] text-xs sm:text-sm transition-colors duration-300"
                  >
                    Gestion des cookies
                  </a>
                  <a 
                    href="/conditions-utilisation" 
                    className="text-gray-400 hover:text-[#C4B5A2] text-xs sm:text-sm transition-colors duration-300"
                  >
                    CGU
                  </a>
                </div>
              </div>

              {/* Partie centrale avec copyright uniquement */}
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center mt-6 md:mt-0">
                {/* Copyright centré */}
                <p className="text-gray-400 text-xs sm:text-sm text-center">
                  © {new Date().getFullYear()} Restaurant Tiki Au bord de l'eau. Tous droits réservés.
                </p>
              </div>
              
              {/* Logo à droite */}
              <div className="w-full md:w-1/3 flex justify-end items-center">
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
            
            {/* Made with love credit - bien centré */}
            <div className="flex justify-center items-center mt-6 text-xs text-gray-400">
              <span className="flex items-center">
                Made with
                <Heart className="h-4 w-4 mx-1 text-white inline" fill="white" />
                by Quentin Cialone, Développeur Web et Responsable au Tiki
              </span>
            </div>
          </div>
        </div>
      </footer>
    )
  }