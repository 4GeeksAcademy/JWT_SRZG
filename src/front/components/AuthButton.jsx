import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthButton = () => {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token');

    const handleClick = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            navigate('/login');
        }
    };

    return (
        <button onClick={handleClick} className="btn btn-primary">
            {isLoggedIn ? 'Logout' : 'Login'}
        </button>
    );
};