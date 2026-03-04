import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Printing() {
  const navigate = useNavigate();
  const [dots, setDots] = useState('');

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      setDots('.'.repeat(count));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/preview');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Printing{dots}</h1>
    </div>
  );
}

export default Printing;
