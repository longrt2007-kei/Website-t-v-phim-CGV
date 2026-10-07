export const BOOKING_STORAGE_KEY = 'cgv_bookings_v1'
export const SEAT_STORAGE_KEY = 'cgv_seat_state_v1'
export const PAYMENT_BANK = 'BIDV'
export const PAYMENT_ACCOUNT = '8855252740'
export const TICKET_PRICE = 85000

export function getBookings(){
  try { return JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY) || '[]') }
  catch { return [] }
}
export function saveBookings(bookings){ localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings)) }
export function getSeatMap(){
  try { return JSON.parse(localStorage.getItem(SEAT_STORAGE_KEY) || '{}') }
  catch { return {} }
}
export function saveSeatMap(map){ localStorage.setItem(SEAT_STORAGE_KEY, JSON.stringify(map)) }
export function bookingKey(b){ return `${b.movie}__${b.theaterId}__${b.date}__${b.time}` }
export function releaseBookingSeats(booking){
  const map=getSeatMap(), key=bookingKey(booking)
  if(map[key]){
    map[key]=map[key].filter(seat=>!booking.seats.includes(seat))
    if(!map[key].length) delete map[key]
    saveSeatMap(map)
  }
}
export const money = value => `${Number(value||0).toLocaleString('vi-VN')}đ`
export const formatDateTime = value => value ? new Date(value).toLocaleString('vi-VN') : '—'
