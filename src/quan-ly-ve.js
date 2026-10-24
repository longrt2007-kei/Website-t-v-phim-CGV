import './quan-tri.css'
import './quan-tri-toi.css'
import './quan-ly-ve.css'
import { adminNav } from './shared/dieu-huong-quan-tri.js'
import {
  releaseBookingSeats,
  money,
  formatDateTime,
  getSeatHolds,
  getHeldSeats,
  bookingKey,
  loadSeatHolds,
  loadAdminBookings,
  updateAdminBookingStatus,
  updateAdminBookingSeats,
  deleteAdminBooking,
  createBookingDeletionNotification,
} from './shared/booking-storage.js'
import { theaters } from './data/home-catalog.js'
import { requireAdmin } from './shared/admin-auth.js'
import { generateBarcodeSvg } from './shared/barcode.js'

if (!requireAdmin()) throw new Error('Admin authentication required')

// Trang quản trị vé: thống kê, tìm/lọc vé, xem mã vạch, cập nhật và xóa vé.
let tickets = []
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
  '—'

app.innerHTML = `
${adminNav('tickets')}
<main>
  <header class="topbar">
  <span>QUẢN TRỊ / VÉ</span>
  <div class="profile">
  <span>Administrator</span>
  <span class="avatar">AD</span>
  </div>
  </header>
<section class="page-head">
  <div>
  <h1>Quản lý vé</h1>
  <p>Theo dõi vé đã đặt, trạng thái thanh toán và thao tác xử lý vé.</p>
  </div>
  </section>
<section class="stats" id="stats">
  </section>
<section class="panel">
  <div class="panel-heading">
  <div>
  <h2>Danh sách vé <span id="count">
  </span>
  </h2>
  <span>Dữ liệu vé demo được lưu trong trình duyệt</span>
  </div>
  </div>
<div class="filters">
  <div class="search">
  <input id="search" placeholder="Tìm mã vé, phim, rạp, ghế...">
  </div>
  <select id="status">
  <option value="">Tất cả trạng thái</option>
  <option>Đã thanh toán</option>
  <option>Chờ xác nhận</option>
  <option>Đã hoàn tiền</option>
  <option>Đã hủy</option>
  </select>
  <select id="sort">
  <option value="new">Mới nhất</option>
  <option value="old">Cũ nhất</option>
  <option value="amount">Giá trị cao nhất</option>
  </select>
  </div>
<div class="table-scroll">
  <table>
  <thead>
  <tr>
  <th>MÃ VÉ</th>
  <th>MÃ VẠCH</th>
  <th>PHIM</th>
  <th>RẠP / SUẤT</th>
  <th>GHẾ</th>
  <th>NGƯỜI ĐẶT</th>
  <th>THANH TOÁN</th>
  <th>TỔNG TIỀN</th>
  <th>THỜI GIAN ĐẶT</th>
  <th>THAO TÁC</th>
  </tr>
  </thead>
  <tbody id="rows">
  </tbody>
  </table>
  </div>
  <div id="empty" class="empty" hidden>Chưa có vé phù hợp.</div>
  </section>
<footer class="footer">
  <span>© 2026 CGV Studio</span>
  <span>Hệ thống quản lý vé CGV.</span>
  </footer>
  </main>
<dialog id="seatEditor" class="admin-seat-editor">
  <div class="seat-editor-head"><div><h2 id="seatEditorTitle">Chỉnh sửa ghế</h2><p id="seatEditorInfo"></p></div><button type="button" class="icon-button" data-close-seat-editor>Đóng</button></div>
  <div class="seat-editor-legend"><span><i class="seat-editor-dot"></i>Còn trống</span><span><i class="seat-editor-dot selected"></i>Ghế trên vé này</span><span><i class="seat-editor-dot unavailable"></i>Vé khác / đang giữ</span></div>
  <div class="seat-editor-screen">MÀN HÌNH</div>
  <div id="seatEditorMap" class="seat-editor-map"></div>
  <p class="seat-editor-hint">Chọn hoặc bỏ chọn ghế. Không thể chọn ghế đã có vé khác hoặc đang được giữ.</p>
  <div id="seatEditorError" class="alert" hidden></div>
  <div class="dialog-footer"><button type="button" class="button" data-close-seat-editor>Hủy</button><button type="button" class="button primary" id="saveTicketSeats">Lưu ghế</button></div>
</dialog>`

