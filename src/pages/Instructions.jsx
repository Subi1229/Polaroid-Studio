import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import heartOutline from "../assets/heart-outline.png";
import heartSolid from "../assets/heart-solid.png";
import backArrow from "../assets/back arrow.png";
import cameraIcon from "../assets/camera.png";
import uploadIcon from "../assets/upload.png";
import "./Instructions.css";

import fav from "../assets/fav.png";
import cherry from "../assets/cherry.png";
import lips from "../assets/lips.png";
import love from "../assets/love.png";
import bow from "../assets/bow.png";



function Instructions() {
  const { filter, setFilter } = useAppContext();
  const navigate = useNavigate();
  return (
    <div className="instructions-page">
      <div className="doodle-canvas">

<img src={fav} className="doodle fav" />
<img src={cherry} className="doodle cherry" />
<img src={heartOutline} className="doodle heart-outline-left" />
<img src={heartOutline} className="doodle heart-outline-top" />
<img src={lips} className="doodle lips" />
<img src={bow} className="doodle bow-bg" />
<img src={love} className="doodle love" />

</div>

      <div className="instructions-container">

        <div className="main-card">

          <div className="white-card">

            <div className="back-frame">
              <div className="back-button"onClick={() => navigate("/film")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="back-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
  </svg>
                Back
              </div>
            </div>

            <div className="button-frame">

              <button className="photo-button" onClick={() => navigate("/camera")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="button-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
                Take photo
              </button>

              <button className="photo-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="button-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
  Upload
</button>

            </div>

          </div>

          <div className="filters">

  <button
    className={filter === "color" ? "filter-active" : "filter-inactive"}
    onClick={() => setFilter("color")}
  >
    color
  </button>

  <button
    className={filter === "bw" ? "filter-active" : "filter-inactive"}
    onClick={() => setFilter("bw")}
  >
    b&w
  </button>

</div>

        </div>


        <div className="steps-card">

  <div className="steps-title">
    Steps:
  </div>

  <div className="step-item">
    1. Select Color or b&w filter.
  </div>

  <div className="step-item">
    2. Choose take photo from webcam or upload from your device.
  </div>

  <div className="step-item">
    3. Press the shutter button to take photo and wait 5–10 secs for them to be printed.
  </div>

  <img src={heartOutline} className="heart-outline" />
  <img src={heartSolid} className="heart-solid" />


</div>

      </div>

    </div>
  );
}

export default Instructions;