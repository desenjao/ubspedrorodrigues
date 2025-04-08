"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Trash2, UserRound } from "lucide-react"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import EmptyState from "@/components/empty-state"
import { getPacientes, deletePaciente } from "@/lib/api"

export default function PacientesPage() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setLoading(true)
        const data = await getPacientes(searchQuery)
        setPacientes(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar pacientes")
        setPacientes([])
      } finally {
        setLoading(false)
      }
    }

    fetchPacientes()
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // A busca já é feita pelo useEffect quando searchQuery muda
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      try {
        await deletePaciente(id)
        setPacientes(pacientes.filter((paciente) => paciente.id !== id))
      } catch (err: any) {
        setError(err.message || "Erro ao excluir paciente")
      }
    }
  }

  return (
    <div className="container mx-auto">
      <PageTitle title="Pacientes">
        <Link href="/pacientes/novo" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          Novo Paciente
        </Link>
      </PageTitle>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou cartão SUS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <button type="submit" className="btn-primary ml-2">
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <Loading />
      ) : pacientes.length === 0 ? (
        <EmptyState
          title="Nenhum paciente encontrado"
          description="Comece cadastrando um novo paciente no sistema."
          icon={<UserRound className="h-12 w-12 text-gray-400" />}
          action={
            <Link href="/pacientes/novo" className="btn-primary">
              Cadastrar Paciente
            </Link>
          }
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Nome</th>
                <th className="table-header-cell">CPF</th>
                <th className="table-header-cell">Cartão SUS</th>
                <th className="table-header-cell">Data de Nascimento</th>
                <th className="table-header-cell">Telefone</th>
                <th className="table-header-cell">Grupos</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {pacientes.map((paciente) => (
                <tr key={paciente.id} className="table-row">
                  <td className="table-cell font-medium text-gray-900">{paciente.full_name}</td>
                  <td className="table-cell">{paciente.cpf}</td>
                  <td className="table-cell">{paciente.sus_card || "-"}</td>
                  <td className="table-cell">{new Date(paciente.birth_date).toLocaleDateString("pt-BR")}</td>
                  <td className="table-cell">{paciente.phone}</td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1">
                      {paciente.is_pregnant && <span className="badge badge-purple">Gestante</span>}
                      {paciente.is_hypertensive && <span className="badge badge-blue">Hipertenso</span>}
                      {paciente.is_diabetic && <span className="badge badge-yellow">Diabético</span>}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/pacientes/${paciente.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(paciente.id)} className="text-red-600 hover:text-red-800">
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
