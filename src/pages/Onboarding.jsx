import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChild } from '../context/ChildContext'

const AVATARS = [
  { id: 'fox', emoji: '🦊', name: 'Foxy' },
  { id: 'panda', emoji: '🐼', name: 'Bamboo' },
  { id: 'unicorn', emoji: '🦄', name: 'Sparkle' },
  { id: 'robot', emoji: '🤖', name: 'Beep' },
  { id: 'cat', emoji: '🐱', name: 'Whiskers' },
  { id: 'dog', emoji: '🐶', name: 'Buddy' },
  { id: 'owl', emoji: '🦉', name: 'Hoot' },
  { id: 'dragon', emoji: '🐉', name: 'Blaze' },
  { id: 'bunny', emoji: '🐰', name: 'Hop' },
  { id: 'bear', emoji: '🐻', name: 'Teddy' },
]

const AVATAR_COLORS = [
  { id: 'cherry', color: '#FF0000', name: 'Cherry Red' },
  { id: 'blue', color: '#2563EB', name: 'Ocean Blue' },
  { id: 'green', color: '#16A34A', name: 'Forest Green' },
  { id: 'purple', color: '#9333EA', name: 'Magic Purple' },
  { id: 'orange', color: '#EA580C', name: 'Sunset Orange' },
  { id: 'pink', color: '#EC4899', name: 'Bubblegum Pink' },
  { id: 'teal', color: '#0D9488', name: 'Cool Teal' },
  { id: 'yellow', color: '#CA8A04', name: 'Golden' },
]

const INTERESTS = [
  { id: 'animals', emoji: '🐾', name: 'Animals' },
  { id: 'space', emoji: '🚀', name: 'Space' },
  { id: 'sports', emoji: '⚽', name: 'Sports' },
  { id: 'art', emoji: '🎨', name: 'Art' },
  { id: 'food', emoji: '🍕', name: 'Food' },
  { id: 'music', emoji: '🎵', name: 'Music' },
  { id: 'nature', emoji: '🌿', name: 'Nature' },
  { id: 'games', emoji: '🎮', name: 'Games' },
]

const LEARNING_STYLES = [
  {
    id: 'visual',
    emoji: '👀',
    name: 'Show Me Pictures',
    desc: 'I learn best when I can see it!',
    example: 'See 3 rows of 4 dots = 12',
  },
  {
    id: 'story',
    emoji: '📖',
    name: 'Tell Me a Story',
    desc: 'I like when math is part of a story!',
    example: '3 friends each have 4 cookies...',
  },
  {
    id: 'hands-on',
    emoji: '🤲',
    name: 'Let Me Try It',
    desc: 'I want to move things and build!',
    example: 'Drag and drop to build groups',
  },
  {
    id: 'steps',
    emoji: '📝',
    name: 'Step by Step',
    desc: 'Show me the steps clearly!',
    example: 'Step 1, Step 2, Step 3...',
  },
]

const STEPS = ['name', 'age', 'style', 'avatar', 'interests']

