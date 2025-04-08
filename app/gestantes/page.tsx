"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Calendar, Baby } from "lucide-react"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import EmptyState from "@/components/empty-state"
import { getGestantes, getPacientes } from "@/lib/api"

export default function GestantesPage() {
  const router = useRouter()
  const [gestantes, setGestantes] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroNome, setFiltroNome] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [gestantesData, pacientesData] = await Promise.all([getGestantes(), getPacientes()])

        // Adicionar nome do paciente aos dados da gestante
        const gestantesComNome = gestantesData.map((gestante: any) => {
          const paciente = pacientesData.find((p: any) => p.id === gestante.patient_id)
          return {
            ...gestante,
            nome_paciente: paciente ? paciente.full_name : "Nome não disponível",
          }
        })

        setGestantes(gestantesComNome)
        setPacientes(pacientesData)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar gestantes")
        setGestantes([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar gestantes pelo nome
  const gestantesFiltradas = gestantes.filter(
    (gestante) => filtroNome === "" || gestante.nome_paciente.toLowerCase().includes(filtroNome.toLowerCase()),
  )

  // Calcular semanas de gestação
  const calcularSemanasGestacao = (ultimaMenstruacao: string) => {
    const dataUltimaMenstruacao = new Date(ultimaMenstruacao)
    const hoje = new Date()
    const diferencaEmDias = Math.floor((hoje.getTime() - dataUltimaMenstruacao.getTime()) / (1000 * 60 * 60 * 24))
    return Math.floor(diferencaEmDias / 7)
  }

  return (
    <div className="container mx-auto">
      <PageTitle title="Gestantes">
        <Link href="/gestantes/novo" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          Nova Gestante
        </Link>
      </PageTitle>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome da gestante..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : gestantesFiltradas.length === 0 ? (
        <EmptyState
          title="Nenhuma gestante encontrada"
          description="Comece cadastrando uma nova gestante no sistema."
          icon={<Baby className="h-12 w-12 text-gray-400" />}
          action={
            <Link href="/gestantes/novo" className="btn-primary">
              Cadastrar Gestante
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gestantesFiltradas.map((gestante) => {
            const semanasGestacao = calcularSemanasGestacao(gestante.last_period_date)

            return (
              <div key={gestante.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-700">{gestante.nome_paciente}</h3>
                    <p className="text-sm text-gray-500">{semanasGestacao} semanas de gestação</p>
                  </div>
                  <div>
                    <span className={`badge ${gestante.risk_classification === "alto" ? "badge-red" : "badge-green"}`}>
                      Risco {gestante.risk_classification}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">DUM:</span>
                    <span className="text-sm font-medium">
                      {new Date(gestante.last_period_date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">DPP:</span>
                    <span className="text-sm font-medium">
                      {new Date(gestante.expected_birth_date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Número da gestação:</span>
                    <span className="text-sm font-medium">{gestante.pregnancy_number}ª</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Cartão da gestante:</span>
                    <span className="text-sm font-medium">{gestante.has_pregnancy_card ? "Sim" : "Não"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <Link
                    href={`/gestantes/${gestante.id}/exames`}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Ver exames
                  </Link>
                  <button
                    onClick={() => router.push(`/gestantes/${gestante.id}`)}
                    className="text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <Edit className="h-5 w-5 mr-1" />
                    Editar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
