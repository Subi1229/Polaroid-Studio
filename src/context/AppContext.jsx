import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedFilm, setSelectedFilm] = useState(null);
const [capturedImages, setCapturedImages] = useState([]);
const [filter, setFilter] = useState("color");

function resetApp() {
  setSelectedFilm(null);
  setCapturedImages([]);
  setFilter("color");
}

  return (
    <AppContext.Provider
    value={{
      selectedFilm,
      setSelectedFilm,
      capturedImages,
      setCapturedImages,
      filter,
      setFilter,
      resetApp,
    }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

export default AppContext;
