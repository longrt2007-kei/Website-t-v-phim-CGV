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
  info:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  user:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  lock:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  dashboard:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  logout:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>',
}

const fallbackPoster = (slug) => `./posters/2026-${slug}.svg`

const officialPosterFallback = './posters/poster-unavailable.svg'

const showing = [
  {
    title: 'Trại Buôn Người', meta: 'Hành động · Tâm lý · 135 phút', genre: 'T18', country: 'Việt Nam', origin: 'vn', badge: 'PHIM VIỆT 2026', year: '2026',
    short: 'Ny tìm cách xâm nhập đường dây buôn người ở khu vực biên giới để cứu em gái và những nạn nhân đang bị giam giữ.',
    color: 'linear-gradient(165deg,#8f321f 0%,#2b1717 50%,#09090b 100%)',
    image: 'https://cdn.moveek.com/storage/media/cache/tall/685135c5a1420912750051.jpg', fallback: officialPosterFallback,
    times: ['09:15', '11:50', '14:30', '17:10', '19:50', '22:30']
  },
  {
    title: 'Út Lan 2', meta: 'Kinh dị · 107 phút', genre: 'T18', country: 'Việt Nam', origin: 'vn', badge: 'KINH DỊ VIỆT', year: '2026',
    short: 'Một con rắn hai đầu xuất hiện, kéo theo những cái chết bí ẩn tại ngôi làng ven sông và những lời nguyền tưởng đã bị lãng quên.',
    color: 'linear-gradient(165deg,#355d54 0%,#132b28 48%,#070a0b 100%)',
    image: 'https://img.youtube.com/vi/Jynil1gFfVg/maxresdefault.jpg', fallback: officialPosterFallback,
    times: ['09:20', '11:30', '13:45', '16:00', '18:20', '20:30', '22:40']
  },
  {
    title: 'Lên Hương', meta: 'Tâm lý · Gia đình · 121 phút', genre: 'T16', country: 'Việt Nam', origin: 'vn', badge: 'PHIM VIỆT 2026', year: '2026',
    short: 'Một bà chủ trại hòm và một chàng trai trẻ bị cuốn vào một giao kèo, từ đó những món nợ và bí mật gia đình dần lộ ra.',
    color: 'linear-gradient(165deg,#a66a42 0%,#4a2c24 48%,#130d0c 100%)',
    image: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/09-2026/lh.jpg', fallback: officialPosterFallback,
    times: ['09:35', '12:00', '14:30', '17:00', '19:30', '22:00']
  },
  {
    title: 'Bóng Ma Nhà Hát', meta: 'Hài · Kinh dị · 97 phút', genre: 'T16', country: 'Việt Nam', origin: 'vn', badge: 'HORROR COMEDY', year: '2026',
    short: 'Tuấn phải vực dậy một nhà hát cũ và phát hiện nơi đây bị ám bởi Nhã, một nữ diễn viên chết oan chưa thể siêu thoát.',
    color: 'linear-gradient(165deg,#553672 0%,#211728 48%,#09080c 100%)',
    image: 'https://img.youtube.com/vi/1NlUcffgB0o/maxresdefault.jpg', fallback: officialPosterFallback,
    times: ['10:10', '12:10', '14:20', '16:30', '18:40', '20:50']
  },
  {
    title: 'Mãi Nợ Một Lời Tạm Biệt', meta: 'Tâm lý · Gia đình · 120 phút', genre: 'K', country: 'Việt Nam', origin: 'vn', badge: 'PHIM VIỆT 2026', year: '2026',
    short: 'Daniel trở về với những ký ức tuổi thơ, người bà và lời tạm biệt chưa kịp nói, từ đó đối diện với gia đình và mất mát.',
    color: 'linear-gradient(165deg,#56738d 0%,#27384b 48%,#0a1018 100%)',
    image: 'https://dabacocine.com/Areas/Admin/Content/Fileuploads/images/MAI-NO-MOT-LOI-TAM-BIET1(1).JPG', fallback: officialPosterFallback,
    times: ['09:40', '12:10', '14:40', '17:10', '19:40']
  },
  {
    title: 'Colony', meta: 'Giật gân · Hành động · 122 phút', genre: 'T16', country: 'Hàn Quốc', origin: 'intl', badge: 'K-MOVIE 2026', year: '2026',
    short: 'Một ổ dịch bí ẩn bùng phát trong tòa nhà chọc trời ở Seoul, khiến những người bên trong bị phong tỏa và phải tìm đường sống sót.',
    color: 'linear-gradient(165deg,#0b392f 0%,#061f1c 48%,#030d0c 100%)',
    image: 'https://pbs.twimg.com/media/HJZSFHHbYAAj8AJ?format=jpg&name=large', fallback: officialPosterFallback,
    times: ['09:20', '11:55', '14:30', '17:10', '19:45', '22:20']
  },
  {
    title: 'The Odyssey', meta: 'Sử thi · Hành động · 172 phút', genre: 'T18', country: 'Mỹ', origin: 'intl', badge: 'IMAX 2026', year: '2026',
    short: 'Christopher Nolan chuyển thể thiên sử thi Odyssey của Homer thành một hành trình thần thoại quy mô lớn trên màn ảnh IMAX.',
    color: 'linear-gradient(165deg,#29445d 0%,#11293a 48%,#070e16 100%)',
    image: 'https://www.televisionacademy.com/files/assets/posters/screening-the-odyssey-312x462.jpg', fallback: officialPosterFallback,
    times: ['09:00', '12:20', '15:40', '19:00', '22:20']
  },
  {
    title: 'Quỷ Dữ Từ Luyện Ngục', meta: 'Kinh dị · Giật gân · 101 phút', genre: 'T18', country: 'Thái Lan', origin: 'intl', badge: 'KINH DỊ 2026', year: '2026',
    short: 'Lấy cảm hứng từ một vụ án năm 1978, bộ phim kể về oan hồn Kingkaew trở lại sau cái chết đầy uất hận.',
    color: 'linear-gradient(165deg,#5b1b18 0%,#211012 48%,#08080a 100%)',
    image: 'https://cdn.galaxycine.vn/media/2026/4/1/kingkaew-750_1775014038737.jpg', fallback: officialPosterFallback,
    times: ['10:00', '12:10', '14:20', '16:30', '18:40', '20:50', '23:00']
  },
]

