/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: FullPageLayout
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Layout de página completa sin Header.
 * Se usa para: Detalles de receta, Crear receta, Editar receta, etc.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function FullPageLayout() {
  return (
    <Outlet />
  );
}
