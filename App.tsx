"use client"
import { useState, useEffect } from "react"
import AuthPage from "./AuthPage"
import Tracker from "./Tracker"
import { User } from "../lib/constants"

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("dp_user")
      if (s) setCurrentUser(JSON.parse(s))
    } catch {}
    setReady(true)
  }, [])

  const login = (user: User) => {
    setCurrentUser(user)
    try { sessionStorage.setItem("dp_user", JSON.stringify(user)) } catch {}
  }

  const logout = () => {
    setCurrentUser(null)
    try { sessionStorage.removeItem("dp_user") } catch {}
  }

  if (!ready) return null
  if (!currentUser) return <AuthPage onLogin={login} />
  return <Tracker key={currentUser.id} user={currentUser} onLogout={logout} />
}
