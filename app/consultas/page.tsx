"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import EmptyState from "@/components/empty-state"
import StatusBadge from "@/components/status-badge"
import { getConsultas, deleteConsulta, getPacientes } from "@/lib/api"

export default function ConsultasPage() {
  const router = useRouter()
  const [consultas, setConsultas] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtros, setFiltros] = useState({
    pacienteId: "",
    status: "",
    dataInicio: "",
    dataFim: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [consultasData, pacientesData] = await Promise.all([
          getConsultas({
            pacienteId: filtros.pacienteId,
            status: filtros.status,
          }),
          getPacientes(),
        ])

        // Adicionar nome do paciente aos dados da consulta
        const consultasComNome = consultasData.map((consulta: any) => {
          const paciente = pacientesData.find((p: any) => p.id === consulta.patient_id)
          return {
            ...consulta,
            nome_paciente: paciente ? paciente.full_name : "Nome não disponível",
          }
        })

        // Filtrar por data se necessário
        let consultasFiltradas = consultasComNome
        if (filtros.dataInicio) {
          const dataInicio = new Date(filtros.dataInicio)
          consultasFiltradas = consultasFiltradas.filter(
            (consulta: any) => new Date(consulta.appointment_date) >= dataInicio,
          )
        }
        if (filtros.dataFim) {
          const dataFim = new Date(filtros.dataFim)
          dataFim.setHours(23, 59, 59)
          consultasFiltradas = consultasFiltradas.filter(
            (consulta: any) => new Date(consulta.appointment_date) <= dataFim,
          )
        }

        setConsultas(consultasFiltradas)
        setPacientes(pacientesData)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar consultas")
        setConsultas([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filtros.pacienteId, filtros.status, filtros.dataInicio, filtros.dataFim])

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta consulta?")) {
      try {
        await deleteConsulta(id)
        setConsultas(consultas.filter((consulta) => consulta.id !== id))
      } catch (err: any) {
        setError(err.message || "Erro ao excluir consulta")
      }
    }
  }

  return (
    <div className="container mx-auto">
      <PageTitle title="Consultas">
        <Link href="/consultas/novo" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          Nova Consulta
        </Link>
      </PageTitle>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="card mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-group">
            <label htmlFor="pacienteId" className="form-label">
              Paciente
            </label>
            <select
              id="pacienteId"
              name="pacienteId"
              value={filtros.pacienteId}
              onChange={handleFiltroChange}
              className="form-input"
            >
              <option value="">Todos os pacientes</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filtros.status}
              onChange={handleFiltroChange}
              className="form-input"
            >
              <option value="">Todos os status</option>
              <option value="Agendado">Agendado</option>
              <option value="Realizado">Realizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dataInicio" className="form-label">
              Data Inicial
            </label>
            <input
              type="date"
              id="dataInicio"
              name="dataInicio"
              value={filtros.dataInicio}
              onChange={handleFiltroChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataFim" className="form-label">
              Data Final
            </label>
            <input
              type="date"
              id="dataFim"
              name="dataFim"
              value={filtros.dataFim}
              onChange={handleFiltroChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : consultas.length === 0 ? (
        <EmptyState
          title="Nenhuma consulta encontrada"
          description="Comece agendando uma nova consulta no sistema."
          icon={<Calendar className="h-12 w-12 text-gray-400" />}
          action={
            <Link href="/consultas/novo" className="btn-primary">
              Agendar Consulta
            </Link>
          }
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Paciente</th>
                <th className="table-header-cell">Data e Hora</th>
                <th className="table-header-cell">Tipo</th>
                <th className="table-header-cell">Profissional</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {consultas.map((consulta) => (
                <tr key={consulta.id} className="table-row">
                  <td className="table-cell font-medium text-gray-900">{consulta.nome_paciente}</td>
                  <td className="table-cell">
                    {new Date(consulta.appointment_date).toLocaleDateString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="table-cell">{consulta.appointment_type}</td>
                  <td className="table-cell">{consulta.professional}</td>
                  <td className="table-cell">
                    <StatusBadge status={consulta.status} type="appointment" />
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/consultas/${consulta.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(consulta.id)} className="text-red-600 hover:text-red-800">
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
