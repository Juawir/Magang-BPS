/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import api from "../../utils/api";
import "leaflet/dist/leaflet.css";
import { ConfigProvider, DatePicker, Image, message, Upload } from "antd";
import { Bars } from "react-loader-spinner";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@mui/icons-material";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertDatesInArray } from "../../utils/date";
import api3 from "../../utils/api3";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { FaImages } from "react-icons/fa6";

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

const AddRutaModal = ({
  isOpen,
  onClose,
  isSatuan,
  dataRuta,
  fetchData,
  fetchDataAggregate,
  daftarSls,
  jenis_pupuk,
  pemanfaatan_produk,
}) => {
  const initialCoordinate = [-7.437249, 112.601518];
  const [addUsahaData, setAddUsahaData] = useState({});
  const [addUsahaList, setAddUsahaList] = useState([]);
  const [addUsahaDataCache, setAddUsahaDataCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState(initialCoordinate); // Default position
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
    // Cek apakah addRutaDataCache bukan objek kosong
    if (Object.keys(addUsahaDataCache).length > 0 && createError === true) {
      setAddUsahaData(addUsahaDataCache);
      setSelectedSls(addUsahaDataCache.kodeSls);
      setSelectedJenisPupuk(addUsahaDataCache.jenis_pupuk);
      setSelectedPemanfaatanProduk(addUsahaDataCache.pemanfaatan_produk);
      console.log("createError", createError);
      console.log("addUsahaDataCache", addUsahaDataCache);
      setCreateError(false);
    }
  }, [createError]);

  useEffect(() => {
    if (addUsahaData.latitude && addUsahaData.longitude) {
      const latitude = parseFloat(addUsahaData.latitude);
      const longitude = parseFloat(addUsahaData.longitude);

      if (errors.latitude === "" && errors.longitude === "") {
        setMapPosition([latitude, longitude]);
      }
    }
  }, [addUsahaData.latitude, addUsahaData.longitude]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setCustomFilename(addUsahaData.nama_kepala_keluarga);
  };

  const customRequest = ({ file, onSuccess, onError, filename }) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/svg+xml",
      "image/tiff",
      "image/x-icon",
      "image/heif",
      "image/heic",
    ]; // Daftar tipe gambar yang lebih lengkap

    if (!allowedTypes.includes(file.type)) {
      const errorMsg =
        "File harus berupa gambar dengan format yang didukung (JPEG, PNG, GIF, BMP, WEBP, SVG, TIFF, ICO, HEIF, atau HEIC).";
      onError(new Error(errorMsg));
      message.error(errorMsg, 8);
      return;
    }

    // Validasi ukuran file (maksimum 1 MB)
    const maxSize = 1 * 1024 * 1024; // 1 MB
    if (file.size > maxSize) {
      const errorMsg = "Ukuran gambar melebihi batas maksimal 1 MB.";
      onError(new Error(errorMsg));
      message.error(errorMsg, 8);
      return;
    }

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
        setAddUsahaData((prevValues) => ({
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
      setAddUsahaData((prevValues) => ({
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
      } else if (isNaN(value) || value < 0) {
        errors.volume_produksi =
          "Rata-rata Volume Produksi Per Panen harus berupa angka positif.";
      } else {
        errors.volume_produksi = "";
      }
    }

    if (name === "jml_pohon") {
      if (!value) {
        errors.jml_pohon = "Jumlah Pohon Kelengkeng harus diisi.";
      } else if (isNaN(value) || value < 0) {
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
      } else if (isNaN(value) || value < 0) {
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
      } else if (isNaN(value) || value < 0) {
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
      } else if (isNaN(value) || value < 0) {
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
      } else if (isNaN(value) || value < 0) {
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
      } else if (isNaN(value) || value < 0) {
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
          setAddUsahaData((prevValues) => ({
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
          setAddUsahaData((prevValues) => ({
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
    setAddUsahaData((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === "kodeSls") setSelectedSls(value);
    // if (name === "jenis_pupuk") setSelectedJenisPupuk(value);
  };

  const handleOnJenisPupukSelectionChange = (keys) => {
    // Set the selected keys (Set) to the state
    console.log("Keys:", keys);
    setAddUsahaData((prevValues) => ({
      ...prevValues,
      ["jenis_pupuk"]: [...keys],
    }));
    setSelectedJenisPupuk(new Set(keys));
  };

  const handleOnPemanfaatanProdukSelectionChange = (keys) => {
    // Set the selected keys (Set) to the state
    console.log("Keys:", keys);
    setAddUsahaData((prevValues) => ({
      ...prevValues,
      ["pemanfaatan_produk"]: [...keys],
    }));
    setSelectedPemanfaatanProduk(new Set(keys));
  };

  const resetSelect = () => {
    setSelectedSls("");
    setSelectedJenisPupuk([]);
    setSelectedPemanfaatanProduk([]);
  };

  const validateForm = (addUsahaData) => {
    const newErrors = {};

    // Validasi setiap field
    if (!addUsahaData.kodeSls)
      newErrors.kodeSls = "Identitas SLS wajib dipilih.";
    if (!addUsahaData.nama_kepala_keluarga)
      newErrors.nama_kepala_keluarga = "Nama Kepala Keluarga wajib diisi.";
    if (!addUsahaData.alamat) newErrors.alamat = "Alamat wajib diisi.";
    if (!addUsahaData.jml_pohon)
      newErrors.jml_pohon = "Jumlah Pohon Kelengkeng wajib diisi.";
    if (!addUsahaData.jml_pohon_new_crystal)
      newErrors.jml_pohon_new_crystal =
        "Jumlah Pohon Kelengkeng New Crystal wajib diisi.";
    if (!addUsahaData.jml_pohon_pingpong)
      newErrors.jml_pohon_pingpong =
        "Jumlah Pohon Kelengkeng Pingpong wajib diisi.";
    if (!addUsahaData.jml_pohon_metalada)
      newErrors.jml_pohon_metalada =
        "Jumlah Pohon Kelengkeng Metalada wajib diisi.";
    if (!addUsahaData.jml_pohon_diamond_river)
      newErrors.jml_pohon_diamond_river =
        "Jumlah Pohon Kelengkeng Diamond River wajib diisi.";
    if (!addUsahaData.jml_pohon_merah)
      newErrors.jml_pohon_merah = "Jumlah Pohon Kelengkeng Merah wajib diisi.";
    if (!addUsahaData.jenis_pupuk)
      newErrors.jenis_pupuk = "Jenis Pupuk wajib diisi.";
    if (!addUsahaData.volume_produksi)
      newErrors.volume_produksi =
        "Volume Produksi Periode Agustus 2023-Juli 2024 wajib diisi.";
    if (!addUsahaData.latitude) newErrors.latitude = "Latitude wajib diisi.";
    if (!addUsahaData.longitude) newErrors.longitude = "Longitude wajib diisi.";
    if (!addUsahaData.url_img)
      newErrors.url_img = "Terjadi kesalahan upload foto.";

    // Validasi total jumlah pohon
    const totalPohonJenis =
      (parseInt(addUsahaData.jml_pohon_new_crystal) || 0) +
      (parseInt(addUsahaData.jml_pohon_pingpong) || 0) +
      (parseInt(addUsahaData.jml_pohon_metalada) || 0) +
      (parseInt(addUsahaData.jml_pohon_diamond_river) || 0) +
      (parseInt(addUsahaData.jml_pohon_merah) || 0);

    if (
      addUsahaData.jml_pohon &&
      totalPohonJenis !== parseInt(addUsahaData.jml_pohon)
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

  const handleAddSave = async () => {
    if (addUsahaData && isSatuan) {
      if (hasErrors(errors)) {
        message.error(
          "Mohon tangani kesalahan terlebih dahulu sebelum menyimpan.",
          5
        );
        return;
      }
      if (!validateForm(addUsahaData)) {
        message.error(
          "Mohon lengkapi semua field yang diperlukan dan perbaiki kesalahan.",
          5
        );
        return;
      }

      if (errors.latitude || errors.longitude) {
        message.error(
          "Mohon tangani kesalahan terlebih dahulu sebelum menyimpan.",
          5
        );
        return;
      }

      console.log("Add Usaha Data", addUsahaData);
      setAddUsahaDataCache(addUsahaData);
      const convertedData = {
        ...addUsahaData,
        rt_rw_dusun: getLabelByKey(addUsahaData.kodeSls, daftarSls),
        jml_pohon: parseInt(addUsahaData.jml_pohon),
        jml_pohon_new_crystal: parseInt(addUsahaData.jml_pohon_new_crystal),
        jml_pohon_pingpong: parseInt(addUsahaData.jml_pohon_pingpong),
        jml_pohon_metalada: parseInt(addUsahaData.jml_pohon_metalada),
        jml_pohon_diamond_river: parseInt(addUsahaData.jml_pohon_diamond_river),
        jml_pohon_merah: parseInt(addUsahaData.jml_pohon_merah),
        volume_produksi: parseFloat(addUsahaData.volume_produksi),
        latitude: parseFloat(addUsahaData.latitude),
        longitude: parseFloat(addUsahaData.longitude),
        // jumlahUmkm, // Tambahkan jumlah UMKM ke data yang akan disimpan
      };

      console.log("Data Ruta", convertedData);

      // Lanjutkan dengan penyimpanan data
      await createData(convertedData);

      setAddUsahaData({});
      setFileList([]);
      setErrors({});
      resetSelect();
      await fetchDataAggregate();
    } else {
      try {
        console.log("Add Usaha Data List", addUsahaList);
        await createData(addUsahaList);
        setAddUsahaData({});
        setErrors({});
        await fetchDataAggregate();
      } catch (error) {
        message.error(`Terjadi kesalahan: ${error.message}`, 5);
      }
    }
  };

  const createData = async (data) => {
    setLoading(true);
    try {
      await api3.post("/api/usahaKlengkeng", data);
      if (isSatuan) {
        message.success(
          `Usaha Kelengkeng ${data.nama_kepala_keluarga} berhasil dibuat.`,
          5
        );
      } else {
        message.success(
          `Data Usaha Kelengkeng sebanyak ${data.length} berhasil dibuat.`,
          5
        );
      }
      onClose(); // Make sure this is the correct function to close the modal
      fetchData(); // Fetch updated data
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Terjadi kesalahan: ${error.response.data.message}`, 5);
        setCreateError(true);
      } else {
        message.error(`Terjadi kesalahan: ${error.message}`, 5);
        setCreateError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseButton = () => {
    setAddUsahaData({});
    setFileList([]);
    resetSelect();
    setErrors({});
    onClose();
  };

  function generateKodeRumahTangga(inputArray, rutaList) {
    const rtCountMap = {};

    // Hitung jumlah rumah tangga untuk setiap kodeSls dalam rutaList
    rutaList.forEach((ruta) => {
      const { kodeSls } = ruta;
      if (!rtCountMap[kodeSls]) {
        rtCountMap[kodeSls] = 0;
      }
      rtCountMap[kodeSls]++;
    });

    // Tambahkan kode rumah tangga untuk setiap objek dalam inputArray
    return inputArray.map((item) => {
      const { kodeSls } = item;
      if (!rtCountMap[kodeSls]) {
        rtCountMap[kodeSls] = 0;
      }
      rtCountMap[kodeSls]++;
      const noUrut = rtCountMap[kodeSls].toString().padStart(3, "0");
      const kodeRumahTangga = `${kodeSls}${noUrut}`;

      return { ...item, kode: kodeRumahTangga };
    });
  }

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsx, .xls",
    customRequest: ({ file, onSuccess, onError }) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = json[0];
        const rows = json.slice(1).map((row) => {
          let obj = {};
          row.forEach((cell, index) => {
            obj[headers[index]] = cell;
          });
          return obj;
        });

        const rutaList = generateKodeRumahTangga(rows, dataRuta);

        const readyRutaList = convertDatesInArray(rutaList);

        console.log("Excel to JSON:", readyRutaList); // JSON hasil konversi

        setAddUsahaList(readyRutaList);

        setFiles((prevFiles) => {
          if (!prevFiles.some((f) => f.uid === file.uid)) {
            return [...prevFiles, { ...file, rows }];
          }
          return prevFiles;
        });

        onSuccess(); // Indicate successful file handling
      };
      reader.onerror = onError;
      reader.readAsArrayBuffer(file);
    },
    onRemove(file) {
      setFiles((prevFiles) => prevFiles.filter((f) => f.uid !== file.uid));
    },
    onChange(info) {
      const { status, file } = info;
      if (status === "error") {
        message.error(`${file.name} file processing failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const customMarker = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/8058/8058939.png", // Replace with your custom icon URL
    iconSize: [45, 45], // Size of the icon
    iconAnchor: [19, 45], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -45], // Point from which the popup should open relative to the iconAnchor
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
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
              Tambah Potensi Kelengkeng
            </ModalHeader>
            <ModalBody className="py-4">
              {isSatuan ? (
                <div className="space-y-4 simoketawang-usaha-add">
                  <Select
                    size="md"
                    label="Identitas SLS"
                    className="w-full"
                    name="kodeSls"
                    selectedKeys={selectedSls ? [selectedSls] : []}
                    placeholder="Pilih Identitas SLS"
                    onChange={handleSelectChange}
                  >
                    {daftarSls.map((item) => (
                      <SelectItem key={item.kode} value={item.kode}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.kodeSls && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.kodeSls}
                    </p>
                  )}
                  <Input
                    label="Nama Kepala Keluarga"
                    placeholder="Masukkan Nama Kepala Keluarga"
                    fullWidth
                    classNames={{ inputWrapper: "shadow", input: "text-black" }}
                    name="nama_kepala_keluarga"
                    value={addUsahaData.nama_kepala_keluarga}
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
                    value={addUsahaData.alamat}
                    onChange={handleInputChange}
                  />
                  {errors.alamat && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.alamat}
                    </p>
                  )}
                  {/* <Select
                    size="md"
                    label="Jenis Kelengkeng"
                    className="w-full"
                    name="jenis_klengkeng"
                    selectedKeys={
                      selectedJenisKlengkeng ? [selectedJenisKlengkeng] : []
                    }
                    placeholder="Pilih Jenis Kelengkeng"
                    onChange={handleSelectChange}
                  >
                    {jenis_klengkeng.map((item) => (
                      <SelectItem key={item.key} value={item.key}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.jenis_klengkeng && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jenis_klengkeng}
                    </p>
                  )} */}
                  <Input
                    label="Jumlah Pohon Kelengkeng"
                    placeholder="Masukkan Jumlah Pohon Kelengkeng"
                    fullWidth
                    classNames={{ inputWrapper: "shadow", input: "text-black" }}
                    name="jml_pohon"
                    value={addUsahaData.jml_pohon}
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
                    value={addUsahaData.jml_pohon_new_crystal}
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
                    value={addUsahaData.jml_pohon_pingpong}
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
                    value={addUsahaData.jml_pohon_metalada}
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
                    value={addUsahaData.jml_pohon_diamond_river}
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
                    value={addUsahaData.jml_pohon_merah}
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
                    value={addUsahaData.volume_produksi}
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
                    value={addUsahaData.catatan}
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
                    value={addUsahaData.latitude}
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
                    value={addUsahaData.longitude}
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
                            <Popup>Posisi Potensi Kelengkeng</Popup>
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
                      addUsahaData.nama_kepala_keluarga === "" ||
                      addUsahaData.nama_kepala_keluarga === undefined
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
              ) : (
                <div className="flex flex-col text-pdarkblue font-inter">
                  <p className="font-semibold text-[14px] mb-3 text-pdarkblue">
                    Upload File
                  </p>
                  <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Klik atau seret file excel ke area ini
                    </p>
                    <p className="ant-upload-hint">
                      Dukungan untuk unggahan satuan atau kumpulan file.
                      Dilarang keras mengunggah data perusahaan atau file yang
                      dilarang lainnya.
                    </p>
                  </Dragger>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={handleCloseButton}
              >
                Tutup
              </Button>
              <Button
                className="font-semibold text-white bg-pyellow font-inter"
                onPress={handleAddSave}
                disabled={loading}
              >
                {loading ? (
                  <Bars width="25" height="25" color="#ffffff" />
                ) : (
                  "Tambah"
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddRutaModal;
