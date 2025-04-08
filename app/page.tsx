import Link from "next/link"
import { UserRound, FileText, Baby, Activity, Calendar, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Sistema de Gestão de Saúde</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserRound className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Módulo de Pacientes</h2>
              <p className="text-sm text-gray-500">Gerenciamento de cadastros</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Cadastro completo de pacientes com informações pessoais, endereço, contato e vinculação a grupos de
            acompanhamento.
          </p>
          <Link href="/pacientes" className="btn-primary block text-center">
            Acessar
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Módulo de Exames</h2>
              <p className="text-sm text-gray-500">Gerenciamento de exames médicos</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Cadastro e acompanhamento de exames, com status, resultados e filtros por tipo ou paciente.
          </p>
          <Link href="/exames" className="btn-primary block text-center">
            Acessar
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Baby className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Módulo de Gestantes</h2>
              <p className="text-sm text-gray-500">Acompanhamento pré-natal</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Monitoramento completo de gestantes, com datas importantes, classificação de risco e acompanhamento de
            exames obrigatórios.
          </p>
          <Link href="/gestantes" className="btn-primary block text-center">
            Acessar
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Hipertensos e Diabéticos</h2>
              <p className="text-sm text-gray-500">Monitoramento de condições crônicas</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Acompanhamento de pressão arterial, glicemia, medicamentos e adesão ao tratamento.
          </p>
          <Link href="/cronicos" className="btn-primary block text-center">
            Acessar
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Consultas</h2>
              <p className="text-sm text-gray-500">Agendamento e histórico</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Agendamento de consultas, registro de atendimentos e histórico de consultas por paciente.
          </p>
          <Link href="/consultas" className="btn-primary block text-center">
            Acessar
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Relatórios</h2>
              <p className="text-sm text-gray-500">Estatísticas e indicadores</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Visualização de dados consolidados, alertas de pacientes com acompanhamento pendente e exportação de
            relatórios.
          </p>
          <Link href="/relatorios" className="btn-primary block text-center">
            Acessar
          </Link>
        </div>
      </div>
    </div>
  )
}
