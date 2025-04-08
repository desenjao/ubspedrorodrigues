"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import { getCronico, updateCronico, createCronico, getPacientes } from "@/lib/api"

export default function CronicoFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isEditMode = params.id !== "novo"
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pacientes, setPacientes] = useState<any[]>([])

  const [formData, setFormData] = useState({
    paciente_id: "",
    tipo_condicao: "hypertension",
    medicamentos: "",
    adesao_tratamento: "Sim",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar lista de pacientes com condições crônicas
        const pacientesData = await getPacientes()
        const pacientesCronicos = pacientesData.filter((p: any) => p.is_hypertensive || p.is_diabetic)
        setPacientes(pacientesCronicos)

        // Se for modo de edição, buscar dados do acompanhamento
        if (isEditMode) {
          const cronicoData = await getCronico(params.id)

          setFormData({
            paciente_id: cronicoData.patient_id,
            tipo_condicao: cronicoData.condition_type,
            medicamentos: cronicoData.medications || "",
            adesao_tratamento: cronicoData.treatment_adherence,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      const cronicoData = {
        patient_id: formData.paciente_id,
        condition_type: formData.tipo_condicao,
        medications: formData.medicamentos,
        treatment_adherence: formData.adesao_tratamento,
      }

      if (isEditMode) {
        await updateCronico(params.id, cronicoData)
      } else {
        await createCronico(cronicoData)
      }

      router.push("/cronicos")
    } catch (err: any) {
      setError(err.message || "Erro ao salvar acompanhamento")
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto">
      <PageTitle title={isEditMode ? "Editar Acompanhamento" : "Novo Acompanhamento"} />

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
                <option value="">Selecione um paciente</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.full_name}
                    {paciente.is_hypertensive && paciente.is_diabetic
                      ? " (Hipertenso e Diabético)"
                      : paciente.is_hypertensive
                        ? " (Hipertenso)"
                        : " (Diabético)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tipo_condicao" className="form-label">
                Tipo de Condição *
              </label>
              <select
                id="tipo_condicao"
                name="tipo_condicao"
                value={formData.tipo_condicao}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="hypertension">Hipertensão</option>
                <option value="diabetes">Diabetes</option>
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label htmlFor="medicamentos" className="form-label">
                Medicamentos
              </label>
              <textarea
                id="medicamentos"
                name="medicamentos"
                value={formData.medicamentos}
                onChange={handleChange}
                className="form-input"
                rows={3}
                placeholder="Liste os medicamentos utilizados pelo paciente"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="adesao_tratamento" className="form-label">
                Adesão ao Tratamento *
              </label>
              <select
                id="adesao_tratamento"
                name="adesao_tratamento"
                value={formData.adesao_tratamento}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
                <option value="Parcial">Parcial</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={() => router.push("/cronicos")} className="btn-secondary" disabled={saving}>
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
