import React, { useState } from "react";
import ContactModal from "./ContactModal";

const MyCatCard = ({ cat }) => {
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedContact(null);
        setShowModal(false);
    };

    const recentContacts = cat.contacts
        .slice()
        .sort((a, b) => new Date(b.contacted_at) - new Date(a.contacted_at))

    return (
        <div className="card h-100">
            <div className="card-header fw-bold">{cat.cat_name}</div>
            <div className="card-body">
                {recentContacts.length === 0 ? (
                    <p className="text-muted">Ningún interesado aún.</p>
                ) : (
                    <ul className="list-group list-group-flush">
                        {recentContacts.map((contact, index) => (
                            <li key={index} className="list-group-item">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={contact.profile_picture || "https://via.placeholder.com/40"}
                                            alt="Foto de perfil"
                                            className="rounded-circle"
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                        <strong>{contact.nickname}</strong>
                                        {contact.is_selected && (
                                            <span className="badge bg-success ms-2">Adoptante</span>
                                        )}
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleOpenModal(contact)}
                                    >
                                        Ver datos
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {cat.contacts.length > 3 && (
                    <div className="text-end mt-2">
                        <small className="text-muted">
                            +{cat.contacts.length - 3} contactos más en el perfil de tu Michi
                        </small>
                    </div>
                )}
            </div>

            <ContactModal
                show={showModal}
                person={selectedContact}
                title="Información del contacto"
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default MyCatCard;
