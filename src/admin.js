import './admin.css'
import './admin-dark.css'

const statuses = { showing: 'Đang chiếu', upcoming: 'Sắp chiếu', archived: 'Ngừng chiếu' }
const genres = ['Hành động', 'Tâm lý', 'Kinh dị', 'Hài', 'Gia đình', 'Hoạt hình', 'Khoa học viễn tưởng', 'Khác']
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const normalize = value => value.toLocaleLowerCase('vi').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd')
const safePoster = value => { try { const url = new URL(value, location.origin); return ['http:', 'https:'].includes(url.protocol) ? url.href : '' } catch { return '' } }
let movies = [], page = 1, busy = false, editingId = null, deletingId = null
const pageSize = 8

document.querySelector('#app').innerHTML = `
<aside class="sidebar"><a class="brand" href="/">CGV<small>STUDIO</small></a><div><div class="nav-label">KHÔNG GIAN QUẢN TRỊ</div><a class="nav-item active" href="/admin.html">▣ &nbsp; Quản lý phim</a><a class="nav-item" href="/">↗ &nbsp; Trang đặt vé</a></div><div class="sidebar-bottom"><strong>CGV Cinema Studio</strong>Quản lý nội dung điện ảnh<br>Phiên bản demo · 2026</div></aside>
<main><header class="topbar"><span>Không gian làm việc &nbsp; / &nbsp; <b>Phim</b></span><div class="profile"><span>Quản trị viên</span><span class="avatar">AD</span></div></header>
<section class="page-head"><div><h1>Quản lý phim</h1><p>Tất cả câu chuyện điện ảnh, trong một không gian.</p></div><button class="button primary" id="add">＋ &nbsp; Thêm phim mới</button></section>
<div id="error" class="alert" role="alert" hidden></div><section class="stats" id="stats"></section>
<section class="panel"><div class="panel-heading"><h2>Thư viện phim <span id="count"></span></h2><span id="connection" class="connection">● Đang kết nối</span></div>
<div class="filters"><label class="search"><input id="search" type="search" placeholder="Tìm tên phim, đạo diễn…" aria-label="Tìm phim"></label><select id="status" aria-label="Lọc trạng thái"><option value="">Tất cả trạng thái</option>${Object.entries(statuses).map(([key, label]) => `<option value="${key}">${label}</option>`).join('')}</select><select id="genre" aria-label="Lọc thể loại"><option value="">Tất cả thể loại</option>${genres.map(g => `<option>${g}</option>`).join('')}</select><select id="sort" aria-label="Sắp xếp"><option value="newest">Mới cập nhật</option><option value="title">Tên phim A–Z</option><option value="release">Ngày khởi chiếu</option></select></div>
<div class="table-scroll"><table><thead><tr><th>PHIM</th><th>THỂ LOẠI</th><th>THỜI LƯỢNG</th><th>KHỞI CHIẾU</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead><tbody id="rows"></tbody></table></div><div id="empty" class="empty" hidden></div><div class="pagination"><span id="range"></span><div><button class="icon-button" id="prev" aria-label="Trang trước">←</button><span id="page"></span><button class="icon-button" id="next" aria-label="Trang sau">→</button></div></div></section>
<footer class="footer"><span>© 2026 CGV Studio · Dữ liệu phim minh họa</span><span>Mỗi bộ phim là một câu chuyện đáng kể.</span></footer></main>
<dialog id="editor" aria-labelledby="editor-title"><h2 id="editor-title">Thêm phim mới</h2><p>Điền thông tin để đưa phim vào thư viện.</p><form id="movie-form"><div class="form-grid">
<label class="wide">Tên phim *<input name="title" required maxlength="150" placeholder="Nhập tên phim"></label>
<label>Đạo diễn<input name="director" maxlength="150" placeholder="Tên đạo diễn"></label><label>Thể loại *<select name="genre" required>${genres.map(g => `<option>${g}</option>`).join('')}</select></label>
<label>Thời lượng (phút) *<input name="duration" type="number" min="1" max="600" required placeholder="120"></label><label>Ngày khởi chiếu *<input name="releaseDate" type="date" required></label>
<label>Trạng thái<select name="status">${Object.entries(statuses).map(([key, label]) => `<option value="${key}">${label}</option>`).join('')}</select></label><label>Phân loại độ tuổi<select name="rating">${['P', 'K', 'T13', 'T16', 'T18'].map(g => `<option>${g}</option>`).join('')}</select></label>
<label class="wide">Đường dẫn poster<input name="poster" type="url" placeholder="https://…"></label><label class="wide">Mô tả<textarea name="description" rows="3" maxlength="3000" placeholder="Giới thiệu nội dung phim"></textarea></label></div><div id="form-error" class="form-error" role="alert"></div><div class="dialog-footer"><button type="button" class="button" id="cancel">Hủy</button><button type="submit" class="button primary" id="save">Lưu phim</button></div></form></dialog>
<dialog id="delete-dialog" aria-labelledby="delete-title"><h2 id="delete-title">Xóa phim khỏi thư viện?</h2><p id="delete-description"></p><div id="delete-error" class="form-error" role="alert"></div><div class="dialog-footer"><button class="button" id="cancel-delete">Giữ lại</button><button class="button primary" id="confirm-delete">Xóa phim</button></div></dialog><div class="toast" id="toast" role="status" hidden></div>`

