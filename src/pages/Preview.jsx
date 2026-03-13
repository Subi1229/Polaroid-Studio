import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import FilmFrame from "../components/FilmFrame";
import Doodles from "../pages/Doodles";
import scissors from "../assets/scissors.png";
import backIcon from "../assets/curve arrow.png";
import heartSolid from "../assets/heart-solid.png";
import heartOutline from "../assets/heart-outline.png";
import pointingArrow from "../assets/pointing arrow.png";
import * as htmlToImage from "html-to-image";

import "./Preview.css";

function Preview() {
  const navigate = useNavigate();
  const { selectedFilm, capturedImages, resetApp } = useAppContext();
  const filmRef = useRef(null);
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

  async function downloadSingle(element) {
    const dataUrl = await htmlToImage.toPng(element, { pixelRatio: 4 });
    const link = document.createElement("a");
    link.download = "polaroid.png";
    link.href = dataUrl;
    link.click();
  }

  async function downloadFullStrip() {
    const wasCut = isCut;
    setIsCut(false);
    await new Promise(r => setTimeout(r, 50));
    const element = document.querySelector(".film-wrapper");
    const dataUrl = await htmlToImage.toPng(element, { pixelRatio: 3, cacheBust: true });
    if (wasCut) setIsCut(true);
    const link = document.createElement("a");
    link.download = "polaroid-strip.png";
    link.href = dataUrl;
    link.click();
  }

  async function downloadFullPolaroid() {
    if (!filmRef.current) return;
    const dataUrl = await htmlToImage.toPng(filmRef.current, { pixelRatio: 4 });
    const link = document.createElement("a");
    link.download = "polaroid-strip.png";
    link.href = dataUrl;
    link.click();
  }

  function getDateFilename(prefix="polaroid") {
    const d = new Date();
    const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return `${prefix}-${date}.png`;
  }
  
  async function generateStripImage() {
  
    const wasCut = isCut;
    setIsCut(false);
  
    await new Promise(r => setTimeout(r, 60));
  
    const element = document.querySelector(".film-wrapper");
  
    const dataUrl = await htmlToImage.toPng(element, {
      pixelRatio: 4,
      cacheBust: true
    });
  
    if (wasCut) setIsCut(true);
  
    const blob = await (await fetch(dataUrl)).blob();
  
    return { dataUrl, blob };
  }

  async function shareStrip() {
    try {
      const { blob, dataUrl } = await generateStripImage();
      const fileName = getDateFilename();
 
      // Mobile → native share dialog
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && navigator.share) {
        const file = new File([blob], fileName, { type: "image/png" });
        await navigator.share({
          files: [file],
          title: "My Polaroid",
          text: "Check out my photobooth strip!"
        });
        return;
      }
 
      // Desktop → open styled share page
      const shareWindow = window.open("", "_blank");
      shareWindow.document.write(`
        <html>
          <head>
            <title>Share your Polaroid</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                font-family: Arial, sans-serif;
                background: #F5F0EB;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                gap: 24px;
                padding: 32px;
              }
              h2 {
                font-size: 22px;
                font-weight: 700;
                color: #111;
              }
              img {
                max-height: 40vh;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
              }
              .buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                justify-content: center;
              }
              a, button {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 22px;
                border-radius: 30px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                border: none;
              }
              .btn-whatsapp { background: #25D366; color: white; }
              .btn-twitter  { background: #000000; color: white; }
              .btn-copy     { background: #333; color: white; }
              .btn-download { background: white; color: #111; border: 2px solid #111; }
              .hint {
                font-size: 13px;
                color: #888;
                text-align: center;
                max-width: 340px;
                line-height: 1.5;
              }
              #copy-label { transition: all 0.2s; }
            </style>
          </head>
          <body>
            <h2>Share your Polaroid</h2>
            <img src="${dataUrl}" />
            <div class="buttons">
 
              <a class="btn-whatsapp" href="https://wa.me/?text=Check%20out%20my%20photobooth%20strip!" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
 
              <a class="btn-twitter" href="https://twitter.com/intent/tweet?text=Check%20out%20my%20photobooth%20strip!" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>
 
              <button class="btn-copy" onclick="copyImage()">
                <svg id="copy-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                <span id="copy-label">Copy Image</span>
              </button>
 
              <a class="btn-download" href="${dataUrl}" download="${fileName}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download
              </a>
 
            </div>
            <p class="hint">
              To share via <strong>Nearby Share or Bluetooth</strong>: click Download first, then use your file manager or system share to send the saved image.
            </p>
            <script>
              async function copyImage() {
                try {
                  const res = await fetch("${dataUrl}");
                  const blob = await res.blob();
                  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                  document.getElementById("copy-label").innerText = "✅ Copied!";
                  setTimeout(() => document.getElementById("copy-label").innerText = "Copy Image", 2000);
                } catch(e) {
                  alert("Copy failed. Try downloading instead.");
                }
              }
            </script>
          </body>
        </html>
      `);
      shareWindow.document.close();
 
    } catch (err) {
      console.error("Share failed:", err);
    }
  }
 
  async function printStrip() {
    try {
  
      const { dataUrl } = await generateStripImage();
  
      const printWindow = window.open("", "_blank");
  
      if (!printWindow) {
        alert("Please allow popups to print.");
        return;
      }
  
      const html = `
        <html>
          <head>
            <title>Print Polaroid</title>
            <style>

  @page {
    margin: 0;
  }

  html, body {
    margin:0;
    padding:0;
    width:100%;
    height:100%;
    background:white;

    display:flex;
    justify-content:center;
    align-items:center;
  }

  img{
    max-height:95vh;
    max-width:100%;
    object-fit:contain;
  }

</style>
          </head>
  
          <body>
            <img id="strip" src="${dataUrl}" />
          </body>
        </html>
      `;
  
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
  
      const checkLoaded = setInterval(() => {
        const img = printWindow.document.getElementById("strip");
  
        if (img && img.complete) {
          clearInterval(checkLoaded);
          printWindow.focus();
          printWindow.print();
        }
      }, 100);
  
    } catch (err) {
      console.error("Print failed", err);
    }
  }

  return (
    <div className="preview-page">
      <Doodles />
      <div className={`preview-container ${selectedFilm.type === "multi" ? "multi-layout" : ""}`}>

        {/* FILM */}
        <div ref={filmRef} className={`film-wrapper ${selectedFilm.type === "multi" ? "multi-film" : "single-film"}`}>
          {!isCut && <FilmFrame film={selectedFilm} images={capturedImages} />}

          {isCut && selectedFilm.type === "multi" && (
            <div className="cut-frames">
              {capturedImages.map((img, index) => (
                <div
                  key={index}
                  className={`cut-frame ${selectedFilm.theme} ${index === 2 ? "last-frame" : ""}`}
                  onClick={(e) => downloadSingle(e.currentTarget)}
                >
                  <div className="cut-photo">
                    <img src={img} alt="cut frame" />
                  </div>

                  {index === 2 && selectedFilm.hasHearts && (
                    <div className="cut-hearts-pattern">
                      {[
                        { left: -5, size: 60, rotate: -16, flip: false, img: heartSolid },
                        { left: 45, size: 65, rotate: 10, flip: true, img: heartOutline },
                        { left: 110, size: 75, rotate: -6, flip: false, img: heartSolid },
                        { left: 180, size: 60, rotate: 12, flip: false, img: heartOutline },
                        { left: 240, size: 55, rotate: -10, flip: true, img: heartSolid },
                      ].map((heart, i) => (
                        <img key={i} src={heart.img} alt="" style={{
                          position: "absolute", bottom: 0, left: heart.left, width: heart.size,
                          transform: `${heart.flip ? "scaleX(-1)" : ""} rotate(${heart.rotate}deg)`
                        }} />
                      ))}
                      {[
                        { left: 40, size: 50, rotate: 14, flip: true, img: heartOutline },
                        { left: 150, size: 55, rotate: -10, flip: false, img: heartSolid },
                        { left: 230, size: 48, rotate: 18, flip: true, img: heartOutline },
                      ].map((heart, i) => (
                        <img key={i} src={heart.img} alt="" style={{
                          position: "absolute", bottom: 28, left: heart.left, width: heart.size,
                          transform: `${heart.flip ? "scaleX(-1)" : ""} rotate(${heart.rotate}deg)`
                        }} />
                      ))}
                    </div>
                  )}

                  {index === 2 && selectedFilm.textLayout && (
                    <div className="cut-bottom">
                      <span className="cut-text">x</span>
                      <span className="cut-text">P80/20 120</span>
                      <span className="cut-text">{selectedFilm.textLayout === "ko" ? "KO" : ""}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div ref={originalStripRef} style={{ position: "fixed", top: 0, left: 0, opacity: 0, pointerEvents: "none", zIndex: -1 }}>
          <FilmFrame film={selectedFilm} images={capturedImages} />
        </div>

        {/* SCISSORS BUTTON */}
        {selectedFilm.type === "multi" && (
          <img
            src={isCut ? backIcon : scissors}
            className={`cut-button ${isCut ? "back-arrow" : ""}`}
            onClick={() => setIsCut(!isCut)}
            alt="cut"
          />
        )}

        {/* Arrow + text */}
        <div className={`photo-label ${isCut ? "cut-label" : ""}`}>

<span>
  {isCut
    ? "Click on any photo to download separately"
    : "Your Polaroid is ready!"}
</span>

{isCut ? (
  <img src={pointingArrow} className="cut-arrow" alt="" />
) : (
  <img src={pointingArrow} className="photo-arrow" alt="" />
)}

</div>
        {/* Buttons */}
        <div className="action-buttons">
          <button className="download-btn" onClick={downloadFullStrip}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>

          <button className="outline-btn" onClick={shareStrip}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
            Share
          </button>

          <button className="outline-btn" onClick={printStrip}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
            </svg>
            Print
          </button>

          <button className="outline-btn" onClick={handleRestart}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Restart
          </button>
        </div>

      </div>
    </div>
  );
}

export default Preview;