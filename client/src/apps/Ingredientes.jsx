import "./Ingredientes.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import BotonAgregar from "../components/BotonAgregar";
import IngredientCard from "../components/IngredientesComponents/IngredientCard";


export default function Ingredientes() {

  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════════════════
  // 🔧 STATES
  // ═══════════════════════════════════════════════════════════════════════
  const [palabraActual, setPalabraActual] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Cargar ingredientes al montar el componente
  useEffect(() => {
    const cargarIngredientes = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/ingredientes");

        if (!response.ok) {
          throw new Error("Error al cargar los ingredientes");
        }

        const data = await response.json();
        setIngredientes(data);
        setIngredientesFiltrados(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar ingredientes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarIngredientes();
  }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // 🔍 FILTRAR INGREDIENTES CUANDO CAMBIA LA BÚSQUEDA
    // ═══════════════════════════════════════════════════════════════════════
    useEffect(() => {
      if (palabraActual.trim() === "") {
        setIngredientesFiltrados(ingredientes);
      } else {
        const filtradas = ingredientes.filter((ingrediente) =>
          ingrediente.nombre.toLowerCase().includes(palabraActual.toLowerCase())
        );
        setIngredientesFiltrados(filtradas);
      }
    }, [palabraActual, ingredientes]);

  return (
    <div className="ingredientes-container">
      <div className="ingredientes-header">
        <SearchBar
          placeholder="Buscar ingredientes..."
          onSearch={setPalabraActual}
        />
        <BotonAgregar variant="primary" onClick={() => { navigate('/ingredientes/nuevo') }} icon={"+"}>
          Agregar Ingrediente
        </BotonAgregar>
      </div>

      <div className="recetas-content">
        {loading && <p>Cargando ingredientes...</p>}

        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
          </div>
        )}

        {!loading && !error && ingredientesFiltrados.length === 0 && (
          <p>No se encontraron ingredientes.</p>
        )}

        {!loading && !error && ingredientesFiltrados.length > 0 && (
          <div className="ingredientes-grid">
            {ingredientesFiltrados.map((ingrediente) => (
              <IngredientCard
                id={ingrediente._id}
                imagen={ingrediente.imagen}
                nombre={ingrediente.nombre}
                cantidad={ingrediente.cantidad}
                unidad={ingrediente.unidadMedida}
                precioPorUnidad={ingrediente.precioPorUnidad}
                precioTotal={ingrediente.cantidad * ingrediente.precioPorUnidad}
              /> 
            ))}
          </div>
        )}


      </div>


    </div>
  );
}