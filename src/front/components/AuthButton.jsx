import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AccountMenu } from './AccountMenu';

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
            {isLoggedIn && (
                <AccountMenu />
            )}
            <button onClick={handleClick} className="btn btn-primary">
                {isLoggedIn ? 'Logout' : 'Login'}
            </button>
        </>
    );
};