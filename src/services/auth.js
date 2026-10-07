import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../config/firebase'

export async function signUp(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signIn(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}