const $ = (s) => document.querySelector(s)
let editingTicket = null
let selectedSeats = new Set()
let unavailableSeats = new Set()
// Lọc vé theo từ khóa/trạng thái rồi sắp xếp theo lựa chọn trên trang.
function filtered() {
  const q = $('#search').value.trim().toLowerCase(),
    st = $('#status').value
  const rows = tickets.filter(
    (t) =>
      (!q ||
        `${t.code} ${t.movie} ${theaterName(t)} ${t.date} ${t.time} ${(t.seats || []).join(' ')} ${t.userName || ''} ${t.userEmail || ''}`
          .toLowerCase()
          .includes(q)) &&
      (!st || (t.paymentStatus || 'Đã thanh toán') === st),
  )
  return rows.sort((a, b) =>
    $('#sort').value === 'old'
      ? String(a.createdAt).localeCompare(String(b.createdAt))
      : $('#sort').value === 'amount'
        ? Number(b.amount || 0) - Number(a.amount || 0)
        : String(b.createdAt).localeCompare(String(a.createdAt)),
  )
}
// Vẽ thống kê và bảng vé; mã vạch được tạo cho từng mã vé.
function render() {
  const paid = tickets.filter((t) => (t.paymentStatus || 'Đã thanh toán') === 'Đã thanh toán')
  const revenue = paid.reduce((s, t) => s + Number(t.amount || (t.seats || []).length * 85000), 0)
  const activeHolds = getSeatHolds()
  const totalHeldSeats = activeHolds.reduce((s, h) => s + (h.seats || []).length, 0)
  $('#stats').innerHTML = [
    ['Tổng số vé', tickets.length, 'Tất cả đơn đặt vé'],
    ['Đã thanh toán', paid.length, 'Vé đã xác nhận'],
    ['Đang giữ chỗ', `${totalHeldSeats} ghế`, `${activeHolds.length} phiên giữ chỗ`],
    ['Doanh thu', money(revenue), 'Theo vé đã thanh toán'],
  ]
    .map(
      ([a, b, c]) =>
        `<article class="stat">
          <span>${a}</span>
          <strong>${b}</strong>
          <small>${c}</small>
          </article>`,
    )
    .join('')
  const rows = filtered()
  $('#count').textContent = `(${rows.length})`
  $('#empty').hidden = rows.length > 0
  $('#rows').innerHTML = rows
    .map(
      (t) =>
        `<tr>
          <td>
          <strong>${esc(t.code)}</strong>
          </td>
          <td class="admin-ticket-barcode">${generateBarcodeSvg(t.code, { height: 42, barWidth: 1, showText: true })}</td>
          <td>
          <strong>${esc(t.movie)}</strong>
          </td>
          <td>${esc(theaterName(t))}<br>
          <small>${esc(t.date)} · ${esc(t.time)}</small>
          </td>
          <td><div class="ticket-seats-cell"><strong>${esc((t.seats || []).join(', '))}</strong><button type="button" class="icon-button" data-edit-seats="${esc(t.code)}">Sửa ghế</button></div></td>
          <td><strong>${esc(t.userName || 'Chưa có tên')}</strong><br><small>${esc(t.userEmail || 'Không có email')}</small><br><small>ID: ${esc(t.userId || '—')}</small></td>
          <td>
          <select class="ticket-status" data-code="${esc(t.code)}">
          <option ${status(t, 'Đã thanh toán')}>Đã thanh toán</option>
          <option ${status(t, 'Chờ xác nhận')}>Chờ xác nhận</option>
          <option ${status(t, 'Đã hoàn tiền')}>Đã hoàn tiền</option>
          <option ${status(t, 'Đã hủy')}>Đã hủy</option>
          </select>
          <br>
          <small>${esc(t.paymentMethod || 'QR BIDV')} · ${esc(t.paymentAccount || '8855252740')}</small>
          </td>
          <td>
          <strong>${money(t.amount || (t.seats || []).length * 85000)}</strong>
          </td>
          <td>${formatDateTime(t.createdAt)}</td>
          <td>
          <div class="actions">
          <button class="icon-button delete" data-delete="${esc(t.code)}">Xóa vé</button>
          </div>
          </td>
          </tr>`,
    )
    .join('')
}
// Làm mới lượt giữ ghế để cập nhật số ghế đang bị giữ.
async function refreshSeatHolds() {
  await loadSeatHolds()
  render()
}
// Tải lại danh sách vé và hiển thị thông báo nếu xảy ra lỗi.
async function refreshTickets() {
  try {
    tickets = await loadAdminBookings()
    render()
  } catch (error) {
    $('#empty').hidden = false
    $('#empty').textContent = `Không tải được danh sách vé: ${error.message}`
  }
}

function renderSeatEditor() {
  const rows = 'ABCDEFGH'.split('')
  $('#seatEditorMap').innerHTML = rows.map((row) => `<div class="seat-editor-row"><span>${row}</span>${Array.from({ length: 10 }, (_, index) => {
    const seat = `${row}${index + 1}`
    const unavailable = unavailableSeats.has(seat) && !selectedSeats.has(seat)
    const selected = selectedSeats.has(seat)
    return `<button type="button" class="seat-editor-seat ${selected ? 'selected' : unavailable ? 'unavailable' : ''}" data-editor-seat="${seat}" ${unavailable ? 'disabled' : ''} title="Ghế ${seat}">${seat}</button>`
  }).join('')}</div>`).join('')
  $('#seatEditorInfo').textContent = `${editingTicket?.movie || ''} · ${editingTicket?.date || ''} ${editingTicket?.time || ''} · ${selectedSeats.size} ghế đang chọn`
}

