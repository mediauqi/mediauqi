import './globals.css'

export const metadata = {
  title: 'Dompet Pintar',
  description: 'Kelola keuangan kamu dengan mudah',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
