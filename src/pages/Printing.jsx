import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import FilmFrame from "../components/FilmFrame";
import Doodles from "../pages/Doodles";
import "./Printing.css";

function Printing() {

  const navigate = useNavigate();
  const { selectedFilm, capturedImages } = useAppContext();

  const [visibleImages, setVisibleImages] = useState([]);
  const [showPickup, setShowPickup] = useState(false);

  useEffect(() => {

    if (!selectedFilm) return;
  
    if (selectedFilm.type === "single") {
  
      setVisibleImages([capturedImages[0]]);
  
      setTimeout(() => {
        setShowPickup(true);
      }, 10000);
  
    } else {
  
      setVisibleImages(capturedImages);
  
      setTimeout(() => {
        setShowPickup(true);
      }, 15000);
  
    }
  
  }, [capturedImages, selectedFilm]);

  function handlePickup() {
    navigate("/preview");
  }

  if (!selectedFilm) return null;

  return (

    <div className="printing-page">

      <Doodles />

      <div className={`printing-container ${selectedFilm.type === "multi" ? "multi-layout" : ""}`}>

      <div className={`printing-strip ${selectedFilm.type}`}>
      <FilmFrame
  film={selectedFilm}
  images={visibleImages}
  developing={true}
  variant={selectedFilm.type === "multi" ? "thumbnail" : "full"}
/>

        </div>

        {showPickup && (
          <button className="pickup-btn" onClick={handlePickup}>
            Pick Up
          </button>
        )}

      </div>

    </div>
  );
}

export default Printing;