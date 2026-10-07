import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChild } from '../context/ChildContext'

export default function Landing() {
  const navigate = useNavigate()
  const { profile } = useChild()
  const [email, setEmail] = useState('')
  const [waitlisted, setWaitlisted] = useState(false)

  const handleStart = () => {
    if (profile.onboardingComplete) {
      navigate('/tables')
    } else {
      navigate('/onboarding')
    }
  }

  const handleWaitlist = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      const res = await fetch('/api/waitlist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setWaitlisted(true)
      } else {
        // Fallback to localStorage if API fails
        const waitlist = JSON.parse(localStorage.getItem('cherripick_waitlist') || '[]')
        waitlist.push({ email, date: new Date().toISOString() })
        localStorage.setItem('cherripick_waitlist', JSON.stringify(waitlist))
        setWaitlisted(true)
      }
    } catch {
      // Fallback to localStorage
      const waitlist = JSON.parse(localStorage.getItem('cherripick_waitlist') || '[]')
      waitlist.push({ email, date: new Date().toISOString() })
      localStorage.setItem('cherripick_waitlist', JSON.stringify(waitlist))
      setWaitlisted(true)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="w-36 h-36 bg-cherry-100 rounded-full flex items-center justify-center shadow-lg shadow-cherry-200/50">
            <img src="/cherry-icon.png" alt="" className="w-24 h-24 object-contain" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-5xl md:text-6xl font-bold text-gray-900 text-center mb-4"
        >
          CHERRI <span className="text-cherry">PICK</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-gray-600 text-center mb-2 font-body"
        >
          Learning, picked just for you
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-base text-gray-400 text-center mb-8 max-w-md font-body"
        >
          Every child learns differently. CHERRI PICK lets YOUR child choose how they want to learn math. 6 different methods. Their choice.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="bg-cherry text-white font-display font-bold text-xl px-10 py-4 rounded-full shadow-lg shadow-cherry/30 hover:bg-cherry-600 transition-colors"
        >
          {profile.onboardingComplete ? `Let's Learn, ${profile.name}!` : "Try the Prototype 🍒"}
        </motion.button>

        {/* Parent note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 max-w-lg bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center"
        >
          <p className="text-sm text-amber-800 font-body font-semibold mb-1">A note for parents</p>
          <p className="text-sm text-amber-700 font-body leading-relaxed mb-2">
            Sit with your child and let them drive. Let them pick the method they want to try. If they find it hard to read, read the questions to them and ask "how do you want to solve this one?" Make it feel like play, not homework.
          </p>
          <a href="https://cherri.group/research" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-cherry font-body font-bold hover:underline">
            🔬 The science is real! Read the research
          </a>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          {[
            { icon: '🧠', title: 'Their Way', desc: 'Your child picks how they want to learn. Pictures, stories, lines, grids. Their choice.' },
            { icon: '🌍', title: 'World Methods', desc: 'Japanese line method, Singapore bars, visual grids, skip counting. 6 ways to solve the same problem.' },
            { icon: '🌱', title: 'No Pressure', desc: 'No timers, no scores, no "wrong" answers. Every try is progress.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 font-body">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Waitlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-16 max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center"
        >
          <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
            Want the full version?
          </h3>
          <p className="text-sm text-gray-500 font-body mb-4">
            This is an early prototype. The full app with structured lessons, progress tracking, and more methods is being built. Join the waitlist to be the first to try it.
          </p>
          {waitlisted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-body font-semibold">You're on the list! We'll reach out soon.</p>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-body text-sm focus:border-cherry focus:outline-none transition-colors min-w-0"
              />
              <button
                type="submit"
                className="bg-cherry text-white font-display font-bold px-6 py-3 rounded-xl hover:bg-cherry-600 transition-colors text-sm whitespace-nowrap"
              >
                Join
              </button>
            </form>
          )}
        </motion.div>
      </main>

    </div>
  )
}
