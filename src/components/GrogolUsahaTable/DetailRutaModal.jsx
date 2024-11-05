import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@nextui-org/react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  jenisKelaminOptions,
  jenisPupukOptions,
  namaTanamanOptions,
  pemanfaatanProdukOptions,
  pendidikanTerakhirOptions,
  penyebabLuasPanenKurangOptions,
} from "./data";
import { formatNumberWithSpace } from "../../utils/formatNumberWithSpace";

const getLabelByKey = (key, array) => {
  const item = array.find((obj) => obj.key === key);
  return item ? item.label : "Label not found";
};

const convertKeysToString = (keys, array) => {
  const labels = keys.map((key) => getLabelByKey(key, array));

  if (labels.length === 0) return "";

  if (labels.length === 1) return labels[0];

  const lastLabel = labels.pop();
  return `${labels.join(", ")}, ${lastLabel}`;
};

function formatNumber(num) {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Input must be a valid number");
  }

  // Convert number to string
  let numStr = num.toFixed(2); // Ensure that the number has 2 decimal places if it's a float

  // Split integer part and decimal part
  let [integerPart, decimalPart] = numStr.split(".");

  // Use regular expression to add thousands separators
  let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Combine integer part and decimal part (if any)
  return decimalPart
    ? `${formattedIntegerPart},${decimalPart}`
    : formattedIntegerPart;
}

const TableRow = ({ label, value }) => (
  <tr className="bg-white/70">
    <th className="p-3 font-semibold text-left border border-gray-300">
      {label}
    </th>
    <td className="p-3 text-right border border-gray-300">{value}</td>
  </tr>
);

const customMarker = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/8058/8058939.png", // Replace with your custom icon URL
  iconSize: [45, 45], // Size of the icon
  iconAnchor: [19, 45], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -45], // Point from which the popup should open relative to the iconAnchor
});

const RutaMap = ({ latitude, longitude }) => (
  <div className="my-4">
    <p className="text-[14px] font-semibold ml-3 my-2 text-pgreen">
      Titik lokasi Usaha
    </p>
    <MapContainer
      center={[latitude, longitude]}
      zoom={18}
      scrollWheelZoom={false}
      style={{ height: "200px", width: "100%" }}
      className="border-4 rounded-lg border-slate-300"
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles © Esri"
      />
      <Marker position={[latitude, longitude]} icon={customMarker} />
    </MapContainer>
  </div>
);

const RutaDetail = ({ ruta }) => {
  if (!ruta) return null;

  const rows = [
    { label: "Kode", value: ruta.kode },
    { label: "Identitas SLS", value: ruta.rt_rw_dusun },
    { label: "Nama Kepala Keluarga", value: ruta.nama_kepala_keluarga },
    { label: "Nama Pengusaha", value: ruta.nama_pengusaha },
    {
      label: "Jenis Kelamin",
      value: getLabelByKey(ruta.jenis_kelamin, jenisKelaminOptions),
    },
    { label: "Umur", value: ruta.umur },
    {
      label: "Pendidikan Terakhir",
      value: getLabelByKey(ruta.pendidikan_terakhir, pendidikanTerakhirOptions),
    },
    { label: "Latitude", value: ruta.latitude },
    { label: "Longitude", value: ruta.longitude },
  ];

  // Tambahkan detail tanaman dari daftar_tanaman ke dalam rows
  ruta.daftar_tanaman.forEach((tanaman, idx) => {
    rows.push({
      label: `Tanaman ${idx + 1}: ${getLabelByKey(
        tanaman.nama_tanaman,
        namaTanamanOptions
      )}`,
      value: (
        <div className="space-y-1">
          <div className="flex justify-between">
            <strong>Frekuensi Tanam (kali):</strong>
            <span>{tanaman.frekuensi_tanam}</span>
          </div>
          <div className="flex justify-between">
            <strong>Rata-rata Luas Tanam (m²):</strong>
            <span>{formatNumberWithSpace(tanaman.rata2_luas_tanam)}</span>
          </div>
          <div className="flex justify-between">
            <strong>Frekuensi Panen (kali):</strong>
            <span>{tanaman.frekuensi_panen}</span>
          </div>
          <div className="flex justify-between">
            <strong>Rata-rata Luas Panen (m²):</strong>
            <span>{formatNumberWithSpace(tanaman.rata2_luas_panen)}</span>
          </div>
          <div className="flex justify-between">
            <strong>Penyebab Luas Panen Kurang dari Luas Tanam:</strong>
            <span>
              {tanaman.penyebab_luas_panen_kurang_dari_luas_tanam === ""
                ? "-"
                : getLabelByKey(
                    tanaman.penyebab_luas_panen_kurang_dari_luas_tanam,
                    penyebabLuasPanenKurangOptions
                  )}
            </span>
          </div>
          <div className="flex justify-between">
            <strong>Rata-rata Volume Produksi (kg):</strong>
            <span>{formatNumberWithSpace(tanaman.rata2_volume_produksi)}</span>
          </div>
          <div className="flex justify-between">
            <strong>Rata-rata Nilai Produksi (000 Rp):</strong>
            <span>{formatNumberWithSpace(tanaman.rata2_nilai_produksi)}</span>
          </div>
          <div className="flex justify-between">
            <strong>Jenis Pupuk:</strong>
            <span>{convertKeysToString(tanaman.jenis_pupuk, jenisPupukOptions)}</span>
          </div>
          <div className="flex justify-between">
            <strong>Pemanfaatan Produk:</strong>
            <span>
              {getLabelByKey(
                tanaman.pemanfaatan_produk,
                pemanfaatanProdukOptions
              )}
            </span>
          </div>
        </div>
      ),
    });
  });

  return (
    <div className="p-4">
      <table className="w-full overflow-hidden border border-gray-300 rounded-lg table-auto table-detail-usaha-sayuran">
        <tbody className="text-[14px]">
          {rows.map((row, index) => (
            <TableRow key={index} label={row.label} value={row.value} />
          ))}
        </tbody>
      </table>
      {ruta.latitude && ruta.longitude && (
        <RutaMap latitude={ruta.latitude} longitude={ruta.longitude} />
      )}
    </div>
  );
};

const DetailRutaModal = ({ isOpen, onOpenChange, selectedRuta }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      className="bg-slate-100 font-inter max-h-[90%] my-auto"
      classNames={{
        header: "border-b-[1px] border-slate-300",
        footer: "border-t-[1px] border-slate-300",
        body: "overflow-y-auto",
        wrapper: "overflow-y-hidden",
      }}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
    >
      <ModalContent className="font-inter text-pgreen">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white bg-pgreen">
              Detail Usaha Tanaman Sayuran
            </ModalHeader>
            <ModalBody className="py-4">
              <RutaDetail ruta={selectedRuta} />
            </ModalBody>
            <ModalFooter>
              <Button
                className="font-semibold text-white bg-pgreen font-inter"
                onPress={() => onOpenChange(false)}
              >
                Tutup
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DetailRutaModal;
