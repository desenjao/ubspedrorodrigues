interface StatusBadgeProps {
  status: string
  type?: "default" | "exam" | "appointment"
}

export default function StatusBadge({ status, type = "default" }: StatusBadgeProps) {
  let className = "badge "

  if (type === "exam") {
    switch (status) {
      case "Agendado":
        className += "badge-blue"
        break
      case "Marcado":
      case "Marcado - Aguardando protocolo":
        className += "badge-yellow"
        break
      case "Concluído":
        className += "badge-green"
        break
      case "Cancelado":
        className += "badge-red"
        break
      default:
        className += "bg-gray-100 text-gray-800"
    }
  } else if (type === "appointment") {
    switch (status) {
      case "Agendado":
        className += "badge-blue"
        break
      case "Realizado":
        className += "badge-green"
        break
      case "Cancelado":
        className += "badge-red"
        break
      default:
        className += "bg-gray-100 text-gray-800"
    }
  } else {
    // Default badge styling
    switch (status) {
      case "Ativo":
      case "Sim":
        className += "badge-green"
        break
      case "Inativo":
      case "Não":
        className += "badge-red"
        break
      case "Parcial":
        className += "badge-yellow"
        break
      default:
        className += "bg-gray-100 text-gray-800"
    }
  }

  return <span className={className}>{status}</span>
}
