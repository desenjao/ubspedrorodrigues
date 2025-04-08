"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import { getGestante, updateGestante, createGestante, getPacientes } from "@/lib/api"

export default function GestanteFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isEditMode = params.id !== "novo"
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pacientes, setPacientes] = useState<any[]>([])

  const [formData, setFormData] = useState({
    paciente_id: "",
    data_ultima_menstruacao: "",
    data_provavel_parto: "",
    numero_gestacao: 1,
    classificacao_risco: "baixo",
    data_primeira_consulta: "",
    possui_cartao_gestante: false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar lista de pacientes gestantes
        const pacientesData = await getPacientes()
        const pacientesGestantes = pacientesData.filter((p: any) => p.is_pregnant)
        setPacientes(pacientesGestantes)

        // Se for modo de edição, buscar dados da gestante
        if (isEditMode) {
          const gestanteData = await getGestante(params.id)

          setFormData({
            paciente_id: gestanteData.patient_id,
            data_ultima_menstruacao: new Date(gestanteData.last_period_date).toISOString().split("T")[0],
            data_provavel_parto: new Date(gestanteData.expected_birth_date).toISOString().split("T")[0],
            numero_gestacao: gestanteData.pregnancy_number,
            classificacao_risco: gestanteData.risk_classification,
            data_primeira_consulta: gestanteData.first_appointment_date
              ? new Date(gestanteData.first_appointment_date).toISOString().split("T")[0]
              : "",
            possui_cartao_gestante: gestanteData.has_pregnancy_card,
          })
        }

        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isEditMode, params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  // Calcular data provável do parto (DPP) - 280 dias após a DUM
  const calcularDPP = (dum: string) => {
    if (!dum) return ""

    const dataUltimaMenstruacao = new Date(dum)
    const dataParto = new Date(dataUltimaMenstruacao)
    dataParto.setDate(dataUltimaMenstruacao.getDate() + 280)

    return dataParto.toISOString().split("T")[0]
  }

  const handleDUMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dum = e.target.value
    const dpp = calcularDPP(dum)

    setFormData({
      ...formData,
      data_ultima_menstruacao: dum,
      data_provavel_parto: dpp,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      const gestanteData = {
        patient_id: formData.paciente_id,
        last_period_date: formData.data_ultima_menstruacao,
        expected_birth_date: formData.data_provavel_parto,
        pregnancy_number: Number.parseInt(formData.numero_gestacao.toString()),
        risk_classification: formData.classificacao_risco,
        first_appointment_date: formData.data_primeira_consulta || null,
        has_pregnancy_card: formData.possui_cartao_gestante,
      }

      if (isEditMode) {
        await updateGestante(params.id, gestanteData)
      } else {
        await createGestante(gestanteData)
      }

      router.push("/gestantes")
    } catch (err: any) {
      setError(err.message || "Erro ao salvar gestante")
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto">
      <PageTitle title={isEditMode ? "Editar Gestante" : "Nova Gestante"} />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="paciente_id" className="form-label">
                Paciente *
              </label>
              <select
                id="paciente_id"
                name="paciente_id"
                value={formData.paciente_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Selecione uma paciente</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="numero_gestacao" className="form-label">
                Número da Gestação *
              </label>
              <input
                type="number"
                id="numero_gestacao"
                name="numero_gestacao"
                value={formData.numero_gestacao}
                onChange={handleChange}
                min="1"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="data_ultima_menstruacao" className="form-label">
                Data da Última Menstruação (DUM) *
              </label>
              <input
                type="date"
                id="data_ultima_menstruacao"
                name="data_ultima_menstruacao"
                value={formData.data_ultima_menstruacao}
                onChange={handleDUMChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="data_provavel_parto" className="form-label">
                Data Provável do Parto (DPP) *
              </label>
              <input
                type="date"
                id="data_provavel_parto"
                name="data_provavel_parto"
                value={formData.data_provavel_parto}
                onChange={handleChange}
                className="form-input"
                required
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Calculado automaticamente (280 dias após a DUM)</p>
            </div>

            <div className="form-group">
              <label htmlFor="classificacao_risco" className="form-label">
                Classificação de Risco *
              </label>
              <select
                id="classificacao_risco"
                name="classificacao_risco"
                value={formData.classificacao_risco}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="baixo">Baixo Risco</option>
                <option value="alto">Alto Risco</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="data_primeira_consulta" className="form-label">
                Data da Primeira Consulta
              </label>
              <input
                type="date"
                id="data_primeira_consulta"
                name="data_primeira_consulta"
                value={formData.data_primeira_consulta}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="possui_cartao_gestante"
                  name="possui_cartao_gestante"
                  checked={formData.possui_cartao_gestante}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="possui_cartao_gestante" className="ml-2 text-sm text-gray-700">
                  Possui cartão da gestante
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={() => router.push("/gestantes")} className="btn-secondary" disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
