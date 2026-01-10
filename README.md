# 🍰 Repostería Caro - Sistema de Gestión

Sistema completo de gestión de recetas de repostería con cálculo automático de costos y rentabilidad.

## 🚀 **Inicio Rápido (Windows 11)**

### **Primera vez:**

```bash
# 1. Clonar repositorio
git clone https://github.com/SamuelMarti22/Reposteria.git
cd Reposteria

# 2. Instalar dependencias
npm run install:all

# 3. Asegurarse que Docker Desktop esté corriendo

# 4. Iniciar todo
npm run dev
```

### **Uso diario:**

**Opción 1 - Más Fácil:**
```
Doble clic en start.bat
```

**Opción 2 - Terminal:**
```bash
npm run dev
```

Ver más opciones en [INICIO_AUTOMATICO.md](INICIO_AUTOMATICO.md)

---

## 📦 **Requisitos**

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Docker Desktop** ([Descargar](https://www.docker.com/products/docker-desktop/))
- **Git** ([Descargar](https://git-scm.com/))

---

## 🏗️ **Arquitectura**

```
📁 Reposteria/
├── 📄 start.bat           # Inicio automático (Windows)
├── 📄 start.ps1           # Inicio PowerShell
├── 📄 stop.bat            # Detener servicios
├── 📄 package.json        # Scripts coordinados
├── 📄 docker-compose.yml  # MongoDB
├── 📄 .env                # Variables de entorno
│
├── 📁 server/             # Backend (Express + MongoDB)
│   ├── server.js
│   ├── models/
│   ├── config/
│   └── database/
│
└── 📁 client/             # Frontend (React + Vite)
    ├── src/
    │   ├── apps/
    │   └── components/
    └── public/
```

---

## 🔗 **URLs**

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

---

## 📚 **Documentación**

- [Inicio Automático](INICIO_AUTOMATICO.md) - Scripts y configuración
- [Guía de Migración](MIGRATION_GUIDE.md) - MongoDB setup
- [Flujo de Imágenes](FLUJO_IMAGENES.md) - Manejo de archivos

---

## 🛠️ **Comandos NPM**

```bash
# Desarrollo
npm run dev              # Inicia todo (Docker + Backend + Frontend)
npm run server           # Solo backend
npm run client           # Solo frontend

# Gestión
npm run stop             # Detiene Docker
npm run install:all      # Instala todas las dependencias
npm run clean            # Limpia node_modules
```

---

## 🎯 **Características**

- ✅ Gestión de recetas con ingredientes y servicios
- ✅ Cálculo automático de costos de producción
- ✅ Cálculo de precio de venta según % ganancia
- ✅ Manejo de imágenes
- ✅ Pasos de preparación detallados
- ✅ Videos de YouTube opcionales
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Alertas modernas con SweetAlert2
- ✅ Base de datos MongoDB

---

## 🗄️ **Base de Datos**

### **MongoDB (Contenedor Docker):**
- **Recetas**: Almacenadas en MongoDB con Mongoose

### **JSON (Archivos locales):**
- **Ingredientes**: `server/database/ingredientes.json`
- **Servicios**: `server/database/servicios.json`

---

## 🧪 **Testing**

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

---

## 📝 **Variables de Entorno**

Archivo `.env` en la raíz:

```properties
# Server
SERVER_PORT=5000

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DATABASE=reposteria_db
MONGO_PORT=27017
MONGO_URI=mongodb://admin:admin123@localhost:27017/reposteria_db?authSource=admin
```

---

## 🔧 **Troubleshooting**

### **Docker no inicia:**
```bash
# Verificar
docker ps

# Reiniciar
docker-compose down
docker-compose up -d
```

### **Puerto ocupado:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### **Error de MongoDB:**
```bash
# Ver logs
docker-compose logs -f
```

Ver más en [INICIO_AUTOMATICO.md](INICIO_AUTOMATICO.md#-solución-de-problemas)

---

## 👥 **Contribuir**

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 **Créditos**

Desarrollado con ❤️ para Repostería Caro

- **Backend**: Express.js + MongoDB + Mongoose
- **Frontend**: React 19 + Vite
- **UI**: Lucide React Icons
- **Alertas**: SweetAlert2
- **Base de Datos**: MongoDB (Docker)

---

## 📞 **Soporte**

¿Problemas? Abre un [Issue](https://github.com/SamuelMarti22/Reposteria/issues)

---

**¡Feliz horneado! 🍰**
