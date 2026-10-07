export async function apiRequest(resource, path = '', options = {}) {
  const response = await fetch(`/api/${resource}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!response.ok) throw new Error(`Yêu cầu thất bại (${response.status}).`)
  return response.status === 204 ? null : response.json()
}
