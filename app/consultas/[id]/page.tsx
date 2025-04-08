"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import { getConsulta, updateConsulta, createConsulta, getPacientes } from "@/lib/api"

export default function ConsultaFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isEditMode = params.id !== "novo"
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pacientes, setPacientes] = useState<any[]>([])

  const [formData, setFormData] = useState({
    paciente_id: "",
    data_consulta: "",
    hora_consulta: "",
    tipo_consulta: "",
    profissional: "",
    observacoes: "",
    status: "Agendado",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar lista de pacientes
        const pacientesData = await getPacientes()
        setPacientes(pacientesData)

        // Se for modo de edição, buscar dados da consulta
        if (isEditMode) {
          const consultaData = await getConsulta(params.id)

          // Converter data e hora
          const dataHora = new Date(consultaData.appointment_date)
          const dataFormatada = dataHora.toISOString().split("T")[0]
          const horaFormatada = dataHora.toTimeString().slice(0, 5)

          setFormData({
            paciente_id: consultaData.patient_id,
            data_consulta: dataFormatada,
            hora_consulta: horaFormatada,
            tipo_consulta: consultaData.appointment_type,
            profissional: consultaData.professional,
            observacoes: consultaData.notes || "",
            status: consultaData.status,
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

      // Combinar data e hora para o formato ISO
      const dataHoraConsulta = new Date(`${formData.data_consulta}T${formData.hora_consulta}:00`)

      const consultaData = {
        patient_id: formData.paciente_id,
        appointment_date: dataHoraConsulta.toISOString(),
        appointment_type: formData.tipo_consulta,
        professional: formData.profissional,
        notes: formData.observacoes,
        status: formData.status,
      }

      if (isEditMode) {
        await updateConsulta(params.id, consultaData)
      } else {
        await createConsulta(consultaData)
      }

      router.push("/consultas")
    } catch (err: any) {
      setError(err.message || "Erro ao salvar consulta")
      setSaving(false)
    }
  }

  const tiposConsulta = [
    "Consulta Médica",
    "Consulta de Enfermagem",
    "Pré-Natal",
    "Puericultura",
    "Hiperdia",
    "Saúde Mental",
    "Nutrição",
    "Fisioterapia",
    "Odontologia",
    "Outro",
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto">
      <PageTitle title={isEditMode ? "Editar Consulta" : "Nova Consulta"} />

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
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tipo_consulta" className="form-label">
                Tipo de Consulta *
              </label>
              <select
                id="tipo_consulta"
                name="tipo_consulta"
                value={formData.tipo_consulta}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Selecione o tipo</option>
                {tiposConsulta.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="data_consulta" className="form-label">
                Data *
              </label>
              <input
                type="date"
                id="data_consulta"
                name="data_consulta"
                value={formData.data_consulta}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora_consulta" className="form-label">
                Hora *
              </label>
              <input
                type="time"
                id="hora_consulta"
                name="hora_consulta"
                value={formData.hora_consulta}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profissional" className="form-label">
                Profissional *
              </label>
              <input
                type="text"
                id="profissional"
                name="profissional"
                value={formData.profissional}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Nome do profissional"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="Agendado">Agendado</option>
                <option value="Realizado">Realizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label htmlFor="observacoes" className="form-label">
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                className="form-input"
                rows={3}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={() => router.push("/consultas")} className="btn-secondary" disabled={saving}>
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
