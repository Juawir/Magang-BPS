const columns = [
  { name: "Kode", uid: "kode" },
  { name: "Nama Kepala Keluarga", uid: "nama_kepala_keluarga" },
  { name: "Identitas SLS", uid: "rt_rw_dusun" },
  { name: "Aksi", uid: "aksi" },
];


const jenis_klengkeng = [
  { key: "new_crystal", label: "New Crystal" },
  { key: "pingpong", label: "Pingpong" },
  { key: "diamond_river", label: "Diamond River" },
  { key: "merah", label: "Merah" },
];

const jenis_pupuk = [
  { key: "organik", label: "Pupuk Organik" },
  { key: "anorganik", label: "Pupuk Anorganik" },
  { key: "tidak_ada_pupuk", label: "Tidak menggunakan pupuk" },
];

const pemanfaatan_produk = [
  { key: "kopi_biji_klengkeng", label: "Kopi biji klengkeng" },
  { key: "kerajinan_tangan", label: "Kerajinan tangan dari daun" },
  { key: "batik_ecoprint", label: "Batik ecoprint" },
  { key: "minuman", label: "Minuman klengkeng" },
  { key: "makanan", label: "Makanan klengkeng" },
  { key: "tidak_dimanfaatkan", label: "Tidak dimanfaatkan" },
];

export {
  columns,
  jenis_klengkeng,
  jenis_pupuk,
  pemanfaatan_produk,
};
