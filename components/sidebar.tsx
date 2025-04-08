"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserRound, FileText, Baby, Activity, Calendar, BarChart3, Home } from "lucide-react"

const menuItems = [
  { name: "Início", href: "/", icon: Home },
  { name: "Pacientes", href: "/pacientes", icon: UserRound },
  { name: "Exames", href: "/exames", icon: FileText },
  { name: "Gestantes", href: "/gestantes", icon: Baby },
  { name: "Hipertensos e Diabéticos", href: "/cronicos", icon: Activity },
  { name: "Consultas", href: "/consultas", icon: Calendar },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white w-64 shadow-md flex-shrink-0 hidden md:block">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-blue-600">Gestão de Saúde</h2>
        <p className="text-sm text-gray-500">Unidade Básica de Saúde</p>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm ${
                    isActive ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
