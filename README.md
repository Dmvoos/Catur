# ♟️ GrandChess AI — Game Catur Web Modern

Aplikasi game catur berbasis web (**HTML5, CSS3, Vanilla JavaScript**) tanpa ketergantungan library eksternal, dilengkapi AI Cerdas (**Minimax + Alpha-Beta Pruning + Piece-Square Tables**) dan siap di-hosting gratis di **GitHub Pages**.

## ✨ Fitur Utama
- 🤖 **4 Level Lawan AI**:
  - **Mudah (~600 ELO)**: Cocok untuk pemula & belajar dasar langkah.
  - **Sedang (~1200 ELO)**: Bermain taktis dengan evaluasi posisi.
  - **Sulit (~1600 ELO)**: Agresif dan tajam membaca kombinasi.
  - **Grandmaster (~2000 ELO)**: Kalkulasi kedalaman penuh dengan *Alpha-Beta Pruning* & *Move Ordering*.
- 👥 **Mode 2 Pemain Lokal**: Bermain berdua di satu layar perangkat.
- ♟️ **Aturan Catur Resmi Lengkap**:
  - *Castling* / Rokade Pendek (`O-O`) & Panjang (`O-O-O`)
  - *En Passant*
  - Promosi Pion (`Queen`, `Rook`, `Bishop`, `Knight`)
  - Deteksi *Check* (Skak), *Checkmate* (Skakmat), *Stalemate* (Pat), *Insufficient Material*, *50-Move Rule*, & *Threefold Repetition*.
- 💡 **Fitur Pendukung**:
  - **Saran AI (Hint)**: Menunjukkan rekomendasi langkah terbaik saat giliran Anda.
  - **Undo Langkah**, **Putar Papan (Flip)**, & **4 Tema Papan** (*Emerald Tournament, Kayu Jati, Ocean Slate, Midnight Neon*).
  - **Evaluation Bar Real-time**, **Jam Catur (Timer)**, **Notasi PGN**, dan **Efek Suara Web Audio Synthesizer**.

---

## 🚀 Cara Buka Langsung di Browser (Lokal)
Cukup klik 2x file [`index.html`](./index.html) untuk langsung bermain di browser tanpa perlu menginstal server apa pun.

---

## 🌐 Cara Hosting Gratis di GitHub Pages

1. Buat repository baru di GitHub (misalnya bernama `game-catur`).
2. Upload file `index.html`, `style.css`, `script.js`, dan `README.md` ke repository tersebut (atau push via Git):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GrandChess AI"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/game-catur.git
   git push -u origin main
   ```
3. Buka halaman repository Anda di GitHub -> klik tab **Settings** -> pilih menu **Pages** di sebelah kiri.
4. Pada bagian **Build and deployment** > **Branch**, pilih **`main`** dan folder **`/ (root)`**, lalu klik **Save**.
5. Tunggu sekitar 1 menit, dan game catur Anda akan aktif di:
   `https://USERNAME_ANDA.github.io/game-catur/`
