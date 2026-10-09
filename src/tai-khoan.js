import './auth-pages.css'
import { getCachedUser, logoutUser, refreshCurrentUser, requireAuth } from './shared/auth.js'

if (requireAuth()) init()
async function init() {
  const app = document.querySelector('#app')
  let user = getCachedUser()
  try {
    user = (await refreshCurrentUser()) || user
  } catch {}
  const name = user?.name || 'Thành viên CGV',
    email = user?.email || '',
    initial = (name.trim()[0] || 'C').toUpperCase()
  app.innerHTML = `<main class="account-shell">
    <div class="account-top">
    <a class="brand-logo" href="/trangchu.html">CGV<span>CINEMAS</span>
    </a>
    <a href="/trangchu.html">← Trang chủ</a>
    </div>
    <section class="account-card">
    <div class="account-head">
    <div class="account-avatar">${initial}</div>
    <div>
    <h1>${escapeHtml(name)}</h1>
    <p>${escapeHtml(email)}</p>
    </div>
    </div>
    <div class="account-grid">
    <div class="account-field">
    <small>Họ và tên</small>
    <strong>${escapeHtml(name)}</strong>
    </div>
    <div class="account-field">
    <small>Email</small>
    <strong>${escapeHtml(email)}</strong>
    </div>
    <div class="account-field">
    <small>Loại tài khoản</small>
    <strong>Thành viên</strong>
    </div>
    <div class="account-field">
    <small>Ngày tham gia</small>
    <strong>${user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}</strong>
    </div>
    </div>
    <div class="account-actions">
    <a href="/ve-cua-toi.html">Vé của tôi</a>
    <a href="/phim.html">Khám phá phim</a>
    <button class="danger" id="logout">Đăng xuất</button>
    </div>
    </section>
    </main>`
  document.querySelector('#logout').addEventListener('click', () => {
    logoutUser()
    location.href = '/trangchu.html'
  })
}
function escapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
}
