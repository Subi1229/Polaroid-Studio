import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import filmConfig from "../config/filmConfig";
import FilmFrame from "../components/FilmFrame";
import "./Film.css";
import Doodles from "../pages/Doodles";

export default function FilmSelection() {
  const navigate = useNavigate();
  const { selectedFilm, setSelectedFilm } = useAppContext();

  const scrollRef = useRef(null);
const [canScrollLeft, setCanScrollLeft] = useState(false);
const [canScrollRight, setCanScrollRight] = useState(false);


  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  }
  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
  
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
  
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 5);
  }
  
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
  
    const timer = setTimeout(updateArrows, 100);
  
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
  
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  

  return (
    <div className="film-page">
<Doodles />

<div className="film-header">
  <h2>Select frame</h2>
</div>

      <div className="film-section">

      {canScrollLeft && (
  <button
    className="arrow-btn arrow-left"
    onClick={() => scroll("left")}
  >
    <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth="1.5"
  stroke="currentColor"
  className="arrow-icon"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15.75 19.5 8.25 12l7.5-7.5"
  />
</svg>

  </button>
)}

{canScrollRight && (
  <button
    className="arrow-btn arrow-right"
    onClick={() => scroll("right")}
  >
    <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth="1.5"
  stroke="currentColor"
  className="arrow-icon"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="m8.25 4.5 7.5 7.5-7.5 7.5"
  />
</svg>
  </button>
)}

        <div className="scroll-container" ref={scrollRef}>

          <div className="film-row">

            {filmConfig.map((film) => (
              <div
                key={film.id}
                className="film-item"
                onClick={() => setSelectedFilm(film)}
              >

<div className={`film-frame-wrapper ${
  selectedFilm?.id === film.id ? "selected" : ""
}`}>
                  <FilmFrame film={film} images={[]} variant="thumbnail" />
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      <div className="film-footer">

        {selectedFilm && (
          <button
            className="continue-btn"
            onClick={() => navigate("/instructions")}
          >
            Continue
          </button>
        )}

      </div>

    </div>
  );
}