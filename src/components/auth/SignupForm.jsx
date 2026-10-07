import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signUp } from '../../services/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import ConsentCheckbox from './ConsentCheckbox'

export default function SignupForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!consent) {
      setError('Parental consent is required to create an account.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const user = await signUp(email, password)

      // Create parent document
      await setDoc(doc(db, 'parents', user.uid), {
        email,
        displayName: name,
        consentGiven: true,
        consentTimestamp: serverTimestamp(),
        referralCode: generateReferralCode(),
        referredBy: null,
        subscription: {
          plan: 'free',
          status: 'active',
          razorpaySubscriptionId: null,
          razorpayCustomerId: null,
          currentPeriodEnd: null,
          trialEnd: null,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      navigate('/parent/children/new')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try logging in.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 8 characters.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-body font-semibold text-gray-700 mb-1">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rajesh"
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-body text-sm focus:border-cherry focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-body font-semibold text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-body text-sm focus:border-cherry focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-body font-semibold text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          minLength={8}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-body text-sm focus:border-cherry focus:outline-none transition-colors"
        />
      </div>

      <ConsentCheckbox checked={consent} onChange={setConsent} />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-sm text-red-600 font-body">{error}</p>
        </div>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className={`w-full font-display font-bold text-lg py-4 rounded-full transition-all ${
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-cherry text-white shadow-lg shadow-cherry/30 hover:bg-cherry-600'
        }`}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </motion.button>
    </form>
  )
}

function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
