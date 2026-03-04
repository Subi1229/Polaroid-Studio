import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import FilmFrame from '../components/FilmFrame';

function Preview() {
  const navigate = useNavigate();
  const { selectedFilm, capturedImages, resetApp } = useAppContext();

  useEffect(() => {
    if (!selectedFilm) {
      navigate('/film');
    }
  }, [selectedFilm, navigate]);

  if (!selectedFilm) return null;

  function handleRestart() {
    resetApp();
    navigate('/film');
  }

  return (
    <div
      style={{
        background: "#F5F0EB",
        minHeight: "100vh",
        width: "100%",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <FilmFrame film={selectedFilm} images={capturedImages} />

      <div style={{ marginTop: "20px" }}>
        <button>Download</button>
        <button>Share</button>
        <button>Print</button>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </div>
  );
}

export default Preview;
