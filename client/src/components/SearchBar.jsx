/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: SearchBar
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📋 DESCRIPCIÓN:
 * Barra de búsqueda reutilizable con funcionalidad de búsqueda en tiempo real
 *  y diseño responsive.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 💡 MODO DE USO:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * USAR EN TU COMPONENTE:
 * ```jsx
 * function MiComponente() {
 *   // Función que se ejecuta cada vez que el usuario escribe
 *   const handleSearch = (searchValue) => {
 *     console.log('Búsqueda:', searchValue);
 *     // Aquí puedes filtrar tus datos, hacer una petición a la API, etc.
 *   };
 * 
 *   return (
 *     <div>
 *       <SearchBar 
 *         placeholder="Buscar ingredientes..." 
 *         onSearch={handleSearch}
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 📦 PROPS (Parámetros):
 * ═══════════════════════════════════════════════════════════════════════════
 * @param {string} placeholder - Texto que se muestra cuando el input está vacío
 *                                (Opcional, por defecto: "Buscar...")
 * @param {function} onSearch  - Función callback que recibe el término de búsqueda
 *                                Se ejecuta cada vez que el usuario escribe
 *                                (Opcional, pero recomendado para tener funcionalidad)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ placeholder = "Buscar...", onSearch }) => {
  // ═══════════════════════════════════════════════════════════════════════
  // 🔧 STATE: Maneja el valor actual del input de búsqueda
  // ═══════════════════════════════════════════════════════════════════════
  const [searchTerm, setSearchTerm] = useState('');

  // ═══════════════════════════════════════════════════════════════════════
  // 📝 FUNCIÓN: handleChange
  // ═══════════════════════════════════════════════════════════════════════
  // Se ejecuta cada vez que el usuario escribe en el input
  // Actualiza el state local y notifica al componente padre
  // ═══════════════════════════════════════════════════════════════════════
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Llamar al callback del componente padre si fue proporcionado
    if (onSearch) {
      onSearch(value);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 🧹 FUNCIÓN: handleClear
  // ═══════════════════════════════════════════════════════════════════════
  // Se ejecuta cuando el usuario hace clic en el botón X
  // Limpia el input y notifica al componente padre con string vacío
  // ═══════════════════════════════════════════════════════════════════════
  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ✅ FUNCIÓN: handleSubmit
  // ═══════════════════════════════════════════════════════════════════════
  // Se ejecuta cuando el usuario presiona Enter en el input
  // Previene el comportamiento por defecto del formulario (recargar página)
  // y ejecuta la búsqueda con el término actual
  // ═══════════════════════════════════════════════════════════════════════
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 🎨 RENDER: Estructura del componente
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__container">
        {/* Icono de lupa (búsqueda) */}
        <svg 
          className="search-bar__icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
        
        {/* Input principal de búsqueda */}
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        
        {/* Botón X para limpiar (solo visible cuando hay texto) */}
        {searchTerm && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;