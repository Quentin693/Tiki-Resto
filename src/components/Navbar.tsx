"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = user?.role === 'admin' 
    ? [
      { href: '/menu', label: 'Menu' },
      { href: '/events', label: 'Évènements' },
      { href: '/gallery', label: 'Galerie' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/schedule', label: 'Emploi du Temps' },
      { href: '/calendar', label: 'Calendrier' }
    ] 
    : [
      { href: '/menu', label: 'Menu' },
      { href: '/reserver', label: 'Réserver' },
      { href: '/events', label: 'Évènements' },
      { href: '/gallery', label: 'Galerie' },
      { href: '/contact', label: 'Contact' }
    ];

  return (
    <>
      <div className="fixed w-full z-50 px-2 sm:px-4 py-3">
        {/* Background avec bordure dorée */}
        <div className="absolute inset-0 bg-[#141414]/80 backdrop-blur-md" />
        
        {/* Conteneur principal avec bordure dorée */}
        <div className={`relative w-[90%] mx-auto bg-[#2a2a2a]/90 rounded-2xl border border-[#C4B5A2]/20 shadow-xl overflow-hidden backdrop-blur-sm ${user?.role === 'admin' ? 'h-24' : 'h-20'}`}>
          <div className={`flex items-center justify-between px-4 lg:px-6 h-full`}>
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <div className={`relative transition-transform hover:scale-110 ${user?.role === 'admin' ? 'w-16 h-16' : 'w-10 sm:w-12 h-10 sm:h-12'}`}>
                <Image
                  src="/tiki.png"
                  alt="Au Tiki Logo"
                  fill
                  className="rounded-full object-cover border-2 border-[#C4B5A2]/50"
                />
              </div>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className={`flex items-center ${user?.role === 'admin' ? 'space-x-8' : 'space-x-4 xl:space-x-8'} overflow-x-auto`}>
                {navLinks.map(({ href, label }) => (
                  <NavLink 
                    key={href} 
                    href={href} 
                    active={pathname === href}
                    isAdmin={user?.role === 'admin'}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className={`text-[#C4B5A2] hidden lg:block ${user?.role === 'admin' ? 'text-lg' : 'text-sm xl:text-base'}`}>
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className={`text-[#C4B5A2] hover:text-white transition-colors hidden lg:block px-3 py-1.5 rounded-lg border border-[#C4B5A2]/20 hover:border-[#C4B5A2]/50 ${user?.role === 'admin' ? 'text-lg px-6 py-2' : 'text-sm xl:px-4 xl:py-2 xl:text-base'}`}
                  >
                    Déconnexion
                  </button>
                  <div className={`relative transition-transform hover:scale-110 ${user?.role === 'admin' ? 'w-12 h-12' : 'w-8 h-8 sm:w-10 sm:h-10'}`}>
                    <Image
                      src="/profil.png"
                      alt={user.name}
                      fill
                      className="rounded-full object-cover border-2 border-[#C4B5A2]/50"
                    />
                  </div>
                </div>
              ) : (
                <Link href="/login" className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-[#C4B5A2] hover:text-white transition-colors hidden lg:block px-3 py-1.5 text-sm xl:px-4 xl:py-2 xl:text-base rounded-lg border border-[#C4B5A2]/20 hover:border-[#C4B5A2]/50">
                    Se connecter
                  </span>
                </Link>
              )}

              {/* Burger Menu pour Mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-[#C4B5A2] hover:text-white transition-colors p-1"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <div 
          className={`
            fixed inset-0 bg-[#2a2a2a]/95 backdrop-blur-md transition-transform duration-300 lg:hidden
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-[#C4B5A2] hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X size={32} />
          </button>

          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {navLinks.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                active={pathname === href}
                onClick={() => setIsMenuOpen(false)}
                mobile
                isAdmin={user?.role === 'admin'}
              >
                {label}
              </NavLink>
            ))}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="text-xl text-[#C4B5A2] hover:text-white transition-colors"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Espace pour éviter que le contenu ne soit caché sous la navbar fixe */}
      <div className={user?.role === 'admin' ? 'h-32' : 'h-24'} />
    </>
  );
}

function NavLink({ href, children, active, mobile, onClick, isAdmin }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative px-2 py-1 font-normal transition-colors whitespace-nowrap
        ${mobile ? 'text-xl' : isAdmin ? 'text-lg' : 'text-sm xl:text-base'}
        ${active 
          ? 'text-[#C4B5A2]' 
          : 'text-white/80 hover:text-[#C4B5A2]'
        }
      `}
    >
      {children}
      <span className={`
        absolute bottom-0 left-0 w-full h-0.5 bg-[#C4B5A2] transform origin-bottom 
        transition-transform duration-300
        ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
      `} />
    </Link>
  );
}