export default function Onboarding() {
  const navigate = useNavigate()
  const { updateProfile } = useChild()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState(null)
  const [learningStyle, setLearningStyle] = useState(null)
  const [avatar, setAvatar] = useState({ character: 'fox', color: '#FF0000' })
  const [interests, setInterests] = useState([])

  const currentStep = STEPS[step]
  const progress = ((step + 1) / STEPS.length) * 100

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      updateProfile({
        name,
        age,
        grade: Math.max(1, age - 5),
        avatar,
        interests,
        learningStyle,
        onboardingComplete: true,
      })
      navigate('/tables')
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'name': return name.trim().length > 0
      case 'age': return age !== null
      case 'style': return learningStyle !== null
      case 'avatar': return true
      case 'interests': return interests.length > 0
      default: return false
    }
  }

  const toggleInterest = (id) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const slideVariants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-3 bg-cherry-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cherry rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {STEPS.map((s, i) => (
            <span key={s} className={i <= step ? 'text-cherry font-bold' : ''}>
              {['👤', '🎂', '🧠', '🎭', '❤️'][i]}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* NAME STEP */}
            {currentStep === 'name' && (
              <div className="text-center">
                <div className="text-6xl mb-6">👋</div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Hi there!</h2>
                <p className="text-gray-500 mb-8">What should we call you?</p>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && canProceed() && next()}
                  placeholder="Type your name..."
                  autoFocus
                  className="w-full text-center text-2xl font-display font-bold border-b-4 border-cherry-200 focus:border-cherry outline-none py-3 bg-transparent text-gray-900 placeholder-gray-300 transition-colors"
                />
              </div>
            )}

            {/* AGE STEP */}
            {currentStep === 'age' && (
              <div className="text-center">
                <div className="text-6xl mb-6">🎂</div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
                  Hey {name}!
                </h2>
                <p className="text-gray-500 mb-8">How old are you?</p>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 6, 7, 8, 9, 10, 11, 12].map(a => (
                    <motion.button
                      key={a}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAge(a)}
                      className={`py-4 rounded-2xl text-2xl font-display font-bold transition-all ${
                        age === a
                          ? 'bg-cherry text-white shadow-lg shadow-cherry/30'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-cherry-200'
                      }`}
                    >
                      {a}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* LEARNING STYLE STEP */}
            {currentStep === 'style' && (
              <div className="text-center">
                <div className="text-6xl mb-6">🧠</div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
                  How do you like to learn?
                </h2>
                <p className="text-gray-500 mb-8">Pick what feels right for you!</p>
                <div className="grid grid-cols-1 gap-3">
                  {LEARNING_STYLES.map(style => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLearningStyle(style.id)}
                      className={`p-4 rounded-2xl text-left transition-all flex items-start gap-4 ${
                        learningStyle === style.id
                          ? 'bg-cherry-50 border-2 border-cherry shadow-md'
                          : 'bg-white border-2 border-gray-200 hover:border-cherry-200'
                      }`}
                    >
                      <span className="text-3xl">{style.emoji}</span>
                      <div>
                        <div className="font-display font-bold text-gray-900">{style.name}</div>
                        <div className="text-sm text-gray-500">{style.desc}</div>
                        <div className="text-xs text-cherry-600 mt-1 italic">e.g. {style.example}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* AVATAR STEP */}
            {currentStep === 'avatar' && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎭</div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
                  Pick your learning buddy!
                </h2>
                <p className="text-gray-500 mb-6">They'll learn with you every step of the way</p>

                {/* Preview */}
                <motion.div
                  key={avatar.character + avatar.color}
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-lg"
                  style={{ backgroundColor: avatar.color + '20', borderColor: avatar.color, borderWidth: 3 }}
                >
                  {AVATARS.find(a => a.id === avatar.character)?.emoji}
                </motion.div>

                <div className="grid grid-cols-5 gap-2 mb-6">
                  {AVATARS.map(a => (
                    <motion.button
                      key={a.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setAvatar(prev => ({ ...prev, character: a.id }))}
                      className={`p-2 rounded-xl text-2xl transition-all ${
                        avatar.character === a.id
                          ? 'bg-cherry-100 border-2 border-cherry'
                          : 'bg-white border-2 border-gray-200'
                      }`}
                      title={a.name}
                    >
                      {a.emoji}
                    </motion.button>
                  ))}
                </div>

                <p className="text-sm text-gray-400 mb-3">Pick a color</p>
                <div className="flex justify-center gap-2">
                  {AVATAR_COLORS.map(c => (
                    <motion.button
                      key={c.id}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setAvatar(prev => ({ ...prev, color: c.color }))}
                      className={`w-8 h-8 rounded-full transition-all ${
                        avatar.color === c.color ? 'ring-4 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c.color, ringColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* INTERESTS STEP */}
            {currentStep === 'interests' && (
              <div className="text-center">
                <div className="text-6xl mb-6">❤️</div>
                <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
                  What do you love?
                </h2>
                <p className="text-gray-500 mb-8">Pick as many as you want! We'll use these to make math fun for you.</p>
                <div className="grid grid-cols-2 gap-3">
                  {INTERESTS.map(interest => (
                    <motion.button
                      key={interest.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-2xl text-center transition-all ${
                        interests.includes(interest.id)
                          ? 'bg-cherry-50 border-2 border-cherry shadow-md'
                          : 'bg-white border-2 border-gray-200 hover:border-cherry-200'
                      }`}
                    >
                      <div className="text-3xl mb-1">{interest.emoji}</div>
                      <div className="font-display font-bold text-sm text-gray-700">{interest.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-lg flex justify-between items-center mt-8 px-4">
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          className={`font-display font-bold text-lg px-6 py-3 rounded-full transition-all ${
            step > 0
              ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              : 'invisible'
          }`}
        >
          ← Back
        </button>

        <motion.button
          whileHover={canProceed() ? { scale: 1.05 } : {}}
          whileTap={canProceed() ? { scale: 0.95 } : {}}
          onClick={() => canProceed() && next()}
          disabled={!canProceed()}
          className={`font-display font-bold text-lg px-8 py-3 rounded-full transition-all ${
            canProceed()
              ? 'bg-cherry text-white shadow-lg shadow-cherry/30 hover:bg-cherry-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === STEPS.length - 1 ? "Let's Learn! 🍒" : 'Next →'}
        </motion.button>
      </div>
    </div>
  )
}
