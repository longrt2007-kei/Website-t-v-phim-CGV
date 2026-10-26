// Quản lý đăng nhập admin: ưu tiên phiên API, có chế độ demo lưu cục bộ.
import { apiUrl } from './api.js'

const ADMIN_USERNAME = 'cgvteam'
const ADMIN_PASSWORD = '2007'
const ADMIN_SESSION_KEY = 'cgv_admin_session_v1'
const ADMIN_USER_KEY = 'cgv_admin_user_v1'
const ADMIN_LOCAL_ONLY_KEY = 'cgv_admin_local_only_v1'

// Lấy token admin để gửi các yêu cầu quản trị cần xác thực.
export function getAdminToken() {
  return isAdminAuthenticated() ? localStorage.getItem('cgv_admin_token_v1') || '' : ''
}

// Lấy hồ sơ admin đang đăng nhập từ localStorage.
export function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || 'null')
  } catch {
    return null
  }
}

// Xóa token, hồ sơ và cờ phiên admin khỏi trình duyệt.
export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  localStorage.removeItem('cgv_admin_token_v1')
  localStorage.removeItem(ADMIN_LOCAL_ONLY_KEY)
}

// Kiểm tra cờ phiên admin còn được lưu hay không.
export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'signed-in'
}

// Thử đăng nhập qua API; nếu API thiếu endpoint demo thì dùng tài khoản demo cục bộ.
export async function loginAdmin(username, password) {
  clearAdminSession()
  const cleanUsername = String(username).trim().toLowerCase()
  const cleanPassword = String(password)
  let apiAvailable = false
  try {
    const response = await fetch(apiUrl('/admin-demo-login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUsername, password: cleanPassword }),
    })
    apiAvailable = response.status !== 404
    const result = await response.json().catch(() => ({}))
    if (response.ok && result.accessToken) {
      localStorage.setItem('cgv_admin_token_v1', result.accessToken)
      localStorage.removeItem(ADMIN_LOCAL_ONLY_KEY)
      localStorage.setItem(ADMIN_SESSION_KEY, 'signed-in')
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(result.user || { username: cleanUsername, name: 'Quản trị viên', role: 'admin' }))
      return getAdminUser()
    }
    if (apiAvailable) throw new Error(result.message || 'Không đăng nhập được vào API quản trị.')
  } catch (error) {
    if (apiAvailable) throw error
  }
  if (cleanUsername !== ADMIN_USERNAME || cleanPassword !== ADMIN_PASSWORD) {
    throw new Error('Tài khoản hoặc mật khẩu admin chưa đúng.')
  }
  localStorage.setItem(ADMIN_LOCAL_ONLY_KEY, '1')
  localStorage.setItem(ADMIN_SESSION_KEY, 'signed-in')
  localStorage.setItem(
    ADMIN_USER_KEY,
    JSON.stringify({ username: ADMIN_USERNAME, name: 'Quản trị viên', role: 'admin' }),
  )
  return getAdminUser()
}

// Chỉ cho vào trang quản trị khi có phiên API hoặc phiên demo hợp lệ.
export function requireAdmin() {
  if (isAdminAuthenticated()) {
    const hasApiSession = Boolean(localStorage.getItem('cgv_admin_token_v1'))
    const localOnly = localStorage.getItem(ADMIN_LOCAL_ONLY_KEY) === '1'
    if (hasApiSession || localOnly) return true
    clearAdminSession()
  }
  const returnPath = `${location.pathname}${location.search}${location.hash}`
  location.replace(`/dang-nhap-quan-tri.html?return=${encodeURIComponent(returnPath)}`)
  return false
}

// Chọn trang quản trị cần mở sau khi đăng nhập.
export function adminReturnUrl() {
  const target = new URLSearchParams(location.search).get('return')
  return target?.startsWith('/quan-ly-') ? target : '/quan-ly-phim.html'
}
