import './styles/home.css'
import { icons } from './ui/icons.js'
import { showing, comingSoon, news, theaters, regionLabels, allMovies, seedMoviesById, currentMovieCount, vnMovieCount, intlMovieCount, vietnameseMovies, showtimes, datePlans, upcomingShowtimes, officialPosterFallback } from './data/home-catalog.js'
import { mountUserNav } from './shared/user-nav.js'
import { getCachedUser, isAuthenticated, loginUrl } from './shared/auth.js'
import { apiUrl } from './shared/api.js'
import { getMovieDetail, renderUpcomingShowtimes, movieCard, renderShowtimes, theaterOptions, totalTodayShows } from './ui/home-components.js'

const now = new Date()
const today = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const storageGet = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback }
}
const storageSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
const bookingKey = (movie, theaterId, date, time) => `${movie}__${theaterId}__${date}__${time}`
const ticketPrice = 85000

document.querySelector('#app').innerHTML = `
<header class="header">
  <div class="container header-inner">
    <button type="button" class="burger" id="burger" aria-label="Mở menu">${icons.menu}</button>
    <a href="#" class="logo">CGV<span>Cinemas</span></a>
    <nav class="nav" id="nav">
      <a href="/phim.html">PHIM</a>
      <a href="/lichchieu.html">LỊCH CHIẾU</a>
      <a href="#coming">SẮP CHIẾU</a>
      <a href="#promo">KHUYẾN MÃI</a>
      <a href="#news">TIN TỨC</a>
      <a href="#member">THÀNH VIÊN</a>
    </nav>
    <div class="header-actions">
      <button type="button" class="icon-btn" id="searchOpen" aria-label="Tìm kiếm">${icons.search}</button>
      <a class="login-btn ticket-history-btn" href="/ve-cua-toi.html">${icons.ticket}<span>VÉ CỦA TÔI</span></a>
      <a class="login-btn" href="/admin-login.html">${icons.user}<span>ADMIN</span></a>
    </div>
  </div>
</header>

<section class="hero hero-2026 hero-catalog">
  <div class="hero-bg hero-bg-catalog"><div class="hero-mesh"></div><div class="hero-grain"></div></div>
  <div class="container hero-catalog-inner">
    <div class="hero-copy hero-copy-catalog">
      <div class="hero-kicker-row">
        <span class="hero-badge">CGV · PHIM NỔI BẬT 2026</span>
      </div>
      <p class="hero-date">${today}</p>
      <h1>HẸN NHAU<br><span>Ở RẠP.</span></h1>
      <p class="hero-sub">Khám phá những bộ phim nổi bật của 2026 — từ <strong>phim Việt giàu cảm xúc</strong> đến kinh dị, hành động và bom tấn quốc tế. Xem thông tin phim, lịch chiếu và chọn suất phù hợp cho buổi hẹn tiếp theo.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="#showing">${icons.ticket}<span>XEM PHIM ĐANG HOT</span></a>
        <a class="btn btn-ghost" href="#vietnam">PHIM VIỆT 2026</a>
      </div>
      <div class="hero-stats hero-stats-2026">
        <div><strong id="homeMovieCount">${allMovies.length}</strong><span>Tựa phim nổi bật</span></div>
        <div><strong id="homeVnCount">${vnMovieCount}</strong><span>Phim Việt 2026</span></div>
        <div><strong>${theaters.length}</strong><span>Cụm rạp theo khu vực</span></div>
      </div>
    </div>
    <div class="hero-poster-wall" id="heroPosterWall" aria-label="Poster phim nổi bật 2026">
      ${[showing[0], showing[1], showing[5], showing[7]].map((m, i) => `
        <article class="hero-mini-poster p${i + 1}" data-detail="${m.title}">
          <img loading="eager" decoding="async" referrerpolicy="no-referrer" src="${m.image}" alt="Poster ${m.title}" onerror="this.onerror=null;this.src='${m.fallback || ''}'" />
          <div class="hero-mini-shade"></div>
          <div class="hero-mini-copy"><span>${m.origin === 'vn' ? 'PHIM VIỆT' : m.country}</span><strong>${m.title}</strong></div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<section id="showing" class="section">
  <div class="container">
    <div class="section-head section-head-rich">
      <div><span class="eyebrow">HOT PICKS · 2026</span><h2>PHIM HOT 2026</h2><p class="section-intro">Phim Việt và quốc tế đang được quan tâm, tất cả đều có poster và thông tin chi tiết.</p></div>
      <div class="movie-filter" id="movieFilter">
        <button type="button" class="filter-chip active" data-filter="all">Tất cả</button>
        <button type="button" class="filter-chip" data-filter="vn">Phim Việt</button>
        <button type="button" class="filter-chip" data-filter="intl">Quốc tế</button>
        <button type="button" class="filter-chip" data-filter="horror">Kinh dị</button>
      </div>
    </div>
    <div class="grid movie-grid-2026" id="movieGrid2026">
      ${showing.map((m) => movieCard(m, { btn: true })).join('')}
    </div>
  </div>
</section>

<section id="vietnam" class="section section-vietnam">
  <div class="container">
    <div class="section-head">
      <div><span class="eyebrow">VIETNAMESE CINEMA · 2026</span><h2>PHIM VIỆT NỔI BẬT</h2><p class="section-intro">Từ hành động, gia đình đến kinh dị — các phim Việt 2026 được gom riêng để dễ theo dõi.</p></div>
      <span class="see-all" id="homeVnLabel">${vnMovieCount} phim Việt nổi bật</span>
    </div>
    <div class="grid vietnam-grid" id="vietnamMovieGrid">
      ${vietnameseMovies.slice(0, 8).map((m) => movieCard(m, { btn: showing.includes(m), detailOnly: !showing.includes(m), player: !showing.includes(m) })).join('')}
    </div>
  </div>
