const configuredApiUrl = String(import.meta.env.VITE_API_URL || '')
  .trim()
  .replace(/\/+$/, '')
const productionApiUrl = 'https://cgv-cinemas-api.onrender.com'

export const API_BASE_URL = configuredApiUrl || (import.meta.env.PROD ? productionApiUrl : '/api')
export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

export async function apiRequest(resource, path = '', options = {}) {
  const adminToken = localStorage.getItem('cgv_admin_token_v1') || ''
  const response = await fetch(apiUrl(`/${resource}${path}`), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      ...options.headers,
    },
  })
  if (!response.ok) throw new Error(`Yêu cầu thất bại (${response.status}).`)
  return response.status === 204 ? null : response.json()
}
