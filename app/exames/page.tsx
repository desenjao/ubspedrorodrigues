"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, FileText } from "lucide-react"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import EmptyState from "@/components/empty-state"
import StatusBadge from "@/components/status-badge"
import { getExames, deleteExame, getPacientes } from "@/lib/api"

export default function ExamesPage() {
  const router = useRouter()
  const [exames, setExames] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtros, setFiltros] = useState({
    pacienteId: "",
    status: "",
    tipoExame: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [examesData, pacientesData] = await Promise.all([getExames(filtros), getPacientes()])
        setExames(examesData)
        setPacientes(pacientesData)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar exames")
        setExames([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filtros])

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este exame?")) {
      try {
        await deleteExame(id)
        setExames(exames.filter((exame) => exame.id !== id))
      } catch (err: any) {
        setError(err.message || "Erro ao excluir exame")
      }
    }
  }

  const tiposExame = [
    "Hemograma",
    "Glicemia",
    "Colesterol",
    "Triglicerídeos",
    "Urina",
    "Fezes",
    "Ultrassonografia",
    "Raio-X",
    "Eletrocardiograma",
    "Mamografia",
    "Papanicolau",
    "Beta HCG",
    "Outro",
  ]

  return (
    <div className="container mx-auto">
      <PageTitle title="Exames">
        <Link href="/exames/novo" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          Novo Exame
        </Link>
      </PageTitle>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="card mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label htmlFor="pacienteId" className="form-label">
              Paciente
            </label>
            <select
              id="pacienteId"
              name="pacienteId"
              value={filtros.pacienteId}
              onChange={handleFiltroChange}
              className="form-input"
            >
              <option value="">Todos os pacientes</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filtros.status}
              onChange={handleFiltroChange}
              className="form-input"
            >
              <option value="">Todos os status</option>
              <option value="Agendado">Agendado</option>
              <option value="Marcado">Marcado</option>
              <option value="Marcado - Aguardando protocolo">Marcado - Aguardando protocolo</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tipoExame" className="form-label">
              Tipo de Exame
            </label>
            <select
              id="tipoExame"
              name="tipoExame"
              value={filtros.tipoExame}
              onChange={handleFiltroChange}
              className="form-input"
            >
              <option value="">Todos os tipos</option>
              {tiposExame.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : exames.length === 0 ? (
        <EmptyState
          title="Nenhum exame encontrado"
          description="Comece cadastrando um novo exame no sistema."
          icon={<FileText className="h-12 w-12 text-gray-400" />}
          action={
            <Link href="/exames/novo" className="btn-primary">
              Cadastrar Exame
            </Link>
          }
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Paciente</th>
                <th className="table-header-cell">Tipo de Exame</th>
                <th className="table-header-cell">Data Agendada</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Resultado</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {exames.map((exame) => (
                <tr key={exame.id} className="table-row">
                  <td className="table-cell font-medium text-gray-900">
                    {exame.patient_name || "Nome não disponível"}
                  </td>
                  <td className="table-cell">{exame.exam_type}</td>
                  <td className="table-cell">
                    {new Date(exame.scheduled_date).toLocaleDateString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={exame.status} type="exam" />
                  </td>
                  <td className="table-cell">
                    {exame.result_url ? (
                      <a
                        href={exame.result_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ver resultado
                      </a>
                    ) : (
                      <span className="text-gray-400">Não disponível</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/exames/${exame.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(exame.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