</section>

<section id="coming" class="section section-alt">
  <div class="container">
    <div class="section-head">
      <div><span class="eyebrow">COMING SOON · 2026</span><h2>PHIM SẮP CHIẾU</h2><p class="section-intro">Các phim có ngày phát hành đã được công bố; nội dung chưa công bố sẽ được ghi rõ là đang cập nhật.</p></div>
      <a href="#" class="see-all">Xem tất cả</a>
    </div>
    <div class="grid grid-4 coming-grid" id="comingMovieGrid">
      ${comingSoon.map((m) => movieCard(m, { player: true, detailOnly: true })).join('')}
    </div>
  </div>
</section>

<section id="showtimes" class="section">
  <div class="container">
    <div class="section-head">
      <h2>LỊCH CHIẾU THEO KHU VỰC</h2>
      <span class="see-all">${theaters.length} rạp · Miền Bắc · Miền Trung · Miền Nam</span>
    </div>
    <div class="cinema-picker">
      <div class="tabs region-tabs" id="regionTabs">
        <button type="button" class="tab region-tab active" data-region="north">Miền Bắc</button>
        <button type="button" class="tab region-tab" data-region="central">Miền Trung</button>
        <button type="button" class="tab region-tab" data-region="south">Miền Nam</button>
      </div>
      <label class="theater-select-wrap"><span>Chọn rạp</span><select id="theaterSelect">${theaterOptions('north')}</select></label>
    </div>
    <div class="tab-sub" id="theaterAddr">${theaters[0].name} · ${theaters[0].addr} · ${theaters[0].screens} phòng chiếu</div>
    <div class="showtimes" id="showtimesBox">${renderShowtimes(theaters[0].id)}</div>
  </div>
</section>

<section id="upcoming" class="section section-alt">
  <div class="container">
    <div class="section-head">
      <h2>LỊCH CHIẾU 4 NGÀY</h2>
      <span class="see-all">Suất chiếu nổi bật trong 4 ngày tới</span>
    </div>
    <div class="upcoming-controls">
      <div class="tabs" id="upcomingDateTabs">
        ${Object.entries(upcomingShowtimes).map(([dateKey, date], index) =>
          `<button type="button" class="tab upcoming-date-tab ${index === 0 ? 'active' : ''}" data-date="${dateKey}">${date.label}</button>`
        ).join('')}
      </div>
      <label class="theater-select-wrap wide"><span>Rạp áp dụng</span><select id="upcomingTheaterSelect">${theaterOptions('all')}</select></label>
    </div>
    <div class="tab-sub" id="upcomingSub">${upcomingShowtimes[datePlans[0][0]].label} · ${theaters[0].name} · ${theaters[0].addr}</div>
    <div class="showtimes" id="upcomingBox">${renderUpcomingShowtimes(datePlans[0][0], theaters[0].id)}</div>
  </div>
</section>

<section id="promo" class="section section-alt">
  <div class="container">
    <div class="section-head">
      <h2>KHUYẾN MÃI NỔI BẬT</h2>
    </div>
    <div class="promo-grid">
      <article class="promo-card">
        <div class="promo-icon">${icons.popcorn}</div>
        <h3>Combo sinh đôi</h3>
        <p>Mua 2 vé bất kỳ, nhận ngay bắp nước combo <strong>giảm 40%</strong>.</p>
        <a href="#" class="btn btn-primary btn-sm">NHẬN NGAY</a>
      </article>
      <article class="promo-card">
        <div class="promo-icon">${icons.gift}</div>
        <h3>Thứ Ba vui vẻ</h3>
        <p>Giảm <strong>50%</strong> giá vé cho mọi suất chiếu thứ Ba hằng tuần.</p>
        <a href="#" class="btn btn-primary btn-sm">NHẬN NGAY</a>
      </article>
      <article class="promo-card">
        <div class="promo-icon">${icons.card}</div>
        <h3>Thành viên VIP</h3>
        <p>Tích điểm hoàn tiền <strong>5%</strong> cho mỗi giao dịch cùng quà sinh nhật.</p>
        <a href="#" class="btn btn-primary btn-sm">ĐĂNG KÝ</a>
      </article>
    </div>
  </div>
</section>

<section class="section how">
  <div class="container">
    <div class="section-head">
      <h2>3 BƯỚC ĐẶT VÉ</h2>
      <span class="see-all">Nhanh, gọn, tiện lợi</span>
    </div>
    <div class="how-grid">
      <div class="how-step">
        <span class="step-num">1</span>
        <h3>Chọn phim & suất chiếu</h3>
        <p>Chọn phim 2026, rạp và khung giờ phù hợp.</p>
      </div>
      <div class="how-step">
        <span class="step-num">2</span>
        <h3>Chọn ghế ngồi</h3>
        <p>Tương tác sơ đồ ghế thời gian thực theo giao diện thân thiện.</p>
      </div>
      <div class="how-step">
        <span class="step-num">3</span>
        <h3>Xác nhận & nhận vé</h3>
        <p>Xác nhận thông tin đặt vé và lưu lại để dễ dàng xem lại khi cần.</p>
      </div>
    </div>
  </div>
</section>

