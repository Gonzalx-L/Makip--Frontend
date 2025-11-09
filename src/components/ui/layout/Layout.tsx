import React from 'react';
import NavBar from '../navigation/NavBar';
import { Footer } from '../navigation/Footer';
import WhatsAppButton from '../WhatsAppButton';
import { FloatingCartIcon } from '../../features/cart/FloatingCartIcon';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton 
        phoneNumber="51923119167" // Cambia este número por el tuyo
        position="right"
      />
      <FloatingCartIcon />
    </div>
  );
};

export default Layout;