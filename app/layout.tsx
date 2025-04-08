import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sistema de Gestão de Saúde",
  description: "Sistema para gestão de pacientes em unidades básicas de saúde",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}


import './globals.css'