import { motion } from 'framer-motion'

const INTEREST_EMOJI = {
  animals: '🐾', space: '🚀', sports: '⚽', art: '🎨',
  food: '🍕', music: '🎵', nature: '🌿', games: '🎮',
}

export default function StoryMode({ a, b, problem }) {
  const emoji = INTEREST_EMOJI[problem.interest] || '🍒'

  return (
    <div>
      <p className="font-display font-bold text-center text-gray-700 mb-4">Story Time!</p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-4"
      >
        <div className="text-4xl text-center mb-4">{emoji}</div>
        <p className="text-lg text-gray-800 text-center leading-relaxed font-body">
          {problem.story}
        </p>
      </motion.div>

      {/* Visual groups */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {Array.from({ length: Math.min(a, 8) }).map((_, groupIdx) => (
          <motion.div
            key={groupIdx}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: groupIdx * 0.15 }}
            className="bg-white border-2 border-dashed border-amber-300 rounded-xl p-2 flex flex-wrap gap-1 justify-center"
            style={{ minWidth: 60 }}
          >
            {Array.from({ length: Math.min(b, 8) }).map((_, itemIdx) => (
              <motion.span
                key={itemIdx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: groupIdx * 0.15 + itemIdx * 0.05 }}
                className="text-lg"
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <span className="font-bold text-cherry">{a}</span> groups of
        <span className="font-bold text-cherry"> {b}</span> = ?
      </div>
    </div>
  )
}
