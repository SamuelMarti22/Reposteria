import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import './Autocomplete.css';

export default function Autocomplete({ 
  items, 
  value, 
  onChange, 
  placeholder,
  displayField = "nombre",
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const wrapperRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar items cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => {
        const fieldValue = item[displayField];
        if (!fieldValue) return false;
        return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredItems(filtered);
    }
  }, [searchTerm, items, displayField]);

  // Actualizar searchTerm cuando cambia el value externo
  useEffect(() => {
    if (value && value[displayField]) {
      setSearchTerm(value[displayField]);
    } else if (value === null) {
      setSearchTerm("");
    }
  }, [value, displayField]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // Si se borra el texto, limpiar la selección
    if (newValue === "") {
      onChange(null);
    }
  };

  const handleSelectItem = (item) => {
    setSearchTerm(item[displayField]);
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div className={`autocomplete-wrapper ${className}`} ref={wrapperRef}>
      <div className="autocomplete-input-container">
        <Search className="autocomplete-icon" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="autocomplete-input"
          autoComplete="off"
        />
        <ChevronDown 
          className={`autocomplete-chevron ${isOpen ? 'autocomplete-chevron-open' : ''}`}
          size={18}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="autocomplete-dropdown">
          {filteredItems.length > 0 ? (
            <ul className="autocomplete-list">
              {filteredItems.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelectItem(item)}
                  className={`autocomplete-item ${
                    value && value._id === item._id ? 'autocomplete-item-selected' : ''
                  }`}
                >
                  <div className="autocomplete-item-content">
                    <span className="autocomplete-item-name">{item[displayField]}</span>
                    {item.precioPorUnidad && (
                      <span className="autocomplete-item-price">
                        ${item.precioPorUnidad.toLocaleString()}/{item.unidad}
                      </span>
                    )}
                    {item.consumoPorMinuto && (
                      <span className="autocomplete-item-price">
                        ${item.consumoPorMinuto.toLocaleString()}/min
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="autocomplete-empty">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
