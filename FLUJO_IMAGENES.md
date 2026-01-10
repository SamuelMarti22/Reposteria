# 📸 FLUJO DE IMÁGENES EN LA APLICACIÓN

## Resumen General
Las imágenes se manejan como **strings en Base64** desde que se seleccionan en el cliente hasta que se almacenan en MongoDB. No se suben a un servidor de archivos separado.

---

## 🔄 FLUJO COMPLETO

### 1️⃣ CLIENTE: Selección y Conversión de Imagen
**Archivo:** `client/src/apps/CrearReceta.jsx` (líneas 256-276)

```javascript
const handleImageUpload = (e) => {
  const file = e.target.files[0];  // El usuario selecciona la imagen
  if (file) {
    const reader = new FileReader();  // Crear lector de archivos
    reader.onloadend = () => {
      setImagePreview(reader.result);  // Mostrar preview
      setFormData({ ...formData, image: reader.result });  // Guardar en estado
    };
    reader.readAsDataURL(file);  // Convertir a Base64
  }
};
```

**Lo que sucede:**
- ✅ Usuario selecciona imagen del sistema
- ✅ Se convierte a **string Base64** (ejemplo: `data:image/png;base64,iVBORw0KGgo...`)
- ✅ Se muestra preview de la imagen
- ✅ Se almacena en `formData.image` como string

---

