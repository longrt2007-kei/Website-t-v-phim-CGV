const jsonServer = require('json-server')
const auth = require('json-server-auth')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const users = router.db.get('users')
const adminUsername = 'cgvteam'
const adminEmail = `${adminUsername}@admin.local`
const adminPassword = String(process.env.ADMIN_PASSWORD || '')
const existingAdmin = users.find({ role: 'admin' }).value()

if (!existingAdmin && adminPassword) {
  const allUsers = users.value()
  const nextId = Math.max(0, ...allUsers.map((user) => Number(user.id) || 0)) + 1
  users
    .push({
      id: nextId,
      username: adminUsername,
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      name: 'CGV Administrator',
      fullName: 'CGV Administrator',
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
    .write()
} else if (
  existingAdmin &&
  adminPassword &&
  (existingAdmin.username !== adminUsername ||
    existingAdmin.email !== adminEmail ||
    !bcrypt.compareSync(adminPassword, existingAdmin.password || ''))
) {
  users
    .find({ role: 'admin' })
    .assign({
      username: adminUsername,
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
    })
    .write()
} else if (!adminPassword) {
  console.warn(
    'ADMIN_PASSWORD chưa được cấu hình; tài khoản quản trị không được tạo hoặc cập nhật.',
  )
}

app.db = router.db
app.use(middlewares)
app.use(jsonServer.bodyParser)

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const publicUrl = String(process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`).replace(/\/$/, '')
const qrImageUrl = (code) => `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(`${publicUrl}/tickets/${code}`)}`

app.post('/bookings', async (req, res) => {
  const input = req.body || {}
  const email = String(input.userEmail || '').trim().toLowerCase()
  const seats = Array.isArray(input.seats) ? [...new Set(input.seats.map(String))] : []
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !input.movie || !input.theaterId || !input.date || !input.time || !seats.length || !input.code) {
    return res.status(400).json({ message: 'Thông tin đặt vé hoặc email không hợp lệ.' })
  }
  const bookings = router.db.get('bookings')
  const duplicate = bookings.find({ code: input.code }).value()
  if (duplicate) return res.status(409).json({ message: 'Mã vé đã tồn tại, vui lòng đặt lại.' })
  const booking = {
    code: String(input.code).slice(0, 32), userId: input.userId || null, userEmail: email,
    movie: String(input.movie).slice(0, 160), theaterId: String(input.theaterId).slice(0, 80),
    theaterName: String(input.theaterName || input.theaterId).slice(0, 160), date: String(input.date).slice(0, 40),
    time: String(input.time).slice(0, 20), seats, amount: Number(input.amount) || 0,
    paymentMethod: String(input.paymentMethod || 'QR BIDV'), paymentAccount: String(input.paymentAccount || ''),
    paymentStatus: 'Đã thanh toán', createdAt: new Date().toISOString(),
  }
  bookings.unshift(booking).write()
  let emailSent = false
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } })
      const qr = qrImageUrl(booking.code)
      const ticketUrl = `${publicUrl}/tickets/${encodeURIComponent(booking.code)}`
      await transporter.sendMail({
        from: `CGV Cinemas <${process.env.GMAIL_USER}>`, to: email, subject: `Vé xem phim ${booking.code} - CGV Cinemas`,
        html: `<div style="font-family:Arial,sans-serif;color:#182033;max-width:600px;margin:auto"><h2>Đặt vé thành công</h2><p>Xin chào, vé của bạn đã được ghi nhận.</p><h3>${escapeHtml(booking.movie)}</h3><p><b>Mã vé:</b> ${escapeHtml(booking.code)}<br><b>Rạp:</b> ${escapeHtml(booking.theaterName)}<br><b>Ngày / suất:</b> ${escapeHtml(booking.date)} · ${escapeHtml(booking.time)}<br><b>Ghế:</b> ${escapeHtml(seats.join(', '))}<br><b>Tổng tiền:</b> ${booking.amount.toLocaleString('vi-VN')}đ</p><p><a href="${escapeHtml(ticketUrl)}" style="display:inline-block;background:#d71920;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold">XEM THÔNG TIN VÉ</a></p><p>Đưa mã QR này cho nhân viên quét khi vào rạp:</p><a href="${escapeHtml(ticketUrl)}"><img src="${qr}" width="240" height="240" alt="QR vé ${escapeHtml(booking.code)}"></a><p>Liên kết vé: <a href="${escapeHtml(ticketUrl)}">${escapeHtml(ticketUrl)}</a></p></div>`,
      })
      emailSent = true
    } catch (error) { console.error('Gửi email vé thất bại:', error.message) }
  }
  res.status(201).json({ booking, emailSent })
})

app.get('/tickets/:code', (req, res) => {
  const booking = router.db.get('bookings').find({ code: req.params.code }).value()
  if (!booking) return res.status(404).type('html').send('<h1>Vé không hợp lệ</h1>')
  res.type('html').send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Kiểm tra vé CGV</title><main style="font:16px Arial;max-width:520px;margin:40px auto;padding:24px;border:1px solid #ddd;border-radius:16px"><h1 style="color:#13804a">✓ Vé hợp lệ</h1><h2>${escapeHtml(booking.movie)}</h2><p><b>Mã vé:</b> ${escapeHtml(booking.code)}</p><p><b>Rạp:</b> ${escapeHtml(booking.theaterName)}</p><p><b>Ngày / suất:</b> ${escapeHtml(booking.date)} · ${escapeHtml(booking.time)}</p><p><b>Ghế:</b> ${escapeHtml(booking.seats.join(', '))}</p><p><b>Trạng thái:</b> ${escapeHtml(booking.paymentStatus)}</p></main>`)
})

app.use((req, res, next) => {
  if (req.method === 'POST' && ['/register', '/signup'].includes(req.path.toLowerCase())) {
    req.body.role = 'customer'
  }
  next()
})

// Chỉ chủ tài khoản được đọc/sửa hồ sơ người dùng của chính mình.
app.use(auth.rewriter({ users: 600 }))
app.use(auth)
app.use(router)

const PORT = Number(process.env.PORT) || 3001
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log(`Auth API running at http://${HOST}:${PORT}`)
})
