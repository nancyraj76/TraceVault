import { Navigate, Route, Routes } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<WelcomePage />} />
      <Route path="/signup" element={<WelcomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
