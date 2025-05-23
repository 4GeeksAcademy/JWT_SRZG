import React from "react";

export const CatGallery = () => {
  const cats = [
    {
      image: "https://placedog.net/400/300?id=1",
      title: "Gato 1",
      description: "Este es un lindo gato buscando un hogar.",
      updated: "Última actualización hace 3 minutos"
    },
    {
      image: "https://placedog.net/400/300?id=2",
      title: "Gato 2",
      description: "Tranquilo, juguetón y perfecto para familias.",
      updated: "Última actualización hace 3 minutos"
    },
    {
      image: "https://placedog.net/400/300?id=3",
      title: "Gato 3",
      description: "Este gato es muy cariñoso y se adapta fácilmente.",
      updated: "Última actualización hace 3 minutos"
    },
  ];

  return (
    <div className="card-group p-4">
      {cats.map((cat, index) => (
        <div className="card mx-2" key={index}>
          <img src={cat.image} className="card-img-top" alt={`Foto de ${cat.title}`} />
          <div className="card-body">
            <h5 className="card-title">{cat.title}</h5>
            <p className="card-text">{cat.description}</p>
            <p className="card-text">
              <small className="text-body-secondary">{cat.updated}</small>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};