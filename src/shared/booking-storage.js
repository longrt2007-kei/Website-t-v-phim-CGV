export const BOOKING_STORAGE_KEY = 'cgv_bookings_v1'
export const SEAT_STORAGE_KEY = 'cgv_seat_state_v1'
export const PAYMENT_BANK = 'BIDV'
export const PAYMENT_ACCOUNT = '8855252740'
export const TICKET_PRICE = 85000

export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
export function saveBookings(bookings) {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings))
}

export async function loadUserBookings(userId = null) {
  const bookings = getBookings()
  return userId == null ? bookings : bookings.filter((booking) => String(booking.userId) === String(userId))
}

export async function loadUserBooking(code) {
  return getBookings().find((booking) => booking.code === code) || null
}

export async function syncLocalBookings(user) {
  if (!user?.id) return
  const bookings = getBookings()
  let changed = false
  for (const booking of bookings) {
    if (!booking.userId || String(booking.userId) === String(user.id)) {
      booking.userId = String(user.id)
      booking.userEmail = user.email || booking.userEmail || ''
      changed = true
    }
  }
  if (changed) saveBookings(bookings)
}

export async function createUserBooking(booking) {
  saveBookings([booking, ...getBookings().filter((item) => item.code !== booking.code)])
  return booking
}

export async function deleteUserBooking(code) {
  saveBookings(getBookings().filter((booking) => booking.code !== code))
}

export async function loadAdminBookings() {
  return getBookings()
}

export async function updateAdminBookingStatus(code, paymentStatus) {
  const bookings = getBookings()
  const booking = bookings.find((item) => item.code === code)
  if (!booking) throw new Error('Không tìm thấy vé cần cập nhật.')
  booking.paymentStatus = paymentStatus
  saveBookings(bookings)
  return booking
}

export async function deleteAdminBooking(code) {
  saveBookings(getBookings().filter((booking) => booking.code !== code))
}
export function getSeatMap() {
  try {
    return JSON.parse(localStorage.getItem(SEAT_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}
export function saveSeatMap(map) {
  localStorage.setItem(SEAT_STORAGE_KEY, JSON.stringify(map))
}
export function bookingKey(b) {
  return `${b.movie}__${b.theaterId}__${b.date}__${b.time}`
}
export function releaseBookingSeats(booking) {
  const map = getSeatMap(),
    key = bookingKey(booking)
  if (map[key]) {
    map[key] = map[key].filter((seat) => !booking.seats.includes(seat))
    if (!map[key].length) delete map[key]
    saveSeatMap(map)
  }
}
export const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`
export const formatDateTime = (value) => (value ? new Date(value).toLocaleString('vi-VN') : '—')

export const SEAT_HOLD_STORAGE_KEY = 'cgv_seat_holds_v1'
const HOLDS_COLLECTION_KEY = 'cgv_demo_shared_holds_v1'
export const DEFAULT_HOLD_DURATION_SECONDS = 300 // 5 phút

function readSharedHolds() {
  try {
    return JSON.parse(localStorage.getItem(HOLDS_COLLECTION_KEY) || '[]')
  } catch {
    return []
  }
}

function writeSharedHolds(holds) {
  try {
    localStorage.setItem(HOLDS_COLLECTION_KEY, JSON.stringify(holds))
    window.dispatchEvent(new CustomEvent('cgv-seat-holds-change'))
  } catch {}
}

export function cleanExpiredHolds() {
  try {
    const now = Date.now()
    const list = readSharedHolds()
    const valid = list.filter((item) => Number(item.expiresAt) > now)
    if (valid.length !== list.length) writeSharedHolds(valid)
    localStorage.setItem(SEAT_HOLD_STORAGE_KEY, JSON.stringify(valid))
    return valid
  } catch {
    return []
  }
}

export function getSeatHolds() {
  return cleanExpiredHolds()
}

export async function loadSeatHolds() {
  return cleanExpiredHolds()
}

export function saveSeatHolds(holds) {
  writeSharedHolds(holds)
  try { localStorage.setItem(SEAT_HOLD_STORAGE_KEY, JSON.stringify(holds)) } catch {}
}

export function getHeldSeats(key, excludeHoldId = null) {
  const holds = getSeatHolds()
  const seats = []
  for (const h of holds) {
    if (h.key === key && (!excludeHoldId || h.id !== excludeHoldId)) {
      seats.push(...(h.seats || []))
    }
  }
  return [...new Set(seats)]
}

export async function createSeatHold(key, seats, durationSeconds = DEFAULT_HOLD_DURATION_SECONDS) {
  const holds = cleanExpiredHolds()
  const currentHeld = getHeldSeats(key)
  const conflict = seats.find((s) => currentHeld.includes(s))
  if (conflict) {
    return { success: false, conflictSeat: conflict, message: `Ghế ${conflict} vừa được khách khác giữ chỗ!` }
  }
  const now = Date.now()
  const hold = {
    id: `hold_${now}_${Math.random().toString(36).slice(2, 7)}`,
    key,
    seats: [...seats],
    createdAt: now,
    expiresAt: now + durationSeconds * 1000,
    durationSeconds,
  }
  holds.push(hold)
  saveSeatHolds(holds)
  return { success: true, hold }
}

export async function releaseSeatHold(holdId) {
  if (!holdId) return
  const holds = cleanExpiredHolds().filter((h) => h.id !== holdId)
  saveSeatHolds(holds)
}

export function getHoldById(holdId) {
  if (!holdId) return null
  const holds = cleanExpiredHolds()
  return holds.find((h) => h.id === holdId) || null
}

