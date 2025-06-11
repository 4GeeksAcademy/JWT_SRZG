import React from "react";

const CatPhoto = ({ photoUrl }) => {
  return (
    <div className="flex justify-center items-center">
      <img
        src={photoUrl}
        alt="Foto del gato"
        className="rounded-lg shadow-md max-w-full h-auto"
      />
    </div>
  );
};

export default CatPhoto;
