const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Cargar datos JSON
const ingredientes = require('./database/ingredientes.json');
const servicios = require('./database/servicios.json');
const recetas = require('./database/recetas.json');

// ═══════════════════════════════════════════════════════════════════════════
// 💰 FUNCIONES DE CÁLCULO DE COSTOS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calcula el costo total de producción de una receta
 * @param {Object} receta - Objeto de receta con ingredientes y servicios
 * @returns {Object} - Objeto con costos detallados
 */
function calcularCostosReceta(receta) {
  // Constante: Costo de mano de obra por minuto
  const COSTO_MANO_OBRA_POR_MINUTO = 16.7;

  // Calcular costo de ingredientes
  const costoIngredientes = receta.ingredientes.reduce((total, item) => {
    const ingrediente = ingredientes.find(ing => ing._id === item.idIngrediente);
    if (ingrediente) {
      return total + (ingrediente.precioPorUnidad * item.cantidad);
    }
    return total;
  }, 0);

  // Calcular costo de servicios
  const costoServicios = receta.servicios.reduce((total, item) => {
    const servicio = servicios.find(serv => serv._id === item.idServicio);
    if (servicio) {
      return total + (servicio.consumoPorMinuto * item.cantidadTiempo);
    }
    return total;
  }, 0);

  // Calcular costo de tiempo de preparación (mano de obra)
  const costoTiempoPreparacion = receta.tiempoPreparacion * COSTO_MANO_OBRA_POR_MINUTO;

  // Costo total de producción
  const costoProduccion = costoIngredientes + costoServicios + costoTiempoPreparacion;

  // Precio de venta (costo + ganancia)
  const precioVenta = costoProduccion * (1 + receta.porcentajeGanancia / 100);

  // Ganancia neta
  const ganancia = precioVenta - costoProduccion;

  return {
    costoIngredientes: parseFloat(costoIngredientes.toFixed(2)),
    costoServicios: parseFloat(costoServicios.toFixed(2)),
    costoTiempoPreparacion: parseFloat(costoTiempoPreparacion.toFixed(2)),
    costoProduccion: parseFloat(costoProduccion.toFixed(2)),
    precioVenta: parseFloat(precioVenta.toFixed(2)),
    ganancia: parseFloat(ganancia.toFixed(2)),
    porcentajeGanancia: receta.porcentajeGanancia
  };
}

/**
 * Enriquece una receta con sus costos calculados
 * @param {Object} receta - Objeto de receta
 * @returns {Object} - Receta con campo 'costos' agregado
 */
function enriquecerRecetaConCostos(receta) {
  return {
    ...receta,
    costos: calcularCostosReceta(receta)
  };
}

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de Repostería funcionando correctamente' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ═══════════════════════════════════════════════════════════════════════════
// 📦 ENDPOINTS - INGREDIENTES
// ═══════════════════════════════════════════════════════════════════════════

// Obtener todos los ingredientes
app.get('/api/ingredientes', (req, res) => {
  res.json(ingredientes);
});

// Obtener ingrediente por ID
app.get('/api/ingredientes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ingrediente = ingredientes.find(ing => ing._id === id);
  
  if (ingrediente) {
    res.json(ingrediente);
  } else {
    res.status(404).json({ error: 'Ingrediente no encontrado' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ ENDPOINTS - SERVICIOS
// ═══════════════════════════════════════════════════════════════════════════

// Obtener todos los servicios
app.get('/api/servicios', (req, res) => {
  res.json(servicios);
});

// Obtener servicio por ID
app.get('/api/servicios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const servicio = servicios.find(serv => serv._id === id);
  
  if (servicio) {
    res.json(servicio);
  } else {
    res.status(404).json({ error: 'Servicio no encontrado' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// 🍰 ENDPOINTS - RECETAS
// ═══════════════════════════════════════════════════════════════════════════

// Obtener todas las recetas (con costos calculados)
app.get('/api/recetas', (req, res) => {
  const recetasConCostos = recetas.map(receta => enriquecerRecetaConCostos(receta));
  res.json(recetasConCostos);
});

// Obtener receta por ID (con costos calculados)
app.get('/api/recetas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const receta = recetas.find(rec => rec._id === id);
  
  if (receta) {
    res.json(enriquecerRecetaConCostos(receta));
  } else {
    res.status(404).json({ error: 'Receta no encontrada' });
  }
});

// Obtener receta completa con detalles de ingredientes y servicios
app.get('/api/recetas/:id/completa', (req, res) => {
  const id = parseInt(req.params.id);
  const receta = recetas.find(rec => rec._id === id);
  
  if (!receta) {
    return res.status(404).json({ error: 'Receta no encontrada' });
  }
  
  // Agregar detalles completos de ingredientes
  const ingredientesCompletos = receta.ingredientes.map(item => {
    const ingrediente = ingredientes.find(ing => ing._id === item.idIngrediente);
    return {
      ...item,
      detalles: ingrediente
    };
  });
  
  // Agregar detalles completos de servicios
  const serviciosCompletos = receta.servicios.map(item => {
    const servicio = servicios.find(serv => serv._id === item.idServicio);
    return {
      ...item,
      detalles: servicio
    };
  });
  
  const recetaCompleta = {
    ...receta,
    ingredientes: ingredientesCompletos,
    servicios: serviciosCompletos,
    costos: calcularCostosReceta(receta)
  };
  
  res.json(recetaCompleta);
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
});
