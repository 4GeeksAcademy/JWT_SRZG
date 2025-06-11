import React, { useState, useEffect } from "react"
export default function SubirFotoSimple() {
    const [imagenSubida, setImagenSubida] = useState(null);
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://upload-widget.cloudinary.com/global/all.js"
        script.async = true;
        document.head.appendChild(script)
        return () => {
            document.head.removeChild(script)
        }
    }, [])
    const subirImagen = () => {
        window.cloudinary.openUploadWidget(
            {
                cloudName: "dhdgzmszv",
                uploadPreset: "ml2_default",
                sources: ["local", "camera"],
                multiple: false,
                maxFiles: 1,
                cropping: true,
                croppingAspectRatio: 1
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    setImagenSubida(result.info.secure_url)
                    console.log("Imagen subida adecuadamente :", result.info)
                }
            }
        )
    }
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px",
            background: " #667EEA"
        }}>
            <div style={{
                background: "white",
                borderRadius: "15px",
                padding: "15px"
            }}>
                <h2>Subir foto</h2>
                <button onClick={subirImagen}> Seleccionar Foto</button>
            </div>
        </div>
    )
}