import './quan-tri.css'
import './quan-tri-toi.css'
import './quan-ly-phong.css'
import { apiRequest, apiUrl } from './shared/api.js'
import { adminNav } from './shared/dieu-huong-quan-tri.js'
import { requireAdmin } from './shared/admin-auth.js'
import { getSeatHolds, loadAdminBookings, loadSeatHolds } from './shared/booking-storage.js'

if (!requireAdmin()) throw new Error('Admin authentication required')

const STORAGE_KEY = 'cgv_demo_admin_rooms'
const $ = (selector) => document.querySelector(selector)
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char])
let theaters = []
let rooms = []
let bookings = []
let holds = []
let roomOccupancy = []
let selectedRoomId = ''
let editingId = ''

$('#app').innerHTML = `${adminNav('rooms')}<main>
  <header class="topbar"><span>QUẢN TRỊ / PHÒNG CHIẾU</span><div class="profile"><span>Administrator</span><span class="avatar">AD</span></div></header>
  <section class="page-head"><div><h1>Quản lý phòng &amp; chỗ ngồi</h1><p>Quản lý phòng theo từng rạp và theo dõi ghế đã được khách đặt.</p></div><button class="button primary" id="addRoom">＋ Thêm phòng</button></section>
  <div id="error" class="alert" hidden></div>
  <section class="stats" id="stats"></section>
  <section class="panel room-panel"><div class="panel-heading"><div><h2>Danh sách phòng</h2><span>Chọn phòng để xem sơ đồ ghế</span></div><select id="theaterFilter" aria-label="Lọc theo rạp"><option value="">Tất cả rạp</option></select></div>
    <div class="room-list" id="roomList"></div>
  </section>
  <section class="panel seat-panel" id="seatPanel"><div class="panel-heading"><div><h2 id="seatTitle">Sơ đồ ghế</h2><span id="seatSub">Chọn phòng để xem sơ đồ</span></div><div class="seat-legend"><span><i class="seat-dot free"></i>Còn trống</span><span><i class="seat-dot held"></i>Đang giữ chỗ</span><span><i class="seat-dot booked"></i>Đã đặt vé</span></div></div>
    <div class="screen-label-admin">MÀN HÌNH</div><div class="admin-seat-map" id="seatMap"></div>
    <div class="seat-footnote">Sơ đồ phòng hiện có 8 hàng × 10 ghế, tương ứng với sơ đồ khi khách đặt vé.</div>
  </section>
  <footer class="footer"><span>© 2026 CGV Studio</span><span>Phòng chiếu và sơ đồ ghế.</span></footer>
</main>
<dialog id="editor"><h2 id="dialogTitle">Thêm phòng</h2><form id="roomForm"><div class="form-grid">
  <label class="wide">Rạp *<select name="theaterId" id="theaterSelect" required></select></label>
  <label>Tên / mã phòng *<input name="name" required maxlength="32" placeholder="Ví dụ: 01, IMAX"></label>
  <label>Định dạng<select name="type"><option>2D</option><option>3D</option><option>IMAX</option><option>4DX</option><option>Gold Class</option></select></label>
  <label class="wide">Trạng thái<select name="status"><option value="active">Đang hoạt động</option><option value="inactive">Tạm dừng</option></select></label>
  </div><div class="dialog-footer"><button type="button" class="button" id="cancel">Hủy</button><button class="button primary">Lưu phòng</button></div>
</form></dialog>`

const readRooms = () => {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(value) ? value : [] } catch { return [] }
}
const writeRooms = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
const theaterName = (id) => theaters.find((item) => String(item.id) === String(id))?.name || 'Rạp đã xóa'
const activeBookings = () => bookings.filter((booking) => !['Đã hủy', 'Đã hoàn tiền'].includes(booking.paymentStatus))
const roomBookings = (room) => activeBookings().filter((booking) =>
  String(booking.theaterId) === String(room.theaterId) && String(booking.room || '01') === String(room.name),
)
const savedRoomSummary = (room) => roomOccupancy.find((item) =>
  String(item.theaterId) === String(room.theaterId) && String(item.room) === String(room.name),
)
const bookedSeats = (room) => new Set([
  ...roomBookings(room).flatMap((booking) => booking.seats || []),
  ...(savedRoomSummary(room)?.seats || []),
].map(String))
const roomCustomerCount = (room) => savedRoomSummary(room)?.customerCount ?? new Set(
  roomBookings(room).map((booking) => booking.userId || booking.userEmail || booking.code),
).size
const roomHolds = (room) => room.name === '01'
  ? holds.filter((hold) => String(hold.key || '').split('__')[1] === String(room.theaterId))
  : []
