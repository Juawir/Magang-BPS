/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
import "leaflet/dist/leaflet.css";
import { message } from "antd";
import { Bars } from "react-loader-spinner";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { convertDatesInArray } from "../../utils/date";
import api4 from "../../utils/api4";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdDeleteForever } from "react-icons/md";
import {
  isPenyuluhanOptions,
  jenisKelaminOptions,
  jenisPupukOptions,
  namaTanamanOptions,
  pemanfaatanProdukOptions,
  pendidikanTerakhirOptions,
  penyebabLuasPanenKurangOptions,
} from "./data";
// import { jenisKelaminOptions } from "./data"

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

const AddRutaModal = ({
  isOpen,
  onClose,
  isSatuan,
  dataRuta,
  fetchData,
  fetchDataAggregate,
  daftarSls,
}) => {
  const initialCoordinate = [-7.437249, 112.601518];
  const [addUsahaData, setAddUsahaData] = useState({});
  const [addUsahaList, setAddUsahaList] = useState([]);
  const [addUsahaDataCache, setAddUsahaDataCache] = useState({});
  const [daftarTanaman, setDaftarTanaman] = useState([
    {
      nama_tanaman: "",
      frekuensi_tanam: "",
      rata2_luas_tanam: "",
      frekuensi_panen: "",
      rata2_luas_panen: "",
      penyebab_luas_panen_kurang_dari_luas_tanam: "",
      rata2_volume_produksi: "",
      rata2_nilai_produksi: "",
      jenis_pupuk: "",
      is_penyuluhan: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState(initialCoordinate); // Default position
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [createError, setCreateError] = useState(false);
  const [tanamanErrors, setTanamanErrors] = useState([{}]);

  useEffect(() => {
    // Cek apakah addRutaDataCache bukan objek kosong
    if (Object.keys(addUsahaDataCache).length > 0 && createError === true) {
      setAddUsahaData(addUsahaDataCache);
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
      name === "nama_pengusaha" ||
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

    if (name === "nama_pengusaha") {
      if (!value) {
        errors.nama_pengusaha = "Nama Pengusaha harus diisi.";
      } else {
        errors.nama_pengusaha = "";
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
  };

  const handleTanamanInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDaftarTanaman = [...daftarTanaman];
    updatedDaftarTanaman[index][name] = value;
    setDaftarTanaman(updatedDaftarTanaman);

    if (tanamanErrors[index] === undefined) {
      setTanamanErrors([...tanamanErrors, {}]);
    }

    if (name === "frekuensi_tanam") {
      if (!value) {
        tanamanErrors[index].frekuensi_tanam = "Frekuensi Tanam harus diisi.";
      } else if (
        isNaN(value) ||
        value < 0 ||
        !Number.isInteger(Number(value))
      ) {
        tanamanErrors[index].frekuensi_tanam =
          "Frekuensi Tanam harus berupa angka bulat positif.";
      } else {
        tanamanErrors[index].frekuensi_tanam = "";
      }
    }

    if (name === "frekuensi_panen") {
      if (!value) {
        tanamanErrors[index].frekuensi_panen = "Frekuensi Panen harus diisi.";
      } else if (
        isNaN(value) ||
        value < 0 ||
        !Number.isInteger(Number(value))
      ) {
        tanamanErrors[index].frekuensi_panen =
          "Frekuensi Panen harus berupa angka bulat positif.";
      } else {
        tanamanErrors[index].frekuensi_panen = "";
      }
    }

    if (name === "rata2_luas_tanam") {
      if (!value) {
        tanamanErrors[index].rata2_luas_tanam =
          "Rata-rata Luas Tanam harus diisi.";
      } else if (isNaN(value) || value < 0) {
        tanamanErrors[index].rata2_luas_tanam =
          "Rata-rata Luas Tanam harus berupa angka positif.";
      } else {
        tanamanErrors[index].rata2_luas_tanam = "";
      }
    }

    if (name === "rata2_luas_panen") {
      if (!value) {
        tanamanErrors[index].rata2_luas_panen =
          "Rata-rata Luas Panen harus diisi.";
      } else if (isNaN(value) || value < 0) {
        tanamanErrors[index].rata2_luas_panen =
          "Rata-rata Luas Panen harus berupa angka positif.";
      } else {
        tanamanErrors[index].rata2_luas_panen = "";
      }
      if (
        daftarTanaman[index].rata2_luas_tanam &&
        parseFloat(value) > parseFloat(daftarTanaman[index].rata2_luas_tanam)
      ) {
        tanamanErrors[index].rata2_luas_panen =
          "Rata-rata Luas Panen tidak boleh lebih dari Rata-rata Luas Tanam.";
      }
    }

    if (name === "rata2_volume_produksi") {
      if (!value) {
        tanamanErrors[index].rata2_volume_produksi =
          "Rata-rata Volume Produksi harus diisi.";
      } else if (isNaN(value) || value < 0) {
        tanamanErrors[index].rata2_volume_produksi =
          "Rata-rata Volume Produksi harus berupa angka positif.";
      } else {
        tanamanErrors[index].rata2_volume_produksi = "";
      }
    }

    if (name === "rata2_nilai_produksi") {
      if (!value) {
        tanamanErrors[index].rata2_nilai_produksi =
          "Rata-rata Nilai Produksi harus diisi.";
      } else if (isNaN(value) || value < 0) {
        tanamanErrors[index].rata2_nilai_produksi =
          "Rata-rata Nilai Produksi harus berupa angka positif.";
      } else {
        tanamanErrors[index].rata2_nilai_produksi = "";
      }
    }
  };

  const handleTanamanSelectChange = (value, index, name) => {
    const updatedDaftarTanaman = [...daftarTanaman];
    if (name === "jenis_pupuk") {
      console.log("Pupuk", value);
      updatedDaftarTanaman[index][name] = [...value];
    } else {
      updatedDaftarTanaman[index][name] = value;
    }
    setDaftarTanaman(updatedDaftarTanaman);
  };

  const addTanamanForm = () => {
    if (daftarTanaman.length < 3) {
      setDaftarTanaman([
        ...daftarTanaman,
        {
          nama_tanaman: "",
          frekuensi_tanam: "",
          rata2_luas_tanam: "",
          frekuensi_panen: "",
          rata2_luas_panen: "",
          penyebab_luas_panen_kurang_dari_luas_tanam: "",
          rata2_volume_produksi: "",
          rata2_nilai_produksi: "",
          jenis_pupuk: "",
          is_penyuluhan: "",
        },
      ]);
      setTanamanErrors([...tanamanErrors, {}]);
    }
  };

  const removeTanamanForm = (index) => {
    const updatedDaftarTanaman = daftarTanaman.filter((_, i) => i !== index);
    const updatedTanamanErrors = tanamanErrors.filter((_, i) => i !== index);
    setDaftarTanaman(updatedDaftarTanaman);
    setTanamanErrors(updatedTanamanErrors);
  };

  const getSelectedTanamanKeys = () => {
    return daftarTanaman.map((tanaman) => tanaman.nama_tanaman).filter(Boolean);
  };

  const validateForm = (addUsahaData) => {
    const newErrors = {};

    // Validasi setiap field
    if (!addUsahaData.kodeSls)
      newErrors.kodeSls = "Identitas SLS wajib dipilih.";
    if (!addUsahaData.nama_kepala_keluarga)
      newErrors.nama_kepala_keluarga = "Nama Kepala Keluarga wajib diisi.";
    if (!addUsahaData.nama_pengusaha)
      newErrors.nama_pengusaha = "Nama Pengusaha wajib diisi.";
    if (!addUsahaData.latitude) newErrors.latitude = "Latitude wajib diisi.";
    if (!addUsahaData.longitude) newErrors.longitude = "Longitude wajib diisi.";
    if (!addUsahaData.jenis_kelamin)
      newErrors.jenis_kelamin = "Jenis Kelamin wajib dipilih.";
    if (!addUsahaData.pendidikan_terakhir)
      newErrors.pendidikan_terakhir = "Pendidikan Terakhir wajib dipilih.";
    if (!addUsahaData.umur) newErrors.umur = "Umur wajib diisi.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDaftarTanamanForm = (tanamanArray) => {
    const newErrors = [];

    // Validasi setiap tanaman dalam array
    tanamanArray.forEach((tanaman, index) => {
      const tanamanErrors = {};

      if (!tanaman.nama_tanaman)
        tanamanErrors.nama_tanaman = "Nama Tanaman wajib dipilih.";
      if (!tanaman.frekuensi_tanam)
        tanamanErrors.frekuensi_tanam = "Frekuensi Tanam wajib diisi.";
      if (!tanaman.rata2_luas_tanam)
        tanamanErrors.rata2_luas_tanam = "Rata-rata Luas Tanam wajib diisi.";
      if (!tanaman.frekuensi_panen)
        tanamanErrors.frekuensi_panen = "Frekuensi Panen wajib diisi.";
      if (!tanaman.rata2_luas_panen)
        tanamanErrors.rata2_luas_panen = "Rata-rata Luas Panen wajib diisi.";
      // if (!tanaman.penyebab_luas_panen_kurang_dari_luas_tanam)
      //   tanamanErrors.penyebab_luas_panen_kurang_dari_luas_tanam =
      //     "Penyebab Luas Panen Kurang dari Luas Tanam wajib dipilih.";
      if (!tanaman.rata2_volume_produksi)
        tanamanErrors.rata2_volume_produksi =
          "Rata-rata Volume Produksi wajib diisi.";
      if (!tanaman.rata2_nilai_produksi)
        tanamanErrors.rata2_nilai_produksi =
          "Rata-rata Nilai Produksi wajib diisi.";
      if (!tanaman.jenis_pupuk)
        tanamanErrors.jenis_pupuk = "Jenis Pupuk wajib dipilih.";
      if (!tanaman.is_penyuluhan)
        tanamanErrors.is_penyuluhan = "Penyuluhan wajib dipilih.";

      // Jika ada kesalahan, tambahkan ke array newErrors
      if (Object.keys(tanamanErrors).length > 0) {
        newErrors[index] = tanamanErrors;
      }
    });

    console.log("Daftar tanaman errors:", newErrors);

    setTanamanErrors(newErrors);

    // Mengembalikan true jika tidak ada kesalahan, false sebaliknya
    return newErrors.length === 0;
  };

  const hasErrors = (errors) => {
    console.log("Has Errors", errors);

    // Helper function to check if an object has any errors
    const objectHasErrors = (errorObj) => {
      for (let key in errorObj) {
        if (errorObj[key] !== "") {
          return true;
        }
      }
      return false;
    };

    // Check if errors is an array
    if (Array.isArray(errors)) {
      // Iterate over each object in the array
      for (let errorObj of errors) {
        if (objectHasErrors(errorObj)) {
          return true;
        }
      }
    } else if (typeof errors === "object" && errors !== null) {
      // Check if errors is a single object
      return objectHasErrors(errors);
    }

    // If errors is neither an object nor an array, return false
    return false;
  };

  const convertTanamanFields = (data) => {
    return {
      ...data,
      frekuensi_tanam: parseInt(data.frekuensi_tanam, 10) || 0,
      frekuensi_panen: parseInt(data.frekuensi_panen, 10) || 0,
      rata2_luas_tanam: parseFloat(data.rata2_luas_tanam) || 0.0,
      rata2_luas_panen: parseFloat(data.rata2_luas_panen) || 0.0,
      rata2_volume_produksi: parseFloat(data.rata2_volume_produksi) || 0.0,
      rata2_nilai_produksi: parseInt(data.rata2_nilai_produksi, 10) || 0,
      is_penyuluhan: data.is_penyuluhan === "true",
    };
  };

  const handleAddSave = async () => {
    if (addUsahaData) {
      if (hasErrors(errors) || hasErrors(tanamanErrors)) {
        message.error(
          "Mohon tangani kesalahan terlebih dahulu sebelum menyimpan.",
          5
        );
        return;
      }
      if (
        !validateForm(addUsahaData) &&
        !validateDaftarTanamanForm(daftarTanaman)
      ) {
        message.error(
          "Mohon lengkapi semua field yang diperlukan dan perbaiki kesalahan.",
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

      if (!validateDaftarTanamanForm(daftarTanaman)) {
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
      const convertedDaftarTanaman = daftarTanaman.map(convertTanamanFields);
      const readyUsahaData = {
        ...addUsahaData,
        rt_rw_dusun: getLabelByKey(addUsahaData.kodeSls, daftarSls),
        daftar_tanaman: convertedDaftarTanaman,
      };
      console.log("Add Ready Usaha Data", readyUsahaData);

      // Lanjutkan dengan penyimpanan data
      await createData(readyUsahaData);

      setAddUsahaData({});
      setErrors({});
      // resetSelect();
      await fetchDataAggregate();
    }
  };

  const createData = async (data) => {
    setLoading(true);
    try {
      await api4.post("/api/usahaSayuran", data);
      if (isSatuan) {
        message.success(
          `Usaha Sayuran ${data.nama_pengusaha} berhasil dibuat.`,
          5
        );
      } else {
        message.success(
          `Data Usaha Sayuran sebanyak ${data.length} berhasil dibuat.`,
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
    setDaftarTanaman([
      {
        nama_tanaman: "",
        frekuensi_tanam: "",
        rata2_luas_tanam: "",
        frekuensi_panen: "",
        rata2_luas_panen: "",
        penyebab_luas_panen_kurang_dari_luas_tanam: "",
        rata2_volume_produksi: "",
        rata2_nilai_produksi: "",
        jenis_pupuk: "",
        is_penyuluhan: "",
      },
    ]);
    // resetSelect();
    setErrors({});
    setTanamanErrors([{}]);
    onClose();
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
      <ModalContent className="font-inter text-pgreen">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white bg-pgreen">
              Tambah Usaha Sayuran
            </ModalHeader>
            <ModalBody className="py-4">
              <div className="space-y-4 grogol-usaha-add">
                <p className="text-[14px] font-semibold">
                  BLOK I. KETERANGAN TEMPAT
                </p>
                <Select
                  size="md"
                  label="Identitas SLS"
                  className="w-full"
                  name="kodeSls"
                  selectedKeys={[addUsahaData.kodeSls]}
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
                      <p className="text-[14px] font-semibold ml-3 my-2 text-pgreen">
                        Titik lokasi Usaha Sayuran
                      </p>
                      <MapContainer
                        center={mapPosition}
                        zoom={18}
                        scrollWheelZoom={false}
                        style={{ height: "200px", width: "100%" }}
                        className="border-4 rounded-lg border-slate-300"
                      >
                        <TileLayer
                          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                          attribution="Tiles © Esri"
                        />
                        <MapUpdater position={mapPosition} />
                        <Marker position={mapPosition} icon={customMarker}>
                          <Popup>Posisi Usaha Sayuran</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
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
                <p className="text-[14px] font-semibold">
                  BLOK II. IDENTITAS PETANI
                </p>
                <Input
                  label="Nama Pengusaha Utama"
                  placeholder="Masukkan Nama Pengusaha Utama"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="nama_pengusaha"
                  value={addUsahaData.nama_pengusaha}
                  onChange={handleInputChange}
                />
                {errors.nama_pengusaha && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.nama_pengusaha}
                  </p>
                )}
                <Select
                  size="md"
                  label="Jenis Kelamin"
                  className="w-full"
                  name="jenis_kelamin"
                  selectedKeys={[addUsahaData.jenis_kelamin]}
                  placeholder="Pilih Jenis Kelamin"
                  onChange={handleSelectChange}
                >
                  {jenisKelaminOptions.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.jenis_kelamin && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.jenis_kelamin}
                  </p>
                )}
                <Input
                  label="Umur"
                  placeholder="Masukkan Umur"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="umur"
                  value={addUsahaData.umur}
                  onChange={handleInputChange}
                />
                {errors.umur && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.umur}
                  </p>
                )}
                <Select
                  size="md"
                  label="Pendidikan Terakhir"
                  className="w-full"
                  name="pendidikan_terakhir"
                  selectedKeys={[addUsahaData.pendidikan_terakhir]}
                  placeholder="Pilih Pendidikan Terakhir"
                  onChange={handleSelectChange}
                >
                  {pendidikanTerakhirOptions.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.pendidikan_terakhir && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.pendidikan_terakhir}
                  </p>
                )}
                <p className="text-[14px] font-semibold">
                  BLOK III. KARAKTERISTIK USAHA TANAMAN SAYURAN SEMUSIM
                </p>
                {daftarTanaman.map((tanaman, index) => (
                  <>
                    <div className="h-1"></div>
                    <div
                      key={index}
                      className={`relative bg-[#ecf8e4] px-2 ${
                        daftarTanaman.length > 1 ? "pb-12" : "pb-4"
                      } space-y-4 border-2 rounded-lg border-pgreen`}
                    >
                      <div className="absolute -top-[30px] left-1 font-semibold text-white bg-pgreen text-[14px] px-2 py-1 rounded-tl-lg rounded-tr-lg">
                        Tanaman {index + 1}
                      </div>
                      <Select
                        size="md"
                        label="Nama Tanaman"
                        className="w-full"
                        name="nama_tanaman"
                        selectedKeys={[tanaman.nama_tanaman]}
                        placeholder="Pilih Nama Tanaman"
                        onChange={(e) =>
                          handleTanamanSelectChange(
                            e.target.value,
                            index,
                            "nama_tanaman"
                          )
                        }
                      >
                        {namaTanamanOptions
                          .filter(
                            (item) =>
                              !getSelectedTanamanKeys().includes(item.key) ||
                              item.key === tanaman.nama_tanaman
                          ) // Hanya tampilkan yang belum dipilih atau yang dipilih saat ini
                          .map((item) => (
                            <SelectItem key={item.key} value={item.key}>
                              {item.label}
                            </SelectItem>
                          ))}
                      </Select>
                      {tanamanErrors[index]?.nama_tanaman && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].nama_tanaman}
                        </p>
                      )}
                      <Input
                        label="Frekuensi Tanam Sejak 01 Januari 2024 (kali)"
                        placeholder="Masukkan Frekuensi Tanam Sejak 01 Januari 2024"
                        fullWidth
                        classNames={{
                          inputWrapper: "shadow",
                          input: "text-black",
                        }}
                        name="frekuensi_tanam"
                        value={tanaman.frekuensi_tanam}
                        onChange={(e) => handleTanamanInputChange(e, index)}
                      />
                      {tanamanErrors[index]?.frekuensi_tanam && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].frekuensi_tanam}
                        </p>
                      )}
                      <Input
                        label="Rata-rata Luas Tanam (m²)"
                        placeholder="Masukkan Rata-rata Luas Tanam"
                        fullWidth
                        classNames={{
                          inputWrapper: "shadow",
                          input: "text-black",
                        }}
                        name="rata2_luas_tanam"
                        value={tanaman.rata2_luas_tanam}
                        onChange={(e) => handleTanamanInputChange(e, index)}
                      />
                      {tanamanErrors[index]?.rata2_luas_tanam && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].rata2_luas_tanam}
                        </p>
                      )}
                      <Input
                        label="Frekuensi Panen Sejak 01 Januari 2024 (kali)"
                        placeholder="Masukkan Frekuensi Panen Sejak 01 Januari 2024"
                        fullWidth
                        classNames={{
                          inputWrapper: "shadow",
                          input: "text-black",
                        }}
                        name="frekuensi_panen"
                        value={tanaman.frekuensi_panen}
                        onChange={(e) => handleTanamanInputChange(e, index)}
                      />
                      {tanamanErrors[index]?.frekuensi_panen && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].frekuensi_panen}
                        </p>
                      )}
                      <Input
                        label="Rata-rata Luas Panen (m²)"
                        placeholder="Masukkan Rata-rata Luas Panen"
                        fullWidth
                        classNames={{
                          inputWrapper: "shadow",
                          input: "text-black",
                        }}
                        name="rata2_luas_panen"
                        value={tanaman.rata2_luas_panen}
                        onChange={(e) => handleTanamanInputChange(e, index)}
                      />
                      {tanamanErrors[index]?.rata2_luas_panen && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].rata2_luas_panen}
                        </p>
                      )}
                      <Select
                        size="md"
                        label="Penyebab Luas Panen Kurang dari Luas Tanam"
                        className="w-full"
                        name="penyebab_luas_panen_kurang_dari_luas_tanam"
                        selectedKeys={[
                          tanaman.penyebab_luas_panen_kurang_dari_luas_tanam,
                        ]}
                        placeholder="Pilih Penyebab Luas Panen Kurang dari Luas Tanam"
                        onChange={(e) =>
                          handleTanamanSelectChange(
                            e.target.value,
                            index,
                            "penyebab_luas_panen_kurang_dari_luas_tanam"
                          )
                        }
                        isDisabled={
                          tanaman.rata2_luas_tanam === "" ||
                          tanaman.rata2_luas_panen === "" ||
                          parseFloat(tanaman.rata2_luas_panen) ==
                            parseFloat(tanaman.rata2_luas_tanam)
                        }
                      >
                        {penyebabLuasPanenKurangOptions.map((item) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>

                      {tanamanErrors[index]
                        ?.penyebab_luas_panen_kurang_dari_luas_tanam && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {
                            tanamanErrors[index]
                              .penyebab_luas_panen_kurang_dari_luas_tanam
                          }
                        </p>
                      )}
                      <Input
                        label="Rata-rata Volume Produksi per Panen (kg)"
                        placeholder="Masukkan Rata-rata Volume Produksi per Panen"
                        fullWidth
                        classNames={{
                          inputWrapper: "shadow",
                          input: "text-black",
                        }}
                        name="rata2_volume_produksi"
                        value={tanaman.rata2_volume_produksi}
                        onChange={(e) => handleTanamanInputChange(e, index)}
                      />
                      {tanamanErrors[index]?.rata2_volume_produksi && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].rata2_volume_produksi}
                        </p>
                      )}
                      <Input
                        label="Rata-rata Nilai Produksi per Panen (000 Rp)"
                        placeholder="Masukkan Rata-rata Nilai Produksi per Panen"
                        fullWidth
                        classNames={{
                          inputWrapper: "shadow",
                          input: "text-black",
                        }}
                        name="rata2_nilai_produksi"
                        value={tanaman.rata2_nilai_produksi}
                        onChange={(e) => handleTanamanInputChange(e, index)}
                      />
                      {tanamanErrors[index]?.rata2_nilai_produksi && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].rata2_nilai_produksi}
                        </p>
                      )}
                      <Select
                        size="md"
                        label="Jenis Pupuk yang Digunakan"
                        className="w-full"
                        selectionMode="multiple"
                        name="jenis_pupuk"
                        selectedKeys={tanaman.jenis_pupuk}
                        placeholder="Pilih Jenis Pupuk yang Digunakan"
                        onSelectionChange={(e) =>
                          handleTanamanSelectChange(e, index, "jenis_pupuk")
                        }
                      >
                        {jenisPupukOptions.map((item) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      {tanamanErrors[index]?.jenis_pupuk && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].jenis_pupuk}
                        </p>
                      )}
                      <Select
                        size="md"
                        label="Pernah Mendapat Penyuluhan dari Aparat/Dinas Setempat?"
                        className="w-full"
                        name="is_penyuluhan"
                        selectedKeys={[tanaman.is_penyuluhan]}
                        placeholder="Pilih Ya/Tidak"
                        onChange={(e) =>
                          handleTanamanSelectChange(
                            e.target.value,
                            index,
                            "is_penyuluhan"
                          )
                        }
                      >
                        {isPenyuluhanOptions.map((item) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      {tanamanErrors[index]?.is_penyuluhan && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].is_penyuluhan}
                        </p>
                      )}
                      <Select
                        size="md"
                        label="Pemanfaatan Hasil Produksi"
                        className="w-full"
                        name="pemanfaatan_produk"
                        selectedKeys={[tanaman.pemanfaatan_produk]}
                        placeholder="Pilih Pemanfaatan Hasil Produksi"
                        onChange={(e) =>
                          handleTanamanSelectChange(
                            e.target.value,
                            index,
                            "pemanfaatan_produk"
                          )
                        }
                      >
                        {pemanfaatanProdukOptions.map((item) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </Select>
                      {tanamanErrors[index]?.pemanfaatan_produk && (
                        <p className="ml-3 text-sm text-red-600 font-inter">
                          {tanamanErrors[index].pemanfaatan_produk}
                        </p>
                      )}
                      {daftarTanaman.length > 1 && (
                        <button
                          type="button"
                          className="p-1 mt-4 absolute bottom-2 right-2 text-white bg-red-500 rounded text-[14px] group"
                          onClick={() => removeTanamanForm(index)}
                        >
                          <div className="relative"></div>
                          <MdDeleteForever size={20} />
                          <span className="absolute hidden px-2 py-1 mb-2 text-xs text-white transform -translate-x-1/2 bg-black rounded left-1/2 bottom-full group-hover:block">
                            Hapus Tanaman
                          </span>
                        </button>
                      )}
                    </div>
                  </>
                ))}
                {daftarTanaman.length < 3 && (
                  <button
                    type="button"
                    className="px-2 py-1 mt-4 text-white bg-green-500 rounded text-[14px]"
                    onClick={addTanamanForm}
                  >
                    Tambah Tanaman
                  </button>
                )}
              </div>
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
                className="font-semibold text-white bg-pgreen font-inter"
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
