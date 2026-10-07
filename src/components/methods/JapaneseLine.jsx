import { motion } from 'framer-motion'

export default function JapaneseLine({ a, b, answer }) {
  const digitsA = String(a).split('').map(Number)
  const digitsB = String(b).split('').map(Number)
  const isSimple = digitsA.length === 1 && digitsB.length === 1

  if (!isSimple) {
    return (
      <div className="text-center">
        <p className="font-display font-bold text-gray-700 mb-4">Japanese Line Method</p>
        <div className="bg-cherry-50 rounded-2xl p-6 mb-4">
          <p className="text-gray-600 mb-3">
            Draw <span className="font-bold text-cherry">{a}</span> lines going ↗ one way
          </p>
          <p className="text-gray-600 mb-3">
            Draw <span className="font-bold text-cherry">{b}</span> lines going ↘ the other way
          </p>
          <p className="font-bold text-gray-800">
            Count where they cross. That's your answer!
          </p>
        </div>
      </div>
    )
  }

  const width = 280
  const height = 200
  const intersections = []
  const lineSpacingA = height / (a + 1)
  const lineSpacingB = width / (b + 1)

  for (let i = 0; i < a; i++) {
    for (let j = 0; j < b; j++) {
      intersections.push({
        x: lineSpacingB * (j + 1),
        y: lineSpacingA * (i + 1),
      })
    }
  }

  return (
    <div>
      <p className="font-display font-bold text-center text-gray-700 mb-4">Japanese Line Method</p>
      <div className="flex justify-center mb-4">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Horizontal lines for A */}
          {Array.from({ length: a }).map((_, i) => (
            <motion.line
              key={`h-${i}`}
              x1={0} y1={lineSpacingA * (i + 1)}
              x2={width} y2={lineSpacingA * (i + 1)}
              stroke="#FF0000"
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            />
          ))}
          {/* Vertical lines for B */}
          {Array.from({ length: b }).map((_, j) => (
            <motion.line
              key={`v-${j}`}
              x1={lineSpacingB * (j + 1)} y1={0}
              x2={lineSpacingB * (j + 1)} y2={height}
              stroke="#2563EB"
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: a * 0.15 + j * 0.15 }}
            />
          ))}
          {/* Intersection dots — no numbers, child counts */}
          {intersections.map((pt, i) => (
            <motion.circle
              key={`dot-${i}`}
              cx={pt.x} cy={pt.y} r={8}
              fill="#FCD34D"
              stroke="#CA8A04"
              strokeWidth={2}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (a + b) * 0.15 + i * 0.08, type: 'spring' }}
            />
          ))}
        </svg>
      </div>
      <div className="text-center text-sm text-gray-500">
        <span className="text-cherry font-bold">{a}</span> red lines cross
        <span className="text-blue-600 font-bold"> {b}</span> blue lines.
        <span className="font-bold text-gray-700"> Count the yellow dots!</span>
      </div>
    </div>
  )
}
