import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error de conexión'))
  }, [])

  return (
    <div className="container">
      <h1>🍰 Repostería App</h1>
      <p>{message}</p>
    </div>
  )
}

export default App
