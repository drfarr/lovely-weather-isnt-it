import './globals.css'

export const metadata = {
  title: 'Weather App',
  description: 'Checkout the weather with this app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
