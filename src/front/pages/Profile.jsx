import React, { useState, useEffect } from "react";
import { Favorites } from "../components/Favorites";
import { Ratings } from "../components/Ratings";
import { MyData } from "../components/MyData";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { EditProfile } from "../components/EditProfile";
import { useLocation } from "react-router-dom";
import MyCatCard from "../components/MyCatCard";


export const Profile = () => {
    const [userName, setUserName] = useState("usuario")
    const [activeSection, setActiveSection] = useState('profile');

    const token = localStorage.getItem('token');

    const { store, dispatch } = useGlobalReducer();
    const { userData } = store;
    const [dataPhoto, setDataPhoto] = useState(null)
    const [myCats, setMyCats] = useState([]);
    console.log(dataPhoto)


    useEffect(() => {

        const fetchUserInfo = async () => {
            if (!token) {
                setUserName("Invitado");
                return;
            }

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
                    setUserName(data.user.name);
                    dispatch({ type: "set_user_data", payload: data.user })
                    setDataPhoto(data.profilePicture)


                    console.log(data)


                } else {

                    console.error("Error al obtener la información del usuario:", response.status, await response.text());
                    setUserName("Error al cargar");
                }
            } catch (err) {

                console.error("Error de conexión al obtener la información del usuario:", err);
                setUserName("Error al cargar");
            }
        };

        fetchUserInfo();
    }, [token]);

    /* const handleShowFavorites = () => {
        setActiveSection('favorites');
    }; */
    /* const handleShowRatings = () => {
        setActiveSection('ratings');
    }; */
    const handleShowMyData = () => {
        setActiveSection('my-data');
    };
    const handleShowEditProfile = () => {
        setActiveSection('edit-profile');
    };

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const section = params.get("section");

        if (section) {
            setActiveSection(section);
        }
    }, [location]);

    useEffect(() => {
        const fetchMyCats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cats-contacted`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("DATA RECIBIDA:", data); // <--- AÑADE ESTO
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


                    {activeSection === 'favorites' && (

                        <div className="mt-5">
                            <Favorites />
                        </div>
                    )}
                    {activeSection === 'ratings' && (
                        <div className="mt-5">
                            <Ratings />
                        </div>
                    )}
                    {activeSection === 'my-data' && (
                        <div className="mt-5">
                            <MyData onEditClick={handleShowEditProfile} />
                        </div>
                    )}
                    {activeSection === 'edit-profile' && (
                        <div className="mt-5 ">
                            <EditProfile />
                        </div>
                    )}
                    {(activeSection === 'profile') && (
                        <>

                            <div className="p-3 m-3 ">
                                <div className="d-flex justify-content-center">
                                    <img
                                        src={dataPhoto}
                                        alt="User Profile"
                                        className="rounded-circle ms-3"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <h1 className="m-3">Hola, {userData.name}</h1>

                                </div>
                                <hr></hr>
                            </div>
                            {myCats.length > 0 && <h2 className="text-center p-3">{myCats.length} Michis Publicados</h2>}
                            <div className="row">
                                {myCats.map(cat => (
                                    <div key={cat.cat_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <MyCatCard cat={cat} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {(activeSection === 'my-cats') && (
                        <><h1 className="m-3 text-center">{myCats.length} Michis Publicados</h1>
                            {myCats.length > 0}
                            <div className="row">
                                {myCats.map(cat => (
                                    <div key={cat.cat_id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                        <MyCatCard cat={cat} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <p className="text-danger">No tienes acceso. Inicia sesión primero.</p>
            )

            }

        </div>

    );

};


