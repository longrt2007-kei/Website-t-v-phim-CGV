const jsonServer = require('json-server')
const auth = require('json-server-auth')

const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

app.db = router.db
app.use(middlewares)
app.use(jsonServer.bodyParser)

// Chỉ chủ tài khoản được đọc/sửa hồ sơ người dùng của chính mình.
app.use(auth.rewriter({ users: 600 }))
app.use(auth)
app.use(router)

const PORT = Number(process.env.PORT) || 3001
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log(`Auth API running at http://${HOST}:${PORT}`)
})
