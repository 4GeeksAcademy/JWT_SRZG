import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthButton } from './AuthButton';

export const Navbar = () => {
	const location = useLocation();
	const isLoggedIn = !!localStorage.getItem('token');
	const isOnRegisterPage = location.pathname === '/register';

	return (
		<nav className="navbar navbar-dark bg-dark px-4">
			<span className="navbar-brand mb-0 h1">4 Michis</span>

			<div className="d-flex gap-2">
				{!isLoggedIn && !isOnRegisterPage && (
					<Link to="/register" className="btn btn-outline-light">
						Register
					</Link>
				)}
				<AuthButton />
			</div>
		</nav>
	);
};
