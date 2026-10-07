import { motion } from 'framer-motion'

export default function VisualGrid({ a, b }) {
  const maxDisplay = 12
  const displayA = Math.min(a, maxDisplay)
  const displayB = Math.min(b, maxDisplay)

  return (
    <div>
      <p className="font-display font-bold text-center text-gray-700 mb-4">
        {a} rows × {b} columns = ?
      </p>
      <div className="flex flex-col items-center gap-1.5 mb-4">
        {Array.from({ length: displayA }).map((_, row) => (
          <div key={row} className="flex gap-1.5">
            {Array.from({ length: displayB }).map((_, col) => (
              <motion.div
                key={`${row}-${col}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (row * displayB + col) * 0.03, duration: 0.2 }}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-cherry shadow-sm"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-gray-500">
        Count all the dots! Each row has <span className="font-bold text-cherry">{b}</span> dots,
        and there are <span className="font-bold text-cherry">{a}</span> rows.
      </div>
    </div>
  )
}
