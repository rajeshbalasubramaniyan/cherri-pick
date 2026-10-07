import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SignupForm from '../components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src="/cherri-full-logo.png" alt="CHERRI PICK" className="h-16 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 font-body text-sm">Start your child's personalized math journey</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <SignupForm />
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-cherry font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
