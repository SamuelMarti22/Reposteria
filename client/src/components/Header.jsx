import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    {
      id: 'ingredientes',
      name: 'Ingredientes',
      icon: '🥚',
      path: '/ingredientes'
    },
    {
      id: 'servicios',
      name: 'Servicios',
      icon: '🎂',
      path: '/servicios'
    },
    {
      id: 'recetas',
      name: 'Recetas',
      icon: '📖',
      path: '/recetas'
    }
  ];

  const handleSectionClick = (section) => {
    setActiveSection(section.id);
    navigate(section.path);
  };

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
              onClick={() => handleSectionClick(section)}
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