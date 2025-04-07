import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/utils/Navbar'
import Footer from '@/components/utils/Footer'
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster position="top-right" />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}