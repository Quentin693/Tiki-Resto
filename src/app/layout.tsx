import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from '@/components/utils/Navbar'
import Footer from '@/components/utils/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })
const pacifico = localFont({ 
  src: './fonts/Pacifico-Regular.ttf',
  variable: '--font-pacifico',
})

const dynapuff = localFont({
  src: './fonts/Dynapuff-Regular.ttf',
  variable: '--font-dynapuff',
})

export const metadata = {
  title: 'Restaurant Au Tiki',
  description: 'Bienvenue au restaurant Au Tiki',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${pacifico.variable} ${dynapuff.variable}`}>
        <AuthProvider>
          <Toaster />
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}