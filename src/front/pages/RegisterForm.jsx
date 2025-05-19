import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        dni: '',
        nickname: '',
        direction: '',
        email: '',
        phone: '',
        is_active: true,
        rol: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateDNI = (dni) => {
        const dniRegex = /^(\d{8})([A-HJ-NP-TV-Z])$/i;
        const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        if (!dniRegex.test(dni)) return false;
        const [, number, letter] = dni.match(dniRegex);
        return letters[number % 23] === letter.toUpperCase();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }
        if (!validateDNI(formData.dni)) {
            newErrors.dni = 'DNI inválido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setSubmitStatus(`Usuario registrado: ${result.email}`);

                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                const error = await response.json();
                setSubmitStatus(`Error: ${error.msg || 'No se pudo registrar'}`);
            }
        } catch (err) {
            setSubmitStatus('Error de conexión con el servidor');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
            <h2>Registro de Usuario</h2>

            {['name', 'lastname', 'dni', 'nickname', 'direction', 'email', 'phone', 'rol', 'password'].map((field) => (
                <div key={field} className="mb-3">
                    <label htmlFor={field} className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                        type={field === 'password' ? 'password' : 'text'}
                        className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                    />
                    {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                </div>
            ))}

            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="is_active">
                    Activo
                </label>
            </div>

            <button type="submit" className="btn btn-primary">Registrar</button>

            {submitStatus && (
                <div className="mt-3 alert alert-info">{submitStatus}</div>
            )}
        </form>
    );
};
