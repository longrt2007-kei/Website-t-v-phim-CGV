const jsonServer = require('json-server')
const auth = require('json-server-auth')
const bcrypt = require('bcryptjs')
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
