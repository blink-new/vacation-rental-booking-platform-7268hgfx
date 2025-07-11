import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PropertyPage from './pages/PropertyPage'
import AdminPage from './pages/AdminPage'
import ImpressumPage from './pages/ImpressumPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App