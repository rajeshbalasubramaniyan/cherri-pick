import {
  doc, collection, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, writeBatch
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { TABLE_ORDER, STAGES } from '../config/constants'

// ===================== PARENT =====================

export async function getParent(parentId) {
  const snap = await getDoc(doc(db, 'parents', parentId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateParent(parentId, data) {
  await updateDoc(doc(db, 'parents', parentId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// ===================== CHILDREN =====================

export async function getChildren(parentId) {
  const snap = await getDocs(collection(db, 'parents', parentId, 'children'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getChild(parentId, childId) {
  const snap = await getDoc(doc(db, 'parents', parentId, 'children', childId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function addChild(parentId, childData) {
  const childRef = await addDoc(collection(db, 'parents', parentId, 'children'), {
    ...childData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  // Initialize curriculum documents for this child
  const batch = writeBatch(db)

  TABLE_ORDER.forEach((tableNum, index) => {
    const tableRef = doc(db, 'parents', parentId, 'children', childRef.id, 'curriculum', `table_${tableNum}`)
    batch.set(tableRef, {
      status: index === 0 ? STAGES.INTRO : STAGES.LOCKED,
      introStep: 0,
      introComplete: false,
      practiceCount: 0,
      practiceCorrect: 0,
      masteryAttempts: 0,
      masteryBestScore: 0,
      masteryPassed: false,
      unlockedAt: index === 0 ? serverTimestamp() : null,
      completedAt: null,
      updatedAt: serverTimestamp(),
    })
  })

  // Initialize stats document
  const statsRef = doc(db, 'parents', parentId, 'children', childRef.id, 'stats', 'current')
  batch.set(statsRef, {
    totalProblems: 0,
    totalCorrect: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    xp: 0,
    level: 1,
    methodsUsed: {},
    badges: [],
    tablesCompleted: 0,
    totalPracticeTime: 0,
    updatedAt: serverTimestamp(),
  })

  await batch.commit()
  return childRef.id
}

export async function updateChild(parentId, childId, data) {
  await updateDoc(doc(db, 'parents', parentId, 'children', childId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// ===================== CURRICULUM =====================

export async function getCurriculum(parentId, childId) {
  const snap = await getDocs(collection(db, 'parents', parentId, 'children', childId, 'curriculum'))
  const curriculum = {}
  snap.docs.forEach(d => {
    curriculum[d.id] = { id: d.id, ...d.data() }
  })
  return curriculum
}

export async function getTableProgress(parentId, childId, tableId) {
  const snap = await getDoc(doc(db, 'parents', parentId, 'children', childId, 'curriculum', tableId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function updateTableProgress(parentId, childId, tableId, data) {
  await updateDoc(doc(db, 'parents', parentId, 'children', childId, 'curriculum', tableId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function unlockNextTable(parentId, childId, completedTableNum) {
  const currentIndex = TABLE_ORDER.indexOf(completedTableNum)
  if (currentIndex < TABLE_ORDER.length - 1) {
    const nextTable = TABLE_ORDER[currentIndex + 1]
    await updateTableProgress(parentId, childId, `table_${nextTable}`, {
      status: STAGES.INTRO,
      unlockedAt: serverTimestamp(),
    })
  }
}

// ===================== SESSIONS =====================

export async function createSession(parentId, childId, sessionData) {
  const ref = await addDoc(
    collection(db, 'parents', parentId, 'children', childId, 'sessions'),
    {
      ...sessionData,
      startedAt: serverTimestamp(),
      endedAt: null,
      problems: [],
      score: 0,
      total: 0,
    }
  )
  return ref.id
}

export async function endSession(parentId, childId, sessionId, problems) {
  const score = problems.filter(p => p.correct).length
  await updateDoc(
    doc(db, 'parents', parentId, 'children', childId, 'sessions', sessionId),
    {
      endedAt: serverTimestamp(),
      problems,
      score,
      total: problems.length,
    }
  )
}

// ===================== STATS =====================

export async function getStats(parentId, childId) {
  const snap = await getDoc(doc(db, 'parents', parentId, 'children', childId, 'stats', 'current'))
  return snap.exists() ? snap.data() : null
}

// Stats are primarily updated by Cloud Functions (onSessionWritten)
// But we provide a client-side update for immediate feedback
export async function updateStatsClient(parentId, childId, updates) {
  await updateDoc(doc(db, 'parents', parentId, 'children', childId, 'stats', 'current'), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// ===================== FACTS =====================

export async function getFacts(parentId, childId) {
  const snap = await getDocs(collection(db, 'parents', parentId, 'children', childId, 'facts'))
  const facts = {}
  snap.docs.forEach(d => {
    facts[d.id] = d.data()
  })
  return facts
}

// ===================== WAITLIST =====================

export async function addToWaitlist(email, source = 'landing') {
  await addDoc(collection(db, 'waitlist'), {
    email,
    source,
    createdAt: serverTimestamp(),
  })
}
