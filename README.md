
### **Frontend - `README.md`**

# Crypto Wallet Tracker Frontend

Aplikasi frontend untuk Crypto Wallet Tracker menggunakan React. Aplikasi ini memungkinkan pengguna untuk membuat, mengelola wallet crypto, dan berkomunikasi melalui chat real-time.

## Fitur

- Login dengan username (JWT generation).
- Menampilkan dan mengelola wallet crypto.
- Sistem chat real-time menggunakan WebSocket.
- Desain responsif untuk berbagai perangkat.

## Teknologi yang Digunakan

- React.js
- Axios
- WebSocket
- Tailwind CSS

## Cara Install dan Menjalankan Aplikasi

### 1. Clone Repository

git clone https://github.com/your-repo/frontend.git
cd frontend


### 2. Install Dependencies
Pastikan Node.js sudah terinstall, lalu jalankan:
npm install


### 3. Menjalankan Aplikasi
Jalankan perintah berikut:

npm start

Aplikasi akan berjalan di `http://localhost:3000`.

### 4. Konfigurasi Environment
Buat file `.env` di root project dengan isi berikut:
REACT_APP_BACKEND_URL=https://backend-production-4e20.up.railway.app


### 5. Build untuk Produksi
Untuk membuat versi produksi, jalankan:
npm run build
```
