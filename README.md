# Fadhil Hadira — Cinematic Portfolio (Revamp 3)

## ✅ Revisi terbaru (Revamp 3)
- **Fully responsive** — semua section (navbar, hero, about, tentang, boxing,
  movies, project, music player, contact, footer) dirapikan lagi untuk layar
  HP kecil (≤480px), termasuk padding, ukuran tombol/tap-target, dan area
  scroll horizontal di section Movies yang sekarang bisa di-swipe langsung
  dengan jari (sebelumnya cuma bisa di-drag pakai mouse di desktop).
- **Video boxing tidak lagi auto-play.** Setiap slide video sekarang punya
  tombol play besar di tengah — video baru mulai jalan kalau tombol itu
  diklik, dan bisa dihentikan kapan saja lewat tombol yang sama atau
  kontrol video bawaan browser yang muncul begitu video mulai diputar.
  Saat carousel bergeser ke slide lain, video otomatis di-pause supaya
  tidak ada suara yang nyangkut di background.
- **Music player dirapikan** — ikon tombol putar (▶) sekarang berubah jadi
  ikon jeda (❚❚) saat lagu sedang main, dan bar equalizer di sebelah kanan
  cuma "menari" saat lagu benar-benar diputar (sebelumnya tetap bergerak
  meski lagu di-pause). Klik judul lagu yang sedang main untuk
  menghentikannya kapan saja.


## Cara menjalankan
Buka lewat local server (jangan double-click file langsung, karena browser
memblokir fetch/video lokal kalau dibuka lewat `file://`):
```
npx serve .
```
atau
```
python3 -m http.server 8080
```
lalu buka `http://localhost:8080`.

## Struktur
```
index.html
css/style.css
js/script.js
assets/boxing/frame-0001.jpg ... frame-0240.jpg   ← 240 frame asli hero
assets/videos/boxing-1.mp4   ← rasio 9:16 (vertikal)
assets/videos/boxing-2.mp4   ← rasio 16:9 (horizontal)
assets/images/boxing-1.jpg   ← rasio 9:16 (vertikal)
assets/images/boxing-2.jpg   ← rasio 16:9 (horizontal)
assets/images/project-1.jpg, project-2.jpg        ← 2 screenshot project
assets/images/movie-1.jpg ... movie-4.jpg          ← poster 4 film favorit (2:3)
assets/images/profile.png                          ← foto profil badge About (3:4)
assets/music/the-cure.mp3, drop-dead.mp3, style.mp3, the-one-that-got-away.mp3
```
Setiap folder assets ada file `BACA-SAYA.txt` berisi nama file persis yang
dibutuhkan. Semua elemen otomatis muncul begitu file diletakkan di path yang
benar — tidak perlu ubah kode apa pun (kecuali kalau memang mau ganti judul
teks/link, itu dijelaskan juga di BACA-SAYA.txt masing-masing folder).

## ✅ Revisi di rombakan ini

**1. Section Boxing dirombak ulang — rasio media dibuat campuran & rapi**
- Sebelumnya semua slide dipaksa masuk ke kotak portrait yang sama meski
  labelnya "FOTO · 16:9" — jadi kelihatan pecah/nggak pas.
- Sekarang tiap slide otomatis mengikuti rasio aslinya lewat CSS `aspect-ratio`:
  - `boxing-1.mp4` → video **9:16** (vertikal)
  - `boxing-2.mp4` → video **16:9** (horizontal)
  - `boxing-1.jpg` → foto **9:16** (vertikal)
  - `boxing-2.jpg` → foto **16:9** (horizontal)
- Carousel showcase-nya dibangun ulang: slide tengah selalu full-size &
  terang (featured) mengikuti bentuk aslinya (tinggi untuk portrait, lebar
  untuk landscape), dua slide di samping tetap ada sebagai preview yang
  meredup — jadi tetap rapi meskipun rasio-nya beda-beda. Auto-geser tiap
  ±4.2 detik, bisa juga diklik/panah/swipe. Video hanya play saat aktif di
  tengah, otomatis pause saat digeser.
- Ditambah label kecil (mis. "SPARRING — VERTICAL", "TRAINING SESSION") di
  bawah slide aktif supaya tiap potongan konten terasa lebih niat, bukan
  cuma kotak kosong.

**2. CSS & JS dibangun ulang lengkap**
File `css/style.css` dan `js/script.js` sebelumnya tidak ikut ter-upload,
jadi keduanya dibangun ulang dari nol mengikuti struktur `index.html` yang
ada — tetap dengan tema ember/oranye gelap yang sama (loading screen,
custom cursor, navbar melayang, smooth scroll via Lenis + GSAP
ScrollTrigger, reveal-on-scroll halus, hero 240-frame scroll animation
dengan fallback gradient, wave divider + marquee, badge About dengan tilt
3D, movie track draggable, music player dengan progress bar & vinyl
berputar).

**3. Foto profil About**
Tetap statis dari `assets/images/profile.png`, tidak ada tombol/hint upload
yang bisa diklik pengunjung di halaman publik.

## Yang masih perlu kamu lengkapi
Taruh file di path yang tertulis di atas → otomatis tampil, tidak perlu ubah
kode. Detail nama file ada di `BACA-SAYA.txt` pada tiap folder assets:
- 240 frame hero asli di `assets/boxing/`
- 2 video boxing (1× rasio 9:16, 1× rasio 16:9) di `assets/videos/`
- 2 foto boxing (1× rasio 9:16, 1× rasio 16:9) di `assets/images/`
- 4 poster film di `assets/images/`
- 2 screenshot project di `assets/images/` — jangan lupa ganti `href="#"`
  di dua baris `<a class="project-row">` pada `index.html`
- Foto profil (`profile.png`) di `assets/images/`
- 4 file MP3 lagu favorit di `assets/music/`

## Catatan performa
Hero pakai `<canvas>` + 240 frame JPG asli, di-load progresif saat halaman
dibuka, berubah sesuai scroll lewat GSAP ScrollTrigger (pin + scrub), bukan
`setInterval`. Kalau frame belum ada, hero otomatis pakai fallback gradient
supaya tidak blank.
