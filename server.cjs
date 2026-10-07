const jsonServer = require('json-server')
const auth = require('json-server-auth')
const bcrypt = require('bcryptjs')

const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const users = router.db.get('users')
if (!users.find({ role: 'admin' }).value()) {
  const allUsers = users.value()
  const nextId = Math.max(0, ...allUsers.map(user => Number(user.id) || 0)) + 1
  users.push({
    id: nextId,
    email: String(process.env.ADMIN_EMAIL || 'admin@cgv.vn').trim().toLowerCase(),
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@123', 10),
    name: 'CGV Administrator',
    fullName: 'CGV Administrator',
    role: 'admin',
    createdAt: new Date().toISOString(),
  }).write()
}

app.db = router.db
app.use(middlewares)
app.use(jsonServer.bodyParser)

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
