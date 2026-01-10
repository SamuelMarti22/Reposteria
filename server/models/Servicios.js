const mongoose = require('mongoose');

const serviciosSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  consumoPorMinuto: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  _id: false,
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Servicios', serviciosSchema);
