import React, { useEffect, useState } from "react";
import CatCard from "./CatCard"; // Importa el nuevo componente

export const CatGallery = () => {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/`);
        if (!response.ok) {
          throw new Error("Error al obtener los gatos");
        }

        const data = await response.json();
        setCats(data.cats); 
      } catch (error) {
        console.error("Error al cargar los gatos:", error);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center fs-2 fw-bold">Nuestros Gatos</h2>
      <div className="d-flex flex-wrap justify-content-center">
        {cats.map((cat) => (
          <CatCard key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
};