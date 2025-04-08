"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Activity, Heart } from "lucide-react"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import { getCronico, getPaciente, getPressaoArterial, getGlicemia, addPressaoArterial, addGlicemia } from "@/lib/api"

export default function MedicoesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cronico, setCronico] = useState<any>(null)
  const [paciente, setPaciente] = useState<any>(null)
  const [pressaoArterial, setPressaoArterial] = useState<any[]>([])
  const [glicemia, setGlicemia] = useState<any[]>([])

  const [formPressao, setFormPressao] = useState({
    sistolica: "",
    diastolica: "",
    data: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    notas: "",
  })

  const [formGlicemia, setFormGlicemia] = useState({
    nivel: "",
    tipo_medicao: "Jejum",
    data: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    notas: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Buscar dados do acompanhamento crônico
        const cronicoData = await getCronico(params.id)
        setCronico(cronicoData)

        // Buscar dados do paciente
        const pacienteData = await getPaciente(cronicoData.patient_id)
        setPaciente(pacienteData)

        // Buscar medições conforme o tipo de condição
        if (cronicoData.condition_type === "hypertension") {
          const pressaoData = await getPressaoArterial(params.id)
          setPressaoArterial(pressaoData)
        } else {
          const glicemiaData = await getGlicemia(params.id)
          setGlicemia(glicemiaData)
        }

        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handlePressaoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormPressao({
      ...formPressao,
      [name]: value,
    })
  }

  const handleGlicemiaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormGlicemia({
      ...formGlicemia,
      [name]: value,
    })
  }

  const handlePressaoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      // Combinar data e hora
      const dataHora = new Date(`${formPressao.data}T${formPressao.hora}:00`)

      const pressaoData = {
        measurement_date: dataHora.toISOString(),
        systolic: Number.parseInt(formPressao.sistolica),
        diastolic: Number.parseInt(formPressao.diastolica),
        notes: formPressao.notas,
      }

      await addPressaoArterial(params.id, pressaoData)

      // Recarregar dados
      const pressaoAtualizada = await getPressaoArterial(params.id)
      setPressaoArterial(pressaoAtualizada)

      // Limpar formulário
      setFormPressao({
        sistolica: "",
        diastolica: "",
        data: new Date().toISOString().split("T")[0],
        hora: new Date().toTimeString().slice(0, 5),
        notas: "",
      })

      setError(null)
    } catch (err: any) {
      setError(err.message || "Erro ao salvar medição")
    } finally {
      setSaving(false)
    }
  }

  const handleGlicemiaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      // Combinar data e hora
      const dataHora = new Date(`${formGlicemia.data}T${formGlicemia.hora}:00`)

      const glicemiaData = {
        measurement_date: dataHora.toISOString(),
        glucose_level: Number.parseFloat(formGlicemia.nivel),
        measurement_type: formGlicemia.tipo_medicao,
        notes: formGlicemia.notas,
      }

      await addGlicemia(params.id, glicemiaData)

      // Recarregar dados
      const glicemiaAtualizada = await getGlicemia(params.id)
      setGlicemia(glicemiaAtualizada)

      // Limpar formulário
      setFormGlicemia({
        nivel: "",
        tipo_medicao: "Jejum",
        data: new Date().toISOString().split("T")[0],
        hora: new Date().toTimeString().slice(0, 5),
        notas: "",
      })

      setError(null)
    } catch (err: any) {
      setError(err.message || "Erro ao salvar medição")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Link href="/cronicos" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para lista de acompanhamentos
        </Link>
      </div>

      <PageTitle
        title={cronico?.condition_type === "hypertension" ? "Medições de Pressão Arterial" : "Medições de Glicemia"}
      />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {paciente && cronico && (
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">{paciente.full_name}</h3>
              <p className="text-sm text-gray-500">
                {cronico.condition_type === "hypertension" ? "Hipertensão" : "Diabetes"}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-sm">
                <span className="text-gray-500">Medicamentos:</span>{" "}
                <span className="font-medium">{cronico.medications || "Não informado"}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Adesão ao tratamento:</span>{" "}
                <span className="font-medium">{cronico.treatment_adherence}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário para adicionar medição */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {cronico?.condition_type === "hypertension"
              ? "Nova Medição de Pressão Arterial"
              : "Nova Medição de Glicemia"}
          </h3>

          {cronico?.condition_type === "hypertension" ? (
            <form onSubmit={handlePressaoSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="sistolica" className="form-label">
                    Pressão Sistólica (mmHg) *
                  </label>
                  <input
                    type="number"
                    id="sistolica"
                    name="sistolica"
                    value={formPressao.sistolica}
                    onChange={handlePressaoChange}
                    className="form-input"
                    required
                    min="60"
                    max="300"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="diastolica" className="form-label">
                    Pressão Diastólica (mmHg) *
                  </label>
                  <input
                    type="number"
                    id="diastolica"
                    name="diastolica"
                    value={formPressao.diastolica}
                    onChange={handlePressaoChange}
                    className="form-input"
                    required
                    min="40"
                    max="200"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="data" className="form-label">
                    Data *
                  </label>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    value={formPressao.data}
                    onChange={handlePressaoChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hora" className="form-label">
                    Hora *
                  </label>
                  <input
                    type="time"
                    id="hora"
                    name="hora"
                    value={formPressao.hora}
                    onChange={handlePressaoChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label htmlFor="notas" className="form-label">
                    Observações
                  </label>
                  <textarea
                    id="notas"
                    name="notas"
                    value={formPressao.notas}
                    onChange={handlePressaoChange}
                    className="form-input"
                    rows={2}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Salvando..." : "Registrar Medição"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleGlicemiaSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="nivel" className="form-label">
                    Nível de Glicose (mg/dL) *
                  </label>
                  <input
                    type="number"
                    id="nivel"
                    name="nivel"
                    value={formGlicemia.nivel}
                    onChange={handleGlicemiaChange}
                    className="form-input"
                    required
                    min="20"
                    max="600"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipo_medicao" className="form-label">
                    Tipo de Medição *
                  </label>
                  <select
                    id="tipo_medicao"
                    name="tipo_medicao"
                    value={formGlicemia.tipo_medicao}
                    onChange={handleGlicemiaChange}
                    className="form-input"
                    required
                  >
                    <option value="Jejum">Jejum</option>
                    <option value="Pós-prandial">Pós-prandial</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="data" className="form-label">
                    Data *
                  </label>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    value={formGlicemia.data}
                    onChange={handleGlicemiaChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hora" className="form-label">
                    Hora *
                  </label>
                  <input
                    type="time"
                    id="hora"
                    name="hora"
                    value={formGlicemia.hora}
                    onChange={handleGlicemiaChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label htmlFor="notas" className="form-label">
                    Observações
                  </label>
                  <textarea
                    id="notas"
                    name="notas"
                    value={formGlicemia.notas}
                    onChange={handleGlicemiaChange}
                    className="form-input"
                    rows={2}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Salvando..." : "Registrar Medição"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Histórico de medições */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Histórico de Medições</h3>

          {cronico?.condition_type === "hypertension" ? (
            pressaoArterial.length === 0 ? (
              <p className="text-gray-500">Nenhuma medição de pressão arterial registrada.</p>
            ) : (
              <div className="space-y-4">
                {pressaoArterial.map((medicao) => (
                  <div
                    key={medicao.id}
                    className={`p-4 border rounded-md ${
                      medicao.systolic >= 140 || medicao.diastolic >= 90
                        ? "bg-red-50 border-red-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-500" />
                          {medicao.systolic}/{medicao.diastolic} mmHg
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(medicao.measurement_date).toLocaleDateString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {medicao.notes && <p className="text-sm mt-1">{medicao.notes}</p>}
                      </div>
                      <div>
                        {(medicao.systolic >= 140 || medicao.diastolic >= 90) && (
                          <span className="badge badge-red">Elevada</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : glicemia.length === 0 ? (
            <p className="text-gray-500">Nenhuma medição de glicemia registrada.</p>
          ) : (
            <div className="space-y-4">
              {glicemia.map((medicao) => {
                // Verificar se a glicemia está elevada com base no tipo de medição
                let elevada = false
                if (medicao.measurement_type === "Jejum" && medicao.glucose_level > 100) {
                  elevada = true
                } else if (medicao.measurement_type === "Pós-prandial" && medicao.glucose_level > 140) {
                  elevada = true
                } else if (medicao.measurement_type === "Casual" && medicao.glucose_level > 200) {
                  elevada = true
                }

                return (
                  <div
                    key={medicao.id}
                    className={`p-4 border rounded-md ${
                      elevada ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Activity className="h-4 w-4 mr-1 text-yellow-500" />
                          {medicao.glucose_level} mg/dL
                        </h4>
                        <p className="text-sm text-gray-500">
                          {medicao.measurement_type} -{" "}
                          {new Date(medicao.measurement_date).toLocaleDateString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {medicao.notes && <p className="text-sm mt-1">{medicao.notes}</p>}
                      </div>
                      <div>{elevada && <span className="badge badge-yellow">Elevada</span>}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
