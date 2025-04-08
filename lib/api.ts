const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://exames-coronel2d-2025.vercel.app/api"

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.erro || "Ocorreu um erro na requisição")
  }

  return response.json()
}

// Funções específicas para cada entidade

// Pacientes
export async function getPacientes(query?: string) {
  const queryParams = query ? `?consulta=${encodeURIComponent(query)}` : ""
  return fetchAPI(`/pacientes${queryParams}`)
}

export async function getPaciente(id: string) {
  return fetchAPI(`/pacientes/${id}`)
}

export async function createPaciente(data: any) {
  return fetchAPI("/pacientes", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updatePaciente(id: string, data: any) {
  return fetchAPI(`/pacientes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deletePaciente(id: string) {
  return fetchAPI(`/pacientes/${id}`, {
    method: "DELETE",
  })
}

// Exames
export async function getExames(filters?: { pacienteId?: string; status?: string; tipoExame?: string }) {
  const params = new URLSearchParams()

  if (filters?.pacienteId) {
    params.append("pacienteId", filters.pacienteId)
  }

  if (filters?.status) {
    params.append("status", filters.status)
  }

  if (filters?.tipoExame) {
    params.append("tipoExame", filters.tipoExame)
  }

  const queryString = params.toString() ? `?${params.toString()}` : ""
  return fetchAPI(`/exames${queryString}`)
}

export async function getExame(id: string) {
  return fetchAPI(`/exames/${id}`)
}

export async function createExame(data: any) {
  return fetchAPI("/exames", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateExame(id: string, data: any) {
  return fetchAPI(`/exames/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteExame(id: string) {
  return fetchAPI(`/exames/${id}`, {
    method: "DELETE",
  })
}

// Gestantes
export async function getGestantes(pacienteId?: string) {
  const queryParams = pacienteId ? `?pacienteId=${encodeURIComponent(pacienteId)}` : ""
  return fetchAPI(`/gestantes${queryParams}`)
}

export async function getGestante(id: string) {
  return fetchAPI(`/gestantes/${id}`)
}

export async function createGestante(data: any) {
  return fetchAPI("/gestantes", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateGestante(id: string, data: any) {
  return fetchAPI(`/gestantes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function addExameGestante(gestanteId: string, data: any) {
  return fetchAPI(`/gestantes/${gestanteId}/exames`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateExameGestante(exameId: string, data: any) {
  return fetchAPI(`/gestantes/exames/${exameId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// Condições Crônicas
export async function getCronicos(filters?: { pacienteId?: string; tipoCondicao?: string }) {
  const params = new URLSearchParams()

  if (filters?.pacienteId) {
    params.append("pacienteId", filters.pacienteId)
  }

  if (filters?.tipoCondicao) {
    params.append("tipoCondicao", filters.tipoCondicao)
  }

  const queryString = params.toString() ? `?${params.toString()}` : ""
  return fetchAPI(`/cronicos${queryString}`)
}

export async function getCronico(id: string) {
  return fetchAPI(`/cronicos/${id}`)
}

export async function createCronico(data: any) {
  return fetchAPI("/cronicos", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateCronico(id: string, data: any) {
  return fetchAPI(`/cronicos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function getPressaoArterial(cronicoId: string) {
  return fetchAPI(`/cronicos/${cronicoId}/pressao-arterial`)
}

export async function addPressaoArterial(cronicoId: string, data: any) {
  return fetchAPI(`/cronicos/${cronicoId}/pressao-arterial`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getGlicemia(cronicoId: string) {
  return fetchAPI(`/cronicos/${cronicoId}/glicemia`)
}

export async function addGlicemia(cronicoId: string, data: any) {
  return fetchAPI(`/cronicos/${cronicoId}/glicemia`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Consultas
export async function getConsultas(filters?: { pacienteId?: string; status?: string }) {
  const params = new URLSearchParams()

  if (filters?.pacienteId) {
    params.append("pacienteId", filters.pacienteId)
  }

  if (filters?.status) {
    params.append("status", filters.status)
  }

  const queryString = params.toString() ? `?${params.toString()}` : ""
  return fetchAPI(`/consultas${queryString}`)
}

export async function getConsulta(id: string) {
  return fetchAPI(`/consultas/${id}`)
}

export async function createConsulta(data: any) {
  return fetchAPI("/consultas", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateConsulta(id: string, data: any) {
  return fetchAPI(`/consultas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteConsulta(id: string) {
  return fetchAPI(`/consultas/${id}`, {
    method: "DELETE",
  })
}

// Relatórios
export async function getRelatorioResumo() {
  return fetchAPI("/relatorios/resumo")
}

export async function getRelatorioAlertas() {
  return fetchAPI("/relatorios/alertas")
}