const heldSeats = (room) => new Set(roomHolds(room).flatMap((hold) => hold.seats || []).map(String))

function renderStats() {
  const active = rooms.filter((room) => room.status === 'active').length
  const reserved = rooms.reduce((total, room) => total + bookedSeats(room).size, 0)
  const held = rooms.reduce((total, room) => total + [...heldSeats(room)].filter((seat) => !bookedSeats(room).has(seat)).length, 0)
  $('#stats').innerHTML = [
    ['Tổng phòng', rooms.length, 'Tất cả rạp'],
    ['Đang hoạt động', active, 'Sẵn sàng đón khách'],
    ['Ghế đã đặt', reserved, 'Theo các vé còn hiệu lực'],
    ['Đang giữ chỗ', held, 'Tự giải phóng sau 5 phút'],
  ].map(([label, value, caption]) => `<article class="stat"><span>${label}</span><strong>${value}</strong><small>${caption}</small></article>`).join('')
}

function renderRooms() {
  const theaterId = $('#theaterFilter').value
  const visible = rooms.filter((room) => !theaterId || String(room.theaterId) === theaterId)
  $('#roomList').innerHTML = visible.length ? visible.map((room) => {
    const count = savedRoomSummary(room)?.seatCount ?? bookedSeats(room).size
    const customers = roomCustomerCount(room)
    const holding = [...heldSeats(room)].filter((seat) => !bookedSeats(room).has(seat)).length
    return `<article class="room-card ${room.id === selectedRoomId ? 'selected' : ''}" data-room="${esc(room.id)}">
      <div class="room-card-mark">▦</div><div class="room-card-info"><strong>${esc(room.name)}</strong><span>${esc(theaterName(room.theaterId))}</span><small>${esc(room.type || '2D')} · ${count} ghế · ${customers} khách đã đặt · ${holding} đang giữ</small></div>
      <span class="badge ${room.status === 'active' ? 'showing' : 'archived'}">${room.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}</span>
      <div class="actions"><button class="icon-button" data-edit="${esc(room.id)}">Sửa</button><button class="icon-button delete" data-delete="${esc(room.id)}">Xóa</button></div>
    </article>`
  }).join('') : '<div class="empty">Chưa có phòng cho rạp này. Chọn “Thêm phòng” để tạo phòng chiếu.</div>'
}

function renderSeats() {
  const room = rooms.find((item) => item.id === selectedRoomId)
  if (!room) {
    $('#seatTitle').textContent = 'Sơ đồ ghế'
    $('#seatSub').textContent = 'Chọn một phòng trong danh sách để xem sơ đồ.'
    $('#seatMap').innerHTML = ''
    return
  }
  const occupied = bookedSeats(room)
  const holding = heldSeats(room)
  for (const seat of occupied) holding.delete(seat)
  const rows = 'ABCDEFGH'.split('')
  $('#seatTitle').textContent = `Phòng ${room.name}`
  const summary = savedRoomSummary(room)
  const customerCount = roomCustomerCount(room)
  $('#seatSub').textContent = `${theaterName(room.theaterId)} · ${room.type || '2D'} · ${summary?.seatCount ?? occupied.size} ghế đã đặt · ${customerCount} khách · ${holding.size} ghế đang giữ chỗ`
  $('#seatMap').innerHTML = rows.map((row) => `<div class="admin-seat-row"><span class="row-label">${row}</span>${Array.from({ length: 10 }, (_, index) => {
    const seat = `${row}${index + 1}`
    const isBooked = occupied.has(seat)
    const isHeld = !isBooked && holding.has(seat)
    const status = isBooked ? 'Đã đặt vé' : isHeld ? 'Đang được giữ chỗ' : 'Còn trống'
    return `<span class="admin-seat ${isBooked ? 'is-booked' : isHeld ? 'is-held' : ''}" title="Ghế ${seat} · ${status}">${seat}</span>`
  }).join('')}</div>`).join('')
}

function render() {
  renderStats()
  renderRooms()
  renderSeats()
}

async function refreshRoomOccupancy() {
  try {
    const response = await fetch(apiUrl('/room-occupancy'))
    if (response.ok) {
      const result = await response.json()
      if (Array.isArray(result)) roomOccupancy = result
    }
  } catch {}
  render()
}

function openEditor(room = null) {
  editingId = room?.id || ''
  $('#roomForm').reset()
  $('#dialogTitle').textContent = room ? 'Chỉnh sửa phòng' : 'Thêm phòng'
  $('#theaterSelect').innerHTML = theaters.map((theater) => `<option value="${esc(theater.id)}">${esc(theater.name)}</option>`).join('')
  if (room) {
    $('#roomForm').elements.namedItem('theaterId').value = room.theaterId
    $('#roomForm').elements.namedItem('name').value = room.name
    $('#roomForm').elements.namedItem('type').value = room.type || '2D'
    $('#roomForm').elements.namedItem('status').value = room.status || 'active'
  }
  $('#editor').showModal()
}

