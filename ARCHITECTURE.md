# Cấu trúc project

## Trang người dùng
- `trangchu.html` → `src/trangchu.js`: trang chủ, chi tiết phim, đặt vé.
- `phim.html` → `src/phim.js`: thư viện phim.
- `lichchieu.html` → `src/lichchieu.js`: lịch chiếu.
- `ve-cua-toi.html` → `src/ve-cua-toi.js`: vé của tài khoản đang đăng nhập.
- `dang-nhap.html` → `src/dang-nhap.js`: đăng nhập.
- `dang-ky.html` → `src/dang-ky.js`: đăng ký.
- `tai-khoan.html` → `src/tai-khoan.js`: hồ sơ tài khoản.

## Auth dùng chung
- `server.cjs`: JSON Server + `json-server-auth`.
- `src/shared/auth.js`: JWT, register/login/logout/session.
- `src/shared/user-nav.js`: nút tài khoản dùng chung giữa các trang.
- `src/auth-pages.css`: giao diện đăng nhập/đăng ký/tài khoản.

## Booking
- `src/shared/booking-storage.js`: dữ liệu vé/ghế localStorage.
- Vé mới có `userId`, giúp tách lịch sử vé theo tài khoản.

## Dữ liệu / giao diện trang chủ
- `src/data/home-catalog.js`: seed catalog, rạp, lịch chiếu, thông tin phim.
- `src/ui/home-components.js`: card phim, poster, lịch chiếu.
- `src/ui/icons.js`: icon dùng chung.

## Admin
- `admin-phim.html` + `src/admin-phim.js`
- `admin-rap.html` + `src/admin-rap.js`
- `admin-suat-chieu.html` + `src/admin-suat-chieu.js`
- `admin-ve.html` + `src/admin-ve.js`

## API
- `db.json`: `movies`, `theaters`, `showtimes`, `users`.
- Vite proxy `/api/*` → `127.0.0.1:3001/*`.
- `users` dùng quyền `600` của json-server-auth.
