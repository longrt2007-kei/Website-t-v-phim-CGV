import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: '/trangchu.html',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        trangchu: resolve(__dirname, 'trangchu.html'),
        phim: resolve(__dirname, 'phim.html'),
        lichchieu: resolve(__dirname, 'lichchieu.html'),
        veCuaToi: resolve(__dirname, 've-cua-toi.html'),
        admin: resolve(__dirname, 'admin.html'),
        dangNhapQuanTri: resolve(__dirname, 'dang-nhap-quan-tri.html'),
        quanLyPhim: resolve(__dirname, 'quan-ly-phim.html'),
        quanLyRap: resolve(__dirname, 'quan-ly-rap.html'),
        quanLySuatChieu: resolve(__dirname, 'quan-ly-suat-chieu.html'),
        quanLyVe: resolve(__dirname, 'quan-ly-ve.html'),
        dangNhap: resolve(__dirname, 'dang-nhap.html'),
        dangKy: resolve(__dirname, 'dang-ky.html'),
        taiKhoan: resolve(__dirname, 'tai-khoan.html'),
        chiTietVe: resolve(__dirname, 'chi-tiet-ve.html'),
      },
    },
  },
})
