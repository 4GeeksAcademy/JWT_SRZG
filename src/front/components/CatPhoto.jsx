import React from "react";

const CatPhoto = ({ photoUrl }) => {
  return (
    <img
      src={photoUrl}
      alt="Foto del gato"
      className="w-full h-auto rounded shadow-md"
    />
  );
};

export default CatPhoto;
