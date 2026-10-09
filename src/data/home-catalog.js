const now = new Date()

export const fallbackPoster = (slug) => `./posters/2026-${slug}.svg`

export const officialPosterFallback = './posters/poster-unavailable.svg'

export const showing = [
  {
    title: 'Trại Buôn Người',
    meta: 'Hành động · Tâm lý · 135 phút',
    genre: 'T18',
    country: 'Việt Nam',
    origin: 'vn',
    badge: 'PHIM VIỆT 2026',
    year: '2026',
    short:
      'Ny tìm cách xâm nhập đường dây buôn người ở khu vực biên giới để cứu em gái và những nạn nhân đang bị giam giữ.',
    color: 'linear-gradient(165deg,#8f321f 0%,#2b1717 50%,#09090b 100%)',
    image: '/posters/official/trai-buon-nguoi.png',
    fallback: officialPosterFallback,
    times: ['09:15', '11:50', '14:30', '17:10', '19:50', '22:30'],
  },
  {
    title: 'Út Lan 2',
    meta: 'Kinh dị · 107 phút',
    genre: 'T18',
    country: 'Việt Nam',
    origin: 'vn',
    badge: 'KINH DỊ VIỆT',
    year: '2026',
    short:
      'Một con rắn hai đầu xuất hiện, kéo theo những cái chết bí ẩn tại ngôi làng ven sông và những lời nguyền tưởng đã bị lãng quên.',
    color: 'linear-gradient(165deg,#355d54 0%,#132b28 48%,#070a0b 100%)',
    image: 'https://phongveviet.com/m/db508a60a42d.jpg',
    fallback: officialPosterFallback,
    times: ['09:20', '11:30', '13:45', '16:00', '18:20', '20:30', '22:40'],
  },
  {
    title: 'Lên Hương',
    meta: 'Tâm lý · Gia đình · 121 phút',
    genre: 'T16',
    country: 'Việt Nam',
    origin: 'vn',
    badge: 'PHIM VIỆT 2026',
    year: '2026',
    short:
      'Một bà chủ trại hòm và một chàng trai trẻ bị cuốn vào một giao kèo, từ đó những món nợ và bí mật gia đình dần lộ ra.',
    color: 'linear-gradient(165deg,#a66a42 0%,#4a2c24 48%,#130d0c 100%)',
    image: 'https://phongveviet.com/m/c22fbc3bbbee.jpg',
    fallback: officialPosterFallback,
    times: ['09:35', '12:00', '14:30', '17:00', '19:30', '22:00'],
  },
  {
    title: 'Bóng Ma Nhà Hát',
    meta: 'Hài · Kinh dị · 97 phút',
    genre: 'T16',
    country: 'Việt Nam',
    origin: 'vn',
    badge: 'HORROR COMEDY',
    year: '2026',
    short:
      'Tuấn phải vực dậy một nhà hát cũ và phát hiện nơi đây bị ám bởi Nhã, một nữ diễn viên chết oan chưa thể siêu thoát.',
    color: 'linear-gradient(165deg,#553672 0%,#211728 48%,#09080c 100%)',
    image: 'https://bazaarvietnam.vn/wp-content/uploads/2026/09/BZVN-bong-ma-nha-hat-12.jpg',
    fallback: officialPosterFallback,
    times: ['10:10', '12:10', '14:20', '16:30', '18:40', '20:50'],
  },
  {
    title: 'Mãi Nợ Một Lời Tạm Biệt',
    meta: 'Tâm lý · Gia đình · 120 phút',
    genre: 'K',
    country: 'Việt Nam',
    origin: 'vn',
    badge: 'PHIM VIỆT 2026',
    year: '2026',
    short:
      'Daniel trở về với những ký ức tuổi thơ, người bà và lời tạm biệt chưa kịp nói, từ đó đối diện với gia đình và mất mát.',
    color: 'linear-gradient(165deg,#56738d 0%,#27384b 48%,#0a1018 100%)',
    image: 'https://phongveviet.com/m/897ee670a07e.jpg',
    fallback: officialPosterFallback,
    times: ['09:40', '12:10', '14:40', '17:10', '19:40'],
  },
  {
    title: 'Colony',
    meta: 'Giật gân · Hành động · 122 phút',
    genre: 'T16',
    country: 'Hàn Quốc',
    origin: 'intl',
    badge: 'K-MOVIE 2026',
    year: '2026',
    short:
      'Một ổ dịch bí ẩn bùng phát trong tòa nhà chọc trời ở Seoul, khiến những người bên trong bị phong tỏa và phải tìm đường sống sót.',
    color: 'linear-gradient(165deg,#0b392f 0%,#061f1c 48%,#030d0c 100%)',
    image: 'https://www.xinemas.com/data/images/movies/2026/colony-2026_500x740.webp',
    fallback: officialPosterFallback,
    times: ['09:20', '11:55', '14:30', '17:10', '19:45', '22:20'],
  },
  {
    title: 'The Odyssey',
    meta: 'Sử thi · Hành động · 172 phút',
    genre: 'T18',
    country: 'Mỹ',
    origin: 'intl',
    badge: 'IMAX 2026',
    year: '2026',
    short:
      'Christopher Nolan chuyển thể thiên sử thi Odyssey của Homer thành một hành trình thần thoại quy mô lớn trên màn ảnh IMAX.',
    color: 'linear-gradient(165deg,#29445d 0%,#11293a 48%,#070e16 100%)',
    image: 'https://image.tmdb.org/t/p/w500/x5JKwcrl7NzaSWfTFh6bIPCsqJd.jpg',
    fallback: officialPosterFallback,
    times: ['09:00', '12:20', '15:40', '19:00', '22:20'],
  },
  {
    title: 'Quỷ Dữ Từ Luyện Ngục',
    meta: 'Kinh dị · Giật gân · 101 phút',
    genre: 'T18',
    country: 'Thái Lan',
    origin: 'intl',
    badge: 'KINH DỊ 2026',
    year: '2026',
    short:
      'Lấy cảm hứng từ một vụ án năm 1978, bộ phim kể về oan hồn Kingkaew trở lại sau cái chết đầy uất hận.',
    color: 'linear-gradient(165deg,#5b1b18 0%,#211012 48%,#08080a 100%)',
    image: 'https://api-website.cinestar.com.vn/media/wysiwyg/Posters/04-2026/quy-du.jpg',
    fallback: officialPosterFallback,
    times: ['10:00', '12:10', '14:20', '16:30', '18:40', '20:50', '23:00'],
  },
]

