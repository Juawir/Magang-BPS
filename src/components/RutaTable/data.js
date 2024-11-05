const columns = [
  { name: "Kode", uid: "kode" },
  { name: "Nama Pemilik/Penanggungjawab", uid: "nama_pemilik_penanggungjawab" },
  { name: "Identitas SLS", uid: "rt_rw_dusun" },
  { name: "Aksi", uid: "aksi" },
];

const jenis_kelamin = [
  { key: "laki-laki", label: "Laki-laki" },
  { key: "perempuan", label: "Perempuan" },
];

const pendidikan_terakhir = [
  { key: "sd/sederajat-kebawah", label: "SD/Sederajat Kebawah" },
  { key: "smp/sederajat", label: "SMP/Sederajat" },
  { key: "sma/sederajat", label: "SMA/Sederajat" },
  { key: "diploma/s1-keatas", label: "Diploma/S1 Keatas" },
];

const kategori_usaha = [
  { key: "kbli_a", label: "A. Pertanian, Kehutanan, dan Perikanan" },
  { key: "kbli_b", label: "B. Pertambangan dan Penggalian" },
  { key: "kbli_c", label: "C. Industri Pengolahan" },
  {
    key: "kbli_d",
    label: "D. Pengadaan Listrik, Gas, Uap/Air Panas dan Udara Dingin",
  },
  {
    key: "kbli_e",
    label:
      "E. Treatment Air, Treatment Air Limbah, Treatment dan Pemulihan Material Sampah, dan Aktivitas Remediasi",
  },
  { key: "kbli_f", label: "F. Konstruksi" },
  {
    key: "kbli_g",
    label: "G. Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor",
  },
  { key: "kbli_h", label: "H. Pengangkutan dan Pergudangan" },
  {
    key: "kbli_i",
    label: "I. Penyediaan Akomodasi dan Penyediaan Makan Minum",
  },
  { key: "kbli_j", label: "J. Informasi dan Komunikasi" },
  { key: "kbli_k", label: "K. Aktifitas Keuangan dan Asuransi" },
  { key: "kbli_l", label: "L. Real Estat" },
  { key: "kbli_m", label: "M. Aktivitas Profesional, Ilmiah, dan Teknis" },
  {
    key: "kbli_n",
    label:
      "N. Aktivitas Penyewaan dan Sewa Guna Usaha Tanpa Hak Opsi, Ketenagakerjaan, Agen Perjalanan dan Penunjang Usaha Lainnya",
  },
  {
    key: "kbli_o",
    label: "O. Administrasi Pemerintahan, Pertahanan Dan Jaminan Sosial Wajib",
  },
  { key: "kbli_p", label: "P. Pendidikan" },
  {
    key: "kbli_q",
    label: "Q. Aktivitas Kesehatan Manusia dan Aktivitas Sosial",
  },
  { key: "kbli_r", label: "R. Kesenian, Hiburan, dan Rekreasi" },
  { key: "kbli_s", label: "S. Jasa Lainnya" },
  {
    key: "kbli_t",
    label:
      "T. Aktivitas Rumah Tangga Sebagai Pemberi Kerja; Aktivitas Yang Menghasilkan Barang Dan Jasa Oleh Rumah Tangga yang Digunakan untuk Memenuhi Kebutuhan Sendiri",
  },
  {
    key: "kbli_u",
    label:
      "U. Aktivitas Badan Internasional dan Badan Ekstra Internasional Lainnya",
  },
];

const bentuk_badan_usaha = [
  { key: "pt/persero/sejenisnya", label: "PT/Persero/Sejenisnya" },
  { key: "ijin-desa/ijin-lainnya", label: "Ijin Desa/Ijin Lainnya" },
  { key: "tidak-berbadan-hukum", label: "Tidak Berbadan Hukum" },
];

const lokasi_tempat_usaha = [
  { key: "bangunan-khusus-usaha", label: "Bangunan Khusus Usaha" },
  { key: "bangunan-campuran", label: "Bangunan Campuran" },
  { key: "kaki-lima", label: "Kaki Lima" },
  { key: "keliling", label: "Keliling" },
  {
    key: "didalam-bangunan-tempat-tinggal/online",
    label: "Di Dalam Bangunan Tempat Tinggal atau Online",
  },
];

const skala_usaha = [
  { key: "usaha-mikro", label: "Usaha Mikro" },
  { key: "usaha-kecil", label: "Usaha Kecil" },
  { key: "usaha-menengah", label: "Usaha Menengah" },
];

export {
  columns,
  jenis_kelamin,
  pendidikan_terakhir,
  kategori_usaha,
  bentuk_badan_usaha,
  lokasi_tempat_usaha,
  skala_usaha,
};
