import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Landing from './pages/Landing'
import Start from './pages/Start'
import FilmSelection from './pages/FilmSelection'
import Instructions from './pages/Instructions'
import Camera from './pages/Camera'
import Upload from './pages/Upload'
import Printing from './pages/Printing'
import Preview from './pages/Preview'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Start />} />
          <Route path="/film" element={<FilmSelection />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/printing" element={<Printing />} />
          <Route path="/preview" element={<Preview />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
