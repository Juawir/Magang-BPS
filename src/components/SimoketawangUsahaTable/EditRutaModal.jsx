/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../utils/api";
import { DatePicker, Image, message, Upload } from "antd";
import { Bars } from "react-loader-spinner";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import api3 from "../../utils/api3";
import { FaImages } from "react-icons/fa6";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const getLabelByKey = (key, array) => {
  const item = array.find((obj) => obj.kode === key);
  return item ? item.label : "Label not found";
};

// Component to update map position
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom()); // Update map center and keep the zoom level
  }, [position, map]);

  return null;
};

// Helper function to validate latitude and longitude
const isValidLatitude = (latitude) => {
  return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
};

const isValidLongitude = (longitude) => {
  return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditRutaModal = ({
  isEditModalOpen,
  onEditModalOpenChange,
  ruta,
  fetchData,
  fetchDataAggregate,
  jenis_klengkeng,
  jenis_pupuk,
  pemanfaatan_produk,
}) => {
  // Initialize state with default values
  const [editUsahaData, setEditUsahaData] = useState({});
  const [oldUsahaData, setOldUsahaData] = useState({});
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState([0, 0]); // Initialize map position
  const [selectedSls, setSelectedSls] = useState("");
  const [selectedJenisPupuk, setSelectedJenisPupuk] = useState([]);
  const [selectedPemanfaatanProduk, setSelectedPemanfaatanProduk] = useState(
    []
  );
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [createError, setCreateError] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [customFilename, setCustomFilename] = useState("");

  useEffect(() => {
    if (ruta) {
      setEditUsahaData(ruta);
      setOldUsahaData(ruta);
      setSelectedSls(ruta.kodeSls);
      setSelectedJenisPupuk(ruta.jenis_pupuk);
      setSelectedPemanfaatanProduk(ruta.pemanfaatan_produk);
      setFileList([
        {
          uid: ruta._id,
          name: ruta.nama_kepala_keluarga + ".png",
          status: "done",
          url: ruta.url_img,
        },
      ]);
    }
  }, [ruta]);

  // Update mapPosition when ruta changes
  useEffect(() => {
    if (ruta && ruta.latitude && ruta.longitude) {
      setMapPosition([ruta.latitude, ruta.longitude]);
    }
  }, [ruta]);

  useEffect(() => {
    if (editUsahaData.latitude && editUsahaData.longitude) {
      if (
        (!errors.latitude && !errors.longitude) ||
        (errors.latitude === "" && errors.longitude === "")
      ) {
        setMapPosition([editUsahaData.latitude, editUsahaData.longitude]);
      }
    }
  }, [editUsahaData]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setCustomFilename(editUsahaData.nama_kepala_keluarga);
  };

  const customRequest = ({ file, onSuccess, onError, filename }) => {
    const formData = new FormData();

    // Gunakan parameter filename jika diberikan, jika tidak gunakan nama file asli
    const finalFilename = filename ? filename : file.name.split(".")[0];

    // Tambahkan file dan nama file ke FormData
    formData.append("filename", finalFilename);
    formData.append("image", file);

    // Kirimkan data menggunakan Axios
    api3
      .post("/api/photo/upload", formData)
      .then((response) => {
        console.log("Link Photo: ", response.data.imageUrl);
        setEditUsahaData((prevValues) => ({
          ...prevValues,
          ["url_img"]: response.data.imageUrl,
        }));
        onSuccess(response.data);
      })
      .catch((error) => {
        onError(error);
        console.log(error);
        if (error.response) {
          message.error(error.response.data.message, 8);
        } else {
          message.error(error.message, 8);
        }
      });
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (
      name === "latitude" ||
      name === "longitude" ||
      name === "volume_produksi"
    ) {
      updatedValue = value.replace(",", "."); // Replace comma with dot for valid decimal format
    }

    if (
      name === "nama_kepala_keluarga" ||
      name === "catatan" ||
      name === "alamat"
    ) {
      updatedValue = value.toUpperCase();
    }

    if (name !== "latitude" && name !== "longitude") {
      setEditUsahaData((prevValues) => ({
        ...prevValues,
        [name]: updatedValue,
      }));
    }

    if (name === "nama_kepala_keluarga") {
      if (!value) {
        errors.nama_kepala_keluarga = "Nama Kepala Keluarga harus diisi.";
      } else {
        errors.nama_kepala_keluarga = "";
      }
    }

    if (name === "alamat") {
      if (!value) {
        errors.alamat = "Alamat harus diisi.";
      } else {
        errors.alamat = "";
      }
    }

    if (name === "volume_produksi") {
      if (!value) {
        errors.volume_produksi =
          "Volume Produksi Periode Agustus 2023-Juli 2024 harus diisi.";
      } else if (isNaN(value) || value <= 0) {
        errors.volume_produksi =
          "Rata-rata Volume Produksi Per Panen harus berupa angka positif.";
      } else {
        errors.volume_produksi = "";
      }
    }

    if (name === "jml_pohon") {
      if (!value) {
        errors.jml_pohon = "Jumlah Pohon Kelengkeng harus diisi.";
      } else if (isNaN(value) || value <= 0) {
        errors.jml_pohon =
          "Jumlah Pohon Kelengkeng harus berupa angka positif.";
      } else if (!Number.isInteger(Number(value))) {
        errors.jml_pohon = "Jumlah Pohon Kelengkeng harus berupa angka bulat.";
      } else {
        errors.jml_pohon = "";
      }
    }

    if (name === "jml_pohon_new_crystal") {
      if (!value) {
        errors.jml_pohon_new_crystal =
          "Jumlah Pohon Kelengkeng New Crystal harus diisi.";
      } else if (isNaN(value) || value <= 0) {
        errors.jml_pohon_new_crystal =
          "Jumlah Pohon Kelengkeng New Crystal harus berupa angka positif.";
      } else if (!Number.isInteger(Number(value))) {
        errors.jml_pohon_new_crystal =
          "Jumlah Pohon Kelengkeng New Crystal harus berupa angka bulat.";
      } else {
        errors.jml_pohon_new_crystal = "";
      }
    }

    if (name === "jml_pohon_pingpong") {
      if (!value) {
        errors.jml_pohon_pingpong =
          "Jumlah Pohon Kelengkeng Pingpong harus diisi.";
      } else if (isNaN(value) || value <= 0) {
        errors.jml_pohon_pingpong =
          "Jumlah Pohon Kelengkeng Pingpong harus berupa angka positif.";
      } else if (!Number.isInteger(Number(value))) {
        errors.jml_pohon_pingpong =
          "Jumlah Pohon Kelengkeng Pingpong harus berupa angka bulat.";
      } else {
        errors.jml_pohon_pingpong = "";
      }
    }

    if (name === "jml_pohon_metalada") {
      if (!value) {
        errors.jml_pohon_metalada =
          "Jumlah Pohon Kelengkeng Metalada harus diisi.";
      } else if (isNaN(value) || value <= 0) {
        errors.jml_pohon_metalada =
          "Jumlah Pohon Kelengkeng Metalada harus berupa angka positif.";
      } else if (!Number.isInteger(Number(value))) {
        errors.jml_pohon_metalada =
          "Jumlah Pohon Kelengkeng Metalada harus berupa angka bulat.";
      } else {
        errors.jml_pohon_metalada = "";
      }
    }

    if (name === "jml_pohon_diamond_river") {
      if (!value) {
        errors.jml_pohon_diamond_river =
          "Jumlah Pohon Kelengkeng Diamond River harus diisi.";
      } else if (isNaN(value) || value <= 0) {
        errors.jml_pohon_diamond_river =
          "Jumlah Pohon Kelengkeng Diamond River harus berupa angka positif.";
      } else if (!Number.isInteger(Number(value))) {
        errors.jml_pohon_diamond_river =
          "Jumlah Pohon Kelengkeng Diamond River harus berupa angka bulat.";
      } else {
        errors.jml_pohon_diamond_river = "";
      }
    }

    if (name === "jml_pohon_merah") {
      if (!value) {
        errors.jml_pohon_merah = "Jumlah Pohon Kelengkeng Merah harus diisi.";
      } else if (isNaN(value) || value <= 0) {
        errors.jml_pohon_merah =
          "Jumlah Pohon Kelengkeng Merah harus berupa angka positif.";
      } else if (!Number.isInteger(Number(value))) {
        errors.jml_pohon_merah =
          "Jumlah Pohon Kelengkeng Merah harus berupa angka bulat.";
      } else {
        errors.jml_pohon_merah = "";
      }
    }

    if (name === "latitude") {
      if (updatedValue === "") {
        errors.latitude = "Latitude harus diisi.";
      } else if (isNaN(updatedValue)) {
        errors.latitude = "Latitude harus berupa angka.";
      } else {
        const numericValue = parseFloat(updatedValue);
        if (!isValidLatitude(numericValue)) {
          errors.latitude = "Latitude harus antara -90 dan 90.";
        } else {
          errors.latitude = "";
          setEditUsahaData((prevValues) => ({
            ...prevValues,
            [name]: updatedValue,
          }));
          console.log("Corrected Latitude:", updatedValue);
        }
      }
    }

    if (name === "longitude") {
      if (updatedValue === "") {
        errors.longitude = "Longitude harus diisi.";
      } else if (isNaN(updatedValue)) {
        errors.longitude = "Longitude harus berupa angka.";
      } else {
        const numericValue = parseFloat(updatedValue);
        if (!isValidLongitude(numericValue)) {
          errors.longitude = "Longitude harus antara -180 dan 180.";
        } else {
          errors.longitude = "";
          setEditUsahaData((prevValues) => ({
            ...prevValues,
            [name]: updatedValue,
          }));
          console.log("Corrected Longitude:", updatedValue);
        }
      }
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setEditUsahaData((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === "kodeSls") setSelectedSls(value);
    // if (name === "jenis_pupuk") setSelectedJenisPupuk(value);
  };

  const handleOnJenisPupukSelectionChange = (keys) => {
    // Set the selected keys (Set) to the state
    console.log("Keys:", keys);
    setEditUsahaData((prevValues) => ({
      ...prevValues,
      ["jenis_pupuk"]: [...keys],
    }));
    setSelectedJenisPupuk(new Set(keys));
  };

  const handleOnPemanfaatanProdukSelectionChange = (keys) => {
    // Set the selected keys (Set) to the state
    console.log("Keys:", keys);
    setEditUsahaData((prevValues) => ({
      ...prevValues,
      ["pemanfaatan_produk"]: [...keys],
    }));
    setSelectedPemanfaatanProduk(new Set(keys));
  };

  const validateForm = (editUsahaData) => {
    const newErrors = {};
    console.log("Edit Usaha Data:", editUsahaData);

    // Validasi setiap field
    if (!editUsahaData.kodeSls)
      newErrors.kodeSls = "Identitas SLS wajib dipilih.";
    if (!editUsahaData.nama_kepala_keluarga)
      newErrors.nama_kepala_keluarga = "Nama Kepala Keluarga wajib diisi.";
    if (!editUsahaData.alamat) newErrors.alamat = "Alamat wajib diisi.";
    if (editUsahaData.jml_pohon === undefined || editUsahaData.jml_pohon === null)
      newErrors.jml_pohon = "Jumlah Pohon Kelengkeng wajib diisi.";
    if (editUsahaData.jml_pohon_new_crystal === undefined || editUsahaData.jml_pohon_new_crystal === null)
      newErrors.jml_pohon_new_crystal =
        "Jumlah Pohon Kelengkeng New Crystal wajib diisi.";
    if (editUsahaData.jml_pohon_pingpong === undefined || editUsahaData.jml_pohon_pingpong === null)
      newErrors.jml_pohon_pingpong =
        "Jumlah Pohon Kelengkeng Pingpong wajib diisi.";
    if (editUsahaData.jml_pohon_metalada === undefined || editUsahaData.jml_pohon_metalada === null)
      newErrors.jml_pohon_metalada =
        "Jumlah Pohon Kelengkeng Metalada wajib diisi.";
    if (editUsahaData.jml_pohon_diamond_river === undefined || editUsahaData.jml_pohon_diamond_river === null)
      newErrors.jml_pohon_diamond_river =
        "Jumlah Pohon Kelengkeng Diamond River wajib diisi.";
    if (editUsahaData.jml_pohon_merah === undefined || editUsahaData.jml_pohon_merah === null)
      newErrors.jml_pohon_merah = "Jumlah Pohon Kelengkeng Merah wajib diisi.";
    if (editUsahaData.jenis_pupuk === undefined || editUsahaData.jenis_pupuk === null)
      newErrors.jenis_pupuk = "Jenis Pupuk wajib diisi.";
    if (editUsahaData.volume_produksi === undefined || editUsahaData.volume_produksi === null)
      newErrors.volume_produksi =
        "Volume Produksi Periode Agustus 2023-Juli 2024 wajib diisi.";
    if (editUsahaData.latitude === undefined || editUsahaData.latitude === null)
      newErrors.latitude = "Latitude wajib diisi.";
    if (editUsahaData.longitude === undefined || editUsahaData.longitude === null)
      newErrors.longitude = "Longitude wajib diisi.";
    if (editUsahaData.url_img === undefined || editUsahaData.url_img === null)
      newErrors.url_img = "Terjadi kesalahan upload foto.";

    // Validasi total jumlah pohon
    const totalPohonJenis =
      (parseInt(editUsahaData.jml_pohon_new_crystal, 10) || 0) +
      (parseInt(editUsahaData.jml_pohon_pingpong, 10) || 0) +
      (parseInt(editUsahaData.jml_pohon_metalada, 10) || 0) +
      (parseInt(editUsahaData.jml_pohon_diamond_river, 10) || 0) +
      (parseInt(editUsahaData.jml_pohon_merah, 10) || 0);

    if (
      editUsahaData.jml_pohon !== undefined &&
      editUsahaData.jml_pohon !== null &&
      totalPohonJenis !== parseInt(editUsahaData.jml_pohon, 10)
    ) {
      newErrors.jml_pohon =
        "Jumlah total pohon jenis harus sama dengan jumlah pohon keseluruhan.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const hasErrors = (errors) => {
    console.log("Has Errors",errors);
    // Iterate over the values of the errors object
    for (let key in errors) {
      // Check if the error message is not empty
      if (errors[key] !== "") {
        return true;
      }
    }
    return false;
  };


  const handleEditSave = async () => {
    if (hasErrors(errors)) {
      message.error(
        "Mohon tangani kesalahan terlebih dahulu sebelum menyimpan.",
        5
      );
      return;
    }
    if (!validateForm(editUsahaData)) {
      message.error(
        "Mohon lengkapi semua field yang diperlukan dan perbaiki kesalahan.",
        5
      );
      return;
    }

    if (
      errors.latitude ||
      errors.longitude ||
      errors.pendapatanSebulanTerakhir
    ) {
      message.error(
        "Mohon tangani kesalahan terlebih dahulu sebelum menyimpan.",
        5
      );
      return;
    }

    if (editUsahaData) {
      const convertedData = {
        ...editUsahaData,
        jml_pohon: parseInt(editUsahaData.jml_pohon),
        jml_pohon_new_crystal: parseInt(editUsahaData.jml_pohon_new_crystal),
        jml_pohon_pingpong: parseInt(editUsahaData.jml_pohon_pingpong),
        jml_pohon_metalada: parseInt(editUsahaData.jml_pohon_metalada),
        jml_pohon_diamond_river: parseInt(editUsahaData.jml_pohon_diamond_river),
        jml_pohon_merah: parseInt(editUsahaData.jml_pohon_merah),
        volume_produksi: parseFloat(editUsahaData.volume_produksi),
        latitude: parseFloat(editUsahaData.latitude),
        longitude: parseFloat(editUsahaData.longitude),
      };

      console.log(convertedData);

      await updateData(convertedData);

      await fetchDataAggregate();
      // setTimeout(() => {
      //   fetchDataAggregate();
      // }, 1000);
    }
  };

  const updateData = async (data) => {
    setLoading(true);
    try {
      const response = await api3.put(`/api/usahaKlengkeng/${data._id}`, data);
      message.success(
        `Usaha Kelengkeng ${data.nama_kepala_keluarga} berhasil diupdate.`,
        5
      );
      onEditModalOpenChange(false);
      fetchData(); // Fetch updated data
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Terjadi kesalahan: ${error.response.data.message}`, 5);
      } else {
        message.error(`Terjadi kesalahan: ${error.message}`, 5);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseButton = () => {
    setErrors({});
    setEditUsahaData(oldUsahaData);
    onEditModalOpenChange(false);
  };

  const customMarker = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/8058/8058939.png", // Replace with your custom icon URL
    iconSize: [45, 45], // Size of the icon
    iconAnchor: [19, 45], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -45], // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <Modal
      isOpen={isEditModalOpen}
      onOpenChange={onEditModalOpenChange}
      size="xl"
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
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white bg-pyellow">
              Edit Potensi Kelengkeng
            </ModalHeader>
            <ModalBody className="py-4">
              <div className="space-y-4 simoketawang-usaha-edit">
                <Input
                  label="Kode"
                  // placeholder="Masukkan No. Urut Bangunan"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="kode"
                  value={editUsahaData.kode}
                  onChange={handleInputChange}
                  isReadOnly
                />
                <Input
                  label="Identitas SLS"
                  // placeholder="Masukkan No. Urut Bangunan"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="sls"
                  value={editUsahaData.rt_rw_dusun}
                  onChange={handleInputChange}
                  isReadOnly
                />
                <Input
                  label="Nama Kepala Keluarga"
                  placeholder="Masukkan Nama Kepala Keluarga"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="nama_kepala_keluarga"
                  value={editUsahaData.nama_kepala_keluarga}
                  onChange={handleInputChange}
                />
                {errors.nama_kepala_keluarga && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.nama_kepala_keluarga}
                  </p>
                )}
                <Textarea
                  label="Alamat"
                  placeholder="Masukkan Alamat"
                  name="alamat"
                  value={editUsahaData.alamat}
                  onChange={handleInputChange}
                />
                {errors.alamat && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.alamat}
                  </p>
                )}
                <Input
                  label="Jumlah Pohon Kelengkeng"
                  placeholder="Masukkan Jumlah Pohon Kelengkeng"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="jml_pohon"
                  value={editUsahaData.jml_pohon}
                  onChange={handleInputChange}
                />
                {errors.jml_pohon && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.jml_pohon}
                  </p>
                )}
                <Input
                  label="Jumlah Pohon Kelengkeng New Crystal"
                  placeholder="Masukkan Jumlah Pohon Kelengkeng New Crystal"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="jml_pohon_new_crystal"
                  value={editUsahaData.jml_pohon_new_crystal}
                  onChange={handleInputChange}
                />
                {errors.jml_pohon_new_crystal && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.jml_pohon_new_crystal}
                  </p>
                )}
                <Input
                  label="Jumlah Pohon Kelengkeng Pingpong"
                  placeholder="Masukkan Jumlah Pohon Kelengkeng Pingpong"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="jml_pohon_pingpong"
                  value={editUsahaData.jml_pohon_pingpong}
                  onChange={handleInputChange}
                />
                {errors.jml_pohon_pingpong && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.jml_pohon_pingpong}
                  </p>
                )}
                <Input
                  label="Jumlah Pohon Kelengkeng Metalada"
                  placeholder="Masukkan Jumlah Pohon Kelengkeng Metalada"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="jml_pohon_metalada"
                  value={editUsahaData.jml_pohon_metalada}
                  onChange={handleInputChange}
                />
                {errors.jml_pohon_metalada && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.jml_pohon_metalada}
                  </p>
                )}
                <Input
                  label="Jumlah Pohon Kelengkeng Diamond River"
                  placeholder="Masukkan Jumlah Pohon Kelengkeng Diamond River"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="jml_pohon_diamond_river"
                  value={editUsahaData.jml_pohon_diamond_river}
                  onChange={handleInputChange}
                />
                {errors.jml_pohon_diamond_river && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.jml_pohon_diamond_river}
                  </p>
                )}
                <Input
                  label="Jumlah Pohon Kelengkeng Merah"
                  placeholder="Masukkan Jumlah Pohon Kelengkeng"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="jml_pohon_merah"
                  value={editUsahaData.jml_pohon_merah}
                  onChange={handleInputChange}
                />
                {errors.jml_pohon_merah && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.jml_pohon_merah}
                  </p>
                )}
                <Select
                  size="md"
                  label="Jenis Pupuk"
                  className="w-full"
                  selectionMode="multiple"
                  name="jenis_pupuk"
                  selectedKeys={selectedJenisPupuk ? selectedJenisPupuk : []}
                  placeholder="Pilih Jenis Pupuk"
                  onSelectionChange={handleOnJenisPupukSelectionChange}
                >
                  {jenis_pupuk.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.jenis_pupuk && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.jenis_pupuk}
                  </p>
                )}
                <Input
                  label="Volume Produksi periode Agustus 2023-Juli 2024 (Kg)"
                  placeholder="Masukkan Volume Produksi periode Agustus 2023-Juli 2024"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="volume_produksi"
                  value={editUsahaData.volume_produksi}
                  onChange={handleInputChange}
                />
                {errors.volume_produksi && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.volume_produksi}
                  </p>
                )}
                <Select
                  size="md"
                  label="Pemanfaatan Produk Kelengkeng"
                  className="w-full"
                  selectionMode="multiple"
                  name="pemanfaatan_produk"
                  selectedKeys={
                    selectedPemanfaatanProduk ? selectedPemanfaatanProduk : []
                  }
                  placeholder="Pilih Pemanfaatan Produk Kelengkeng"
                  onSelectionChange={handleOnPemanfaatanProdukSelectionChange}
                >
                  {pemanfaatan_produk.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.pemanfaatan_produk && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.pemanfaatan_produk}
                  </p>
                )}
                <Textarea
                  label="Catatan"
                  placeholder="Masukkan Catatan"
                  name="catatan"
                  value={editUsahaData.catatan}
                  onChange={handleInputChange}
                />
                {errors.catatan && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.catatan}
                  </p>
                )}
                <Input
                  label="Latitude"
                  placeholder="Masukkan nilai latitude"
                  fullWidth
                  name="latitude"
                  value={editUsahaData.latitude}
                  classNames={{ inputWrapper: "shadow" }}
                  onChange={handleInputChange}
                />
                {errors.latitude && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.latitude}
                  </p>
                )}
                <Input
                  label="Longitude"
                  placeholder="Masukkan nilai longitude"
                  fullWidth
                  name="longitude"
                  value={editUsahaData.longitude}
                  classNames={{ inputWrapper: "shadow" }}
                  onChange={handleInputChange}
                />
                {errors.longitude && (
                  <p className="ml-4 text-sm text-red-600 font-inter">
                    {errors.longitude}
                  </p>
                )}
                {isValidLatitude(mapPosition[0]) &&
                  isValidLongitude(mapPosition[1]) && (
                    <div className="my-4">
                      <p className="text-[14px] font-semibold ml-3 my-2 text-pyellow">
                        Titik lokasi Usaha Kelengkeng
                      </p>
                      <MapContainer
                        center={mapPosition}
                        zoom={18}
                        scrollWheelZoom={false}
                        style={{ height: "200px", width: "100%" }}
                        className="border-4 rounded-lg border-slate-300"
                      >
                        {/* <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        /> */}
                        <TileLayer
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                          attribution="Tiles © Esri"
                        />
                        <MapUpdater position={mapPosition} />
                        <Marker position={mapPosition} icon={customMarker}>
                          <Popup>Posisi Usaha Kelengkeng</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  )}
                <p className="text-[14px] font-semibold ml-3 my-2 text-pyellow">
                  Foto Pohon Kelengkeng
                </p>
                <Upload
                  // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  customRequest={(options) =>
                    customRequest({ ...options, filename: customFilename })
                  }
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  className="simoketawang-upload"
                  disabled={
                    editUsahaData.nama_kepala_keluarga === "" ||
                    editUsahaData.nama_kepala_keluarga === undefined
                  }
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
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
                {errors.url_img && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.url_img}
                  </p>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                color="danger"
                onPress={handleCloseButton}
              >
                Tutup
              </Button>
              <Button
                className="font-semibold text-white bg-pyellow font-inter"
                onPress={handleEditSave}
                disabled={loading}
              >
                {loading ? (
                  <Bars width="25" height="25" color="#ffffff" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditRutaModal;
