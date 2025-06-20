import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthButton } from './AuthButton';

export const Navbar = () => {
	const location = useLocation();
	const isLoggedIn = !!localStorage.getItem('token');
	const isOnRegisterPage = location.pathname === '/register';
	const [query, setQuery] = useState('');
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) {
			navigate(`/search?q=${encodeURIComponent(query)}`);
		}
	};

	return (
		<nav className="navbar navbar-dark bg-light px-4">
			<div className="container">
				<Link className="nav-link mx-auto" to="/">JWT Project</Link>
				<div className="d-flex gap-2 mx-auto">
					{!isLoggedIn && !isOnRegisterPage && (
						<Link to="/register" className="btn btn-primary">
							Registrarse
						</Link>
					)}
					<AuthButton />
				</div>

			</div>
		</nav>
	);
};
