const INTEREST_THEMES = {
  animals: ['puppies', 'kittens', 'rabbits', 'birds', 'fish', 'horses', 'dolphins', 'pandas'],
  space: ['astronauts', 'rockets', 'planets', 'stars', 'aliens', 'spaceships', 'moons', 'comets'],
  sports: ['soccer balls', 'basketballs', 'tennis rackets', 'medals', 'trophies', 'teams', 'goals', 'players'],
  art: ['paintbrushes', 'crayons', 'colors', 'drawings', 'stickers', 'paintings', 'clay pieces', 'stamps'],
  food: ['cookies', 'cupcakes', 'apples', 'strawberries', 'pizza slices', 'ice cream scoops', 'candy bars', 'donuts'],
  music: ['drums', 'guitars', 'notes', 'songs', 'bells', 'trumpets', 'pianos', 'flutes'],
  nature: ['flowers', 'butterflies', 'trees', 'ladybugs', 'raindrops', 'leaves', 'shells', 'mushrooms'],
  games: ['coins', 'gems', 'power-ups', 'shields', 'swords', 'potions', 'treasure chests', 'keys'],
}

const DIFFICULTY_RANGES = {
  1: { min: 1, max: 5 },   // ages 5-6
  2: { min: 2, max: 6 },   // ages 6-7
  3: { min: 2, max: 9 },   // ages 7-8
  4: { min: 3, max: 9 },   // ages 8-9
  5: { min: 2, max: 12 },  // ages 9-10
  6: { min: 4, max: 12 },  // ages 10-11
  7: { min: 5, max: 15 },  // ages 11-12
}

function getAgeLevel(age) {
  if (!age || age <= 5) return 1
  if (age >= 12) return 7
  return age - 4
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateProblem(age, interests = []) {
  const level = getAgeLevel(age)
  const range = DIFFICULTY_RANGES[level]
  return generateProblemFor(randomBetween(range.min, range.max), randomBetween(range.min, range.max), interests)
}

// A themed problem for one specific fact (used by the times-table journey).
export function generateProblemFor(a, b, interests = []) {
  const answer = a * b

  const interest = interests.length > 0 ? pickRandom(interests) : 'food'
  const items = INTEREST_THEMES[interest] || INTEREST_THEMES.food
  const item = pickRandom(items)

  const storyTemplates = [
    `You have ${a} bags with ${b} ${item} in each bag. How many ${item} do you have in total?`,
    `There are ${a} groups of ${b} ${item}. How many ${item} are there altogether?`,
    `If you collect ${b} ${item} every day for ${a} days, how many ${item} will you have?`,
    `${a} friends each brought ${b} ${item} to the party. How many ${item} are there?`,
    `A shop has ${a} shelves with ${b} ${item} on each shelf. How many ${item} are in the shop?`,
  ]

  return {
    a,
    b,
    answer,
    story: pickRandom(storyTemplates),
    item,
    interest,
  }
}

export function generateProblemSet(age, interests, count = 5) {
  const problems = []
  const seen = new Set()
  while (problems.length < count) {
    const p = generateProblem(age, interests)
    const key = `${p.a}x${p.b}`
    if (!seen.has(key)) {
      seen.add(key)
      problems.push(p)
    }
  }
  return problems
}

export const ENCOURAGEMENTS = {
  correct: [
    "Amazing! You nailed it! 🌟",
    "You're on fire! Keep going! 🔥",
    "Brilliant work! Your brain is growing! 🧠",
    "Cherry on top — that's perfect! 🍒",
    "Wow, you're getting so good at this! ⭐",
    "That's the way! You're a math star! ✨",
    "High five! You've got this! 🙌",
  ],
  tryAgain: [
    "Almost there! Give it another try! 💪",
    "Great effort! Let's try once more! 🌈",
    "You're learning — that's what matters! 🌱",
    "Every try makes you smarter! Keep going! 🚀",
    "Not quite, but you're so close! Try again! 💫",
  ],
  methodSwitch: [
    "Want to try solving it a different way? 🔄",
    "Different methods work for different people — pick another! 🎨",
    "There's more than one way to solve this! Explore! 🗺️",
  ],
}

export function getEncouragement(type) {
  const messages = ENCOURAGEMENTS[type] || ENCOURAGEMENTS.correct
  return pickRandom(messages)
}
