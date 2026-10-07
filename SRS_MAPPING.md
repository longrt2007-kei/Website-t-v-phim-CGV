# Đối chiếu sản phẩm với SRS – Website đặt vé xem phim CGV

## Công nghệ đúng phạm vi
- HTML5 + CSS3 + Vanilla JavaScript, không dùng framework trong phần chạy sản phẩm.
- Không có backend/database phức tạp.
- Dữ liệu phim nằm trong JavaScript theo cấu trúc dữ liệu mẫu; LocalStorage dùng để lưu vé đã đặt và trạng thái ghế.
- Không tích hợp API CGV thật, không thanh toán online thật, không Google/Facebook login, không email/SMS xác nhận.

## User – MVP
1. **Trang chủ:** có header, hero, phim nổi bật, phim Việt, phim sắp chiếu, tin điện ảnh.
2. **Danh sách phim:** card phim có poster, tên, thể loại, phân loại, mô tả ngắn.
3. **Chi tiết phim:** nội dung, ngày khởi chiếu, thời lượng, đạo diễn, diễn viên, quốc gia, ngôn ngữ và liên kết nguồn công khai.
4. **Tìm kiếm/lọc phim:** tìm theo tên + lọc Tất cả / Phim Việt / Quốc tế / Kinh dị.
5. **Rạp/ngày/suất chiếu:** bước đặt vé cho phép chọn rạp, ngày và giờ.
6. **Chọn ghế:** sơ đồ ghế 8 hàng x 10 ghế, phân biệt ghế trống / đang chọn / đã đặt.
7. **Xác nhận đặt vé:** tạo mã vé, tổng hợp phim/rạp/ngày/giờ/ghế và tổng tiền mô phỏng.
8. **Thông tin vé:** nút “VÉ CỦA TÔI” đọc danh sách vé đã lưu từ LocalStorage.

## Admin – mức cơ bản
- Đăng nhập Admin demo bằng tài khoản `cgvteam`; mật khẩu được cấu hình qua biến môi trường `ADMIN_PASSWORD`.
- Xem danh sách phim và thông tin rạp/phòng/suất chiếu.
- Vận hành nhanh cho phim/rạp/lịch chiếu ở mức prototype.
- Xem danh sách vé đã đặt và xóa vé trong LocalStorage.

## Dữ liệu phim
- Chỉ giữ các tựa 2026 đã có nguồn công khai đối chiếu.
- Không tự tạo rating hoặc cốt truyện khi nguồn chưa công bố.
- Trong trang chi tiết mỗi phim có liên kết “Nguồn thông tin phim”.
- Poster/ảnh quảng bá được tải từ nguồn công khai; có ảnh dự phòng khi nguồn bên ngoài không tải được.

## Lưu ý demo
Rạp, lịch chiếu, ghế và giá vé là dữ liệu mô phỏng để thực hiện đúng luồng SRS. Đây không phải dữ liệu realtime của CGV vì SRS xác định tích hợp API CGV thực tế và thanh toán online thực tế nằm ngoài phạm vi.
