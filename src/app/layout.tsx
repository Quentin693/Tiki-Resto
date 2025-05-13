import { Inter, Allura } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from '@/components/utils/Navbar'
import Footer from '@/components/utils/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

const allura = Allura({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-allura',
})

const pacifico = localFont({ 
  src: './fonts/Pacifico-Regular.ttf',
  variable: '--font-pacifico',
})

const dynapuff = localFont({
  src: './fonts/DynaPuff-Regular.ttf',
  variable: '--font-dynapuff',
})

const didot = localFont({
  src: './fonts/Didot Font Family/Didot Title.otf',
  variable: '--font-didot',
})

export const metadata = {
  title: 'Tiki Au bord de l\'eau',
  description: 'Bienvenue au restaurant Au Tiki',
  icons: {
    icon: '/logos/TikiLogo.png',
    apple: '/logos/TikiLogo.png',
    shortcut: '/logos/TikiLogo.png'
  },
  openGraph: {
    images: [{
      url: '/logos/TikiLogo.png',
      width: 1200,
      height: 630,
      alt: 'Tiki Au bord de l\'eau',
    }],
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Tiki Au bord de l\'eau',
  },
  twitter: {
    card: 'summary_large_image',
    images: [{
      url: '/logos/TikiLogo.png',
      alt: 'Tiki Au bord de l\'eau',
    }],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${pacifico.variable} ${dynapuff.variable} ${allura.variable} ${didot.variable} bg-[#0f0f0f]`}>
        <AuthProvider>
          <Toaster />
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}