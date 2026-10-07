// Table unlock order (pedagogical best practice: easiest patterns first)
export const TABLE_ORDER = [2, 5, 10, 3, 4, 6, 7, 8, 9, 11, 12]

// Free tier gets these tables
export const FREE_TABLES = [2, 5, 10]

// Curriculum thresholds
export const PRACTICE_TO_UNLOCK_MASTERY = 10 // correct answers needed
export const MASTERY_PASS_SCORE = 8 // out of 10
export const MASTERY_TOTAL_QUESTIONS = 10

// XP values
export const XP_CORRECT = 15
export const XP_ATTEMPT = 5
export const XP_MASTERY_PASS = 100
export const XP_INTRO_COMPLETE = 25
export const XP_PER_LEVEL = 100

// Fact mastery
export const FACT_MASTERY_STREAK = 3
export const FACT_MASTERY_ACCURACY = 0.8

// Stage names
export const STAGES = {
  LOCKED: 'locked',
  INTRO: 'intro',
  PRACTICE: 'practice',
  MASTERY: 'mastery',
  COMPLETED: 'completed',
}

// Badge definitions
export const BADGES = [
  { id: 'first_step', name: 'First Step', emoji: '🌱', desc: 'Solved your first problem', check: s => s.totalProblems >= 1 },
  { id: 'high_five', name: 'High Five', emoji: '🖐️', desc: 'Solved 5 problems', check: s => s.totalProblems >= 5 },
  { id: 'perfect_ten', name: 'Perfect 10', emoji: '🔟', desc: 'Solved 10 problems', check: s => s.totalProblems >= 10 },
  { id: 'explorer', name: 'Method Explorer', emoji: '🗺️', desc: 'Tried 3 different methods', check: s => Object.keys(s.methodsUsed || {}).length >= 3 },
  { id: 'all_rounder', name: 'All-Rounder', emoji: '🌈', desc: 'Tried all 6 methods', check: s => Object.keys(s.methodsUsed || {}).length >= 6 },
  { id: 'streak_3', name: 'On Fire', emoji: '🔥', desc: '3-day streak', check: s => s.currentStreak >= 3 },
  { id: 'table_master', name: 'Table Master', emoji: '🏆', desc: 'Completed your first table', check: s => s.tablesCompleted >= 1 },
  { id: 'three_tables', name: 'Triple Threat', emoji: '🎯', desc: 'Completed 3 tables', check: s => s.tablesCompleted >= 3 },
  { id: 'five_tables', name: 'Halfway Hero', emoji: '⭐', desc: 'Completed 5 tables', check: s => s.tablesCompleted >= 5 },
  { id: 'fifty', name: 'Math Wizard', emoji: '🧙', desc: 'Solved 50 problems', check: s => s.totalProblems >= 50 },
  { id: 'hundred', name: 'Century Club', emoji: '💯', desc: 'Solved 100 problems', check: s => s.totalProblems >= 100 },
  { id: 'cherry_master', name: 'CHERRI Master', emoji: '🍒', desc: 'Completed all 11 tables', check: s => s.tablesCompleted >= 11 },
]

// Avatar options
export const AVATARS = [
  { id: 'fox', emoji: '🦊', name: 'Foxy' },
  { id: 'panda', emoji: '🐼', name: 'Bamboo' },
  { id: 'unicorn', emoji: '🦄', name: 'Sparkle' },
  { id: 'robot', emoji: '🤖', name: 'Beep' },
  { id: 'cat', emoji: '🐱', name: 'Whiskers' },
  { id: 'dog', emoji: '🐶', name: 'Buddy' },
  { id: 'owl', emoji: '🦉', name: 'Hoot' },
  { id: 'dragon', emoji: '🐉', name: 'Blaze' },
  { id: 'bunny', emoji: '🐰', name: 'Hop' },
  { id: 'bear', emoji: '🐻', name: 'Teddy' },
]

export const AVATAR_COLORS = [
  { id: 'cherry', color: '#FF0000', name: 'Cherry Red' },
  { id: 'blue', color: '#2563EB', name: 'Ocean Blue' },
  { id: 'green', color: '#16A34A', name: 'Forest Green' },
  { id: 'purple', color: '#9333EA', name: 'Magic Purple' },
  { id: 'orange', color: '#EA580C', name: 'Sunset Orange' },
  { id: 'pink', color: '#EC4899', name: 'Bubblegum Pink' },
  { id: 'teal', color: '#0D9488', name: 'Cool Teal' },
  { id: 'yellow', color: '#CA8A04', name: 'Golden' },
]

export const INTERESTS = [
  { id: 'animals', emoji: '🐾', name: 'Animals' },
  { id: 'space', emoji: '🚀', name: 'Space' },
  { id: 'sports', emoji: '⚽', name: 'Sports' },
  { id: 'art', emoji: '🎨', name: 'Art' },
  { id: 'food', emoji: '🍕', name: 'Food' },
  { id: 'music', emoji: '🎵', name: 'Music' },
  { id: 'nature', emoji: '🌿', name: 'Nature' },
  { id: 'games', emoji: '🎮', name: 'Games' },
]

export const LEARNING_STYLES = [
  { id: 'visual', emoji: '👀', name: 'Show Me Pictures', desc: 'I learn best when I can see it!', example: 'See 3 rows of 4 dots = 12' },
  { id: 'story', emoji: '📖', name: 'Tell Me a Story', desc: 'I like when math is part of a story!', example: '3 friends each have 4 cookies...' },
  { id: 'hands-on', emoji: '🤲', name: 'Let Me Try It', desc: 'I want to move things and build!', example: 'Drag and drop to build groups' },
  { id: 'steps', emoji: '📝', name: 'Step by Step', desc: 'Show me the steps clearly!', example: 'Step 1, Step 2, Step 3...' },
]
