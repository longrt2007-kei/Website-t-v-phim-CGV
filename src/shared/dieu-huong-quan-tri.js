import { clearAdminSession, getAdminUser } from './admin-auth.js'

export function adminNav(active) {
  const admin = getAdminUser()
  const items = [
    ['movies', '/quan-ly-phim.html', '▣', 'Quản lý phim'],
    ['theaters', '/quan-ly-rap.html', '⌂', 'Quản lý rạp'],
    ['rooms', '/quan-ly-phong.html', '▦', 'Quản lý phòng'],
    ['showtimes', '/quan-ly-suat-chieu.html', '◷', 'Quản lý suất chiếu'],
    ['tickets', '/quan-ly-ve.html', '🎟', 'Quản lý vé'],
  ]
  return `<aside class="sidebar">
    <a class="brand" href="/quan-ly-phim.html">CGV<small>STUDIO</small>
    </a>
    <div>
      <div class="nav-label">KHÔNG GIAN QUẢN TRỊ</div>
      ${items.map(([id, href, icon, label]) => `<a class="nav-item ${active === id ? 'active' : ''}" href="${href}">${icon} &nbsp; ${label}</a>`).join('')}
      <a class="nav-item" href="/trangchu.html">↗ &nbsp; Trang đặt vé</a>
      <button type="button" class="nav-item admin-logout-link" id="adminLogoutNav">↪ &nbsp; Đăng xuất</button>
    </div>
    <div class="sidebar-bottom">
    <strong>${admin?.name || 'CGV Cinema Studio'}</strong>${admin?.email || 'Quản trị nội dung và vận hành'}<br>Hệ thống quản trị · 2026</div>
  </aside>`
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('#adminLogoutNav')) return
  clearAdminSession()
  location.href = '/dang-nhap-quan-tri.html'
})
