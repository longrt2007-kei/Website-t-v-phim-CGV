/**
 * Code 128-B Barcode Generator (SVG)
 * Tạo mã vạch chuẩn cho vé xem phim CGV để quét tại quầy hoặc máy Kiosk tự động.
 */

// Bảng mẫu mã hóa Code 128 (độ rộng 6 vạch: đen, trắng, đen, trắng, đen, trắng)
const CODE128_PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213', // 0-9
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132', // 10-19
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211', // 20-29
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313', // 30-39
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331', // 40-49
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111', // 50-59
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214', // 60-69
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111', // 70-79
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141', // 80-89
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141', // 90-99
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112' // 100-106 (106 is STOP pattern with 7 bars)
]

const START_CODE_B = 104
const STOP_CODE = 106

/**
 * Mã hóa chuỗi ký tự sang danh sách các mã giá trị Code 128
 */
function encodeStringToCode128(text) {
  const codes = [START_CODE_B]
  let checksum = START_CODE_B

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    // Code 128-B: giá trị từ ASCII 32 (' ') đến 127
    const val = charCode >= 32 && charCode <= 126 ? charCode - 32 : 0
    codes.push(val)
    checksum += val * (i + 1)
  }

  codes.push(checksum % 103)
  codes.push(STOP_CODE)
  return codes
}

/**
 * Tạo SVG Mã vạch Code 128
 * @param {string} text - Mã vé cần tạo barcode (ví dụ 'CGV12345678')
 * @param {object} options - Tùy chỉnh chiều cao, độ rộng, hiển thị chữ
 */
export function generateBarcodeSvg(text, options = {}) {
  const cleanText = String(text || '').trim().replace(/[^A-Za-z0-9_-]/g, '') || 'CGV00000000'
  const height = options.height || 75
  const barWidth = options.barWidth || 2
  const showText = options.showText !== false
  const quietZone = 20 // Vùng đệm trắng 2 đầu

  const codes = encodeStringToCode128(cleanText)
  let binaryString = ''

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i]
    const pattern = CODE128_PATTERNS[code] || CODE128_PATTERNS[0]
    let isBar = true
    for (let p = 0; p < pattern.length; p++) {
      const width = parseInt(pattern[p], 10)
      binaryString += (isBar ? '1' : '0').repeat(width)
      isBar = !isBar
    }
  }

  const totalBarcodeWidth = binaryString.length * barWidth
  const totalSvgWidth = totalBarcodeWidth + quietZone * 2
  const totalSvgHeight = height + (showText ? 26 : 8)

  let rects = ''
  let currentX = quietZone
  let inBar = false
  let barStart = 0

  for (let i = 0; i < binaryString.length; i++) {
    const bit = binaryString[i]
    if (bit === '1' && !inBar) {
      inBar = true
      barStart = currentX
    } else if (bit === '0' && inBar) {
      inBar = false
      const w = currentX - barStart
      rects += `<rect x="${barStart}" y="6" width="${w}" height="${height}" fill="#111" />`
    }
    currentX += barWidth
  }

  if (inBar) {
    const w = currentX - barStart
    rects += `<rect x="${barStart}" y="6" width="${w}" height="${height}" fill="#111" />`
  }

  const textElement = showText
    ? `<text x="${totalSvgWidth / 2}" y="${height + 22}" text-anchor="middle" font-family="'JetBrains Mono', Consolas, 'Courier New', monospace" font-size="14" font-weight="700" letter-spacing="3" fill="#111">${cleanText}</text>`
    : ''

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSvgWidth} ${totalSvgHeight}" width="100%" height="auto" class="cgv-barcode-svg" style="background:#fff;border-radius:8px;max-width:${totalSvgWidth}px;display:block;margin:0 auto">
      <rect width="100%" height="100%" fill="#ffffff" rx="8" />
      ${rects}
      ${textElement}
    </svg>
  `.trim()
}
