import React, { useState } from "react";
import { Favorites } from "../components/Favorites";
import { Ratings } from "../components/Ratings";

export const Profile = () => {
    const token = localStorage.getItem('token');

    const [activeSection, setActiveSection] = useState('profile');

    const handleShowFavorites = () => {
        setActiveSection('favorites');
    };

    const handleShowRatings = () => {
        setActiveSection('ratings');
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4">Zona Privada</h1>

            {token ? (
                <div>
                    <div className="rounded bg-body-secondary p-3 m-3">
                        <h1>Hola, usuario</h1>
                        <p>Este es tu perfil de usuario</p>
                        <div className="d-flex justify-content-end">
                            <div className="m-5">
                                <button className="btn btn-success m-2">MIS MICHIS</button>
                                <button className="btn btn-success m-2" onClick={handleShowRatings}>VALORACIONES</button>
                                <button className="btn btn-success m-2" onClick={handleShowFavorites}>FAVORITOS</button>
                                <button className="btn btn-success m-2">EDITAR</button>
                            </div>
                        </div>
                    </div>

                    {activeSection === 'favorites' && (
                        <div className="mt-5">
                            <Favorites />
                        </div>
                    )}
                    {activeSection === 'ratings' && (
                        <div className="mt-5">
                            <Ratings />
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-danger">No tienes acceso. Inicia sesión primero.</p>
            )}
        </div>
    );
};