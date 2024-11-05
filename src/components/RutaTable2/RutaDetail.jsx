/* eslint-disable react/prop-types */
const getKbliLabel = (key, daftarKlasifikasi) => {
  const klasifikasi = daftarKlasifikasi.find((item) => item.key === key);
  return klasifikasi ? klasifikasi.label : 'Unknown';
};

const RutaDetail = ({ ruta, daftarKlasifikasi }) => {
  if (!ruta) return null;

  return (
    <div className="p-4">
      <table className="w-full overflow-hidden border border-gray-300 rounded-lg table-auto table-detail-ruta">
        <tbody className="text-[14px]">
          {[
            { label: 'Kode', value: ruta.kode },
            { label: 'Nama KRT', value: ruta.namaKrt },
            { label: 'RT', value: ruta.rt },
            { label: 'RW', value: ruta.rw },
            { label: 'Dusun', value: ruta.dusun },
            { label: 'Klasifikasi KBLI', value: getKbliLabel(ruta.klasifikasiKbli, daftarKlasifikasi) },
            { label: 'Jenis UMKM', value: ruta.jenisUmkm === 'tetap' ? 'Tetap' : ruta.jenisUmkm === 'nontetap' ? 'Non Tetap' : ruta.jenisUmkm },
            { label: 'Latitude', value: ruta.latitude },
            { label: 'Longitude', value: ruta.longitude },
          ].map(({ label, value }) => (
            <tr key={label} className="bg-white/70">
              <th className="p-3 font-semibold text-left border border-gray-300">{label}</th>
              <td className="p-3 text-right border border-gray-300">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RutaDetail;
