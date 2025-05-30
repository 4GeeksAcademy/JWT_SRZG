
import React from "react";

const CatInfoBox = ({ name, breed, weight, age, extra, color, sex }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <div className="bg-yellow-50 border border-blue-400 p-4 rounded-lg shadow-md">
        <p><strong>RAZA:</strong> {breed}</p>
        <p><strong>PESO:</strong> {weight} kg</p>
        <p><strong>EDAD:</strong> {age} años</p>
        <p><strong>COLOR:</strong> {color}</p>
        <p><strong>SEXO:</strong> {sex === "male" ? "Macho" : "Hembra"}</p>
        <p><strong>INFO:</strong> {extra}</p>
      </div>
    </div>
  );
};

export default CatInfoBox;