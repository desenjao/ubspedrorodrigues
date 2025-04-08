"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, AlertTriangle, Users, Baby, Activity, FileText } from "lucide-react"
import PageTitle from "@/components/page-title"
import Loading from "@/components/loading"
import { getRelatorioResumo, getRelatorioAlertas } from "@/lib/api"

export default function RelatoriosPage() {
  const [resumo, setResumo] = useState<any>(null)
  const [alertas, setAlertas] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true)
        const [resumoData, alertasData] = await Promise.all([getRelatorioResumo(), getRelatorioAlertas()])

        setResumo(resumoData)
        setAlertas(alertasData)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Erro ao carregar relatórios")
      } finally {
        setLoading(false)
      }
    }

    fetchDados()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="container mx-auto">
        <PageTitle title="Relatórios" />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <PageTitle title="Relatórios e Indicadores" />

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Resumo Geral
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="card bg-blue-50 border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total de Pacientes</p>
                <p className="text-2xl font-bold">{resumo.total_pacientes}</p>
              </div>
            </div>
          </div>

          <div className="card bg-purple-50 border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Baby className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Gestantes</p>
                <p className="text-2xl font-bold">{resumo.pacientes_gestantes}</p>
              </div>
            </div>
          </div>

          <div className="card bg-red-50 border border-red-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Hipertensos</p>
                <p className="text-2xl font-bold">{resumo.pacientes_hipertensos}</p>
              </div>
            </div>
          </div>

          <div className="card bg-yellow-50 border border-yellow-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Diabéticos</p>
                <p className="text-2xl font-bold">{resumo.pacientes_diabeticos}</p>
              </div>
            </div>
          </div>

          <div className="card bg-green-50 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Exames Pendentes</p>
                <p className="text-2xl font-bold">{resumo.exames_pendentes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Alertas
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gestantes de Alto Risco */}
          <div className="card">
            <h3 className="text-lg font-medium mb-3 text-purple-700">Gestantes de Alto Risco</h3>

            {alertas.gestantes_alto_risco.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma gestante de alto risco encontrada.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {alertas.gestantes_alto_risco.map((gestante: any) => (
                  <li key={gestante.id} className="py-2">
                    <Link href={`/gestantes/${gestante.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {gestante.nome_paciente}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pacientes com Pressão Alta */}
          <div className="card">
            <h3 className="text-lg font-medium mb-3 text-red-700">Pressão Arterial Elevada</h3>

            {alertas.pressao_alta.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum paciente com pressão arterial elevada.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {alertas.pressao_alta.map((registro: any) => (
                  <li key={registro.id} className="py-2">
                    <Link
                      href={`/cronicos/${registro.chronic_monitoring_id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {registro.nome_paciente}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {registro.systolic}/{registro.diastolic} mmHg em{" "}
                      {new Date(registro.measurement_date).toLocaleDateString("pt-BR")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pacientes com Glicemia Alta */}
          <div className="card">
            <h3 className="text-lg font-medium mb-3 text-yellow-700">Glicemia Elevada</h3>

            {alertas.glicemia_alta.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum paciente com glicemia elevada.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {alertas.glicemia_alta.map((registro: any) => (
                  <li key={registro.id} className="py-2">
                    <Link
                      href={`/cronicos/${registro.chronic_monitoring_id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {registro.nome_paciente}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {registro.glucose_level} mg/dL ({registro.measurement_type}) em{" "}
                      {new Date(registro.measurement_date).toLocaleDateString("pt-BR")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
