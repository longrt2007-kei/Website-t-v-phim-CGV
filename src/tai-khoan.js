// Trang hồ sơ khách: thông tin tài khoản, thông báo vé và nút đăng xuất.
import './auth-pages.css'
import { getCachedUser, logoutUser, refreshCurrentUser, requireAuth } from './shared/auth.js'
import { loadUserNotifications, markUserNotificationsRead } from './shared/booking-storage.js'

if (requireAuth()) init()
// Lấy hồ sơ và thông báo của tài khoản rồi dựng giao diện trang thành viên.
async function init() {
  const app = document.querySelector('#app')
  let user = getCachedUser()
  try {
    user = (await refreshCurrentUser()) || user
  } catch {}
  const name = user?.name || 'Thành viên CGV',
    email = user?.email || '',
    initial = (name.trim()[0] || 'C').toUpperCase()
  const notices = loadUserNotifications(user)
  const unreadCount = notices.filter((notice) => !notice.read).length
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
    <section class="account-notifications">
      <div class="account-notifications-head">
        <div><h2>Thông báo</h2><p>${unreadCount ? `${unreadCount} thông báo chưa đọc` : 'Thông tin cập nhật về vé của bạn'}</p></div>
        ${unreadCount ? '<button type="button" id="markNotificationsRead">Đánh dấu đã đọc</button>' : ''}
      </div>
      ${notices.length ? notices.map((notice) => `<article class="account-notice ${notice.read ? '' : 'unread'}">
        <strong>${escapeHtml(notice.title)}</strong><small>${new Date(notice.createdAt).toLocaleString('vi-VN')}</small>
        <p>${escapeHtml(notice.message)}</p>
      </article>`).join('') : '<p class="account-notice-empty">Bạn chưa có thông báo nào.</p>'}
    </section>
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
  document.querySelector('#markNotificationsRead')?.addEventListener('click', () => {
    markUserNotificationsRead(user)
    location.reload()
  })
}
// Mã hóa chuỗi trước khi chèn dữ liệu tài khoản vào HTML.
function escapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
}
