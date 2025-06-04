import React from "react";
import { useNavigate } from "react-router-dom";

const AdoptedCatCard = ({ catName, photo, userLabel, nickname, onRate, showRateButton = true }) => {
    const navigate = useNavigate();

    return (
        <div className="card h-100">
            <img src={photo || "https://via.placeholder.com/400x300"} className="card-img-top" alt={catName} />
            <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-center">{catName}</h5>
                <p className="text-center">
                    <strong>{userLabel}:</strong> {nickname}
                </p>
                {showRateButton ? (
                    <button className="btn btn-outline-primary mt-2" onClick={onRate}>
                        Valorar
                    </button>
                ) : (
                    <button
                        className="btn btn-outline-secondary mt-2"
                        onClick={() => navigate("/private?section=ratings")}
                    >
                        Ir a valoraciones
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdoptedCatCard;
