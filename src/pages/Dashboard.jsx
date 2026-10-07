import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChild } from '../context/ChildContext'

const AVATAR_EMOJI = {
  fox: '🦊', panda: '🐼', unicorn: '🦄', robot: '🤖', cat: '🐱',
  dog: '🐶', owl: '🦉', dragon: '🐉', bunny: '🐰', bear: '🐻',
}

const METHOD_NAMES = {
  visual: 'Picture Grid',
  japanese: 'Line Magic',
  story: 'Story Time',
  bar: 'Bar Model',
  skip: 'Skip Counting',
  lattice: 'Lattice Grid',
}

const BADGES = [
  { id: 'first', name: 'First Step', emoji: '🌱', desc: 'Solved your first problem', check: p => p.problemsSolved >= 1 },
  { id: 'five', name: 'High Five', emoji: '🖐️', desc: 'Solved 5 problems', check: p => p.problemsSolved >= 5 },
  { id: 'ten', name: 'Perfect 10', emoji: '🔟', desc: 'Solved 10 problems', check: p => p.problemsSolved >= 10 },
  { id: 'explorer', name: 'Method Explorer', emoji: '🗺️', desc: 'Tried 3 different methods', check: p => Object.keys(p.methodsUsed).length >= 3 },
  { id: 'allrounder', name: 'All-Rounder', emoji: '🌈', desc: 'Tried all 6 methods', check: p => Object.keys(p.methodsUsed).length >= 6 },
  { id: 'streak3', name: 'On Fire', emoji: '🔥', desc: '3-day streak', check: p => p.streak >= 3 },
  { id: 'fifty', name: 'Math Wizard', emoji: '🧙', desc: 'Solved 50 problems', check: p => p.problemsSolved >= 50 },
  { id: 'hundred', name: 'Cherry Master', emoji: '🍒', desc: 'Solved 100 problems', check: p => p.problemsSolved >= 100 },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile, resetProfile } = useChild()
  const { progress } = profile

  if (!profile.onboardingComplete) {
    navigate('/onboarding')
    return null
  }

  const accuracy = progress.problemsSolved > 0
    ? Math.round((progress.correctAnswers / progress.problemsSolved) * 100)
    : 0

  const favoriteMethod = Object.entries(progress.methodsUsed).sort(
    (a, b) => b[1].used - a[1].used
  )[0]

  const xpToNext = 100 - (progress.xp % 100)
  const xpProgress = (progress.xp % 100) / 100 * 100

  const earnedBadges = BADGES.filter(b => b.check(progress))
  const lockedBadges = BADGES.filter(b => !b.check(progress))

  return (
    <div>
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-4xl border-3"
            style={{ backgroundColor: profile.avatar.color + '20', borderColor: profile.avatar.color }}
          >
            {AVATAR_EMOJI[profile.avatar.character]}
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-gray-900">{profile.name}</h2>
          <p className="text-gray-500 text-sm">Age {profile.age} | Level {progress.level}</p>

          {/* XP bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Level {progress.level}</span>
              <span>{xpToNext} XP to Level {progress.level + 1}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-cherry rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{progress.xp} total XP</p>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Solved', value: progress.problemsSolved, emoji: '✅' },
            { label: 'Accuracy', value: `${accuracy}%`, emoji: '🎯' },
            { label: 'Streak', value: `${progress.streak} day${progress.streak !== 1 ? 's' : ''}`, emoji: '🔥' },
            { label: 'Methods', value: Object.keys(progress.methodsUsed).length, emoji: '🧩' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100"
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="font-display font-bold text-xl text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Favorite method */}
        {favoriteMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-cherry-50 rounded-2xl p-5 border border-cherry-100"
          >
            <p className="font-display font-bold text-cherry-700 text-sm mb-1">Your Favorite Method</p>
            <p className="font-display text-xl font-bold text-gray-900">
              {METHOD_NAMES[favoriteMethod[0]] || favoriteMethod[0]}
            </p>
            <p className="text-sm text-gray-500">
              Used {favoriteMethod[1].used} times — {Math.round((favoriteMethod[1].correct / favoriteMethod[1].used) * 100)}% accuracy
            </p>
          </motion.div>
        )}

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="font-display font-bold text-lg text-gray-900 mb-3">Badges</h3>
          <div className="grid grid-cols-4 gap-3">
            {earnedBadges.map(badge => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.1 }}
                className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100"
                title={badge.desc}
              >
                <div className="text-3xl mb-1">{badge.emoji}</div>
                <div className="text-xs font-display font-bold text-gray-700 leading-tight">{badge.name}</div>
              </motion.div>
            ))}
            {lockedBadges.map(badge => (
              <div
                key={badge.id}
                className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100 opacity-40"
                title={badge.desc}
              >
                <div className="text-3xl mb-1 grayscale">🔒</div>
                <div className="text-xs font-display font-bold text-gray-400 leading-tight">{badge.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/learn')}
            className="bg-cherry text-white font-display font-bold text-lg px-10 py-4 rounded-full shadow-lg shadow-cherry/30 hover:bg-cherry-600 transition-colors"
          >
            Keep Learning! 🍒
          </motion.button>
        </motion.div>

        {/* Reset (small, at bottom) */}
        <div className="text-center pt-8 pb-4">
          <button
            onClick={() => {
              if (window.confirm('Start fresh? This will reset all progress.')) {
                resetProfile()
                navigate('/')
              }
            }}
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            Reset Profile
          </button>
        </div>
      </main>
    </div>
  )
}
