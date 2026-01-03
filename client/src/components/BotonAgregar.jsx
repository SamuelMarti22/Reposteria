import React from 'react';
import './BotonAgregar.css';

const BotonAgregar = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon,
  disabled = false,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__text">{children}</span>
    </button>
  );
};

export default BotonAgregar;