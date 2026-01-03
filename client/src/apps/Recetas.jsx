import "./Recetas.css";
import { useState, useEffect } from 'react'
import SearchBar from "../components/SearchBar";
import BotonAgregar from "../components/BotonAgregar";

export default function Recetas() {
  const [palabraActual, setPalabraActual] = useState('');
  console.log(palabraActual);
  return (
    <div className="recetas-container">
      <div className="recetas-header">
        <SearchBar onSearch={setPalabraActual} />
        <BotonAgregar variant="primary" onClick={() => {}} icon={"+"}>
          Agregar Receta
        </BotonAgregar>
      </div>
    </div>
  );
}
