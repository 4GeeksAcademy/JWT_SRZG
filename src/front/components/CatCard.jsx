import React from "react";
import { Link } from "react-router-dom";

const CatCard = ({ cat }) => {
  return (
    <div className="card m-2 shadow-sm" style={{ width: "18rem", minHeight: "460px" }}>
      <img
        src={cat.photos?.[0]?.foto || "https://placekitten.com/400/300"} // Usar una foto predeterminada si no hay foto
        className="card-img-top"
        alt={`Foto de ${cat.name}`}
        style={{ objectFit: "cover", height: "200px" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{cat.name}</h5>
        <p className="card-text mb-1"><strong>Raza:</strong> {cat.breed || "No especificada"}</p>
        <p className="card-text mb-1"><strong>Color:</strong> {cat.color || "Desconocido"}</p>
        <p className="card-text mb-1"><strong>Edad:</strong> {cat.age ?? "N/A"} años</p>
        <p className="card-text mt-2 flex-grow-1">
          {cat.description?.slice(0, 60) || "Sin descripción disponible."}
          {cat.description && cat.description.length > 60 && "..."}
        </p>
        <div className="mt-auto text-end">
          <Link to={`/cat/${cat.id}`} className="text-decoration-none text-primary">Ver más →</Link>
        </div>
      </div>
    </div>
  );
};

export default CatCard;