import { motion } from 'framer-motion'

const COLORS = ['#FF0000', '#2563EB', '#16A34A', '#9333EA', '#EA580C', '#EC4899', '#0D9488', '#CA8A04', '#6366F1', '#14B8A6', '#F97316', '#8B5CF6']

export default function BarModel({ a, b, answer }) {
  const maxBars = Math.min(a, 10)
  const barWidth = Math.min(100, (100 / Math.max(b, 1)) * b)

  return (
    <div>
      <p className="font-display font-bold text-center text-gray-700 mb-4">Singapore Bar Model</p>
      <div className="space-y-2 mb-4">
        {Array.from({ length: maxBars }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <span className="text-xs text-gray-400 w-6 text-right font-mono">{i + 1}.</span>
            <div className="flex-1 flex">
              {Array.from({ length: Math.min(b, 12) }).map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.12 + j * 0.04, duration: 0.2 }}
                  className="h-8 border-r border-white/50 flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    backgroundColor: COLORS[i % COLORS.length],
                    width: `${100 / b}%`,
                    originX: 0,
                  }}
                >
                  {b <= 8 ? j + 1 : ''}
                </motion.div>
              ))}
            </div>
            <span className="text-xs font-bold text-gray-600 w-8">= {b}</span>
          </motion.div>
        ))}
      </div>

      {/* Total bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: maxBars * 0.12 + 0.3 }}
        className="bg-gray-100 rounded-xl p-3 text-center"
      >
        <span className="text-sm text-gray-500">
          <span className="font-bold text-cherry">{a}</span> bars × <span className="font-bold text-cherry">{b}</span> each = ?
        </span>
      </motion.div>
    </div>
  )
}
