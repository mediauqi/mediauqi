export const CATEGORIES: Record<string, string> = {
  Makanan: "#e8a87c",
  Transport: "#85c1e9",
  Belanja: "#f1948a",
  Hiburan: "#a569bd",
  Kesehatan: "#82e0aa",
  Pendidikan: "#f7dc6f",
  Tagihan: "#85929e",
  Lainnya: "#aab7b8",
}

export const CAT_EMOJI: Record<string, string> = {
  Makanan: "🍔",
  Transport: "🚗",
  Belanja: "🛍️",
  Hiburan: "🎬",
  Kesehatan: "💊",
  Pendidikan: "📚",
  Tagihan: "📄",
  Lainnya: "📦",
}

export const MONTH_NAMES = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
]

export const formatIDR = (n: number) => "Rp " + Math.abs(n).toLocaleString("id-ID")

export type Transaction = {
  id: number
  user_id: number
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

export type User = {
  id: number
  username: string
}
