const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const Ingredientes = require('./models/Ingredientes');
const Servicios = require('./models/Servicios');
const Receta = require('./models/Receta');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Conectar a MongoDB
connectDB();

// Cargar datos JSON (solo ingredientes y servicios)
let ingredientes = require('./database/ingredientes.json');
let servicios = require('./database/servicios.json');


// ═══════════════════════════════════════════════════════════════════════════
// 🔄 FUNCIONES - BD a JSON
// ═══════════════════════════════════════════════════════════════════════════


/**
 * Sincroniza los datos de MongoDB a los archivos JSON
 * Se ejecuta solo cuando el cliente hace la solicitud
 */
async function sincronizarDatosAJSON() {
  try {
    console.log('🔄 Sincronizando datos de MongoDB a archivos JSON...');

    // Obtener datos de MongoDB
    const ingredientesDB = await Ingredientes.find().sort({ _id: 1 });
    const serviciosDB = await Servicios.find().sort({ _id: 1 });

    // Convertir a objetos planos
    const ingredientesData = ingredientesDB.map(i => i.toObject());
    const serviciosData = serviciosDB.map(s => s.toObject());

    // Guardar en archivos JSON

    fs.writeFileSync(
      path.join(__dirname, './database/ingredientes.json'),
      JSON.stringify(ingredientesData, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      path.join(__dirname, './database/servicios.json'),
      JSON.stringify(serviciosData, null, 2),
      'utf8'
    );

    // Actualizar variables en memoria
    ingredientes = ingredientesData;
    servicios = serviciosData;

    console.log('✅ Datos sincronizados correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al sincronizar datos:', error.message);
    return false;
  }
}

// Funcion actualizar json ingredientes
async function actualizarJSONIngredientes() {

  // Obtener datos de MongoDB
  const ingredientesDB = await Ingredientes.find().sort({ _id: 1 });
  const ingredientesData = ingredientesDB.map(i => i.toObject());

  // Guardar en archivo JSON
  fs.writeFileSync(
    path.join(__dirname, './database/ingredientes.json'),
    JSON.stringify(ingredientesData, null, 2),
    'utf8'
  );

  // Actualizar variable en memoria
  ingredientes = ingredientesData;
}


// Funcion actualizar json servicios
async function actualizarJSONServicios() {

  // Obtener datos de MongoDB
  const serviciosDB = await Servicios.find().sort({ _id: 1 });
  const serviciosData = serviciosDB.map(s => s.toObject());
  // Guardar en archivo JSON
  fs.writeFileSync(
    path.join(__dirname, './database/servicios.json'),
    JSON.stringify(serviciosData, null, 2),
    'utf8'
  );

  // Actualizar variable en memoria
  servicios = serviciosData;
}


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

// Servir archivos estáticos (imágenes)
app.use('/images', express.static(path.join(__dirname, '../client/public/images/recetas')));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de Repostería funcionando correctamente' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 ENDPOINT - SINCRONIZAR DATOS
// ═══════════════════════════════════════════════════════════════════════════

// Sincronizar datos de MongoDB a JSON (se llama desde el cliente)
app.post('/api/sync', async (req, res) => {
  const sincronizado = await sincronizarDatosAJSON();

  if (sincronizado) {
    res.json({
      status: 'success',
      message: 'Datos sincronizados correctamente'
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Error al sincronizar los datos'
    });
  }
});


// ═══════════════════════════════════════════════════════════════════════════
// 📦 ENDPOINTS - INGREDIENTES
// ═══════════════════════════════════════════════════════════════════════════

// Obtener todos los ingredientes del json
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

app.post('/api/ingredientes', async (req, res) => {
  try {
    const nuevoIngrediente = req.body;
    
    // Validaciones básicas
    if (!nuevoIngrediente.nombre || !nuevoIngrediente.unidadMedida ||
        nuevoIngrediente.cantidad == null || nuevoIngrediente.precioPorUnidad == null) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: nombre, unidadMedida, cantidad y precioPorUnidad son obligatorios'
      });
    }
    
    // Generar nuevo ID
    const ultimoIngrediente = await Ingredientes.findOne().sort({ _id: -1 });
    const nuevoId = ultimoIngrediente ? ultimoIngrediente._id + 1 : 1;

    // Crear objeto de ingrediente con estructura correcta
    const ingredienteParaGuardar = {
      _id: nuevoId,
      nombre: nuevoIngrediente.nombre,
      unidadMedida: nuevoIngrediente.unidadMedida,
      cantidad: parseFloat(nuevoIngrediente.cantidad),
      precioPorUnidad: parseFloat(nuevoIngrediente.precioPorUnidad)
    };

    // Guardar en MongoDB
    const ingredienteGuardado = await Ingredientes.create(ingredienteParaGuardar);
    
    // Actualizar JSON
    await actualizarJSONIngredientes();
    
    res.status(201).json({
      message: 'Ingrediente creado exitosamente',
      ingrediente: ingredienteGuardado
    });
  }
  catch (error) {
    console.error('Error al crear ingrediente:', error);
    res.status(500).json({
      error: 'Error al crear el ingrediente',
      detalles: error.message
    });
  }
});

