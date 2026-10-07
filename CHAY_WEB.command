#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "[LỖI] Chưa cài Node.js 18+."
  read -r
  exit 1
fi
if [ ! -d "node_modules/json-server-auth" ]; then
  echo "Đang cài/cập nhật thư viện, bao gồm json-server-auth..."
  npm install || exit 1
fi
npm run dev
