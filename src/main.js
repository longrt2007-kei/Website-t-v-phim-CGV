import './style.css'

const now = new Date()
const today = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const icons = {
  search:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  menu:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  star:
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>',
  play:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  ticket:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><circle cx="16" cy="12" r="1.4"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><circle cx="8" cy="12" r="1.4"/></svg>',
  pin:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  gift:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></svg>',
  card:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
  popcorn:
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8.5 12 4l5.5 4.5 2 8.5h-15z"/><path d="M9 4.5a1.5 1.5 0 0 1 3 0M12 8.5c2.5 0 4 1 4 1.5s-1.5 1.5-4 1.5-4-1-4-1.5 1.5-1.5 4-1.5z"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>',
}

const showing = [
  { title: 'The Batman Part II', meta: 'Hành động · Tội phạm · 150 phút', genre: 'T18', rate: '9.2', short: 'Batman trở lại Gotham trước thế lực bóng tối mới.', color: 'linear-gradient(165deg,#3b82f6 0%,#1e3a8a 45%,#0f172a 100%)', times: ['10:00', '13:30', '17:00', '20:30'] },
  { title: 'Avatar 4', meta: 'Khoa học viễn tưởng · 170 phút', genre: 'T13', rate: '9.5', short: 'Hành trình mới của Jake Sully ở Trái Đất ', color: 'linear-gradient(165deg,#06b6d4 0%,#155e75 45%,#042f2e 100%)', times: ['08:45', '12:15', '15:45', '19:15'] },
  { title: 'Toy Story 5', meta: 'Hoạt hình · Gia đình · 100 phút', genre: 'T16', rate: '8.9', short: 'Toys trở lại với cuộc phiêu lưu cảm động nhất.', color: 'linear-gradient(165deg,#f59e0b 0%,#b45309 45%,#451a03 100%)', times: ['09:30', '13:00', '16:30', '20:00'] },
  { title: 'Drowne', meta: 'Kinh dị · 105 phút', genre: 'T18', rate: '7.6', short: 'Những bí mật chôn vùi dưới biển luôn trồi lên.', color: 'linear-gradient(165deg,#64748b 0%,#334155 45%,#020617 100%)', times: ['11:30', '18:00', '21:30'] },
  { title: 'Làm Giàu Với Ma', meta: 'Hài · Gia đình · 95 phút', genre: 'T16', rate: '8.4', short: 'Hai chị em chuyển về căn nhà hoang… và kiếm tiền cùng ma.', color: 'linear-gradient(165deg,#ef4444 0%,#991b1b 45%,#450a0a 100%)', times: ['10:30', '14:00', '19:00'] },
  { title: 'Inton the Wilds', meta: 'Phiêu lưu · 110 phút', genre: 'P', rate: '8.1', short: 'Hòa mình vào thiên nhiên hoang dã rực rỡ.', color: 'linear-gradient(165deg,#22c55e 0%,#15803d 45%,#052e16 100%)', times: ['09:00', '15:30'] },
]

const comingSoon = [
  { title: 'Shrek 5', meta: 'Hoạt hình · 92 phút', genre: 'P', date: '25.12', color: 'linear-gradient(165deg,#a855f7 0%,#6b21a8 45%,#2e1065 100%)' },
  { title: 'Next Gen 2', meta: 'Hành động · 120 phút', genre: 'T13', date: '01.01', color: 'linear-gradient(165deg,#f97316 0%,#c2410c 45%,#431407 100%)' },
  { title: 'Spiderman 5', meta: 'Siêu anh hùng · 140 phút', genre: 'T13', date: '08.01', color: 'linear-gradient(165deg,#dc2626 0%,#991b1b 45%,#450a0a 100%)' },
  { title: 'Wonder Woman 3', meta: 'Siêu anh hùng · 135 phút', genre: 'T13', date: '15.01', color: 'linear-gradient(165deg,#eab308 0%,#a16207 45%,#422006 100%)' },
]

