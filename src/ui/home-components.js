import { icons } from './icons.js'
import {
  showing,
  comingSoon,
  theaters,
  showtimes,
  upcomingShowtimes,
  datePlans,
  movieDetails,
} from '../data/home-catalog.js'

export const getMovieDetail = (movie) =>
  movieDetails[movie.title] || {
    synopsis: movie.short || 'Thông tin nội dung đang được cập nhật.',
    director: movie.director || 'Đang cập nhật',
    cast: 'Đang cập nhật',
    producer: 'Đang cập nhật',
    country: movie.country || 'Đang cập nhật',
    language: movie.origin === 'intl' ? 'Tiếng Anh · Phụ đề Việt' : 'Tiếng Việt',
    formats: '2D',
    release: movie.date || 'Đang cập nhật',
    duration: movie.meta || 'Đang cập nhật',
    classification: movie.genre || 'Đang cập nhật',
    genreFull: movie.meta || 'Đang cập nhật',
    highlight: 'Thông tin đang được cập nhật.',
    sourceName: 'Dữ liệu quản lý phim',
    sourceUrl: '/admin.html',
  }

export const renderUpcomingShowtimes = (dateKey, theaterId) => {
  const date = upcomingShowtimes[dateKey]
  const rows = date?.theaters?.[theaterId] || []
  if (!rows.length) return '<p class="empty-showtimes">Chưa có lịch chiếu cho ngày này.</p>'
  return rows
    .map(
      (s) => `
    <div class="st-row">
      <div class="st-info">
        <h4>${s.title}</h4>
        <span class="st-format">${s.format}</span>
      </div>
      <div class="st-times">
        ${s.times.map((t) => `<button type="button" class="time-chip">${t}</button>`).join('')}
      </div>
    </div>
  `,
    )
    .join('')
}

export const poster = (m, opts = {}) => `
  <div class="poster" style="background:${m.color}">
    ${m.image ? `<img class="poster-img" src="${m.image}" alt="Poster ${m.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${m.fallback || ''}'" />` : ''}
    <div class="poster-shade">
  </div>
    <div class="poster-glow">
  </div>
    ${m.image ? '' : `<span class="poster-letter">${m.title.charAt(0)}</span>`}
    <span class="genre">${m.genre}</span>
    ${m.badge ? `<span class="trend-badge">${m.badge}</span>` : ''}
    ${m.date ? `<span class="date">${m.date}</span>` : m.year ? `<span class="date">${m.year}</span>` : ''}
    ${opts.player ? '<span class="poster-play">' + icons.play + '</span>' : ''}
  </div>
`

export const movieCard = (m, opts = {}) => `
  <article class="movie-card" data-title="${m.title}" data-origin="${m.origin}" data-meta="${(m.meta || '').toLowerCase()}">
    ${poster(m, opts)}
    ${m.rate ? `<div class="card-rate">
      <span>${icons.star}</span>${m.rate}</div>` : ''}
    <div class="card-body">
      <div class="movie-origin-row">
  <span>${m.country || 'Đang cập nhật'}</span>
  <span>${m.origin === 'intl' ? 'QUỐC TẾ' : 'PHIM VIỆT'}</span>
  </div>
      <h3>${m.title}</h3>
      <p>${m.meta}</p>
      ${m.short ? `<p class="card-desc">${m.short}</p>` : ''}
      <div class="card-actions">
        <button type="button" class="btn-details" data-detail="${m.title}">${icons.info}<span>CHI TIẾT</span>
  </button>
        ${opts.detailOnly ? '' : opts.btn ? `<button type="button" class="btn-ticket" data-buy="${m.title}">${icons.ticket}<span>MUA VÉ</span>
          </button>` : `<button type="button" class="btn-ticket ghost" data-notify="${m.title}">ĐẶT VÉ TRƯỚC</button>`}
      </div>
    </div>
  </article>
`

export const renderShowtimes = (id) => {
  const rows = showtimes[id] || []
  if (!rows.length) return '<p class="empty-showtimes">Rạp này chưa có lịch chiếu.</p>'
  return rows
    .map(
      (s) => `
    <div class="st-row">
      <div class="st-info">
        <h4>${s.title}</h4>
        <span class="st-format">${s.format}</span>
      </div>
      <div class="st-times">
        ${s.times.map((t) => `<button type="button" class="time-chip">${t}</button>`).join('')}
      </div>
    </div>
  `,
    )
    .join('')
}

export const theaterOptions = (region = 'all') => {
  const rows = region === 'all' ? theaters : theaters.filter((t) => t.region === region)
  return rows.map((t) => `<option value="${t.id}">${t.name} · ${t.city}</option>`).join('')
}

export const totalTodayShows = Object.values(showtimes).reduce(
  (sum, rows) => sum + rows.reduce((n, row) => n + row.times.length, 0),
  0,
)
