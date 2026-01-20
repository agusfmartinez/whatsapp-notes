// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "WhatsApp Notes",
  description: "Bloc de notas estilo WhatsApp",
  manifest: "/manifest.json",
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem("theme");
                  if (saved === "dark") document.documentElement.classList.add("dark");
                  if (saved === "light") document.documentElement.classList.remove("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
