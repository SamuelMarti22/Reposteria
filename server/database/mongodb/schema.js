// Script de inicialización de MongoDB
db.createCollection("productos");
db.productos.insertMany([
  {
    _id: 1,
    nombre: "Torta de Chocolate",
    descripcion: "Deliciosa torta de chocolate con relleno de ganache",
    precio: 25.99,
    categoria: "Tortas",
    disponible: true,
    imagen: "torta-chocolate.jpg",
    createdAt: new Date()
  },
  {
    _id: 2,
    nombre: "Cupcakes de Vainilla",
    descripcion: "Cupcakes esponjosos con frosting de vainilla",
    precio: 12.50,
    categoria: "Cupcakes",
    disponible: true,
    imagen: "cupcakes-vainilla.jpg",
    createdAt: new Date()
  },
  {
    _id: 3,
    nombre: "Brownies",
    descripcion: "Brownies de chocolate gourmet",
    precio: 8.99,
    categoria: "Postres",
    disponible: true,
    imagen: "brownies.jpg",
    createdAt: new Date()
  }
]);

print("✅ Colección 'productos' creada con datos de prueba");