// Actualizar ingrediente existente
app.put('/api/ingredientes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    // Validaciones básicas
    if (!datosActualizados.nombre || !datosActualizados.unidadMedida ||
        datosActualizados.cantidad == null || datosActualizados.precioPorUnidad == null) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: nombre, unidadMedida, cantidad y precioPorUnidad son obligatorios'
      });
    }

    // Actualizar en MongoDB
    const ingrediente = await Ingredientes.findOneAndUpdate(
      { _id: id },
      {
        nombre: datosActualizados.nombre,
        unidadMedida: datosActualizados.unidadMedida,
        cantidad: parseFloat(datosActualizados.cantidad),
        precioPorUnidad: parseFloat(datosActualizados.precioPorUnidad)
      },
      { new: true, runValidators: true }
    );

    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    // Actualizar JSON
    await actualizarJSONIngredientes();

    res.json({
      message: 'Ingrediente actualizado exitosamente',
      ingrediente: ingrediente
    });
  } catch (error) {
    console.error('Error al actualizar ingrediente:', error);
    res.status(500).json({
      error: 'Error al actualizar el ingrediente',
      detalles: error.message
    });
  }
});

// Eliminar ingrediente existente
app.delete('/api/ingredientes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Eliminar de MongoDB
    const ingrediente = await Ingredientes.findOneAndDelete({ _id: id });

    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    // Actualizar JSON
    await actualizarJSONIngredientes();

    res.json({
      message: 'Ingrediente eliminado exitosamente',
      ingredienteEliminado: { _id: ingrediente._id, nombre: ingrediente.nombre }
    });
  } catch (error) {
    console.error('Error al eliminar ingrediente:', error);
    res.status(500).json({
      error: 'Error al eliminar el ingrediente',
      detalles: error.message
    });
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

app.post('/api/servicios', async (req, res) => {
  try {
    const nuevoServicio = req.body;
    // Validaciones básicas
    if (!nuevoServicio.nombre || nuevoServicio.consumoPorMinuto == null) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: nombre y consumoPorMinuto son obligatorios'
      });
    }
    // Generar nuevo ID
    const ultimoServicio = await Servicios.findOne().sort({ _id: -1 });
    const nuevoId = ultimoServicio ? ultimoServicio._id + 1 : 1;
    // Crear objeto de servicio con estructura correcta
    const servicioParaGuardar = {
      _id: nuevoId,
      nombre: nuevoServicio.nombre,
      consumoPorMinuto: parseFloat(nuevoServicio.consumoPorMinuto)
    }
      
    // Guardar en MongoDB
    const servicioGuardado = await Servicios.create(servicioParaGuardar);
    // Actualizar JSON
    await actualizarJSONServicios();
    res.status(201).json({
      message: 'Servicio creado exitosamente',
      servicio: servicioGuardado
    });
  }
  catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({
      error: 'Error al crear el servicio',
      detalles: error.message
    });
  }
});

// Actualizar servicio existente
app.put('/api/servicios/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;
    // Validaciones básicas
    if (!datosActualizados.nombre || datosActualizados.consumoPorMinuto == null) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: nombre y consumoPorMinuto son obligatorios'
      });
    }
    // Actualizar en MongoDB
    const servicio = await Servicios.findOneAndUpdate(
      { _id: id },
      {
        nombre: datosActualizados.nombre,
        consumoPorMinuto: parseFloat(datosActualizados.consumoPorMinuto)
      },
      { new: true, runValidators: true }
    );
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    // Actualizar JSON
    await actualizarJSONServicios();
    res.json({
      message: 'Servicio actualizado exitosamente',
      servicio: servicio
    });
  }
  catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({
      error: 'Error al actualizar el servicio',
      detalles: error.message
    });
  }
});