### 2️⃣ CLIENTE: Envío de Datos al Servidor
**Archivo:** `client/src/apps/CrearReceta.jsx` (líneas 325-365)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // Preparar datos para enviar
  const recetaData = {
    nombre: formData.name,
    tiempoPreparacion: parseFloat(formData.tiempo),
    porcentajeGanancia: parseFloat(formData.porcentajeGanancia),
    videoUrl: formData.videoUrl || "",
    ingredientes: [...],
    servicios: [...],
    pasosASeguir: [...],
    rutaFoto: formData.image || "",  // 👈 AQUÍ VA EL STRING BASE64
  };

  // Enviar como JSON
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",  // ← JSON, no FormData
    },
    body: JSON.stringify(recetaData),  // Convertir objeto a JSON
  });
};
```

**Lo que sucede:**
- ✅ Se prepara un objeto `recetaData` con todos los datos
- ✅ `rutaFoto` contiene el **string Base64** completo de la imagen
- ✅ Todo se envía como **JSON** en el body de la petición
- ✅ La imagen viaja como un string de texto muy largo

**Ejemplo de lo que se envía:**
```json
{
  "nombre": "Pastel de Chocolate",
  "tiempoPreparacion": 45,
  "rutaFoto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
  "ingredientes": [...],
  "servicios": [...],
  "pasosASeguir": [...]
}
```

---

### 3️⃣ SERVIDOR: Recepción y Almacenamiento en MongoDB
**Archivo:** `server/server.js` (líneas 558-594)

```javascript
app.post('/api/recetas', async (req, res) => {
  try {
    const nuevaReceta = req.body;

    // Validaciones básicas
    if (!nuevaReceta.nombre || !nuevaReceta.tiempoPreparacion) {
      return res.status(400).json({
        error: 'Faltan datos requeridos...'
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
      rutaFoto: nuevaReceta.rutaFoto || "",  // 👈 AQUÍ LLEGA LA IMAGEN
      videoUrl: nuevaReceta.videoUrl || ""
    };

    // Guardar en MongoDB
    const recetaGuardada = await Receta.create(recetaParaGuardar);
    
    // Retornar respuesta
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
```

**Lo que sucede:**
- ✅ El servidor recibe el JSON con `rutaFoto` como string Base64
- ✅ Se validan los datos requeridos (nombre, tiempoPreparacion)
- ✅ Se genera un nuevo ID secuencial
- ✅ Se crea el objeto `recetaParaGuardar` con TODOS los datos incluida la imagen
- ✅ Se guarda en MongoDB

---

### 4️⃣ BASE DE DATOS: Estructura en MongoDB
**Archivo:** `server/models/Receta.js`

```javascript
const recetaSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  nombre: { type: String, required: true, trim: true },
  tiempoPreparacion: { type: Number, required: true, min: 0 },
  ingredientes: [
    {
      idIngrediente: { type: Number, required: true },
      cantidad: { type: Number, required: true, min: 0 }
    }
  ],
  servicios: [
    {
      idServicio: { type: Number, required: true },
      cantidadTiempo: { type: Number, required: true, min: 0 }
    }
  ],
  porcentajeGanancia: { type: Number, required: true, min: 0, max: 100 },
  pasosASeguir: [{ type: String, trim: true }],
  rutaFoto: {  // 👈 AQUÍ SE ALMACENA LA IMAGEN
    type: String,
    default: ''
  },
  videoUrl: { type: String, default: '' }
});
```

**Lo que sucede:**
- ✅ MongoDB almacena `rutaFoto` como un **string de texto**
- ✅ El string contiene toda la imagen codificada en Base64
- ✅ Se almacena directamente en el documento sin procesamiento adicional

**Ejemplo de lo que se guarda en MongoDB:**
```javascript
{
  _id: 1,
  nombre: "Pastel de Chocolate",
  tiempoPreparacion: 45,
  rutaFoto: "data:image/png;base64,iVBORw0KGgoAAAANSU...",
  ingredientes: [...],
  servicios: [...],
  pasosASeguir: [...],
  createdAt: "2026-01-09T...",
  updatedAt: "2026-01-09T..."
}
```

---

## 📊 DIAGRAMA VISUAL

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENTE (React)                             │
│                                                                   │
│  1. Usuario selecciona imagen                                   │
│     ↓                                                            │
│  2. FileReader convierte a Base64                              │
│     Ejemplo: "data:image/png;base64,iVBORw0KGgo..."           │
│     ↓                                                            │
│  3. Se guarda en formData.image                                 │
│     ↓                                                            │
│  4. Se muestra preview (HTML img src=)                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓ (JSON POST)
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Express)                            │
│                                                                   │
│  5. Recibe JSON con rutaFoto = "data:image/png;base64,..."    │
│     ↓                                                            │
│  6. Valida datos básicos                                        │
│     ↓                                                            │
│  7. Crea objeto recetaParaGuardar con rutaFoto                │
│     ↓                                                            │
│  8. Guarda en MongoDB: Receta.create()                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS (MongoDB)                        │
│                                                                   │
│  9. Almacena documento con rutaFoto como string Base64         │
│     {                                                            │
│       _id: 1,                                                   │
│       nombre: "Pastel de Chocolate",                           │
│       rutaFoto: "data:image/png;base64,iVBORw0KGgo...",      │
│       ...otros campos                                           │
│     }                                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 CÓMO SE MUESTRA LA IMAGEN

**En la lista de recetas** (`client/src/components/RecetasComponents/RecipeCard.jsx`):
```jsx
<img src={receta.rutaFoto} alt={receta.nombre} />
```

El navegador interpreta automáticamente:
- Si `src` contiene `"data:image/png;base64,..."` → muestra la imagen
- El string Base64 es una representación de la imagen codificada

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### ✅ Ventajas del enfoque actual:
1. **Simple**: No requiere gestión de archivos en el servidor
2. **Todo en uno**: Imagen y datos juntos en MongoDB
3. **Portabilidad**: La imagen viaja con el documento
4. **Rápido para prototipos**: Fácil de implementar

### ⚠️ Limitaciones del enfoque actual:
1. **Peso**: Las imágenes Base64 son ~33% más grandes que archivos binarios
2. **Rendimiento**: Strings muy largos pueden ralentizar queries de BD
3. **Escalabilidad**: MongoDB almacena strings enormes en cada documento
4. **Actualización**: Para cambiar una imagen hay que reenviar todo el string

### 💡 Ejemplo de tamaño:
```
Imagen JPEG original: 50 KB
Convertida a Base64: ~67 KB (33% mayor)
En MongoDB: Almacena los 67 KB como string
```

---

## 🔄 FLUJO PARA INGREDIENTES Y SERVICIOS

**Similar pero con variable diferente:**

### Ingredientes (CrearIngrediente.jsx):
```javascript
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({
        ...prev,
        imagen: reader.result  // Base64
      }));
    };
    reader.readAsDataURL(file);
  }
};
```

Luego se envía como:
```javascript
const ingredienteData = {
  nombre: formData.nombre,
  unidadMedida: formData.unidad,
  cantidad: parseFloat(formData.cantidad),
  precioPorUnidad: valorPorUnidad,
  imagen: formData.imagen  // Base64
};
```

### Servicios (ServiceModal.jsx):
El flujo es idéntico, la imagen se almacena en `formData.imagen`.

---

## 📝 RESUMEN RÁPIDO

| Paso | Qué sucede | Formato | Ubicación |
|------|-----------|---------|-----------|
| **1. Selección** | Usuario elige imagen | Archivo binario | Disco local |
| **2. Conversión** | Se convierte a Base64 | String: `data:image/...;base64,xxx` | Memoria del navegador |
| **3. Almacenamiento temporal** | Se guarda en estado React | String Base64 | Estado `formData` |
| **4. Preview** | Se muestra en formulario | HTML `<img src=string>` | DOM |
| **5. Envío** | Se envía al servidor | String en JSON | Request body |
| **6. Recepción servidor** | Se recibe en `req.body` | String Base64 | Variables de Express |
| **7. Guardado BD** | Se almacena en MongoDB | String en documento | Documento Receta/Ingrediente/Servicio |
| **8. Recuperación** | Se obtiene de MongoDB | String Base64 | Query result |
| **9. Visualización** | Se muestra en cliente | HTML `<img src=string>` | DOM |
