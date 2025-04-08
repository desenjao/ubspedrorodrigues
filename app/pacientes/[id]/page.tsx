"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import { getPaciente, updatePaciente, createPaciente } from "@/lib/api"

export default function PacienteFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isEditMode = params.id !== "novo"
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome_completo: "",
    cpf: "",
    cartao_sus: "",
    data_nascimento: "",
    sexo: "",
    endereco: "",
    telefone: "",
    nome_mae: "",
    profissao: "",
    escolaridade: "",
    numero_prontuario: "",
    gestante: false,
    hipertenso: false,
    diabetico: false,
    outros_grupos: "",
    observacoes: "",
  })

  useEffect(() => {
    if (isEditMode) {
      const fetchPaciente = async () => {
        try {
          setLoading(true)
          const data = await getPaciente(params.id)

          // Mapear os campos do backend para o formulário
          setFormData({
            nome_completo: data.full_name,
            cpf: data.cpf,
            cartao_sus: data.sus_card || "",
            data_nascimento: new Date(data.birth_date).toISOString().split("T")[0],
            sexo: data.gender,
            endereco: data.address,
            telefone: data.phone,
            nome_mae: data.mother_name,
            profissao: data.profession || "",
            escolaridade: data.education || "",
            numero_prontuario: data.record_number || "",
            gestante: data.is_pregnant,
            hipertenso: data.is_hypertensive,
            diabetico: data.is_diabetic,
            outros_grupos: data.other_groups || "",
            observacoes: data.observations || "",
          })

          setError(null)
        } catch (err: any) {
          setError(err.message || "Erro ao carregar dados do paciente")
        } finally {
          setLoading(false)
        }
      }

      fetchPaciente()
    }
  }, [isEditMode, params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      // Mapear os campos do formulário para o backend
      const pacienteData = {
        full_name: formData.nome_completo,
        cpf: formData.cpf,
        sus_card: formData.cartao_sus,
        birth_date: formData.data_nascimento,
        gender: formData.sexo,
        address: formData.endereco,
        phone: formData.telefone,
        mother_name: formData.nome_mae,
        profession: formData.profissao,
        education: formData.escolaridade,
        record_number: formData.numero_prontuario,
        is_pregnant: formData.gestante,
        is_hypertensive: formData.hipertenso,
        is_diabetic: formData.diabetico,
        other_groups: formData.outros_grupos,
        observations: formData.observacoes,
      }

      if (isEditMode) {
        await updatePaciente(params.id, pacienteData)
      } else {
        await createPaciente(pacienteData)
      }

      router.push("/pacientes")
    } catch (err: any) {
      setError(err.message || "Erro ao salvar paciente")
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto">
      <PageTitle title={isEditMode ? "Editar Paciente" : "Novo Paciente"} />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="nome_completo" className="form-label">
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome_completo"
                name="nome_completo"
                value={formData.nome_completo}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf" className="form-label">
                CPF *
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cartao_sus" className="form-label">
                Cartão SUS
              </label>
              <input
                type="text"
                id="cartao_sus"
                name="cartao_sus"
                value={formData.cartao_sus}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="data_nascimento" className="form-label">
                Data de Nascimento *
              </label>
              <input
                type="date"
                id="data_nascimento"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sexo" className="form-label">
                Sexo *
              </label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="telefone" className="form-label">
                Telefone *
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group md:col-span-2">
              <label htmlFor="endereco" className="form-label">
                Endereço *
              </label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nome_mae" className="form-label">
                Nome da Mãe *
              </label>
              <input
                type="text"
                id="nome_mae"
                name="nome_mae"
                value={formData.nome_mae}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profissao" className="form-label">
                Profissão
              </label>
              <input
                type="text"
                id="profissao"
                name="profissao"
                value={formData.profissao}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="escolaridade" className="form-label">
                Escolaridade
              </label>
              <select
                id="escolaridade"
                name="escolaridade"
                value={formData.escolaridade}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Selecione</option>
                <option value="Não Alfabetizado">Não Alfabetizado</option>
                <option value="Fundamental Incompleto">Fundamental Incompleto</option>
                <option value="Fundamental Completo">Fundamental Completo</option>
                <option value="Médio Incompleto">Médio Incompleto</option>
                <option value="Médio Completo">Médio Completo</option>
                <option value="Superior Incompleto">Superior Incompleto</option>
                <option value="Superior Completo">Superior Completo</option>
                <option value="Pós-graduação">Pós-graduação</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="numero_prontuario" className="form-label">
                Número do Prontuário
              </label>
              <input
                type="text"
                id="numero_prontuario"
                name="numero_prontuario"
                value={formData.numero_prontuario}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Grupos de Acompanhamento</label>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="gestante"
                    name="gestante"
                    checked={formData.gestante}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="gestante" className="ml-2 text-sm text-gray-700">
                    Gestante
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hipertenso"
                    name="hipertenso"
                    checked={formData.hipertenso}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hipertenso" className="ml-2 text-sm text-gray-700">
                    Hipertenso
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="diabetico"
                    name="diabetico"
                    checked={formData.diabetico}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="diabetico" className="ml-2 text-sm text-gray-700">
                    Diabético
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="outros_grupos" className="form-label">
                Outros Grupos
              </label>
              <input
                type="text"
                id="outros_grupos"
                name="outros_grupos"
                value={formData.outros_grupos}
                onChange={handleChange}
                className="form-input"
                placeholder="Ex: Idoso, Saúde Mental, etc."
              />
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
            <button type="button" onClick={() => router.push("/pacientes")} className="btn-secondary" disabled={saving}>
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
