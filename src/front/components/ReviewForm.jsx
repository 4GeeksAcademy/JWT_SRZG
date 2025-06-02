import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ReviewForm = () => {
    const [searchParams] = useSearchParams();
    const targetUserId = searchParams.get("target");
    const michiId = searchParams.get("michi");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${targetUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setRecipientName(data.nickname || "Usuario");
                } else {
                    console.error("Respuesta no válida al obtener usuario:", res.status);
                }
            } catch (err) {
                console.error("Error obteniendo nombre del usuario:", err);
            }
        };

        if (targetUserId) fetchUserName();
    }, [targetUserId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!michiId) {
            alert("Falta el ID del michi para enviar la valoración.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${targetUserId}/${michiId}/review`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating, comment }),
            });

            if (res.ok) {
                alert("¡Valoración enviada con éxito!");
                navigate("/private?section=ratings");
            } else {
                const data = await res.json();
                alert(data.msg || "Error al enviar la valoración");
            }
        } catch (err) {
            console.error("Error al enviar valoración:", err);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center">Valorar a {recipientName}</h2>
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "600px" }}>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Puntuación</label>
                    <select
                        id="rating"
                        className="form-select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>{num} estrella{num > 1 ? "s" : ""}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comentario</label>
                    <textarea
                        id="comment"
                        className="form-control"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="¿Qué tal fue la experiencia?"
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Enviar valoración</button>
            </form>
        </div>
    );
};

export default ReviewForm;