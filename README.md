# Katalog Kegiatan Kampus

**Nama:** rabiul hafiz
**NIM:** 2502026

## Deskripsi

Website katalog kegiatan kampus yang menampilkan daftar acara (akademik, olahraga, seni & budaya, organisasi/BEM) secara dinamis dari data JSON. Pengguna dapat mencari, memfilter, dan mendaftar langsung ke kegiatan yang diminati melalui formulir pendaftaran dengan validasi.

## Fitur

- **Tampilan data dinamis** — daftar kegiatan diambil dari `kegiatan.json` menggunakan `fetch()` dan dirender sebagai card.
- **Pencarian** — mencari kegiatan berdasarkan nama dan deskripsi secara real-time (event `input`).
- **Filter** — menyaring kegiatan berdasarkan kategori dan status (event `change`).
- **Form pendaftaran** dengan validasi:
  - Nama lengkap
  - NIM (angka)
  - Email kampus
  - Nomor HP/WA
  - Pilihan kegiatan (terisi otomatis dari data JSON)
  - Persetujuan (checkbox)
- **Pesan sukses** ditampilkan setelah form valid, dengan opsi "Daftar Kegiatan Lain" untuk reset.
- **Desain responsif** menggunakan Bootstrap 5, termasuk navbar, hero section, card kegiatan, dan footer.

## Struktur File

```
├── index.html      # Struktur halaman: nav, header, filter, daftar kegiatan, form, footer
├── style.css       # Styling layout, card, form, tombol, dan responsivitas
├── script.js       # Logika fetch data, pencarian, filter, dan validasi form
└── kegiatan.json   # Data kegiatan (id, nama, kategori, tanggal, lokasi, status, deskripsi)
```

## Cara Menjalankan

Karena menggunakan `fetch()` untuk membaca file JSON, project ini perlu dijalankan melalui local server (tidak bisa dibuka langsung sebagai file `.html`).

```bash
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080` di browser.
