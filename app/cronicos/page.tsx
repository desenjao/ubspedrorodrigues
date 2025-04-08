"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Activity, Heart } from "lucide-react"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import EmptyState from "@/components/empty-state"
import StatusBadge from "@/components/status-badge"
import { getCronicos, getPacientes } from "@/lib/api"

export default function CronicosPage() {
  const router = useRouter()
  const [cronicos, setCronicos] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtros, setFiltros] = useState({
    tipoCondicao: "",
    nomePaciente: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [cronicosData, pacientesData] = await Promise.all([
          getCronicos({ tipoCondicao: filtros.tipoCondicao }),
          getPacientes(),
        ])

        // Adicionar nome do paciente aos dados do monitoramento crônico
        const cronicosComNome = cronicosData.map((cronico: any) => {
          const paciente = pacientesData.find((p: any) => p.id === cronico.patient_id)
          return {
            ...cronico,
            nome_paciente: paciente ? paciente.full_name : "Nome não disponível",
          }
        })

        setCronicos(cronicosComNome)
        setPacientes(pacientesData)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados")
        setCronicos([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filtros.tipoCondicao])

  // Filtrar por nome do paciente
  const cronicosFiltrados = cronicos.filter(
    (cronico) =>
      filtros.nomePaciente === "" || cronico.nome_paciente.toLowerCase().includes(filtros.nomePaciente.toLowerCase()),
  )

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltros({
      ...filtros,
      tipoCondicao: e.target.value,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({
      ...filtros,
      nomePaciente: e.target.value,
    })
  }

  return (
    <div className="container mx-auto">
      <PageTitle title="Hipertensos e Diabéticos">
        <Link href="/cronicos/novo" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          Novo Acompanhamento
        </Link>
      </PageTitle>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="tipoCondicao" className="form-label">
              Condição
            </label>
            <select id="tipoCondicao" value={filtros.tipoCondicao} onChange={handleFiltroChange} className="form-input">
              <option value="">Todas as condições</option>
              <option value="hypertension">Hipertensão</option>
              <option value="diabetes">Diabetes</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nomePaciente" className="form-label">
              Buscar por nome
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="nomePaciente"
                placeholder="Nome do paciente..."
                value={filtros.nomePaciente}
                onChange={handleSearchChange}
                className="form-input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : cronicosFiltrados.length === 0 ? (
        <EmptyState
          title="Nenhum paciente encontrado"
          description="Comece cadastrando um novo acompanhamento de condição crônica."
          icon={<Activity className="h-12 w-12 text-gray-400" />}
          action={
            <Link href="/cronicos/novo" className="btn-primary">
              Cadastrar Acompanhamento
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cronicosFiltrados.map((cronico) => (
            <div key={cronico.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{cronico.nome_paciente}</h3>
                  <p className="text-sm text-gray-500">
                    {cronico.condition_type === "hypertension" ? "Hipertensão" : "Diabetes"}
                  </p>
                </div>
                <div>
                  {cronico.condition_type === "hypertension" ? (
                    <Heart className="h-6 w-6 text-red-500" />
                  ) : (
                    <Activity className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Medicamentos:</span>
                  <span className="text-sm font-medium">{cronico.medications || "Não informado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Adesão ao tratamento:</span>
                  <StatusBadge status={cronico.treatment_adherence} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Última atualização:</span>
                  <span className="text-sm font-medium">
                    {new Date(cronico.updated_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Link
                  href={`/cronicos/${cronico.id}/medicoes`}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Ver medições
                </Link>
                <button
                  onClick={() => router.push(`/cronicos/${cronico.id}`)}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Edit className="h-5 w-5 mr-1" />
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
