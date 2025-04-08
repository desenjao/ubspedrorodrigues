"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import { getExame, updateExame, createExame, getPacientes } from "@/lib/api"

export default function ExameFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isEditMode = params.id !== "novo"
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pacientes, setPacientes] = useState<any[]>([])

  const [formData, setFormData] = useState({
    paciente_id: "",
    tipo_exame: "",
    data_agendada: "",
    hora_agendada: "",
    status: "Agendado",
    url_resultado: "",
    texto_resultado: "",
    observacoes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar lista de pacientes
        const pacientesData = await getPacientes()
        setPacientes(pacientesData)

        // Se for modo de edição, buscar dados do exame
        if (isEditMode) {
          const exameData = await getExame(params.id)

          // Converter data e hora
          const dataHora = new Date(exameData.scheduled_date)
          const dataFormatada = dataHora.toISOString().split("T")[0]
          const horaFormatada = dataHora.toTimeString().slice(0, 5)

          setFormData({
            paciente_id: exameData.patient_id,
            tipo_exame: exameData.exam_type,
            data_agendada: dataFormatada,
            hora_agendada: horaFormatada,
            status: exameData.status,
            url_resultado: exameData.result_url || "",
            texto_resultado: exameData.result_text || "",
            observacoes: exameData.observations || "",
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
      const dataHoraAgendada = new Date(`${formData.data_agendada}T${formData.hora_agendada}:00`)

      const exameData = {
        patient_id: formData.paciente_id,
        exam_type: formData.tipo_exame,
        scheduled_date: dataHoraAgendada.toISOString(),
        status: formData.status,
        result_url: formData.url_resultado,
        result_text: formData.texto_resultado,
        observations: formData.observacoes,
      }

      if (isEditMode) {
        await updateExame(params.id, exameData)
      } else {
        await createExame(exameData)
      }

      router.push("/exames")
    } catch (err: any) {
      setError(err.message || "Erro ao salvar exame")
      setSaving(false)
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

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto">
      <PageTitle title={isEditMode ? "Editar Exame" : "Novo Exame"} />

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
              <label htmlFor="tipo_exame" className="form-label">
                Tipo de Exame *
              </label>
              <select
                id="tipo_exame"
                name="tipo_exame"
                value={formData.tipo_exame}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Selecione o tipo de exame</option>
                {tiposExame.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="data_agendada" className="form-label">
                Data Agendada *
              </label>
              <input
                type="date"
                id="data_agendada"
                name="data_agendada"
                value={formData.data_agendada}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora_agendada" className="form-label">
                Hora Agendada *
              </label>
              <input
                type="time"
                id="hora_agendada"
                name="hora_agendada"
                value={formData.hora_agendada}
                onChange={handleChange}
                className="form-input"
                required
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
                <option value="Marcado">Marcado</option>
                <option value="Marcado - Aguardando protocolo">Marcado - Aguardando protocolo</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="url_resultado" className="form-label">
                URL do Resultado
              </label>
              <input
                type="url"
                id="url_resultado"
                name="url_resultado"
                value={formData.url_resultado}
                onChange={handleChange}
                className="form-input"
                placeholder="https://exemplo.com/resultado.pdf"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label htmlFor="texto_resultado" className="form-label">
                Texto do Resultado
              </label>
              <textarea
                id="texto_resultado"
                name="texto_resultado"
                value={formData.texto_resultado}
                onChange={handleChange}
                className="form-input"
                rows={4}
              ></textarea>
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
            <button type="button" onClick={() => router.push("/exames")} className="btn-secondary" disabled={saving}>
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
