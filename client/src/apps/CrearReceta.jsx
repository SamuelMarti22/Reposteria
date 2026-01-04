import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  X,
  Save,
  Calculator,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Autocomplete from "../components/Autocomplete";
import "./CrearReceta.css";

export default function CrearReceta() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Detectar si estamos en modo edición o creación
  const isEditMode = Boolean(id);

  // Estados para datos de la BD
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    tiempo: "",
    porcentajeGanancia: "",
    videoUrl: "", // Campo para URL de YouTube
    ingredientes: [{ id: 1, ingredienteObj: null, cantidad: "" }],
    servicios: [{ id: 1, servicioObj: null, tiempoUso: "" }],
    pasos: [{ id: 1, descripcion: "" }],
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Cargar ingredientes y servicios al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ingredientesRes, serviciosRes] = await Promise.all([
          fetch("http://localhost:5000/api/ingredientes"),
          fetch("http://localhost:5000/api/servicios"),
        ]);

        if (!ingredientesRes.ok || !serviciosRes.ok) {
          throw new Error("Error al cargar datos");
        }

        const ingredientes = await ingredientesRes.json();
        const servicios = await serviciosRes.json();

        setIngredientesDisponibles(ingredientes);
        setServiciosDisponibles(servicios);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los ingredientes y servicios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cargar datos de la receta existente en modo edición
  useEffect(() => {
    const cargarRecetaExistente = async () => {
      if (!isEditMode || !id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/recetas/${id}`);
        
        if (!response.ok) {
          throw new Error('Receta no encontrada');
        }
        
        const receta = await response.json();
        
        // Transformar datos del backend al formato del formulario
        setFormData({
          name: receta.nombre || '',
          image: receta.rutaFoto || '',
          tiempo: receta.tiempoPreparacion?.toString() || '',
          porcentajeGanancia: receta.porcentajeGanancia?.toString() || '',
          videoUrl: receta.videoUrl || '',
          ingredientes: receta.ingredientes && receta.ingredientes.length > 0
            ? receta.ingredientes.map((ing, index) => {
                // Buscar el objeto completo del ingrediente
                const ingredienteObj = ingredientesDisponibles.find(
                  i => i._id === ing.idIngrediente
                );
                return {
                  id: index + 1,
                  ingredienteObj: ingredienteObj || null,
                  cantidad: ing.cantidad?.toString() || ''
                };
              })
            : [{ id: 1, ingredienteObj: null, cantidad: '' }],
          servicios: receta.servicios && receta.servicios.length > 0
            ? receta.servicios.map((serv, index) => {
                // Buscar el objeto completo del servicio
                const servicioObj = serviciosDisponibles.find(
                  s => s._id === serv.idServicio
                );
                return {
                  id: index + 1,
                  servicioObj: servicioObj || null,
                  tiempoUso: serv.cantidadTiempo?.toString() || ''
                };
              })
            : [{ id: 1, servicioObj: null, tiempoUso: '' }],
          pasos: receta.pasosASeguir && receta.pasosASeguir.length > 0
            ? receta.pasosASeguir.map((paso, index) => ({
                id: index + 1,
                descripcion: paso || ''
              }))
            : [{ id: 1, descripcion: '' }]
        });
        
        // Si hay imagen, establecer preview
        if (receta.rutaFoto) {
          setImagePreview(receta.rutaFoto);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar receta:', err);
        setError('No se pudo cargar la receta para editar');
      } finally {
        setLoading(false);
      }
    };
    
    // Solo cargar si ya tenemos ingredientes y servicios disponibles
    if (ingredientesDisponibles.length > 0 && serviciosDisponibles.length > 0) {
      cargarRecetaExistente();
    }
  }, [isEditMode, id, ingredientesDisponibles, serviciosDisponibles]);

  // Cálculos automáticos
  const COSTO_MANO_OBRA_POR_MINUTO = 16.7;

  // Calcular costos basados en ingredientes y servicios seleccionados
  const totalIngredientes = formData.ingredientes.reduce((total, item) => {
    if (item.ingredienteObj && item.cantidad) {
      const costo =
        item.ingredienteObj.precioPorUnidad * parseFloat(item.cantidad);
      return total + (isNaN(costo) ? 0 : costo);
    }
    return total;
  }, 0);

  const totalServicios = formData.servicios.reduce((total, item) => {
    if (item.servicioObj && item.tiempoUso) {
      const costo =
        item.servicioObj.consumoPorMinuto * parseFloat(item.tiempoUso);
      return total + (isNaN(costo) ? 0 : costo);
    }
    return total;
  }, 0);

  const tiempoPreparacion = parseFloat(formData.tiempo) || 0;
  const costoTiempoPreparacion = tiempoPreparacion * COSTO_MANO_OBRA_POR_MINUTO;

  const costoProduccion =
    totalIngredientes + totalServicios + costoTiempoPreparacion;
  const porcentajeGanancia = parseFloat(formData.porcentajeGanancia) || 0;
  const precioVenta = costoProduccion * (1 + porcentajeGanancia / 100);
  const ganancia = precioVenta - costoProduccion;
  const margen = porcentajeGanancia;

  // Handlers para ingredientes
  const addIngrediente = () => {
    setFormData({
      ...formData,
      ingredientes: [
        ...formData.ingredientes,
        { id: Date.now(), ingredienteObj: null, cantidad: "" },
      ],
    });
  };

  const removeIngrediente = (id) => {
    if (formData.ingredientes.length > 1) {
      setFormData({
        ...formData,
        ingredientes: formData.ingredientes.filter((ing) => ing.id !== id),
      });
    }
  };

  const updateIngrediente = (id, field, value) => {
    setFormData({
      ...formData,
      ingredientes: formData.ingredientes.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      ),
    });
  };

  // Handlers para servicios
  const addServicio = () => {
    setFormData({
      ...formData,
      servicios: [
        ...formData.servicios,
        { id: Date.now(), servicioObj: null, tiempoUso: "" },
      ],
    });
  };

  const removeServicio = (id) => {
    if (formData.servicios.length > 1) {
      setFormData({
        ...formData,
        servicios: formData.servicios.filter((serv) => serv.id !== id),
      });
    }
  };

  const updateServicio = (id, field, value) => {
    setFormData({
      ...formData,
      servicios: formData.servicios.map((serv) =>
        serv.id === id ? { ...serv, [field]: value } : serv
      ),
    });
  };

  // Handlers para pasos
  const addPaso = () => {
    setFormData({
      ...formData,
      pasos: [...formData.pasos, { id: Date.now(), descripcion: "" }],
    });
  };

  const removePaso = (id) => {
    if (formData.pasos.length > 1) {
      setFormData({
        ...formData,
        pasos: formData.pasos.filter((paso) => paso.id !== id),
      });
    }
  };

  const updatePaso = (id, value) => {
    setFormData({
      ...formData,
      pasos: formData.pasos.map((paso) =>
        paso.id === id ? { ...paso, descripcion: value } : paso
      ),
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    // Confirmar eliminación con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la receta "${formData.name}" permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/recetas/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la receta');
        }

        // Alerta de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Eliminada!',
          text: 'La receta ha sido eliminada exitosamente',
          confirmButtonColor: '#f97316',
          timer: 2000,
          timerProgressBar: true
        });

        // Navegar a la lista de recetas
        navigate('/recetas');
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la receta. Por favor intenta de nuevo.',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Preparar datos para enviar
      const recetaData = {
        nombre: formData.name,
        tiempoPreparacion: parseFloat(formData.tiempo),
        porcentajeGanancia: parseFloat(formData.porcentajeGanancia),
        videoUrl: formData.videoUrl || "", // Agregar URL del video
        ingredientes: formData.ingredientes
          .filter((ing) => ing.ingredienteObj && ing.cantidad)
          .map((ing) => ({
            idIngrediente: ing.ingredienteObj._id,
            cantidad: parseFloat(ing.cantidad),
          })),
        servicios: formData.servicios
          .filter((serv) => serv.servicioObj && serv.tiempoUso)
          .map((serv) => ({
            idServicio: serv.servicioObj._id,
            cantidadTiempo: parseFloat(serv.tiempoUso),
          })),
        pasosASeguir: formData.pasos
          .filter((paso) => paso.descripcion.trim())
          .map((paso) => paso.descripcion),
        rutaFoto: formData.image || "",
      };

      // Determinar URL y método según el modo
      const url = isEditMode 
        ? `http://localhost:5000/api/recetas/${id}`
        : "http://localhost:5000/api/recetas";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recetaData),
      });

      if (!response.ok) {
        throw new Error(`Error al ${isEditMode ? 'actualizar' : 'guardar'} la receta`);
      }

      const result = await response.json();
      
      // Alerta de éxito con SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: `Receta ${isEditMode ? 'actualizada' : 'guardada'} exitosamente`,
        confirmButtonText: 'Ver Receta',
        confirmButtonColor: '#f97316',
        timer: 2000,
        timerProgressBar: true
      });

      // Navegar a la página de detalles de la receta
      navigate(`/recetas/${result.receta._id}`);
    } catch (error) {
      console.error("Error al guardar:", error);
      
      // Alerta de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Hubo un error al ${isEditMode ? 'actualizar' : 'guardar'} la receta. Por favor intenta de nuevo.`,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#f97316'
      });
    }
  };

  return (
    <div className="crear-receta-page">
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

      {/* Header */}
      <div className="crear-receta-header">
        <div className="crear-receta-header-container">
          <div className="crear-receta-header-content">
            <div className="crear-receta-header-left">
              <button
                className="crear-receta-back-btn"
                onClick={() => navigate("/recetas")}
                type="button"
              >
                <ArrowLeft className="icon-size" />
              </button>
              <div>
                <h1 className="crear-receta-title">Repostería Caro</h1>
                <p className="crear-receta-subtitle">
                  {isEditMode ? 'Editar Receta' : 'Nueva Receta'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
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
              <button onClick={handleSubmit} className="crear-receta-save-btn">
                <Save className="icon-size-sm" />
                {isEditMode ? 'Actualizar Receta' : 'Guardar Receta'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="crear-receta-form">
        {/* Información Básica */}
        <div className="crear-receta-section">
          <h2 className="crear-receta-section-title">📋 Información Básica</h2>

          <div className="crear-receta-basic-grid">
            {/* Imagen */}
            <div>
              <label className="crear-receta-label">Imagen del Producto</label>
              <div className="crear-receta-image-upload">
                {imagePreview ? (
                  <div className="crear-receta-image-preview-container">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="crear-receta-image-preview"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, image: "" });
                      }}
                      className="crear-receta-image-remove"
                    >
                      <X className="icon-size-sm" />
                    </button>
                  </div>
                ) : (
                  <label className="crear-receta-upload-area">
                    <Upload className="crear-receta-upload-icon" />
                    <span className="crear-receta-upload-text">
                      Subir Imagen
                    </span>
                    <span className="crear-receta-upload-hint">
                      JPG, PNG o WEBP
                    </span>
                    <input
                      type="file"
                      className="crear-receta-file-input"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Campos de texto */}
            <div className="crear-receta-fields">
              <div>
                <label className="crear-receta-label">
                  Nombre de la Receta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="crear-receta-input"
                  placeholder="Ej: Torta de Chocolate"
                />
              </div>

              <div className="crear-receta-grid-2">
                <div>
                  <label className="crear-receta-label">
                    Tiempo (minutos) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.tiempo}
                    onChange={(e) =>
                      setFormData({ ...formData, tiempo: e.target.value })
                    }
                    className="crear-receta-input"
                    placeholder="120"
                  />
                </div>

                <div>
                  <label className="crear-receta-label">
                    Porcentaje de Ganancia (%) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.porcentajeGanancia}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        porcentajeGanancia: e.target.value,
                      })
                    }
                    className="crear-receta-input"
                    placeholder="40"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="crear-receta-label">
                  URL de Video de YouTube (opcional)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="crear-receta-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="crear-receta-content-grid">
          {/* Ingredientes */}
          <div className="crear-receta-section">
            <div className="crear-receta-section-header">
              <h2 className="crear-receta-section-title">🥚 Ingredientes</h2>
              <button
                type="button"
                onClick={addIngrediente}
                className="crear-receta-add-btn crear-receta-add-btn-orange"
              >
                <Plus className="icon-size-sm" />
                Agregar
              </button>
            </div>

            <div className="crear-receta-items-list">
              {formData.ingredientes.map((ingrediente, index) => (
                <div
                  key={ingrediente.id}
                  className="crear-receta-item crear-receta-item-orange"
                >
                  <div className="crear-receta-item-content">
                    <span className="crear-receta-item-number crear-receta-item-number-orange">
                      {index + 1}
                    </span>
                    <div className="crear-receta-item-fields">
                      <Autocomplete
                        items={ingredientesDisponibles}
                        value={ingrediente.ingredienteObj}
                        onChange={(item) =>
                          updateIngrediente(
                            ingrediente.id,
                            "ingredienteObj",
                            item
                          )
                        }
                        placeholder="Buscar ingrediente..."
                        displayField="nombre"
                        className="crear-receta-item-input"
                      />
                      <div className="crear-receta-item-grid-simple">
                        <input
                          type="number"
                          required
                          value={ingrediente.cantidad}
                          onChange={(e) =>
                            updateIngrediente(
                              ingrediente.id,
                              "cantidad",
                              e.target.value
                            )
                          }
                          className="crear-receta-item-input-small"
                          placeholder="Cantidad"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeIngrediente(ingrediente.id)}
                      className="crear-receta-delete-btn"
                    >
                      <Trash2 className="icon-size-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="crear-receta-total crear-receta-total-orange">
              <span className="crear-receta-total-label">
                Total Ingredientes
              </span>
              <span className="crear-receta-total-value">
                ${totalIngredientes.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Servicios */}
          <div className="crear-receta-section">
            <div className="crear-receta-section-header">
              <h2 className="crear-receta-section-title">
                ⚡ Gastos de Servicios
              </h2>
              <button
                type="button"
                onClick={addServicio}
                className="crear-receta-add-btn crear-receta-add-btn-amber"
              >
                <Plus className="icon-size-sm" />
                Agregar
              </button>
            </div>

            <div className="crear-receta-items-list">
              {formData.servicios.map((servicio, index) => (
                <div
                  key={servicio.id}
                  className="crear-receta-item crear-receta-item-amber"
                >
                  <div className="crear-receta-item-content">
                    <span className="crear-receta-item-number crear-receta-item-number-amber">
                      {index + 1}
                    </span>
                    <div className="crear-receta-service-fields">
                      <Autocomplete
                        items={serviciosDisponibles}
                        value={servicio.servicioObj}
                        onChange={(item) =>
                          updateServicio(servicio.id, "servicioObj", item)
                        }
                        placeholder="Buscar servicio..."
                        displayField="nombre"
                        className="crear-receta-item-input-small"
                      />
                      <input
                        type="number"
                        required
                        value={servicio.tiempoUso}
                        onChange={(e) =>
                          updateServicio(
                            servicio.id,
                            "tiempoUso",
                            e.target.value
                          )
                        }
                        className="crear-receta-item-input-small"
                        placeholder="Tiempo (minutos)"
                        step="1"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeServicio(servicio.id)}
                      className="crear-receta-delete-btn"
                    >
                      <Trash2 className="icon-size-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="crear-receta-total crear-receta-total-amber">
              <span className="crear-receta-total-label">Total Servicios</span>
              <span className="crear-receta-total-value">
                ${totalServicios.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Resumen Financiero */}
        <div className="crear-receta-section">
          <h2 className="crear-receta-section-title">
            <Calculator className="icon-size" />
            Resumen Financiero
          </h2>

          <div className="crear-receta-financial-grid">
            {/* Costos */}
            <div className="crear-receta-financial-card crear-receta-financial-costs">
              <h3 className="crear-receta-financial-subtitle">
                💰 Costos de Producción
              </h3>
              <div className="crear-receta-financial-list">
                <div className="crear-receta-financial-row">
                  <span className="crear-receta-financial-label">
                    🥚 Ingredientes
                  </span>
                  <span className="crear-receta-financial-value">
                    ${totalIngredientes.toLocaleString()}
                  </span>
                </div>
                <div className="crear-receta-financial-row">
                  <span className="crear-receta-financial-label">
                    ⚡ Servicios
                  </span>
                  <span className="crear-receta-financial-value">
                    ${totalServicios.toLocaleString()}
                  </span>
                </div>
                <div className="crear-receta-financial-row">
                  <span className="crear-receta-financial-label">
                    🕐 Tiempo ({tiempoPreparacion} min)
                  </span>
                  <span className="crear-receta-financial-value">
                    ${costoTiempoPreparacion.toLocaleString()}
                  </span>
                </div>
                <div className="crear-receta-financial-divider"></div>
                <div className="crear-receta-financial-row crear-receta-financial-row-total">
                  <span className="crear-receta-financial-label-bold">
                    Total Producción
                  </span>
                  <span className="crear-receta-financial-total">
                    ${costoProduccion.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Ventas y Ganancia */}
            <div className="crear-receta-financial-card crear-receta-financial-profits">
              <h3 className="crear-receta-financial-subtitle">
                📈 Análisis de Rentabilidad
              </h3>
              <div className="crear-receta-financial-list">
                <div className="crear-receta-financial-row">
                  <span className="crear-receta-financial-label">
                    💵 Precio de Venta
                  </span>
                  <span className="crear-receta-financial-price">
                    ${precioVenta.toLocaleString()}
                  </span>
                </div>
                <div className="crear-receta-financial-row">
                  <span className="crear-receta-financial-label">
                    💰 Costo Producción
                  </span>
                  <span className="crear-receta-financial-cost">
                    ${costoProduccion.toLocaleString()}
                  </span>
                </div>
                <div className="crear-receta-financial-divider"></div>
                <div className="crear-receta-financial-row crear-receta-financial-row-highlight">
                  <span className="crear-receta-financial-label-bold">
                    ✨ Ganancia Neta
                  </span>
                  <span className="crear-receta-financial-profit">
                    ${ganancia.toLocaleString()}
                  </span>
                </div>
                <div className="crear-receta-financial-row crear-receta-financial-row-highlight">
                  <span className="crear-receta-financial-label-bold">
                    📊 Margen de Ganancia
                  </span>
                  <span
                    className={`crear-receta-financial-margin ${
                      margen >= 40
                        ? "crear-receta-margin-high"
                        : margen >= 20
                        ? "crear-receta-margin-medium"
                        : "crear-receta-margin-low"
                    }`}
                  >
                    {margen}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preparación Paso a Paso */}
        <div className="crear-receta-section">
          <div className="crear-receta-section-header">
            <h2 className="crear-receta-section-title">
              📝 Preparación Paso a Paso
            </h2>
            <button
              type="button"
              onClick={addPaso}
              className="crear-receta-add-btn crear-receta-add-btn-orange"
            >
              <Plus className="icon-size-sm" />
              Agregar Paso
            </button>
          </div>

          <div className="crear-receta-steps-list">
            {formData.pasos.map((paso, index) => (
              <div key={paso.id} className="crear-receta-step">
                <div className="crear-receta-step-number">{index + 1}</div>
                <div className="crear-receta-step-content">
                  <textarea
                    required
                    value={paso.descripcion}
                    onChange={(e) => updatePaso(paso.id, e.target.value)}
                    rows="3"
                    className="crear-receta-step-textarea"
                    placeholder="Describe este paso de la preparación..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePaso(paso.id)}
                  className="crear-receta-delete-btn"
                >
                  <Trash2 className="icon-size" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de acción inferior */}
        <div className="crear-receta-actions">
          <button
            type="button"
            className="crear-receta-cancel-btn"
            onClick={() => navigate("/recetas")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="crear-receta-submit-btn"
            disabled={loading}
          >
            <Save className="icon-size" />
            {isEditMode ? 'Actualizar Receta' : 'Guardar Receta'}
          </button>
        </div>
      </form>
    </div>
  );
}
