"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { PlusCircle, Trash2, TrendingUp, TrendingDown, Wallet, LogOut } from "lucide-react"
import { sbGet, sbPost, sbDelete } from "../lib/supabase"
import { CATEGORIES, CAT_EMOJI, MONTH_NAMES, formatIDR, Transaction, User } from "../lib/constants"

interface TrackerProps {
  user: User
  onLogout: () => void
}

export default function Tracker({ user, onLogout }: TrackerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ type: "expense" as "income" | "expense", amount: "", category: "Makanan", description: "", date: new Date().toISOString().slice(0, 10) })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const now = new Date()
  const [filterMonth, setFilterMonth] = useState(now.getMonth())
  const [filterYear, setFilterYear] = useState(now.getFullYear())

  const fetchData = useCallback(async () => {
    try {
      const data = await sbGet("transactions", `user_id=eq.${user.id}&order=date.desc`)
      setTransactions(Array.isArray(data) ? data : [])
    } catch {}
    setLoading(false)
  }, [user.id])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = useMemo(() =>
    transactions.filter(t => {
      const d = new Date(t.date + "T00:00:00")
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, filterMonth, filterYear]
  )

  const totalIn  = filtered.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0)
  const totalOut = filtered.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0)
  const balance  = totalIn - totalOut

  const chartData = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.filter(t => t.type === "expense").forEach(t => { map[t.category] = (map[t.category] || 0) + Number(t.amount) })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const handleAdd = async () => {
    if (!form.amount || !form.description) return
    setSaving(true)
    try {
      const row = await sbPost("transactions", { user_id: user.id, type: form.type, amount: Number(form.amount), category: form.category, description: form.description, date: form.date })
      if (row && row.id) {
        setTransactions(prev => [row, ...prev])
        setForm({ type: "expense", amount: "", category: "Makanan", description: "", date: new Date().toISOString().slice(0, 10) })
        setShowForm(false)
      }
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
    try { await sbDelete("transactions", id) } catch {}
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 9,
    border: "1px solid #e4e7ea", fontSize: 13, background: "#fafbfc",
    color: "#1e2530", fontFamily: "inherit", outline: "none",
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#7a8a9e", fontSize: 14 }}>
      ⏳ Memuat data...
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f8", color: "#1e2530" }}>
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .ti:focus { border-color:#1e2530!important; box-shadow:0 0 0 3px rgba(30,37,48,0.1)!important; outline:none; }
        .db:hover { color:#dc2626!important; background:#fef2f2!important; }
        .sb:hover { opacity:0.85!important; }
        .sb:active { transform:scale(0.97)!important; }
        .lb:hover { border-color:#1e2530!important; color:#1e2530!important; }
      `}</style>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eaecef", padding: "10px 16px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "#1e2530", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>💰</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25 }}>Dompet Pintar</div>
              <div style={{ fontSize: 11, color: "#7a8a9e" }}>👋 {user.username}</div>
            </div>
          </div>
          <button className="lb" onClick={onLogout}
            style={{ background: "none", border: "1px solid #e4e7ea", color: "#7a8a9e", borderRadius: 8, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s" }}>
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 14px 36px" }}>

        {/* Add Btn */}
        <button onClick={() => setShowForm(!showForm)}
          style={{ width: "100%", padding: "11px 0", background: showForm ? "#eef1f4" : "#1e2530", color: showForm ? "#1e2530" : "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16, transition: "all 0.2s" }}>
          <PlusCircle size={16} /> {showForm ? "Batal" : "Tambah Transaksi"}
        </button>

        {/* Form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 2px 14px rgba(0,0,0,0.06)", border: "1px solid #eaecef", animation: "slideDown 0.25s ease" }}>
            <div style={{ display: "flex", gap: 5, background: "#f4f6f8", borderRadius: 8, padding: 3, marginBottom: 14 }}>
              {(["expense", "income"] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{ flex: 1, padding: "7px 0", border: "none", borderRadius: 7, background: form.type === t ? "#fff" : "transparent", color: form.type === t ? (t === "income" ? "#16a34a" : "#dc2626") : "#7a8a9e", fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: form.type === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s", fontFamily: "inherit" }}>
                  {t === "income" ? "⬆ Pemasukan" : "⬇ Pengeluaran"}
                </button>
              ))}
            </div>
            <input className="ti" type="number" placeholder="Jumlah (Rp)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} style={inputStyle} />
            <input className="ti" type="text" placeholder="Keterangan" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, marginTop: 8 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <select className="ti" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, flex: 1 }}>
                {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>)}
              </select>
              <input className="ti" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ ...inputStyle, flex: 1 }} />
            </div>
            <button className="sb" onClick={handleAdd}
              style={{ width: "100%", padding: "11px 0", background: form.type === "income" ? "#16a34a" : "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "opacity 0.15s, transform 0.1s" }}>
              {saving ? "⏳ Menyimpan..." : <><PlusCircle size={15} /> Simpan Transaksi</>}
            </button>
          </div>
        )}

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Saldo", value: balance, icon: <Wallet size={15} />, color: balance >= 0 ? "#1e2530" : "#dc2626", bg: "#fff" },
            { label: "Masuk", value: totalIn, icon: <TrendingUp size={15} />, color: "#16a34a", bg: "#edfbf0" },
            { label: "Keluar", value: totalOut, icon: <TrendingDown size={15} />, color: "#dc2626", bg: "#fef2f2" },
          ].map((c, i) => (
            <div key={i} style={{ background: c.bg, borderRadius: 12, padding: "10px 8px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #eaecef" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: c.color, marginBottom: 3 }}>
                {c.icon}<span style={{ fontSize: 10.5, fontWeight: 600 }}>{c.label}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {c.value < 0 ? "-" : ""}{formatIDR(c.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11.5, color: "#7a8a9e", fontWeight: 600 }}>📅 Filter:</span>
          <select value={filterMonth} onChange={e => setFilterMonth(Number(e.target.value))}
            style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid #e4e7ea", fontSize: 12, background: "#fff", color: "#1e2530", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, outline: "none" }}>
            {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={filterYear} onChange={e => setFilterYear(Number(e.target.value))}
            style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid #e4e7ea", fontSize: 12, background: "#fff", color: "#1e2530", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, outline: "none" }}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 14, padding: "14px 14px", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #eaecef" }}>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600 }}>📊 Pengeluaran per Kategori</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <ResponsiveContainer width={140} height={130}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={48} innerRadius={24} stroke="none">
                    {chartData.map((_, i) => <Cell key={i} fill={CATEGORIES[chartData[i].name] || "#aab7b8"} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatIDR(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, minWidth: 110, display: "flex", flexDirection: "column", gap: 4 }}>
                {chartData.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: CATEGORIES[d.name] || "#aab7b8", flexShrink: 0 }} />
                    <span style={{ color: "#1e2530", fontWeight: 500, flex: 1 }}>{d.name}</span>
                    <span style={{ color: "#7a8a9e", fontWeight: 600, whiteSpace: "nowrap" }}>{formatIDR(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 14px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", border: "1px solid #eaecef" }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600 }}>📋 Transaksi</p>
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "#aab7b8", fontSize: 13, padding: "28px 0", margin: 0 }}>Belum ada transaksi bulan ini 😊</p>
          ) : filtered.map((t, idx) => {
            const isIncome = t.type === "income"
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: idx < filtered.length - 1 ? "1px solid #f0f2f4" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: (CATEGORIES[t.category] || "#aab7b8") + "1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                  {CAT_EMOJI[t.category] || "📦"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</div>
                  <div style={{ fontSize: 11, color: "#7a8a9e" }}>{t.category} · {new Date(t.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isIncome ? "#16a34a" : "#dc2626", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {isIncome ? "+" : "-"}{formatIDR(Number(t.amount))}
                </div>
                <button className="db" onClick={() => handleDelete(t.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#c8cdd3", padding: "4px 5px", borderRadius: 6, transition: "all 0.2s", flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#b0b8c1", marginTop: 20 }}>Data tersimpan di Supabase 🌐</p>
      </div>
    </div>
  )
}
