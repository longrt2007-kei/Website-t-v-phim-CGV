# CGV — Quản lý phim

## Chạy dự án

```sh
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, thêm `/admin.html` để vào trang quản lý phim. Trang chủ có liên kết **QUẢN LÝ PHIM**.

Lệnh trên chạy đồng thời giao diện Vite và json-server tại `http://127.0.0.1:3001`. Có thể chạy riêng bằng `npm run web` và `npm run api` trong hai terminal.

## Chức năng

- Danh sách phim, thống kê trạng thái, phân trang 8 phim/trang.
- Tìm kiếm tên phim/đạo diễn không phân biệt dấu, lọc thể loại/trạng thái, sắp xếp.
- Thêm, sửa, xóa phim có xác nhận; kiểm tra các trường bắt buộc.
- Thông báo lưu thành công, lỗi API và thử kết nối lại.

Dữ liệu quản lý được lưu vào `db.json` qua GET/POST/PATCH/DELETE `/movies`. Vite chuyển tiếp `/api` đến json-server; khi triển khai bản build, cần cấu hình máy chủ chuyển tiếp `/api` tương tự. Chạy `npm run build` để tạo cả trang chủ và trang quản lý.

Trang quản lý dùng dữ liệu riêng. Trang đặt vé hiện tại vẫn dùng danh mục tĩnh trong `src/main.js`; thay đổi trong trang quản lý chưa cập nhật danh mục đặt vé.

json-server là API mô phỏng, không có xác thực/phân quyền. Trang quản lý dành cho phát triển và học tập trên máy cá nhân, không dùng trực tiếp làm hệ thống quản trị công khai.
