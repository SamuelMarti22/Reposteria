import React from 'react';
import './Header.css';

export default function Header({ activeSection, setActiveSection }) {
  const sections = [
    {
      id: 'ingredientes',
      name: 'Ingredientes',
      icon: '🥚'
    },
    {
      id: 'servicios',
      name: 'Servicios',
      icon: '🎂'
    },
    {
      id: 'recetas',
      name: 'Recetas',
      icon: '📖'
    }
  ];

  return (
    <div className="admin-header">
      <div className="header-container">
        {/* Title */}
        <div className="header-title">
          <h1 className="main-title">Repostería Caro</h1>
          <p className="subtitle">Panel Administrativo</p>
        </div>

        {/* Navigation Circles */}
        <div className="navigation">
          {sections.map((section) => (
            <div
              key={section.id}
              // Aquí es donde manejamos el cambio de sección
              onClick={() => setActiveSection(section.id)}
              className="nav-item"
            >
              <div className={`nav-circle ${activeSection === section.id ? 'active' : ''}`}>
                <span className="nav-icon">{section.icon}</span>
              </div>
              <span className={`nav-label ${activeSection === section.id ? 'active' : ''}`}>
                {section.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}