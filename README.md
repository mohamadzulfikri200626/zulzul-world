# ZulZul World

Website personal sekaligus portofolio milik Mohamad Zul Fikri (ZulZul), mahasiswa D3 Sistem Informasi UPN Veteran Jakarta. Tempat aku membagikan website, game, eksperimen, dan project kuliah yang aku buat selama belajar coding.

Dibangun dengan HTML, CSS, dan JavaScript murni, tanpa framework dan tanpa build step.

## Fitur

- Tema gelap/terang: bisa diganti lewat tombol di header, pilihan tersimpan di browser.
- Music player: musik latar dengan tombol play/pause dan ganti lagu (3 lagu di playlist).
- Background interaktif: partikel di canvas yang bereaksi terhadap gerakan mouse.
- Cursor glow dan kursor kustom di perangkat dengan mouse.
- Surprise Me 🎲: melompat ke salah satu proyek secara acak dan menyorotnya.
- Reaction buttons: cool, awesome, interesting, dan keep going, dengan hitungan tersimpan di browser.
- Mini game "Catch the Bitcoin": tangkap koin yang jatuh dengan klik/tap. Ada 5 nyawa, skor tertinggi tersimpan di browser, efek suara saat koin ditangkap, dan backsound selama bermain.
- Halaman kategori: websites, games, experiments, dan projects.
- Responsif: tampilan menyesuaikan layar HP dan desktop.

## Struktur File

```
.
├── index.html         # Halaman utama (hero, what's inside, about me, mini game)
├── websites.html      # Kategori: websites
├── games.html         # Kategori: games
├── experiments.html   # Kategori: experiments
├── projects.html      # Kategori: projects (tugas dan project kuliah)
├── style.css          # Seluruh styling
├── script.js          # Seluruh logika (tema, musik, background, game, dll.)
├── zulpp.png          # Foto profil di hero
└── (file musik).mp3  # File musik (lihat bagian Musik)
```

## Cara Menjalankan

Tidak perlu instalasi. Cukup buka `index.html` di browser.

Untuk hasil terbaik (terutama musik), jalankan lewat server lokal, misalnya:

```bash
# dengan Python
python3 -m http.server 8000

# atau dengan Node
npx serve
```

Lalu buka `http://localhost:8000`.

## Kustomisasi

### Menambah proyek baru

1. Salin salah satu blok `<article class="project-card">` di halaman kategori yang sesuai, lalu ubah judul, deskripsi, dan link-nya. Pastikan `id`-nya unik, misalnya `proj-nama-proyek`.
2. Daftarkan proyek itu di array `ALL_PROJECTS` di `script.js` supaya ikut muncul di tombol Surprise Me:

```js
{ page: "websites.html", id: "proj-nama-proyek" }
```

### Musik

Daftar lagu diatur di array `playlist` di `script.js`. File musik berada di `assets/Music/` dan menggunakan nama file yang aman untuk URL. Kalau file musik tidak ada, tombol musik tidak akan mengeluarkan suara.

### Suara mini game

Efek suara koin dan backsound game dibuat langsung dengan Web Audio API di dalam `initCoinGame()` di `script.js`, jadi tidak butuh file audio tambahan.

## Data yang Disimpan di Browser

Semua data disimpan di `localStorage` pengunjung sendiri, tidak ada server atau database:

| Key | Isi |
| --- | --- |
| `zw-theme` | Pilihan tema (gelap/terang) |
| `zw-track-index` | Lagu terakhir yang dipilih |
| `zw-music` | Status musik (on/off) |
| `zw-reactions` | Jumlah reaksi per tombol |
| `zw-coin-best` | Skor tertinggi mini game |

Karena itu, jumlah reaksi hanya terlihat oleh pengunjung yang bersangkutan dan tidak dijumlahkan antar pengunjung.

## Teknologi

- HTML5, CSS3, JavaScript (ES6+)
- Canvas API (background partikel dan mini game)
- Web Audio API (suara mini game)
- Google Fonts: Space Grotesk, Inter, JetBrains Mono

## Kontak

- Instagram: [instagram.com](https://www.instagram.com/zulzulxixixi?stkn=dDh2aGp5YjBlZDF5)
- TikTok: [tiktok.com](https://www.tiktok.com/@zulzulajahhh?_r=1&_t=ZS-9A9TOaQGdcO)
- WhatsApp: [wa.me/6282297662826](https://wa.me/6282297662826)

© 2026 Mohamad Zul Fikri
