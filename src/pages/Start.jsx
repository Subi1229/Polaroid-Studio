import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FilmFrame from "../components/FilmFrame";

import sunset from "../assets/sunset.jpg";
import icecream from "../assets/icecream.jpg";
import girl from "../assets/girl.jpg";
import car from "../assets/car.jpg";
import cat from "../assets/cat.jpg";
import doll from "../assets/doll.jpg";



function Start() {
  const navigate = useNavigate();

  const [leaving, setLeaving] = useState(false);

  const [zoomDone, setZoomDone] = useState(false);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setZoomDone(true);
    }, 100);
  
    setTimeout(() => {
      setShowUI(true);
    }, 1400);
  }, []);

  const films = [
    { image: sunset, rotation: -11.5, x: -120, theme: "white", textLayout: null, z: 1 },
    { image: icecream, rotation: 11.83, x: 120, theme: "black", textLayout: "potra", z: 3 },
    { image: girl, rotation: 0, x: 380, theme: "white", textLayout: null, z: 2 },
    { image: car, rotation: -14.13, x: 630, theme: "black", textLayout: "potra", z: 4 },
    { image: cat, rotation: 3.17, x: 880, theme: "white", textLayout: null, z: 5 },
    { image: doll, rotation: -14.85, x: 1110, theme: "black", textLayout: "ko", z: 6 },
  ];

  return (
    <div
  style={{
    width: "100vw",
    height: "100vh",
    background: "#F5F0EB",
    position: "relative",
    overflow: "hidden",

    opacity: leaving ? 0 : 1,
transform: leaving ? "scale(0.98)" : "scale(1)",
transition: "all 0.5s ease",
  }}
>
      {/* FILM ROW */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "-5%",
          transform: zoomDone
            ? "translateX(-50%) scale(0.6)"
            : "translateX(-50%) scale(1.2)",
          transition: "transform 1.4s cubic-bezier(.22,1,.36,1)",
          width: "1400px",
          height: "600px",
        }}
      >
        {films.map((film, index) => (
  <div
    key={index}
    style={{
      position: "absolute",
      left: film.x,
      top: 0,
      zIndex: film.z,

      transform: zoomDone
        ? `rotate(${film.rotation}deg) translateY(0px) scale(1)`
        : `rotate(${film.rotation}deg) translateY(-120px) scale(1.8)`,

      opacity: zoomDone ? 1 : 0,

      transition: "all 0.9s cubic-bezier(.22,1,.36,1)",
      transitionDelay: `${index * 0.18}s`,
    }}
  >
    <div
      style={{
        animation: zoomDone
          ? "filmWobble 6s ease-in-out infinite"
          : "none",
        animationDelay: `${1.3 + index * 0.18}s`,
      }}
    >
      <FilmFrame
        film={{
          type: "single",
          theme: film.theme,
          textLayout: film.textLayout,
        }}
        images={[film.image]}
      />
    </div>
  </div>
))}
      </div>

      {/* TITLE */}
      <div
        style={{
          position: "absolute",
          top: "64%",
          width: "100%",
          textAlign: "center",
          fontFamily: "Luxurious Script, cursive",
          fontSize: "86px",
          letterSpacing: "1px",
          opacity: showUI ? 1 : 0,
          transform: showUI ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease",
        }}
      >
        The Polaroid Studio
      </div>

      {/* BUTTON */}
      <div
        style={{
          position: "absolute",
          top: "86%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: showUI ? 1 : 0,
          transform: showUI ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease",
          transitionDelay: "0.2s",
        }}
      >
        <button
  onClick={() => {
    setLeaving(true);
    setTimeout(() => {
      navigate("/film");
    }, 500);
  }}
          style={{
            background: "#000",
            color: "#fff",
            border: "none",
            padding: "10px 48px",
            borderRadius: "50px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Start;