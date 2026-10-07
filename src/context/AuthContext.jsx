import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthChange } from '../services/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [parentData, setParentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch parent document
        try {
          const parentDoc = await getDoc(doc(db, 'parents', firebaseUser.uid))
          if (parentDoc.exists()) {
            setParentData({ id: parentDoc.id, ...parentDoc.data() })
          }
        } catch (err) {
          console.error('Error fetching parent data:', err)
        }
      } else {
        setUser(null)
        setParentData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const refreshParentData = async () => {
    if (!user) return
    const parentDoc = await getDoc(doc(db, 'parents', user.uid))
    if (parentDoc.exists()) {
      setParentData({ id: parentDoc.id, ...parentDoc.data() })
    }
  }

  return (
    <AuthContext.Provider value={{ user, parentData, loading, refreshParentData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
