const jsonServer = require('json-server')
const auth = require('json-server-auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')
const fs = require('fs')
const path = require('path')

// Load the admin password from the local, git-ignored .env file when no
// ADMIN_PASSWORD environment variable was provided by the host.
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

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', apiVersion: 'shared-bookings-v1' })
})

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

const ensureBookings = () => {
  if (!Array.isArray(router.db.get('bookings').value())) router.db.set('bookings', []).write()
  return router.db.get('bookings')
}

const requireUser = (req, res) => {
  const session = readTokenUser(req)
  if (!session) {
    res.status(401).json({ message: 'Vui lòng đăng nhập lại.' })
    return null
  }
  return session
}

const requireAdminUser = (req, res) => {
  const session = requireUser(req, res)
  if (!session) return null
  if (session.user.role !== 'admin') {
    res.status(403).json({ message: 'Bạn không có quyền quản trị.' })
    return null
  }
  return session
}

app.get('/my-bookings', (req, res) => {
  const session = requireUser(req, res)
  if (!session) return
  const ownerId = String(session.user.id)
  res.json(ensureBookings().filter((booking) => String(booking.userId) === ownerId).value())
})

app.get('/my-bookings/:code', (req, res) => {
  const session = requireUser(req, res)
  if (!session) return
  const booking = ensureBookings()
    .find((candidate) => candidate.code === req.params.code && String(candidate.userId) === String(session.user.id))
    .value()
  if (!booking) return res.status(404).json({ message: 'Không tìm thấy vé.' })
  res.json(booking)
})

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
  const booking = {
    code: String(payload.code),
    userId: String(session.user.id),
    userEmail: session.user.email || '',
    movie: String(payload.movie),
    theaterId: String(payload.theaterId || ''),
    theaterName: String(payload.theaterName || ''),
    date: String(payload.date || ''),
    time: String(payload.time || ''),
    seats: payload.seats.map(String),
    amount: Number(payload.amount || 0),
    paymentMethod: String(payload.paymentMethod || ''),
    paymentAccount: String(payload.paymentAccount || ''),
    paymentStatus: 'Đã thanh toán',
    createdAt: payload.createdAt || new Date().toISOString(),
  }
  collection.push(booking).write()
  res.status(201).json(booking)
})

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

app.get('/admin/bookings', (req, res) => {
  if (!requireAdminUser(req, res)) return
  res.json(ensureBookings().value())
})

app.patch('/admin/bookings/:code', (req, res) => {
  if (!requireAdminUser(req, res)) return
  const allowedStatuses = ['Đã thanh toán', 'Chờ xác nhận', 'Đã hoàn tiền', 'Đã hủy']
  if (!allowedStatuses.includes(req.body?.paymentStatus)) {
    return res.status(400).json({ message: 'Trạng thái vé không hợp lệ.' })
  }
  const collection = ensureBookings()
  if (!collection.find({ code: req.params.code }).value()) {
    return res.status(404).json({ message: 'Không tìm thấy vé.' })
  }
  const booking = collection.find({ code: req.params.code }).assign({ paymentStatus: req.body.paymentStatus }).write()
  res.json(booking)
})

app.delete('/admin/bookings/:code', (req, res) => {
  if (!requireAdminUser(req, res)) return
  const collection = ensureBookings()
  if (!collection.find({ code: req.params.code }).value()) {
    return res.status(404).json({ message: 'Không tìm thấy vé.' })
  }
  collection.remove({ code: req.params.code }).write()
  res.status(204).end()
})

let nodemailer = null
try {
  nodemailer = require('nodemailer')
} catch {}

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
