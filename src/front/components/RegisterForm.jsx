import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: '',
        password: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

    const fields = [
        { name: 'fullname', label: 'Nombre' },
        { name: 'email', label: 'Email' },
        { name: 'password', label: 'Contraseña' }
    ];

    return (
        <div className="register-container d-flex justify-content-center">
            <div className="col-12 col-md-5 p-4 mt-5 mb-5">
                <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow">
                    <h2 className="text-center">Registro de usuario</h2>
                    <hr></hr>

                    {fields.map(({ name, label }) => (
                        <div key={name} className="mb-3">
                            <label htmlFor={name} className="form-label">{label}</label>
                            <input
                                type={name === 'password' ? 'password' : 'text'}
                                className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                                id={name}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                            />
                            {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
                        </div>
                    ))}

                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Registrarse</button>
                    </div>

                    {submitStatus && (
                        <div className="mt-3 alert alert-info">{submitStatus}</div>
                    )}
                </form>
            </div>
        </div>
    );
};
