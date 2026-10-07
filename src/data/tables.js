import {
  TABLE_ORDER, PRACTICE_TO_UNLOCK_MASTERY, MASTERY_PASS_SCORE, MASTERY_TOTAL_QUESTIONS, FACT_MASTERY_STREAK,
} from '../config/constants'

export { TABLE_ORDER, PRACTICE_TO_UNLOCK_MASTERY, MASTERY_PASS_SCORE, MASTERY_TOTAL_QUESTIONS }

export const MULTIPLIERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// Why tables are learned in this order — shown to kids and parents.
export const TABLE_TIPS = {
  2: 'Doubles! 2 × 6 is just 6 + 6.',
  5: 'Every answer ends in 5 or 0.',
  10: 'Just add a zero: 10 × 7 = 70.',
  3: 'Count in threes: 3, 6, 9, 12…',
  4: 'Double, then double again: 4 × 6 = 12 + 12.',
  6: 'Know your 5s? Add one more: 6 × 7 = 35 + 7.',
  7: 'The tricky one. You already know most of them from other tables!',
  8: 'Double, double, double: 8 × 3 = 6 → 12 → 24.',
  9: 'The digits add to 9: 9 × 4 = 36, and 3 + 6 = 9.',
  11: 'Up to 9, just repeat the digit: 11 × 4 = 44.',
  12: '10 times plus 2 times: 12 × 6 = 60 + 12.',
}

export function tableState(tables = {}, n) {
  return { stage: 'practice', practiceCorrect: 0, best: 0, ...tables[n] }
}

export function isUnlocked(tables = {}, n) {
  const i = TABLE_ORDER.indexOf(n)
  return i <= 0 || tableState(tables, TABLE_ORDER[i - 1]).stage === 'completed'
}

export function isFactMastered(facts = {}, a, b) {
  return (facts[`${a}x${b}`]?.streak || 0) >= FACT_MASTERY_STREAK
}

export function masteredCount(facts = {}, n) {
  return MULTIPLIERS.filter(m => isFactMastered(facts, n, m)).length
}

export function tablesCompleted(tables = {}) {
  return TABLE_ORDER.filter(n => tableState(tables, n).stage === 'completed').length
}

// 10 distinct multipliers for a mastery check, in random order.
export function masteryQueue() {
  return [...MULTIPLIERS].sort(() => Math.random() - 0.5).slice(0, MASTERY_TOTAL_QUESTIONS)
}
