import React from 'react';
import './ServicesCard.css';

const ServicesCard = ({ 
  imagen,
  nombre,
  consumoPorMinuto,
  id,
  onClick
}) => {

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="ingredient-card" onClick={handleClick}>
      {/* Imagen del ingrediente */}
      <div className="ingredient-card__image-container">
        {imagen ? (
          <img src={imagen} alt={nombre} className="ingredient-card__image" />
        ) : (
          <div className="ingredient-card__image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="ingredient-card__content">
        <h3 className="ingredient-card__title">{nombre}</h3>


        {/* Precio por unidad */}
        <div className="ingredient-card__row ingredient-card__row--unidad">
          <div className="ingredient-card__label">Consumo x minuto</div>
          <div className="ingredient-card__value">
            $ {consumoPorMinuto || '0'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesCard;