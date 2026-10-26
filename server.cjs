// Máy chủ JSON Server: xác thực khách, lưu vé và chia sẻ trạng thái giữ ghế.
const jsonServer = require('json-server')
const auth = require('json-server-auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')
const fs = require('fs')
const path = require('path')

// Đọc mật khẩu admin từ .env nếu máy chủ chưa được cấu hình biến môi trường.
if (!process.env.ADMIN_PASSWORD) {
  const envPath = path.join(__dirname, '.env')
  if (fs.existsSync(envPath)) {
    const adminPasswordLine = fs
      .readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .find((line) => /^\s*ADMIN_PASSWORD\s*=/.test(line))
    if (adminPasswordLine) {
      process.env.ADMIN_PASSWORD = adminPasswordLine
        .replace(/^\s*ADMIN_PASSWORD\s*=\s*/, '')
        .trim()
        .replace(/^(?:"(.*)"|'(.*)')$/, (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted)
    }
  }
}

const app = jsonServer.create()
const defaultDbFile = path.join(__dirname, 'db.json')
const dbFile = process.env.DB_FILE || defaultDbFile
if (!fs.existsSync(dbFile)) {
  fs.mkdirSync(path.dirname(dbFile), { recursive: true })
  fs.copyFileSync(defaultDbFile, dbFile)
}
const router = jsonServer.router(dbFile)
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

// Endpoint kiểm tra nhanh API có đang hoạt động hay không.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', apiVersion: 'shared-bookings-v1' })
})

// Kiểm tra Bearer token và tìm tài khoản tương ứng trong cơ sở dữ liệu.
const readTokenUser = (req) => {
  const [scheme, token] = String(req.headers.authorization || '').split(' ')
  if (scheme !== 'Bearer' || !token) return null
  try {
    const claims = jwt.verify(token, JWT_SECRET_KEY)
    const user = users.find((candidate) => String(candidate.id) === String(claims.sub)).value()
    return user ? { claims, user } : null
  } catch {
    return null
  }
}

// Đảm bảo collection vé tồn tại trước khi đọc/ghi.
const ensureBookings = () => {
  if (!Array.isArray(router.db.get('bookings').value())) router.db.set('bookings', []).write()
  return router.db.get('bookings')
}

// Đảm bảo collection giữ ghế tồn tại và loại lượt giữ đã hết hạn.
const ensureSeatHolds = () => {
  if (!Array.isArray(router.db.get('seatHolds').value())) router.db.set('seatHolds', []).write()
  const now = Date.now()
  const active = router.db.get('seatHolds').value().filter((hold) => Number(hold.expiresAt) > now)
  if (active.length !== router.db.get('seatHolds').value().length) router.db.set('seatHolds', active).write()
  return router.db.get('seatHolds')
}

// Trả danh sách ghế đang giữ, có thể lọc theo suất chiếu.
app.get('/seat-holds', (req, res) => {
  const holds = ensureSeatHolds().value()
  const key = String(req.query.key || '')
  res.json(key ? holds.filter((hold) => hold.key === key) : holds)
})

// Giữ ghế tạm thời; từ chối nếu ghế đã có người giữ hoặc đặt.
app.post('/seat-holds', (req, res) => {
  const { key, seats, durationSeconds } = req.body || {}
  if (!key || !Array.isArray(seats) || !seats.length) return res.status(400).json({ message: 'Thiếu thông tin ghế cần giữ.' })
  const requestedSeats = [...new Set(seats.map(String))]
  const holds = ensureSeatHolds()
  const currentHold = holds.value().find((hold) => hold.key === String(key) && (hold.seats || []).some((seat) => requestedSeats.includes(String(seat))))
  const [movie, theaterId, date, time, room = '01'] = String(key).split('__')
  const booked = ensureBookings().value().find((booking) =>
    String(booking.movie) === String(movie) && String(booking.theaterId) === String(theaterId) && String(booking.date) === String(date) && String(booking.time) === String(time) && String(booking.room || '01') === String(room) &&
    !['Đã hủy', 'Đã hoàn tiền'].includes(booking.paymentStatus) && (booking.seats || []).some((seat) => requestedSeats.includes(String(seat))),
  )
  const conflictSeat = currentHold?.seats?.map(String).find((seat) => requestedSeats.includes(seat)) || booked?.seats?.map(String).find((seat) => requestedSeats.includes(seat))
  if (conflictSeat) return res.status(409).json({ message: `Ghế ${conflictSeat} vừa được khách khác giữ chỗ hoặc đặt vé.`, conflictSeat })
  const now = Date.now()
  const duration = Math.min(900, Math.max(30, Number(durationSeconds) || 300))
  const hold = {
    id: `hold_${now}_${Math.random().toString(36).slice(2, 8)}`,
    key: String(key),
    seats: requestedSeats,
    createdAt: now,
    expiresAt: now + duration * 1000,
    durationSeconds: duration,
  }
  holds.push(hold).write()
  res.status(201).json(hold)
})

// Giải phóng một lượt giữ ghế theo mã.
app.delete('/seat-holds/:id', (req, res) => {
  ensureSeatHolds().remove({ id: req.params.id }).write()
  res.status(204).end()
})

// Trả các ghế đã đặt trong suất/phòng để giao diện đánh dấu không khả dụng.
app.get('/show-seats', (req, res) => {
  const { movie, theaterId, date, time, room = '01' } = req.query
  if (!movie || !theaterId || !date || !time) return res.status(400).json({ message: 'Thiếu thông tin suất chiếu.' })
  const key = `${movie}__${theaterId}__${date}__${time}`
  const occupied = ensureBookings().value()
    .filter((booking) => `${booking.movie}__${booking.theaterId}__${booking.date}__${booking.time}` === key && String(booking.room || '01') === String(room) && booking.paymentStatus !== 'Đã hủy' && booking.paymentStatus !== 'Đã hoàn tiền')
    .flatMap((booking) => booking.seats || [])
  res.json({ seats: [...new Set(occupied)] })
})

// Chỉ trả số ghế và số khách theo phòng cho sơ đồ quản trị, không trả thông tin cá nhân.
app.get('/room-occupancy', (_req, res) => {
  const rooms = new Map()
  for (const booking of ensureBookings().value()) {
    if (['Đã hủy', 'Đã hoàn tiền'].includes(booking.paymentStatus)) continue
    const theaterId = String(booking.theaterId || '')
    const room = String(booking.room || '01')
    const key = `${theaterId}__${room}`
    if (!rooms.has(key)) rooms.set(key, { theaterId, room, seats: new Set(), customers: new Set(), bookingCount: 0 })
    const summary = rooms.get(key)
    for (const seat of booking.seats || []) summary.seats.add(String(seat))
    summary.customers.add(String(booking.userId || booking.userEmail || booking.code))
    summary.bookingCount += 1
  }
  res.json([...rooms.values()].map((summary) => ({
    theaterId: summary.theaterId,
    room: summary.room,
    seats: [...summary.seats],
    seatCount: summary.seats.size,
    customerCount: summary.customers.size,
    bookingCount: summary.bookingCount,
  })))
})

// Từ chối yêu cầu nếu token khách thiếu, sai hoặc hết hạn.
const requireUser = (req, res) => {
  const session = readTokenUser(req)
  if (!session) {
    res.status(401).json({ message: 'Vui lòng đăng nhập lại.' })
    return null
  }
  return session
}

// Kiểm tra phiên hợp lệ và quyền admin trước khi thao tác quản trị.
const requireAdminUser = (req, res) => {
  const session = requireUser(req, res)
  if (!session) return null
  if (session.user.role !== 'admin') {
    res.status(403).json({ message: 'Bạn không có quyền quản trị.' })
    return null
  }
  return session
}

// Đăng nhập admin demo và tạo JWT cho API quản trị.
app.post('/admin-demo-login', (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  const admin = users.find({ role: 'admin' }).value()
  const validPassword = adminPassword ? password === adminPassword : password === '2007'
  if (username !== adminUsername || !validPassword || !admin) {
    return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu quản trị không hợp lệ.' })
  }
  const accessToken = jwt.sign(
    { sub: String(admin.id), email: admin.email || adminEmail },
    JWT_SECRET_KEY,
    { expiresIn: '12h' },
  )
  res.json({
    accessToken,
    user: { id: String(admin.id), name: admin.name || 'Quản trị viên', email: admin.email || adminEmail, role: 'admin' },
  })
})

// Trả vé thuộc đúng tài khoản đang đăng nhập.
app.get('/my-bookings', (req, res) => {
  const session = requireUser(req, res)
  if (!session) return
  const ownerId = String(session.user.id)
  res.json(ensureBookings().filter((booking) => String(booking.userId) === ownerId).value())
})

// Tra cứu một vé, chỉ cho chủ tài khoản đọc được.
app.get('/my-bookings/:code', (req, res) => {
  const session = requireUser(req, res)
  if (!session) return
  const booking = ensureBookings()
    .find((candidate) => candidate.code === req.params.code && String(candidate.userId) === String(session.user.id))
    .value()
  if (!booking) return res.status(404).json({ message: 'Không tìm thấy vé.' })
  res.json(booking)
})

// Tạo vé cho khách; kiểm tra mã vé và ghế trùng trước khi lưu.
app.post('/my-bookings', (req, res) => {
  const session = requireUser(req, res)
  if (!session) return
  const payload = req.body || {}
  if (!payload.code || !payload.movie || !Array.isArray(payload.seats) || !payload.seats.length) {
    return res.status(400).json({ message: 'Thông tin vé chưa đầy đủ.' })
  }
  const collection = ensureBookings()
  const existing = collection.find({ code: String(payload.code) }).value()
  if (existing) return res.status(409).json({ message: 'Mã vé đã tồn tại.' })
  const requestedSeats = payload.seats.map(String)
  const conflict = collection.value().find((booking) =>
    booking.movie === String(payload.movie) && booking.theaterId === String(payload.theaterId || '') && String(booking.room || '01') === String(payload.room || '01') &&
    booking.date === String(payload.date || '') && booking.time === String(payload.time || '') &&
    booking.paymentStatus !== 'Đã hủy' && booking.paymentStatus !== 'Đã hoàn tiền' &&
    (booking.seats || []).some((seat) => requestedSeats.includes(String(seat))),
  )
  if (conflict) return res.status(409).json({ message: `Ghế ${requestedSeats.find((seat) => conflict.seats.map(String).includes(seat))} đã có người đặt.` })
  const booking = {
    code: String(payload.code),
    userId: String(session.user.id),
    userEmail: session.user.email || '',
    movie: String(payload.movie),
    theaterId: String(payload.theaterId || ''),
    theaterName: String(payload.theaterName || ''),
    room: String(payload.room || '01'),
    date: String(payload.date || ''),
    time: String(payload.time || ''),
    seats: requestedSeats,
    ticketCodes: requestedSeats.map((_, index) => String(payload.ticketCodes?.[index] || (index === 0 ? payload.code : `${payload.code}-${String(index + 1).padStart(2, '0')}`))),
    amount: Number(payload.amount || 0),
    paymentMethod: String(payload.paymentMethod || ''),
    paymentAccount: String(payload.paymentAccount || ''),
    paymentStatus: 'Đã thanh toán',
    createdAt: payload.createdAt || new Date().toISOString(),
  }
  collection.push(booking).write()
  res.status(201).json(booking)
})

// Cho phép chủ tài khoản xóa vé của mình.
app.delete('/my-bookings/:code', (req, res) => {
  const session = requireUser(req, res)
  if (!session) return
  const collection = ensureBookings()
  const booking = collection
    .find((candidate) => candidate.code === req.params.code && String(candidate.userId) === String(session.user.id))
    .value()
  if (!booking) return res.status(404).json({ message: 'Không tìm thấy vé.' })
  collection.remove({ code: booking.code }).write()
  res.status(204).end()
})

// Trả toàn bộ danh sách vé cho admin đã xác thực.
app.get('/admin/bookings', (req, res) => {
  if (!requireAdminUser(req, res)) return
  res.json(ensureBookings().value())
})

// Cập nhật trạng thái hoặc ghế của vé, đồng thời kiểm tra xung đột ghế.
app.patch('/admin/bookings/:code', (req, res) => {
  if (!requireAdminUser(req, res)) return
  const allowedStatuses = ['Đã thanh toán', 'Chờ xác nhận', 'Đã hoàn tiền', 'Đã hủy']
  if (req.body?.paymentStatus != null && !allowedStatuses.includes(req.body.paymentStatus)) {
    return res.status(400).json({ message: 'Trạng thái vé không hợp lệ.' })
  }
  const collection = ensureBookings()
  const current = collection.find({ code: req.params.code }).value()
  if (!current) return res.status(404).json({ message: 'Không tìm thấy vé.' })
  const updates = {}
  if (req.body?.paymentStatus != null) updates.paymentStatus = req.body.paymentStatus
  if (req.body?.seats != null) {
    if (!Array.isArray(req.body.seats) || !req.body.seats.length) {
      return res.status(400).json({ message: 'Vé cần có ít nhất một ghế.' })
    }
    const seats = [...new Set(req.body.seats.map(String))]
    if (seats.some((seat) => !/^[A-H](?:[1-9]|10)$/.test(seat))) {
      return res.status(400).json({ message: 'Mã ghế không hợp lệ.' })
    }
    const conflict = collection.value().find((booking) =>
      booking.code !== current.code && booking.movie === current.movie && booking.theaterId === current.theaterId && String(booking.room || '01') === String(current.room || '01') &&
      booking.date === current.date && booking.time === current.time &&
      !['Đã hủy', 'Đã hoàn tiền'].includes(booking.paymentStatus) &&
      (booking.seats || []).some((seat) => seats.includes(String(seat))),
    )
    if (conflict) {
      const seat = conflict.seats.map(String).find((value) => seats.includes(value))
      return res.status(409).json({ message: `Ghế ${seat} đã có vé khác.` })
    }
    const key = `${current.movie}__${current.theaterId}__${current.date}__${current.time}__${String(current.room || '01')}`
    const holdConflict = ensureSeatHolds().value().find((hold) => hold.key === key && (hold.seats || []).some((seat) => seats.includes(String(seat))))
    if (holdConflict) {
      const seat = holdConflict.seats.map(String).find((value) => seats.includes(value))
      return res.status(409).json({ message: `Ghế ${seat} đang được khách khác giữ chỗ.` })
    }
    const currentCount = Math.max(1, (current.seats || []).length)
    const unitPrice = Number(current.amount || 85000 * currentCount) / currentCount
    updates.seats = seats
    updates.amount = Math.round(unitPrice * seats.length)
  }
  if (!Object.keys(updates).length) return res.json(current)
  const booking = collection.find({ code: req.params.code }).assign(updates).write()
  res.json(booking)
})

// Xóa vé khỏi danh sách quản trị sau khi kiểm tra quyền admin.
app.delete('/admin/bookings/:code', (req, res) => {
  if (!requireAdminUser(req, res)) return
  const collection = ensureBookings()
  if (!collection.find({ code: req.params.code }).value()) {
    return res.status(404).json({ message: 'Không tìm thấy vé.' })
  }
  collection.remove({ code: req.params.code }).write()
  res.status(204).end()
})

// Nạp thư viện email nếu đã cài đặt; nếu không thì endpoint chỉ ghi nhận demo.
let nodemailer = null
try {
  nodemailer = require('nodemailer')
} catch {}

// Gửi vé qua Gmail nếu có cấu hình; nếu chưa có thì trả trạng thái mô phỏng.
app.post('/send-ticket-email', async (req, res) => {
  const { email, booking, htmlContent } = req.body || {}
  if (!email || !booking) {
    return res.status(400).json({ success: false, message: 'Thiếu email hoặc thông tin vé.' })
  }

  let realEmailSent = false
  if (nodemailer && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })
      await transporter.sendMail({
        from: `CGV Cinemas <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `[CGV Cinemas] Xác nhận vé xem phim ${booking.code} - ${booking.movie}`,
        html: htmlContent || `<p>Vé xem phim CGV mã: <b>${booking.code}</b> cho phim <b>${booking.movie}</b>.</p>`,
      })
      realEmailSent = true
    } catch (err) {
      console.warn('Lỗi khi gửi email qua Gmail SMTP:', err.message)
    }
  }

  console.log(`[Email Service] Gửi vé ${booking.code} tới ${email} (Thực tế: ${realEmailSent ? 'Thành công' : 'Mô phỏng/Ghi nhận'})`)
  res.status(200).json({
    success: true,
    realEmailSent,
    message: `Đã gửi vé thành công tới ${email}`,
    email,
    code: booking.code,
  })
})

// Ép tài khoản đăng ký mang role customer và chặn tự cấp quyền admin.
app.use((req, res, next) => {
  if (req.method === 'POST' && ['/register', '/signup'].includes(req.path.toLowerCase())) {
    req.body.role = 'customer'
  }
  if (req.method === 'POST' && req.path === '/users') {
    return res.status(403).json({ message: 'Tạo tài khoản chỉ được thực hiện qua đăng ký.' })
  }
  if (['PATCH', 'PUT'].includes(req.method) && /^\/users\/[^/]+$/.test(req.path) && req.body?.role) {
    const session = readTokenUser(req)
    if (session && session.user.role !== 'admin' && req.body.role !== 'customer') {
      return res.status(403).json({ message: 'Không thể tự thay đổi quyền tài khoản.' })
    }
  }
  next()
})

// Chỉ chủ tài khoản được đọc/sửa hồ sơ người dùng của chính mình.
app.all('/bookings*', (_req, res) => {
  res.status(404).json({ message: 'Không tìm thấy tài nguyên.' })
})
app.use(auth.rewriter({ users: 600 }))
app.use(auth)
app.use(router)

const PORT = Number(process.env.PORT) || 3001
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log(`Auth API running at http://${HOST}:${PORT}`)
})