async function load() {
  try {
    theaters = await apiRequest('theaters')
    if (!theaters.length) throw new Error('Chưa có dữ liệu rạp. Hãy thêm rạp trước khi tạo phòng.')
    rooms = readRooms()
    if (!rooms.length) {
      rooms = theaters.flatMap((theater) => Array.from({ length: Math.max(1, Number(theater.screens) || 1) }, (_, index) => ({
        id: `${theater.id}-room-${String(index + 1).padStart(2, '0')}`,
        theaterId: theater.id,
        name: String(index + 1).padStart(2, '0'),
        type: theater.id === 'landmark-81' && index === 2 ? 'IMAX' : '2D',
        status: 'active',
      })))
      writeRooms()
    }
    try { bookings = await loadAdminBookings() } catch { bookings = [] }
    holds = await loadSeatHolds()
    await refreshRoomOccupancy()
    $('#theaterFilter').innerHTML = '<option value="">Tất cả rạp</option>' + theaters.map((theater) => `<option value="${esc(theater.id)}">${esc(theater.name)}</option>`).join('')
    if (!rooms.some((room) => room.id === selectedRoomId)) selectedRoomId = rooms[0]?.id || ''
    render()
  } catch (error) {
    $('#error').hidden = false
    $('#error').textContent = error.message || 'Không tải được danh sách phòng.'
  }
}

$('#addRoom').addEventListener('click', () => openEditor())
$('#cancel').addEventListener('click', () => $('#editor').close())
$('#theaterFilter').addEventListener('change', () => {
  const visible = rooms.filter((room) => !$('#theaterFilter').value || String(room.theaterId) === $('#theaterFilter').value)
  if (!visible.some((room) => room.id === selectedRoomId)) selectedRoomId = visible[0]?.id || ''
  render()
})
$('#roomList').addEventListener('click', (event) => {
  const edit = event.target.closest('[data-edit]')
  const remove = event.target.closest('[data-delete]')
  const card = event.target.closest('[data-room]')
  if (edit) { openEditor(rooms.find((room) => room.id === edit.dataset.edit)); return }
  if (remove) {
    const room = rooms.find((item) => item.id === remove.dataset.delete)
    if (!room || !confirm(`Xóa phòng ${room.name} tại ${theaterName(room.theaterId)}?`)) return
    rooms = rooms.filter((item) => item.id !== room.id)
    if (selectedRoomId === room.id) selectedRoomId = rooms[0]?.id || ''
    writeRooms()
    render()
    return
  }
  if (card) { selectedRoomId = card.dataset.room; render() }
})
$('#roomForm').addEventListener('submit', (event) => {
  event.preventDefault()
  const data = Object.fromEntries(new FormData(event.currentTarget))
  const duplicate = rooms.some((room) => room.id !== editingId && String(room.theaterId) === String(data.theaterId) && room.name.trim().toLowerCase() === data.name.trim().toLowerCase())
  if (duplicate) { alert('Rạp này đã có phòng mang tên đó.'); return }
  if (editingId) {
    rooms = rooms.map((room) => room.id === editingId ? { ...room, ...data, name: data.name.trim() } : room)
  } else {
    const id = `${data.theaterId}-${Date.now()}`
    rooms.push({ ...data, name: data.name.trim(), id })
    selectedRoomId = id
  }
  writeRooms()
  $('#editor').close()
  render()
})

window.addEventListener('storage', (event) => {
  if (!event.key || event.key === STORAGE_KEY || event.key === 'cgv_bookings_v1' || event.key === 'cgv_demo_shared_holds_v1' || event.key === 'cgv_seat_holds_v1') {
    rooms = readRooms()
    holds = getSeatHolds()
    loadSeatHolds().then((value) => { holds = value; render() }).catch(() => {})
    loadAdminBookings().then((value) => { bookings = value; render() }).catch(render)
    refreshRoomOccupancy()
  }
})
window.addEventListener('cgv-seat-holds-change', () => {
  holds = getSeatHolds()
  render()
})
setInterval(() => {
  if (!document.hidden) {
    loadSeatHolds().then((value) => { holds = value; render() }).catch(() => {
      holds = getSeatHolds()
      render()
    })
  }
}, 3000)
setInterval(() => {
  if (!document.hidden) refreshRoomOccupancy()
}, 10000)
load()
