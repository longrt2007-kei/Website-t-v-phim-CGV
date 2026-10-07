import { apiUrl } from './api.js'

const ADMIN_TOKEN_KEY = 'cgv_admin_token_v1'
const ADMIN_USER_KEY = 'cgv_admin_user_v1'

const parseJson = (value, fallback = null) => {
  try { return JSON.parse(value) } catch { return fallback }
}

const decodeToken = token => {
  if (!token) return null
  try {
    const part = token.split('.')[1]
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4)
    return JSON.parse(decodeURIComponent(escape(atob(padded))))
  } catch { return null }
}

export function getAdminToken(){ return localStorage.getItem(ADMIN_TOKEN_KEY) || '' }
export function getAdminUser(){ return parseJson(localStorage.getItem(ADMIN_USER_KEY), null) }

export function clearAdminSession(){
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
  localStorage.removeItem('cgv_admin_session_v1')
}

export function isAdminAuthenticated(){
  const payload = decodeToken(getAdminToken())
  const user = getAdminUser()
  if (!payload || payload.exp && Date.now() >= payload.exp * 1000 || user?.role !== 'admin') {
    clearAdminSession()
    return false
  }
  return true
}

const readResponse = async response => {
  let data = null
  try { data = await response.json() } catch {}
  if (!response.ok) {
    const message = (typeof data === 'string' ? data : data?.message || data?.error) || `Đăng nhập thất bại (${response.status}).`
    throw new Error(message)
  }
  return data
}

export async function loginAdmin(username, password){
  clearAdminSession()
  let response
  try {
    response = await fetch(apiUrl('/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `${username.trim().toLowerCase()}@admin.local`, password }),
    })
  } catch {
    throw new Error('Không kết nối được máy chủ. Vui lòng thử lại sau.')
  }
  const result = await readResponse(response)
  const token = result.accessToken
  if (!token) throw new Error('Máy chủ không trả về phiên đăng nhập.')

  let user = result.user || null
  if (!user?.role) {
    const meResponse = await fetch(apiUrl('/me'), { headers: { Authorization: `Bearer ${token}` } })
    const me = await readResponse(meResponse)
    user = me?.user || me
  }
  if (user?.role !== 'admin') throw new Error('Tài khoản này không có quyền quản trị.')

  localStorage.setItem(ADMIN_TOKEN_KEY, token)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ id: user.id, username: user.username || username.trim(), name: user.fullName || user.name || 'Quản trị viên', role: 'admin' }))
  return user
}

export function requireAdmin(){
  if (isAdminAuthenticated()) return true
  const returnPath = `${location.pathname}${location.search}${location.hash}`
  location.replace(`/admin-login.html?return=${encodeURIComponent(returnPath)}`)
  return false
}

export function adminReturnUrl(){
  const target = new URLSearchParams(location.search).get('return')
  return target?.startsWith('/admin-') ? target : '/admin-phim.html'
}
