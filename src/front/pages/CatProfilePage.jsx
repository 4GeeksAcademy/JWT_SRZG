import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CatCard from "../components/CatCard"; // Asegúrate de que este componente esté bien configurado

const CatProfilePage = () => {
  const { catId } = useParams(); // Obtener el id del gato desde la URL
  const [catData, setCatData] = useState(null); // Estado para almacenar la información del gato
  const [loading, setLoading] = useState(true); // Estado de carga

  // useEffect para hacer la solicitud fetch y obtener los datos completos del gato
  useEffect(() => {
    const fetchCat = async () => {
      try {
        const response = await fetch(`https://upgraded-parakeet-jjqppx69xrpx254pg-3001.app.github.dev/api/cats/${catId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del gato");
        }

        const data = await response.json();
        setCatData(data.cat); // Almacena los datos del gato en el estado
      } catch (error) {
        console.error("Error fetching cat data:", error);
      } finally {
        setLoading(false); // Cambia el estado de 'loading' a false cuando la solicitud termine
      }
    };

    fetchCat(); // Realiza la solicitud cuando se monta el componente
  }, [catId]);

  if (loading) {
    return <div>Cargando...</div>; // Muestra "Cargando..." mientras se obtienen los datos
  }

  return (
    <div className="container py-4">
      <h2 className="text-center fs-2 fw-bold">{catData.name}</h2>
      {/* Usamos el componente CatCard para mostrar el perfil completo */}
      <CatCard cat={catData} />
    </div>
  );
};

export default CatProfilePage;