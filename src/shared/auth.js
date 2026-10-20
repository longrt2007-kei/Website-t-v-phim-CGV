import { apiUrl } from './api.js'

const TOKEN_KEY = 'cgv_auth_token_v1'
const USER_KEY = 'cgv_auth_user_v1'

const parseJson = (value, fallback = null) => {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

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

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getCachedUser() {
  return parseJson(localStorage.getItem(USER_KEY), null)
}

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

export function isAuthenticated() {
  const payload = decodeToken()
  if (!payload) return false
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    logoutUser(false)
    return false
  }
  return true
}

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

export function logoutUser(emit = true) {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  if (emit) window.dispatchEvent(new CustomEvent('cgv-auth-change'))
}

export function authHeaders(extra = {}) {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function authRequest(path, options = {}) {
  let response
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      headers: authHeaders(options.headers || {}),
    })
  } catch {
    throw new Error('Không kết nối được máy chủ. Vui lòng kiểm tra API và thử lại.')
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
        ? 'Máy chủ đăng nhập local chưa chạy. Hãy khởi động API rồi thử lại.'
        : `Máy chủ đăng nhập trả lỗi HTTP ${response.status}. Vui lòng thử lại sau.`)
    throw new Error(message)
  }
  return data
}

function apiErrorMessage(message, status, action) {
  if (status === 409 || /email already exists|email.*(already|exists|taken)/i.test(message)) {
    return 'Email này đã được đăng ký.'
  }
  if (/cannot find user|incorrect password|invalid password/i.test(message)) {
    return 'Email hoặc mật khẩu chưa đúng.'
  }
  if (status === 400) return 'Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.'
  return message || `Không thể ${action} lúc này. Vui lòng thử lại sau.`
}

async function submitCredentials(path, payload, action) {
  try {
    const result = await authRequest(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!result?.accessToken) throw new Error('Máy chủ không trả về phiên đăng nhập.')
    const user = setSession(result.accessToken, result.user || null)
    return result.user ? user : refreshCurrentUser()
  } catch (error) {
    error.message = apiErrorMessage(error.message, error.status, action)
    throw error
  }
}

export function registerUser({ name, email, password }) {
  const cleanName = String(name || '').trim()
  const cleanEmail = String(email || '').trim().toLowerCase()
  if (cleanName.length < 2) throw new Error('Vui lòng nhập họ tên có ít nhất 2 ký tự.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Vui lòng nhập email hợp lệ.')
  if (String(password || '').length < 6) throw new Error('Mật khẩu cần có ít nhất 6 ký tự.')
  return submitCredentials('/register', {
    name: cleanName,
    fullName: cleanName,
    email: cleanEmail,
    password,
    role: 'customer',
    createdAt: new Date().toISOString(),
  }, 'đăng ký')
}

export function loginUser({ email, password }) {
  const cleanEmail = String(email || '').trim().toLowerCase()
  if (!cleanEmail || !password) throw new Error('Vui lòng nhập email và mật khẩu.')
  return submitCredentials('/login', { email: cleanEmail, password }, 'đăng nhập')
}

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

export function returnUrl(defaultUrl = '/trangchu.html') {
  const params = new URLSearchParams(location.search)
  const target = params.get('return')
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return defaultUrl
  }
  try {
    const parsed = new URL(target, location.origin)
    return parsed.origin === location.origin ? `${parsed.pathname}${parsed.search}${parsed.hash}` : defaultUrl
  } catch {
    return defaultUrl
  }
}

export function loginUrl(target = location.pathname + location.search + location.hash) {
  return `/dang-nhap.html?return=${encodeURIComponent(target)}`
}

export function requireAuth(target = location.pathname + location.search + location.hash) {
  if (isAuthenticated()) return true
  location.replace(loginUrl(target))
  return false
}
