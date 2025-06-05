import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CatFoundCard from "./CatFoundCard";

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/search?q=${query}`);
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error("Error al buscar michis", err);
            }
        };

        if (query) fetchResults();
    }, [query]);

    return (
        <div className="container mt-5">
            <h2>Resultados para "{query}"</h2>
            <div className="row">
                {results.length === 0 ? (
                    <p>No se encontraron michis.</p>
                ) : (
                    results.map(cat => (
                        <div key={cat.id} className="col-md-4 mb-4">
                            <CatFoundCard cat={cat} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchResults;