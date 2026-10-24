import { apiUrl } from './api.js'

// Module lưu trữ dùng chung cho vé, sơ đồ ghế và ghế đang được giữ tạm.
// Dữ liệu bản demo nằm trong localStorage của trình duyệt.
// Tên các khóa lưu trữ và thông tin thanh toán mặc định.
export const BOOKING_STORAGE_KEY = 'cgv_bookings_v1'
export const SEAT_STORAGE_KEY = 'cgv_seat_state_v1'
export const BOOKING_NOTIFICATIONS_KEY = 'cgv_booking_notifications_v1'
export const PAYMENT_BANK = 'BIDV'
export const PAYMENT_ACCOUNT = '8855252740'
export const TICKET_PRICE = 85000

// Đọc danh sách vé; trả về mảng rỗng nếu chưa có dữ liệu hoặc JSON bị lỗi.
export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
// Ghi danh sách vé vào localStorage.
export function saveBookings(bookings) {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings))
}

// Lấy vé của một tài khoản; nếu không truyền ID thì lấy tất cả vé.
export async function loadUserBookings(userId = null) {
  const bookings = getBookings()
  return userId == null ? bookings : bookings.filter((booking) => String(booking.userId) === String(userId))
}

// Tìm một vé theo mã vé.
export async function loadUserBooking(code) {
  return getBookings().find((booking) => booking.code === code) || null
}

// Gắn vé chưa có chủ sở hữu với tài khoản hiện đang đăng nhập.
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

// Lưu vé mới lên đầu danh sách và thay thế bản ghi trùng mã vé.
export async function createUserBooking(booking) {
  const token = localStorage.getItem('cgv_auth_token_v1') || ''
  if (token) {
    const response = await fetch(apiUrl('/my-bookings'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(booking),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.message || 'Không thể lưu vé.')
    saveBookings([result, ...getBookings().filter((item) => item.code !== result.code)])
    return result
  }
  saveBookings([booking, ...getBookings().filter((item) => item.code !== booking.code)])
  return booking
}

// Xóa vé theo mã trong khu vực người dùng.
export async function deleteUserBooking(code) {
  saveBookings(getBookings().filter((booking) => booking.code !== code))
}

// Các hàm quản trị: tải, cập nhật trạng thái và xóa vé.
const getAdminApiToken = () => {
  const adminToken = localStorage.getItem('cgv_admin_token_v1') || ''
  if (localStorage.getItem('cgv_admin_session_v1') === 'signed-in') return adminToken
  return localStorage.getItem('cgv_auth_token_v1') || ''
}

export async function loadAdminBookings() {
  const token = getAdminApiToken()
  if (token) {
    const response = await fetch(apiUrl('/admin/bookings'), { headers: { Authorization: `Bearer ${token}` } })
    const result = await response.json().catch(() => [])
    if (!response.ok) throw new Error(result.message || 'Không tải được vé.')
    saveBookings(result)
    return result
  }
  return getBookings()
}

export async function updateAdminBookingStatus(code, paymentStatus) {
  const token = getAdminApiToken()
  if (token) {
    const response = await fetch(apiUrl(`/admin/bookings/${encodeURIComponent(code)}`), {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paymentStatus }),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.message || 'Không cập nhật được vé.')
    saveBookings(getBookings().map((item) => item.code === code ? result : item))
    return result
  }
  const bookings = getBookings()
  const booking = bookings.find((item) => item.code === code)
  if (!booking) throw new Error('Không tìm thấy vé cần cập nhật.')
  booking.paymentStatus = paymentStatus
  saveBookings(bookings)
  return booking
}

export async function deleteAdminBooking(code) {
  const token = getAdminApiToken()
  if (token) {
    const response = await fetch(apiUrl(`/admin/bookings/${encodeURIComponent(code)}`), {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      throw new Error(result.message || 'Không xóa được vé.')
    }
  }
  saveBookings(getBookings().filter((booking) => booking.code !== code))
}

// Ghi thông báo khi admin xóa vé, gắn thông báo với ID/email của người mua.
export function createBookingDeletionNotification(booking) {
  if (!booking?.userId && !booking?.userEmail) return null
  let notifications = []
  try {
    notifications = JSON.parse(localStorage.getItem(BOOKING_NOTIFICATIONS_KEY) || '[]')
  } catch {}
  if (!Array.isArray(notifications)) notifications = []
  const notification = {
    id: `notice_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId: booking.userId == null ? '' : String(booking.userId),
    userEmail: String(booking.userEmail || '').toLowerCase(),
    type: 'booking-deleted',
    title: 'Vé đã bị hủy',
    message: `Vé ${booking.code} cho phim “${booking.movie}” (${booking.date} · ${booking.time}) đã bị quản trị viên xóa. Nếu cần hỗ trợ, vui lòng liên hệ rạp.`,
    bookingCode: booking.code,
    createdAt: new Date().toISOString(),
    read: false,
  }
  try {
    localStorage.setItem(BOOKING_NOTIFICATIONS_KEY, JSON.stringify([notification, ...notifications]))
  } catch {
    return null
  }
  return notification
}

// Lấy thông báo chỉ dành cho tài khoản đang đăng nhập (đối chiếu ID hoặc email).
export function loadUserNotifications(user) {
  if (!user) return []
  let notifications = []
  try {
    notifications = JSON.parse(localStorage.getItem(BOOKING_NOTIFICATIONS_KEY) || '[]')
  } catch {}
  if (!Array.isArray(notifications)) return []
  const email = String(user.email || '').toLowerCase()
  return notifications.filter((notice) =>
    (user.id != null && notice.userId && String(notice.userId) === String(user.id)) ||
    (email && notice.userEmail === email),
  )
}

// Đánh dấu các thông báo của tài khoản hiện tại là đã đọc.
export function markUserNotificationsRead(user) {
  if (!user) return
  const owned = new Set(loadUserNotifications(user).map((notice) => notice.id))
  let notifications = []
  try {
    notifications = JSON.parse(localStorage.getItem(BOOKING_NOTIFICATIONS_KEY) || '[]')
  } catch {}
  if (!Array.isArray(notifications)) return
  localStorage.setItem(
    BOOKING_NOTIFICATIONS_KEY,
    JSON.stringify(notifications.map((notice) => owned.has(notice.id) ? { ...notice, read: true } : notice)),
  )
}
// Đọc trạng thái ghế đã đặt theo từng suất chiếu.
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
// Mở lại các ghế thuộc vé khi vé bị xóa.
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

// Khóa lưu các ghế giữ tạm; danh sách shared được các tab cùng trình duyệt theo dõi.
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

// Xóa các lượt giữ đã hết hạn rồi đồng bộ danh sách còn hiệu lực.
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
  try {
    const response = await fetch(apiUrl('/seat-holds'))
    if (response.ok) {
      const holds = await response.json()
      if (Array.isArray(holds)) {
        saveSeatHolds(holds)
        return holds
      }
    }
  } catch {}
  return cleanExpiredHolds()
}

export function saveSeatHolds(holds) {
  writeSharedHolds(holds)
  try { localStorage.setItem(SEAT_HOLD_STORAGE_KEY, JSON.stringify(holds)) } catch {}
}

// Lấy các ghế đang giữ của một suất chiếu, có thể bỏ qua lượt giữ của chính mình.
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

// Giữ ghế tạm; trả về xung đột nếu ghế đã bị một lượt giữ khác chiếm.
export async function createSeatHold(key, seats, durationSeconds = DEFAULT_HOLD_DURATION_SECONDS) {
  const holds = cleanExpiredHolds()
  const currentHeld = getHeldSeats(key)
  const conflict = seats.find((s) => currentHeld.includes(s))
  if (conflict) {
    return { success: false, conflictSeat: conflict, message: `Ghế ${conflict} vừa được khách khác giữ chỗ!` }
  }
  try {
    const response = await fetch(apiUrl('/seat-holds'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, seats, durationSeconds }),
    })
    const result = await response.json().catch(() => ({}))
    if (response.status === 409) {
      return { success: false, conflictSeat: result.conflictSeat, message: result.message || 'Ghế vừa được khách khác giữ chỗ hoặc đặt vé.' }
    }
    if (response.ok && result.id) {
      saveSeatHolds([...cleanExpiredHolds(), result])
      return { success: true, hold: result }
    }
    if (response.status !== 404) {
      return { success: false, message: result.message || 'Không thể giữ ghế lúc này. Vui lòng thử lại.' }
    }
  } catch {}
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

// Hủy lượt giữ để các khách khác có thể chọn những ghế đó.
export async function releaseSeatHold(holdId) {
  if (!holdId) return
  try {
    await fetch(apiUrl(`/seat-holds/${encodeURIComponent(holdId)}`), { method: 'DELETE' })
  } catch {}
  const holds = cleanExpiredHolds().filter((h) => h.id !== holdId)
  saveSeatHolds(holds)
}

// Tra cứu lượt giữ ghế bằng mã lượt giữ.
export function getHoldById(holdId) {
  if (!holdId) return null
  const holds = cleanExpiredHolds()
  return holds.find((h) => h.id === holdId) || null
}