const comingSoon = [
  {
    title: 'Án Mạng Karaoke', meta: 'Hài · Bí ẩn · Giật gân · 96 phút', genre: 'T16', date: '02/10', year: '2026', country: 'Việt Nam', origin: 'vn', badge: 'SẮP CHIẾU',
    short: 'Một người hàng xóm mê karaoke bị sát hại trong homestay biệt lập, khiến cả nhóm phải lần theo lời khai và những bí mật để tìm hung thủ.',
    color: 'linear-gradient(165deg,#9b2238,#2a1117 55%,#08080a)', image: 'https://img.youtube.com/vi/UOjRGIatX38/maxresdefault.jpg', fallback: officialPosterFallback
  },
  {
    title: 'Mẹ Mìn', meta: 'Điện ảnh Việt Nam', genre: 'T16', date: '23/10', year: '2026', country: 'Việt Nam', origin: 'vn', badge: 'SẮP CHIẾU',
    short: 'Dự án điện ảnh của V Studios với dàn diễn viên Minh Hằng, Rima Thanh Vy, Khương Lê, Nhật Kim Anh, Phát La và Huỳnh Nhựt.',
    color: 'linear-gradient(165deg,#56314d,#23131f 55%,#08080a)', image: 'https://thegioidienanh.vn/stores/news_dataimages/2026/032026/24/15/me-min-announcement-poster20260324151242.jpg?rt=20260324151833', fallback: officialPosterFallback
  },
]

const news = [
  { tag: 'PHIM VIỆT 2026', title: 'Nhiều phim Việt ra rạp trong tháng 9 và tháng 10', desc: 'Trại Buôn Người, Út Lan 2, Lên Hương, Bóng Ma Nhà Hát và Án Mạng Karaoke tạo nên lịch phim Việt đa dạng từ tâm lý đến kinh dị.', color: 'linear-gradient(135deg,#d93125,#4a1214)' },
  { tag: 'KINH DỊ 2026', title: 'Kinh dị Việt và châu Á có nhiều lựa chọn', desc: 'Út Lan 2, Bóng Ma Nhà Hát và Quỷ Dữ Từ Luyện Ngục là các phim 2026 có thông tin phát hành đã được đối chiếu từ nguồn rạp.', color: 'linear-gradient(135deg,#173d34,#090d0c)' },
  { tag: 'SẮP CHIẾU', title: 'Án Mạng Karaoke ra mắt 02/10/2026', desc: 'Phim của đạo diễn Hoàng Lê có Đoàn Thiên Ân, Đại Nghĩa và Vân Dung, thuộc nhóm phim Việt đáng chú ý ra rạp đầu tháng 10.', color: 'linear-gradient(135deg,#5d2e70,#1c1124)' },
]

const theaters = [
  { id: 'aeon-long-bien', name: 'CGV AEON Long Biên', addr: 'AEON Mall Long Biên, Long Biên, Hà Nội', region: 'north', city: 'Hà Nội', screens: 10, status: 'Đang hoạt động' },
  { id: 'vincom-ba-trieu', name: 'CGV Vincom Bà Triệu', addr: 'Vincom Center Bà Triệu, Hai Bà Trưng, Hà Nội', region: 'north', city: 'Hà Nội', screens: 9, status: 'Đang hoạt động' },
  { id: 'aeon-ha-dong', name: 'CGV AEON Hà Đông', addr: 'AEON Mall Hà Đông, Hà Đông, Hà Nội', region: 'north', city: 'Hà Nội', screens: 8, status: 'Đang hoạt động' },
  { id: 'vincom-metropolis', name: 'CGV Vincom Metropolis', addr: 'Vincom Center Metropolis, Ba Đình, Hà Nội', region: 'north', city: 'Hà Nội', screens: 7, status: 'Đang hoạt động' },
  { id: 'vincom-ha-long', name: 'CGV Vincom Hạ Long', addr: 'Vincom Plaza Hạ Long, Quảng Ninh', region: 'north', city: 'Hạ Long', screens: 6, status: 'Đang hoạt động' },

  { id: 'vincom-da-nang', name: 'CGV Vincom Đà Nẵng', addr: 'Vincom Plaza Ngô Quyền, Sơn Trà, Đà Nẵng', region: 'central', city: 'Đà Nẵng', screens: 7, status: 'Đang hoạt động' },
  { id: 'vincom-hue', name: 'CGV Vincom Huế', addr: 'Vincom Plaza Huế, Phú Nhuận, Huế', region: 'central', city: 'Huế', screens: 6, status: 'Đang hoạt động' },
  { id: 'vincom-vinh', name: 'CGV Vincom Vinh', addr: 'Vincom Plaza Vinh, Nghệ An', region: 'central', city: 'Vinh', screens: 6, status: 'Đang hoạt động' },
  { id: 'vincom-nha-trang', name: 'CGV Vincom Nha Trang', addr: 'Vincom Plaza Trần Phú, Nha Trang, Khánh Hòa', region: 'central', city: 'Nha Trang', screens: 6, status: 'Đang hoạt động' },
  { id: 'quy-nhon-center', name: 'CGV Quy Nhơn Center', addr: 'Trung tâm Quy Nhơn, Bình Định', region: 'central', city: 'Quy Nhơn', screens: 5, status: 'Đang hoạt động' },

  { id: 'landmark-81', name: 'CGV Landmark 81', addr: 'Vincom Center Landmark 81, Bình Thạnh, TP.HCM', region: 'south', city: 'TP.HCM', screens: 9, status: 'Đang hoạt động' },
  { id: 'aeon-tan-phu', name: 'CGV AEON Tân Phú', addr: 'AEON Mall Tân Phú Celadon, Tân Phú, TP.HCM', region: 'south', city: 'TP.HCM', screens: 10, status: 'Đang hoạt động' },
  { id: 'vincom-dong-khoi', name: 'CGV Vincom Đồng Khởi', addr: 'Vincom Center Đồng Khởi, Quận 1, TP.HCM', region: 'south', city: 'TP.HCM', screens: 8, status: 'Đang hoạt động' },
  { id: 'gigamall-thu-duc', name: 'CGV GigaMall Thủ Đức', addr: 'GigaMall, TP. Thủ Đức, TP.HCM', region: 'south', city: 'TP.HCM', screens: 8, status: 'Đang hoạt động' },
  { id: 'sense-city-can-tho', name: 'CGV Sense City Cần Thơ', addr: 'Sense City, Ninh Kiều, Cần Thơ', region: 'south', city: 'Cần Thơ', screens: 7, status: 'Đang hoạt động' },
]

