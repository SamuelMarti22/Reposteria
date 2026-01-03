/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCRIPT DE INICIALIZACIÓN DE MONGODB - REPOSTERÍA CARO
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Este script crea las colecciones con sus validadores de esquema.
 * 
 * COLECCIONES:
 * - ingredientes: Materias primas para las recetas
 * - servicios: Recursos consumibles (gas, electricidad, etc.)
 * - recetas: Productos finales con sus costos y pasos
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📦 COLECCIÓN: INGREDIENTES
// ═══════════════════════════════════════════════════════════════════════════
// Almacena las materias primas utilizadas en las recetas
// ═══════════════════════════════════════════════════════════════════════════

db.createCollection('ingredientes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nombre', 'unidadMedida', 'cantidad', 'precioPorUnidad'],
      properties: {
        nombre: {
          bsonType: 'string',
          description: 'Nombre del ingrediente - requerido'
        },
        unidadMedida: {
          bsonType: 'string',
          description: 'Unidad de medida (kg, litros, unidad, gramos, ml) - requerido'
        },
        cantidad: {
          bsonType: 'number',
          minimum: 0,
          description: 'Cantidad disponible en stock - requerido'
        },
        precioPorUnidad: {
          bsonType: 'number',
          minimum: 0,
          description: 'Precio por unidad de medida - requerido'
        }
      }
    }
  }
});

print("✅ Colección 'ingredientes' creada con validadores");

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ COLECCIÓN: SERVICIOS
// ═══════════════════════════════════════════════════════════════════════════
// Recursos consumibles por minuto (gas, electricidad, agua, etc.)
// ═══════════════════════════════════════════════════════════════════════════

db.createCollection('servicios', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nombre', 'consumoPorMinuto'],
      properties: {
        nombre: {
          bsonType: 'string',
          description: 'Nombre del servicio - requerido'
        },
        consumoPorMinuto: {
          bsonType: 'number',
          minimum: 0,
          description: 'Costo en $ por minuto de uso - requerido'
        }
      }
    }
  }
});

print("✅ Colección 'servicios' creada con validadores");

// ═══════════════════════════════════════════════════════════════════════════
// 🍰 COLECCIÓN: RECETAS
// ═══════════════════════════════════════════════════════════════════════════
// Productos finales con ingredientes, servicios, pasos y costos
// ═══════════════════════════════════════════════════════════════════════════

db.createCollection('recetas', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nombre', 'tiempoPreparacion', 'ingredientes', 'servicios', 'porcentajeGanancia', 'pasosASeguir'],
      properties: {
        nombre: {
          bsonType: 'string',
          description: 'Nombre de la receta - requerido'
        },
        tiempoPreparacion: {
          bsonType: 'number',
          minimum: 0,
          description: 'Tiempo de preparación en minutos - requerido'
        },
        ingredientes: {
          bsonType: 'array',
          description: 'Lista de ingredientes necesarios - requerido',
          items: {
            bsonType: 'object',
            required: ['idIngrediente', 'cantidad'],
            properties: {
              idIngrediente: {
                bsonType: 'number',
                description: 'ID del ingrediente - requerido'
              },
              cantidad: {
                bsonType: 'number',
                minimum: 0,
                description: 'Cantidad del ingrediente - requerido'
              }
            }
          }
        },
        servicios: {
          bsonType: 'array',
          description: 'Lista de servicios utilizados - requerido',
          items: {
            bsonType: 'object',
            required: ['idServicio', 'cantidadTiempo'],
            properties: {
              idServicio: {
                bsonType: 'number',
                description: 'ID del servicio - requerido'
              },
              cantidadTiempo: {
                bsonType: 'number',
                minimum: 0,
                description: 'Cantidad de tiempo en minutos - requerido'
              }
            }
          }
        },
        porcentajeGanancia: {
          bsonType: 'number',
          minimum: 0,
          maximum: 100,
          description: 'Porcentaje de ganancia (0-100) - requerido'
        },
        pasosASeguir: {
          bsonType: 'array',
          description: 'Pasos de la receta - requerido',
          items: {
            bsonType: 'string'
          }
        },
        videoYoutube: {
          bsonType: 'string',
          description: 'Link al video de YouTube (opcional)'
        },
        rutaFoto: {
          bsonType: 'string',
          description: 'Ruta de la imagen de la receta (opcional)'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Fecha de creación del registro'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Fecha de última actualización'
        }
      }
    }
  }
});

print("✅ Colección 'recetas' creada con validadores");

// ═══════════════════════════════════════════════════════════════════════════
// 📊 RESUMEN
// ═══════════════════════════════════════════════════════════════════════════

print("\n🎉 BASE DE DATOS INICIALIZADA CORRECTAMENTE");
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
print("📦 Colección 'ingredientes' creada");
print("⚡ Colección 'servicios' creada");
print("🍰 Colección 'recetas' creada");
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