<section id="news" class="section section-alt">
  <div class="container">
    <div class="section-head">
      <h2>TIN ĐIỆN ẢNH</h2>
      <a href="#" class="see-all">Xem tất cả</a>
    </div>
    <div class="news-grid">
      ${news.map((n) => `
        <article class="news-card">
          <div class="news-thumb" style="background:${n.color}">
            <span class="news-letter">${n.title.charAt(0)}</span>
          </div>
          <div class="news-body">
            <span class="tag">${n.tag}</span>
            <h3>${n.title}</h3>
            <p>${n.desc}</p>
            <a href="#" class="news-more">Đọc tiếp</a>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
</section>

<section id="member" class="section member-banner">
  <div class="container member-inner">
    <div>
      <h2>Trở thành thành viên CGV</h2>
      <p>Tích điểm, tích ưu đãi và những quyền lợi dành riêng cho bạn.</p>
    </div>
    <a href="/dang-ky.html" class="btn btn-primary">ĐĂNG KÝ NGAY</a>
  </div>
</section>

<section class="app-banner">
  <div class="container app-inner">
    <div>
      <h2>Trải nghiệm đặt vé trên di động</h2>
      <p>Giao diện responsive được tối ưu để thao tác thuận tiện trên điện thoại.</p>
    </div>
    <div class="app-badges">
      <a href="#" class="store-badge">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22z"/><path d="M12 1a8 8 0 0 1 6 12l-6 3-6-3a8 8 0 0 1 6-12z"/></svg>
        <span><small>CÓ SẴN TRÊN</small><b>App Store</b></span>
      </a>
      <a href="#" class="store-badge">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 3 9 9-9 9V3z"/><path d="M13 12h8"/></svg>
        <span><small>GOOGLE PLAY</small><b>Google Play</b></span>
      </a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="logo">CGV<span>Cinemas</span></a>
        <p>Hệ thống rạp chiếu phim hiện đại hàng đầu - đem điện ảnh đỉnh cao đến gần hơn với mọi khán giả.</p>
        <div class="socials">
          <a href="#" class="social" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"/></svg>
          </a>
          <a href="#" class="social" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="#" class="social" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z"/></svg>
          </a>
          <a href="#" class="social" aria-label="TikTok">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.6 6.7a4.7 4.7 0 0 1-3.4-1.5 4.7 4.7 0 0 1-1.2-3.2h-3.4v13.8a2.8 2.8 0 1 1-2.8-2.8c.3 0 .6 0 .9.1V9.6a6.3 6.3 0 0 0-.9-.1A6.2 6.2 0 1 0 16 16.6V9.4a8 8 0 0 0 4.6 1.5V7.5c-.3 0-.7 0-1-.8Z"/></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4>RẠP CHIẾU</h4>
        <a href="#showtimes">Hệ thống rạp theo khu vực</a>
        <p>${theaters.length} rạp tại Miền Bắc, Miền Trung và Miền Nam</p>
        <a href="#showtimes">Xem lịch chiếu</a>
      </div>
      <div class="footer-col">
        <h4>HỖ TRỢ</h4>
        <a href="#">Câu hỏi thường gặp</a>
        <a href="#">Điều khoản sử dụng</a>
        <a href="#">Chính sách hoàn vé</a>
        <a href="#">Liên hệ</a>
      </div>
      <div class="footer-col">
        <h4>NEWSLETTER</h4>
        <p>Nhận tin & ưu đãi mới nhất về hộp thư của bạn.</p>
        <form class="newsletter" onsubmit="return false">
          <input type="email" placeholder="Email của bạn" aria-label="Email" />
          <button type="submit" class="btn btn-primary btn-sm">ĐĂNG KÝ</button>
        </form>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${now.getFullYear()} CGV Movie Guide · Khám phá phim, lịch chiếu và trải nghiệm đặt vé.</p>
      <div class="footer-links">
        <a href="#">Tuyển dụng</a>
        <a href="#">Điều khoản</a>
        <a href="#">Bảo mật</a>
      </div>
    </div>
  </div>
</footer>

<div class="search-overlay" id="searchOverlay">
  <button type="button" class="overlay-close" id="searchClose" aria-label="Đóng">${icons.close}</button>
  <div class="search-box">
    <h3>Tìm phim của bạn</h3>
    <div class="search-field">
      ${icons.search}
      <input type="text" id="searchInput" placeholder="Gõ tên phim..." autocomplete="off" />
    </div>
    <p class="search-hint">Gợi ý: Trại Buôn Người, Út Lan 2, Colony, The Odyssey, Án Mạng Karaoke...</p>
  </div>
</div>

<div class="modal" id="movieModal" hidden>
  <div class="modal-backdrop" data-close></div>
  <div class="modal-box movie-modal-box">
    <button type="button" class="modal-close" data-close aria-label="Đóng">${icons.close}</button>
    <div id="modalContent"></div>
  </div>
</div>

<button type="button" class="to-top" id="toTop" aria-label="Lên đầu trang"></button>
`

const state = { modalMode: 'buy' }
mountUserNav()

const PAYMENT_BANK = 'BIDV'
const PAYMENT_ACCOUNT = '8855252740'
const paymentQrUrl = (amount, content) => `https://img.vietqr.io/image/${PAYMENT_BANK}-${PAYMENT_ACCOUNT}-compact2.png?amount=${encodeURIComponent(amount)}&addInfo=${encodeURIComponent(content)}`
const getScheduleRows = (theaterId, date) => upcomingShowtimes[date]?.theaters?.[theaterId] || showtimes[theaterId] || []
const getMovieTimes = (movieTitle, theaterId, date) => getScheduleRows(theaterId, date).find((row) => row.title === movieTitle)?.times || []

const renderTicket = (booking) => {
  const theater = theaters.find((t) => t.id === booking.theaterId)
  document.querySelector('#modalContent').innerHTML = `
    <div class="ticket-success">
      <span class="ticket-success-icon">✓</span>
      <span class="detail-kicker">ĐẶT VÉ THÀNH CÔNG</span>
      <h3>${booking.movie}</h3>
      <p class="ticket-code">MÃ VÉ <strong>${booking.code}</strong></p>
      <div class="ticket-grid">
        <div><span>Rạp</span><strong>${theater?.name || booking.theaterId}</strong></div>
        <div><span>Ngày</span><strong>${booking.date}</strong></div>
        <div><span>Suất chiếu</span><strong>${booking.time}</strong></div>
        <div><span>Ghế</span><strong>${booking.seats.join(', ')}</strong></div>
        <div><span>Số vé</span><strong>${booking.seats.length}</strong></div>
        <div><span>Tổng tiền</span><strong>${(booking.seats.length * ticketPrice).toLocaleString('vi-VN')}đ</strong></div>
        <div><span>Thanh toán</span><strong>${booking.paymentMethod || 'QR BIDV'}</strong></div>
      </div>
      <p class="detail-demo-note">Đã ghi nhận thanh toán qua ${PAYMENT_BANK} · STK ${PAYMENT_ACCOUNT}.</p>
      <button type="button" class="btn btn-primary btn-sm" data-close-ticket>HOÀN TẤT</button>
    </div>`
}

const openSeatSelection = (m, theaterId, date, time) => {
  const key = bookingKey(m.title, theaterId, date, time)
  const occupiedMap = storageGet('cgv_seat_state_v1', {})
  const occupied = occupiedMap[key] || ['A2', 'B5', 'C7', 'D4', 'F8']
  const rows = ['A','B','C','D','E','F','G','H']
  const theater = theaters.find((t) => t.id === theaterId)
  document.querySelector('#modalContent').innerHTML = `
    <div class="seat-flow-head">
      <span class="detail-kicker">BƯỚC 2 / 3 · CHỌN GHẾ</span>
      <h3>${m.title}</h3>
      <p>${theater?.name || ''} · ${date} · ${time}</p>
    </div>
    <div class="seat-flow-body">
      <div class="screen-label">MÀN HÌNH</div>
      <div class="seat-map">
        ${rows.map((r) => `<div class="seat-row"><span>${r}</span>${Array.from({length:10},(_,i)=>{const seat=`${r}${i+1}`; return `<button type="button" class="seat ${occupied.includes(seat)?'occupied':''}" data-seat="${seat}" ${occupied.includes(seat)?'disabled':''}>${i+1}</button>`}).join('')}</div>`).join('')}
      </div>
      <div class="seat-legend"><span><i class="seat-demo"></i>Còn trống</span><span><i class="seat-demo selected"></i>Đang chọn</span><span><i class="seat-demo occupied"></i>Đã đặt</span></div>
      <div class="seat-summary"><span>Ghế đã chọn: <strong id="selectedSeatText">Chưa chọn</strong></span><strong id="seatTotal">0đ</strong></div>
      <button type="button" class="btn btn-primary" id="confirmSeatBtn" disabled>XÁC NHẬN ĐẶT VÉ</button>
    </div>`
  const selected = new Set()
  document.querySelectorAll('#modalContent .seat:not(.occupied)').forEach((btn) => btn.addEventListener('click', () => {
    const seat = btn.dataset.seat
    selected.has(seat) ? selected.delete(seat) : selected.add(seat)
    btn.classList.toggle('selected')
    document.querySelector('#selectedSeatText').textContent = selected.size ? [...selected].join(', ') : 'Chưa chọn'
    document.querySelector('#seatTotal').textContent = (selected.size * ticketPrice).toLocaleString('vi-VN') + 'đ'
    document.querySelector('#confirmSeatBtn').disabled = selected.size === 0
  }))
  document.querySelector('#confirmSeatBtn').addEventListener('click', () => {
    const seats = [...selected]
    openPayment(m, theaterId, date, time, seats, occupiedMap, occupied, key)
  })
}

const openPayment = (m, theaterId, date, time, seats, occupiedMap, occupied, key) => {
  const theater = theaters.find((t) => t.id === theaterId)
  const amount = seats.length * ticketPrice
  const code = `CGV${Date.now().toString().slice(-8)}`
  const transferContent = `${code} ${m.title}`.replace(/[^a-zA-Z0-9À-ỹ ]/g, '').slice(0, 45)
  document.querySelector('#modalContent').innerHTML = `
    <div class="seat-flow-head payment-head">
      <span class="detail-kicker">BƯỚC 3 / 3 · THANH TOÁN</span>
      <h3>Quét QR để thanh toán</h3>
      <p>${m.title} · ${theater?.name || ''} · ${date} · ${time}</p>
    </div>
    <div class="payment-body">
      <div class="payment-qr-card">
        <img class="payment-qr" src="${paymentQrUrl(amount, transferContent)}" alt="QR thanh toán BIDV ${PAYMENT_ACCOUNT}" />
        <div class="payment-bank"><strong>${PAYMENT_BANK}</strong><span>STK ${PAYMENT_ACCOUNT}</span></div>
      </div>
      <div class="payment-summary">
        <div><span>Ghế</span><strong>${seats.join(', ')}</strong></div>
        <div><span>Số tiền</span><strong class="payment-amount">${amount.toLocaleString('vi-VN')}đ</strong></div>
        <div><span>Nội dung CK</span><strong>${transferContent}</strong></div>
        <p>Vui lòng quét QR bằng ứng dụng ngân hàng. Sau khi chuyển khoản thành công, bấm nút xác nhận bên dưới để hoàn tất đặt vé.</p>
        <button type="button" class="btn btn-primary" id="paymentConfirmBtn">TÔI ĐÃ THANH TOÁN</button>
      </div>
    </div>`
  document.querySelector('#paymentConfirmBtn').addEventListener('click', () => {
    const bookings = storageGet('cgv_bookings_v1', [])
    const currentUser = getCachedUser()
    const booking = { code, userId: currentUser?.id || null, userEmail: currentUser?.email || '', movie: m.title, theaterId, theaterName: theater?.name || theaterId, date, time, seats, amount, paymentMethod: `QR ${PAYMENT_BANK}`, paymentAccount: PAYMENT_ACCOUNT, paymentStatus: 'Đã thanh toán', createdAt: new Date().toISOString() }
    bookings.unshift(booking)
    storageSet('cgv_bookings_v1', bookings)
    occupiedMap[key] = [...new Set([...(occupiedMap[key] || occupied), ...seats])]
    storageSet('cgv_seat_state_v1', occupiedMap)
    renderTicket(booking)
  })
}

const openMyTickets = () => {
  const bookings = storageGet('cgv_bookings_v1', [])
  document.querySelector('#modalContent').innerHTML = `
    <div class="ticket-list-head"><span class="detail-kicker">THÔNG TIN VÉ</span><h3>Vé đã đặt</h3><p>Danh sách vé gần đây của bạn.</p></div>
    <div class="ticket-list">${bookings.length ? bookings.map((b) => {
      const t = theaters.find((x) => x.id === b.theaterId)
      return `<article class="saved-ticket"><div><strong>${b.movie}</strong><span>${t?.name || ''}</span></div><div><span>${b.date} · ${b.time}</span><strong>Ghế ${b.seats.join(', ')}</strong></div><button type="button" class="btn-details" data-view-ticket="${b.code}">XEM VÉ</button></article>`
    }).join('') : '<p class="empty-showtimes">Bạn chưa có vé nào được lưu.</p>'}</div>`
  document.querySelector('#movieModal').hidden = false
  document.body.style.overflow = 'hidden'
}

const openModal = (title, mode = 'buy') => {
  const m = [...showing, ...comingSoon].find((x) => x.title === title)
  if (!m) return
  state.modalMode = mode
  const defaultTheater = theaters.find((t) => getMovieTimes(m.title, t.id, datePlans[0][0]).length) || theaters[0]
  const renderBookingTimes = (theaterId, date) => {
    const times = getMovieTimes(m.title, theaterId, date)
    const timesBox = document.querySelector('#bookingTimes')
    const note = document.querySelector('#mmNote')
    const continueBtn = document.querySelector('#continueBooking')
    selectedTime = ''
    if (continueBtn) continueBtn.disabled = true
    if (!timesBox || !note) return
    timesBox.innerHTML = times.length ? times.map((t) => `<button type="button" class="time-chip" data-time="${t}">${t}</button>`).join('') : '<span class="mm-date">Rạp này chưa có suất chiếu cho phim trong ngày đã chọn.</span>'
    note.textContent = times.length ? 'Vui lòng chọn một suất chiếu để tiếp tục chọn ghế.' : 'Hãy đổi rạp hoặc ngày để xem các suất chiếu khác.'
    note.classList.remove('ok')
    timesBox.querySelectorAll('.time-chip').forEach((chip) => chip.addEventListener('click', () => {
      timesBox.querySelectorAll('.time-chip').forEach((c) => c.classList.remove('active'))
      chip.classList.add('active')
      selectedTime = chip.dataset.time
      note.innerHTML = `Đã chọn suất <strong>${selectedTime}</strong>. Tiếp tục để chọn ghế.`
      note.classList.add('ok')
      if (continueBtn) continueBtn.disabled = false
    }))
  }
  document.querySelector('#modalContent').innerHTML = `
    <div class="mm-head" style="background:${m.color}">
      <span class="mm-letter">${m.image ? `<img class="mm-poster-img" referrerpolicy="no-referrer" src="${m.image}" alt="Poster ${m.title}" onerror="this.onerror=null;this.src='${m.fallback || ''}'" />` : m.title.charAt(0)}</span>
      <div><span class="genre">${m.genre}</span><h3>${m.title}</h3><p>${m.meta}</p></div>
    </div>
    <div class="mm-body">
      <h4>${mode === 'buy' ? 'BƯỚC 1 / 3 · CHỌN RẠP, NGÀY VÀ SUẤT CHIẾU' : 'ĐẶT LỊCH NHẮC'}</h4>
      ${mode === 'buy' ? `<div class="booking-selects"><label>Rạp<select id="bookingTheater">${theaterOptions('all').replace(`value="${defaultTheater.id}"`, `value="${defaultTheater.id}" selected`)}</select></label><label>Ngày<select id="bookingDate">${datePlans.map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label></div>` : ''}
      <div class="st-times" id="bookingTimes"></div>
      <p class="mm-note" id="mmNote"></p>
      ${mode === 'buy' ? '<button type="button" class="btn btn-primary" id="continueBooking" disabled>TIẾP TỤC CHỌN GHẾ</button>' : ''}
    </div>`
  document.querySelector('#movieModal').hidden = false
  document.body.style.overflow = 'hidden'
  let selectedTime = ''
  if (mode === 'buy') {
    const theaterSelect = document.querySelector('#bookingTheater')
    const dateSelect = document.querySelector('#bookingDate')
    theaterSelect.value = defaultTheater.id
    const refresh = () => renderBookingTimes(theaterSelect.value, dateSelect.value)
    theaterSelect.addEventListener('change', refresh)
    dateSelect.addEventListener('change', refresh)
    refresh()
    document.querySelector('#continueBooking').addEventListener('click', () => {
      if (!selectedTime) return
      openSeatSelection(m, theaterSelect.value, dateSelect.value, selectedTime)
    })
  } else {
    document.querySelector('#bookingTimes').innerHTML = '<span class="mm-date">Tính năng nhắc lịch đang được cập nhật.</span>'
    document.querySelector('#mmNote').textContent = 'Phim hiện chưa mở đặt vé.'
  }
}

const openMovieDetail = (title) => {
  const m = [...showing, ...comingSoon].find((x) => x.title === title)
  if (!m) return
  const d = getMovieDetail(m)
  const screeningTheaters = theaters.filter((t) => (showtimes[t.id] || []).some((row) => row.title === m.title))
  const detailTheater = screeningTheaters[0] || theaters[0]
  const detailSchedule = (showtimes[detailTheater.id] || []).find((row) => row.title === m.title)
  document.querySelector('#modalContent').innerHTML = `
    <div class="movie-detail-hero" style="background:${m.color}">
      <div class="movie-detail-poster">${m.image ? `<img loading="eager" decoding="async" referrerpolicy="no-referrer" src="${m.image}" alt="Poster ${m.title}" onerror="this.onerror=null;this.src='${m.fallback || ''}'" />` : `<span>${m.title.charAt(0)}</span>`}</div>
      <div class="movie-detail-title">
        <span class="genre">${d.classification || m.genre}</span>
        <h3>${m.title}</h3>
        <p>${d.genreFull || m.meta}${m.rate ? ` · <strong>${m.rate}/10</strong>` : ''}</p>
        <div class="detail-quick-tags">
          <span>${d.duration || ''}</span>
          <span>${d.release || ''}</span>
          <span>${d.country || 'Việt Nam'}</span>
        </div>
      </div>
    </div>
    <div class="movie-detail-body">
      <div class="movie-detail-main">
        <span class="detail-kicker">NỘI DUNG PHIM</span>
        <p class="movie-synopsis">${d.synopsis}</p>
        <div class="detail-highlight">
          <strong>Điểm đáng chú ý</strong>
          <p>${d.highlight || 'Thông tin đang cập nhật.'}</p>
        </div>
        <div class="detail-theater-box">
          <strong>${screeningTheaters.length ? `Đang chiếu tại ${screeningTheaters.length} rạp` : 'Thông tin lịch chiếu'}</strong>
          ${screeningTheaters.length ? `<p>${detailTheater.name}</p><span>${detailTheater.addr} · ${regionLabels[detailTheater.region]}</span>` : '<p>Phim hiện chưa có lịch chiếu.</p><span>Hãy quay lại sau để xem các suất chiếu mới.</span>'}
          ${detailSchedule ? `<div class="detail-showtimes">${detailSchedule.times.map((t) => `<button type="button" class="time-chip" data-detail-time="${t}">${t}</button>`).join('')}</div>` : ''}
          ${screeningTheaters.length > 1 ? `<div class="detail-cinema-list">${screeningTheaters.slice(0, 4).map((t) => `<span>${t.name}</span>`).join('')}</div>` : ''}
        </div>
        <div class="movie-detail-actions">
          ${detailSchedule ? `<button type="button" class="btn btn-primary btn-sm detail-buy" data-detail-buy="${m.title}">${icons.ticket}<span>CHỌN SUẤT CHIẾU</span></button>` : ''}
        </div>
      </div>
      <dl class="movie-facts">
        <div><dt>Khởi chiếu</dt><dd>${d.release}</dd></div>
        <div><dt>Thời lượng</dt><dd>${d.duration}</dd></div>
        <div><dt>Phân loại</dt><dd>${d.classification}</dd></div>
        <div><dt>Thể loại</dt><dd>${d.genreFull}</dd></div>
        <div><dt>Đạo diễn</dt><dd>${d.director}</dd></div>
        <div><dt>Diễn viên</dt><dd>${d.cast}</dd></div>
        <div><dt>Nhà sản xuất</dt><dd>${d.producer}</dd></div>
        <div><dt>Quốc gia</dt><dd>${d.country}</dd></div>
        <div><dt>Ngôn ngữ</dt><dd>${d.language}</dd></div>
        <div><dt>Định dạng</dt><dd>${d.formats}</dd></div>
      </dl>
      <p class="detail-source">Nguồn thông tin phim: <a href="${d.sourceUrl || '#'}" target="_blank" rel="noreferrer">${d.sourceName || 'Nguồn công khai'}</a></p>
      
    </div>
  `
  document.querySelector('#movieModal').hidden = false
  document.body.style.overflow = 'hidden'
  document.querySelectorAll('#modalContent [data-detail-time]').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#modalContent [data-detail-time]').forEach((c) => c.classList.remove('active'))
      chip.classList.add('active')
    })
  })
}

