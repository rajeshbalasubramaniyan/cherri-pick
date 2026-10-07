import { createContext, useContext, useState, useEffect } from 'react'

const ChildContext = createContext()

const DEFAULT_PROFILE = {
  name: '',
  age: null,
  grade: null,
  avatar: { character: 'fox', color: '#FF0000' },
  interests: [],
  learningStyle: null,
  progress: {
    level: 1,
    xp: 0,
    streak: 0,
    lastPlayed: null,
    methodsUsed: {},
    problemsSolved: 0,
    correctAnswers: 0,
    badges: [],
    history: [],
  },
  onboardingComplete: false,
}

export function ChildProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('cherripick_profile')
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE
  })

  useEffect(() => {
    localStorage.setItem('cherripick_profile', JSON.stringify(profile))
  }, [profile])

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const updateProgress = (updates) => {
    setProfile(prev => ({
      ...prev,
      progress: { ...prev.progress, ...updates },
    }))
  }

  const recordProblem = (method, correct) => {
    setProfile(prev => {
      const methodsUsed = { ...prev.progress.methodsUsed }
      if (!methodsUsed[method]) methodsUsed[method] = { used: 0, correct: 0 }
      methodsUsed[method].used += 1
      if (correct) methodsUsed[method].correct += 1

      const today = new Date().toDateString()
      const lastPlayed = prev.progress.lastPlayed
      const streak = lastPlayed === today
        ? prev.progress.streak
        : lastPlayed === new Date(Date.now() - 86400000).toDateString()
          ? prev.progress.streak + 1
          : 1

      const newXp = prev.progress.xp + (correct ? 15 : 5)
      const newLevel = Math.floor(newXp / 100) + 1

      return {
        ...prev,
        progress: {
          ...prev.progress,
          methodsUsed,
          problemsSolved: prev.progress.problemsSolved + 1,
          correctAnswers: prev.progress.correctAnswers + (correct ? 1 : 0),
          xp: newXp,
          level: newLevel,
          streak,
          lastPlayed: today,
        },
      }
    })
  }

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE)
    localStorage.removeItem('cherripick_profile')
  }

  return (
    <ChildContext.Provider value={{ profile, updateProfile, updateProgress, recordProblem, resetProfile }}>
      {children}
    </ChildContext.Provider>
  )
}

export function useChild() {
  const ctx = useContext(ChildContext)
  if (!ctx) throw new Error('useChild must be used within ChildProvider')
  return ctx
}
