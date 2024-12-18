import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Restaurant Au Tiki',
  description: 'Bienvenue au restaurant Au Tiki',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}