const news = [
  { tag: 'SỰ KIỆN', title: 'Gala ra mắt The Batman Part II', desc: 'Vé đêm công chiếu đã mở bán, fan có mặt sớm để nhận quà độc quyền.', color: 'linear-gradient(135deg,#3b82f6,#111827)' },
  { tag: 'ƯU ĐÃI', title: 'Bắp nước miễn phí dịp cuối tuần', desc: 'Trình vé trước 12h để nhận thêm 1 bắp ngọt cho mỗi suất chiếu.', color: 'linear-gradient(135deg,#f59e0b,#7c2d12)' },
  { tag: 'TRAILER', title: 'Trailer Shrek 5 chính thức lộ diện', desc: 'Đế chế Far Far Away khoác lên mình diện mạo hoàn toàn mới.', color: 'linear-gradient(135deg,#a855f7,#2e1065)' },
]

const theaters = [
  { id: 'ct1', name: 'CGV Vincom Đồng Khởi', addr: 'Tầng 3, Vincom Center, 72 Lê Thánh Tôn, Q.1' },
  { id: 'ct2', name: 'CGV Crescent Mall', addr: 'Tầng 5, Crescent Mall, 101 Tôn Dật Tiên, Q.7' },
  { id: 'ct3', name: 'CGV Vincom Thảo Điền', addr: 'Tầng 3, Vincom Mega Mall, Xa lộ Hà Nội, Q.2' },
]

const showtimes = {
  ct1: [
    { title: 'The Batman Part II', format: '2D Phụ đề', times: ['10:00', '13:30', '17:00', '20:30'] },
    { title: 'Avatar 4', format: '2D Lồng tiếng', times: ['08:45', '12:15', '15:45', '19:15'] },
    { title: 'Toy Story 5', format: '3D Lồng tiếng', times: ['09:30', '13:00', '16:30', '20:00'] },
    { title: 'Drowne', format: '2D Phụ đề', times: ['11:30', '18:00', '21:30'] },
  ],
  ct2: [
    { title: 'Avatar 4', format: 'IMAX 2D Phụ đề', times: ['09:00', '12:30', '16:00', '19:30', '22:30'] },
    { title: 'The Batman Part II', format: '2D Phụ đề', times: ['10:30', '14:00', '17:30', '21:00'] },
    { title: 'Làm Giàu Với Ma', format: '2D Phụ đề', times: ['11:00', '15:00', '19:20'] },
    { title: 'Inton the Wilds', format: '2D Lồng tiếng', times: ['08:30', '13:45'] },
  ],
  ct3: [
    { title: 'Toy Story 5', format: '2D Phụ đề', times: ['09:15', '12:45', '16:15', '19:45'] },
    { title: 'Drowne', format: '4DX 2D Phụ đề', times: ['10:15', '18:30', '21:45'] },
    { title: 'The Batman Part II', format: '2D Phụ đề', times: ['14:30', '17:45', '21:00'] },
    { title: 'Làm Giàu Với Ma', format: '2D Lồng tiếng', times: ['11:30', '15:30'] },
  ],
}

