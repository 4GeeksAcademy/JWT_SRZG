import React from "react";

const CatInfoBox = ({ name, breed, weight, age, extra }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <div className="bg-yellow-50 border border-blue-400 p-4">
        <p><strong>RAZA:</strong> {breed}</p>
        <p><strong>PESO:</strong> {weight}</p>
        <p><strong>EDAD:</strong> {age}</p>
        <p><strong>INFO:</strong> {extra}</p>
      </div>
    </div>
  );
};

export default CatInfoBox;

