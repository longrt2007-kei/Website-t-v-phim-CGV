import { clearAdminSession, requireAdmin } from './admin-auth.js'

export function adminNav(active){
  const items=[
    ['movies','/admin-phim.html','▣','Quản lý phim'],
    ['theaters','/admin-rap.html','⌂','Quản lý rạp'],
    ['showtimes','/admin-suat-chieu.html','◷','Quản lý suất chiếu'],
    ['tickets','/admin-ve.html','🎟','Quản lý vé']
  ]
  return `<aside class="sidebar">
    <a class="brand" href="/admin-phim.html">CGV<small>STUDIO</small></a>
    <div>
      <div class="nav-label">KHÔNG GIAN QUẢN TRỊ</div>
      ${items.map(([id,href,icon,label])=>`<a class="nav-item ${active===id?'active':''}" href="${href}">${icon} &nbsp; ${label}</a>`).join('')}
      <a class="nav-item" href="/trangchu.html">↗ &nbsp; Trang đặt vé</a>
      <button type="button" class="nav-item admin-logout-link" id="adminLogoutNav">↪ &nbsp; Đăng xuất</button>
    </div>
    <div class="sidebar-bottom"><strong>CGV Cinema Studio</strong>Quản trị nội dung và vận hành<br>Hệ thống quản trị · 2026</div>
  </aside>`
}

if (!requireAdmin()) {
  // Redirect handled by requireAdmin.
} else {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#adminLogoutNav')) return
    clearAdminSession()
    location.href = '/trangchu.html'
  })
}
