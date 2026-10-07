import { motion } from 'framer-motion'

export default function LatticeMethod({ a, b, answer }) {
  const isSimple = a < 10 && b < 10

  if (!isSimple) {
    return (
      <div>
        <p className="font-display font-bold text-center text-gray-700 mb-4">Lattice Grid</p>
        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <p className="text-gray-600 mb-3">
            For bigger numbers, we split them into digits and multiply each pair!
          </p>
          <p className="text-gray-600">
            Put <span className="font-bold text-cherry">{a}</span> on top and <span className="font-bold text-blue-600">{b}</span> on the side. Multiply each pair and add the diagonals.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="font-display font-bold text-center text-gray-700 mb-4">Lattice Grid</p>

      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Grid box */}
            <rect x="30" y="30" width="100" height="100" fill="white" stroke="#374151" strokeWidth="2" rx="4" />

            {/* Diagonal */}
            <motion.line
              x1="30" y1="30" x2="130" y2="130"
              stroke="#FF0000" strokeWidth="2" strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />

            {/* Top number (A) */}
            <text x="80" y="20" textAnchor="middle" fill="#FF0000" fontWeight="bold" fontSize="20" fontFamily="Fredoka">
              {a}
            </text>

            {/* Right number (B) */}
            <text x="145" y="85" textAnchor="middle" fill="#2563EB" fontWeight="bold" fontSize="20" fontFamily="Fredoka">
              {b}
            </text>

            {/* Question marks instead of answers */}
            <motion.text
              x="60" y="75"
              textAnchor="middle"
              fill="#9CA3AF" fontWeight="bold" fontSize="28" fontFamily="Fredoka"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
            >
              ?
            </motion.text>

            <motion.text
              x="105" y="115"
              textAnchor="middle"
              fill="#9CA3AF" fontWeight="bold" fontSize="28" fontFamily="Fredoka"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
            >
              ?
            </motion.text>

            {/* Labels */}
            <motion.text
              x="55" y="55" textAnchor="middle" fill="#9CA3AF" fontSize="10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            >
              tens
            </motion.text>
            <motion.text
              x="110" y="95" textAnchor="middle" fill="#9CA3AF" fontSize="10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            >
              ones
            </motion.text>
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="space-y-2"
      >
        <div className="text-center text-sm text-gray-600">
          <p className="font-bold text-gray-700 mb-2">How to solve it:</p>
          <p>Multiply <span className="font-bold text-cherry">{a}</span> x <span className="font-bold text-blue-600">{b}</span></p>
          <p className="mt-1">Write the <strong>tens</strong> digit in the top-left triangle</p>
          <p>Write the <strong>ones</strong> digit in the bottom-right triangle</p>
          <p className="mt-2 text-gray-500">Then read the number from left to right!</p>
        </div>
      </motion.div>
    </div>
  )
}
