import { apiUrl } from './api.js'

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

const requestBookings = async (path, { admin = false, ...options } = {}) => {
  const token = localStorage.getItem(admin ? 'cgv_admin_token_v1' : 'cgv_auth_token_v1') || ''
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!response.ok) {
    let message = `Không thể đồng bộ vé (${response.status}).`
    try {
      const data = await response.json()
      message = data?.message || data?.error || message
    } catch {}
    throw new Error(message)
  }
  return response.status === 204 ? null : response.json()
}

function cacheRemoteBookings(bookings, ownerId = null) {
  const local = getBookings()
  const otherUsers = ownerId == null ? [] : local.filter((booking) => String(booking.userId) !== String(ownerId))
  const merged = [...bookings, ...otherUsers]
  saveBookings(merged)
  return bookings
}

export async function loadUserBookings(userId = null) {
  const bookings = await requestBookings('/my-bookings')
  return cacheRemoteBookings(bookings, userId)
}

export async function loadUserBooking(code) {
  return requestBookings(`/my-bookings/${encodeURIComponent(code)}`)
}

export async function syncLocalBookings(user) {
  if (!user?.id) return
  const local = getBookings().filter(
    (booking) => !booking.userId || String(booking.userId) === String(user.id),
  )
  if (!local.length) return
  const remote = await requestBookings('/my-bookings')
  const existingCodes = new Set(remote.map((booking) => booking.code))
  for (const booking of local) {
    booking.userId = String(user.id)
    booking.userEmail = user.email || booking.userEmail || ''
    if (!existingCodes.has(booking.code)) {
      const saved = await requestBookings('/my-bookings', {
        method: 'POST',
        body: JSON.stringify(booking),
      })
      remote.push(saved)
      existingCodes.add(saved.code)
    }
  }
  cacheRemoteBookings(remote, user.id)
}

export async function createUserBooking(booking) {
  const saved = await requestBookings('/my-bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  })
  saveBookings([saved, ...getBookings().filter((item) => item.code !== saved.code)])
  return saved
}

export async function deleteUserBooking(code) {
  await requestBookings(`/my-bookings/${encodeURIComponent(code)}`, { method: 'DELETE' })
  saveBookings(getBookings().filter((booking) => booking.code !== code))
}

export async function loadAdminBookings() {
  return requestBookings('/admin/bookings', { admin: true })
}

export async function updateAdminBookingStatus(code, paymentStatus) {
  return requestBookings(`/admin/bookings/${encodeURIComponent(code)}`, {
    admin: true,
    method: 'PATCH',
    body: JSON.stringify({ paymentStatus }),
  })
}

export async function deleteAdminBooking(code) {
  await requestBookings(`/admin/bookings/${encodeURIComponent(code)}`, {
    admin: true,
    method: 'DELETE',
  })
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
export const DEFAULT_HOLD_DURATION_SECONDS = 300 // 5 phút

export function cleanExpiredHolds() {
  try {
    const list = JSON.parse(localStorage.getItem(SEAT_HOLD_STORAGE_KEY) || '[]')
    const now = Date.now()
    const valid = list.filter((item) => Number(item.expiresAt) > now)
    if (valid.length !== list.length) {
      localStorage.setItem(SEAT_HOLD_STORAGE_KEY, JSON.stringify(valid))
    }
    return valid
  } catch {
    return []
  }
}

export function getSeatHolds() {
  return cleanExpiredHolds()
}

export function saveSeatHolds(holds) {
  try {
    localStorage.setItem(SEAT_HOLD_STORAGE_KEY, JSON.stringify(holds))
  } catch {}
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

export function createSeatHold(key, seats, durationSeconds = DEFAULT_HOLD_DURATION_SECONDS) {
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

export function releaseSeatHold(holdId) {
  if (!holdId) return
  const holds = cleanExpiredHolds().filter((h) => h.id !== holdId)
  saveSeatHolds(holds)
}

export function getHoldById(holdId) {
  if (!holdId) return null
  const holds = cleanExpiredHolds()
  return holds.find((h) => h.id === holdId) || null
}

