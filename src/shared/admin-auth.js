const ADMIN_USERNAME = 'cgvteam'
const ADMIN_PASSWORD = '2007'
const ADMIN_SESSION_KEY = 'cgv_admin_session_v1'
const ADMIN_USER_KEY = 'cgv_admin_user_v1'

export function getAdminToken() {
  return isAdminAuthenticated() ? 'demo-admin-session' : ''
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
}

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'signed-in'
}

export async function loginAdmin(username, password) {
  clearAdminSession()
  if (String(username).trim().toLowerCase() !== ADMIN_USERNAME || String(password) !== ADMIN_PASSWORD) {
    throw new Error('Tài khoản hoặc mật khẩu admin chưa đúng.')
  }
  localStorage.setItem(ADMIN_SESSION_KEY, 'signed-in')
  localStorage.setItem(
    ADMIN_USER_KEY,
    JSON.stringify({ username: ADMIN_USERNAME, name: 'Quản trị viên', role: 'admin' }),
  )
  return getAdminUser()
}

export function requireAdmin() {
  if (isAdminAuthenticated()) return true
  const returnPath = `${location.pathname}${location.search}${location.hash}`
  location.replace(`/admin-login.html?return=${encodeURIComponent(returnPath)}`)
  return false
}

export function adminReturnUrl() {
  const target = new URLSearchParams(location.search).get('return')
  return target?.startsWith('/admin-') ? target : '/admin-phim.html'
}
