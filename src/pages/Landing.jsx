import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FilmFrame from "../components/FilmFrame";

import sunset from "../assets/sunset.jpg";
import icecream from "../assets/icecream.jpg";
import girl from "../assets/girl.jpg";
import car from "../assets/car.jpg";
import cat from "../assets/cat.jpg";
import doll from "../assets/doll.jpg";

function Landing() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // start zoom animation
    setTimeout(() => setAnimate(true), 100);

    // navigate to start page
    const timer = setTimeout(() => {
      navigate("/start");
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigate]);

  const films = [
    { image: sunset, rotation: -11.5, x: -80, y: 247, theme: "white", textLayout: null, z: 1 },
    { image: icecream, rotation: 11.83, x: 120, y: 206, theme: "black", textLayout: "potra", z: 3 },
    { image: girl, rotation: 0, x: 420, y: 213, theme: "white", textLayout: null, z: 2 },
    { image: car, rotation: -14.13, x: 650, y: 241, theme: "black", textLayout: "potra", z: 4 },
    { image: cat, rotation: 3.17, x: 900, y: 238, theme: "white", textLayout: null, z: 5 },
    { image: doll, rotation: -14.85, x: 1120, y: 195, theme: "black", textLayout: "ko", z: 6 },
  ];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#F5F0EB",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "60%",
          top: "65%",
          transform: animate
            ? "translate(-50%, -50%) scale(0.9)"
            : "translate(-50%, -50%) scale(1.3)",
          transition: "transform 1.4s cubic-bezier(.22,1,.36,1)",
          width: "1728px",
          height: "1117px",
        }}
      >
        {films.map((film, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: film.x,
              top: film.y,
              transform: `rotate(${film.rotation}deg)`,
              zIndex: film.z,
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
        ))}
      </div>
    </div>
  );
}

export default Landing;