"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, ArrowLeft, Check, X } from "lucide-react"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import { getGestante, getPaciente, getExames, addExameGestante, updateExameGestante } from "@/lib/api"

export default function ExamesGestantePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gestante, setGestante] = useState<any>(null)
  const [paciente, setPaciente] = useState<any>(null)
  const [exames, setExames] = useState<any[]>([])
  const [examesGestante, setExamesGestante] = useState<any[]>([])
  const [examesSelecionados, setExamesSelecionados] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar dados da gestante
        const gestanteData = await getGestante(params.id)
        setGestante(gestanteData)

        // Buscar dados do paciente
        const pacienteData = await getPaciente(gestanteData.patient_id)
        setPaciente(pacienteData)

        // Buscar exames da gestante
        setExamesGestante(gestanteData.exames || [])

        // Buscar todos os exames do paciente
        const examesData = await getExames({ pacienteId: gestanteData.patient_id })
        setExames(examesData)

        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleExameSelecionado = (exameId: string) => {
    if (examesSelecionados.includes(exameId)) {
      setExamesSelecionados(examesSelecionados.filter((id) => id !== exameId))
    } else {
      setExamesSelecionados([...examesSelecionados, exameId])
    }
  }

  const handleAdicionarExames = async () => {
    if (examesSelecionados.length === 0) return

    try {
      setSaving(true)

      // Adicionar cada exame selecionado
      for (const exameId of examesSelecionados) {
        await addExameGestante(params.id, { exam_id: exameId })
      }

      // Recarregar dados
      const gestanteData = await getGestante(params.id)
      setExamesGestante(gestanteData.exames || [])
      setExamesSelecionados([])

      setError(null)
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar exames")
    } finally {
      setSaving(false)
    }
  }

  const handleMarcarConcluido = async (exameGestanteId: string, concluido: boolean) => {
    try {
      await updateExameGestante(exameGestanteId, { is_completed: concluido })

      // Atualizar a lista local
      setExamesGestante(
        examesGestante.map((exame) => (exame.id === exameGestanteId ? { ...exame, is_completed: concluido } : exame)),
      )
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar exame")
    }
  }

  // Filtrar exames que ainda não foram adicionados à gestante
  const examesDisponiveis = exames.filter((exame) => !examesGestante.some((eg) => eg.exam_id === exame.id))

  if (loading) {
    return <Loading />
  }

  // Calcular semanas de gestação
  const calcularSemanasGestacao = () => {
    if (!gestante) return 0

    const dataUltimaMenstruacao = new Date(gestante.last_period_date)
    const hoje = new Date()
    const diferencaEmDias = Math.floor((hoje.getTime() - dataUltimaMenstruacao.getTime()) / (1000 * 60 * 60 * 24))
    return Math.floor(diferencaEmDias / 7)
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Link href="/gestantes" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para lista de gestantes
        </Link>
      </div>

      <PageTitle title="Acompanhamento de Exames da Gestante" />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {paciente && gestante && (
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-700">{paciente.full_name}</h3>
              <p className="text-sm text-gray-500">{calcularSemanasGestacao()} semanas de gestação</p>
            </div>
            <div className="md:text-right">
              <p className="text-sm">
                <span className="text-gray-500">DUM:</span>{" "}
                <span className="font-medium">{new Date(gestante.last_period_date).toLocaleDateString("pt-BR")}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">DPP:</span>{" "}
                <span className="font-medium">
                  {new Date(gestante.expected_birth_date).toLocaleDateString("pt-BR")}
                </span>
              </p>
              <p className="text-sm">
                <span className={`badge ${gestante.risk_classification === "alto" ? "badge-red" : "badge-green"}`}>
                  Risco {gestante.risk_classification}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de exames da gestante */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Exames da Gestante</h3>

          {examesGestante.length === 0 ? (
            <p className="text-gray-500">Nenhum exame adicionado ao acompanhamento.</p>
          ) : (
            <div className="space-y-4">
              {examesGestante.map((exameGestante) => {
                const exame = exames.find((e) => e.id === exameGestante.exam_id) || {}

                return (
                  <div
                    key={exameGestante.id}
                    className={`p-4 border rounded-md ${
                      exameGestante.is_completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{exame.exam_type}</h4>
                        <p className="text-sm text-gray-500">
                          Agendado para:{" "}
                          {exame.scheduled_date
                            ? new Date(exame.scheduled_date).toLocaleDateString("pt-BR")
                            : "Data não definida"}
                        </p>
                        <p className="text-sm text-gray-500">Status: {exame.status || "Não definido"}</p>
                      </div>
                      <div>
                        {exameGestante.is_completed ? (
                          <button
                            onClick={() => handleMarcarConcluido(exameGestante.id, false)}
                            className="flex items-center text-sm text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Desmarcar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarcarConcluido(exameGestante.id, true)}
                            className="flex items-center text-sm text-green-600 hover:text-green-800"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Concluído
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Adicionar novos exames */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Adicionar Exames</h3>

          {examesDisponiveis.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">Não há exames disponíveis para adicionar.</p>
              <Link
                href={`/exames/novo?pacienteId=${gestante?.patient_id}`}
                className="btn-primary inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Cadastrar Novo Exame
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {examesDisponiveis.map((exame) => (
                  <div key={exame.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`exame-${exame.id}`}
                      checked={examesSelecionados.includes(exame.id)}
                      onChange={() => handleExameSelecionado(exame.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`exame-${exame.id}`} className="ml-2 flex-1 cursor-pointer">
                      <div className="font-medium">{exame.exam_type}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(exame.scheduled_date).toLocaleDateString("pt-BR")}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href={`/exames/novo?pacienteId=${gestante?.patient_id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Cadastrar novo exame
                </Link>
                <button
                  onClick={handleAdicionarExames}
                  disabled={examesSelecionados.length === 0 || saving}
                  className="btn-primary"
                >
                  {saving ? "Adicionando..." : "Adicionar Selecionados"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
