import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, Edit2, Plus, Trash2 } from 'lucide-react';
import './DetallesReceta.css';

export default function DetallesReceta() {
  const navigate = useNavigate();
  const { id } = useParams(); // ← Obtiene el ID de la URL
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ═══════════════════════════════════════════════════════════════════════
  // 📥 CARGAR RECETA AL MONTAR EL COMPONENTE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const cargarReceta = async () => {
      try {
        setLoading(true);
        console.log('Cargando receta con ID:', id);
        
        // Usar endpoint /completa para obtener detalles de ingredientes y servicios
        const response = await fetch(`http://localhost:5000/api/recetas/${id}/completa`);
        
        if (!response.ok) {
          throw new Error('Receta no encontrada');
        }
        
        const data = await response.json();
        console.log('Receta cargada:', data);
        setRecipe(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar receta:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarReceta();
  }, [id]); // ← Se ejecuta cuando cambia el ID

  // ═══════════════════════════════════════════════════════════════════════
  // 📊 CÁLCULOS (solo si recipe existe)
  // ═══════════════════════════════════════════════════════════════════════
  const totalIngredientes = recipe?.costos?.costoIngredientes || 0;
  const totalServicios = recipe?.costos?.costoServicios || 0;
  const totalTiempoPreparacion = recipe?.costos?.costoTiempoPreparacion || 0;
  const costoTotal = recipe?.costos?.costoProduccion || 0;

  // ═══════════════════════════════════════════════════════════════════════
  // 🎨 RENDER - ESTADOS DE CARGA
  // ═══════════════════════════════════════════════════════════════════════
  
  if (loading) {
    return (
      <div className="recipe-detail-page">
        <div className="recipe-detail-header">
          <div className="recipe-detail-header-container">
            <div className="recipe-detail-header-content">
              <div className="recipe-detail-header-left">
                <button 
                  className="recipe-detail-back-btn"
                  onClick={() => navigate('/recetas')}
                >
                  <ArrowLeft className="icon-size" />
                </button>
                <div>
                  <h1 className="recipe-detail-title">Repostería Caro</h1>
                  <p className="recipe-detail-subtitle">Cargando receta...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail-page">
        <div className="recipe-detail-header">
          <div className="recipe-detail-header-container">
            <div className="recipe-detail-header-content">
              <div className="recipe-detail-header-left">
                <button 
                  className="recipe-detail-back-btn"
                  onClick={() => navigate('/recetas')}
                >
                  <ArrowLeft className="icon-size" />
                </button>
                <div>
                  <h1 className="recipe-detail-title">Repostería Caro</h1>
                  <p className="recipe-detail-subtitle">Error</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="recipe-detail-main-container">
          <div className="error-message">
            <p>❌ Error: {error}</p>
            <button onClick={() => navigate('/recetas')}>Volver a recetas</button>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return <div>No se encontró la receta</div>;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 🎨 RENDER - CONTENIDO PRINCIPAL
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="recipe-detail-page">
      {/* Header */}
      <div className="recipe-detail-header">
        <div className="recipe-detail-header-container">
          <div className="recipe-detail-header-content">
            <div className="recipe-detail-header-left">
              <button 
                className="recipe-detail-back-btn"
                onClick={() => navigate('/recetas')}
              >
                <ArrowLeft className="icon-size" />
              </button>
              <div>
                <h1 className="recipe-detail-title">Repostería Caro</h1>
                <p className="recipe-detail-subtitle">Detalle de Receta</p>
              </div>
            </div>
            <button 
              className="recipe-detail-edit-btn"
              onClick={() => navigate(`/recetas/editar/${id}`)}
            >
              <Edit2 className="icon-size-sm" />
              Editar Receta
            </button>
          </div>
        </div>
      </div>

      <div className="recipe-detail-main-container">
        {/* Recipe Header with Image */}
        <div className="recipe-card-main">
          <div className="recipe-card-grid">
            <div className="recipe-image-container">
              {recipe.rutaFoto && (
                <img 
                  src={recipe.rutaFoto} 
                  alt={recipe.nombre}
                  className="recipe-image"
                />
              )}
              <div className="recipe-badge">
                <span className="recipe-badge-text">✨ {recipe.costos.porcentajeGanancia}%</span>
              </div>
            </div>
            
            <div className="recipe-info-section">
              <h2 className="recipe-name">{recipe.nombre}</h2>
              
              <div className="recipe-meta-grid">
                <div className="recipe-meta-card recipe-meta-card-orange">
                  <Clock className="recipe-meta-icon" />
                  <p className="recipe-meta-label">Tiempo</p>
                  <p className="recipe-meta-value">{recipe.tiempoPreparacion} min</p>
                </div>
                <div className="recipe-meta-card recipe-meta-card-amber">
                  <span className="recipe-meta-emoji">🍰</span>
                  <p className="recipe-meta-label recipe-meta-label-amber">Ingredientes</p>
                  <p className="recipe-meta-value recipe-meta-value-amber">{recipe.ingredientes?.length || 0} items</p>
                </div>
              </div>

              <div className="recipe-pricing-card">
                <div className="recipe-pricing-row">
                  <span className="recipe-pricing-label">💰 Precio Venta</span>
                  <span className="recipe-pricing-venta">${recipe.costos.precioVenta.toLocaleString()}</span>
                </div>
                <div className="recipe-pricing-row">
                  <span className="recipe-pricing-label">💵 Costo Producción</span>
                  <span className="recipe-pricing-costo">${recipe.costos.costoProduccion.toLocaleString()}</span>
                </div>
                <div className="recipe-pricing-divider"></div>
                <div className="recipe-pricing-row">
                  <span className="recipe-pricing-label-bold">📈 Ganancia</span>
                  <span className="recipe-pricing-ganancia">${recipe.costos.ganancia.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="recipe-content-grid">
          {/* Left Column */}
          <div className="recipe-left-column">
            {/* Ingredientes */}
            <div className="recipe-section-card">
              <div className="recipe-section-header">
                <h3 className="recipe-section-title">
                  🥚 Ingredientes
                </h3>
                <div className="recipe-section-total">
                  <p className="recipe-section-total-label">Total</p>
                  <p className="recipe-section-total-value">${totalIngredientes.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="recipe-items-list">
                {recipe.ingredientes?.map((ing, index) => {
                  const costoTotal = ing.detalles 
                    ? (ing.detalles.precioPorUnidad * ing.cantidad).toFixed(2)
                    : 0;
                  
                  return (
                    <div 
                      key={index}
                      className="recipe-item recipe-item-orange"
                    >
                      <div className="recipe-item-info">
                        <p className="recipe-item-name">
                          {ing.detalles?.nombre || `Ingrediente #${ing.idIngrediente}`}
                        </p>
                        <p className="recipe-item-quantity">
                          {ing.cantidad} {ing.detalles?.unidadMedida || 'unidades'}
                        </p>
                      </div>
                      <span className="recipe-item-cost">${parseFloat(costoTotal).toLocaleString()}</span>
                    </div>
                  );
                }) || <p>No hay ingredientes</p>}
              </div>
            </div>

            {/* Gastos de Servicios */}
            <div className="recipe-section-card">
              <div className="recipe-section-header">
                <h3 className="recipe-section-title">
                  ⚡ Gastos de Servicios
                </h3>
                <div className="recipe-section-total">
                  <p className="recipe-section-total-label">Total</p>
                  <p className="recipe-section-total-value">${totalServicios.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="recipe-items-list">
                {recipe.servicios?.map((serv, index) => {
                  const costoTotal = serv.detalles 
                    ? (serv.detalles.consumoPorMinuto * serv.cantidadTiempo).toFixed(2)
                    : 0;
                  
                  return (
                    <div 
                      key={index}
                      className="recipe-item recipe-item-amber"
                    >
                      <p className="recipe-item-name recipe-item-name-amber">
                        {serv.detalles?.nombre || `Servicio #${serv.idServicio}`} - {serv.cantidadTiempo} min
                      </p>
                      <span className="recipe-item-cost recipe-item-cost-amber">${parseFloat(costoTotal).toLocaleString()}</span>
                    </div>
                  );
                }) || <p>No hay servicios</p>}
              </div>
            </div>

            {/* Resumen de Gastos */}
            <div className="recipe-section-card">
              <h3 className="recipe-section-title">
                📊 Resumen de Gastos
              </h3>
              
              <div className="recipe-summary-list">
                <div className="recipe-summary-row">
                  <span className="recipe-summary-label">🥚 Total Ingredientes</span>
                  <span className="recipe-summary-value recipe-summary-value-orange">
                    ${totalIngredientes.toLocaleString()}
                  </span>
                </div>
                
                <div className="recipe-summary-row">
                  <span className="recipe-summary-label">⚡ Total Servicios</span>
                  <span className="recipe-summary-value recipe-summary-value-amber">
                    ${totalServicios.toLocaleString()}
                  </span>
                </div>

                <div className="recipe-summary-row">
                  <span className="recipe-summary-label">🕐 Costo Tiempo Preparación ({recipe.tiempoPreparacion} min)</span>
                  <span className="recipe-summary-value recipe-summary-value-blue">
                    ${totalTiempoPreparacion.toLocaleString()}
                  </span>
                </div>
                
                <div className="recipe-summary-divider"></div>
                
                <div className="recipe-summary-row recipe-summary-row-total">
                  <span className="recipe-summary-label-bold">💰 Costo Total de Producción</span>
                  <span className="recipe-summary-value-total">
                    ${costoTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Paso a Paso */}
          <div className="recipe-section-card">
            <h3 className="recipe-section-title recipe-steps-title">
              📝 Preparación Paso a Paso
            </h3>
            
            <div className="recipe-steps-list">
              {recipe.pasosASeguir?.map((paso, index) => (
                <div 
                  key={index}
                  className="recipe-step"
                >
                  <div className="recipe-step-number">
                    {index + 1}
                  </div>
                  <div className="recipe-step-content">
                    <p className="recipe-step-text">{paso}</p>
                  </div>
                </div>
              )) || <p>No hay pasos definidos</p>}
            </div>

            {recipe.videoYoutube && (
              <div className="recipe-tip-section">
                <div className="recipe-tip-card">
                  <p className="recipe-tip-label">🎥 Video Tutorial</p>
                  <a href={recipe.videoYoutube} target="_blank" rel="noopener noreferrer" className="recipe-tip-text">
                    Ver video en YouTube
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
