import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const AuthButton = () => {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token');

    const handleClick = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            {isLoggedIn}
            <button onClick={handleClick} className="btn  button-4michis chewy-font">
                {isLoggedIn ? 'Logout' : 'Login'}
            </button>
        </>
    );
};