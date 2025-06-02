import React from "react";

const ProfileMenu = ({ onSelect }) => {
    const sections = [
        { key: 'favorites', label: 'Favoritos' },
        { key: 'ratings', label: 'Valoraciones' },
        { key: 'my-data', label: 'Mis datos' },
        { key: 'edit-profile', label: 'Editar perfil' },
        { key: 'my-cats', label: 'Mis Michis' }
    ];

    return (
        <div className="row">
            {sections.map(({ key, label }) => (
                <div key={key} className="col-md-4 mb-4">
                    <div
                        className="card h-100 shadow-sm"
                        onClick={() => onSelect(key)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">{label}</h5>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileMenu;