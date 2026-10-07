import { Routes, Route, useLocation } from 'react-router-dom'
import { ChildProvider } from './context/ChildContext'
import Nav from './components/common/Nav'
import Footer from './components/common/Footer'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Learn from './pages/Learn'
import Dashboard from './pages/Dashboard'
import Tables from './pages/Tables'

function AppContent() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isOnboarding = location.pathname === '/onboarding'

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col">
      {/* Prototype banner on all pages */}
      <div className="bg-blue-600 text-white text-center py-2 px-4 text-xs font-body">
        This is an early prototype of CHERRI PICK. Try it with your child and share your feedback!
      </div>

      {/* Nav on all pages except onboarding */}
      {!isOnboarding && <Nav />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>

      {/* Footer on all pages except onboarding */}
      {!isOnboarding && <Footer />}
    </div>
  )
}

function App() {
  return (
    <ChildProvider>
      <AppContent />
    </ChildProvider>
  )
}

export default App