const closeModal = () => {
  document.querySelector('#movieModal').hidden = true
  document.body.style.overflow = ''
}

document.addEventListener('click', (e) => {
  const detail = e.target.closest('[data-detail]')
  if (detail) {
    openMovieDetail(detail.dataset.detail)
    return
  }
  const detailBuy = e.target.closest('[data-detail-buy]')
  if (detailBuy) {
    if (!isAuthenticated()) { location.href = loginUrl(`/trangchu.html?movie=${encodeURIComponent(detailBuy.dataset.detailBuy)}#showing`); return }
    openModal(detailBuy.dataset.detailBuy, 'buy')
    return
  }
  const detailNotify = e.target.closest('[data-detail-notify]')
  if (detailNotify) {
    openModal(detailNotify.dataset.detailNotify, 'notify')
    return
  }
  const buy = e.target.closest('[data-buy]')
  if (buy) {
    if (!isAuthenticated()) { location.href = loginUrl(`/trangchu.html?movie=${encodeURIComponent(buy.dataset.buy)}#showing`); return }
    openModal(buy.dataset.buy, 'buy')
    return
  }
  const notify = e.target.closest('[data-notify]')
  if (notify) {
    openModal(notify.dataset.notify, 'notify')
    return
  }
  if (e.target.closest('[data-close]')) closeModal()
})


