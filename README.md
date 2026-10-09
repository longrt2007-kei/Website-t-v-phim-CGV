# CGV Cinemas — web đặt vé

## Chạy dự án

Yêu cầu: Node.js 18 trở lên.

```sh
npm install
npm run dev
```

Hoặc trên Windows chạy `CHAY_WEB.bat`.

- Web: `http://127.0.0.1:5173/trangchu.html`
- API + Auth: `http://127.0.0.1:3001`

`npm run dev` chạy đồng thời Vite và API JSON Server có `json-server-auth`.

## Email vé và QR soát vé

Khi người dùng đã đăng nhập và hoàn tất bước xác nhận thanh toán, API lưu vé và gửi email xác nhận tới email tài khoản. Email và trang vé có QR; nhân viên có thể quét bằng camera điện thoại để mở trang xác nhận thông tin vé.

Để bật gửi Gmail, cấu hình `GMAIL_USER`, `GMAIL_APP_PASSWORD` và `PUBLIC_URL` trong môi trường chạy API. Với Gmail cần bật xác minh 2 bước và tạo **App Password**; không dùng mật khẩu đăng nhập Gmail. Trên Render, điền hai biến Gmail ở Environment và đặt `PUBLIC_URL` thành URL gốc của dịch vụ API. Khi chạy cục bộ, đặt các biến trong `.env` (không đưa tệp này lên Git). Nếu SMTP chưa được cấu hình hoặc Gmail từ chối gửi, vé vẫn được tạo và giao diện sẽ báo email chưa gửi.

QR hiện mở trang kiểm tra vé qua URL công khai API, vì vậy điện thoại quét cần truy cập được API. QR code là định danh vé; xác nhận thanh toán trong prototype hiện vẫn do người dùng bấm thủ công.

## Đăng ký / đăng nhập người dùng

- `dang-ky.html`: tạo tài khoản mới.
- `dang-nhap.html`: đăng nhập bằng email và mật khẩu.
- `tai-khoan.html`: trang tài khoản thành viên.
- `ve-cua-toi.html`: yêu cầu đăng nhập và chỉ hiển thị vé của tài khoản hiện tại.
- `src/shared/auth.js`: quản lý JWT/session phía giao diện.
- `src/shared/user-nav.js`: thanh tài khoản/đăng xuất dùng chung.
- `server.cjs`: gắn `json-server-auth` vào JSON Server và bảo vệ `/users` theo quyền `600`.

Dữ liệu người dùng được lưu trong collection `users` của `db.json`. Mật khẩu được `json-server-auth` mã hóa bằng bcryptjs; đăng nhập/đăng ký trả JWT.

> Đây là hệ thống xác thực phục vụ prototype/đồ án chạy cục bộ. Không dùng nguyên trạng cho môi trường production.

## Các trang chính

- `trangchu.html` + `src/trangchu.js`: trang chủ, chi tiết phim, chọn suất, chọn ghế, thanh toán QR.
- `phim.html` + `src/phim.js`: thư viện phim, tìm kiếm/lọc/yêu thích.
- `lichchieu.html` + `src/lichchieu.js`: lịch chiếu.
- `ve-cua-toi.html` + `src/ve-cua-toi.js`: vé của thành viên.
- `dang-nhap.html`, `dang-ky.html`, `tai-khoan.html`: tài khoản người dùng.
- `admin-phim.html`: quản lý phim.
- `admin-rap.html`: quản lý rạp.
- `admin-suat-chieu.html`: quản lý suất chiếu.
- `admin-ve.html`: quản lý vé.
- `admin-login.html`: đăng nhập quản trị bằng tài khoản có quyền `admin`.

Tài khoản quản trị mẫu:

```text
Tài khoản: cgvteam
Mật khẩu: cấu hình bằng biến môi trường ADMIN_PASSWORD
```

## Poster

Thư viện hiện dùng poster/artwork thật thay cho toàn bộ SVG minh họa trước đây. Một số poster phổ biến được lưu cục bộ, các poster khác dùng URL nguồn ảnh thật và có fallback khi ảnh ngoài tạm thời không truy cập được. Xem `POSTER_SOURCES.md`.
