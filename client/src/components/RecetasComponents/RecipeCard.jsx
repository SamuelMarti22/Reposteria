import React from 'react';
import './RecipeCard.css';

const RecipeCard = ({ 
  imagen,
  nombre,
  precioVenta,
  costoProduccion,
  ganancia,
  porcentajeGanancia,
  onClick
}) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      {/* Imagen de la receta */}
      <div className="recipe-card__image-container">
        {imagen ? (
          <img src={imagen} alt={nombre} className="recipe-card__image" />
        ) : (
          <div className="recipe-card__image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        
        {/* Badge de porcentaje */}
        {porcentajeGanancia && (
          <div className="recipe-card__badge">
            <svg className="recipe-card__badge-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            {porcentajeGanancia}%
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="recipe-card__content">
        <h3 className="recipe-card__title">{nombre}</h3>

        {/* Precio de venta */}
        <div className="recipe-card__row recipe-card__row--venta">
          <div className="recipe-card__label">
            <svg className="recipe-card__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
            Precio Venta
          </div>
          <div className="recipe-card__value">
            {precioVenta || '$0'}
          </div>
        </div>

        {/* Costo de producción */}
        <div className="recipe-card__row recipe-card__row--costo">
          <div className="recipe-card__label">Costo Producción</div>
          <div className="recipe-card__value">
            {costoProduccion || '$0'}
          </div>
        </div>

        {/* Ganancia */}
        <div className="recipe-card__row recipe-card__row--ganancia">
          <div className="recipe-card__label">Ganancia</div>
          <div className="recipe-card__value">
            {ganancia || '$0'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;