export const comingSoon = [
  {
    title: 'Án Mạng Karaoke',
    meta: 'Hài · Bí ẩn · Giật gân · 96 phút',
    genre: 'T16',
    date: '30/10',
    year: '2026',
    country: 'Việt Nam',
    origin: 'vn',
    badge: 'SẮP CHIẾU',
    short:
      'Một người hàng xóm mê karaoke bị sát hại trong homestay biệt lập, khiến cả nhóm phải lần theo lời khai và những bí mật để tìm hung thủ.',
    color: 'linear-gradient(165deg,#9b2238,#2a1117 55%,#08080a)',
    image: 'https://phongveviet.com/m/3be78b2574bb.jpg',
    fallback: officialPosterFallback,
  },
  {
    title: 'Mẹ Mìn',
    meta: 'Điện ảnh Việt Nam',
    genre: 'T16',
    date: '23/10',
    year: '2026',
    country: 'Việt Nam',
    origin: 'vn',
    badge: 'SẮP CHIẾU',
    short:
      'Dự án điện ảnh của V Studios với dàn diễn viên Minh Hằng, Rima Thanh Vy, Khương Lê, Nhật Kim Anh, Phát La và Huỳnh Nhựt.',
    color: 'linear-gradient(165deg,#56314d,#23131f 55%,#08080a)',
    image:
      'https://static-cgv.vncdn.vn/media/catalog/product/cache/3/image/1800x/71252117777b696995f01934522c402d/m/_/m_m_n_-_poster_kthuoc_chu_n.jpg',
    fallback: officialPosterFallback,
  },
]

