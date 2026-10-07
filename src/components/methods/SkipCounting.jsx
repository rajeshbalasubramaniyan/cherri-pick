import { motion } from 'framer-motion'

export default function SkipCounting({ a, b, answer }) {
  const jumps = Array.from({ length: a }, (_, i) => (i + 1) * b)
  const maxShow = Math.min(a, 12)
  const lineWidth = 500
  const step = lineWidth / (maxShow + 1)

  return (
    <div>
      <p className="font-display font-bold text-center text-gray-700 mb-4">Skip Counting</p>
      <p className="text-center text-sm text-gray-500 mb-4">
        Count by <span className="font-bold text-cherry">{b}</span>s,
        <span className="font-bold text-cherry"> {a}</span> times!
      </p>

      {/* Number line */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-end gap-0 min-w-fit mx-auto justify-center">
          {jumps.slice(0, maxShow).map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center"
              style={{ minWidth: 50 }}
            >
              {/* Arc */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.2, duration: 0.3 }}
                className="text-cherry text-xs font-bold mb-1"
                style={{ originY: 1 }}
              >
                +{b}
              </motion.div>
              <motion.div
                initial={{ scaleY: 0, scaleX: 0 }}
                animate={{ scaleY: 1, scaleX: 1 }}
                transition={{ delay: i * 0.2, duration: 0.3 }}
                className="w-10 h-5 border-t-2 border-l-2 border-r-2 border-cherry rounded-t-full mb-1"
              />
              {/* Number */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 + 0.1, type: 'spring' }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm ${
                  i === maxShow - 1
                    ? 'bg-cherry text-white shadow-lg shadow-cherry/30'
                    : 'bg-cherry-100 text-cherry-700'
                }`}
              >
                {val}
              </motion.div>
              <div className="text-xs text-gray-400 mt-1">
                {i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: maxShow * 0.2 + 0.3 }}
        className="text-center text-sm text-gray-500 mt-2"
      >
        After <span className="font-bold text-cherry">{a}</span> jumps of <span className="font-bold text-cherry">{b}</span>, you land on...?
      </motion.div>
    </div>
  )
}
