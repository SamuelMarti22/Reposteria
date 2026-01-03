# 📚 Documentación de API - Repostería Caro

## 🌐 Base URL
```
http://localhost:5000
```

---

## 📦 Ingredientes

### GET `/api/ingredientes`
Obtiene todos los ingredientes disponibles.

**Respuesta exitosa (200):**
```json
[
  {
    "_id": 1,
    "nombre": "Harina de trigo",
    "unidadMedida": "kg",
    "cantidad": 50,
    "precioPorUnidad": 1.50
  }
]
```

### GET `/api/ingredientes/:id`
Obtiene un ingrediente específico por ID.

**Parámetros:**
- `id` (number) - ID del ingrediente

**Respuesta exitosa (200):**
```json
{
  "_id": 1,
  "nombre": "Harina de trigo",
  "unidadMedida": "kg",
  "cantidad": 50,
  "precioPorUnidad": 1.50
}
```

---

## ⚡ Servicios

### GET `/api/servicios`
Obtiene todos los servicios disponibles.

**Respuesta exitosa (200):**
```json
[
  {
    "_id": 1,
    "nombre": "Gas de horno",
    "consumoPorMinuto": 0.05
  }
]
```

### GET `/api/servicios/:id`
Obtiene un servicio específico por ID.

**Parámetros:**
- `id` (number) - ID del servicio

**Respuesta exitosa (200):**
```json
{
  "_id": 1,
  "nombre": "Gas de horno",
  "consumoPorMinuto": 0.05
}
```

---

## 🍰 Recetas

### GET `/api/recetas`
Obtiene todas las recetas con **costos calculados automáticamente**.

**Respuesta exitosa (200):**
```json
[
  {
    "_id": 1,
    "nombre": "Torta de Chocolate Clásica",
    "tiempoPreparacion": 90,
    "ingredientes": [
      { "idIngrediente": 1, "cantidad": 0.5 },
      { "idIngrediente": 2, "cantidad": 0.3 }
    ],
    "servicios": [
      { "idServicio": 1, "cantidadTiempo": 45 }
    ],
    "porcentajeGanancia": 40,
    "pasosASeguir": ["Paso 1", "Paso 2"],
    "videoYoutube": "https://www.youtube.com/watch?v=ejemplo1",
    "rutaFoto": "/images/recetas/torta-chocolate.jpg",
    "costos": {
      "costoIngredientes": 1.85,
      "costoServicios": 2.25,
      "costoProduccion": 4.10,
      "precioVenta": 5.74,
      "ganancia": 1.64,
      "porcentajeGanancia": 40
    }
  }
]
```

### GET `/api/recetas/:id`
Obtiene una receta específica con costos calculados.

**Parámetros:**
- `id` (number) - ID de la receta

**Respuesta exitosa (200):**
```json
{
  "_id": 1,
  "nombre": "Torta de Chocolate Clásica",
  "costos": {
    "costoIngredientes": 1.85,
    "costoServicios": 2.25,
    "costoProduccion": 4.10,
    "precioVenta": 5.74,
    "ganancia": 1.64,
    "porcentajeGanancia": 40
  }
}
```

### GET `/api/recetas/:id/completa`
Obtiene una receta con **detalles expandidos** de ingredientes y servicios, más costos calculados.

**Parámetros:**
- `id` (number) - ID de la receta

**Respuesta exitosa (200):**
```json
{
  "_id": 1,
  "nombre": "Torta de Chocolate Clásica",
  "tiempoPreparacion": 90,
  "ingredientes": [
    {
      "idIngrediente": 1,
      "cantidad": 0.5,
      "detalles": {
        "_id": 1,
        "nombre": "Harina de trigo",
        "unidadMedida": "kg",
        "cantidad": 50,
        "precioPorUnidad": 1.50
      }
    }
  ],
  "servicios": [
    {
      "idServicio": 1,
      "cantidadTiempo": 45,
      "detalles": {
        "_id": 1,
        "nombre": "Gas de horno",
        "consumoPorMinuto": 0.05
      }
    }
  ],
  "costos": {
    "costoIngredientes": 1.85,
    "costoServicios": 2.25,
    "costoProduccion": 4.10,
    "precioVenta": 5.74,
    "ganancia": 1.64,
    "porcentajeGanancia": 40
  }
}
```

---

## 💰 Cálculo de Costos

El servidor calcula automáticamente:

1. **Costo de Ingredientes**: 
   ```
   Σ (precioPorUnidad × cantidad) para cada ingrediente
   ```

2. **Costo de Servicios**: 
   ```
   Σ (consumoPorMinuto × cantidadTiempo) para cada servicio
   ```

3. **Costo de Producción**: 
   ```
   costoIngredientes + costoServicios
   ```

4. **Precio de Venta**: 
   ```
   costoProduccion × (1 + porcentajeGanancia/100)
   ```

5. **Ganancia**: 
   ```
   precioVenta - costoProduccion
   ```

---

## 🚨 Códigos de Error

- **404**: Recurso no encontrado
- **500**: Error interno del servidor

**Ejemplo de respuesta de error:**
```json
{
  "error": "Receta no encontrada"
}
```

---

## 📝 Notas

- Todos los precios están redondeados a 2 decimales
- Los costos se calculan en tiempo real basándose en los precios actuales
- Si un ingrediente o servicio no existe, se ignora en el cálculo