export const news = [
  {
    tag: 'PHIM VIỆT 2026',
    title: 'Nhiều phim Việt ra rạp trong tháng 9 và tháng 10',
    desc: 'Trại Buôn Người, Út Lan 2, Lên Hương, Bóng Ma Nhà Hát và Án Mạng Karaoke tạo nên lịch phim Việt đa dạng từ tâm lý đến kinh dị.',
    color: 'linear-gradient(135deg,#d93125,#4a1214)',
  },
  {
    tag: 'KINH DỊ 2026',
    title: 'Kinh dị Việt và châu Á có nhiều lựa chọn',
    desc: 'Út Lan 2, Bóng Ma Nhà Hát và Quỷ Dữ Từ Luyện Ngục là các phim 2026 có thông tin phát hành đã được đối chiếu từ nguồn rạp.',
    color: 'linear-gradient(135deg,#173d34,#090d0c)',
  },
  {
    tag: 'SẮP CHIẾU',
    title: 'Án Mạng Karaoke ra mắt 30/10/2026',
    desc: 'Phim của đạo diễn Hoàng Lê có Đoàn Thiên Ân, Đại Nghĩa và Vân Dung, thuộc nhóm phim Việt đáng chú ý ra rạp đầu tháng 10.',
    color: 'linear-gradient(135deg,#5d2e70,#1c1124)',
  },
]

export const theaters = [
  {
    id: 'aeon-long-bien',
    name: 'CGV AEON Long Biên',
    addr: 'AEON Mall Long Biên, Long Biên, Hà Nội',
    region: 'north',
    city: 'Hà Nội',
    screens: 10,
    status: 'Đang hoạt động',
  },
  {
    id: 'vincom-ba-trieu',
    name: 'CGV Vincom Bà Triệu',
    addr: 'Vincom Center Bà Triệu, Hai Bà Trưng, Hà Nội',
    region: 'north',
    city: 'Hà Nội',
    screens: 9,
    status: 'Đang hoạt động',
  },
  {
    id: 'aeon-ha-dong',
    name: 'CGV AEON Hà Đông',
    addr: 'AEON Mall Hà Đông, Hà Đông, Hà Nội',
    region: 'north',
    city: 'Hà Nội',
    screens: 8,
    status: 'Đang hoạt động',
  },
  {
    id: 'vincom-metropolis',
    name: 'CGV Vincom Metropolis',
    addr: 'Vincom Center Metropolis, Ba Đình, Hà Nội',
    region: 'north',
    city: 'Hà Nội',
    screens: 7,
    status: 'Đang hoạt động',
  },
  {
    id: 'vincom-ha-long',
    name: 'CGV Vincom Hạ Long',
    addr: 'Vincom Plaza Hạ Long, Quảng Ninh',
    region: 'north',
    city: 'Hạ Long',
    screens: 6,
    status: 'Đang hoạt động',
  },

  {
    id: 'vincom-da-nang',
    name: 'CGV Vincom Đà Nẵng',
    addr: 'Vincom Plaza Ngô Quyền, Sơn Trà, Đà Nẵng',
    region: 'central',
    city: 'Đà Nẵng',
    screens: 7,
    status: 'Đang hoạt động',
  },
  {
    id: 'vincom-hue',
    name: 'CGV Vincom Huế',
    addr: 'Vincom Plaza Huế, Phú Nhuận, Huế',
    region: 'central',
    city: 'Huế',
    screens: 6,
    status: 'Đang hoạt động',
  },
  {
    id: 'vincom-vinh',
    name: 'CGV Vincom Vinh',
    addr: 'Vincom Plaza Vinh, Nghệ An',
    region: 'central',
    city: 'Vinh',
    screens: 6,
    status: 'Đang hoạt động',
  },
  {
    id: 'vincom-nha-trang',
    name: 'CGV Vincom Nha Trang',
    addr: 'Vincom Plaza Trần Phú, Nha Trang, Khánh Hòa',
    region: 'central',
    city: 'Nha Trang',
    screens: 6,
    status: 'Đang hoạt động',
  },
  {
    id: 'quy-nhon-center',
    name: 'CGV Quy Nhơn Center',
    addr: 'Trung tâm Quy Nhơn, Bình Định',
    region: 'central',
    city: 'Quy Nhơn',
    screens: 5,
    status: 'Đang hoạt động',
  },

  {
    id: 'landmark-81',
    name: 'CGV Landmark 81',
    addr: 'Vincom Center Landmark 81, Bình Thạnh, TP.HCM',
    region: 'south',
    city: 'TP.HCM',
    screens: 9,
    status: 'Đang hoạt động',
  },
  {
    id: 'aeon-tan-phu',
    name: 'CGV AEON Tân Phú',
    addr: 'AEON Mall Tân Phú Celadon, Tân Phú, TP.HCM',
    region: 'south',
    city: 'TP.HCM',
    screens: 10,
    status: 'Đang hoạt động',
  },
  {
    id: 'vincom-dong-khoi',
    name: 'CGV Vincom Đồng Khởi',
    addr: 'Vincom Center Đồng Khởi, Quận 1, TP.HCM',
    region: 'south',
    city: 'TP.HCM',
    screens: 8,
    status: 'Đang hoạt động',
  },
  {
    id: 'gigamall-thu-duc',
    name: 'CGV GigaMall Thủ Đức',
    addr: 'GigaMall, TP. Thủ Đức, TP.HCM',
    region: 'south',
    city: 'TP.HCM',
    screens: 8,
    status: 'Đang hoạt động',
  },
  {
    id: 'sense-city-can-tho',
    name: 'CGV Sense City Cần Thơ',
    addr: 'Sense City, Ninh Kiều, Cần Thơ',
    region: 'south',
    city: 'Cần Thơ',
    screens: 7,
    status: 'Đang hoạt động',
  },
]

