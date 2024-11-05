const columns = [
  { name: "Kode", uid: "kode" },
  { name: "Nama Kepala Keluarga", uid: "nama_kepala_keluarga" },
  { name: "Identitas SLS", uid: "rt_rw_dusun" },
  { name: "Aksi", uid: "aksi" },
];

const jenisKelaminOptions = [
  { key: "laki-laki", label: "Laki-laki" },
  { key: "perempuan", label: "Perempuan" },
];

const pendidikanTerakhirOptions = [
  { key: "sd/sederajat-kebawah", label: "SD/Sederajat Kebawah" },
  { key: "smp/sederajat", label: "SMP/Sederajat" },
  { key: "sma/sederajat", label: "SMA/Sederajat" },
  { key: "diploma/s1-keatas", label: "Diploma/S1 Keatas" },
];

const namaTanamanOptions = [
  { key: "kangkung", label: "Kangkung" },
  { key: "bayam", label: "Bayam" },
  { key: "sawi", label: "Sawi" },
];

const penyebabLuasPanenKurangOptions = [
  { key: "kekeringan/kekurangan_air", label: "Kekeringan/Kekurangan Air" },
  { key: "hama/penyakit", label: "Hama/Penyakit" },
  { key: "panen_sebagian", label: "Panen Sebagian" },
  { key: "lainnya", label: "Lainnya" },
];

const jenisPupukOptions = [
  { key: "urea", label: "Urea" },
  { key: "npk", label: "NPK" },
  { key: "non_organik_lainnya", label: "Non Organik Lainnya" },
  { key: "organik", label: "Organik" },
  { key: "tidak_ada", label: "Tidak Ada" },
];

const pemanfaatanProdukOptions = [
  { key: "dijual_sendiri", label: "Dijual Sendiri" },
  { key: "dijual_ke_tengkulak", label: "Dijual ke Tengkulak" },
];

const isPenyuluhanOptions = [
  { key: "true", label: "Ya" },
  { key: "false", label: "Tidak" },
];

export {
  columns,
  jenisKelaminOptions,
  pendidikanTerakhirOptions,
  namaTanamanOptions,
  penyebabLuasPanenKurangOptions,
  jenisPupukOptions,
  pemanfaatanProdukOptions,
  isPenyuluhanOptions,
};
