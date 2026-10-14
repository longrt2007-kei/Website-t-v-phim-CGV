import './pages.css'
import { requireAuth, getCachedUser } from './shared/auth.js'
import { mountUserNav } from './shared/user-nav.js'
import { getBookings, money, PAYMENT_BANK, formatDateTime } from './shared/booking-storage.js'
import { theaters } from './data/home-catalog.js'

if (!requireAuth()) throw new Error('AUTH_REDIRECT')
const app = document.querySelector('#app')
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const save = (list) => localStorage.setItem('cgv_bookings_v1', JSON.stringify(list))
const theaterName = (ticket) => ticket.theaterName || theaters.find((theater) => String(theater.id) === String(ticket.theaterId))?.name || ticket.theaterId || 'CGV Cinemas'

const showDateTime = (ticket) => {
  const match = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/.exec(String(ticket.date || ''))
  const time = /^(\d{1,2}):(\d{2})$/.exec(String(ticket.time || ''))
  if (!match || !time) return new Date(ticket.createdAt || 0)
  const created = new Date(ticket.createdAt || Date.now())
  return new Date(Number(match[3] || created.getFullYear()), Number(match[2]) - 1, Number(match[1]), Number(time[1]), Number(time[2]))
}
const ticketStatus = (ticket) => {
  if (ticket.bookingStatus === 'Đã hủy' || ticket.bookingStatus === 'cancelled') return 'Đã hủy'
  return showDateTime(ticket).getTime() < Date.now() ? 'Đã sử dụng' : 'Sắp chiếu'
}

app.innerHTML = `<header class="simple-header"><div class="simple-nav">
  <a class="simple-logo" href="/trangchu.html">CGV</a>
  <nav><a href="/trangchu.html">Trang chủ</a><a href="/phim.html">Phim</a><a href="/lichchieu.html">Lịch chiếu</a><a class="active" href="/ve-cua-toi.html">Vé của tôi</a></nav>
  </div></header>
  <main class="ticket-page">
    <div class="ticket-head"><div><span class="eyebrow">TÀI KHOẢN CỦA BẠN</span><h1>Vé của tôi</h1><p>Tra cứu và quản lý các vé đã đặt bằng tài khoản đang đăng nhập.</p></div>
      <div class="ticket-tools"><input id="ticketSearch" placeholder="Tìm mã vé hoặc tên phim" aria-label="Tìm vé"><button class="ticket-btn" id="printTickets">In danh sách vé</button><a class="ticket-btn" href="/trangchu.html#showing">＋ Đặt vé mới</a></div>
    </div>
    <div class="ticket-grid" id="ticketGrid"></div>
  </main><div class="toast-mini" id="toast" role="status" aria-live="polite"></div>`
mountUserNav()
const grid = document.querySelector('#ticketGrid'), search = document.querySelector('#ticketSearch'), toast = document.querySelector('#toast')
let query = ''
document.querySelector('#printTickets').addEventListener('click', () => window.print())
function notify(text) {
  toast.textContent = text
  toast.classList.add('show')
  clearTimeout(notify.t)
  notify.t = setTimeout(() => toast.classList.remove('show'), 2200)
}
function render() {
  const user = getCachedUser()
  const all = getBookings().filter((t) => String(t.userId) === String(user?.id))
  const q = query.trim().toLowerCase()
  const tickets = all.filter((t) => !q || `${t.code} ${t.movie} ${theaterName(t)}`.toLowerCase().includes(q))
  grid.innerHTML = tickets.length ? tickets.map((t) => {
    const status = ticketStatus(t)
    return `<article class="ticket-card">
      <div class="ticket-card-top"><div><span class="ticket-code">${esc(t.code)}</span><h2>${esc(t.movie)}</h2><p>${esc(theaterName(t))}</p></div>
      <span class="ticket-status ${status === 'Đã hủy' ? 'cancelled' : status === 'Đã sử dụng' ? 'used' : 'upcoming'}">${status}</span></div>
      <dl>
        <div><dt>Phòng</dt><dd>${esc(t.room || '01')}</dd></div>
        <div><dt>Ngày</dt><dd>${esc(t.date)}</dd></div>
        <div><dt>Suất chiếu</dt><dd>${esc(t.time)}</dd></div>
        <div><dt>Ghế</dt><dd>${esc((t.seats || []).join(', '))}</dd></div>
        <div><dt>Tổng tiền</dt><dd>${money(t.amount || (t.seats || []).length * 85000)}</dd></div>
        <div><dt>Thanh toán</dt><dd>${esc(t.paymentMethod || `QR ${PAYMENT_BANK}`)}</dd></div>
      </dl>
      <small>Mã vé: <strong>${esc(t.code)}</strong> · Đặt lúc ${formatDateTime(t.createdAt)}</small>
      <div class="ticket-footer-actions"><button data-copy="${esc(t.code)}">Sao chép mã vé</button>
        ${status === 'Sắp chiếu' ? `<button class="danger" data-cancel="${esc(t.code)}">Hủy vé</button>` : ''}
      </div>
    </article>`
  }).join('') : `<div class="ticket-empty">${q ? 'Không tìm thấy vé phù hợp.' : 'Bạn chưa có vé nào.'} <a href="/trangchu.html#showing">Đặt vé ngay</a>.</div>`
}
search.addEventListener('input', (event) => { query = event.target.value; render() })
document.addEventListener('click', async (event) => {
  const copy = event.target.closest('[data-copy]')
  if (copy) {
    try { await navigator.clipboard.writeText(copy.dataset.copy); notify('Đã sao chép mã vé') }
    catch { notify('Không thể sao chép tự động') }
  }
  const cancel = event.target.closest('[data-cancel]')
  if (cancel && confirm('Hủy vé này? Vé đã hủy sẽ được giữ lại trong lịch sử.')) {
    const all = getBookings()
    const index = all.findIndex((ticket) => ticket.code === cancel.dataset.cancel && String(ticket.userId) === String(getCachedUser()?.id))
    const removed = all[index]
    if (removed && ticketStatus(removed) === 'Sắp chiếu') {
      all[index] = { ...removed, bookingStatus: 'Đã hủy', canceledAt: new Date().toISOString() }
      save(all)
      try {
        const map = JSON.parse(localStorage.getItem('cgv_seat_state_v1') || '{}')
        const key = `${removed.movie}__${removed.theaterId}__${removed.date}__${removed.time}`
        map[key] = (map[key] || []).filter((seat) => !(removed.seats || []).includes(seat))
        if (!map[key].length) delete map[key]
        localStorage.setItem('cgv_seat_state_v1', JSON.stringify(map))
      } catch {}
      render()
      notify('Đã hủy vé')
    }
  }
})
render()
window.addEventListener('storage', render)
