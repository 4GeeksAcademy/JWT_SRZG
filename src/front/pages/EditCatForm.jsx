import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCatForm = () => {
    const { catId } = useParams();
    const [formData, setFormData] = useState({
        breed: "",
        age: "",
        weight: "",
        description: "",
        color: "",
        sex: "",
        cat_name: ""
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCat = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("No se pudo obtener los datos del gato");

                const data = await res.json();
                const cat = data.cat || data;  // por si tu backend responde con { cat: {...} }
                setFormData({
                    cat_name: cat.name || "",
                    breed: cat.breed || "",
                    age: cat.age || "",
                    weight: cat.weight || "",
                    description: cat.description || "",
                    color: cat.color || "",
                    sex: cat.sex || ""
                });
            } catch (err) {
                console.error(err);
                alert("Error al cargar el gato");
            } finally {
                setLoading(false);
            }
        };

        fetchCat();
    }, [catId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const payload = {
            ...formData,
            age: Number(formData.age),
            weight: Number(formData.weight),
            name: formData.cat_name // Backend espera "name", no "cat_name"
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Gato actualizado con éxito");
                navigate("/private?section=my-cats");
            } else {
                const errorData = await res.json();
                alert(errorData.msg || "Error al actualizar el gato");
            }
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al actualizar");
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Editar gato</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre del gato</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cat_name"
                        value={formData.cat_name}
                        disabled
                        placeholder="Nombre del gato"
                    />
                </div>

                {["breed", "age", "weight", "description", "color"].map((field) => (
                    <div key={field} className="mb-3">
                        <label className="form-label text-capitalize">{field}</label>
                        <input
                            type="text"
                            className="form-control"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <div className="mb-3">
                    <label className="form-label">Sexo</label>
                    <select
                        className="form-control"
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                    >
                        <option value="">Seleccionar</option>
                        <option value="male">Macho</option>
                        <option value="female">Hembra</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Guardar</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/private?section=my-cats")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default EditCatForm;