// Trang lịch sử vé: tìm kiếm, xem chi tiết, sao chép mã, in và xóa vé.
import './pages.css'
import { requireAuth, getCachedUser } from './shared/auth.js'
import { mountUserNav } from './shared/user-nav.js'
import {
  getBookings,
  money,
  PAYMENT_BANK,
  PAYMENT_ACCOUNT,
  formatDateTime,
  getRoomType,
  loadUserBookings,
  deleteUserBooking,
} from './shared/booking-storage.js'
import { theaters } from './data/home-catalog.js'
// Chỉ cho phép vào trang khi người dùng đã đăng nhập.
if (!requireAuth()) throw new Error('AUTH_REDIRECT')
const app = document.querySelector('#app')
const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
const theaterName = (ticket) =>
  ticket.theaterName ||
  theaters.find((theater) => String(theater.id) === String(ticket.theaterId))?.name ||
  ticket.theaterId ||
  'CGV Cinemas'
let query = ''
// Dựng khung giao diện, phần tìm kiếm và danh sách vé.
app.innerHTML = `<header class="simple-header">
  <div class="simple-nav">
  <a class="simple-logo" href="/trangchu.html">CGV</a>
  <nav>
  <a href="/trangchu.html">Trang chủ</a>
  <a href="/phim.html">Phim</a>
  <a href="/lichchieu.html">Lịch chiếu</a>
  <a class="active" href="/ve-cua-toi.html">Vé của tôi</a>
  </nav>
  </div>
  </header>
  <main class="ticket-page">
  <div class="ticket-head">
  <div>
  <span class="eyebrow">TÀI KHOẢN CỦA BẠN</span>
  <h1>Vé của tôi</h1>
  <p>Tra cứu các vé đã đặt bằng tài khoản đang đăng nhập.</p>
  </div>
  <div class="ticket-tools">
  <input id="ticketSearch" placeholder="Tìm mã vé hoặc tên phim" style="background:#0b1424;border:1px solid #ffffff1a;color:#fff;border-radius:10px;padding:11px 13px">
  <button class="ticket-btn" id="printTickets">In danh sách vé</button>
  <a class="ticket-btn" href="/trangchu.html#showing">＋ Đặt vé mới</a>
  </div>
  </div>
  <div class="ticket-grid" id="ticketGrid">
  </div>
  </main>
  <div class="toast-mini" id="toast">
  </div>`
mountUserNav()
const grid = document.querySelector('#ticketGrid'),
  search = document.querySelector('#ticketSearch'),
  toast = document.querySelector('#toast')
// Mở hộp thoại in của trình duyệt cho danh sách vé.
document.querySelector('#printTickets').addEventListener('click', () => window.print())
// Hiện thông báo ngắn sau khi sao chép hoặc xóa vé.
function notify(text) {
  toast.textContent = text
  toast.classList.add('show')
  clearTimeout(notify.t)
  notify.t = setTimeout(() => toast.classList.remove('show'), 1800)
}
// Lọc vé theo tài khoản và từ khóa, sau đó dựng các thẻ vé lên trang.
function render() {
  const user = getCachedUser()
  const all = getBookings().filter((t) => String(t.userId) === String(user?.id))
  const q = query.trim().toLowerCase()
  const tickets = all.filter(
    (t) => !q || `${t.code} ${t.movie} ${theaterName(t)}`.toLowerCase().includes(q),
  )
  grid.innerHTML = tickets.length
    ? tickets
        .map(
          (t) =>
            `<article class="ticket-card">
              <div class="ticket-card-top">
              <div>
              <span class="ticket-code">${esc(t.code)}</span>
              <h2>${esc(t.movie)}</h2>
              <p>${esc(theaterName(t))}</p>
              </div>
              <span class="ticket-status">${esc(t.paymentStatus || 'Đã thanh toán')}</span>
              </div>
              <dl>
              <div>
              <dt>Ngày</dt>
              <dd>${esc(t.date)}</dd>
              </div>
              <div>
              <dt>Suất chiếu</dt>
              <dd>${esc(t.time)}</dd>
              </div>
              <div>
              <!-- Vé cũ không có trường format sẽ lấy định dạng theo phòng -->
              <dt>Định dạng</dt>
              <dd>${esc(t.format || getRoomType(t.theaterId, t.room))}</dd>
              </div>
              <div>
              <dt>Ghế</dt>
              <dd>${esc((t.seats || []).join(', '))}</dd>
              </div>
              <div>
              <dt>Tổng tiền</dt>
              <dd>${money(t.amount || (t.seats || []).length * 85000)}</dd>
              </div>
              <div>
              <dt>Thanh toán</dt>
              <dd>${esc(t.paymentMethod || `QR ${PAYMENT_BANK}`)}</dd>
              </div>
              <div>
              <dt>Tài khoản</dt>
              <dd>${esc(t.paymentAccount || PAYMENT_ACCOUNT)}</dd>
              </div>
              </dl>
              <small>Đặt lúc ${formatDateTime(t.createdAt)}</small>
              <div class="ticket-footer-actions">
              <a href="/chi-tiet-ve.html?code=${esc(t.code)}" target="_blank" style="text-decoration:none;font-weight:700;color:#c72b2b;display:inline-flex;align-items:center;padding:6px 12px;background:rgba(215,25,32,0.1);border-radius:6px;">🎟️ Xem vé &amp; Mã vạch</a>
              <button data-copy="${esc(t.code)}">Sao chép mã</button>
              <button class="danger" data-cancel="${esc(t.code)}">Xóa</button>
              </div>
              </article>`,
        )
        .join('')
    : `<div class="ticket-empty">${q ? 'Không tìm thấy vé phù hợp.' : 'Bạn chưa có vé nào.'} <a href="/trangchu.html#showing">Đặt vé ngay</a>.</div>`
}
// Lọc danh sách vé ngay khi khách nhập từ khóa.
search.addEventListener('input', (e) => {
  query = e.target.value
  render()
})
// Xử lý sao chép mã vé và xóa vé; khi xóa thì giải phóng ghế đã đặt.
document.addEventListener('click', async (e) => {
  const c = e.target.closest('[data-copy]')
  if (c) {
    try {
      await navigator.clipboard.writeText(c.dataset.copy)
      notify('Đã sao chép mã vé')
    } catch {
      notify('Không thể sao chép tự động')
    }
  }
  const d = e.target.closest('[data-cancel]')
  if (d && confirm('Xóa vé này khỏi lịch sử trên thiết bị?')) {
    const all = getBookings()
    const removed = all.find((t) => t.code === d.dataset.cancel)
    try {
      await deleteUserBooking(d.dataset.cancel)
    } catch (error) {
      notify(`Không xóa được vé: ${error.message}`)
      return
    }
    if (removed) {
      try {
        const map = JSON.parse(localStorage.getItem('cgv_seat_state_v1') || '{}')
        const key = `${removed.movie}__${removed.theaterId}__${removed.date}__${removed.time}`
        map[key] = (map[key] || []).filter((seat) => !(removed.seats || []).includes(seat))
        localStorage.setItem('cgv_seat_state_v1', JSON.stringify(map))
      } catch {}
    }
    render()
    notify('Đã xóa vé khỏi lịch sử')
  }
})
// Hiển thị dữ liệu ban đầu và cập nhật khi một tab khác thay đổi localStorage.
render()
window.addEventListener('storage', render)
loadUserBookings(getCachedUser()?.id)
  .then(render)
  .catch(() => notify('Không kết nối được để tải vé từ máy chủ.'))
