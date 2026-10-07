import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChild } from '../../context/ChildContext'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useChild()
  const avatarEmoji = { fox: '🦊', panda: '🐼', unicorn: '🦄', robot: '🤖', cat: '🐱', dog: '🐶', owl: '🦉', dragon: '🐉', bunny: '🐰', bear: '🐻' }

  const isLearnPage = location.pathname === '/learn'

  return (
    <nav className="relative z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0">
      <a href="https://cherri.group" className="flex-shrink-0">
        <img src="/cherri-full-logo.png" alt="Cherri" className="h-10 md:h-12 object-contain" />
      </a>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-5 text-sm font-semibold font-body">
        {profile.onboardingComplete && (
          <>
            <button onClick={() => navigate('/')} className={`transition-colors ${location.pathname === '/' ? 'text-cherry' : 'text-gray-500 hover:text-cherry'}`}>Home</button>
            <button onClick={() => navigate('/learn')} className={`transition-colors ${location.pathname === '/learn' ? 'text-cherry' : 'text-gray-500 hover:text-cherry'}`}>Learn</button>
            <button onClick={() => navigate('/dashboard')} className={`transition-colors ${location.pathname === '/dashboard' ? 'text-cherry' : 'text-gray-500 hover:text-cherry'}`}>Progress</button>
          </>
        )}
        <a href="https://cherri.group" className="text-gray-400 hover:text-cherry transition-colors text-xs">cherri.group</a>
        {profile.onboardingComplete && (
          <button onClick={() => navigate('/dashboard')} className="text-2xl" title="My Profile">
            {avatarEmoji[profile.avatar?.character] || '🦊'}
          </button>
        )}
      </div>

      {/* Mobile: avatar + hamburger */}
      <div className="flex md:hidden items-center gap-3">
        {profile.onboardingComplete && (
          <button onClick={() => navigate('/dashboard')} className="text-xl">
            {avatarEmoji[profile.avatar?.character] || '🦊'}
          </button>
        )}
        <button onClick={() => setOpen(!open)} className="flex flex-col gap-1.5 p-2" aria-label="Menu">
          <motion.span animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-gray-800 origin-center" />
          <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block w-5 h-0.5 bg-gray-800" />
          <motion.span animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block w-5 h-0.5 bg-gray-800 origin-center" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 md:hidden"
          >
            <div className="flex flex-col py-3">
              {profile.onboardingComplete ? (
                <>
                  <button onClick={() => { navigate('/'); setOpen(false) }} className="px-6 py-3 text-left text-gray-700 hover:text-cherry hover:bg-cherry-50 font-body font-semibold text-sm">Home</button>
                  <button onClick={() => { navigate('/learn'); setOpen(false) }} className="px-6 py-3 text-left text-gray-700 hover:text-cherry hover:bg-cherry-50 font-body font-semibold text-sm">Learn</button>
                  <button onClick={() => { navigate('/dashboard'); setOpen(false) }} className="px-6 py-3 text-left text-gray-700 hover:text-cherry hover:bg-cherry-50 font-body font-semibold text-sm">My Progress</button>
                </>
              ) : (
                <button onClick={() => { navigate('/onboarding'); setOpen(false) }} className="px-6 py-3 text-left text-gray-700 hover:text-cherry hover:bg-cherry-50 font-body font-semibold text-sm">Get Started</button>
              )}
              <a href="https://cherri.group" className="px-6 py-3 text-gray-400 hover:text-cherry font-body text-sm border-t border-gray-100 mt-1 pt-3">Back to cherri.group</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
