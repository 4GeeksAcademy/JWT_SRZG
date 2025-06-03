import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

export const Favorites = () => {
    const { store, dispatch } = useGlobalReducer();
    const { userData } = store;
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const [favoriteCats, setFavoriteCats] = useState([]);




    useEffect(() => {
        const fetchLoadingFavorites = async () => {
            try {
                const token = localStorage.getItem("token"); // Obtén el token aquí
                if (!token) {
                    setError("No hay token de autenticación. Por favor, inicia sesión.");
                    setLoading(false);
                    navigate('/login'); // Redirigir a login si no hay token
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error(response.status, response.statusText);
                    return;
                }

                const favoritesData = await response.json();
                console.log("datos de favoritos", favoritesData);
                dispatch({ type: "set_user_favorites", payload: favoritesData });
                setFavoriteCats(favoritesData);


            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        fetchLoadingFavorites();
    }, []);

    const handleRemoveFavorite = async (catId) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("¿Estás seguro de que quieres eliminar este Michi de tus favoritos?")) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${catId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Error eliminando favorito:", response.statusText);
                return;
            }
            fetchLoadingFavorites();
            console.log("favorito eliminado con exito")
            // Eliminar el michi del estado local


        } catch (error) {
            console.error("Error eliminando favorito:", error);
        }
    };

    return (
        <div>
            <div className="container mt-5">
                <h1 className="text-center mb-4">Mis Michis Favoritos</h1>
                <div className="text-center">
                    {favoriteCats.length === 0 ? (
                        <p>Aún no tienes ningún Michi en tus favoritos. <Link to="/some-michi-list-page" className="btn btn-link">Explorar Michis</Link></p>
                    ) : (
                        <h2>Aquí están tus Michis favoritos</h2>
                    )}
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                    {favoriteCats.map(favorite => {
                        const michi = favorite.michi_details;

                        if (!michi || typeof michi !== 'object') {
                            return (
                                <div key={favorite.id} className="col">
                                    <div className="card h-100 shadow-sm text-center">
                                        <div className="card-body">
                                            <h5 className="card-title text-danger">Error al cargar detalles del Michi</h5>
                                            <p className="card-text">ID de Favorito: {favorite.id}</p>
                                            <p className="card-text">ID de Michi: {favorite.michi_id}</p>
                                            <button
                                                onClick={() => handleRemoveFavorite(favorite.michi_id)}
                                                className="btn btn-danger btn-sm mt-3"
                                            >
                                                Eliminar Favorito Roto
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        const imageUrl = michi.photos && michi.photos.length > 0
                            ? michi.photos[0].foto
                            : 'https://media.istockphoto.com/id/519497396/es/vector/cara-de-gato-negro.jpg?s=612x612&w=0&k=20&c=0ic3dvnWbMOIq1TrDVLDB6_T_Jez3jpS33sUR5Y31Ag='; // Imagen por defecto

                        return (
                            <div key={favorite.id} className="col">
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={imageUrl}
                                        className="card-img-top"
                                        alt={`Foto de ${michi.name}`}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <div>
                                            <h5 className="card-title text-center mb-2">{michi.name || `Michi ID: ${michi.id}`}</h5>
                                            {michi.breed && <p className="card-text">Raza: {michi.breed}</p>}
                                            {michi.age && <p className="card-text">Edad: {michi.age} años</p>}
                                            {michi.description && <p className="card-text text-muted small">{michi.description}</p>}
                                        </div>
                                        <div className="d-grid gap-2 mt-auto">
                                            <button
                                                onClick={() => handleRemoveFavorite(michi.id)} // Usa michi.id para eliminar
                                                className="btn btn-danger btn-sm"
                                            >
                                                Eliminar de Favoritos
                                            </button>
                                            {/* Opcional: Enlace para ver los detalles completos del Michi */}
                                            {/* <Link to={`/michi/${michi.id}`} className="btn btn-outline-primary btn-sm">
                                            Ver Detalles
                                        </Link> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
