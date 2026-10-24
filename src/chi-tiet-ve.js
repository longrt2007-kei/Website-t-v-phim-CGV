// Trang vé điện tử: thông tin vé, mã vạch/QR, in vé và tạo bản nháp email.
import './styles/ticket.css'
import { generateBarcodeSvg } from './shared/barcode.js'
import { getBookings, money, formatDateTime, loadUserBooking } from './shared/booking-storage.js'
import { getCachedUser } from './shared/auth.js'

async function initTicketPage() {
// Đọc mã vé từ URL và tìm vé tương ứng trong localStorage.
const app = document.querySelector('#app')
const params = new URLSearchParams(window.location.search)
const requestedCode = params.get('code')

const allBookings = getBookings()
let booking = allBookings.find((b) => b.code === requestedCode)
if (!booking && requestedCode) {
  try {
    booking = await loadUserBooking(requestedCode)
  } catch {}
}

// Nếu không tìm thấy theo mã trên URL, lấy vé mới nhất
if (!booking && allBookings.length > 0) {
  booking = allBookings[0]
}

// Nếu chưa có vé nào được lưu (trường hợp xem thử), tạo vé mẫu trực quan
if (!booking) {
  booking = {
    code: 'CGV20268899',
    movie: 'Dune: Hành Tinh Cát - Phần 2',
    theaterName: 'CGV Vincom Center Bà Triệu',
    theaterId: 'cgv-vincom',
    date: '15/10/2026',
    time: '19:30',
    seats: ['F7', 'F8'],
    amount: 170000,
    paymentMethod: 'QR BIDV',
    paymentStatus: 'Đã thanh toán',
    createdAt: new Date().toISOString(),
    userEmail: getCachedUser()?.email || 'khachhang@cgv.vn',
  }
}

const currentUser = getCachedUser()
const defaultEmail = booking.userEmail || currentUser?.email || ''
// Mã vạch là SVG tạo tại chỗ; QR là ảnh do dịch vụ tạo QR bên ngoài cung cấp.
const barcodeSvg = generateBarcodeSvg(booking.code, { height: 80, barWidth: 2, showText: true })
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=8&data=${encodeURIComponent(
  `${window.location.origin}/chi-tiet-ve.html?code=${booking.code}`,
)}`

/**
 * Tạo nội dung HTML thư xác nhận gửi về email
 */
// Tạo HTML thư xác nhận để hiển thị trong cửa sổ xem trước.
function createTicketEmailHtml(b) {
  return `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;color:#1e293b;">
      <div style="background:#111827;padding:24px;border-bottom:3px solid #d71920;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:1px;">CGV <span style="color:#d71920;">CINEMAS</span></h1>
        <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;text-transform:uppercase;">Xác nhận đặt vé thành công</p>
      </div>
      <div style="padding:28px 24px;">
        <p style="font-size:16px;margin:0 0 16px;">Xin chào quý khách,</p>
        <p style="font-size:14px;color:#475569;margin:0 0 20px;line-height:1.6;">
          Chúc mừng quý khách đã đặt vé thành công tại <strong>CGV Cinemas</strong>. Dưới đây là thông tin chi tiết và mã vạch vé để quý khách quét lấy vé tại quầy hoặc máy Kiosk tự động.
        </p>

        <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px;">
          <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:8px;">MÃ VẠCH QUÉT TẠI QUẦY / KIOSK</div>
          <div style="background:#ffffff;padding:12px;border-radius:8px;display:inline-block;max-width:100%;">
            ${barcodeSvg}
          </div>
          <p style="font-size:12px;color:#64748b;margin:10px 0 0;">Mã vé: <strong style="color:#0f172a;font-size:15px;">${b.code}</strong></p>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Phim:</td>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#0f172a;text-align:right;">${b.movie}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Rạp chiếu:</td>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#0f172a;text-align:right;">${b.theaterName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Suất chiếu:</td>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#0f172a;text-align:right;">${b.date} · ${b.time}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Ghế ngồi:</td>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#d71920;text-align:right;font-size:16px;">${(b.seats || []).join(', ')}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Tổng tiền:</td>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#059669;text-align:right;font-size:16px;">${money(b.amount)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;">Trạng thái:</td>
            <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#10b981;text-align:right;">${b.paymentStatus || 'Đã thanh toán'}</td>
          </tr>
        </table>

        <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:12px 16px;border-radius:4px;font-size:13px;color:#1e40af;line-height:1.5;">
          <strong>Lưu ý:</strong> Quý khách vui lòng đến rạp trước giờ chiếu 15 phút, xuất trình email này hoặc quét mã vạch ở trên tại Kiosk để in vé vào phòng chiếu.
        </div>
      </div>
      <div style="background:#f8fafc;padding:16px 24px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#94a3b8;">
        © 2026 CGV Cinemas Vietnam. Cảm ơn quý khách đã sử dụng dịch vụ!
      </div>
    </div>
  `
}

// Dựng giao diện vé điện tử, thông tin đặt chỗ và các nút thao tác.
app.innerHTML = `
<div class="ticket-page-wrap">
  <!-- Thanh điều hướng -->
  <nav class="ticket-nav-bar">
    <div class="ticket-nav-logo">CGV <span style="color:#fff">Cinemas</span></div>
    <div class="ticket-nav-links">
      <a href="/trangchu.html">← Về trang chủ</a>
      <a href="/ve-cua-toi.html">Vé của tôi</a>
    </div>
  </nav>

  <!-- Thẻ Vé Điện Tử (E-Ticket) -->
  <article class="eticket-card" id="eTicketPrintArea">
    <header class="eticket-header">
      <div class="eticket-brand">
        <span class="eticket-logo-badge">CGV</span>
        <div class="eticket-title-box">
          <h1>VÉ XEM PHIM ĐIỆN TỬ</h1>
          <p>E-TICKET · PHÒNG CHIẾU CGV</p>
        </div>
      </div>
      <span class="eticket-status-badge">✓ ${booking.paymentStatus || 'ĐÃ THANH TOÁN'}</span>
    </header>

    <section class="eticket-movie-section">
      <div class="eticket-movie-info">
        <h2>${booking.movie}</h2>
        <div class="eticket-movie-tags">
          <span class="eticket-tag highlight">2D DIGITAL</span>
          <span class="eticket-tag">${booking.theaterName}</span>
          <span class="eticket-tag">Phòng chiếu Standard</span>
        </div>
      </div>
      <div class="eticket-qr-box" title="Quét mã QR để kiểm tra vé">
        <img src="${qrCodeUrl}" width="105" height="105" alt="QR Vé" style="border-radius:8px;border:1px solid #e2e8f0;display:block;" />
      </div>
    </section>

    <!-- MÃ VẠCH QUÉT TẠI QUẦY HOẶC KIOSK -->
    <section class="eticket-barcode-box">
      <div class="barcode-title">
        <span>MÃ VẠCH IN VÉ TỰ ĐỘNG TẠI QUẦY / KIOSK</span>
      </div>
      <div class="barcode-svg-container">
        ${barcodeSvg}
      </div>
      <p class="barcode-note">
        Đưa mã vạch này vào máy quét tại <strong>Kiosk tự động</strong> hoặc quầy vé <strong>CGV</strong> để in vé cứng vào rạp.
      </p>
    </section>

    <!-- Chi tiết vé -->
    <section class="eticket-grid">
      <div class="eticket-field">
        <span>Rạp chiếu</span>
        <strong>${booking.theaterName}</strong>
      </div>
      <div class="eticket-field">
        <span>Ngày chiếu</span>
        <strong>${booking.date}</strong>
      </div>
      <div class="eticket-field">
        <span>Suất chiếu</span>
        <strong>${booking.time}</strong>
      </div>
      <div class="eticket-field">
        <span>Ghế ngồi</span>
        <strong class="seats-val">${(booking.seats || []).join(', ')}</strong>
      </div>
      <div class="eticket-field">
        <span>Số lượng</span>
        <strong>${(booking.seats || []).length} vé</strong>
      </div>
      <div class="eticket-field">
        <span>Tổng thanh toán</span>
        <strong class="price-val">${money(booking.amount)}</strong>
      </div>
      <div class="eticket-field">
        <span>Phương thức</span>
        <strong>${booking.paymentMethod || 'QR BIDV'}</strong>
      </div>
      <div class="eticket-field">
        <span>Thời gian đặt</span>
        <strong>${formatDateTime(booking.createdAt)}</strong>
      </div>
    </section>
  </article>

  <!-- Phần gửi email và Thao tác -->
  <section class="ticket-actions-card">
    <div class="ticket-email-box">
      <div class="ticket-email-title">
        <span>✉️ Gửi thông tin vé về Email</span>
      </div>
      <form class="ticket-email-form" id="emailSendForm">
        <input 
          type="email" 
          id="targetEmailInput" 
          class="ticket-email-input" 
          placeholder="Nhập địa chỉ email của bạn..." 
          value="${defaultEmail}" 
          required 
        />
        <button type="submit" class="btn-send-email" id="btnSubmitEmail">
          <span>TẠO EMAIL VÉ</span>
        </button>
      </form>
      <div id="emailFeedback" class="email-feedback" hidden></div>
    </div>

    <div class="ticket-button-group">
      <button type="button" class="btn-print" id="btnPrintTicket">
        <span>🖨️ In vé / Lưu PDF</span>
      </button>
      <button type="button" class="btn-preview-mail" id="btnPreviewEmail">
        <span>👁️ Xem trước mẫu Email</span>
      </button>
      <a href="/trangchu.html" class="btn-preview-mail" style="text-decoration:none">
        <span>🏠 Trang chủ</span>
      </a>
    </div>
  </section>
</div>

<!-- Modal xem trước email -->
<div class="email-modal-overlay" id="emailModal" hidden>
  <div class="email-modal-box">
    <div class="email-modal-header">
      <h3>Xem trước Thư xác nhận gửi về Email</h3>
      <button type="button" class="email-modal-close" id="btnCloseEmailModal">&times;</button>
    </div>
    <div class="email-modal-body" id="emailModalBody">
      ${createTicketEmailHtml(booking)}
    </div>
  </div>
</div>
`

// Mở hộp thoại in của trình duyệt; có thể chọn máy in hoặc lưu PDF.
document.querySelector('#btnPrintTicket')?.addEventListener('click', () => {
  window.print()
})

// Mở và đóng cửa sổ xem trước nội dung email.
const emailModal = document.querySelector('#emailModal')
document.querySelector('#btnPreviewEmail')?.addEventListener('click', () => {
  emailModal.hidden = false
})
document.querySelector('#btnCloseEmailModal')?.addEventListener('click', () => {
  emailModal.hidden = true
})
emailModal?.addEventListener('click', (e) => {
  if (e.target === emailModal) emailModal.hidden = true
})

// Tạo bản nháp trong ứng dụng email mặc định; người dùng tự xác nhận gửi.
const emailForm = document.querySelector('#emailSendForm')
const feedbackEl = document.querySelector('#emailFeedback')
const emailInput = document.querySelector('#targetEmailInput')
const submitBtn = document.querySelector('#btnSubmitEmail')

emailForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = emailInput.value.trim()
  if (!email) return

  submitBtn.disabled = true
  submitBtn.innerHTML = '<span>ĐANG TẠO EMAIL...</span>'
  feedbackEl.hidden = true

  try {
    booking.userEmail = email
    const index = allBookings.findIndex((b) => b.code === booking.code)
    if (index !== -1) {
      allBookings[index].userEmail = email
      localStorage.setItem('cgv_bookings_v1', JSON.stringify(allBookings))
    }

    const emailBody = [
      `Vé CGV: ${booking.code}`,
      `Phim: ${booking.movie}`,
      `Rạp: ${booking.theaterName || booking.theaterId}`,
      `Ngày / giờ: ${booking.date} ${booking.time}`,
      `Ghế: ${(booking.seats || []).join(', ')}`,
      `Tổng tiền: ${money(booking.amount)}`,
      `Mã vé: ${booking.code}`,
    ].join('\n')
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Thông tin vé CGV ${booking.code}`)}&body=${encodeURIComponent(emailBody)}`
    feedbackEl.className = 'email-feedback success'
    feedbackEl.textContent = `Đã mở bản nháp email tới ${email}. Hãy bấm Gửi trong ứng dụng email để gửi vé.`
    feedbackEl.hidden = false
  } catch {
    feedbackEl.className = 'email-feedback error'
    feedbackEl.textContent = 'Không thể mở bản nháp email trên thiết bị này.'
    feedbackEl.hidden = false
  } finally {
    submitBtn.disabled = false
    submitBtn.innerHTML = '<span>TẠO EMAIL VÉ</span>'
  }
})
}

initTicketPage()
