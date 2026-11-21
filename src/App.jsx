import { Navigate, Route, Routes } from 'react-router-dom'
import AuthChoicePage from './pages/AuthChoicePage.jsx'
import AssistantPage from './pages/AssistantPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import EvidenceVaultPage from './pages/EvidenceVaultPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth" element={<AuthChoicePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/evidence-vault" element={<EvidenceVaultPage />} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
