// Each seat in a multi-seat booking needs its own scannable ticket code.
export function getTicketEntries(booking) {
  const seats = Array.isArray(booking?.seats) ? booking.seats : []
  const codes = Array.isArray(booking?.ticketCodes) ? booking.ticketCodes : []

  return seats.map((seat, index) => ({
    seat,
    code: String(codes[index] || (index === 0 ? booking.code : `${booking.code}-${String(index + 1).padStart(2, '0')}`)),
  }))
}

export function createTicketCodes(bookingCode, seats) {
  return seats.map((_, index) =>
    index === 0 ? String(bookingCode) : `${bookingCode}-${String(index + 1).padStart(2, '0')}`,
  )
}
