// src/app/layout.tsx
import Footer from '@/components/footer';
import './globals.css';
import Navbar from '@/components/navbar';
import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
       
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