const upcomingShowtimes = {
  '25/09': {
    label: 'Thứ Sáu · 25/09',
    theaters: {
      ct1: [
        { title: 'The Batman Part II', format: '2D Phụ đề', times: ['10:30', '14:00', '18:00', '21:15'] },
        { title: 'Avatar 4', format: '2D Lồng tiếng', times: ['09:00', '12:30', '16:00', '19:30'] },
        { title: 'Toy Story 5', format: '3D Lồng tiếng', times: ['10:00', '13:30', '17:00', '20:30'] },
      ],
      ct2: [
        { title: 'Avatar 4', format: 'IMAX 2D Phụ đề', times: ['09:15', '12:45', '16:15', '20:00'] },
        { title: 'The Batman Part II', format: '2D Phụ đề', times: ['11:00', '15:00', '18:30', '21:30'] },
        { title: 'Làm Giàu Với Ma', format: '2D Phụ đề', times: ['10:30', '14:30', '19:00'] },
      ],
      ct3: [
        { title: 'Toy Story 5', format: '2D Phụ đề', times: ['09:30', '13:00', '16:30', '20:00'] },
        { title: 'Drowne', format: '4DX 2D Phụ đề', times: ['11:15', '17:45', '21:15'] },
      ],
    },
  },
  '26/09': {
    label: 'Thứ Bảy · 26/09',
    theaters: {
      ct1: [
        { title: 'The Batman Part II', format: '2D Phụ đề', times: ['09:30', '13:00', '16:30', '20:00'] },
        { title: 'Avatar 4', format: '2D Lồng tiếng', times: ['10:00', '14:00', '17:30', '21:00'] },
        { title: 'Drowne', format: '2D Phụ đề', times: ['11:30', '18:30', '22:00'] },
      ],
      ct2: [
        { title: 'Avatar 4', format: 'IMAX 2D Phụ đề', times: ['09:00', '12:00', '15:30', '19:00', '22:00'] },
        { title: 'Toy Story 5', format: '3D Lồng tiếng', times: ['10:30', '14:30', '18:00', '20:30'] },
        { title: 'Làm Giàu Với Ma', format: '2D Phụ đề', times: ['11:00', '15:00', '19:30'] },
      ],
      ct3: [
        { title: 'The Batman Part II', format: '2D Phụ đề', times: ['10:00', '13:30', '17:00', '21:00'] },
        { title: 'Drowne', format: '4DX 2D Phụ đề', times: ['12:15', '18:15', '21:45'] },
      ],
    },
  },
  '27/09': {
    label: 'Chủ Nhật · 27/09',
    theaters: {
      ct1: [
        { title: 'Avatar 4', format: '2D Lồng tiếng', times: ['09:00', '12:30', '16:00', '19:30'] },
        { title: 'Toy Story 5', format: '3D Lồng tiếng', times: ['10:00', '13:30', '17:00', '20:30'] },
        { title: 'The Batman Part II', format: '2D Phụ đề', times: ['11:00', '14:30', '18:00', '21:30'] },
      ],
      ct2: [
        { title: 'The Batman Part II', format: 'IMAX 2D Phụ đề', times: ['09:30', '13:00', '16:30', '20:00'] },
        { title: 'Avatar 4', format: 'IMAX 2D Phụ đề', times: ['10:30', '14:00', '17:30', '21:00'] },
        { title: 'Làm Giàu Với Ma', format: '2D Lồng tiếng', times: ['11:30', '15:30', '19:30'] },
      ],
      ct3: [
        { title: 'Toy Story 5', format: '2D Phụ đề', times: ['09:15', '12:45', '16:15', '19:45'] },
        { title: 'Drowne', format: '4DX 2D Phụ đề', times: ['10:45', '17:30', '21:30'] },
      ],
    },
  },
}

const renderUpcomingShowtimes = (dateKey, theaterId) => {
  const date = upcomingShowtimes[dateKey]
  const rows = date?.theaters?.[theaterId] || []
  if (!rows.length) return '<p class="empty-showtimes">Chưa có lịch chiếu cho ngày này.</p>'
  return rows.map((s) => `
    <div class="st-row">
      <div class="st-info">
        <h4>${s.title}</h4>
        <span class="st-format">${s.format}</span>
      </div>
      <div class="st-times">
        ${s.times.map((t) => `<button type="button" class="time-chip">${t}</button>`).join('')}
      </div>
    </div>
  `).join('')
}

const poster = (m, opts = {}) => `
  <div class="poster" style="background:${m.color}">
    <div class="poster-glow"></div>
    <span class="poster-letter">${m.title.charAt(0)}</span>
    <span class="genre">${m.genre}</span>
    ${m.date ? `<span class="date">${m.date}</span>` : ''}
    ${opts.player ? '<span class="poster-play">' + icons.play + '</span>' : ''}
  </div>
`

