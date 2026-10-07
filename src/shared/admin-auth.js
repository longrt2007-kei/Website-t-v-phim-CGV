const ADMIN_KEY = 'cgv_admin_session_v1'
const ADMIN_USER_KEY = 'cgv_admin_user_v1'

export function isAdminAuthenticated(){
  return localStorage.getItem(ADMIN_KEY) === '1'
}

export function setAdminSession(username = 'cgvteam'){
  localStorage.setItem(ADMIN_KEY, '1')
  localStorage.setItem(ADMIN_USER_KEY, username)
}

export function clearAdminSession(){
  localStorage.removeItem(ADMIN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
}

export function requireAdmin(){
  if (isAdminAuthenticated()) return true
  clearAdminSession()
  const returnPath = `${location.pathname}${location.search}${location.hash}`
  location.replace(`/trangchu.html?admin=login&return=${encodeURIComponent(returnPath)}`)
  return false
}
