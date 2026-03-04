import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Doodles from "../pages/Doodles";

function Camera() {
  const navigate = useNavigate();
  const { selectedFilm, capturedImages, setCapturedImages, filter } = useAppContext();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);

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
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("Camera error:", error);
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
  <div className="camera-page">

    <Doodles />

    <div className="camera-container">

      <h1>Camera</h1>

      <p>
        Captured {capturedImages.length} / {maxPhotos}
      </p>

      {/* Video + Countdown Overlay */}
      <div style={{ position: "relative", display: "inline-block" }}>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "400px",
            borderRadius: "12px",
            background: "#000",
            filter:
              filter === "bw"
                ? "grayscale(100%) contrast(130%) brightness(90%)"
                : "none",
          }}
        />

        {isCounting && countdown !== null && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "80px",
              fontWeight: "bold",
              color: "white",
              textShadow: "0 0 20px black",
            }}
          >
            {countdown}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {capturedImages.length < maxPhotos && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleCapture} disabled={isCounting}>
            Capture Photo
          </button>
        </div>
      )}

      {selectedFilm.type === "multi" && capturedImages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Thumbnails</h3>

          {capturedImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`photo-${index + 1}`}
              width={100}
              style={{ margin: "5px", borderRadius: "8px" }}
            />
          ))}
        </div>
      )}

      {capturedImages.length === maxPhotos && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleContinue}>Continue</button>
        </div>
      )}

    </div>
  </div>
);
}

export default Camera;