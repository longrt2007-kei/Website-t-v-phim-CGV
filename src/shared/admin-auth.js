import { apiUrl } from './api.js'

const ADMIN_USERNAME = 'cgvteam'
const ADMIN_PASSWORD = '2007'
const ADMIN_SESSION_KEY = 'cgv_admin_session_v1'
const ADMIN_USER_KEY = 'cgv_admin_user_v1'
const ADMIN_LOCAL_ONLY_KEY = 'cgv_admin_local_only_v1'

export function getAdminToken() {
  return isAdminAuthenticated() ? localStorage.getItem('cgv_admin_token_v1') || '' : ''
}

export function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  localStorage.removeItem('cgv_admin_token_v1')
  localStorage.removeItem(ADMIN_LOCAL_ONLY_KEY)
}

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'signed-in'
}

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

export function adminReturnUrl() {
  const target = new URLSearchParams(location.search).get('return')
  return target?.startsWith('/quan-ly-') ? target : '/quan-ly-phim.html'
}