const movieCard = (m, opts = {}) => `
  <article class="movie-card" data-title="${m.title}">
    ${poster(m, opts)}
    <div class="card-rate"><span>${icons.star}</span>${m.rate}</div>
    <div class="card-body">
      <h3>${m.title}</h3>
      <p>${m.meta}</p>
      ${m.short ? `<p class="card-desc">${m.short}</p>` : ''}
      ${opts.btn ? `<button type="button" class="btn-ticket" data-buy="${m.title}">${icons.ticket}<span>MUA VÉ</span></button>` : `<button type="button" class="btn-ticket ghost" data-notify="${m.title}">ĐẶT VÉ TRƯỚC</button>`}
    </div>
  </article>
`

const renderShowtimes = (id) => `
  ${showtimes[id].map((s) => `
    <div class="st-row">
      <div class="st-info">
        <h4>${s.title}</h4>
        <span class="st-format">${s.format}</span>
      </div>
      <div class="st-times">
        ${s.times.map((t) => `<button type="button" class="time-chip">${t}</button>`).join('')}
      </div>
    </div>
  `).join('')}
`

document.querySelector('#app').innerHTML = `
<header class="header">
  <div class="container header-inner">
    <button type="button" class="burger" id="burger" aria-label="Mở menu">${icons.menu}</button>
    <a href="#" class="logo">CGV<span>Cinemas</span></a>
    <nav class="nav" id="nav">
      <a href="#showing">PHIM</a>
      <a href="#showtimes">LỊCH CHIẾU</a>
      <a href="#upcoming">SẮP TỚI</a>
      <a href="#promo">KHUYẾN MÃI</a>
      <a href="#news">TIN TỨC</a>
      <a href="#member">THÀNH VIÊN</a>
    </nav>
    <div class="header-actions">
      <button type="button" class="icon-btn" id="searchOpen" aria-label="Tìm kiếm">${icons.search}</button>
      <button type="button" class="login-btn">ĐĂNG NHẬP</button>
    </div>
  </div>
</header>

<section class="hero">
  <div class="hero-bg">
    <span class="orb orb-1"></span>
    <span class="orb orb-2"></span>
    <span class="orb orb-3"></span>
  </div>
  <div class="container hero-inner">
    <div class="hero-copy">
      <span class="hero-badge">HỆ THỐNG RẠP CHUẨN QUỐC TẾ</span>
      <p class="hero-date">${today}</p>
      <h1>Điện ảnh là <br />một <span>giấc mơ</span></h1>
      <p class="hero-sub">Trải nghiệm công nghệ màn hình hàng đầu IMAX · 4DX · Laser với những bom tấn trong và ngoài nước.</p>
      <div class="hero-cta">
        <a href="#showing" class="btn btn-primary">${icons.ticket}<span>ĐẶT VÉ NGAY</span></a>
        <a href="#showtimes" class="btn btn-ghost">${icons.pin}<span>XEM LỊCH CHIẾU</span></a>
      </div>
      <div class="hero-stats">
        <div><strong>20+</strong><span>Rạp chiếu</span></div>
        <div><strong>2K</strong><span>Màn hình hiện đại</span></div>
        <div><strong>4M+</strong><span>Khán giả mỗi năm</span></div>
      </div>
    </div>
    <div class="hero-feature">
      <div class="hf-poster" style="background:linear-gradient(165deg,#3b82f6,#0f172a)">
        <span class="genre">HOT TUẦN</span>
        <span class="hf-letter">B</span>
      </div>
      <div class="hf-info">
        <h3>The Batman Part II</h3>
        <p>Đặt vé trước để chọn ghế đẹp nhất</p>
        <button type="button" class="btn btn-primary btn-sm" data-buy="The Batman Part II">MUA VÉ</button>
      </div>
    </div>
  </div>
</section>

<section id="showing" class="section">
  <div class="container">
    <div class="section-head">
      <h2>PHIM ĐANG CHIẾU</h2>
      <a href="#" class="see-all">Xem tất cả</a>
    </div>
    <div class="grid">
      ${showing.map((m) => movieCard(m, { btn: true })).join('')}
    </div>
  </div>
</section>

<section id="coming" class="section section-alt">
  <div class="container">
    <div class="section-head">
      <h2>PHIM SẮP CHIẾU</h2>
      <a href="#" class="see-all">Xem tất cả</a>
    </div>
    <div class="grid grid-4">
      ${comingSoon.map((m) => movieCard(m, { player: true })).join('')}
    </div>
  </div>
</section>

<section id="showtimes" class="section">
  <div class="container">
    <div class="section-head">
      <h2>LỊCH CHIẾU HÔM NAY</h2>
      <span class="see-all">Chọn rạp gần bạn</span>
    </div>
    <div class="tabs" id="theaterTabs">
      ${theaters.map((t) => `<button type="button" class="tab" data-id="${t.id}">${t.name}</button>`).join('')}
    </div>
    <div class="tab-sub" id="theaterAddr">${theaters[0].name} · ${theaters[0].addr}</div>
    <div class="showtimes" id="showtimesBox">
      ${renderShowtimes('ct1')}
    </div>
  </div>
</section>

<section id="upcoming" class="section section-alt">
  <div class="container">
    <div class="section-head">
      <h2>LỊCH CHIẾU SẮP TỚI</h2>
      <span class="see-all">Đặt vé trước</span>
    </div>
    <div class="upcoming-controls">
      <div class="tabs" id="upcomingDateTabs">
        ${Object.entries(upcomingShowtimes).map(([dateKey, date], index) =>
          `<button type="button" class="tab upcoming-date-tab ${index === 0 ? 'active' : ''}" data-date="${dateKey}">${date.label}</button>`
        ).join('')}
      </div>
      <div class="tabs" id="upcomingTheaterTabs">
        ${theaters.map((t, index) =>
          `<button type="button" class="tab upcoming-theater-tab ${index === 0 ? 'active' : ''}" data-id="${t.id}">${t.name}</button>`
        ).join('')}
      </div>
    </div>
    <div class="tab-sub" id="upcomingSub">
      ${upcomingShowtimes['25/09'].label} · ${theaters[0].name} · ${theaters[0].addr}
    </div>
    <div class="showtimes" id="upcomingBox">
      ${renderUpcomingShowtimes('25/09', 'ct1')}
    </div>
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
        <p>Duyệt danh sách phim, chọn rạp và khung giờ phù hợp.</p>
      </div>
      <div class="how-step">
        <span class="step-num">2</span>
        <h3>Chọn ghế ngồi</h3>
        <p>Tương tác sơ đồ ghế thời gian thực theo giao diện thân thiện.</p>
      </div>
      <div class="how-step">
        <span class="step-num">3</span>
        <h3>Thanh toán</h3>
        <p>Thanh toán online mọi kênh, nhận vé điện tử ngay tại cửa quầy.</p>
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
    <a href="#" class="btn btn-primary">ĐĂNG KÝ NGAY</a>
  </div>
</section>

<section class="app-banner">
  <div class="container app-inner">
    <div>
      <h2>Tải app CGV Cinemas</h2>
      <p>Đặt vé dễ dàng, mở khóa ưu đãi độc quyền trên di động.</p>
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
        <a href="#">CGV Vincom Đồng Khởi</a>
        <a href="#">CGV Crescent Mall</a>
        <a href="#">CGV Vincom Thảo Điền</a>
        <a href="#">Xem tất cả rạp</a>
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
      <p>&copy; ${now.getFullYear()} CGV Cinemas. Bản quyền thuộc về CGV.</p>
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
    <p class="search-hint">Gợi ý: The Batman, Avatar, Toy Story...</p>
  </div>
</div>

<div class="modal" id="movieModal" hidden>
  <div class="modal-backdrop" data-close></div>
  <div class="modal-box">
    <button type="button" class="modal-close" data-close aria-label="Đóng">${icons.close}</button>
    <div id="modalContent"></div>
  </div>
</div>

<button type="button" class="to-top" id="toTop" aria-label="Lên đầu trang"></button>
`

