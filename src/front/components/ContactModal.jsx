const ContactModal = ({ show, person, onClose, title = "Información de contacto" }) => {
    if (!show || !person) return null;

    return (
        <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Nickname:</strong> {person.nickname}</p>
                            <p><strong>Email:</strong> {person.email}</p>
                            <p><strong>Teléfono:</strong> {person.phone}</p>
                            {person.contacted_at && (
                                <p><strong>Fecha de contacto:</strong> {new Date(person.contacted_at).toLocaleString()}</p>
                            )}
                            {person.is_selected && (
                                <p><span className="badge bg-success">Adoptante</span></p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default ContactModal;

