import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChild } from '../context/ChildContext'
import {
  TABLE_ORDER, MULTIPLIERS, TABLE_TIPS, PRACTICE_TO_UNLOCK_MASTERY, MASTERY_PASS_SCORE, MASTERY_TOTAL_QUESTIONS,
  tableState, isUnlocked, isFactMastered, masteredCount, tablesCompleted,
} from '../data/tables'

export default function Tables() {
  const navigate = useNavigate()
  const { profile } = useChild()
  const tables = profile.progress.tables || {}
  const facts = profile.progress.facts || {}

  useEffect(() => {
    if (!profile.onboardingComplete) navigate('/onboarding')
  }, [])

  const done = tablesCompleted(tables)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold text-gray-900">Times Table Journey</h1>
        <p className="text-gray-500 font-body mt-2">
          Easiest patterns first. Practise a table, then pass its mastery check ({MASTERY_PASS_SCORE}/{MASTERY_TOTAL_QUESTIONS}) to unlock the next one.
        </p>
        <div className="max-w-sm mx-auto mt-4 flex items-center gap-3">
          <div className="flex-1 h-3 bg-cherry-50 rounded-full overflow-hidden">
            <motion.div className="h-full bg-cherry rounded-full" initial={{ width: 0 }} animate={{ width: `${(done / TABLE_ORDER.length) * 100}%` }} />
          </div>
          <span className="font-display font-bold text-cherry text-sm">{done}/{TABLE_ORDER.length}</span>
        </div>
        <button onClick={() => navigate('/learn')} className="mt-4 text-sm font-display font-bold text-cherry-600 hover:text-cherry-700">
          Or mix all tables 🔀
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {TABLE_ORDER.map((n, i) => {
          const s = tableState(tables, n)
          const unlocked = isUnlocked(tables, n)
          const completed = s.stage === 'completed'
          const ready = s.stage === 'mastery'
          const prev = TABLE_ORDER[i - 1]
          return (
            <motion.div key={n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`rounded-3xl p-5 border-2 bg-white ${completed ? 'border-green-300' : unlocked ? 'border-cherry-200' : 'border-gray-200 opacity-60'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-display text-3xl font-bold text-gray-900">{n} × table</p>
                  <p className="text-xs text-gray-500 font-body mt-0.5">{TABLE_TIPS[n]}</p>
                </div>
                <span className="text-2xl">{completed ? '🏆' : ready ? '⭐' : unlocked ? '🍒' : '🔒'}</span>
              </div>

              <div className="grid grid-cols-12 gap-1 my-3" title="Facts you've mastered (3 right in a row)">
                {MULTIPLIERS.map(m => (
                  <div key={m} className={`h-6 rounded-md text-[9px] flex items-center justify-center font-bold ${isFactMastered(facts, n, m) ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {m}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 font-body mb-3">{masteredCount(facts, n)}/12 facts mastered</p>

              {!unlocked ? (
                <p className="text-sm text-gray-500 font-body">Pass the {prev} × check to unlock</p>
              ) : completed ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-display font-bold text-green-600">Mastered · best {s.best}/{MASTERY_TOTAL_QUESTIONS}</span>
                  <button onClick={() => navigate(`/learn?table=${n}`)} className="text-sm font-display font-bold text-cherry-600">Practise again →</button>
                </div>
              ) : ready ? (
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/learn?table=${n}&check=1`)}
                    className="flex-1 bg-cherry text-white font-display font-bold py-2.5 rounded-full shadow-md shadow-cherry/30">⭐ Mastery check</button>
                  <button onClick={() => navigate(`/learn?table=${n}`)} className="px-4 text-sm font-display font-bold text-cherry-600">Practise</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-2 bg-cherry-50 rounded-full overflow-hidden">
                      <div className="h-full bg-cherry rounded-full" style={{ width: `${(s.practiceCorrect / PRACTICE_TO_UNLOCK_MASTERY) * 100}%` }} />
                    </div>
                    <span className="text-[11px] text-gray-500 font-body">{s.practiceCorrect}/{PRACTICE_TO_UNLOCK_MASTERY}</span>
                  </div>
                  <button onClick={() => navigate(`/learn?table=${n}`)}
                    className="w-full bg-cherry text-white font-display font-bold py-2.5 rounded-full shadow-md shadow-cherry/30">Practise the {n}s</button>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </main>
  )
}
