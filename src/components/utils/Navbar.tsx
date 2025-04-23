"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#141414] z-50">
      {/* Background avec feuilles */}
      <div className="absolute inset-0 flex">
        <div className="w-[200px] sm:w-[400px] relative">
          <Image
            src="/decorations/leavesleft.webp"
            alt="Décoration gauche"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-r from-transparent to-[#141414]" />
        </div>

        <div className="flex-grow bg-[#141414]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8" />
        </div>

        <div className="w-[200px] sm:w-[400px] relative">
          <Image
            src="/decorations/leavesright.webp"
            alt="Décoration droite"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-l from-transparent to-[#141414]" />
        </div>
      </div>

      {/* Contenu du loading */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div className="relative w-60 sm:w-60 h-80 sm:h-80 mb-6 sm:mb-8 animate-bounce">
          <Image
            src="/logos/TikiLogo.png"
            alt="Tiki Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="w-36 sm:w-48 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
          <div className="h-full bg-[#C4B5A2] animate-progressBar" />
        </div>
        <p className="text-[#C4B5A2] mt-4 text-base sm:text-lg">Au revoir...</p>
      </div>
    </div>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  mobile?: boolean;
  onClick?: () => void;
  isAdmin?: boolean;
}

function NavLink({ href, children, active, mobile, onClick, isAdmin }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative px-2 py-1 font-normal transition-colors whitespace-nowrap
        ${mobile ? 'text-base sm:text-xl' : 'text-sm sm:text-lg'}
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Vérifie si on est sur la page d'accueil
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setTimeout(() => {
      router.push('/');
      setIsLoading(false);
    }, 3000);
  };
  
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isUser = user?.role?.toLowerCase() === 'user';
  
  const navLinks = isAdmin
    ? [
        { href: '/menu', label: 'Menu' },
        { href: '/events', label: 'Évènements' },
        { href: '/gallery', label: 'Galerie' },
        { href: '/equipe', label: 'Notre Equipe' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/calendar', label: 'Calendrier' }
      ]
    : isUser
      ? [
          { href: '/menu', label: 'Menu' },
          { href: '/reserver', label: 'Réserver' },
          { href: '/mes-reservations', label: 'Réservations' },
          { href: '/events', label: 'Évènements' },
          { href: '/gallery', label: 'Galerie' },
          { href: '/equipe', label: 'Notre Equipe' },
          { href: '/contact', label: 'Contact' }
        ]
      : [
        { href: '/menu', label: 'Menu' },
        { href: '/reserver', label: 'Réserver' },
        { href: '/events', label: 'Évènements' },
        { href: '/gallery', label: 'Galerie' },
        { href: '/equipe', label: 'Notre Equipe' },
        { href: '/contact', label: 'Contact' }
        ];

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className="fixed top-0 left-0 right-0 w-full z-[100]">
        {/* Conteneur principal - le seul élément visible de la navbar */}
        <div className={`
          relative w-[95%] sm:w-[90%] mx-auto h-16 sm:h-20 mt-2 z-30 
          rounded-[20px] sm:rounded-[30px] 
          border border-[#C4B5A2]/20 
          shadow-xl overflow-hidden 
          transition-all duration-500 ease-in-out
          ${scrolled ? 'bg-[#C4B5A2]/80 backdrop-blur-sm' : 'bg-[#C4B5A2]/65'}
        `}>
          <div className="flex items-center justify-between px-2 sm:px-4 lg:px-6 h-full">
            {/* Logo */}
            <Link href="/" className="relative z-50 flex items-center justify-center h-full">
              <div className={`relative transform transition-all duration-300 hover:scale-110 ${isAdmin ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-14 h-14 sm:w-16 sm:h-16'}`}>
                <Image
                  src="/logos/TikiLogo.png"
                  alt="Au Tiki Logo"
                  fill
                  className="object-contain drop-shadow-md"
                  priority
                />
              </div>
            </Link>

            {/* Logo Tiki en version mobile */}
            <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2 mt-3">
              <span className="text-white font-didot text-5xl tracking-wider drop-shadow-sm">TIKI</span>
            </div>

            {/* Navigation Desktop */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-4 sm:px-8">
              <div className={`flex items-center ${isAdmin ? 'space-x-3 xl:space-x-8' : 'space-x-4 xl:space-x-10'} overflow-x-auto`}>
                {navLinks.map(({ href, label }) => (
                  <NavLink 
                    key={href} 
                    href={href} 
                    active={pathname === href}
                    isAdmin={isAdmin}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              {user ? (
                <div className="flex items-center space-x-1 sm:space-x-4">
                  <span className={`text-[#2a2a2a] hidden lg:block font-medium ${isAdmin ? 'text-sm lg:text-lg' : 'text-xs sm:text-sm xl:text-base'}`}>
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`
                      text-white hover:text-white/90 transition-all duration-300
                      hidden lg:block px-3 py-1.5 sm:px-4 sm:py-2
                      rounded-full border bg-[#2a2a2a]/80 hover:bg-[#2a2a2a]
                      border-[#2a2a2a]/20 hover:border-[#2a2a2a]/50
                      shadow-sm hover:shadow-md
                      ${isAdmin ? 'text-sm lg:text-lg lg:px-6 lg:py-2' : 'text-xs sm:text-sm xl:px-5 xl:py-2 xl:text-base'}
                    `}
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center space-x-1 sm:space-x-4">
                  <span className={`
                    text-white hover:text-white/90 transition-all duration-300
                    hidden lg:block px-3 py-1.5 sm:px-4 sm:py-2
                    text-xs sm:text-sm xl:px-5 xl:py-2 xl:text-base
                    rounded-full border bg-[#2a2a2a]/80 hover:bg-[#2a2a2a]
                    border-[#2a2a2a]/20 hover:border-[#2a2a2a]/50
                    shadow-sm hover:shadow-md
                  `}>
                    Se connecter
                  </span>
                </Link>
              )}

              {/* Burger Menu pour Mobile */}
              <button
                className="lg:hidden text-[#e8dcc5] hover:text-[#e8dcc5] transition-colors p-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
          
          {/* Ligne décorative subtile en bas de la navbar */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e8dcc5]/40 to-transparent"></div>
        </div>

        {/* Menu Mobile */}
        <div 
          className={`
            fixed inset-0 bg-[#2a2a2a]/90 backdrop-blur-md transition-transform duration-500 ease-in-out lg:hidden z-[100]
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            {navLinks.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                active={pathname === href}
                onClick={() => setIsMenuOpen(false)}
                mobile
                isAdmin={isAdmin}
              >
                {label}
              </NavLink>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-base sm:text-xl text-[#C4B5A2] hover:text-white transition-all duration-300"
              >
                Déconnexion
              </button>
            ) : (
              <Link 
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-base sm:text-xl text-[#C4B5A2] hover:text-white transition-all duration-300"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}