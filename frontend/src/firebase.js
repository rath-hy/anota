import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// // Only connect to emulator in development
// if (import.meta.env.DEV) {
//   connectAuthEmulator(auth, 'http://127.0.0.1:9099')
// }

export { auth }