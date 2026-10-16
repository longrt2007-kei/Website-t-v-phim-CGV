import demoDb from '../data/demo-db.json'

// Authentication and ticket records are stored by the shared Render API so
// customers can use the same account across devices. Local Vite still proxies
// through its /api route to the API started by CHAY_WEB.bat.
const LOCAL_API_BASE_URL = '/api'
const HOSTED_API_BASE_URL = 'https://cgv-cinemas-api.onrender.com'
export const API_BASE_URL = import.meta.env.DEV ? LOCAL_API_BASE_URL : HOSTED_API_BASE_URL
export const apiUrl = (path) => `${API_BASE_URL}${String(path).startsWith('/') ? path : `/${path}`}`

// The school-project admin demo stores its editable catalogue in this browser.
// It deliberately needs no hosted API; changes stay on the current device.
const STORAGE_PREFIX = 'cgv_demo_admin_'

function readCollection(resource) {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${resource}`)
    if (saved !== null) return JSON.parse(saved)
  } catch {}
  return structuredClone(demoDb[resource] || [])
}

function writeCollection(resource, rows) {
  localStorage.setItem(`${STORAGE_PREFIX}${resource}`, JSON.stringify(rows))
}

export async function apiRequest(resource, path = '', options = {}) {
  if (!Object.hasOwn(demoDb, resource)) throw new Error(`Không tìm thấy mục ${resource}.`)
  const rows = readCollection(resource)
  const id = decodeURIComponent(String(path).split('?')[0].replace(/^\//, ''))
  const method = String(options.method || 'GET').toUpperCase()

  if (method === 'GET') return id ? rows.find((row) => String(row.id) === id) || null : rows
  if (method === 'POST') {
    const record = JSON.parse(options.body || '{}')
    if (record.id == null) record.id = `${resource}-${Date.now()}`
    rows.push(record)
    writeCollection(resource, rows)
    return record
  }
  const index = rows.findIndex((row) => String(row.id) === id)
  if (index < 0) throw new Error('Không tìm thấy dữ liệu cần cập nhật.')
  if (method === 'PATCH' || method === 'PUT') {
    rows[index] = { ...rows[index], ...JSON.parse(options.body || '{}') }
    writeCollection(resource, rows)
    return rows[index]
  }
  if (method === 'DELETE') {
    const [removed] = rows.splice(index, 1)
    writeCollection(resource, rows)
    return removed
  }
  throw new Error(`Phương thức ${method} chưa được hỗ trợ.`)
}
