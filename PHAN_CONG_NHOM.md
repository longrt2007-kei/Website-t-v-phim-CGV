# Phân công công việc

Mỗi thành viên làm việc trên branch riêng, cập nhật từ `main` trước khi bắt đầu và tạo Pull Request để ghép code.

| Công việc | Branch | Phạm vi chính | File phụ trách |
| --- | --- | --- | --- |
| Trang khách | `trang-khach` | Trang chủ, danh sách phim, lịch chiếu, dữ liệu và thành phần giao diện dùng chung | `trangchu.html`, `phim.html`, `lichchieu.html`, `src/trangchu.js`, `src/phim.js`, `src/lichchieu.js`, `src/data/`, `src/ui/`, `src/styles/home.css` |
| Tài khoản | `tai-khoan` | Đăng ký, đăng nhập, hồ sơ khách hàng và phiên đăng nhập | `dang-ky.html`, `dang-nhap.html`, `tai-khoan.html`, `src/dang-ky.js`, `src/dang-nhap.js`, `src/tai-khoan.js`, `src/shared/auth.js`, `src/shared/user-nav.js`, `src/auth-pages.css` |
| Quản lý | `quan-ly` | Quản lý phim, rạp và suất chiếu | `admin-phim.html`, `admin-rap.html`, `admin-suat-chieu.html`, `src/admin-phim.js`, `src/admin-rap.js`, `src/admin-suat-chieu.js`, `src/admin.css`, `src/admin-dark.css`, `src/shared/api.js` |
| Đặt vé | `dat-ve` | Chọn suất, chọn ghế, thanh toán, vé của khách và quản lý vé | `ve-cua-toi.html`, `admin-ve.html`, `src/ve-cua-toi.js`, `src/admin-ve.js`, `src/shared/booking-storage.js`; phụ trách phần đặt vé trong `src/trangchu.js` |

## Quy ước làm việc

1. Không commit trực tiếp vào `main`.
2. Chỉ sửa file trong phạm vi được giao; nếu cần sửa file của người khác thì trao đổi trước.
3. Trước khi tạo Pull Request, chạy `npm run build` và kiểm tra chức năng trên máy.
4. `db.json`, `server.cjs`, `package.json` và `vite.config.js` là file dùng chung; báo cả nhóm trước khi sửa.
5. Mỗi Pull Request chỉ chứa một nhóm thay đổi có liên quan.
