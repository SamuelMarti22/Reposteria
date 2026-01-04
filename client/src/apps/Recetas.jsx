import "./Recetas.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BotonAgregar from "../components/BotonAgregar";
import RecipeCard from "../components/RecetasComponents/RecipeCard";

export default function Recetas() {
  const navigate = useNavigate();
  
  // ═══════════════════════════════════════════════════════════════════════
  // 🔧 STATES
  // ═══════════════════════════════════════════════════════════════════════
  const [palabraActual, setPalabraActual] = useState("");
  const [recetas, setRecetas] = useState([]);
  const [recetasFiltradas, setRecetasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ═══════════════════════════════════════════════════════════════════════
  // 📥 CARGAR RECETAS AL MONTAR EL COMPONENTE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/recetas");

        if (!response.ok) {
          throw new Error("Error al cargar las recetas");
        }

        const data = await response.json();
        setRecetas(data);
        setRecetasFiltradas(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar recetas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarRecetas();
  }, []);

  // ═══════════════════════════════════════════════════════════════════════
  // 🔍 FILTRAR RECETAS CUANDO CAMBIA LA BÚSQUEDA
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (palabraActual.trim() === "") {
      setRecetasFiltradas(recetas);
    } else {
      const filtradas = recetas.filter((receta) =>
        receta.nombre.toLowerCase().includes(palabraActual.toLowerCase())
      );
      setRecetasFiltradas(filtradas);
    }
  }, [palabraActual, recetas]);

  // ═══════════════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ═══════════════════════════════════════════════════════════════════════

  console.log("Búsqueda actual:", palabraActual);
  console.log("Recetas filtradas:", recetasFiltradas);

  return (
    <div className="recetas-container">
      <div className="recetas-header">
        <SearchBar
          placeholder="Buscar recetas..."
          onSearch={setPalabraActual}
        />
        <BotonAgregar variant="primary" onClick={() => {navigate('/recetas/nueva')}} icon={"+"}>
          Agregar Receta
        </BotonAgregar>
      </div>

      {/* Área de contenido */}
      <div className="recetas-content">
        {loading && <p>Cargando recetas...</p>}

        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
          </div>
        )}

        {!loading && !error && recetasFiltradas.length === 0 && (
          <p>No se encontraron recetas</p>
        )}

        {!loading && !error && recetasFiltradas.length > 0 && (
          <div className="recetas-grid">
            {recetasFiltradas.map((receta) => (
              <RecipeCard
                key={receta._id}
                imagen={receta.rutaFoto}
                nombre={receta.nombre}
                tiempoPreparacion={receta.tiempoPreparacion}
                costoTiempoPreparacion={`$${receta.costos.costoTiempoPreparacion.toLocaleString('es-CO')}`}
                precioVenta={`$${receta.costos.precioVenta.toLocaleString('es-CO')}`}
                costoProduccion={`$${receta.costos.costoProduccion.toLocaleString('es-CO')}`}
                ganancia={`$${receta.costos.ganancia.toLocaleString('es-CO')}`}
                porcentajeGanancia={receta.costos.porcentajeGanancia}
                onClick={() => navigate(`/recetas/${receta._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
