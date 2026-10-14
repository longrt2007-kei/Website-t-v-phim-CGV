import './auth-pages.css'
import { getCachedUser, logoutUser, refreshCurrentUser, requireAuth, updateCurrentUser } from './shared/auth.js'

if (requireAuth()) init()

async function init() {
  const app = document.querySelector('#app')
  let user = getCachedUser()
  try {
    user = (await refreshCurrentUser()) || user
  } catch {}

  const name = user?.name || '', email = user?.email || '', phone = user?.phone || ''
  const initial = (name.trim()[0] || 'C').toUpperCase()
  app.innerHTML = `<main class="account-shell">
    <div class="account-top">
      <a class="brand-logo" href="/trangchu.html">CGV<span>CINEMAS</span></a>
      <a href="/trangchu.html">← Trang chủ</a>
    </div>
    <section class="account-card">
      <div class="account-head">
        <div class="account-avatar" id="accountAvatar">${escapeHtml(initial)}</div>
        <div><h1 id="accountHeading">${escapeHtml(name || 'Thành viên CGV')}</h1><p id="accountEmail">${escapeHtml(email)}</p></div>
      </div>
      <form id="profileForm" novalidate>
        <div class="account-grid">
          <label class="account-field"><small>Họ và tên</small><input name="name" value="${escapeHtml(name)}" required minlength="2" maxlength="100" autocomplete="name"></label>
          <label class="account-field"><small>Email</small><input name="email" type="email" value="${escapeHtml(email)}" required maxlength="254" autocomplete="email"></label>
          <label class="account-field"><small>Số điện thoại</small><input name="phone" type="tel" value="${escapeHtml(phone)}" required pattern="(?:\\+?84|0)(?:\\d){9,10}" title="Nhập số điện thoại Việt Nam hợp lệ" autocomplete="tel"></label>
          <div class="account-field"><small>Loại tài khoản</small><strong>Thành viên</strong></div>
          <div class="account-field"><small>Ngày tham gia</small><strong>${user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}</strong></div>
        </div>
        <p id="profileMessage" class="profile-message" role="status" aria-live="polite"></p>
        <div class="account-actions">
          <button type="submit" id="saveProfile">Lưu thay đổi</button>
          <a href="/ve-cua-toi.html">Vé của tôi</a>
          <a href="/phim.html">Khám phá phim</a>
          <button type="button" class="danger" id="logout">Đăng xuất</button>
        </div>
      </form>
    </section>
  </main>`

  const form = document.querySelector('#profileForm')
  const message = document.querySelector('#profileMessage')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    message.textContent = ''
    message.className = 'profile-message'
    if (!form.reportValidity()) return
    const button = document.querySelector('#saveProfile')
    button.disabled = true
    try {
      user = await updateCurrentUser(Object.fromEntries(new FormData(form)))
      document.querySelector('#accountHeading').textContent = user.name
      document.querySelector('#accountEmail').textContent = user.email
      document.querySelector('#accountAvatar').textContent = (user.name.trim()[0] || 'C').toUpperCase()
      message.textContent = 'Đã lưu thông tin cá nhân.'
      message.classList.add('success')
    } catch (error) {
      message.textContent = error.message || 'Không thể lưu thông tin. Vui lòng thử lại.'
      message.classList.add('error')
    } finally {
      button.disabled = false
    }
  })
  document.querySelector('#logout').addEventListener('click', () => {
    logoutUser()
    location.href = '/trangchu.html'
  })
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}
