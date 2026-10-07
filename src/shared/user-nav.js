import { getCachedUser, isAuthenticated, logoutUser } from './auth.js'

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

export function mountUserNav(){
  document.querySelectorAll('[data-user-nav]').forEach(el => el.remove())
  const logged = isAuthenticated()
  const user = getCachedUser()
  const firstName = user?.name?.trim()?.split(/\s+/).slice(-1)[0] || 'Tài khoản'
  const target = document.querySelector('.header-actions') || document.querySelector('.simple-nav nav')
  if(!target) return
  if(logged){
    const wrap = document.createElement('span')
    wrap.dataset.userNav = 'true'
    wrap.className = target.classList.contains('header-actions') ? 'user-nav-wrap' : 'simple-user-nav'
    wrap.innerHTML = `<a class="user-account-link" href="/tai-khoan.html">${esc(firstName)}</a><button type="button" class="user-logout-btn" data-logout>Đăng xuất</button>`
    target.append(wrap)
  }else{
    const link = document.createElement('a')
    link.dataset.userNav = 'true'
    link.className = target.classList.contains('header-actions') ? 'login-btn user-account-link' : 'user-account-link'
    link.href = '/dang-nhap.html'
    link.textContent = 'ĐĂNG NHẬP'
    target.append(link)
  }
}

document.addEventListener('click', e => {
  if(!e.target.closest('[data-logout]')) return
  logoutUser()
  location.href = '/trangchu.html'
})

window.addEventListener('cgv-auth-change', mountUserNav)
