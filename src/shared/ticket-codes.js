// Tạo và đọc mã vé riêng cho từng ghế trong một lần đặt nhiều vé.
// Chuẩn hóa danh sách cặp ghế/mã vé từ một bản ghi đặt chỗ.
export function getTicketEntries(booking) {
  const seats = Array.isArray(booking?.seats) ? booking.seats : []
  const codes = Array.isArray(booking?.ticketCodes) ? booking.ticketCodes : []

  return seats.map((seat, index) => ({
    seat,
    code: String(codes[index] || (index === 0 ? booking.code : `${booking.code}-${String(index + 1).padStart(2, '0')}`)),
  }))
}

// Tạo mã cho từng ghế, dùng mã đơn đặt làm mã đầu tiên.
export function createTicketCodes(bookingCode, seats) {
  return seats.map((_, index) =>
    index === 0 ? String(bookingCode) : `${bookingCode}-${String(index + 1).padStart(2, '0')}`,
  )
}