const regionLabels = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam' }
const allMovies = [...showing, ...comingSoon]
const seedMoviesById = Object.fromEntries(allMovies.map((movie, index) => [String(index + 1), movie]))
const currentMovieCount = showing.length
const vnMovieCount = allMovies.filter((m) => m.origin === 'vn').length
const intlMovieCount = allMovies.filter((m) => m.origin === 'intl').length
const vietnameseMovies = allMovies.filter((m) => m.origin === 'vn')

const baseTimes = [
  ['09:00', '11:25', '13:50', '16:15', '18:40', '21:05'],
  ['09:30', '12:00', '14:30', '17:00', '19:30', '22:00'],
  ['10:00', '12:40', '15:20', '18:00', '20:40'],
  ['09:15', '11:50', '14:25', '17:10', '19:55', '22:25'],
  ['10:20', '13:05', '15:50', '18:35', '21:20'],
]

const makeTheaterShowtimes = (theaterIndex) => {
  const start = theaterIndex % showing.length
  const pool = [...showing.slice(start), ...showing.slice(0, start)]
  return pool.slice(0, 9).map((m, i) => ({
    title: m.title,
    format: `${i % 4 === 0 ? 'IMAX 2D' : i % 5 === 0 ? '4DX 2D' : '2D'} · ${m.origin === 'intl' ? (i % 3 === 0 ? 'Lồng tiếng Việt' : 'Phụ đề Việt') : 'Tiếng Việt'}`,
    times: baseTimes[(i + theaterIndex) % baseTimes.length].slice(0, i % 3 === 0 ? 5 : 4),
  }))
}

const showtimes = Object.fromEntries(theaters.map((theater, index) => [theater.id, makeTheaterShowtimes(index)]))

const datePlans = [
  ['28/09', 'Thứ Hai · 28/09'],
  ['29/09', 'Thứ Ba · 29/09'],
  ['30/09', 'Thứ Tư · 30/09'],
  ['01/10', 'Thứ Năm · 01/10'],
]

const upcomingShowtimes = Object.fromEntries(datePlans.map(([key, label], dayIndex) => [key, {
  label,
  theaters: Object.fromEntries(theaters.map((theater, theaterIndex) => {
    const rows = makeTheaterShowtimes(theaterIndex + dayIndex).slice(dayIndex % 2, 7 + (dayIndex % 2))
    return [theater.id, rows]
  })),
}]))

