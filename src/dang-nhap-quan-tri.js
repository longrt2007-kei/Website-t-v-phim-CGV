import './auth-pages.css'
import { adminReturnUrl, isAdminAuthenticated, loginAdmin } from './shared/admin-auth.js'

const destination = adminReturnUrl()
if (isAdminAuthenticated()) location.replace(destination)

document.querySelector('#app').innerHTML =
  `<main class="auth-shell">
    <section class="auth-brand">
    <a class="brand-logo" href="/trangchu.html">CGV<span>STUDIO</span>
    </a>
    <div class="auth-copy">
    <span class="eyebrow">KHU VỰC QUẢN TRỊ</span>
    <h1>Quản lý<br>rạp chiếu phim.</h1>
    <p>Đăng nhập bằng tài khoản quản trị để cập nhật phim, rạp, suất chiếu và vé.</p>
    <div class="auth-points">
    <span>Quản lý phim</span>
    <span>Quản lý rạp</span>
    <span>Quản lý vé</span>
    </div>
    </div>
    <small style="color:#657188;position:relative;z-index:1">CGV Cinema Studio · 2026</small>
    </section>
    <section class="auth-panel">
    <div style="width:min(100%,480px)">
    <a class="auth-back" href="/trangchu.html">← Về trang chủ</a>
    <div class="auth-card">
    <h2>Đăng nhập quản trị</h2>
    <p class="auth-sub">Chỉ tài khoản có quyền admin mới được truy cập.</p>
    <form class="auth-form" id="adminLoginForm">
    <label>Tài khoản<input type="text" id="username" autocomplete="username" placeholder="cgvteam" required>
    </label>
    <label>Mật khẩu<input type="password" id="password" autocomplete="current-password" minlength="4" required>
    </label>
    <p class="auth-error" id="error">
    </p>
    <button class="auth-submit" id="submit" type="submit">ĐĂNG NHẬP</button>
    </form>
    </div>
    </div>
    </section>
    </main>`

document.querySelector('#adminLoginForm').addEventListener('submit', async (event) => {
  event.preventDefault()
  const button = document.querySelector('#submit')
  const error = document.querySelector('#error')
  error.textContent = ''
  button.disabled = true
  button.textContent = 'ĐANG ĐĂNG NHẬP…'
  try {
    await loginAdmin(
      document.querySelector('#username').value,
      document.querySelector('#password').value,
    )
    location.replace(destination)
  } catch (exception) {
    error.textContent = /Cannot find user|Incorrect password/i.test(exception.message)
      ? 'Tài khoản hoặc mật khẩu admin chưa đúng.'
      : exception.message
  } finally {
    button.disabled = false
    button.textContent = 'ĐĂNG NHẬP'
  }
})
