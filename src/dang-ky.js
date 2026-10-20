import './auth-pages.css'
import { isAuthenticated, registerUser, returnUrl } from './shared/auth.js'

if (isAuthenticated()) location.replace(returnUrl('/tai-khoan.html'))

const app = document.querySelector('#app')
app.innerHTML = `<main class="auth-shell">
  <section class="auth-brand">
    <a class="brand-logo" href="/trangchu.html">CGV<span>CINEMAS</span></a>
    <div class="auth-copy">
      <span class="eyebrow">TẠO TÀI KHOẢN</span>
      <h1>Bắt đầu<br>buổi hẹn phim.</h1>
      <p>Tạo tài khoản để có khu vực thành viên riêng, truy cập vé đã đặt và quản lý trải nghiệm của bạn.</p>
      <div class="auth-points">
        <span>Đăng ký nhanh</span>
        <span>Mật khẩu mã hóa</span>
        <span>Phiên đăng nhập an toàn</span>
      </div>
    </div>
    <small style="color:#657188;position:relative;z-index:1">CGV Cinemas · Trải nghiệm điện ảnh của bạn</small>
  </section>
  <section class="auth-panel">
    <div style="width:min(100%,480px)">
      <a class="auth-back" href="/trangchu.html">← Về trang chủ</a>
      <div class="auth-card">
        <h2>Đăng ký</h2>
        <p class="auth-sub">Chỉ mất chưa đến một phút.</p>
        <form class="auth-form" id="registerForm">
          <label>Họ và tên<input type="text" id="name" autocomplete="name" minlength="2" placeholder="Nguyễn Văn A" required></label>
          <label>Email<input type="email" id="email" autocomplete="email" placeholder="ban@email.com" required></label>
          <label>Mật khẩu<input type="password" id="password" autocomplete="new-password" minlength="6" placeholder="Ít nhất 6 ký tự" required></label>
          <label>Nhập lại mật khẩu<input type="password" id="confirm" autocomplete="new-password" minlength="6" required></label>
          <p class="auth-error" id="error" role="alert" aria-live="polite"></p>
          <button class="auth-submit" id="submit" type="submit">TẠO TÀI KHOẢN</button>
        </form>
        <p class="auth-switch">Đã có tài khoản? <a id="loginLink" href="/dang-nhap.html">Đăng nhập</a></p>
      </div>
    </div>
  </section>
</main>`

const returnTarget = returnUrl('/trangchu.html')
document.querySelector('#loginLink').href =
  `/dang-nhap.html?return=${encodeURIComponent(returnTarget)}`

document.querySelector('#registerForm').addEventListener('submit', async (event) => {
  event.preventDefault()
  const button = document.querySelector('#submit')
  const error = document.querySelector('#error')
  const name = document.querySelector('#name').value.trim()
  const email = document.querySelector('#email').value.trim()
  const password = document.querySelector('#password').value
  const confirmation = document.querySelector('#confirm').value
  error.textContent = ''

  if (name.length < 2) {
    error.textContent = 'Vui lòng nhập họ tên có ít nhất 2 ký tự.'
    return
  }
  if (password !== confirmation) {
    error.textContent = 'Hai mật khẩu chưa khớp.'
    return
  }

  button.disabled = true
  button.textContent = 'ĐANG TẠO TÀI KHOẢN…'
  try {
    await registerUser({ name, email, password })
    location.replace(returnTarget)
  } catch (exception) {
    error.textContent = exception.message
  } finally {
    button.disabled = false
    button.textContent = 'TẠO TÀI KHOẢN'
  }
})
