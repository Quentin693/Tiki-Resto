"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed w-full z-50 bg-[#C4B5A2] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <div className="relative w-12 h-12 transition-transform hover:scale-110">
                <h1 className="sr-only text-white">Au Tiki</h1>
                <Image
                  src="/tiki.png"
                  alt="Au Tiki Logo"
                  fill
                  className="rounded-full object-cover border-2 border-white/50"
                />
              </div>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/reserver', label: 'Réserver' },
                { href: '/events', label: 'Évènements' },
                { href: '/gallery', label: 'Galerie' },
                { href: '/contact', label: 'Contact' },
                // { href: '/dashboard', label: 'Dashbard' },
                // { href: '/schedule', label: 'Emploi du Temps' },
                // { href: '/calendar', label: 'Calendrier' }

              ].map(({ href, label }) => (
                <NavLink key={href} href={href} active={pathname === href}>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Profil */}
            <Link href="/login">
              <div className="relative z-50 flex items-center space-x-4">
                <div className="relative w-10 h-10 transition-transform hover:scale-110">
                  <Image
                    src="/profil.png"
                    alt="Profile"
                    fill
                    
                    className="rounded-full object-cover border-2 border-white/50"
                    />
                </div>

                {/* Burger Menu pour Mobile */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden text-white hover:text-[#2a2a2a] transition-colors"
                  >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* Menu Mobile */}
        <div className={`
          fixed inset-0 bg-[#C4B5A2] transition-transform duration-300 md:hidden
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {[
              { href: '/reserver', label: 'Réserver' },
              { href: '/menu', label: 'Menu' },
              { href: '/contact', label: 'Contact' },
              { href: '/events', label: 'Évènements' },
              { href: '/gallery', label: 'Galerie' }
            ].map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                active={pathname === href}
                onClick={() => setIsMenuOpen(false)}
                mobile
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Espace pour éviter que le contenu ne soit caché sous la navbar fixe */}
      <div className="h-20" />
    </>
  );
}

function NavLink({ href, children, active, mobile, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative px-2 py-1 text-lg font-normal transition-colors
        ${mobile ? 'text-2xl' : 'text-base'}
        ${active 
          ? 'text-white' 
          : 'text-white/90 hover:text-white'
        }
      `}
    >
      {children}
      {/* Soulignement blanc pour le contraste avec le fond doré */}
      <span className={`
        absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-bottom 
        transition-transform duration-300
        ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
      `} />
    </Link>
  );
}