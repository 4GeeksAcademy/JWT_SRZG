import React, { useState, useEffect, useCallback } from "react";
import { Favorites } from "../components/Favorites";
import { Ratings } from "../components/Ratings";
import { MyData } from "../components/MyData";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { EditProfile } from "../components/EditProfile";
import { useLocation, useNavigate } from "react-router-dom";
import MyCatCard from "../components/MyCatCard";
import AdoptedCatCard from "../components/AdoptedCatCard";
import ProfileMenu from "../components/ProfileMenu";

export const Profile = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [dataPhoto, setDataPhoto] = useState(null);
    const [myCats, setMyCats] = useState([]);
    const [catsAdopted, setCatsAdopted] = useState([]);
    const [catsGivenWithAdoptant, setCatsGivenWithAdoptant] = useState([]);
    const [sentReviews, setSentReviews] = useState([]);
    const [receivedReviews, setReceivedReviews] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const { store, dispatch } = useGlobalReducer();
    const { userData } = store;
    const location = useLocation();

    const adoptedCats = myCats.filter(cat =>
        cat.contacts.some(contact => contact.is_selected)
    );

    const unadoptedCats = myCats.filter(cat =>
        !cat.contacts.some(contact => contact.is_selected)
    );

    const handleAdoptSelect = async (catId, userId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats/${catId}/adopt/${userId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMyCats(prevCats =>
                    prevCats.map(cat =>
                        cat.cat_id === catId
                            ? {
                                ...cat,
                                contacts: cat.contacts.map(contact =>
                                    contact.contactor_id === userId
                                        ? { ...contact, is_selected: true }
                                        : { ...contact, is_selected: false }
                                ),
                            }
                            : cat
                    )
                );
            } else {
                alert(data.error || "No se pudo marcar como adoptante");
            }
        } catch (err) {
            console.error("Error al marcar como adoptante:", err);
        }
    };

    const goToReview = (targetUserId, michiId) => {
        navigate(`/review?target=${targetUserId}&michi=${michiId}`);
    };

    const hasReviewed = (targetId, michiId) => {
        return sentReviews.some(review =>
            Number(review.target_user_id) === Number(targetId) && Number(review.michi_id) === Number(michiId)
        );
    };

    const fetchUserFavorites = useCallback(async () => {
        if (!token) {
            console.warn("No hay token de autenticación para cargar favoritos en el perfil. Redirigiendo a login.");
            dispatch({ type: "set_user_favorites", payload: [] }); // Limpia favoritos en el store
            navigate('/login'); // Redirige si no hay token
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error("Error al cargar favoritos en el perfil:", response.status, response.statusText);
                if (response.status === 401) {
                    console.log("Token expirado o inválido. Limpiando token y redirigiendo a login.");
                    localStorage.removeItem('token');
                    dispatch({ type: "set_user_favorites", payload: [] });
                    navigate('/login');
                }
                return;
            }

            const favoritesData = await response.json();
            console.log("Favoritos del usuario cargados en Profile:", favoritesData);
            dispatch({ type: "set_user_favorites", payload: favoritesData }); // Guarda en el store global

        } catch (error) {
            console.error("Error de red al cargar favoritos en Profile:", error);
        }
    }, [token, dispatch, navigate]);


    useEffect(() => {
        fetchUserFavorites();
    }, [fetchUserFavorites]);



    useEffect(() => {
        const fetchAdoptionData = async () => {
            try {
                const headers = { "Authorization": `Bearer ${token}` };

                const [adoptedRes, givenRes, sentRes, receivedRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/adopted-cats`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/given-cats-with-adoptant`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/sent-reviews`, { headers }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userData.id}/reviews`, { headers })
                ]);

                const adoptedData = adoptedRes.ok ? await adoptedRes.json() : [];
                const givenData = givenRes.ok ? await givenRes.json() : [];
                const sentData = sentRes.ok ? await sentRes.json() : [];
                const receivedData = receivedRes.ok ? await receivedRes.json() : [];

                setCatsAdopted(adoptedData);
                setCatsGivenWithAdoptant(givenData);
                setSentReviews(sentData);
                setReceivedReviews(receivedData);

            } catch (err) {
                console.error("Error al obtener información de adopciones o valoraciones:", err);
            }
        };

        if (userData?.id) fetchAdoptionData();
    }, [token, userData]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!token) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_user_data", payload: data.user });
                    setDataPhoto(data.profilePicture);
                } else {
                    console.error("Error al obtener la información del usuario:", response.status, await response.text());
                }
            } catch (err) {
                console.error("Error de conexión al obtener la información del usuario:", err);
            }
        };

        fetchUserInfo();
    }, [token]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const section = params.get("section");
        if (section) setActiveSection(section);
    }, [location]);

    useEffect(() => {
        const fetchMyCats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats-contacted`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                setMyCats(data);
            } catch (err) {
                console.error("Error al obtener los gatos del usuario:", err);
            }
        };

        fetchMyCats();
    }, [token]);

    return (
        <div className="container py-5">
            {token ? (
                <div>
                    {activeSection === 'favorites' && <Favorites />}
                    {activeSection === 'ratings' && <Ratings sentReviews={sentReviews} receivedReviews={receivedReviews} />}
                    {activeSection === 'my-data' && <MyData onEditClick={() => setActiveSection('edit-profile')} />}
                    {activeSection === 'edit-profile' && <EditProfile />}

                    {activeSection === 'profile' && (
                        <div className="p-3 m-3">
                            <div className="d-flex justify-content-center">
                                <img
                                    src={userData.profile_picture}
                                    alt="User Profile"
                                    className="rounded-circle ms-3"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <h1 className="m-3">Hola, {userData.name}</h1>
                            </div>
                            <hr />
                            <ProfileMenu onSelect={setActiveSection} />
                        </div>
                    )}

                    {activeSection === 'my-cats' && (
                        <>
                            <h2 className="text-center mt-4">Mis Michis sin adoptar</h2>
                            {unadoptedCats.length === 0 ? (
                                <p className="text-center text-muted">No tienes michis sin adoptar.</p>
                            ) : (
                                <div className="row">
                                    {unadoptedCats.map(cat => (
                                        <div key={cat.cat_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                            <MyCatCard cat={cat} isOwner={true} onAdoptSelect={handleAdoptSelect} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {catsGivenWithAdoptant.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="text-center mb-3">Tus michis adoptados por otros</h3>
                                    <div className="row">
                                        {catsGivenWithAdoptant.map(cat => (
                                            <div key={cat.cat_id} className="col-md-4 mb-4">
                                                <AdoptedCatCard
                                                    catName={cat.cat_name}
                                                    photo={cat.photo}
                                                    userLabel="Adoptante"
                                                    nickname={cat.adoptant_nickname}
                                                    onRate={() => goToReview(cat.adoptant_id, cat.cat_id)}
                                                    showRateButton={!hasReviewed(cat.adoptant_id, cat.cat_id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {catsAdopted.length > 0 && (
                                <div className="row mb-5">
                                    <h3 className="text-center mb-3">Has adoptado estos michis</h3>
                                    {catsAdopted.map(cat => (
                                        <div key={cat.cat_id} className="col-md-4 mb-4">
                                            <AdoptedCatCard
                                                catName={cat.cat_name}
                                                photo={cat.photo}
                                                userLabel="Dueño anterior"
                                                nickname={cat.owner_nickname}
                                                onRate={() => goToReview(cat.owner_id, cat.cat_id)}
                                                showRateButton={!hasReviewed(cat.owner_id, cat.cat_id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <p className="text-danger">No tienes acceso. Inicia sesión primero.</p>
            )}
        </div>
    );
};
