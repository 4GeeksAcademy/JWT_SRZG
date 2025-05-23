import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CatInfoBox from "../components/CatInfoBox";
import CatPhoto from "../components/CatPhoto";

const CatProfilePage = () => {
  const { catId } = useParams();
  const [catData, setCatData] = useState(null);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/cats/${catId}`);
        const data = await response.json();
        setCatData(data);
      } catch (error) {
        console.error("Error fetching cat data:", error);
      }
    };
    fetchCat();
  }, [catId]);

  if (!catData) return <div>Cargando...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <CatInfoBox
        name={catData.name}
        breed={catData.breed}
        weight={catData.weight}
        age={catData.age}
        extra={catData.description}
      />
      <CatPhoto photoUrl={catData.photo_url} />
    </div>
  );
};

export default CatProfilePage;
