const jsonServer = require('json-server')
const auth = require('json-server-auth')
const bcrypt = require('bcryptjs')

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