let activeRegion = 'north'
let activeTheater = theaters.find((t) => t.region === activeRegion)?.id || theaters[0].id

const updateActiveTheater = (theaterId) => {
  const th = theaters.find((t) => t.id === theaterId)
  if (!th) return
  activeTheater = theaterId
  document.querySelector('#theaterAddr').textContent = `${th.name} · ${th.addr} · ${th.screens} phòng chiếu`
  document.querySelector('#showtimesBox').innerHTML = renderShowtimes(th.id)
}

document.querySelectorAll('.region-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.region-tab').forEach((t) => t.classList.remove('active'))
    tab.classList.add('active')
    activeRegion = tab.dataset.region
    const first = theaters.find((t) => t.region === activeRegion)
    const select = document.querySelector('#theaterSelect')
    select.innerHTML = theaterOptions(activeRegion)
    if (first) {
      select.value = first.id
      updateActiveTheater(first.id)
    }
  })
})

document.querySelector('#theaterSelect').addEventListener('change', (e) => updateActiveTheater(e.target.value))


// Bộ lọc phim theo yêu cầu tìm kiếm/lọc trong SRS
const filterBar = document.querySelector('#movieFilter')
if (filterBar) {
  filterBar.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]')
    if (!button) return
    filterBar.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'))
    button.classList.add('active')
    const filter = button.dataset.filter
    document.querySelectorAll('#movieGrid2026 .movie-card').forEach((card) => {
      const origin = card.dataset.origin
      const meta = card.dataset.meta || ''
      const isHorror = /kinh dị|zombie|horror/.test(meta)
      const show = filter === 'all' || filter === origin || (filter === 'horror' && isHorror)
      card.hidden = !show
    })
  })
}

