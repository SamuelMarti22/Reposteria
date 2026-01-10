import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import './CrearIngrediente.css';

const CrearIngrediente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Detectar si estamos en modo edición
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    nombre: '',
    unidad: 'kg',
    cantidad: '',
    valorComprado: '',
    imagen: ''
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [valorPorUnidad, setValorPorUnidad] = useState(0);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  // Cargar datos del ingrediente si estamos en modo edición
  useEffect(() => {
    if (!isEditMode || !id) return;

    const cargarIngrediente = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/ingredientes/${id}`);

        if (!response.ok) {
          throw new Error('Ingrediente no encontrado');
        }

        const ingrediente = await response.json();
        setFormData({
          nombre: ingrediente.nombre || '',
          unidad: ingrediente.unidadMedida || 'kg',
          cantidad: ingrediente.cantidad || '',
          valorComprado: ingrediente.cantidad * ingrediente.precioPorUnidad || '',
          imagen: ingrediente.imagen || ''
        });

        if (ingrediente.imagen) {
          setImagePreview(ingrediente.imagen);
        }

        setError(null);
      } catch (err) {
        console.error('Error al cargar ingrediente:', err);
        setError('No se pudo cargar el ingrediente');
      } finally {
        setLoading(false);
      }
    };

    cargarIngrediente();
  }, [isEditMode, id]);

  // Calcular valor por unidad automáticamente
  useEffect(() => {
    const cantidad = parseFloat(formData.cantidad) || 0;
    const valorComprado = parseFloat(formData.valorComprado) || 0;
    
    if (cantidad > 0 && valorComprado > 0) {
      const valorUnidad = valorComprado / cantidad;
      setValorPorUnidad(valorUnidad);
    } else {
      setValorPorUnidad(0);
    }
  }, [formData.cantidad, formData.valorComprado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          imagen: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      imagen: ''
    }));
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el ingrediente "${formData.nombre}" permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/ingredientes/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar');
        }

        await Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'El ingrediente ha sido eliminado exitosamente',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#f97316'
        });

        navigate('/ingredientes');
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el ingrediente',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ingredienteData = {
        nombre: formData.nombre,
        unidadMedida: formData.unidad,
        cantidad: parseFloat(formData.cantidad),
        precioPorUnidad: valorPorUnidad
      };

      const url = isEditMode
        ? `http://localhost:5000/api/ingredientes/${id}`
        : 'http://localhost:5000/api/ingredientes';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredienteData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar');
      }

      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: `Ingrediente ${isEditMode ? 'actualizado' : 'guardado'} exitosamente`,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f97316',
        timer: 2000,
        timerProgressBar: true
      });

      navigate('/ingredientes');
    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al ${isEditMode ? 'actualizar' : 'guardar'} el ingrediente`,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f97316'
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      {/* Header */}
      <div className="crear-receta-header" style={{ marginBottom: '32px' }}>
        <div className="crear-receta-header-container">
          <div className="crear-receta-header-content">
            <div className="crear-receta-header-left">
              <button
                className="crear-receta-back-btn"
                onClick={() => navigate("/ingredientes")}
                type="button"
              >
                <ArrowLeft className="icon-size" />
              </button>
              <div>
                <h1 className="crear-receta-title">Repostería Caro</h1>
                <p className="crear-receta-subtitle">
                  {isEditMode ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
                </p>
              </div>
            </div>
            {isEditMode && (
              <button 
                type="button"
                onClick={handleDelete} 
                className="crear-receta-delete-btn-header"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                <Trash2 className="icon-size-sm" />
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="crear-receta-loading">
          <div className="crear-receta-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="crear-receta-error">
          <p>{error}</p>
        </div>
      )}

      {/* Formulario */}
      {!loading && (
        <form className="ingredient-form" onSubmit={handleSubmit}>
          <h2 className="form-title">
            {isEditMode ? 'Editar Ingrediente' : 'Agregar Ingrediente'}
          </h2>

          {/* Upload de imagen */}
          <div className="form-group form-group--image">
            <label className="form-label">Imagen del Ingrediente</label>
            
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Vista previa" />
                <button 
                  type="button" 
                  className="image-remove" 
                  onClick={handleRemoveImage}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="image-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  hidden 
                />
                <div className="image-upload__content">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span>Subir imagen</span>
                  <small>JPG, PNG o GIF (máx. 5MB)</small>
                </div>
              </label>
            )}
          </div>

          {/* Nombre */}
          <div className="form-group">
            <label className="form-label" htmlFor="nombre">
              Nombre del Ingrediente
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              placeholder="Ej: Harina de Trigo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Unidad y Cantidad */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="unidad">
                Unidad de Medida
              </label>
              <select
                id="unidad"
                name="unidad"
                className="form-select"
                value={formData.unidad}
                onChange={handleChange}
                required
              >
                <option value="kg">Kilogramos (kg)</option>
                <option value="g">Gramos (g)</option>
                <option value="L">Litros (L)</option>
                <option value="mL">Mililitros (mL)</option>
                <option value="unidades">Unidades</option>
                <option value="lb">Libras (lb)</option>
                <option value="oz">Onzas (oz)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cantidad">
                Cantidad
              </label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                className="form-input"
                placeholder="0"
                value={formData.cantidad}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Valor Comprado */}
          <div className="form-group">
            <label className="form-label" htmlFor="valorComprado">
              Valor Total Comprado
            </label>
            <div className="form-input-with-icon">
              <span className="input-icon">$</span>
              <input
                type="number"
                id="valorComprado"
                name="valorComprado"
                className="form-input form-input--with-icon"
                placeholder="0"
                value={formData.valorComprado}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          {/* Valor por Unidad (Calculado) */}
          <div className="calculated-value">
            <div className="calculated-value__label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Valor por {formData.unidad || 'unidad'}
            </div>
            <div className="calculated-value__amount">
              {formatCurrency(valorPorUnidad)}
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn--secondary" 
              onClick={() => navigate('/ingredientes')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn--primary"
            >
              {isEditMode ? 'Guardar Cambios' : 'Agregar Ingrediente'}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default CrearIngrediente;