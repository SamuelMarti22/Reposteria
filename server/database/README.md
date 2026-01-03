# 📁 Base de Datos - Archivos JSON

Esta carpeta contiene los archivos JSON que almacenan los datos de la aplicación de repostería.

## 📋 Archivos Disponibles

### 📦 `ingredientes.json`
Contiene la lista de ingredientes disponibles con sus características:
- `_id`: Identificador único (number)
- `nombre`: Nombre del ingrediente (string)
- `unidadMedida`: Unidad de medida (kg, litros, unidad, gramos, ml)
- `cantidad`: Cantidad disponible en stock (number)
- `precioPorUnidad`: Precio por unidad de medida (number)

### ⚡ `servicios.json`
Contiene los servicios consumibles (gas, electricidad, etc.):
- `_id`: Identificador único (number)
- `nombre`: Nombre del servicio (string)
- `consumoPorMinuto`: Costo en $ por minuto de uso (number)

### 🍰 `recetas.json`
Contiene las recetas completas:
- `_id`: Identificador único (number)
- `nombre`: Nombre de la receta (string)
- `tiempoPreparacion`: Tiempo en minutos (number)
- `ingredientes`: Array de objetos con:
  - `idIngrediente`: ID del ingrediente (referencia a ingredientes.json)
  - `cantidad`: Cantidad necesaria
- `servicios`: Array de objetos con:
  - `idServicio`: ID del servicio (referencia a servicios.json)
  - `cantidadTiempo`: Minutos de uso
- `porcentajeGanancia`: Margen de ganancia (0-100)
- `pasosASeguir`: Array de strings con instrucciones
- `videoYoutube`: Link al video (opcional)
- `rutaFoto`: Ruta de la imagen (opcional)

## 🚀 Uso en el Backend

```javascript
// Leer los datos
const ingredientes = require('./database/ingredientes.json');
const servicios = require('./database/servicios.json');
const recetas = require('./database/recetas.json');

// Ejemplo: Obtener un ingrediente por ID
const getIngredienteById = (id) => {
  return ingredientes.find(ing => ing._id === id);
};

// Ejemplo: Calcular costo de una receta
const calcularCostoReceta = (recetaId) => {
  const receta = recetas.find(r => r._id === recetaId);
  
  // Costo de ingredientes
  const costoIngredientes = receta.ingredientes.reduce((total, item) => {
    const ingrediente = getIngredienteById(item.idIngrediente);
    return total + (ingrediente.precioPorUnidad * item.cantidad);
  }, 0);
  
  // Costo de servicios
  const costoServicios = receta.servicios.reduce((total, item) => {
    const servicio = servicios.find(s => s._id === item.idServicio);
    return total + (servicio.consumoPorMinuto * item.cantidadTiempo);
  }, 0);
  
  const costoTotal = costoIngredientes + costoServicios;
  const precioVenta = costoTotal * (1 + receta.porcentajeGanancia / 100);
  
  return {
    costoTotal,
    precioVenta,
    ganancia: precioVenta - costoTotal
  };
};
```

## 🔄 Sincronización con MongoDB

Para exportar desde MongoDB:
```bash
mongoexport --db=reposteriaCaro --collection=ingredientes --out=ingredientes.json --jsonArray
mongoexport --db=reposteriaCaro --collection=servicios --out=servicios.json --jsonArray
mongoexport --db=reposteriaCaro --collection=recetas --out=recetas.json --jsonArray
```

Para importar a MongoDB:
```bash
mongoimport --db=reposteriaCaro --collection=ingredientes --file=ingredientes.json --jsonArray
mongoimport --db=reposteriaCaro --collection=servicios --file=servicios.json --jsonArray
mongoimport --db=reposteriaCaro --collection=recetas --file=recetas.json --jsonArray
```

## 📝 Notas

- Los archivos JSON se usan para minimizar llamadas a la base de datos
- Mantén sincronizados los IDs entre archivos para las relaciones
- Los campos `_id` deben ser únicos y consecutivos
- Actualiza los JSON cuando modifiques la base de datos
