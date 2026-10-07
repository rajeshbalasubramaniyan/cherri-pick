import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signIn } from '../../services/auth'

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/parent')
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.')
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
          placeholder="Your password"
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-body text-sm focus:border-cherry focus:outline-none transition-colors"
        />
      </div>

      <div className="text-right">
        <Link to="/forgot-password" className="text-sm text-cherry font-body font-semibold hover:underline">
          Forgot password?
        </Link>
      </div>

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
        {loading ? 'Logging in...' : 'Log In'}
      </motion.button>
    </form>
  )
}
