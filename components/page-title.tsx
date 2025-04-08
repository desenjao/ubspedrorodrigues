import type { ReactNode } from "react"

interface PageTitleProps {
  title: string
  children?: ReactNode
}

export default function PageTitle({ title, children }: PageTitleProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex space-x-2">{children}</div>
    </div>
  )
}