async function openSeatEditor(ticket) {
  editingTicket = ticket
  selectedSeats = new Set((ticket.seats || []).map(String))
  unavailableSeats = new Set()
  $('#seatEditorError').hidden = true
  await loadSeatHolds()
  for (const other of tickets) {
    if (other.code === ticket.code || ['Đã hủy', 'Đã hoàn tiền'].includes(other.paymentStatus)) continue
    if (bookingKey(other) === bookingKey(ticket)) {
      for (const seat of other.seats || []) unavailableSeats.add(String(seat))
    }
  }
  for (const seat of getHeldSeats(bookingKey(ticket))) unavailableSeats.add(String(seat))
  for (const seat of selectedSeats) unavailableSeats.delete(seat)
  $('#seatEditorTitle').textContent = `Chỉnh sửa ghế vé ${ticket.code}`
  renderSeatEditor()
  $('#seatEditor').showModal()
}
function status(ticket, value) {
  return (ticket.paymentStatus || 'Đã thanh toán') === value ? 'selected' : ''
}
$('#search').addEventListener('input', render)
$('#status').addEventListener('change', render)
$('#sort').addEventListener('change', render)
// Lưu trạng thái thanh toán khi quản trị viên thay đổi lựa chọn.
$('#rows').addEventListener('change', async (e) => {
  const s = e.target.closest('.ticket-status')
  if (!s) return
  try {
    const updated = await updateAdminBookingStatus(s.dataset.code, s.value)
    tickets = tickets.map((ticket) => (ticket.code === updated.code ? updated : ticket))
    render()
  } catch (error) {
    alert(`Không cập nhật được trạng thái vé: ${error.message}`)
    refreshTickets()
  }
})
// Xóa vé theo xác nhận và mở lại các ghế thuộc vé đó.
$('#rows').addEventListener('click', async (e) => {
  const editSeats = e.target.closest('[data-edit-seats]')
  if (editSeats) {
    const ticket = tickets.find((item) => item.code === editSeats.dataset.editSeats)
    if (ticket) await openSeatEditor(ticket)
    return
  }
  const b = e.target.closest('[data-delete]')
  if (!b) return
  const ticket = tickets.find((t) => t.code === b.dataset.delete)
  if (!ticket) return
  if (!confirm(`Xóa vé ${ticket.code}? Ghế của vé này sẽ được mở lại.`)) return
  try {
    await deleteAdminBooking(ticket.code)
    createBookingDeletionNotification(ticket)
    releaseBookingSeats(ticket)
    tickets = tickets.filter((t) => t.code !== ticket.code)
    render()
  } catch (error) {
    alert(`Không xóa được vé: ${error.message}`)
  }
})
$('#seatEditorMap').addEventListener('click', (event) => {
  const button = event.target.closest('[data-editor-seat]')
  if (!button || button.disabled) return
  const seat = button.dataset.editorSeat
  if (selectedSeats.has(seat)) selectedSeats.delete(seat)
  else selectedSeats.add(seat)
  renderSeatEditor()
})
$('#seatEditor').addEventListener('click', (event) => {
  if (event.target.closest('[data-close-seat-editor]')) $('#seatEditor').close()
})
$('#saveTicketSeats').addEventListener('click', async (event) => {
  if (!editingTicket || !selectedSeats.size) {
    $('#seatEditorError').textContent = 'Vé phải còn ít nhất một ghế.'
    $('#seatEditorError').hidden = false
    return
  }
  const button = event.currentTarget
  button.disabled = true
  try {
    const updated = await updateAdminBookingSeats(editingTicket.code, [...selectedSeats])
    tickets = tickets.map((ticket) => ticket.code === updated.code ? updated : ticket)
    $('#seatEditor').close()
    render()
  } catch (error) {
    $('#seatEditorError').textContent = error.message || 'Không cập nhật được ghế.'
    $('#seatEditorError').hidden = false
  } finally {
    button.disabled = false
  }
})
window.addEventListener('storage', (event) => {
  if (!event.key || event.key === 'cgv_demo_shared_holds_v1' || event.key === 'cgv_seat_holds_v1') {
    render()
  }
  if (!event.key || event.key === 'cgv_bookings_v1') refreshTickets()
})
window.addEventListener('cgv-seat-holds-change', render)
setInterval(() => {
  if (!document.hidden) refreshSeatHolds()
}, 3000)
window.addEventListener('focus', refreshSeatHolds)
window.addEventListener('visibilitychange', () => {
  if (!document.hidden) refreshSeatHolds()
})
setInterval(() => {
  if (!document.hidden) refreshTickets()
}, 30_000)
refreshTickets()
refreshSeatHolds()