// Thông tin phim bên dưới được đối chiếu từ nguồn công khai. Lịch chiếu/rạp trong prototype vẫn là dữ liệu mô phỏng theo phạm vi SRS.
const movieDetails = {
  'Trại Buôn Người': { synopsis: 'Ny tìm cách xâm nhập đường dây buôn người ở khu vực biên giới để cứu em gái. Bị cuốn vào hệ thống giam giữ và lừa đảo, cô cùng những nạn nhân khác phải tìm cách sống sót và thoát ra.', director: 'Toni Dương Bảo Anh', cast: 'Steven Nguyễn, Quách Ngọc Ngoan, Huỳnh Minh Kiên, Tùng Mint', producer: 'Đang cập nhật', country: 'Việt Nam', language: 'Tiếng Việt', formats: '2D', release: '25/09/2026', duration: '135 phút', classification: 'T18', genreFull: 'Hành động · Tâm lý', highlight: 'Phim Việt khai thác đề tài buôn người xuyên biên giới và hành trình giải cứu.', sourceName: 'Galaxy Cinema', sourceUrl: 'https://www.galaxycine.vn/phim/trai-buon-nguoi/' },
  'Út Lan 2': { synopsis: 'Từ lúc một con rắn hai đầu xuất hiện, ngôi làng ven sông liên tiếp xảy ra những cái chết bí ẩn. Khi những bí mật bị lãng quên dần trồi lên mặt nước, người dân nhận ra có những lời nguyền chưa bao giờ thực sự biến mất.', director: 'Trần Trọng Dần', cast: 'Phương Nam, Kiều Oanh, NSƯT Kim Phương, Tạ Lâm, Ngọc Phước', producer: 'Apia Pictures', country: 'Việt Nam', language: 'Tiếng Việt', formats: '2D', release: '25/09/2026', duration: '107 phút', classification: 'T18', genreFull: 'Kinh dị', highlight: 'Tác phẩm tiếp tục khai thác chất liệu kinh dị dân gian Nam Bộ, truyền thuyết Hà Bá và nỗi sợ vùng sông nước.', sourceName: 'Galaxy Cinema', sourceUrl: 'https://www.galaxycine.vn/phim/ut-lan-2/' },
  'Lên Hương': { synopsis: 'Một bà chủ trại hòm và một chàng trai trẻ bị cuốn vào một giao kèo, từ đó những món nợ, áp lực gia đình và các bí mật trong quá khứ dần được hé lộ.', director: 'Khương Ngọc · Tấn Hoàng Thông', cast: 'Hồng Đào, Võ Tấn Phát, NSƯT Tuyết Thu, NSND Hồng Vân, Hạ Anh, Quốc Khánh', producer: 'Mockingbird Pictures', country: 'Việt Nam', language: 'Tiếng Việt', formats: '2D', release: '18/09/2026', duration: '121 phút', classification: 'T16', genreFull: 'Tâm lý · Gia đình', highlight: 'Phim gia đình Việt có Hồng Đào và Võ Tấn Phát, do Khương Ngọc và Tấn Hoàng Thông đạo diễn.', sourceName: 'Galaxy Cinema', sourceUrl: 'https://www.galaxycine.vn/phim/len-huong/' },
  'Bóng Ma Nhà Hát': { synopsis: 'Tuấn, một chuyên viên bất động sản đầy tham vọng, được giao nhiệm vụ vực dậy một nhà hát cũ. Tại đây, anh phát hiện nơi này bị ám bởi Nhã, một nữ diễn viên chết oan chưa thể siêu thoát.', director: 'Lê Công Sơn', cast: 'Trâm Anh, Quỳnh Lý, Phương Lan, Hứa Minh Đạt, Lâm Vĩ Dạ', producer: 'Đang cập nhật', country: 'Việt Nam', language: 'Tiếng Việt', formats: '2D', release: '18/09/2026', duration: '97 phút', classification: 'T16', genreFull: 'Hài · Kinh dị', highlight: 'Câu chuyện pha trộn hài và kinh dị trong bối cảnh một nhà hát cũ.', sourceName: 'Galaxy Cinema', sourceUrl: 'https://www.galaxycine.vn/phim/bong-ma-nha-hat/' },
  'Mãi Nợ Một Lời Tạm Biệt': { synopsis: 'Daniel trở về tìm lại những mảnh ký ức tuổi thơ, người bà và những điều chưa kịp nói. Hành trình đưa anh đối diện với gia đình, mất mát và quá khứ bị bỏ lại.', director: 'J. Robert Schulz', cast: 'Kiều Chinh, Daniel K. Winn, Nguyễn Vũ Uy Nhân, Samuel An, Lan Thy', producer: 'WS Productions · Skyline', country: 'Việt Nam · Mỹ', language: 'Tiếng Việt · Tiếng Anh', formats: '2D', release: '11/09/2026', duration: '120 phút', classification: 'K', genreFull: 'Tâm lý · Gia đình', highlight: 'Tác phẩm khai thác ký ức, gia đình và một lời tạm biệt còn dang dở.', sourceName: 'Galaxy Cinema', sourceUrl: 'https://www.galaxycine.vn/phim/mai-no-mot-loi-tam-biet/' },
  'Colony': { synopsis: 'Một ổ dịch bí ẩn bùng phát trong tòa nhà chọc trời giữa Seoul và toàn bộ người bên trong bị phong tỏa. Khi những người nhiễm bệnh biến đổi thành các kẻ săn mồi phối hợp, Kwon Se-jeong và nhóm sống sót chạy lên mái nhà để tìm cơ hội được giải cứu.', director: 'Yeon Sang-ho', cast: 'Gianna Jun, Koo Kyo-hwan, Ji Chang-wook, Shin Hyun-been, Kim Shin-rok, Go Soo', producer: 'WOWPOINT · Smilegate', country: 'Hàn Quốc', language: 'Tiếng Hàn', formats: '2D', release: '21/05/2026', duration: '122 phút', classification: 'Đang cập nhật', genreFull: 'Giật gân · Hành động', highlight: 'Phim mới của đạo diễn Yeon Sang-ho, lấy bối cảnh sinh tồn trong một tòa nhà bị phong tỏa.', sourceName: 'Korean Film Council (KOFIC)', sourceUrl: 'https://www.koreanfilm.or.kr/eng/news/newfilm.jsp?blbdComCd=601011&mode=VIEW&seq=701' },
  'The Odyssey': { synopsis: 'Christopher Nolan đưa thiên sử thi nền tảng của Homer lên màn ảnh trong một tác phẩm hành động thần thoại được quay bằng công nghệ phim IMAX.', director: 'Christopher Nolan', cast: 'Matt Damon, Tom Holland, Anne Hathaway, Robert Pattinson, Lupita Nyong’o, Zendaya, Charlize Theron', producer: 'Emma Thomas · Christopher Nolan / Syncopy', country: 'Mỹ', language: 'Tiếng Anh', formats: 'IMAX · 2D', release: '17/07/2026', duration: '172 phút', classification: 'R (Mỹ)', genreFull: 'Sử thi · Hành động thần thoại', highlight: 'Universal giới thiệu đây là một “mythic action epic” được quay trên nhiều địa điểm bằng công nghệ IMAX film mới.', sourceName: 'Universal Pictures', sourceUrl: 'https://universalpictures.ca/movie/the-odyssey/' },
  'Quỷ Dữ Từ Luyện Ngục': { synopsis: 'Kingkaew lấy cảm hứng từ một vụ án năm 1978 tại Thái Lan. Sau khi một người phụ nữ bị kết án và xử tử, hàng loạt hiện tượng kinh hoàng xảy ra, kéo những người liên quan trở lại với sự thật phía sau vụ án.', director: 'Ekkachai Srivichai', cast: 'Sai Charoenpura, Saiparn Apinya, Gun Napat Injaieua', producer: 'Đang cập nhật', country: 'Thái Lan', language: 'Tiếng Thái · Phụ đề Việt', formats: '2D', release: '10/04/2026', duration: '101 phút', classification: 'T18', genreFull: 'Kinh dị · Giật gân', highlight: 'Phim kinh dị Thái Lan lấy cảm hứng từ một vụ án có thật và câu chuyện oan hồn Kingkaew.', sourceName: 'CGV Việt Nam', sourceUrl: 'https://www.cgv.vn/default/kingkaew.html' },
  'Án Mạng Karaoke': { synopsis: 'Một người hàng xóm mê hát karaoke bất ngờ bị sát hại trong một homestay biệt lập trên núi. Khi mọi người đều có động cơ và hung thủ vẫn ẩn mình, Tâm cùng những người còn lại phải lần theo lời khai và các bí mật để tìm sự thật.', director: 'Hoàng Lê', cast: 'Đoàn Thiên Ân, Đại Nghĩa, Vân Dung', producer: 'Đang cập nhật', country: 'Việt Nam', language: 'Tiếng Việt', formats: '2D', release: '02/10/2026', duration: '96 phút', classification: 'T16', genreFull: 'Hài · Bí ẩn · Giật gân', highlight: 'Phim trinh thám pha hài với bối cảnh khép kín và một vụ án xảy ra giữa chuyến đi trên núi.', sourceName: 'Galaxy Cinema', sourceUrl: 'https://www.galaxycine.vn/phim/an-mang-karaoke/' },
  'Mẹ Mìn': { synopsis: 'Thông tin nội dung chi tiết của phim chưa được nhà phát hành công bố đầy đủ. Website chỉ hiển thị những dữ liệu đã được công bố chính thức về dự án và dàn diễn viên.', director: 'Jack Carry On', cast: 'Minh Hằng, Rima Thanh Vy, Khương Lê, Nhật Kim Anh, Phát La, Huỳnh Nhựt', producer: 'V Studios', country: 'Việt Nam', language: 'Tiếng Việt', formats: '2D', release: '23/10/2026', duration: 'Đang cập nhật', classification: 'Đang cập nhật', genreFull: 'Đang cập nhật', highlight: 'V Studios công bố phim khởi chiếu ngày 23/10/2026 và dàn diễn viên gồm Minh Hằng, Rima Thanh Vy, Khương Lê, Nhật Kim Anh, Phát La, Huỳnh Nhựt.', sourceName: 'Thế Giới Văn Hóa', sourceUrl: 'https://thegioivanhoa.info/dien-anh/dien-anh-viet-nam' },
}

