import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChild } from '../context/ChildContext'
import { generateProblem, getEncouragement } from '../data/problems'
import VisualGrid from '../components/methods/VisualGrid'
import JapaneseLine from '../components/methods/JapaneseLine'
import StoryMode from '../components/methods/StoryMode'
import BarModel from '../components/methods/BarModel'
import SkipCounting from '../components/methods/SkipCounting'
import LatticeMethod from '../components/methods/LatticeMethod'

const METHODS = [
  { id: 'visual', name: 'Picture Grid', emoji: '🟡', desc: 'See it with dots', component: VisualGrid },
  { id: 'japanese', name: 'Line Magic', emoji: '〰️', desc: 'Japanese line method', component: JapaneseLine },
  { id: 'story', name: 'Story Time', emoji: '📖', desc: 'A fun story problem', component: StoryMode },
  { id: 'bar', name: 'Bar Model', emoji: '📊', desc: 'Singapore bar model', component: BarModel },
  { id: 'skip', name: 'Skip Counting', emoji: '🔢', desc: 'Count by jumps', component: SkipCounting },
  { id: 'lattice', name: 'Lattice Grid', emoji: '🔲', desc: 'Grid multiplication', component: LatticeMethod },
]

export default function Learn() {
  const navigate = useNavigate()
  const { profile, recordProblem } = useChild()
  const [problem, setProblem] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [showMethodPicker, setShowMethodPicker] = useState(true)
  const [problemCount, setProblemCount] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)

  useEffect(() => {
    if (!profile.onboardingComplete) {
      navigate('/onboarding')
      return
    }
    newProblem()
  }, [])

  const newProblem = () => {
    const p = generateProblem(profile.age, profile.interests)
    setProblem(p)
    setSelectedMethod(null)
    setUserAnswer('')
    setFeedback(null)
    setShowMethodPicker(true)
  }

  const selectMethod = (method) => {
    setSelectedMethod(method)
    setShowMethodPicker(false)
  }

  const checkAnswer = () => {
    if (!userAnswer) return
    const correct = parseInt(userAnswer) === problem.answer
    setFeedback({
      correct,
      message: getEncouragement(correct ? 'correct' : 'tryAgain'),
    })
    if (correct) {
      recordProblem(selectedMethod, true)
      setProblemCount(prev => prev + 1)
      setSessionCorrect(prev => prev + 1)
    } else {
      recordProblem(selectedMethod, false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (feedback?.correct) {
        newProblem()
      } else {
        checkAnswer()
      }
    }
  }

  if (!problem) return null

  const MethodComponent = selectedMethod ? METHODS.find(m => m.id === selectedMethod)?.component : null
  const avatarEmoji = { fox: '🦊', panda: '🐼', unicorn: '🦄', robot: '🤖', cat: '🐱', dog: '🐶', owl: '🦉', dragon: '🐉', bunny: '🐰', bear: '🐻' }

  return (
    <div className="flex flex-col">
      {/* XP status bar */}
      <div className="flex items-center justify-center gap-3 py-2 bg-cherry-50 text-sm font-display">
        <span className="text-cherry font-bold">Level {profile.progress.level}</span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500">⭐ {profile.progress.xp} XP</span>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Avatar greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 self-start"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
            style={{ backgroundColor: profile.avatar.color + '20', borderColor: profile.avatar.color }}
          >
            {avatarEmoji[profile.avatar.character]}
          </div>
          <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 font-body">
              {problemCount === 0
                ? `Ready to explore, ${profile.name}? Pick how you want to solve this!`
                : sessionCorrect > 0
                  ? `${sessionCorrect} solved! You're doing amazing! 🌟`
                  : "Keep trying, you'll get it! Every try counts! 💪"}
            </p>
          </div>
        </motion.div>

        {/* Problem display */}
        <motion.div
          key={problem.a + '-' + problem.b}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 w-full mb-6 text-center"
        >
          <p className="text-sm text-gray-400 font-display mb-2">Solve this!</p>
          <div className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-2">
            {problem.a} <span className="text-cherry">×</span> {problem.b}
          </div>
          <p className="text-gray-400 text-sm">= ?</p>
        </motion.div>

        {/* Method picker */}
        <AnimatePresence mode="wait">
          {showMethodPicker ? (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <p className="font-display font-bold text-center text-gray-700 mb-4">
                How would you like to solve it?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {METHODS.map(method => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectMethod(method.id)}
                    className="bg-white rounded-2xl p-4 text-center border-2 border-gray-200 hover:border-cherry-300 hover:shadow-md transition-all"
                  >
                    <div className="text-3xl mb-2">{method.emoji}</div>
                    <div className="font-display font-bold text-sm text-gray-800">{method.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{method.desc}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="method"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {/* Current method header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{METHODS.find(m => m.id === selectedMethod)?.emoji}</span>
                  <span className="font-display font-bold text-gray-700">
                    {METHODS.find(m => m.id === selectedMethod)?.name}
                  </span>
                </div>
                <button
                  onClick={() => setShowMethodPicker(true)}
                  className="text-sm text-cherry-600 hover:text-cherry-700 font-display font-bold"
                >
                  Try Another Way 🔄
                </button>
              </div>

              {/* Method visualization */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 w-full mb-6">
                {MethodComponent && <MethodComponent a={problem.a} b={problem.b} answer={problem.answer} problem={problem} />}
              </div>

              {/* Answer input */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-gray-700">
                    {problem.a} × {problem.b} =
                  </span>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={e => { setUserAnswer(e.target.value); setFeedback(null) }}
                    onKeyDown={handleKeyDown}
                    placeholder="?"
                    autoFocus
                    className="w-24 text-center text-3xl font-display font-bold border-b-4 border-cherry-200 focus:border-cherry outline-none py-2 bg-transparent text-gray-900 placeholder-gray-300 transition-colors"
                  />
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`text-center p-4 rounded-2xl w-full ${
                        feedback.correct
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-amber-50 border-2 border-amber-200'
                      }`}
                    >
                      <p className="font-display font-bold text-lg">
                        {feedback.message}
                      </p>
                      {feedback.correct && (
                        <p className="text-sm text-gray-500 mt-1">+15 XP earned!</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="flex gap-3">
                  {!feedback?.correct && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={checkAnswer}
                      disabled={!userAnswer}
                      className={`font-display font-bold text-lg px-8 py-3 rounded-full transition-all ${
                        userAnswer
                          ? 'bg-cherry text-white shadow-lg shadow-cherry/30 hover:bg-cherry-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Check! ✓
                    </motion.button>
                  )}
                  {feedback?.correct && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={newProblem}
                      className="bg-cherry text-white font-display font-bold text-lg px-8 py-3 rounded-full shadow-lg shadow-cherry/30 hover:bg-cherry-600"
                    >
                      Next Problem →
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
