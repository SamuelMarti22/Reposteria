import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './ServiceModal.css';

const ServiceModal = ({ 
  isOpen,
  onClose,
  servicio,
  onEdit,
  onDelete,
  isCreating = false
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    consumoPorMinuto: '',
    imagen: ''
  });
  const [imagenPreview, setImagenPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (servicio) {
      setFormData({
        nombre: servicio.nombre || '',
        consumoPorMinuto: servicio.consumoPorMinuto || '',
        imagen: servicio.imagen || ''
      });
      setImagenPreview(servicio.imagen || null);
      setIsEditMode(false);
    } else if (isCreating) {
      setFormData({
        nombre: '',
        consumoPorMinuto: '',
        imagen: ''
      });
      setImagenPreview(null);
      setIsEditMode(true);
    }
  }, [servicio, isCreating]);

  if (!isOpen) return null;
  if (!isCreating && !servicio) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setFormData(prev => ({
          ...prev,
          imagen: base64
        }));
        setImagenPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre del servicio es requerido',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    try {
      setLoading(true);
      const url = isCreating 
        ? 'http://localhost:5000/api/servicios'
        : `http://localhost:5000/api/servicios/${servicio._id}`;
      
      const method = isCreating ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: `Servicio ${isCreating ? 'creado' : 'actualizado'} exitosamente`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#f97316',
          timer: 2000,
          timerProgressBar: true
        });
        setIsEditMode(false);
        onEdit();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al ${isCreating ? 'crear' : 'actualizar'} el servicio`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#f97316'
        });
      }
    } catch (err) {
      console.error('Error al guardar servicio:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al ${isCreating ? 'crear' : 'actualizar'} el servicio`,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f97316'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="service-modal-backdrop" onClick={handleBackdropClick}>
      <div className="service-modal">
        {/* Botón cerrar */}
        <button className="service-modal-close" onClick={onClose} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Imagen */}
        {!isCreating && (
          <div className="service-modal-image-container">
          {formData.imagen ? (
            <img src={formData.imagen} alt={formData.nombre} className="service-modal-image" />
          ) : (
            <div className="service-modal-image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
          )}
        </div>
        )}

        {/* Contenido */}
        <div className="service-modal-content">
          {isEditMode ? (
            <>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del servicio"
                className="service-modal-input service-modal-input--title"
              />
              
              <div className="service-modal-form-group">
                <label className="service-modal-label">Consumo por minuto</label>
                <input
                  type="number"
                  name="consumoPorMinuto"
                  value={formData.consumoPorMinuto}
                  onChange={handleInputChange}
                  placeholder="Consumo por minuto"
                  className="service-modal-input"
                  step="0.01"
                />
              </div>

              <div className="service-modal-form-group">
                <label className="service-modal-label">Imagen</label>
                <input
                  type="file"
                  name="imagen"
                  onChange={handleImagenChange}
                  accept="image/*"
                  className="service-modal-input service-modal-input--file"
                />
                {imagenPreview && (
                  <div className="service-modal-preview">
                    <img src={imagenPreview} alt="Vista previa" className="service-modal-preview-image" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="service-modal-title">{formData.nombre}</h2>

              {/* Información */}
              <div className="service-modal-info">
                <div className="service-modal-consumption">
                  <div className="service-modal-consumption-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="service-modal-consumption-info">
                    <span className="service-modal-consumption-label">Consumo por minuto</span>
                    <span className="service-modal-consumption-value">${formData.consumoPorMinuto || '0'}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="service-modal-actions">
            {isEditMode ? (
              <>
                <button 
                  className="service-modal-btn service-modal-btn--edit" 
                  onClick={handleGuardar}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button 
                  className="service-modal-btn service-modal-btn--cancel" 
                  onClick={() => setIsEditMode(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button 
                  className="service-modal-btn service-modal-btn--edit" 
                  onClick={() => setIsEditMode(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </button>
                {!isCreating && (
                  <button className="service-modal-btn service-modal-btn--delete" onClick={handleDelete}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Eliminar
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;