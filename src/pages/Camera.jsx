import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Doodles from "../pages/Doodles";
import heartOutline from "../assets/heart-outline.png";
import heartSolid from "../assets/heart-solid.png";
import "./Camera.css";

function Camera() {
  const navigate = useNavigate();
  const { selectedFilm, capturedImages, setCapturedImages, filter } = useAppContext();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);

  const [cameraReady, setCameraReady] = useState(false);
const [cameraError, setCameraError] = useState(null);

  // Redirect if no film selected
  useEffect(() => {
    if (!selectedFilm) {
      navigate("/film");
    }
  }, [selectedFilm, navigate]);

  // Reset captured images on entry
  useEffect(() => {
    setCapturedImages([]);
  }, [setCapturedImages]);

  // Webcam setup (single stream, guaranteed cleanup)
  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setCameraReady(false);
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setCameraError("Camera access was denied. Please allow camera access and refresh.");
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera found on this device.");
        } else {
          setCameraError("Could not access camera. Please check your settings and refresh.");
        }
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  if (!selectedFilm) return null;

  const maxPhotos = selectedFilm.type === "single" ? 1 : 3;

  function handleCapture() {
    if (!cameraReady) return;  
    if (isCounting) return;
    if (capturedImages.length >= maxPhotos) return;

    setIsCounting(true);
    setCountdown(3);
  }

  // Countdown + Capture
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

if (filter === "bw") {
  ctx.filter = "grayscale(100%) contrast(130%) brightness(90%)";
} else {
  ctx.filter = "none";
}

ctx.save();
ctx.scale(-1, 1);
ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
ctx.restore();

ctx.filter = "none";

const imageData = canvas.toDataURL("image/png");

setCapturedImages((prev) => [...prev, imageData]);
      }

      setCountdown(null);
      setIsCounting(false);
    }
  }, [countdown, setCapturedImages, filter]);

  function handleContinue() {
    navigate("/printing");
  }

  return (
    <div className="instructions-page">
  
      <Doodles />
  
      <div className="instructions-container">
  
        <div className="main-card">
  
          <div className="white-card">
  
            <div className="back-frame">
              <div className="back-button" onClick={() => navigate("/instructions")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="back-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
                Back
              </div>
            </div>
  
            <div className="camera-inner">
  
              <div className="camera-preview">
              {cameraError && (
    <div style={{
      position:"absolute", inset:0,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"#1a1a1a", color:"#ccc",
      fontFamily:"Inter", fontSize:"13px",
      textAlign:"center", padding:"20px",
      zIndex:2, gap:"10px"
    }}>
      <span style={{fontSize:"32px"}}>📷</span>
      <p>{cameraError}</p>
    </div>
  )}

              <video
  ref={videoRef}
  autoPlay
  playsInline
  onCanPlay={() => setCameraReady(true)}
  className={`camera-video ${isCounting ? "dark-preview" : ""}`}
  style={{
    filter:
      filter === "bw"
        ? "grayscale(100%) contrast(130%) brightness(90%)"
        : "none",
  }}
/>
  
                {isCounting && countdown !== null && (
                  <div className="countdown">{countdown}</div>
                )}
              </div>
  
              <canvas ref={canvasRef} style={{ display: "none" }} />
  
              <button
  className="press-button"
  onClick={capturedImages.length < maxPhotos ? handleCapture : handleContinue}
  disabled={!cameraReady && capturedImages.length < maxPhotos}
  style={{ opacity: !cameraReady && capturedImages.length < maxPhotos ? 0.5 : 1,
           cursor: !cameraReady && capturedImages.length < maxPhotos ? "not-allowed" : "pointer" }}
>
  {capturedImages.length < maxPhotos ? "Press" : "Continue"}
</button>
  
            </div>
  
          </div>
  
          {selectedFilm.type === "multi" && capturedImages.length > 0 && (
            <div className="thumbnail-row">
              {capturedImages.map((img, index) => (
                <img key={index} src={img} alt="" className="thumbnail" />
              ))}
            </div>
          )}
  
          
  
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

export default Camera;