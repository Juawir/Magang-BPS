/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@nextui-org/react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { jenis_klengkeng, jenis_pupuk, pemanfaatan_produk } from "./data";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Image, Upload } from "antd";
import { FaImages } from "react-icons/fa6";

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

function capitalizeFirstLetter(string) {
  if (typeof string !== "string" || string.length === 0) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
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
    <p className="text-[14px] font-semibold ml-3 my-2 text-pyellow">
      Titik Lokasi Potensi Kelengkeng
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
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: ruta._id,
      name: ruta.nama_kepala_keluarga + ".png",
      status: "done",
      url: ruta.url_img,
    },
  ]);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!ruta) return null;

  const rows = [
    { label: "Kode", value: ruta.kode },
    { label: "Identitas SLS", value: ruta.rt_rw_dusun },
    { label: "Nama Kepala Keluarga", value: ruta.nama_kepala_keluarga },
    { label: "Alamat", value: ruta.alamat },
    { label: "Jumlah Pohon Kelengkeng", value: ruta.jml_pohon },
    { label: "Jumlah Pohon Kelengkeng New Crystal", value: ruta.jml_pohon_new_crystal },
    { label: "Jumlah Pohon Kelengkeng Pingpong", value: ruta.jml_pohon_pingpong },
    { label: "Jumlah Pohon Kelengkeng Metalada", value: ruta.jml_pohon_metalada },
    { label: "Jumlah Pohon Kelengkeng Diamond River", value: ruta.jml_pohon_diamond_river },
    { label: "Jumlah Pohon Kelengkeng Merah", value: ruta.jml_pohon_merah },
    {
      label: "Jenis Pupuk",
      value: convertKeysToString(ruta.jenis_pupuk, jenis_pupuk),
    },
    {
      label: "Volume Produksi Periode Agustus 2023-Juli 2024 (Kg)",
      value: ruta.volume_produksi,
    },
    {
      label: "Pemanfaat Produk Kelengkeng",
      value: convertKeysToString(ruta.pemanfaatan_produk, pemanfaatan_produk),
    },
    { label: "Catatan", value: ruta.catatan },
    { label: "Latitude", value: ruta.latitude },
    { label: "Longitude", value: ruta.longitude },
  ];

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
      disabled={true}
    >
      <FaImages size={30} className="mx-auto text-pyellow" />
      <div
        style={{
          marginTop: 6,
        }}
        className="font-semibold text-pyellow"
      >
        Upload
      </div>
    </button>
  );

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <div className="p-4">
      <table className="w-full overflow-hidden border border-gray-300 rounded-lg table-auto table-detail-usaha">
        <tbody className="text-[14px]">
          {rows.map((row, index) => (
            <TableRow key={index} label={row.label} value={row.value} />
          ))}
        </tbody>
      </table>
      {ruta.latitude && ruta.longitude && (
        <RutaMap latitude={ruta.latitude} longitude={ruta.longitude} />
      )}
      <p className="text-[14px] font-semibold ml-3 my-2 text-pyellow">
        Foto Pohon Kelengkeng
      </p>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        className="simoketawang-upload"
        disabled={true}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

const DetailRutaModal = ({ isOpen, onOpenChange, selectedRuta }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
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
      <ModalContent className="font-inter text-pyellow">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white bg-pyellow">
              Detail Potensi Kelengkeng
            </ModalHeader>
            <ModalBody className="py-4">
              <RutaDetail ruta={selectedRuta} />
            </ModalBody>
            <ModalFooter>
              <Button
                className="font-semibold text-white bg-pyellow font-inter"
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
