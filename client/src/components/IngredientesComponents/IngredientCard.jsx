import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IngredientCard.css';

const IngredientCard = ({ 
  imagen,
  nombre,
  cantidad,
  unidad,
  precioTotal,
  precioPorUnidad,
  id,
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/ingredientes/editar/${id}`);
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

        {/* Cantidad */}
        <div className="ingredient-card__row ingredient-card__row--cantidad">
          <div className="ingredient-card__label">
            <svg className="ingredient-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9" />
              <path d="M14 17H5" />
              <circle cx="17" cy="17" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
            Cantidad
          </div>
          <div className="ingredient-card__value">
            {cantidad || '0'} {unidad || 'unidad'}
          </div>
        </div>

        {/* Precio por unidad */}
        <div className="ingredient-card__row ingredient-card__row--unidad">
          <div className="ingredient-card__label">Precio x Unidad</div>
          <div className="ingredient-card__value">
            $ {precioPorUnidad || '0'}
          </div>
        </div>

        {/* Precio total */}
        <div className="ingredient-card__row ingredient-card__row--total">
          <div className="ingredient-card__label">Precio Total</div>
          <div className="ingredient-card__value">
            $ {precioTotal || '0'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;