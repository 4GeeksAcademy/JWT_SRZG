import React, { useState } from "react";

const UploadCatProfilePicture = ({ catId, onUploadSuccess }) => {
  const [photoFile, setPhotoFile] = useState(null);

  const handleChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!photoFile) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("CAT_PROFILE", photoFile);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/profilepicture`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Foto subida correctamente.");
        onUploadSuccess(data.photo); // notificar al padre
      } else {
        alert("Error al subir la foto: " + data.msg);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de red al subir la foto");
    }
  };

  return (
    <div className="mt-3">
      <h6>Subir nueva foto</h6>
      <input type="file" onChange={handleChange} className="form-control mb-2" />
      <button onClick={handleUpload} className="btn btn-sm btn-success">
        Subir Foto
      </button>
    </div>
  );
};

export default UploadCatProfilePicture;