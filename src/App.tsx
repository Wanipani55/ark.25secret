import { useState } from 'react'
import PasswordGate, { isAuthenticated } from './components/PasswordGate'
import Calculator from './components/Calculator'

export default function App() {
  const [unlocked, setUnlocked] = useState(isAuthenticated)

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />
  }

  return <Calculator />
}
