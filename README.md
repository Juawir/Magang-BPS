# Frontend Website Desa Cantik Kabupaten Sidoarjo

Repositori ini merupakan proyek frontend dari website Desa Cantik Kabupaten Sidoarjo.

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Instalasi dan Penggunaan](#instalasi-dan-penggunaan)
- [Struktur Direktori](#struktur-direktori)

## Tentang Proyek

Website ini dibuat untuk mendukung pelaksanaan program Desa Cinta Statistik oleh BPS Kabupaten Sidoarjo untuk seluruh desa/kelurahan/setingkat di Kabupaten Sidoarjo. Dalam proyek ini, terdapat tiga desa percontohan yang sudah dikembangkan khususnya untuk fitur peta tematik dan entry datanya, yaitu Desa Simoangin-angin, Simoketawang, dan Grogol.

## Fitur Utama

Beberapa fitur utama yang dimiliki proyek ini:

- Kumpulan informasi: menyajikan kumpulan informasi penting dan bermanfaat mengenai pelaksanaan program Desa Cantik (Beranda, Buletin, dan Tentang Kami).
- Peta Tematik Interaktif: menyajikan visualisasi data terkait dengan topik tertentu menggunakan peta tematik (Desa Simoangin-angin: UMKM, Desa Simoketawang: Pohon Kelengkeng, Desa Grogol: Sayuran).
- Entry Data: menyediakan fungsionalitas kepada operator desa untuk menginput data dengan topik tertentu baik data SLS (GeoJSON) maupun data individu.
- Halaman Admin: menyediakan fungsionalitas kepada admin web desa cantik untuk melakukan update atau manajemen konten yang ditampilkan dalam website.

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi berikut:

- [React JS](https://reactjs.org/): Library JavaScript untuk membangun antarmuka pengguna. React memungkinkan pembuatan komponen yang dapat digunakan kembali dan manajemen state yang efisien.
- [Vite JS](https://vitejs.dev/): Build tool modern untuk pengembangan front-end, yang memberikan pengalaman pengembangan yang sangat cepat dengan hot-reloading dan optimalisasi build.
- [Leaflet JS](https://leafletjs.com/): Library open-source untuk memetakan data interaktif pada web. Leaflet terkenal dengan performa tinggi dan ukuran yang ringan untuk visualisasi peta.
- [Chart JS](https://www.chartjs.org/): Library JavaScript yang digunakan untuk membuat grafik dan visualisasi data berbasis canvas.
- [Axios](https://axios-http.com/): Library berbasis HTTP Client yang digunakan untuk melakukan permintaan HTTP dari browser atau Node.js. Sering digunakan untuk mengambil data dari API.
- [Next UI](https://nextui.org/): Library UI modern yang fokus pada pengembangan aplikasi React dengan komponen-komponen yang mudah digunakan.
- [Ant Design](https://ant.design/): Framework UI berbasis React yang menyediakan berbagai komponen desain yang berguna untuk membangun antarmuka pengguna dengan cepat.
- [Material UI](https://mui.com/): Library UI React yang populer, menawarkan komponen-komponen Material Design untuk membuat antarmuka pengguna yang responsif dan indah.
- [Framer Motion](https://www.framer.com/motion/): Library animasi untuk React yang mudah digunakan dan memberikan animasi yang halus dengan API yang fleksibel.

## Instalasi dan Penggunaan

### Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) versi 14.x atau lebih baru.
- [Git](https://git-scm.com/): Digunakan untuk meng-clone repository.
- [Vite](https://vitejs.dev/): Vite sudah diatur sebagai build tool di proyek ini, sehingga tidak perlu instalasi terpisah.

### Instalasi

1. Clone repository ini:
   ```bash
   git clone https://github.com/falanarh/desa-cantik-sda.git
   ```
2. Masuk ke Direktori Proyek:
   ```bash
   cd desa-cantik-sda
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan Proyek:
   ```
   a. Untuk pengembangan lokal:
   ```
   ```bash
   npm run dev
   ```
   ```
   b. Untuk build produksi:
   ```
   ```bash
   npm run build
   ```

## Struktur Direktori

```
DESA-CANTIK-SDA/
│
├── dist/                 # Folder build untuk file hasil build produksi
├── node_modules/         # Folder berisi dependensi proyek
├── public/               # Folder untuk file publik (misalnya favicon, gambar statis, dll.)
├── src/                  # Folder utama kode sumber
│   ├── assets/           # Folder untuk aset seperti gambar, ikon, dll.
│   ├── components/       # Folder untuk komponen React
│   ├── hooks/            # Folder untuk custom hooks React
│   ├── pages/            # Folder untuk halaman React
│   └── utils/            # Folder untuk fungsi utilitas
├── App.jsx               # Komponen utama aplikasi React
├── index.css             # File CSS utama
├── main.jsx              # Entry point aplikasi React
├── .eslintrc.cjs         # Konfigurasi ESLint
├── .gitignore            # File untuk menentukan file/folder yang diabaikan oleh Git
├── .htaccess             # File konfigurasi untuk server Apache
├── index.html            # File HTML utama
├── package-lock.json     # File penguncian dependensi
├── package.json          # File yang berisi metadata proyek dan daftar dependensi
├── postcss.config.js     # Konfigurasi untuk PostCSS
├── README.md             # Dokumentasi proyek
├── tailwind.config.js    # Konfigurasi untuk Tailwind CSS
├── vercel.json           # Konfigurasi untuk Vercel (platform hosting)
└── vite.config.js        # Konfigurasi untuk Vite (build tool)
```

