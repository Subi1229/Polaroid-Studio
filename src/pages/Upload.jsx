import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Doodles from "../pages/Doodles";
import heartOutline from "../assets/heart-outline.png";
import heartSolid from "../assets/heart-solid.png";
import Cropper from "react-easy-crop";
import "./Upload.css";

function Upload() {
  const navigate = useNavigate();
  const [cropSrc, setCropSrc] = useState(null);
  const [cropIndex, setCropIndex] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [hoverIndex, setHoverIndex] = useState(null);

  const { selectedFilm, capturedImages, setCapturedImages, filter } =
    useAppContext();

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!selectedFilm) {
      navigate("/film");
    }
  }, [selectedFilm, navigate]);

  useEffect(() => {
    setCapturedImages([]);
  }, [setCapturedImages]);

  if (!selectedFilm) return null;

  const maxPhotos = selectedFilm.type === "single" ? 1 : 3;

  function applyFilter(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");

        if (filter === "bw") {
          ctx.filter = "grayscale(100%) contrast(130%) brightness(90%)";
        } else {
          ctx.filter = "none";
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";

        resolve(canvas.toDataURL("image/png"));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /* FIX #1 — handle replace index correctly */
  async function handleFileChange(e) {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      setCropSrc(reader.result);

      if (cropIndex !== null) {
        setCropIndex(cropIndex);
      } else {
        setCropIndex(capturedImages.length);
      }

    };

    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemove(index) {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleContinue() {
    navigate("/printing");
  }

  function onCropComplete(_, croppedPixels) {
    setCroppedAreaPixels(croppedPixels);
  }

  async function createImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  /* FIX #2 — strict replace logic */
  async function applyCrop() {

    const image = await createImage(cropSrc);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    if (filter === "bw") {
      ctx.filter = "grayscale(100%) contrast(130%) brightness(90%)";
    } else {
      ctx.filter = "none";
    }

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    ctx.filter = "none";

    const cropped = canvas.toDataURL("image/png");

    setCapturedImages(prev => {

      const updated = [...prev];

      if (cropIndex !== null && cropIndex < updated.length) {
        updated[cropIndex] = cropped;   // REPLACE
      } else {
        updated.push(cropped);          // ADD NEW
      }

      return updated;

    });

    /* reset crop state */
    setCropSrc(null);
    setCropIndex(null);

  }

  function cancelCrop() {
    setCropSrc(null);
    setCropIndex(null);
  }

  const canUploadMore = capturedImages.length < maxPhotos;
  const canContinue = capturedImages.length === maxPhotos;

  return (
    <div className="instructions-page">
      <Doodles />

      <div className="instructions-container">
        <div className="main-card">
          <div className="white-card">

          <div className="back-frame">

<div
  className="back-button"
  onClick={() => navigate("/instructions")}
>
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

<div
  className="restart-button"
  onClick={() => setCapturedImages([])}
>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="restart-icon"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>

</div>

</div>

            <div className="upload-inner">

              {capturedImages.length === 0 ? (
                <label className="upload-dropzone" htmlFor="upload-input">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="upload-dropzone-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>

                  <span className="upload-dropzone-text">
                    Click to upload {maxPhotos > 1 ? "photos" : "a photo"}
                  </span>

                  <span className="upload-dropzone-hint">
                    {maxPhotos} photo{maxPhotos > 1 ? "s" : ""} required
                  </span>

                </label>

              ) : (

                <div className="upload-preview-grid">

                  {capturedImages.map((img, index) => (

                    <div
                      key={index}
                      className="upload-preview-item"
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >

                      <img
                        src={img}
                        alt={`Upload ${index + 1}`}
                        className="upload-preview-img"
                      />

                      {hoverIndex === index && (
                        <div
                          className="replace-overlay"
                          onClick={() => {
                            setCropIndex(index);
                            fileInputRef.current.click();
                          }}
                        >
                          Replace
                        </div>
                      )}


                    </div>

                  ))}

                  {canUploadMore && (
                    <label className="upload-add-more" htmlFor="upload-input">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="upload-add-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </label>
                  )}

                </div>
              )}

              <input
                ref={fileInputRef}
                id="upload-input"
                type="file"
                accept="image/*"
                multiple={maxPhotos > 1}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <canvas ref={canvasRef} style={{ display: "none" }} />

              <button
                className="press-button"
                onClick={canContinue ? handleContinue : () => fileInputRef.current?.click()}
              >
                {canContinue ? "Continue" : "Upload"}
              </button>

            </div>
          </div>

          

        </div>

        <div className="steps-card">

          <div className="steps-title">Steps:</div>

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

      {cropSrc && (
        <div className="crop-modal">

          <div className="crop-container">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="crop-actions">
            <button onClick={applyCrop}>Crop</button>
            <button onClick={cancelCrop}>Cancel</button>
          </div>

        </div>
      )}

    </div>
  );
}

export default Upload;