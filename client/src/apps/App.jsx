import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import MainLayout from '../components/MainLayout.jsx'
import FullPageLayout from '../components/FullPageLayout.jsx'
import Ingredientes from './Ingredientes.jsx'
import Recetas from './Recetas.jsx'
import Servicios from './Servicios.jsx'
import DetallesReceta from './DetallesReceta.jsx'
import CrearReceta from './CrearReceta.jsx'
import CrearIngrediente from './CrearIngrediente.jsx'

function App() {
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState('recetas')

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error de conexión'))

    fetch('http://localhost:5000/api/sync', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => console.log('✅ Datos sincronizados:', data))
      .catch(err => console.error('❌ Error sincronizando:', err));
  }, [])

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* Rutas CON Header (MainLayout) */}
          <Route element={<MainLayout activeSection={activeSection} setActiveSection={setActiveSection} />}>
            <Route path="/" element={<Navigate to="/recetas" replace />} />
            <Route path="/ingredientes" element={<Ingredientes />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/recetas" element={<Recetas />} />
          </Route>

          {/* Rutas SIN Header (FullPageLayout) */}
          <Route element={<FullPageLayout />}>
            <Route path="/recetas/nueva" element={<CrearReceta />} />
            <Route path="/recetas/editar/:id" element={<CrearReceta />} />
            <Route path="/recetas/:id" element={<DetallesReceta />} />

            <Route path="/ingredientes/nuevo" element={<CrearIngrediente />} />
            <Route path="/ingredientes/editar/:id" element={<CrearIngrediente />} />


          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
