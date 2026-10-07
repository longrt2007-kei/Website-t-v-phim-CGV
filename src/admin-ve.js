import './admin.css'
import { adminNav } from './shared/admin-nav.js'
import { getBookings, saveBookings, releaseBookingSeats, money, formatDateTime } from './shared/booking-storage.js'

let tickets = getBookings()
const app = document.querySelector('#app')
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))

app.innerHTML = `
${adminNav('tickets')}
<main><header class="topbar"><span>QUẢN TRỊ / VÉ</span><div class="profile"><span>Administrator</span><span class="avatar">AD</span></div></header>
<section class="page-head"><div><h1>Quản lý vé</h1><p>Theo dõi vé đã đặt, trạng thái thanh toán và thao tác xử lý vé.</p></div></section>
<section class="stats" id="stats"></section>
<section class="panel"><div class="panel-heading"><div><h2>Danh sách vé <span id="count"></span></h2><span>Dữ liệu đặt vé trên trình duyệt hiện tại</span></div></div>
<div class="filters"><div class="search"><input id="search" placeholder="Tìm mã vé, phim, rạp, ghế..."></div><select id="status"><option value="">Tất cả trạng thái</option><option>Đã thanh toán</option><option>Chờ xác nhận</option><option>Đã hoàn tiền</option><option>Đã hủy</option></select><select id="sort"><option value="new">Mới nhất</option><option value="old">Cũ nhất</option><option value="amount">Giá trị cao nhất</option></select></div>
<div class="table-scroll"><table><thead><tr><th>MÃ VÉ</th><th>PHIM</th><th>RẠP / SUẤT</th><th>GHẾ</th><th>THANH TOÁN</th><th>TỔNG TIỀN</th><th>THỜI GIAN ĐẶT</th><th>THAO TÁC</th></tr></thead><tbody id="rows"></tbody></table></div><div id="empty" class="empty" hidden>Chưa có vé phù hợp.</div></section>
<footer class="footer"><span>© 2026 CGV Studio</span><span>Hệ thống quản lý vé CGV.</span></footer></main>`

const $ = s => document.querySelector(s)
function filtered(){
  const q=$('#search').value.trim().toLowerCase(), st=$('#status').value
  const rows=tickets.filter(t=>(!q || `${t.code} ${t.movie} ${t.theaterId} ${t.date} ${t.time} ${(t.seats||[]).join(' ')}`.toLowerCase().includes(q)) && (!st || (t.paymentStatus||'Đã thanh toán')===st))
  return rows.sort((a,b)=>$('#sort').value==='old' ? String(a.createdAt).localeCompare(String(b.createdAt)) : $('#sort').value==='amount' ? Number(b.amount||0)-Number(a.amount||0) : String(b.createdAt).localeCompare(String(a.createdAt)))
}
function render(){
  tickets=getBookings()
  const paid=tickets.filter(t=>(t.paymentStatus||'Đã thanh toán')==='Đã thanh toán')
  const revenue=paid.reduce((s,t)=>s+Number(t.amount||((t.seats||[]).length*85000)),0)
  $('#stats').innerHTML = [
    ['Tổng số vé',tickets.length,'Tất cả đơn đặt vé'],['Đã thanh toán',paid.length,'Vé đã xác nhận'],['Tổng ghế',tickets.reduce((s,t)=>s+(t.seats||[]).length,0),'Số ghế đã đặt'],['Doanh thu',money(revenue),'Theo vé đã thanh toán']
  ].map(([a,b,c])=>`<article class="stat"><span>${a}</span><strong>${b}</strong><small>${c}</small></article>`).join('')
  const rows=filtered(); $('#count').textContent=`(${rows.length})`; $('#empty').hidden=rows.length>0
  $('#rows').innerHTML=rows.map(t=>`<tr><td><strong>${esc(t.code)}</strong></td><td><strong>${esc(t.movie)}</strong></td><td>${esc(t.theaterName||t.theaterId||'—')}<br><small>${esc(t.date)} · ${esc(t.time)}</small></td><td>${esc((t.seats||[]).join(', '))}</td><td><select class="ticket-status" data-code="${esc(t.code)}"><option ${status(t,'Đã thanh toán')}>Đã thanh toán</option><option ${status(t,'Chờ xác nhận')}>Chờ xác nhận</option><option ${status(t,'Đã hoàn tiền')}>Đã hoàn tiền</option><option ${status(t,'Đã hủy')}>Đã hủy</option></select><br><small>${esc(t.paymentMethod||'QR BIDV')} · ${esc(t.paymentAccount||'8855252740')}</small></td><td><strong>${money(t.amount||((t.seats||[]).length*85000))}</strong></td><td>${formatDateTime(t.createdAt)}</td><td><div class="actions"><button class="icon-button delete" data-delete="${esc(t.code)}">Xóa vé</button></div></td></tr>`).join('')
}
function status(ticket,value){ return (ticket.paymentStatus||'Đã thanh toán')===value?'selected':'' }
$('#search').addEventListener('input',render); $('#status').addEventListener('change',render); $('#sort').addEventListener('change',render)
$('#rows').addEventListener('change',e=>{ const s=e.target.closest('.ticket-status'); if(!s)return; const list=getBookings(); const i=list.findIndex(t=>t.code===s.dataset.code); if(i>=0){list[i].paymentStatus=s.value; saveBookings(list); render()} })
$('#rows').addEventListener('click',e=>{ const b=e.target.closest('[data-delete]'); if(!b)return; const list=getBookings(); const ticket=list.find(t=>t.code===b.dataset.delete); if(!ticket)return; if(!confirm(`Xóa vé ${ticket.code}? Ghế của vé này sẽ được mở lại.`))return; releaseBookingSeats(ticket); saveBookings(list.filter(t=>t.code!==ticket.code)); render() })
window.addEventListener('storage',render)
render()
