const mongoose = require('mongoose');

const ingredientesSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  unidadMedida: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0
  },
  precioPorUnidad: {
    type: Number,
    required: true,
    min: 0
  },
  imagenUrl: {
    type: String,
    default: ''
  }
}, {
  _id: false,
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Ingredientes', ingredientesSchema);