let upcomingDate = datePlans[0][0]
let upcomingTheater = theaters[0].id

const updateUpcomingShowtimes = () => {
  const date = upcomingShowtimes[upcomingDate]
  const theater = theaters.find((t) => t.id === upcomingTheater)
  if (!date || !theater) return
  document.querySelector('#upcomingSub').textContent = `${date.label} · ${theater.name} · ${theater.addr}`
  document.querySelector('#upcomingBox').innerHTML = renderUpcomingShowtimes(upcomingDate, upcomingTheater)
}

document.querySelectorAll('.upcoming-date-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.upcoming-date-tab').forEach((t) => t.classList.remove('active'))
    tab.classList.add('active')
    upcomingDate = tab.dataset.date
    updateUpcomingShowtimes()
  })
})

document.querySelector('#upcomingTheaterSelect').addEventListener('change', (e) => {
  upcomingTheater = e.target.value
  updateUpcomingShowtimes()
})

const burger = document.querySelector('#burger')
const nav = document.querySelector('#nav')
burger.addEventListener('click', () => {
  document.body.classList.toggle('nav-open')
})
nav.addEventListener('click', (e) => {
  if (document.body.classList.contains('nav-open')) {
    document.body.classList.remove('nav-open')
  }
})

const searchOpen = document.querySelector('#searchOpen')
const searchClose = document.querySelector('#searchClose')
const searchOverlay = document.querySelector('#searchOverlay')
const searchInput = document.querySelector('#searchInput')

