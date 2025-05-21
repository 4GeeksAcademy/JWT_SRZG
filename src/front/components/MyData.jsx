import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MyData = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { store, dispatch } = useGlobalReducer();
    const { userData } = store
    console.log(store)

    const token = localStorage.getItem('token');


    /* const fetchUserData = async () => {
        if (!token) {
            setError("No hay token de autenticación. Por favor, inicia sesión.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
            }

            const data = await response.json();
            setUserData(data.user);
            setLoading(false);
            dispatch({ type: "set_user_data", payload: data.user })
            console.log(data)
        } catch (err) {
            console.error("Error al obtener datos del usuario:", err);
            setError(`No se pudieron cargar tus datos: ${err.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token]); */


    /* if (loading) {
        return <p className="text-center">Cargando tus datos...</p>;
    }

    if (error) {
        return <p className="text-center text-danger">{error}</p>;
    }

    if (!userData) {
        return <p className="text-center">No se encontraron datos de usuario.</p>;
    }
 */


    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Mis Datos de Usuario</h2>

            <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '600px' }}>
                <p><strong>Nombre:</strong> {userData.name} {userData.lastname}</p>
                <p><strong>Nickname:</strong> {userData.nickname}</p>
                <p><strong>DNI:</strong> {userData.dni}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Teléfono:</strong> {userData.phone}</p>
                <p><strong>Dirección:</strong> {userData.direction}</p>
                <p><strong>Rol:</strong> {userData.rol}</p>
                <Link to="/editprofile" className="btn btn-outline-light">
                    <button className="btn btn-primary mt-3">
                        Editar Mis Datos
                    </button>
                </Link>

            </div>

        </div>
    );
};