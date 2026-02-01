const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const hdrs = () => ({
  "Content-Type": "application/json",
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
})

export async function sbGet(table: string, params = "") {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, { headers: hdrs() })
  return r.json()
}

export async function sbPost(table: string, body: object) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...hdrs(), Prefer: "return=representation" },
    body: JSON.stringify(body),
  })
  return r.json()
}

export async function sbDelete(table: string, id: number) {
  await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: hdrs(),
  })
}