searchOpen.addEventListener('click', () => {
  searchOverlay.classList.add('open')
  document.body.style.overflow = 'hidden'
  setTimeout(() => searchInput.focus(), 50)
})
const closeSearch = () => {
  searchOverlay.classList.remove('open')
  searchInput.value = ''
  document.body.style.overflow = ''
}
searchClose.addEventListener('click', closeSearch)
searchOverlay.addEventListener('click', (e) => {
  if (e.target === searchOverlay) closeSearch()
})

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase()
  document.querySelectorAll('.movie-card').forEach((card) => {
    card.style.display = !q || card.dataset.title.toLowerCase().includes(q) ? '' : 'none'
  })
})

const toTop = document.querySelector('#toTop')
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600)
}, { passive: true })
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

document.addEventListener('click', (e) => {
  const chip = e.target.closest('.time-chip')
  if (chip && !chip.dataset.time && !chip.dataset.detailTime) chip.classList.toggle('active')
  const closeTicket = e.target.closest('[data-close-ticket]')
  if (closeTicket) { closeModal(); return }
  const viewTicket = e.target.closest('[data-view-ticket]')
  if (viewTicket) {
    const booking = storageGet('cgv_bookings_v1', []).find((b) => b.code === viewTicket.dataset.viewTicket)
    if (booking) renderTicket(booking)
    return
  }
})

