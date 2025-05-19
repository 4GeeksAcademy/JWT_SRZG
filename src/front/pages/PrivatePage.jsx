import React from 'react';

export const PrivatePage = () => {
    const token = localStorage.getItem('token');

    return (
        <div className="container py-5">
            <h1 className="mb-4">Zona Privada</h1>

            {token ? (
                <>
                    <p>Has iniciado sesión correctamente. Este es un área protegida.</p>
                    <pre className="bg-light p-3 rounded">{token}</pre>
                </>
            ) : (
                <p className="text-danger">No tienes acceso. Inicia sesión primero.</p>
            )}
        </div>
    );
};
