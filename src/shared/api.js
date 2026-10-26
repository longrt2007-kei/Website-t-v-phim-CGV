import demoDb from '../data/demo-db.json'

// Tài khoản và vé được lưu trên API Render để dùng chung giữa nhiều thiết bị.
// Khi chạy local, Vite chuyển tiếp đường dẫn /api tới máy chủ mở bằng CHAY_WEB.
const LOCAL_API_BASE_URL = '/api'
const HOSTED_API_BASE_URL = 'https://cgv-cinemas-api.onrender.com'
// Chọn API local khi phát triển và API Render khi website chạy production.
export const API_BASE_URL = import.meta.env.DEV ? LOCAL_API_BASE_URL : HOSTED_API_BASE_URL
// Ghép đường dẫn endpoint với địa chỉ API đang dùng.
export const apiUrl = (path) => `${API_BASE_URL}${String(path).startsWith('/') ? path : `/${path}`}`

// Danh mục quản trị của bản demo được lưu trong trình duyệt hiện tại.
// Các thay đổi phim/rạp/suất chiếu không cần máy chủ và không đồng bộ thiết bị.
const STORAGE_PREFIX = 'cgv_demo_admin_'

// Đọc dữ liệu quản trị trong localStorage, hoặc lấy bản mẫu khi chưa có dữ liệu lưu.
function readCollection(resource) {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${resource}`)
    if (saved !== null) return JSON.parse(saved)
  } catch {}
  return structuredClone(demoDb[resource] || [])
}

// Ghi toàn bộ một nhóm dữ liệu quản trị trở lại localStorage.
function writeCollection(resource, rows) {
  localStorage.setItem(`${STORAGE_PREFIX}${resource}`, JSON.stringify(rows))
}

// Thực hiện CRUD cục bộ cho phim, rạp và suất chiếu mà không cần máy chủ.
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