const $ = selector => document.querySelector(selector)
async function request(path = '', options = {}) {
  const response = await fetch(`/api/movies${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } })
  if (!response.ok) throw new Error(`Không thể xử lý yêu cầu (${response.status}). Vui lòng thử lại.`)
  return response.status === 204 ? null : response.json()
}
function filtered() {
  const query = normalize($('#search').value.trim())
  return movies.filter(m => (!query || normalize(`${m.title} ${m.director}`).includes(query)) && (!$('#status').value || m.status === $('#status').value) && (!$('#genre').value || m.genre === $('#genre').value)).sort((a, b) => $('#sort').value === 'title' ? a.title.localeCompare(b.title, 'vi') : $('#sort').value === 'release' ? b.releaseDate.localeCompare(a.releaseDate) : (b.updatedAt || '').localeCompare(a.updatedAt || ''))
}
function render() {
  $('#stats').innerHTML = [['Tổng số phim', movies.length, 'Trong thư viện của bạn'], ['Đang chiếu', movies.filter(m => m.status === 'showing').length, 'Sẵn sàng trên màn ảnh'], ['Sắp chiếu', movies.filter(m => m.status === 'upcoming').length, 'Những câu chuyện tiếp theo'], ['Ngừng chiếu', movies.filter(m => m.status === 'archived').length, 'Đã lưu trong thư viện']].map(([label, count, caption]) => `<article class="stat"><span>${label}</span><strong>${String(count).padStart(2, '0')}</strong><small>${caption}</small></article>`).join('')
  const result = filtered(), pages = Math.max(1, Math.ceil(result.length / pageSize))
  page = Math.min(page, pages)
  $('#count').textContent = `(${movies.length})`
  $('#rows').innerHTML = result.slice((page - 1) * pageSize, page * pageSize).map(m => `<tr><td><div class="movie-cell"><img class="poster" src="${escape(safePoster(m.poster) || '/favicon.svg')}" alt="Poster ${escape(m.title)}" loading="lazy"><div><strong>${escape(m.title)}</strong><small>${escape(m.director || 'Chưa cập nhật')} &nbsp; · &nbsp; ${escape(m.rating)}</small></div></div></td><td>${escape(m.genre)}</td><td>${escape(m.duration)} phút</td><td>${escape(m.releaseDate?.split('-').reverse().join('/') || '—')}</td><td><span class="badge ${Object.hasOwn(statuses, m.status) ? m.status : ''}">${escape(statuses[m.status] || 'Chưa cập nhật')}</span></td><td><div class="actions"><button class="icon-button" data-edit="${escape(m.id)}" aria-label="Sửa ${escape(m.title)}">Sửa</button><button class="icon-button delete" data-delete="${escape(m.id)}" aria-label="Xóa ${escape(m.title)}">Xóa</button></div></td></tr>`).join('')
  document.querySelectorAll('.poster').forEach(img => img.addEventListener('error', () => { img.src = '/favicon.svg' }, { once: true }))
  $('#empty').hidden = result.length > 0
  $('#empty').textContent = movies.length ? 'Không tìm thấy phim phù hợp. Thử thay đổi bộ lọc.' : 'Thư viện chưa có phim. Thêm bộ phim đầu tiên của bạn.'
  $('#range').textContent = result.length ? `Hiển thị ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, result.length)} trong ${result.length} phim` : '0 phim'
  $('#page').textContent = `${page} / ${pages}`
  $('#prev').disabled = page === 1; $('#next').disabled = page === pages
}
async function load() {
  $('#error').hidden = true
  try { movies = await request(); $('#connection').textContent = '● Đã kết nối'; $('#connection').classList.add('online'); $('#add').disabled = false; render() }
  catch { $('#connection').textContent = '● Mất kết nối'; $('#connection').classList.remove('online'); $('#add').disabled = true; $('#error').hidden = false; $('#error').innerHTML = 'Không kết nối được máy chủ dữ liệu. Hãy chạy npm run dev rồi thử lại. <button class="button" id="retry">Thử lại</button>'; $('#retry').onclick = load }
}
let toastTimer
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false; toastTimer = setTimeout(() => { $('#toast').hidden = true }, 3500) }
function openEditor(movie = null) {
  editingId = movie?.id ?? null; $('#movie-form').reset(); $('#form-error').textContent = ''; $('#editor-title').textContent = movie ? 'Chỉnh sửa phim' : 'Thêm phim mới'
  if (movie) for (const [key, value] of Object.entries(movie)) { const field = $('#movie-form').elements.namedItem(key); if (field) field.value = value ?? '' }
  $('#editor').showModal()
}
$('#add').onclick = () => openEditor()
$('#cancel').onclick = () => { if (!busy) $('#editor').close() }
for (const id of ['search', 'status', 'genre', 'sort']) $(`#${id}`).addEventListener(id === 'search' ? 'input' : 'change', () => { page = 1; render() })
$('#prev').onclick = () => { page--; render() }; $('#next').onclick = () => { page++; render() }
$('#rows').onclick = event => {
  const edit = event.target.closest('[data-edit]'), del = event.target.closest('[data-delete]')
  if (edit) openEditor(movies.find(m => String(m.id) === edit.dataset.edit))
  if (del) { const movie = movies.find(m => String(m.id) === del.dataset.delete); deletingId = movie.id; $('#delete-description').textContent = `“${movie.title}” sẽ bị xóa khỏi dữ liệu. Thao tác này không thể hoàn tác.`; $('#delete-error').textContent = ''; $('#delete-dialog').showModal() }
}
$('#movie-form').onsubmit = async event => {
  event.preventDefault(); if (busy) return
  const data = Object.fromEntries(new FormData(event.target)); data.title = data.title.trim(); data.director = data.director.trim(); data.duration = Number(data.duration); data.updatedAt = new Date().toISOString()
  if (!data.title) { $('#form-error').textContent = 'Tên phim không được chỉ chứa khoảng trắng.'; return }
  busy = true; $('#save').disabled = true; $('#cancel').disabled = true; $('#form-error').textContent = ''
  try { const movie = await request(editingId === null ? '' : `/${encodeURIComponent(editingId)}`, { method: editingId === null ? 'POST' : 'PATCH', body: JSON.stringify(data) }); movies = editingId === null ? [movie, ...movies] : movies.map(m => m.id === editingId ? movie : m); render(); $('#editor').close(); toast('Đã lưu phim thành công.') }
  catch (error) { $('#form-error').textContent = `${error.message} Kiểm tra máy chủ dữ liệu.` }
  finally { busy = false; $('#save').disabled = false; $('#cancel').disabled = false }
}
$('#cancel-delete').onclick = () => { if (!busy) $('#delete-dialog').close() }
$('#confirm-delete').onclick = async () => {
  if (busy) return
  busy = true; $('#confirm-delete').disabled = true; $('#cancel-delete').disabled = true
  try { await request(`/${encodeURIComponent(deletingId)}`, { method: 'DELETE' }); movies = movies.filter(m => m.id !== deletingId); render(); $('#delete-dialog').close(); toast('Đã xóa phim khỏi thư viện.') }
  catch (error) { $('#delete-error').textContent = error.message }
  finally { busy = false; $('#confirm-delete').disabled = false; $('#cancel-delete').disabled = false }
}
for (const dialog of document.querySelectorAll('dialog')) dialog.addEventListener('cancel', event => { if (busy) event.preventDefault() })
render(); load()
