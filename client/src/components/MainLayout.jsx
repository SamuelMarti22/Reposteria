/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: MainLayout
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Layout principal que incluye el Header de navegación.
 * Se usa para las páginas principales: Recetas, Ingredientes, Servicios
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function MainLayout({ activeSection, setActiveSection }) {
  return (
    <>
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}
