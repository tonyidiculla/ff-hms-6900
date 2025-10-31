import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/FurfieldSidebar'
import { Header } from '@/components/layout/Header'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'
import { AuthProvider } from '@/context/AuthContext'
import { hmsNavigation } from '@/config/navigation'

export const metadata: Metadata = {
  title: 'FURFIELD HMS - Hospital Management System & Module Hub',
  description: 'Comprehensive Veterinary Hospital Management System - Entry point to all Furfield modules',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-foreground relative" suppressHydrationWarning={true}>
        {/* Standard Furfield gradient background */}
        <div className="fixed inset-0 bg-linear-to-br from-[#bae6fd] via-white to-[#d7f9e9] -z-10" />
        <div className="fixed inset-0 bg-linear-to-tr from-[#fecaca]/25 to-[#fef9c3]/25 -z-10" />
        
        <AuthProvider>
          <ReactQueryProvider>
            <div className="flex flex-col min-h-screen">
              {/* Full-width Header */}
              <Header />
              
              {/* Sidebar and Content below Header */}
              <div className="flex flex-1">
                <Sidebar navigation={hmsNavigation} />
                <main className="flex-1 overflow-hidden relative flex flex-col">
                  {children}
                </main>
              </div>
            </div>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}