import React, { useState, useEffect } from "react";

export const Ratings = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usernames, setUsernames] = useState({});
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/sent-reviews`, {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    console.error("Error al obtener las valoraciones");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setRatings(data);

                // Obtener nicknames únicos
                const uniqueTargetIds = [...new Set(data.map(r => r.target_user_id))];

                const nicknamePromises = uniqueTargetIds.map(async (id) => {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        return { id, nickname: data.nickname };
                    } else {
                        return { id, nickname: `Usuario #${id}` };
                    }
                });

                const resolvedNicknames = await Promise.all(nicknamePromises);
                const nicknameMap = {};
                resolvedNicknames.forEach(({ id, nickname }) => {
                    nicknameMap[id] = nickname;
                });

                setUsernames(nicknameMap);
            } catch (err) {
                console.error("Error al obtener valoraciones o nicknames:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, [token]);

    if (loading) return <p className="text-center">Cargando valoraciones...</p>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Valoraciones que has hecho</h2>
            {ratings.length === 0 ? (
                <p className="text-center">Aún no has hecho ninguna valoración.</p>
            ) : (
                <ul className="list-group">
                    {ratings.map(rating => (
                        <li key={rating.id} className="list-group-item mb-3 shadow-sm rounded">
                            <div className="d-flex w-100 justify-content-between">
                                <h6 className="mb-1">
                                    A: <strong>{usernames[rating.target_user_id] || `Usuario #${rating.target_user_id}`}</strong>
                                </h6>
                            </div>
                            <p className="mb-1">Puntuación: <span className="badge bg-warning text-dark">{rating.review?.rating}/5</span></p>
                            {rating.review?.comment && (
                                <p className="mb-0">Comentario: <em>"{rating.review.comment}"</em></p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};