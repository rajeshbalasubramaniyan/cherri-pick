import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resetPassword } from '../../services/auth'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch {
      setError('Could not send reset email. Check the email address.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">📬</div>
        <h3 className="font-display text-xl font-bold text-gray-900">Check your email</h3>
        <p className="text-sm text-gray-500 font-body">
          We sent a password reset link to <strong>{email}</strong>.
        </p>
        <Link to="/login" className="text-cherry font-body font-semibold text-sm hover:underline inline-block mt-4">
          Back to login
        </Link>
      </div>
    )
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
        {loading ? 'Sending...' : 'Send Reset Link'}
      </motion.button>
    </form>
  )
}