// Eliminar servicio existente
app.delete('/api/servicios/:id', async (req, res) => {
  try { 
    const id = parseInt(req.params.id);
    // Eliminar de MongoDB
    const servicio = await Servicios.findOneAndDelete({ _id: id });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    // Actualizar JSON
    await actualizarJSONServicios();

    res.json({
      message: 'Servicio eliminado exitosamente',
      servicioEliminado: { _id: servicio._id, nombre: servicio.nombre }
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({
      error: 'Error al eliminar el servicio',
      detalles: error.message
    });
  }     
});



// ═══════════════════════════════════════════════════════════════════════════
// 🍰 ENDPOINTS - RECETAS (MongoDB)
// ═══════════════════════════════════════════════════════════════════════════

// Obtener todas las recetas (con costos calculados)
app.get('/api/recetas', async (req, res) => {
  try {
    const recetas = await Receta.find().sort({ _id: 1 });
    const recetasConCostos = recetas.map(receta => enriquecerRecetaConCostos(receta.toObject()));
    res.json(recetasConCostos);
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    res.status(500).json({
      error: 'Error al obtener las recetas',
      detalles: error.message
    });
  }
});

// Obtener receta por ID (con costos calculados)
app.get('/api/recetas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const receta = await Receta.findOne({ _id: id });

    if (receta) {
      res.json(enriquecerRecetaConCostos(receta.toObject()));
    } else {
      res.status(404).json({ error: 'Receta no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener receta:', error);
    res.status(500).json({
      error: 'Error al obtener la receta',
      detalles: error.message
    });
  }
});

// Obtener receta completa con detalles de ingredientes y servicios
app.get('/api/recetas/:id/completa', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const receta = await Receta.findOne({ _id: id });

    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const recetaObj = receta.toObject();

    // Agregar detalles completos de ingredientes
    const ingredientesCompletos = recetaObj.ingredientes.map(item => {
      const ingrediente = ingredientes.find(ing => ing._id === item.idIngrediente);
      return {
        ...item,
        detalles: ingrediente
      };
    });

    // Agregar detalles completos de servicios
    const serviciosCompletos = recetaObj.servicios.map(item => {
      const servicio = servicios.find(serv => serv._id === item.idServicio);
      return {
        ...item,
        detalles: servicio
      };
    });

    const recetaCompleta = {
      ...recetaObj,
      ingredientes: ingredientesCompletos,
      servicios: serviciosCompletos,
      costos: calcularCostosReceta(recetaObj)
    };

    res.json(recetaCompleta);
  } catch (error) {
    console.error('Error al obtener receta completa:', error);
    res.status(500).json({
      error: 'Error al obtener la receta completa',
      detalles: error.message
    });
  }
});

// Crear nueva receta
app.post('/api/recetas', async (req, res) => {
  try {
    const nuevaReceta = req.body;

    // Validaciones básicas
    if (!nuevaReceta.nombre || !nuevaReceta.tiempoPreparacion) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: nombre y tiempoPreparacion son obligatorios'
      });
    }

    // Generar nuevo ID
    const ultimaReceta = await Receta.findOne().sort({ _id: -1 });
    const nuevoId = ultimaReceta ? ultimaReceta._id + 1 : 1;

    // Crear objeto de receta con estructura correcta
    const recetaParaGuardar = {
      _id: nuevoId,
      nombre: nuevaReceta.nombre,
      tiempoPreparacion: parseFloat(nuevaReceta.tiempoPreparacion),
      ingredientes: nuevaReceta.ingredientes || [],
      servicios: nuevaReceta.servicios || [],
      porcentajeGanancia: parseFloat(nuevaReceta.porcentajeGanancia) || 0,
      pasosASeguir: nuevaReceta.pasosASeguir || [],
      rutaFoto: nuevaReceta.rutaFoto || "",
      videoUrl: nuevaReceta.videoUrl || ""
    };

    // Guardar en MongoDB
    const recetaGuardada = await Receta.create(recetaParaGuardar);

    // Retornar receta con costos calculados
    const recetaConCostos = enriquecerRecetaConCostos(recetaGuardada.toObject());

    res.status(201).json({
      message: 'Receta creada exitosamente',
      receta: recetaConCostos
    });
  } catch (error) {
    console.error('Error al crear receta:', error);
    res.status(500).json({
      error: 'Error al crear la receta',
      detalles: error.message
    });
  }
});

// Actualizar receta existente
app.put('/api/recetas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosActualizados = req.body;

    // Validaciones básicas
    if (!datosActualizados.nombre || !datosActualizados.tiempoPreparacion) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: nombre y tiempoPreparacion son obligatorios'
      });
    }

    // Actualizar receta manteniendo el ID original
    const recetaActualizada = {
      nombre: datosActualizados.nombre,
      tiempoPreparacion: parseFloat(datosActualizados.tiempoPreparacion),
      ingredientes: datosActualizados.ingredientes || [],
      servicios: datosActualizados.servicios || [],
      porcentajeGanancia: parseFloat(datosActualizados.porcentajeGanancia) || 0,
      pasosASeguir: datosActualizados.pasosASeguir || [],
      rutaFoto: datosActualizados.rutaFoto || "",
      videoUrl: datosActualizados.videoUrl || ""
    };

    // Actualizar en MongoDB
    const receta = await Receta.findOneAndUpdate(
      { _id: id },
      recetaActualizada,
      { new: true, runValidators: true }
    );

    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    // Retornar receta con costos calculados
    const recetaConCostos = enriquecerRecetaConCostos(receta.toObject());

    res.json({
      message: 'Receta actualizada exitosamente',
      receta: recetaConCostos
    });
  } catch (error) {
    console.error('Error al actualizar receta:', error);
    res.status(500).json({
      error: 'Error al actualizar la receta',
      detalles: error.message
    });
  }
});

// Eliminar receta existente
app.delete('/api/recetas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Eliminar de MongoDB
    const receta = await Receta.findOneAndDelete({ _id: id });

    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    res.json({
      message: 'Receta eliminada exitosamente',
      recetaEliminada: { _id: receta._id, nombre: receta.nombre }
    });
  } catch (error) {
    console.error('Error al eliminar receta:', error);
    res.status(500).json({
      error: 'Error al eliminar la receta',
      detalles: error.message
    });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 Llamar a POST /api/sync desde el cliente para sincronizar datos`);
});
