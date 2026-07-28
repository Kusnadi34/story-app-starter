# 📖 Story App

[![Deploy to Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-blue?logo=firebase)](https://story-app-starter-5d1a2.web.app)
[![Deploy to GitHub Pages](https://img.shields.io/badge/GitHub-Pages-black?logo=github)](https://kusnadi34.github.io/story-app-starter/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

**Story App** adalah aplikasi web untuk berbagi cerita (story) yang dibangun dengan arsitektur frontend modern. Proyek ini menggunakan **Webpack** sebagai module bundler, **Bootstrap 5** untuk UI yang responsif, dan **Lit** untuk Web Components yang ringan dan reusable. Aplikasi ini terintegrasi dengan **Story API** untuk menyimpan dan mengambil data cerita secara dinamis.

> 🚀 **Live Demo**:
> - [Firebase Hosting](https://story-app-starter-5d1a2.web.app)
> - [GitHub Pages](https://kusnadi34.github.io/story-app-starter/)

---

## ✨ Fitur Utama

### ✅ Kriteria Wajib
- 📱 **Fully Responsive** – Tampilan optimal di desktop, tablet, dan smartphone (termasuk Android 5.0+).
- 🔐 **Autentikasi** – Login, Register, dan Logout dengan penyimpanan token di localStorage.
- 📡 **Story API Integration** – Mengambil dan menambah data cerita secara dinamis dari [Story API](https://story-api.dicoding.dev/v1).
- ⏳ **Loading Indicator** – Menampilkan spinner Bootstrap saat proses request berlangsung.
- 🌐 **HTTP Client dengan Axios** – Menggunakan Axios instance dengan interceptor untuk Authorization header.

### 🎯 Fitur Tambahan (Saran)
- 🌍 **Multi Bahasa** – Dukungan EN/ID menggunakan `@lit/localize`.
- 👁️ **Toggle Password** – Fitur lihat/sembunyikan password pada form login dan register.
- ✅ **Validasi Form** – Password minimal 8 karakter dengan validasi client-side.
- 📝 **Feedback Error** – Menampilkan pesan error yang jelas saat login/register gagal.
- 🧹 **ESLint** – Kode dianalisis dengan ESLint (Airbnb style) untuk konsistensi.

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Bundler** | [Webpack](https://webpack.js.org/) 5 |
| **Bahasa** | JavaScript (ES6+) dengan [Babel](https://babeljs.io/) |
| **CSS Preprocessor** | [Sass/SCSS](https://sass-lang.com/) (7-1 Pattern) |
| **UI Framework** | [Bootstrap](https://getbootstrap.com/) 5 + [Bootstrap Icons](https://icons.getbootstrap.com/) |
| **Web Components** | [Lit](https://lit.dev/) 2 |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Hosting** | [Firebase Hosting](https://firebase.google.com/products/hosting) + [GitHub Pages](https://pages.github.com/) |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) |

---

## 📂 Struktur Proyek

story-app/
├── .github/
│ └── workflows/
│ ├── firebase-hosting-merge.yml # Deploy ke Firebase (merge ke main)
│ └── firebase-hosting-pull-request.yml # Preview URL untuk PR
├── src/
│ ├── data/
│ │ └── profile.json # Data profil (fallback)
│ ├── js/
│ │ ├── api/
│ │ │ └── axiosInstance.js # Axios instance dengan interceptor
│ │ ├── components/ # Web Components (Lit)
│ │ │ ├── app-header.js
│ │ │ ├── app-footer.js
│ │ │ ├── story-list.js
│ │ │ ├── add-story-form.js
│ │ │ ├── profile-card.js
│ │ │ ├── login-form.js
│ │ │ └── register-form.js
│ │ ├── services/
│ │ │ ├── authService.js # Login, Register, Logout
│ │ │ └── storyService.js # GET/POST stories
│ │ └── index.js # Entry point & routing
│ ├── locales/
│ │ ├── en.json # Terjemahan Inggris
│ │ └── id.json # Terjemahan Indonesia
│ ├── public/
│ │ └── images/
│ ├── sass/ # SCSS 7-1 Pattern
│ │ ├── abstracts/ # Variabel, Mixins
│ │ ├── base/ # Reset CSS
│ │ ├── components/ # Style Komponen
│ │ ├── layout/ # Grid, Footer
│ │ ├── pages/ # Style per halaman
│ │ └── main.scss # Entry point SCSS
│ └── views/
│ └── index.html # Template HTML
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── package.json
├── firebase.json
└── README.md

text

---

## 🚀 Cara Menjalankan di Lokal

### Prasyarat
- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Instalasi & Development Server

1. **Clone repository**:
   ```bash
   git clone https://github.com/Kusnadi34/story-app-starter.git
   cd story-app-starter
Install dependencies:

bash
npm install
Jalankan mode development (hot reload):

bash
npm start
Buka http://localhost:8080 di browser.

Build untuk production:

bash
npm run build
Hasil build tersimpan di folder /dist.

🌐 Deployment
Firebase Hosting (Production)
bash
npm run build
firebase deploy --only hosting
GitHub Pages
bash
npm run build
# Push ke branch main, GitHub Actions akan otomatis deploy
Preview URL untuk Pull Request
Setiap Pull Request akan otomatis mendapat preview URL dari Firebase Hosting. Komentar akan ditambahkan di PR dengan link preview.

🔗 API Reference
Aplikasi ini menggunakan Story API dari Dicoding:

Endpoint	Method	Deskripsi
/register	POST	Registrasi user baru
/login	POST	Login user
/stories	GET	Mendapatkan semua cerita (memerlukan token)
/stories	POST	Menambahkan cerita baru (memerlukan token)
📝 Lisensi
Proyek ini dilisensikan di bawah MIT License – bebas digunakan, dimodifikasi, dan didistribusikan.

🙏 Kontribusi
Karena ini adalah proyek submission/tugas, pull request tidak diperlukan saat ini. Namun, jika Anda menemukan bug atau memiliki saran, silakan buka Issue di repository ini.

Dibuat dengan ❤️ oleh Kusnadi34
