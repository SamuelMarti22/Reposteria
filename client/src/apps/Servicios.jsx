import "./Servicios.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SearchBar from "../components/SearchBar";
import BotonAgregar from "../components/BotonAgregar";
import ServicesCard from "../components/IngredientesComponents/ServiciosComponents/ServicesCard";
import ServiceModal from "../components/IngredientesComponents/ServiciosComponents/ServiceModal";

export default function Servicios() {

  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════════════════
  // 🔧 STATES
  // ═══════════════════════════════════════════════════════════════════════
  const [palabraActual, setPalabraActual] = useState("");
  const [servicios, setServicios] = useState([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [isCreatingServicio, setIsCreatingServicio] = useState(false);

  //Cargar servicios al montar el componente
  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/servicios");

        if (!response.ok) {
          throw new Error("Error al cargar los servicios");
        }

        const data = await response.json();
        setServicios(data);
        setServiciosFiltrados(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarServicios();
  }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // 🔍 FILTRAR SERVICIOS CUANDO CAMBIA LA BÚSQUEDA
    // ═══════════════════════════════════════════════════════════════════════
    useEffect(() => {
      if (palabraActual.trim() === "") {
        setServiciosFiltrados(servicios);
      } else {
        const filtradas = servicios.filter((servicio) =>
          servicio.nombre.toLowerCase().includes(palabraActual.toLowerCase())
        );
        setServiciosFiltrados(filtradas);
      }
    }, [palabraActual, servicios]);

  // ═══════════════════════════════════════════════════════════════════════
  // 🎯 ABRIR MODAL CON SERVICIO SELECCIONADO
  // ═══════════════════════════════════════════════════════════════════════
  const handleAbrirModal = (servicio) => {
    setServicioSeleccionado(servicio);
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setServicioSeleccionado(null);
    setIsCreatingServicio(false);
  };

  const handleAbrirModalCrear = () => {
    setServicioSeleccionado(null);
    setIsCreatingServicio(true);
    setModalOpen(true);
  };

  const handleEditarServicio = () => {
    if (servicioSeleccionado) {
      // Recargar servicios después de editar
      cargarServicios();
      handleCerrarModal();
    }
  };

  const cargarServicios = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/servicios");
      if (response.ok) {
        const data = await response.json();
        setServicios(data);
        setServiciosFiltrados(data);
      }
    } catch (err) {
      console.error("Error al recargar servicios:", err);
    }
  };

  const handleEliminarServicio = async () => {
    if (servicioSeleccionado) {
      try {
        const response = await fetch(`http://localhost:5000/api/servicios/${servicioSeleccionado._id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setServicios(servicios.filter(s => s._id !== servicioSeleccionado._id));
          handleCerrarModal();
          await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Servicio eliminado exitosamente',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#f97316',
            timer: 2000,
            timerProgressBar: true
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al eliminar el servicio',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#f97316'
          });
        }
      } catch (err) {
        console.error('Error al eliminar servicio:', err);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar el servicio',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };

  return (
    <div className="servicios-container">
      <div className="servicios-header">
        <SearchBar
          placeholder="Buscar servicios..."
          onSearch={setPalabraActual}
        />
        <BotonAgregar variant="primary" onClick={handleAbrirModalCrear} icon={"+"}>
          Agregar Servicio
        </BotonAgregar>
      </div>

      <div className="servicios-content">
        {loading && <p>Cargando servicios...</p>}

        {error && (
          <div className="error-message">
            <p>❌ Error: {error}</p>
          </div>
        )}

        {!loading && !error && serviciosFiltrados.length === 0 && (
          <p>No se encontraron servicios.</p>
        )}

        {!loading && !error && serviciosFiltrados.length > 0 && (
          <div className="servicios-grid">
            {serviciosFiltrados.map((servicio) => (
              <ServicesCard
                key={servicio._id}
                id={servicio._id}
                imagen={servicio.imagen}
                nombre={servicio.nombre}
                consumoPorMinuto={servicio.consumoPorMinuto}
                onClick={() => handleAbrirModal(servicio)}
              /> 
            ))}
          </div>
        )}

        <ServiceModal
          isOpen={modalOpen}
          onClose={handleCerrarModal}
          servicio={servicioSeleccionado}
          onEdit={handleEditarServicio}
          onDelete={handleEliminarServicio}
          isCreating={isCreatingServicio}
        />


      </div>


    </div>
  );
}