const getMovieDetail = (movie) => movieDetails[movie.title] || {
  synopsis: movie.short || 'Thông tin nội dung đang được cập nhật.',
  director: movie.director || 'Đang cập nhật', cast: 'Đang cập nhật', producer: 'Đang cập nhật', country: movie.country || 'Đang cập nhật', language: movie.origin === 'intl' ? 'Tiếng Anh · Phụ đề Việt' : 'Tiếng Việt', formats: '2D', release: movie.date || 'Đang cập nhật', duration: movie.meta || 'Đang cập nhật', classification: movie.genre || 'Đang cập nhật', genreFull: movie.meta || 'Đang cập nhật', highlight: 'Thông tin đang được cập nhật.', sourceName: 'Dữ liệu quản lý phim', sourceUrl: '/admin.html',
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
    ${m.image ? `<img class="poster-img" src="${m.image}" alt="Poster ${m.title}" loading="lazy" onerror="this.onerror=null;this.src='${m.fallback || ''}'" />` : ''}
    <div class="poster-shade"></div>
    <div class="poster-glow"></div>
    ${m.image ? '' : `<span class="poster-letter">${m.title.charAt(0)}</span>`}
    <span class="genre">${m.genre}</span>
    ${m.badge ? `<span class="trend-badge">${m.badge}</span>` : ''}
    ${m.date ? `<span class="date">${m.date}</span>` : (m.year ? `<span class="date">${m.year}</span>` : '')}
    ${opts.player ? '<span class="poster-play">' + icons.play + '</span>' : ''}
  </div>
`

const movieCard = (m, opts = {}) => `
  <article class="movie-card" data-title="${m.title}" data-origin="${m.origin}" data-meta="${(m.meta || '').toLowerCase()}">
    ${poster(m, opts)}
    ${m.rate ? `<div class="card-rate"><span>${icons.star}</span>${m.rate}</div>` : ''}
    <div class="card-body">
      <div class="movie-origin-row"><span>${m.country || 'Đang cập nhật'}</span><span>${m.origin === 'intl' ? 'QUỐC TẾ' : 'PHIM VIỆT'}</span></div>
      <h3>${m.title}</h3>
      <p>${m.meta}</p>
      ${m.short ? `<p class="card-desc">${m.short}</p>` : ''}
      <div class="card-actions">
        <button type="button" class="btn-details" data-detail="${m.title}">${icons.info}<span>CHI TIẾT</span></button>
        ${opts.detailOnly ? '' : (opts.btn ? `<button type="button" class="btn-ticket" data-buy="${m.title}">${icons.ticket}<span>MUA VÉ</span></button>` : `<button type="button" class="btn-ticket ghost" data-notify="${m.title}">ĐẶT VÉ TRƯỚC</button>`)}
      </div>
    </div>
  </article>
`

const renderShowtimes = (id) => {
  const rows = showtimes[id] || []
  if (!rows.length) return '<p class="empty-showtimes">Rạp này chưa có lịch chiếu.</p>'
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

const theaterOptions = (region = 'all') => {
  const rows = region === 'all' ? theaters : theaters.filter((t) => t.region === region)
  return rows.map((t) => `<option value="${t.id}">${t.name} · ${t.city}</option>`).join('')
}

const totalTodayShows = Object.values(showtimes).reduce((sum, rows) => sum + rows.reduce((n, row) => n + row.times.length, 0), 0)

document.querySelector('#app').innerHTML = `
<header class="header">
  <div class="container header-inner">
    <button type="button" class="burger" id="burger" aria-label="Mở menu">${icons.menu}</button>
    <a href="#" class="logo">CGV<span>Cinemas</span></a>
    <nav class="nav" id="nav">
      <a href="#showing">PHIM</a>
      <a href="#showtimes">LỊCH CHIẾU</a>
      <a href="#coming">SẮP CHIẾU</a>
      <a href="#promo">KHUYẾN MÃI</a>
      <a href="#news">TIN TỨC</a>
      <a href="#member">THÀNH VIÊN</a>
    </nav>
    <div class="header-actions">
      <button type="button" class="icon-btn" id="searchOpen" aria-label="Tìm kiếm">${icons.search}</button>
      <button type="button" class="login-btn ticket-history-btn" id="myTicketsOpen">${icons.ticket}<span>VÉ CỦA TÔI</span></button>
      <a class="login-btn" href="/admin.html">${icons.dashboard}<span>QUẢN LÝ PHIM</span></a>
      <button type="button" class="login-btn" id="adminLoginOpen">${icons.user}<span>ADMIN</span></button>
    </div>
  </div>
</header>

<section class="hero hero-2026 hero-catalog">
  <div class="hero-bg hero-bg-catalog"><div class="hero-mesh"></div><div class="hero-grain"></div></div>
  <div class="container hero-catalog-inner">
    <div class="hero-copy hero-copy-catalog">
      <div class="hero-kicker-row">
        <span class="hero-badge">CGV · PHIM NỔI BẬT 2026</span>
        <span class="hero-live-dot" id="catalogSync"><i></i> ĐANG ĐỒNG BỘ PHIM</span>
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
          <img src="${m.image}" alt="Poster ${m.title}" onerror="this.onerror=null;this.src='${m.fallback || ''}'" />
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
    <div class="tab-sub" id="upcomingSub">${upcomingShowtimes['28/09'].label} · ${theaters[0].name} · ${theaters[0].addr}</div>
    <div class="showtimes" id="upcomingBox">${renderUpcomingShowtimes('28/09', theaters[0].id)}</div>
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
    <a href="#" class="btn btn-primary">ĐĂNG KÝ NGAY</a>
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

<div class="modal" id="adminLoginModal" hidden>
  <div class="modal-backdrop" data-admin-close></div>
  <div class="modal-box admin-login-box">
    <button type="button" class="modal-close" data-admin-close aria-label="Đóng">${icons.close}</button>
    <div class="admin-login-head">
      <span class="admin-login-icon">${icons.lock}</span>
      <div><span class="admin-kicker">KHU VỰC QUẢN TRỊ</span><h3>Đăng nhập Admin</h3></div>
    </div>
    <form class="admin-login-form" id="adminLoginForm">
      <label>Tài khoản<input id="adminUsername" type="text" autocomplete="username" placeholder="Nhập tài khoản" required /></label>
      <label>Mật khẩu<input id="adminPassword" type="password" autocomplete="current-password" placeholder="Nhập mật khẩu" required /></label>
      <p class="admin-error" id="adminLoginError" aria-live="polite"></p>
      <button type="submit" class="btn btn-primary admin-submit">${icons.lock}<span>ĐĂNG NHẬP</span></button>
      <p class="admin-demo-note">Tài khoản quản trị dành cho bản demo nội bộ.</p>
    </form>
  </div>
</div>

<div class="modal admin-panel-modal" id="adminPanel" hidden>
  <div class="modal-backdrop" data-admin-panel-close></div>
  <div class="admin-panel-box">
    <div class="admin-panel-top">
      <div class="admin-panel-brand">${icons.dashboard}<div><span>CINEMA DEMO</span><strong>Admin Dashboard</strong></div></div>
      <div class="admin-panel-actions"><span class="admin-welcome">Xin chào, <strong>cgvteam</strong></span><button type="button" class="btn btn-ghost btn-sm" id="adminLogout">${icons.logout}<span>ĐĂNG XUẤT</span></button><button type="button" class="icon-btn admin-panel-close" data-admin-panel-close aria-label="Đóng">${icons.close}</button></div>
    </div>
    <div class="admin-dashboard">
      <div class="admin-stats admin-stats-6">
        <div class="admin-stat"><span>Phim đang chiếu</span><strong>${showing.length}</strong><small>${showing.filter((m) => m.origin === 'vn').length} Việt · ${showing.filter((m) => m.origin === 'intl').length} quốc tế</small></div>
        <div class="admin-stat"><span>Thư viện phim</span><strong>${allMovies.length}</strong><small>Đầy đủ poster & chi tiết</small></div>
        <div class="admin-stat"><span>Rạp chiếu</span><strong>${theaters.length}</strong><small>3 khu vực toàn quốc</small></div>
        <div class="admin-stat"><span>Phòng chiếu</span><strong>${theaters.reduce((n, t) => n + t.screens, 0)}</strong><small>Tổng toàn hệ thống</small></div>
        <div class="admin-stat"><span>Suất hôm nay</span><strong>${totalTodayShows}</strong><small>Lịch demo đã tạo</small></div>
        <div class="admin-stat"><span>Ngày có lịch</span><strong>${Object.keys(upcomingShowtimes).length}</strong><small>28/09 – 01/10</small></div>
      </div>

      <div class="admin-region-summary">
        ${Object.entries(regionLabels).map(([key, label]) => {
          const regionTheaters = theaters.filter((t) => t.region === key)
          const regionShows = regionTheaters.reduce((sum, t) => sum + (showtimes[t.id] || []).reduce((n, row) => n + row.times.length, 0), 0)
          return `<div class="admin-region-card"><span>${label}</span><strong>${regionTheaters.length} rạp</strong><small>${regionTheaters.reduce((n, t) => n + t.screens, 0)} phòng · ${regionShows} suất/ngày</small></div>`
        }).join('')}
      </div>

      <div class="admin-grid admin-grid-wide">
        <section class="admin-card admin-card-span-2">
          <div class="admin-card-head"><h4>Quản lý phim đang chiếu</h4><span>${showing.length} phim</span></div>
          <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Poster</th><th>Phim</th><th>Xuất xứ</th><th>Phân loại</th><th>Điểm</th><th>Rạp áp dụng</th><th>Trạng thái</th></tr></thead><tbody>${showing.map((m) => {
            const cinemaCount = theaters.filter((t) => (showtimes[t.id] || []).some((row) => row.title === m.title)).length
            return `<tr><td><img class="admin-poster-thumb" src="${m.image}" alt="${m.title}" onerror="this.onerror=null;this.src='${m.fallback || ''}'" /></td><td><strong>${m.title}</strong><small>${m.meta}</small></td><td>${m.country}</td><td><span class="admin-badge">${m.genre}</span></td><td>${m.rate ? `${m.rate}/10` : `—`}</td><td>${cinemaCount}/${theaters.length}</td><td><span class="status-dot online"></span>Đang chiếu</td></tr>`
          }).join('')}</tbody></table></div>
        </section>

        <section class="admin-card admin-card-span-2">
          <div class="admin-card-head"><h4>Quản lý hệ thống rạp</h4><span>${theaters.length} địa điểm</span></div>
          <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Rạp</th><th>Khu vực</th><th>Thành phố</th><th>Phòng</th><th>Phim hôm nay</th><th>Suất chiếu</th><th>Trạng thái</th></tr></thead><tbody>${theaters.map((t) => {
            const rows = showtimes[t.id] || []
            const showCount = rows.reduce((n, row) => n + row.times.length, 0)
            return `<tr><td><strong>${t.name}</strong><small>${t.addr}</small></td><td>${regionLabels[t.region]}</td><td>${t.city}</td><td>${t.screens}</td><td>${rows.length}</td><td>${showCount}</td><td><span class="status-dot online"></span>${t.status}</td></tr>`
          }).join('')}</tbody></table></div>
        </section>

        <section class="admin-card admin-quick">
          <div class="admin-card-head"><h4>Vận hành nhanh</h4><span>Demo Admin</span></div>
          <div class="admin-action-grid">
            <button type="button" class="admin-action-btn" data-admin-demo-action="Thêm phim">+ Thêm phim</button>
            <button type="button" class="admin-action-btn" data-admin-demo-action="Thêm rạp">+ Thêm rạp</button>
            <button type="button" class="admin-action-btn" data-admin-demo-action="Tạo lịch chiếu">+ Tạo lịch chiếu</button>
            <button type="button" class="admin-action-btn" data-admin-demo-action="Xuất báo cáo">Xuất báo cáo</button>
          </div>
          <div class="admin-health"><span><i class="status-dot online"></i> Website</span><strong>Online</strong></div>
          <div class="admin-health"><span><i class="status-dot online"></i> Lịch chiếu</span><strong>Đồng bộ</strong></div>
          <div class="admin-health"><span><i class="status-dot online"></i> Poster</span><strong>${allMovies.length}/${allMovies.length}</strong></div>
        </section>

        <section class="admin-card admin-card-span-2">
          <div class="admin-card-head"><h4>Quản lý vé đã đặt</h4><span>LocalStorage</span></div>
          <div id="adminTicketList" class="admin-ticket-list"><p class="empty-showtimes">Chưa có vé được đặt.</p></div>
        </section>

        <section class="admin-card admin-quick">
          <div class="admin-card-head"><h4>Thông tin dữ liệu</h4><span>Prototype</span></div>
          <ul>
            <li><strong>${vnMovieCount}</strong> phim Việt trong thư viện.</li>
            <li><strong>${intlMovieCount}</strong> phim quốc tế trong thư viện.</li>
            <li>Lịch chiếu được tạo riêng theo từng rạp và từng ngày.</li>
            <li>Poster phim lấy từ nguồn công khai; có ảnh dự phòng khi nguồn ngoài không tải được.</li>
          </ul>
          <p class="admin-security-note"><strong>Lưu ý:</strong> tài khoản admin và dữ liệu hiện chạy phía trình duyệt, phù hợp cho prototype. Bản triển khai thật cần backend, phân quyền và lưu mật khẩu an toàn.</p>
        </section>
      </div>
    </div>
    </div>
  </div>
</div>

<button type="button" class="to-top" id="toTop" aria-label="Lên đầu trang"></button>
`

const state = { modalMode: 'buy' }
const ADMIN_CREDENTIALS = { username: 'cgvteam', password: '66668888' }

const storageGet = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback }
}
const storageSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
const bookingKey = (movie, theaterId, date, time) => `${movie}__${theaterId}__${date}__${time}`
const ticketPrice = 85000

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
        <div><span>Tạm tính</span><strong>${(booking.seats.length * ticketPrice).toLocaleString('vi-VN')}đ</strong></div>
      </div>
      <p class="detail-demo-note">Vé được lưu để minh họa trải nghiệm đặt chỗ trên website; chưa phát sinh giao dịch thanh toán thực tế.</p>
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
    const bookings = storageGet('cgv_bookings_v1', [])
    const booking = { code: `CGV${Date.now().toString().slice(-8)}`, movie: m.title, theaterId, date, time, seats, createdAt: new Date().toISOString() }
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
    <div class="ticket-list-head"><span class="detail-kicker">THÔNG TIN VÉ</span><h3>Vé đã đặt</h3><p>Dữ liệu được lưu bằng LocalStorage trên trình duyệt này.</p></div>
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
  const times = m.times || []
  document.querySelector('#modalContent').innerHTML = `
    <div class="mm-head" style="background:${m.color}">
      <span class="mm-letter">${m.image ? `<img class="mm-poster-img" src="${m.image}" alt="Poster ${m.title}" onerror="this.onerror=null;this.src='${m.fallback || ''}'" />` : m.title.charAt(0)}</span>
      <div><span class="genre">${m.genre}</span><h3>${m.title}</h3><p>${m.meta}</p></div>
    </div>
    <div class="mm-body">
      <h4>${mode === 'buy' ? 'BƯỚC 1 / 3 · CHỌN RẠP, NGÀY VÀ SUẤT CHIẾU' : 'ĐẶT LỊCH NHẮC'}</h4>
      ${mode === 'buy' ? `<div class="booking-selects"><label>Rạp<select id="bookingTheater">${theaterOptions('all')}</select></label><label>Ngày<select id="bookingDate">${datePlans.map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label></div>` : ''}
      <div class="st-times">${times.length ? times.map((t) => `<button type="button" class="time-chip" data-time="${t}">${t}</button>`).join('') : '<span class="mm-date">Khởi chiếu ' + m.date + '</span>'}</div>
      <p class="mm-note" id="mmNote">${times.length ? `Vui lòng chọn một suất chiếu ${mode === 'buy' ? 'để tiếp tục chọn ghế' : 'để nhận thông báo'}.` : 'Phim hiện chưa có suất chiếu.'}</p>
      ${mode === 'buy' && times.length ? '<button type="button" class="btn btn-primary" id="continueBooking" disabled>TIẾP TỤC CHỌN GHẾ</button>' : ''}
    </div>`
  document.querySelector('#movieModal').hidden = false
  document.body.style.overflow = 'hidden'
  let selectedTime = ''
  document.querySelectorAll('#modalContent .time-chip').forEach((chip) => chip.addEventListener('click', () => {
    document.querySelectorAll('#modalContent .time-chip').forEach((c) => c.classList.remove('active'))
    chip.classList.add('active'); selectedTime = chip.dataset.time
    const note = document.querySelector('#mmNote')
    note.innerHTML = mode === 'buy' ? `Đã chọn suất <strong>${selectedTime}</strong>. Tiếp tục để chọn ghế.` : `Đã chọn nhắc lịch cho <strong>${m.title}</strong>.`
    note.classList.add('ok')
    if (mode === 'buy') document.querySelector('#continueBooking').disabled = false
  }))
  if (mode === 'buy' && times.length) document.querySelector('#continueBooking').addEventListener('click', () => {
    if (!selectedTime) return
    openSeatSelection(m, document.querySelector('#bookingTheater').value, document.querySelector('#bookingDate').value, selectedTime)
  })
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
      <div class="movie-detail-poster">${m.image ? `<img src="${m.image}" alt="Poster ${m.title}" onerror="this.onerror=null;this.src='${m.fallback || ''}'" />` : `<span>${m.title.charAt(0)}</span>`}</div>
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
      <p class="detail-demo-note">* Thông tin phim được tổng hợp từ nguồn công khai. Lịch chiếu và tình trạng ghế trên website dùng để minh họa trải nghiệm chọn suất và đặt chỗ.</p>
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


// ---------- Admin demo login ----------
const myTicketsOpen = document.querySelector('#myTicketsOpen')
myTicketsOpen?.addEventListener('click', openMyTickets)

const adminLoginOpen = document.querySelector('#adminLoginOpen')
const adminLoginModal = document.querySelector('#adminLoginModal')
const adminPanel = document.querySelector('#adminPanel')
const adminLoginForm = document.querySelector('#adminLoginForm')
const adminUsername = document.querySelector('#adminUsername')
const adminPassword = document.querySelector('#adminPassword')
const adminLoginError = document.querySelector('#adminLoginError')
const adminLogout = document.querySelector('#adminLogout')
let adminLoggedIn = false

const openAdminLogin = () => {
  adminLoginError.textContent = ''
  adminLoginModal.hidden = false
  document.body.style.overflow = 'hidden'
  setTimeout(() => adminUsername.focus(), 50)
}
const closeAdminLogin = () => {
  adminLoginModal.hidden = true
  document.body.style.overflow = ''
}
const openAdminPanel = () => {
  const adminTicketList = document.querySelector('#adminTicketList')
  const bookings = storageGet('cgv_bookings_v1', [])
  if (adminTicketList) adminTicketList.innerHTML = bookings.length ? `
    <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Mã vé</th><th>Phim</th><th>Ngày/giờ</th><th>Ghế</th><th>Thao tác</th></tr></thead><tbody>
      ${bookings.map((b) => `<tr><td><strong>${b.code}</strong></td><td>${b.movie}</td><td>${b.date} · ${b.time}</td><td>${b.seats.join(', ')}</td><td><button type="button" class="btn-details" data-admin-delete-ticket="${b.code}">Xóa</button></td></tr>`).join('')}
    </tbody></table></div>` : '<p class="empty-showtimes">Chưa có vé được đặt.</p>'
  adminPanel.hidden = false
  document.body.style.overflow = 'hidden'
}
const closeAdminPanel = () => {
  adminPanel.hidden = true
  document.body.style.overflow = ''
}

adminLoginOpen.addEventListener('click', () => {
  if (adminLoggedIn) openAdminPanel()
  else openAdminLogin()
})

document.querySelectorAll('[data-admin-close]').forEach((el) => el.addEventListener('click', closeAdminLogin))
document.querySelectorAll('[data-admin-panel-close]').forEach((el) => el.addEventListener('click', closeAdminPanel))

adminLoginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const user = adminUsername.value.trim()
  const pass = adminPassword.value
  if (user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
    adminLoggedIn = true
    adminLoginForm.reset()
    adminLoginError.textContent = ''
    adminLoginModal.hidden = true
    openAdminPanel()
    adminLoginOpen.classList.add('logged-in')
    adminLoginOpen.innerHTML = `${icons.dashboard}<span>QUẢN TRỊ</span>`
  } else {
    adminLoginError.textContent = 'Tài khoản hoặc mật khẩu chưa đúng.'
    adminPassword.select()
  }
})

adminLogout.addEventListener('click', () => {
  adminLoggedIn = false
  closeAdminPanel()
  adminLoginOpen.classList.remove('logged-in')
  adminLoginOpen.innerHTML = `${icons.user}<span>ADMIN</span>`
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

let upcomingDate = '28/09'
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
  const deleteTicket = e.target.closest('[data-admin-delete-ticket]')
  if (deleteTicket) {
    const bookings = storageGet('cgv_bookings_v1', []).filter((b) => b.code !== deleteTicket.dataset.adminDeleteTicket)
    storageSet('cgv_bookings_v1', bookings)
    openAdminPanel()
    return
  }
  const adminAction = e.target.closest('[data-admin-demo-action]')
  if (adminAction) window.alert(`${adminAction.dataset.adminDemoAction}: chức năng minh họa trong prototype.`)
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
      <img src="${movie.image || movie.fallback}" alt="Poster ${movie.title}" onerror="this.onerror=null;this.src='${movie.fallback || ''}'" />
      <div class="hero-mini-shade"></div>
      <div class="hero-mini-copy"><span>${movie.origin === 'vn' ? 'PHIM VIỆT' : movie.country}</span><strong>${movie.title}</strong></div>
    </article>`).join('')

  document.querySelector('#homeMovieCount').textContent = synced.length
  document.querySelector('#homeVnCount').textContent = syncedVietnamese.length
  document.querySelector('#homeVnLabel').textContent = `${syncedVietnamese.length} phim Việt nổi bật`
}

let catalogSnapshot = ''
const syncHomepageCatalog = async () => {
  const syncLabel = document.querySelector('#catalogSync')
  try {
    const response = await fetch('/api/movies')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const managedMovies = await response.json()
    const nextSnapshot = JSON.stringify(managedMovies)
    if (nextSnapshot !== catalogSnapshot) {
      renderSyncedCatalog(managedMovies)
      catalogSnapshot = nextSnapshot
    }
    syncLabel.innerHTML = '<i></i> ĐÃ ĐỒNG BỘ VỚI QUẢN LÝ PHIM'
  } catch {
    syncLabel.innerHTML = '<i></i> ĐANG DÙNG DỮ LIỆU DỰ PHÒNG'
    syncLabel.title = 'Không kết nối được json-server. Chạy npm run dev để đồng bộ dữ liệu.'
  }
}

syncHomepageCatalog()
window.addEventListener('focus', syncHomepageCatalog)
