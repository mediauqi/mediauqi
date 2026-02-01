"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { sbGet, sbPost } from "../lib/supabase"
import { User } from "../lib/constants"

interface AuthPageProps {
  onLogin: (user: User) => void
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [msg, setMsg] = useState({ text: "", ok: true })
  const [loading, setLoading] = useState(false)

  const showMsg = (text: string, ok = false) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 2800)
  }

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) return showMsg("Isi semua field dulu 😊")
    if (username.trim().length < 3) return showMsg("Username minimal 3 karakter")
    if (password.length < 4) return showMsg("Password minimal 4 karakter")
    setLoading(true)
    try {
      const existing = await sbGet("users", `username=eq.${username.trim()}`)
      if (existing.length > 0) { setLoading(false); return showMsg("Username sudah dipakai 😕") }
      const user = await sbPost("users", { username: username.trim(), password })
      if (user && user.id) {
        showMsg("Akun berhasil dibuat! 🎉", true)
        setTimeout(() => { setMode("login"); setPassword("") }, 1200)
      } else showMsg("Gagal bikin akun, coba lagi")
    } catch { showMsg("Error koneksi, coba lagi") }
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return showMsg("Isi semua field dulu 😊")
    setLoading(true)
    try {
      const users = await sbGet("users", `username=eq.${username.trim()}&password=eq.${password}`)
      if (users.length > 0) onLogin(users[0])
      else showMsg("Username atau password salah 😕")
    } catch { showMsg("Error koneksi, coba lagi") }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 9,
    border: "1px solid #e4e7ea", fontSize: 13, background: "#fafbfc",
    color: "#1e2530", fontFamily: "inherit", outline: "none",
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(150deg,#e6eaef 0%,#f4f6f8 45%,#dde5ee 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .auth-input:focus { border-color:#1e2530 !important; box-shadow:0 0 0 3px rgba(30,37,48,0.1) !important; }
        .auth-btn:hover { opacity:0.85 !important; }
        .auth-btn:active { transform:scale(0.96) !important; }
      `}</style>

      <div style={{ animation: "fadeUp 0.4s ease both", width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, borderRadius: 17, background: "#1e2530", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 4px 18px rgba(30,37,48,0.22)", marginBottom: 12 }}>💰</div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, color: "#1e2530", letterSpacing: "-0.5px" }}>Dompet Pintar</h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#7a8a9e" }}>Kelola keuangan kamu dengan mudah</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 28px rgba(0,0,0,0.07)", border: "1px solid #eaecef" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "#f4f6f8", padding: 4, gap: 4 }}>
            {([["login", "🔑 Login"], ["register", "✨ Daftar"]] as const).map(([k, label]) => (
              <button key={k} onClick={() => { setMode(k); setMsg({ text: "", ok: true }) }}
                style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 9, background: mode === k ? "#fff" : "transparent", color: mode === k ? "#1e2530" : "#7a8a9e", fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: mode === k ? "0 1px 5px rgba(0,0,0,0.08)" : "none", fontFamily: "inherit", transition: "all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: "22px 22px 24px" }}>
            <label style={{ fontSize: 11.5, fontWeight: 600, color: "#7a8a9e", textTransform: "uppercase", letterSpacing: "0.6px" }}>Username</label>
            <input className="auth-input" type="text" placeholder="Nama kamu" value={username} onChange={e => setUsername(e.target.value)}
              style={{ ...inputStyle, marginTop: 6, marginBottom: 14 }} />

            <label style={{ fontSize: 11.5, fontWeight: 600, color: "#7a8a9e", textTransform: "uppercase", letterSpacing: "0.6px" }}>Password</label>
            <div style={{ position: "relative", marginTop: 6, marginBottom: msg.text ? 12 : 22 }}>
              <input className="auth-input" type={showPw ? "text" : "password"} placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleRegister())}
                style={{ ...inputStyle, paddingRight: 38 }} />
              <button onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a8a9e", padding: 2 }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {msg.text && (
              <div style={{ fontSize: 12.5, color: msg.ok ? "#16a34a" : "#dc2626", background: msg.ok ? "#edfbf0" : "#fef2f2", padding: "8px 12px", borderRadius: 8, marginBottom: 14, textAlign: "center", border: `1px solid ${msg.ok ? "#bbf7d0" : "#fecaca"}` }}>
                {msg.text}
              </div>
            )}

            <button className="auth-btn" onClick={mode === "login" ? handleLogin : handleRegister}
              style={{ width: "100%", padding: "11px 0", background: "#1e2530", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s, transform 0.1s" }}>
              {loading ? "⏳ Proses..." : mode === "login" ? "Masuk" : "Buat Akun"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11.5, color: "#9aa5b4", marginTop: 18 }}>
          {mode === "login" ? <>Belum punya akun? Klik <strong>Daftar</strong> di atas</> : <>Sudah punya akun? Klik <strong>Login</strong> di atas</>}
        </p>
      </div>
    </div>
  )
}
