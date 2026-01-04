const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  tiempoPreparacion: {
    type: Number,
    required: true,
    min: 0
  },
  ingredientes: [{
    idIngrediente: {
      type: Number,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  servicios: [{
    idServicio: {
      type: Number,
      required: true
    },
    cantidadTiempo: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  porcentajeGanancia: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pasosASeguir: [{
    type: String,
    trim: true
  }],
  rutaFoto: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  }
}, {
  _id: false, // Usar el _id personalizado
  timestamps: true, // Agregar createdAt y updatedAt automáticamente
  versionKey: false
});

module.exports = mongoose.model('Receta', recetaSchema);
