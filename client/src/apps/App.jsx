import { useState, useEffect } from 'react'
import './App.css'
import Header from '../components/Header.jsx'
import Ingredientes from './Ingredientes.jsx'
import Recetas from './Recetas.jsx'
import Servicios from './Servicios.jsx'

function App() {
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState('recetas')

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error de conexión'))
  }, [])

  // Función para renderizar el componente activo
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'ingredientes':
        return <Ingredientes />
      case 'servicios':
        return <Servicios />
      case 'recetas':
        return <Recetas />
      default:
        return <Recetas />
    }
  }

  return (
    <div className="app-container">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      <div className="container">
        {renderActiveSection()}
      </div>
    </div>
  )
}

export default App