const state = { modalMode: 'buy' }

const openModal = (title, mode = 'buy') => {
  const m = [...showing, ...comingSoon].find((x) => x.title === title)
  if (!m) return
  state.modalMode = mode
  const times = m.times || []
  document.querySelector('#modalContent').innerHTML = `
    <div class="mm-head" style="background:${m.color}">
      <span class="mm-letter">${m.title.charAt(0)}</span>
      <div>
        <span class="genre">${m.genre}</span>
        <h3>${m.title}</h3>
        <p>${m.meta} · Điểm ${m.rate}/10</p>
      </div>
    </div>
    <div class="mm-body">
      <h4>${mode === 'buy' ? 'CHỌN SUẤT CHIẾU' : 'ĐẶT LỊCH NHẮC'}</h4>
      <div class="st-times">
        ${times.length
          ? times.map((t) => `<button type="button" class="time-chip" data-time="${t}">${t}</button>`).join('')
          : '<span class="mm-date">Khởi chiếu ' + m.date + '</span>'}
      </div>
      <p class="mm-note" id="mmNote">Vui lòng chọn một suất chiếu ${mode === 'buy' ? 'để đặt vé' : 'để nhận thông báo'}.</p>
    </div>
  `
  document.querySelector('#movieModal').hidden = false
  document.body.style.overflow = 'hidden'
  document.querySelectorAll('#modalContent .time-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#modalContent .time-chip').forEach((c) => c.classList.remove('active'))
      chip.classList.add('active')
      const note = document.querySelector('#mmNote')
      note.innerHTML =
        state.modalMode === 'buy'
          ? `Vé phim <strong>${m.title}</strong> lúc <strong>${chip.dataset.time}</strong> đã được chọn. Bạn sẽ chuyển tới trang thanh toán.`
          : `CGV sẽ nhắc bạn ngay khi <strong>${m.title}</strong> khởi chiếu.`
      note.classList.add('ok')
    })
  })
}

