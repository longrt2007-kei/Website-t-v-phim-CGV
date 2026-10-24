import './admin.css'
import './admin-dark.css'
import { apiRequest } from './shared/api.js'
import { adminNav } from './shared/admin-nav.js'
import { requireAdmin } from './shared/admin-auth.js'

if (!requireAdmin()) throw new Error('Admin authentication required')

const $ = selector => document.querySelector(selector)
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]))
let theaters = []
let bookings = []
let selectedTheater = ''
let selectedRoom = '01'
let selectedShow = ''

$('#app').innerHTML = `${adminNav('rooms')}<main>
  <header class="topbar"><span>QUẢN TRỊ / PHÒNG & GHẾ</span><div class="profile"><span>Administrator</span><span class="avatar">AD</span></div></header>
  <section class="page-head"><div><h1>Quản lý phòng & chỗ ngồi</h1><p>Chọn đúng suất chiếu để xem trạng thái ghế đã đặt.</p></div></section>
  <div class="filters"><label>Rạp<select id="theater"></select></label><label>Phòng<select id="room"></select></label><label>Suất chiếu<select id="show"></select></label></div>
  <section class="panel"><div class="panel-heading"><div><h2>Sơ đồ ghế</h2><span id="summary">Đang tải dữ liệu…</span></div></div>
    <div class="seat-admin-legend"><span>◻ Còn trống</span><span>■ Đã đặt</span></div><div id="map" class="seat-admin-map"></div>
    <div class="table-scroll"><table><thead><tr><th>GHẾ</th><th>TRẠNG THÁI</th><th>PHIM</th><th>NGÀY / SUẤT</th><th>MÃ VÉ</th></tr></thead><tbody id="rows"></tbody></table></div>
  </section>
</main>`

const roomBookings = () => bookings.filter(booking => String(booking.theaterId) === selectedTheater && String(booking.room || '01') === selectedRoom && !['Đã hủy', 'Đã hoàn tiền'].includes(booking.paymentStatus))
const showKey = booking => `${booking.movie}__${booking.date}__${booking.time}`

function renderShows() {
  const list = roomBookings()
  const shows = [...new Map(list.map(booking => [showKey(booking), booking])).values()]
  if (!shows.some(booking => showKey(booking) === selectedShow)) selectedShow = shows.length ? showKey(shows[0]) : ''
  $('#show').innerHTML = shows.map(booking => `<option value="${esc(showKey(booking))}">${esc(booking.movie)} · ${esc(booking.date)} · ${esc(booking.time)}</option>`).join('') || '<option value="">Chưa có suất đặt vé</option>'
  $('#show').value = selectedShow
}

function render() {
  renderShows()
  const activeBookings = selectedShow ? roomBookings().filter(booking => showKey(booking) === selectedShow) : []
  const seats = new Map()
  activeBookings.forEach(booking => (booking.seats || []).forEach(seat => seats.set(seat, booking)))
  const theater = theaters.find(item => String(item.id) === selectedTheater)
  $('#map').innerHTML = '<div class="seat-admin-screen">MÀN HÌNH</div>' + ['A','B','C','D','E','F','G','H'].map(row => `<div class="seat-admin-row"><b>${row}</b>${Array.from({ length: 10 }, (_, index) => {
    const seat = `${row}${index + 1}`
    const booking = seats.get(seat)
    return `<span class="seat-admin-cell ${booking ? 'taken' : ''}" title="${booking ? `Đã đặt · ${esc(booking.code)}` : 'Còn trống'}">${index + 1}</span>`
  }).join('')}</div>`).join('')
  $('#summary').textContent = `${theater?.name || selectedTheater} · Phòng ${selectedRoom} · ${seats.size} ghế đã đặt${selectedShow ? '' : ' · Chọn suất để xem'}`
  $('#rows').innerHTML = [...seats.entries()].map(([seat, booking]) => `<tr><td><strong>${esc(seat)}</strong></td><td>Đã đặt</td><td>${esc(booking.movie)}</td><td>${esc(booking.date)} · ${esc(booking.time)}</td><td>${esc(booking.code)}</td></tr>`).join('') || '<tr><td colspan="5">Suất chiếu này chưa có ghế được đặt.</td></tr>'
}

async function load() {
  try {
    [theaters, bookings] = await Promise.all([apiRequest('theaters'), apiRequest('bookings')])
    if (!selectedTheater) selectedTheater = String(theaters[0]?.id || '')
    $('#theater').innerHTML = theaters.map(theater => `<option value="${esc(theater.id)}">${esc(theater.name)}</option>`).join('')
    $('#theater').value = selectedTheater
    const roomCount = Number(theaters.find(theater => String(theater.id) === selectedTheater)?.screens || 1)
    $('#room').innerHTML = Array.from({ length: roomCount }, (_, index) => {
      const room = String(index + 1).padStart(2, '0')
      return `<option value="${room}">Phòng ${room}</option>`
    }).join('')
    if (Number(selectedRoom) > roomCount) selectedRoom = '01'
    $('#room').value = selectedRoom
    render()
  } catch {
    $('#summary').textContent = 'Không tải được dữ liệu. Hãy kiểm tra kết nối API.'
  }
}

$('#theater').addEventListener('change', () => { selectedTheater = $('#theater').value; selectedRoom = '01'; selectedShow = ''; load() })
$('#room').addEventListener('change', () => { selectedRoom = $('#room').value; selectedShow = ''; render() })
$('#show').addEventListener('change', () => { selectedShow = $('#show').value; render() })
load()
setInterval(load, 5000)