// Đồng bộ thư viện phim trên trang chủ với json-server của trang quản lý.
const cleanCatalogText = (value, fallback = '') => String(value ?? fallback).replace(/[<>"']/g, '').trim()
const safeCatalogPoster = (value, fallback = '') => {
  try {
    const url = new URL(value || fallback, window.location.origin)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : fallback
  } catch { return fallback }
}
const formatCatalogDate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '')
  return match ? `${match[3]}/${match[2]}/${match[1]}` : 'Đang cập nhật'
}
const apiMovieToCatalogMovie = (movie) => {
  const base = seedMoviesById[String(movie.id)] || allMovies.find((item) => item.title === movie.title) || {}
  const status = ['showing', 'upcoming', 'archived'].includes(movie.status) ? movie.status : 'upcoming'
  const duration = Math.max(1, Number(movie.duration) || 120)
  const category = cleanCatalogText(movie.genre, 'Đang cập nhật')
  const release = formatCatalogDate(movie.releaseDate)
  return {
    ...base,
    id: String(movie.id),
    title: cleanCatalogText(movie.title, 'Phim chưa đặt tên'),
    director: cleanCatalogText(movie.director, 'Đang cập nhật'),
    meta: `${category} · ${duration} phút`,
    genre: cleanCatalogText(movie.rating, 'P'),
    country: cleanCatalogText(movie.country, base.country || 'Việt Nam'),
    origin: movie.origin === 'intl' || base.origin === 'intl' ? 'intl' : 'vn',
    short: cleanCatalogText(movie.description, 'Thông tin nội dung đang được cập nhật.'),
    image: safeCatalogPoster(movie.poster, base.image || ''),
    fallback: base.fallback || officialPosterFallback,
    color: base.color || 'linear-gradient(165deg,#17243b 0%,#09111f 55%,#030712 100%)',
    badge: base.badge || (status === 'showing' ? 'ĐANG CHIẾU' : 'SẮP CHIẾU'),
    year: cleanCatalogText(movie.releaseDate?.slice(0, 4), '2026'),
    date: status === 'upcoming' ? release.slice(0, 5) : undefined,
    releaseDate: movie.releaseDate,
    status,
    times: status === 'showing' ? (base.times || ['10:00', '12:30', '15:00', '17:30', '20:00']) : [],
  }
}

const renderSyncedCatalog = (managedMovies) => {
  const synced = managedMovies.map(apiMovieToCatalogMovie).filter((movie) => movie.status !== 'archived')
  const syncedShowing = synced.filter((movie) => movie.status === 'showing')
  const syncedComing = synced.filter((movie) => movie.status === 'upcoming')
  const syncedVietnamese = synced.filter((movie) => movie.origin === 'vn')

  showing.splice(0, showing.length, ...syncedShowing)
  comingSoon.splice(0, comingSoon.length, ...syncedComing)
  allMovies.splice(0, allMovies.length, ...synced)
  vietnameseMovies.splice(0, vietnameseMovies.length, ...syncedVietnamese)

  document.querySelector('#movieGrid2026').innerHTML = showing.map((movie) => movieCard(movie, { btn: true })).join('') || '<p class="empty-showtimes">Chưa có phim đang chiếu.</p>'
  document.querySelector('#vietnamMovieGrid').innerHTML = vietnameseMovies.slice(0, 8).map((movie) => movieCard(movie, { btn: movie.status === 'showing', detailOnly: movie.status !== 'showing', player: movie.status !== 'showing' })).join('') || '<p class="empty-showtimes">Chưa có phim Việt trong thư viện.</p>'
  document.querySelector('#comingMovieGrid').innerHTML = comingSoon.map((movie) => movieCard(movie, { player: true, detailOnly: true })).join('') || '<p class="empty-showtimes">Chưa có phim sắp chiếu.</p>'

  const featured = [...showing, ...comingSoon].slice(0, 4)
  document.querySelector('#heroPosterWall').innerHTML = featured.map((movie, index) => `
    <article class="hero-mini-poster p${index + 1}" data-detail="${movie.title}">
      <img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${movie.image || movie.fallback}" alt="Poster ${movie.title}" onerror="this.onerror=null;this.src='${movie.fallback || ''}'" />
      <div class="hero-mini-shade"></div>
      <div class="hero-mini-copy"><span>${movie.origin === 'vn' ? 'PHIM VIỆT' : movie.country}</span><strong>${movie.title}</strong></div>
    </article>`).join('')

  document.querySelector('#homeMovieCount').textContent = synced.length
  document.querySelector('#homeVnCount').textContent = syncedVietnamese.length
  document.querySelector('#homeVnLabel').textContent = `${syncedVietnamese.length} phim Việt nổi bật`
}

let catalogSnapshot = ''
const syncHomepageCatalog = async () => {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 1500)
    const response = await fetch(apiUrl('/movies'), { signal: controller.signal })
    clearTimeout(timer)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const managedMovies = await response.json()
    const nextSnapshot = JSON.stringify(managedMovies)
    if (nextSnapshot !== catalogSnapshot) {
      renderSyncedCatalog(managedMovies)
      catalogSnapshot = nextSnapshot
    }
  } catch { /* giữ dữ liệu cục bộ, không làm gián đoạn giao diện */ }
}

syncHomepageCatalog()
window.addEventListener('storage', (event) => { if (event.key === 'cgv_movie_cache_v1') syncHomepageCatalog() })

const requestedMovie = new URLSearchParams(location.search).get('movie')
if (requestedMovie) setTimeout(() => openMovieDetail(requestedMovie), 120)
