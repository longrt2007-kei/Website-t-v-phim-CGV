// Các hàm xác thực khách hàng: gọi API, lưu phiên JWT và quản lý chuyển hướng.
import { apiUrl } from './api.js'
import { syncLocalBookings } from './booking-storage.js'

const TOKEN_KEY = 'cgv_auth_token_v1'
const USER_KEY = 'cgv_auth_user_v1'

// Đọc JSON an toàn, trả về giá trị dự phòng nếu dữ liệu lưu bị lỗi.
const parseJson = (value, fallback = null) => {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

// Chỉ giữ những trường hồ sơ cần dùng trong giao diện.
const normalizeUser = (user) =>
  user
    ? {
        id: user.id,
        name: user.name || user.fullName || '',
        email: user.email || '',
        role: user.role || 'customer',
        createdAt: user.createdAt || '',
      }
    : null

// Lấy JWT đang lưu để gửi kèm các yêu cầu cần xác thực.
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}
// Lấy bản hồ sơ tài khoản đã lưu cục bộ.
export function getCachedUser() {
  return parseJson(localStorage.getItem(USER_KEY), null)
}

// Đọc payload JWT để lấy ID, email và thời hạn phiên.
export function decodeToken(token = getToken()) {
  if (!token) return null
  try {
    const part = token.split('.')[1]
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    return JSON.parse(decodeURIComponent(escape(atob(padded))))
  } catch {
    return null
  }
}

// Kiểm tra phiên đăng nhập còn token hợp lệ và chưa hết hạn.
export function isAuthenticated() {
  const payload = decodeToken()
  if (!payload) return false
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    logoutUser(false)
    return false
  }
  return true
}

// Lưu JWT/hồ sơ và gắn vé khách chưa có chủ sở hữu với tài khoản vừa đăng nhập.
export function setSession(accessToken, user = null) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  const payload = decodeToken(accessToken)
  const merged = normalizeUser(user) || {
    id: payload?.sub,
    name: '',
    email: payload?.email || '',
    role: 'customer',
    createdAt: '',
  }
  if (merged) {
    localStorage.setItem(USER_KEY, JSON.stringify(merged))
    try {
      const bookings = JSON.parse(localStorage.getItem('cgv_bookings_v1') || '[]')
      let changed = false
      for (const booking of bookings) {
        if (!booking.userId && merged.id) {
          booking.userId = merged.id
          booking.userEmail = merged.email || ''
          changed = true
        }
      }
      if (changed) localStorage.setItem('cgv_bookings_v1', JSON.stringify(bookings))
    } catch {}
  }
  window.dispatchEvent(new CustomEvent('cgv-auth-change'))
  return merged
}

// Xóa phiên khách khỏi localStorage và báo các thành phần giao diện cập nhật.
export function logoutUser(emit = true) {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  if (emit) window.dispatchEvent(new CustomEvent('cgv-auth-change'))
}

// Tạo header Authorization để gửi yêu cầu xác thực tới API.
export function authHeaders(extra = {}) {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

// Gửi yêu cầu xác thực và chuyển lỗi mạng/API thành thông báo dễ hiểu.
async function authRequest(path, options = {}) {
  let response
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      headers: authHeaders(options.headers || {}),
    })
  } catch {
    throw new Error('Không kết nối được máy chủ. Vui lòng thử lại sau.')
  }
  let responseText = ''
  let data = null
  try {
    responseText = await response.text()
    data = responseText ? JSON.parse(responseText) : null
  } catch {
    data = null
  }
  if (!response.ok) {
    const plainText = responseText.trim()
    const rawMessage =
      (typeof data === 'string' ? data : data?.message || data?.error) ||
      (plainText && !/^<!doctype html|^<html/i.test(plainText) ? plainText : '')
    const message = rawMessage ||
      (/proxy error|ECONNREFUSED|ECONNRESET/i.test(responseText)
        ? 'Máy chủ đăng nhập local chưa chạy. Hãy mở CHAY_WEB.bat để khởi động API.'
        : `Máy chủ đăng nhập trả lỗi HTTP ${response.status}. Hãy thử lại sau hoặc kiểm tra API.`)
    throw new Error(message)
  }
  return data
}

// Tạo tài khoản khách mới, lưu phiên trả về và gắn vé cục bộ với tài khoản.
export async function registerUser({ name, email, password }) {
  const result = await authRequest('/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      fullName: name,
      email: email.trim().toLowerCase(),
      password,
      role: 'customer',
      createdAt: new Date().toISOString(),
    }),
  })
  if (!result?.accessToken) throw new Error('Máy chủ không trả về phiên đăng nhập.')
  const user = setSession(result.accessToken, result.user || null)
  const savedUser = result.user ? user : await refreshCurrentUser()
  await syncLocalBookings(savedUser).catch(() => {})
  return savedUser
}

// Đăng nhập khách bằng email/mật khẩu và lưu phiên JWT.
export async function loginUser({ email, password }) {
  const result = await authRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  })
  if (!result?.accessToken) throw new Error('Máy chủ không trả về phiên đăng nhập.')
  const user = setSession(result.accessToken, result.user || null)
  const savedUser = result.user ? user : await refreshCurrentUser()
  await syncLocalBookings(savedUser).catch(() => {})
  return savedUser
}

// Tải lại hồ sơ từ API; nếu API tạm lỗi thì dùng hồ sơ đã cache.
export async function refreshCurrentUser() {
  if (!isAuthenticated()) return null
  const payload = decodeToken()
  if (!payload?.sub) return getCachedUser()
  try {
    let user
    try {
      const me = await authRequest('/me')
      user = me?.user || me
    } catch {
      user = await authRequest(`/users/${payload.sub}`)
    }
    const safe = normalizeUser(user)
    localStorage.setItem(USER_KEY, JSON.stringify(safe))
    window.dispatchEvent(new CustomEvent('cgv-auth-change'))
    return safe
  } catch {
    const fallback = getCachedUser() || { id: payload.sub, email: payload.email || '' }
    localStorage.setItem(USER_KEY, JSON.stringify(fallback))
    return fallback
  }
}

// Đọc trang đích sau đăng nhập, chỉ chấp nhận đường dẫn nội bộ.
export function returnUrl(defaultUrl = '/trangchu.html') {
  const params = new URLSearchParams(location.search)
  const target = params.get('return')
  return target && target.startsWith('/') ? target : defaultUrl
}

// Tạo URL đăng nhập và đính kèm trang cần quay lại.
export function loginUrl(target = location.pathname + location.search + location.hash) {
  return `/dang-nhap.html?return=${encodeURIComponent(target)}`
}

// Bảo vệ trang riêng tư; chuyển khách chưa đăng nhập tới trang đăng nhập.
export function requireAuth(target = location.pathname + location.search + location.hash) {
  if (isAuthenticated()) return true
  location.replace(loginUrl(target))
  return false
}