export const regionLabels = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam' }
export const allMovies = [...showing, ...comingSoon]
export const seedMoviesById = Object.fromEntries(
  allMovies.map((movie, index) => [String(index + 1), movie]),
)
export const currentMovieCount = showing.length
export const vnMovieCount = allMovies.filter((m) => m.origin === 'vn').length
export const intlMovieCount = allMovies.filter((m) => m.origin === 'intl').length
export const vietnameseMovies = allMovies.filter((m) => m.origin === 'vn')

export const baseTimes = [
  ['09:00', '11:25', '13:50', '16:15', '18:40', '21:05'],
  ['09:30', '12:00', '14:30', '17:00', '19:30', '22:00'],
  ['10:00', '12:40', '15:20', '18:00', '20:40'],
  ['09:15', '11:50', '14:25', '17:10', '19:55', '22:25'],
  ['10:20', '13:05', '15:50', '18:35', '21:20'],
]

export const makeTheaterShowtimes = (theaterIndex) => {
  const start = theaterIndex % showing.length
  const pool = [...showing.slice(start), ...showing.slice(0, start)]
  return pool.slice(0, 9).map((m, i) => ({
    title: m.title,
    format: `${i % 4 === 0 ? 'IMAX 2D' : i % 5 === 0 ? '4DX 2D' : '2D'} · ${m.origin === 'intl' ? (i % 3 === 0 ? 'Lồng tiếng Việt' : 'Phụ đề Việt') : 'Tiếng Việt'}`,
    times: baseTimes[(i + theaterIndex) % baseTimes.length].slice(0, i % 3 === 0 ? 5 : 4),
  }))
}

export const showtimes = Object.fromEntries(
  theaters.map((theater, index) => [theater.id, makeTheaterShowtimes(index)]),
)

export const weekdayLabels = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
]
export const pad2 = (value) => String(value).padStart(2, '0')
export const datePlans = Array.from({ length: 4 }, (_, dayIndex) => {
  const date = new Date(now)
  date.setDate(now.getDate() + dayIndex)
  const key = `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`
  return [key, `${dayIndex === 0 ? 'Hôm nay' : weekdayLabels[date.getDay()]} · ${key}`]
})

