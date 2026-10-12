import { useNavigate, useLocation } from 'react-router-dom'
import { useChild } from '../../context/ChildContext'
import { SiteNav } from './SiteChrome'

const AVATAR_EMOJI = { fox: '🦊', panda: '🐼', unicorn: '🦄', robot: '🤖', cat: '🐱', dog: '🐶', owl: '🦉', dragon: '🐉', bunny: '🐰', bear: '🐻' }
const APP_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Tables', path: '/tables' },
  { label: 'Mix It Up', path: '/learn' },
  { label: 'Progress', path: '/dashboard' },
]

// The standard CHERRI GROUP header, with PICK's own menu in a bar underneath.
export default function Nav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useChild()

  return (
    <>
      <SiteNav />
      {profile.onboardingComplete && (
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5 text-sm font-semibold font-body overflow-x-auto">
              {APP_LINKS.map(l => (
                <button key={l.path} onClick={() => navigate(l.path)}
                  className={`whitespace-nowrap transition-colors ${location.pathname === l.path ? 'text-cherry' : 'text-gray-500 hover:text-cherry'}`}>
                  {l.label}
                </button>
              ))}
            </div>
            <button onClick={() => navigate('/dashboard')} className="text-2xl flex-shrink-0" title="My Profile">
              {AVATAR_EMOJI[profile.avatar?.character] || '🦊'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