const closeModal = () => {
  document.querySelector('#movieModal').hidden = true
  document.body.style.overflow = ''
}

document.addEventListener('click', (e) => {
  const buy = e.target.closest('[data-buy]')
  if (buy) {
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

const tabs = document.querySelectorAll('.tab')
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'))
    tab.classList.add('active')
    const th = theaters.find((t) => t.id === tab.dataset.id)
    document.querySelector('#theaterAddr').textContent = `${th.name} · ${th.addr}`
    document.querySelector('#showtimesBox').innerHTML = renderShowtimes(tab.dataset.id)
  })
})

let upcomingDate = '25/09'
let upcomingTheater = 'ct1'

const updateUpcomingShowtimes = () => {
  const date = upcomingShowtimes[upcomingDate]
  const theater = theaters.find((t) => t.id === upcomingTheater)
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

document.querySelectorAll('.upcoming-theater-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.upcoming-theater-tab').forEach((t) => t.classList.remove('active'))
    tab.classList.add('active')
    upcomingTheater = tab.dataset.id
    updateUpcomingShowtimes()
  })
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
  document.querySelectorAll('#showing .movie-card').forEach((card) => {
    card.style.display = !q || card.dataset.title.toLowerCase().includes(q) ? '' : 'none'
  })
})

const toTop = document.querySelector('#toTop')
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600)
}, { passive: true })
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

document.querySelectorAll('.time-chip').forEach((chip) => {
  chip.addEventListener('click', () => chip.classList.add('active'))
})