export const upcomingShowtimes = Object.fromEntries(
  datePlans.map(([key, label], dayIndex) => [
    key,
    {
      label,
      theaters: Object.fromEntries(
        theaters.map((theater, theaterIndex) => {
          const rows = makeTheaterShowtimes(theaterIndex + dayIndex).slice(
            dayIndex % 2,
            7 + (dayIndex % 2),
          )
          return [theater.id, rows]
        }),
      ),
    },
  ]),
)

// Thông tin phim bên dưới được đối chiếu từ nguồn công khai. Lịch chiếu/rạp trong prototype vẫn là dữ liệu mô phỏng theo phạm vi SRS.
export const movieDetails = {
  'Trại Buôn Người': {
    synopsis:
      'Ny tìm cách xâm nhập đường dây buôn người ở khu vực biên giới để cứu em gái. Bị cuốn vào hệ thống giam giữ và lừa đảo, cô cùng những nạn nhân khác phải tìm cách sống sót và thoát ra.',
    director: 'Toni Dương Bảo Anh',
    cast: 'Steven Nguyễn, Quách Ngọc Ngoan, Huỳnh Minh Kiên, Tùng Mint',
    producer: 'Đang cập nhật',
    country: 'Việt Nam',
    language: 'Tiếng Việt',
    formats: '2D',
    release: '25/09/2026',
    duration: '135 phút',
    classification: 'T18',
    genreFull: 'Hành động · Tâm lý',
    highlight: 'Phim Việt khai thác đề tài buôn người xuyên biên giới và hành trình giải cứu.',
    sourceName: 'Galaxy Cinema',
    sourceUrl: 'https://www.galaxycine.vn/phim/trai-buon-nguoi/',
  },
  'Út Lan 2': {
    synopsis:
      'Từ lúc một con rắn hai đầu xuất hiện, ngôi làng ven sông liên tiếp xảy ra những cái chết bí ẩn. Khi những bí mật bị lãng quên dần trồi lên mặt nước, người dân nhận ra có những lời nguyền chưa bao giờ thực sự biến mất.',
    director: 'Trần Trọng Dần',
    cast: 'Phương Nam, Kiều Oanh, NSƯT Kim Phương, Tạ Lâm, Ngọc Phước',
    producer: 'Apia Pictures',
    country: 'Việt Nam',
    language: 'Tiếng Việt',
    formats: '2D',
    release: '25/09/2026',
    duration: '107 phút',
    classification: 'T18',
    genreFull: 'Kinh dị',
    highlight:
      'Tác phẩm tiếp tục khai thác chất liệu kinh dị dân gian Nam Bộ, truyền thuyết Hà Bá và nỗi sợ vùng sông nước.',
    sourceName: 'Galaxy Cinema',
    sourceUrl: 'https://www.galaxycine.vn/phim/ut-lan-2/',
  },
  'Lên Hương': {
    synopsis:
      'Một bà chủ trại hòm và một chàng trai trẻ bị cuốn vào một giao kèo, từ đó những món nợ, áp lực gia đình và các bí mật trong quá khứ dần được hé lộ.',
    director: 'Khương Ngọc · Tấn Hoàng Thông',
    cast: 'Hồng Đào, Võ Tấn Phát, NSƯT Tuyết Thu, NSND Hồng Vân, Hạ Anh, Quốc Khánh',
    producer: 'Mockingbird Pictures',
    country: 'Việt Nam',
    language: 'Tiếng Việt',
    formats: '2D',
    release: '18/09/2026',
    duration: '121 phút',
    classification: 'T16',
    genreFull: 'Tâm lý · Gia đình',
    highlight:
      'Phim gia đình Việt có Hồng Đào và Võ Tấn Phát, do Khương Ngọc và Tấn Hoàng Thông đạo diễn.',
    sourceName: 'Galaxy Cinema',
    sourceUrl: 'https://www.galaxycine.vn/phim/len-huong/',
  },
  'Bóng Ma Nhà Hát': {
    synopsis:
      'Tuấn, một chuyên viên bất động sản đầy tham vọng, được giao nhiệm vụ vực dậy một nhà hát cũ. Tại đây, anh phát hiện nơi này bị ám bởi Nhã, một nữ diễn viên chết oan chưa thể siêu thoát.',
    director: 'Lê Công Sơn',
    cast: 'Trâm Anh, Quỳnh Lý, Phương Lan, Hứa Minh Đạt, Lâm Vĩ Dạ',
    producer: 'Đang cập nhật',
    country: 'Việt Nam',
    language: 'Tiếng Việt',
    formats: '2D',
    release: '18/09/2026',
    duration: '97 phút',
    classification: 'T16',
    genreFull: 'Hài · Kinh dị',
    highlight: 'Câu chuyện pha trộn hài và kinh dị trong bối cảnh một nhà hát cũ.',
    sourceName: 'Galaxy Cinema',
    sourceUrl: 'https://www.galaxycine.vn/phim/bong-ma-nha-hat/',
  },
  'Mãi Nợ Một Lời Tạm Biệt': {
    synopsis:
      'Daniel trở về tìm lại những mảnh ký ức tuổi thơ, người bà và những điều chưa kịp nói. Hành trình đưa anh đối diện với gia đình, mất mát và quá khứ bị bỏ lại.',
    director: 'J. Robert Schulz',
    cast: 'Kiều Chinh, Daniel K. Winn, Nguyễn Vũ Uy Nhân, Samuel An, Lan Thy',
    producer: 'WS Productions · Skyline',
    country: 'Việt Nam · Mỹ',
    language: 'Tiếng Việt · Tiếng Anh',
    formats: '2D',
    release: '11/09/2026',
    duration: '120 phút',
    classification: 'K',
    genreFull: 'Tâm lý · Gia đình',
    highlight: 'Tác phẩm khai thác ký ức, gia đình và một lời tạm biệt còn dang dở.',
    sourceName: 'Galaxy Cinema',
    sourceUrl: 'https://www.galaxycine.vn/phim/mai-no-mot-loi-tam-biet/',
  },
  Colony: {
    synopsis:
      'Một ổ dịch bí ẩn bùng phát trong tòa nhà chọc trời giữa Seoul và toàn bộ người bên trong bị phong tỏa. Khi những người nhiễm bệnh biến đổi thành các kẻ săn mồi phối hợp, Kwon Se-jeong và nhóm sống sót chạy lên mái nhà để tìm cơ hội được giải cứu.',
    director: 'Yeon Sang-ho',
    cast: 'Gianna Jun, Koo Kyo-hwan, Ji Chang-wook, Shin Hyun-been, Kim Shin-rok, Go Soo',
    producer: 'WOWPOINT · Smilegate',
    country: 'Hàn Quốc',
    language: 'Tiếng Hàn',
    formats: '2D',
    release: '21/05/2026',
    duration: '122 phút',
    classification: 'Đang cập nhật',
    genreFull: 'Giật gân · Hành động',
    highlight:
      'Phim mới của đạo diễn Yeon Sang-ho, lấy bối cảnh sinh tồn trong một tòa nhà bị phong tỏa.',
    sourceName: 'Korean Film Council (KOFIC)',
    sourceUrl:
      'https://www.koreanfilm.or.kr/eng/news/newfilm.jsp?blbdComCd=601011&mode=VIEW&seq=701',
  },
  'The Odyssey': {
    synopsis:
      'Christopher Nolan đưa thiên sử thi nền tảng của Homer lên màn ảnh trong một tác phẩm hành động thần thoại được quay bằng công nghệ phim IMAX.',
    director: 'Christopher Nolan',
    cast: 'Matt Damon, Tom Holland, Anne Hathaway, Robert Pattinson, Lupita Nyong’o, Zendaya, Charlize Theron',
    producer: 'Emma Thomas · Christopher Nolan / Syncopy',
    country: 'Mỹ',
    language: 'Tiếng Anh',
    formats: 'IMAX · 2D',
    release: '17/07/2026',
    duration: '172 phút',
    classification: 'R (Mỹ)',
    genreFull: 'Sử thi · Hành động thần thoại',
    highlight:
      'Universal giới thiệu đây là một “mythic action epic” được quay trên nhiều địa điểm bằng công nghệ IMAX film mới.',
    sourceName: 'Universal Pictures',
    sourceUrl: 'https://universalpictures.ca/movie/the-odyssey/',
  },
  'Quỷ Dữ Từ Luyện Ngục': {
    synopsis:
      'Kingkaew lấy cảm hứng từ một vụ án năm 1978 tại Thái Lan. Sau khi một người phụ nữ bị kết án và xử tử, hàng loạt hiện tượng kinh hoàng xảy ra, kéo những người liên quan trở lại với sự thật phía sau vụ án.',
    director: 'Ekkachai Srivichai',
    cast: 'Sai Charoenpura, Saiparn Apinya, Gun Napat Injaieua',
    producer: 'Đang cập nhật',
    country: 'Thái Lan',
    language: 'Tiếng Thái · Phụ đề Việt',
    formats: '2D',
    release: '10/04/2026',
    duration: '101 phút',
    classification: 'T18',
    genreFull: 'Kinh dị · Giật gân',
    highlight:
      'Phim kinh dị Thái Lan lấy cảm hứng từ một vụ án có thật và câu chuyện oan hồn Kingkaew.',
    sourceName: 'CGV Việt Nam',
    sourceUrl: 'https://www.cgv.vn/default/kingkaew.html',
  },
  'Án Mạng Karaoke': {
    synopsis:
      'Một người hàng xóm mê hát karaoke bất ngờ bị sát hại trong một homestay biệt lập trên núi. Khi mọi người đều có động cơ và hung thủ vẫn ẩn mình, Tâm cùng những người còn lại phải lần theo lời khai và các bí mật để tìm sự thật.',
    director: 'Hoàng Lê',
    cast: 'Đoàn Thiên Ân, Đại Nghĩa, Vân Dung',
    producer: 'Đang cập nhật',
    country: 'Việt Nam',
    language: 'Tiếng Việt',
    formats: '2D',
    release: '30/10/2026',
    duration: '96 phút',
    classification: 'T16',
    genreFull: 'Hài · Bí ẩn · Giật gân',
    highlight:
      'Phim trinh thám pha hài với bối cảnh khép kín và một vụ án xảy ra giữa chuyến đi trên núi.',
    sourceName: 'Galaxy Cinema',
    sourceUrl: 'https://www.galaxycine.vn/phim/an-mang-karaoke/',
  },
  'Mẹ Mìn': {
    synopsis:
      'Thông tin nội dung chi tiết của phim chưa được nhà phát hành công bố đầy đủ. Website chỉ hiển thị những dữ liệu đã được công bố chính thức về dự án và dàn diễn viên.',
    director: 'Jack Carry On',
    cast: 'Minh Hằng, Rima Thanh Vy, Khương Lê, Nhật Kim Anh, Phát La, Huỳnh Nhựt',
    producer: 'V Studios',
    country: 'Việt Nam',
    language: 'Tiếng Việt',
    formats: '2D',
    release: '23/10/2026',
    duration: 'Đang cập nhật',
    classification: 'Đang cập nhật',
    genreFull: 'Đang cập nhật',
    highlight:
      'V Studios công bố phim khởi chiếu ngày 23/10/2026 và dàn diễn viên gồm Minh Hằng, Rima Thanh Vy, Khương Lê, Nhật Kim Anh, Phát La, Huỳnh Nhựt.',
    sourceName: 'Thế Giới Văn Hóa',
    sourceUrl: 'https://thegioivanhoa.info/dien-anh/dien-anh-viet-nam',
  },
}
