import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import FilmFrame from "../components/FilmFrame";
import Doodles from "../pages/Doodles";
import scissors from "../assets/scissors.png";
import backIcon from "../assets/curve arrow.png";
import heartSolid from "../assets/heart-solid.png";
import heartOutline from "../assets/heart-outline.png";
import * as htmlToImage from "html-to-image";

import "./Preview.css";

function Preview() {
  const navigate = useNavigate();
  const { selectedFilm, capturedImages, resetApp } = useAppContext();
  const filmRef = useRef(null);
  // NEW STATE
  const [isCut, setIsCut] = useState(false);
  const originalStripRef = useRef(null);

  useEffect(() => {
    if (!selectedFilm) {
      navigate("/film");
    }
  }, [selectedFilm, navigate]);

  if (!selectedFilm) return null;

  function handleRestart() {
    resetApp();
    navigate("/film");
  }

  // download individual image
  async function downloadSingle(element) {
    const dataUrl = await htmlToImage.toPng(element, {
      pixelRatio: 4
    });
  
    const link = document.createElement("a");
    link.download = "polaroid.png";
    link.href = dataUrl;
    link.click();
  }

  async function downloadFullStrip() {

    const wasCut = isCut;
  
    // temporarily render full strip
    setIsCut(false);
  
    // wait for React to render
    await new Promise(r => setTimeout(r, 50));
  
    const element = document.querySelector(".film-wrapper");
  
    const dataUrl = await htmlToImage.toPng(element, {
      pixelRatio: 3,
      cacheBust: true
    });
  
    // restore previous state
    if (wasCut) setIsCut(true);
  
    const link = document.createElement("a");
    link.download = "polaroid-strip.png";
    link.href = dataUrl;
    link.click();
  }

  async function downloadFullPolaroid() {
    if (!filmRef.current) return;
  
    const dataUrl = await htmlToImage.toPng(filmRef.current, {
      pixelRatio: 4
      
    });
    const link = document.createElement("a");
    link.download = "polaroid-strip.png";
    link.href = dataUrl;
    link.click();
  }

  

  return (
    <div className="preview-page">

      <Doodles />

      <div className={`preview-container ${selectedFilm.type === "multi" ? "multi-layout" : ""}`}>

        {/* FILM */}
        <div ref={filmRef} className={`film-wrapper ${selectedFilm.type === "multi" ? "multi-film" : "single-film"}`}>

          {/* NORMAL STRIP */}
          {!isCut && (
            <FilmFrame film={selectedFilm} images={capturedImages} />
          )}

          {/* CUT MODE */}
          {isCut && selectedFilm.type === "multi" && (
  <div className="cut-frames">

    {capturedImages.map((img, index) => (
      <div
        key={index}
        className={`cut-frame ${selectedFilm.theme} ${index === 2 ? "last-frame" : ""}`}
        onClick={(e) => downloadSingle(e.currentTarget)}
      >

        <div className="cut-photo">
          <img src={img} alt="cut frame"/>
          
        </div>

        {index === 2 && selectedFilm.hasHearts && (
  <div className="cut-hearts-pattern">

    {/* Bottom Row */}
    {[
  { left: -5, size: 60, rotate: -16, flip: false, img: heartSolid },
  { left: 45, size: 65, rotate: 10, flip: true, img: heartOutline },
  { left: 110, size: 75, rotate: -6, flip: false, img: heartSolid },
  { left: 180, size: 60, rotate: 12, flip: false, img: heartOutline },
  { left: 240, size: 55, rotate: -10, flip: true, img: heartSolid },
].map((heart, i) => (
      <img
        key={i}
        src={heart.img}
        alt=""
        style={{
          position: "absolute",
          bottom: 0,
          left: heart.left,
          width: heart.size,
          transform: `${heart.flip ? "scaleX(-1)" : ""} rotate(${heart.rotate}deg)`
        }}
      />
    ))}

    {/* Top Row */}
    {[
  { left: 40, size: 50, rotate: 14, flip: true, img: heartOutline },
  { left: 150, size: 55, rotate: -10, flip: false, img: heartSolid },
  { left: 230, size: 48, rotate: 18, flip: true, img: heartOutline },
].map((heart, i) => (
      <img
        key={i}
        src={heart.img}
        alt=""
        style={{
          position: "absolute",
          bottom: 28,
          left: heart.left,
          width: heart.size,
          transform: `${heart.flip ? "scaleX(-1)" : ""} rotate(${heart.rotate}deg)`
        }}
      />
    ))}

  </div>
)}
        {index === 2 && selectedFilm.textLayout && (
  <div className="cut-bottom">
    <span className="cut-text">x</span>
    <span className="cut-text">P80/20 120</span>
    <span className="cut-text">
      {selectedFilm.textLayout === "ko" ? "KO" : ""}
    </span>
  </div>
)}

      </div>
    ))}

  </div>
)}

        </div>

        <div
  ref={originalStripRef}
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: "none",
    zIndex: -1
  }}
>
  <FilmFrame film={selectedFilm} images={capturedImages} />
</div>

        {/* SCISSORS BUTTON (MULTI ONLY) */}
        {selectedFilm.type === "multi" && (
          <img
          src={isCut ? backIcon : scissors}
          className={`cut-button ${isCut ? "back-arrow" : ""}`}
          onClick={() => setIsCut(!isCut)}
          alt="cut"
        />
        )}

        {/* Arrow + text */}
        <div className="photo-label">
          <div className="arrow"></div>
          <span>
            {isCut ? "Click on any photo to download" : "Your photo!"}
          </span>
        </div>

        {/* Buttons */}
        <div className="action-buttons">

        <button className="download-btn" onClick={downloadFullStrip}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>

          <button className="outline-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
            Share
          </button>

          <button className="outline-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175"
              />
            </svg>
            Print
          </button>

          <button className="outline-btn" onClick={handleRestart}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992"
              />
            </svg>
            Restart
          </button>

        </div>

      </div>
    </div>
  );
}

export default Preview;