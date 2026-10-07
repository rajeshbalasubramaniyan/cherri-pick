import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChild } from '../context/ChildContext'
import { generateProblem, generateProblemFor, getEncouragement } from '../data/problems'
import {
  TABLE_ORDER, MULTIPLIERS, PRACTICE_TO_UNLOCK_MASTERY, MASTERY_PASS_SCORE, MASTERY_TOTAL_QUESTIONS, TABLE_TIPS,
  tableState, isUnlocked, masteryQueue,
} from '../data/tables'
import { XP_MASTERY_PASS } from '../config/constants'
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
  const [params] = useSearchParams()
  const { profile, recordProblem, recordFact, updateTable, addXp } = useChild()
  const table = parseInt(params.get('table')) || null
  const isCheck = !!table && params.get('check') === '1'
  const [problem, setProblem] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [showMethodPicker, setShowMethodPicker] = useState(true)
  const [problemCount, setProblemCount] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  // Mastery check state
  const queue = useRef(masteryQueue())
  const [checkIndex, setCheckIndex] = useState(0)
  const [checkScore, setCheckScore] = useState(0)
  const [firstTry, setFirstTry] = useState(true)
  const [checkResult, setCheckResult] = useState(null)
  const lastB = useRef(null)

  const tState = table ? tableState(profile.progress.tables, table) : null

  useEffect(() => {
    if (!profile.onboardingComplete) {
      navigate('/onboarding')
      return
    }
    if (table && (!TABLE_ORDER.includes(table) || !isUnlocked(profile.progress.tables, table))) {
      navigate('/tables')
      return
    }
    // Same page serves practice and the check, so reset check state on every mode change.
    queue.current = masteryQueue()
    setCheckIndex(0)
    setCheckScore(0)
    setCheckResult(null)
    newProblem(0)
  }, [table, isCheck])

  const newProblem = (index = checkIndex) => {
    let p
    if (isCheck) {
      p = generateProblemFor(table, queue.current[index], profile.interests)
    } else if (table) {
      let b
      do { b = MULTIPLIERS[Math.floor(Math.random() * MULTIPLIERS.length)] } while (b === lastB.current)
      lastB.current = b
      p = generateProblemFor(table, b, profile.interests)
    } else {
      p = generateProblem(profile.age, profile.interests)
    }
    setProblem(p)
    setSelectedMethod(null)
    setUserAnswer('')
    setFeedback(null)
    setFirstTry(true)
    setShowMethodPicker(true)
  }

  const nextProblem = () => {
    if (!isCheck) { newProblem(); return }
    const next = checkIndex + 1
    if (next >= MASTERY_TOTAL_QUESTIONS) {
      const passed = checkScore >= MASTERY_PASS_SCORE
      updateTable(table, s => ({ ...s, best: Math.max(s.best, checkScore), stage: passed ? 'completed' : s.stage }))
      if (passed && tState.stage !== 'completed') addXp(XP_MASTERY_PASS)
      setCheckResult({ score: checkScore, passed })
      return
    }
    setCheckIndex(next)
    newProblem(next)
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
    recordProblem(selectedMethod, correct)
    // Facts are tracked both ways round: 3 × 7 and 7 × 3 are the same fact.
    recordFact(problem.a, problem.b, correct)
    if (problem.a !== problem.b) recordFact(problem.b, problem.a, correct)
    if (correct) {
      setProblemCount(prev => prev + 1)
      setSessionCorrect(prev => prev + 1)
      if (isCheck && firstTry) setCheckScore(s => s + 1)
      if (table && !isCheck) {
        updateTable(table, s => {
          const practiceCorrect = Math.min(PRACTICE_TO_UNLOCK_MASTERY, s.practiceCorrect + 1)
          const stage = s.stage === 'completed' ? 'completed' : practiceCorrect >= PRACTICE_TO_UNLOCK_MASTERY ? 'mastery' : 'practice'
          return { ...s, practiceCorrect, stage }
        })
      }
    } else {
      setFirstTry(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (feedback?.correct) {
        nextProblem()
      } else {
        checkAnswer()
      }
    }
  }

  if (!problem) return null

  if (checkResult) {
    return (
      <main className="max-w-md mx-auto px-4 py-12 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="text-6xl mb-3">{checkResult.passed ? '🏆' : '💪'}</div>
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-1">
            {checkResult.passed ? `You mastered the ${table}s!` : 'So close!'}
          </h2>
          <p className="font-display text-5xl font-bold text-cherry my-4">{checkResult.score}/{MASTERY_TOTAL_QUESTIONS}</p>
          <p className="text-gray-500 font-body mb-6">
            {checkResult.passed
              ? `+${XP_MASTERY_PASS} XP. The next table is unlocked!`
              : `You need ${MASTERY_PASS_SCORE} right first time. Practise a little more and try again. Every try makes your brain stronger.`}
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/tables')} className="bg-cherry text-white font-display font-bold py-3 rounded-full shadow-lg shadow-cherry/30">
              Back to my journey
            </button>
            {!checkResult.passed && (
              <button onClick={() => navigate(`/learn?table=${table}`)} className="font-display font-bold text-cherry-600">
                Practise the {table}s
              </button>
            )}
          </div>
        </motion.div>
      </main>
    )
  }

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

      {table && (
        <div className="bg-white border-b border-gray-100 py-2.5 px-4 text-center">
          <button onClick={() => navigate('/tables')} className="text-xs text-gray-400 hover:text-cherry font-body mr-2">← Journey</button>
          {isCheck ? (
            <span className="font-display font-bold text-gray-700 text-sm">
              ⭐ {table}× mastery check · Question {checkIndex + 1}/{MASTERY_TOTAL_QUESTIONS} · Score {checkScore}
            </span>
          ) : (
            <span className="font-display font-bold text-gray-700 text-sm">
              {table}× practice · {tState.practiceCorrect}/{PRACTICE_TO_UNLOCK_MASTERY} {tState.stage === 'completed' ? '· mastered 🏆' : ''}
            </span>
          )}
          {!isCheck && <p className="text-[11px] text-gray-400 font-body mt-0.5">💡 {TABLE_TIPS[table]}</p>}
          {!isCheck && tState.stage === 'mastery' && (
            <button onClick={() => navigate(`/learn?table=${table}&check=1`)}
              className="mt-2 bg-cherry text-white font-display font-bold text-sm px-5 py-1.5 rounded-full shadow-md shadow-cherry/30">
              You're ready! Take the mastery check ⭐
            </button>
          )}
        </div>
      )}

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
                      onClick={nextProblem}
                      className="bg-cherry text-white font-display font-bold text-lg px-8 py-3 rounded-full shadow-lg shadow-cherry/30 hover:bg-cherry-600"
                    >
                      {isCheck && checkIndex + 1 >= MASTERY_TOTAL_QUESTIONS ? 'See my score →' : 'Next Problem →'}
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
