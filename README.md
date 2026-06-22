# RemindersOnDesktop

- Aplikasi desktop sederhana berbasis Electron yang menampilkan widget pengingat deadline "Urgent Deadlines".
- Tampilan transparan, frameless, dan dirancang seperti widget yang tetap tersimpan di desktop.

Fitur utama
- Menampilkan daftar deadline dengan hitungan mundur (countdown) real-time.
- Menambahkan dan menghapus deadline melalui UI.
- Data disimpan di `localStorage` sehingga persisten pada profil aplikasi.
- Auto-start pada login (diatur di `main.js`).

Struktur file dan penjelasan
- `index.html` : Markup utama widget. Berisi struktur popup, tombol tambah, dan area dimana item deadline di-inject oleh JavaScript.
- `script.js` : Logika frontend (renderer). Menangani penambahan, penghapusan, penyimpanan (`localStorage`), dan perhitungan waktu tersisa untuk setiap deadline. Render dieksekusi setiap detik dengan `setInterval`.
- `style.css` : Styling untuk widget — glassmorphism, badge "URGENT", animasi, scrollbar, dan desain typografi besar.
- `main.js` : Proses utama Electron. Membuat jendela frameless, transparan, dengan ukuran yang disesuaikan (420×650). Mengatur auto-start pada login (`app.setLoginItemSettings`) dan opsi agar aplikasi tidak muncul di taskbar (`skipTaskbar: true`).
- `package.json` : Konfigurasi package. Script `start` menjalankan `electron .`. Dependensi dev: Electron ^42 (versi lama — pertimbangkan pembaruan jika perlu).

Cara menjalankan (pengembangan)
1. Pastikan Node.js & npm terpasang.
2. Di direktori proyek jalankan:

```bash
cd /Users/rio/Documents/Annisa/Project/RemindersOnDesktop
npm install
npm start
```

Catatan teknis & rekomendasi
- Data menggunakan `localStorage` pada renderer. Ini berarti data tersimpan lokal pada profil aplikasi, bukan pada server.
- `main.js` mengaktifkan `nodeIntegration: true` dan `contextIsolation: false` untuk mempermudah akses API Node di renderer. Ini memudahkan pengembangan lokal, tetapi memiliki implikasi keamanan jika Anda memuat konten eksternal. Untuk produksi, pertimbangkan menonaktifkan `nodeIntegration` dan mengaktifkan `contextIsolation` serta menggunakan `preload` script dengan IPC yang terkontrol.
- Electron yang digunakan di `package.json` adalah versi lama. Jika hendak mendistribusikan ke pengguna, pertimbangkan upgrade Electron, dan gunakan bundler/packager seperti `electron-builder` atau `electron-forge` untuk membuat installer.
- Window saat ini di-set `transparent: true` dan `frame: false` sehingga tampil seperti widget — perilaku dapat berbeda antar platform (macOS/Windows/Linux).

Ringkasan cepat pengembangan
- Untuk menambah fitur: simpan ke file lokal (mis. JSON) atau gunakan database kecil (SQLite) jika butuh sinkronisasi/riwayat.
- Untuk packaging/distribusi: tambahkan dependensi dan konfigurasi `electron-builder` lalu jalankan build.
