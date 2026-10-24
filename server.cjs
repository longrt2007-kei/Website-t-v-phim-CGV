const jsonServer = require('json-server')
const auth = require('json-server-auth')

const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const dbPath = path.join(__dirname, 'db.json')
const adminConfig = require('./admin-credentials.json')

app.db = router.db
app.use(middlewares)
app.use(jsonServer.bodyParser)

app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body || {}
  const validUser = String(username || '').trim() === adminConfig.username
  const validPassword = await bcrypt.compare(String(password || ''), adminConfig.passwordHash)
  if (!validUser || !validPassword) return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu admin chưa đúng.' })
  res.json({ username: adminConfig.username, role: 'admin' })
})

// Seat reservations are stored centrally and checked in one server-side operation.
app.get('/bookings', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  res.json(db.bookings || [])
})
app.post('/bookings', (req, res) => {
  const booking = req.body || {}
  if (!booking.code || !booking.movie || !booking.theaterId || !booking.date || !booking.time || !Array.isArray(booking.seats) || !booking.seats.length) return res.status(400).json({ error: 'Thông tin đặt vé không hợp lệ.' })
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  db.bookings ||= []
  const active = db.bookings.filter(b => !['Đã hủy', 'Đã hoàn tiền'].includes(b.paymentStatus))
  const conflict = active.find(b => b.movie === booking.movie && String(b.theaterId) === String(booking.theaterId) && b.date === booking.date && b.time === booking.time && (b.seats || []).some(seat => booking.seats.includes(seat)))
  if (conflict) return res.status(409).json({ error: 'Một hoặc nhiều ghế vừa được người khác đặt. Vui lòng chọn lại ghế.' })
  db.bookings.unshift(booking)
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  res.status(201).json(booking)
})
app.patch('/bookings/:code', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  db.bookings ||= []
  const booking = db.bookings.find(b => b.code === req.params.code)
  if (!booking) return res.status(404).json({ error: 'Không tìm thấy vé.' })
  Object.assign(booking, req.body || {})
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  res.json(booking)
})
app.delete('/bookings/:code', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  db.bookings ||= []
  db.bookings = db.bookings.filter(b => b.code !== req.params.code)
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
  res.status(204).end()
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
