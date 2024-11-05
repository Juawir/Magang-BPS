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
import { DatePicker, message } from "antd";
import { Bars } from "react-loader-spinner";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
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

const isValidPendapatanSebulanTerakhir = (pendapatanSebulanTerakhir) => {
  return pendapatanSebulanTerakhir >= 0;
};

const EditRutaModal = ({
  isEditModalOpen,
  onEditModalOpenChange,
  ruta,
  fetchData,
  fetchDataAggregate,
  daftarRt,
  jenis_kelamin,
  pendidikan_terakhir,
  kategori_usaha,
  bentuk_badan_usaha,
  lokasi_tempat_usaha,
  skala_usaha,
}) => {
  // Initialize state with default values
  const [editRutaData, setEditRutaData] = useState({});
  const [oldRutaData, setOldRutaData] = useState({});
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState([0, 0]); // Initialize map position
  const [selectedRt, setSelectedRt] = useState("");
  const [selectedJenisKelamin, setSelectedJenisKelamin] = useState("");
  const [selectedTanggalLahir, setSelectedTanggalLahir] = useState("");
  const [selectedPendidikanTerakhir, setSelectedPendidikanTerakhir] =
    useState("");
  const [selectedKategoriUsaha, setSelectedKategoriUsaha] = useState("");
  const [selectedBentukBadanUsaha, setSelectedBentukBadanUsaha] = useState("");
  const [selectedLokasiTempatUsaha, setSelectedLokasiTempatUsaha] =
    useState("");
  const [selectedSkalaUsaha, setSelectedSkalaUsaha] = useState("");
  const [errors, setErrors] = useState({});

  dayjs.extend(customParseFormat);
  const dateFormat = "DD-MM-YYYY";

  useEffect(() => {
    if (ruta) {
      const ruta2 = {
        ...ruta,
        ["no_urut_bangunan"]: ruta.no_urut_bangunan
          ? ruta.no_urut_bangunan.padStart(3, "0")
          : "",
      };
      setEditRutaData(ruta2);
      setOldRutaData(ruta2);
      setSelectedRt(ruta2.kodeRt);
      setSelectedJenisKelamin(ruta2.jenis_kelamin);
      setSelectedTanggalLahir(ruta2.tanggal_lahir);
      setSelectedPendidikanTerakhir(ruta2.pendidikan_terakhir);
      setSelectedKategoriUsaha(ruta2.kategori_usaha);
      setSelectedBentukBadanUsaha(ruta2.bentuk_badan_usaha);
      setSelectedLokasiTempatUsaha(ruta2.lokasi_tempat_usaha);
      setSelectedSkalaUsaha(ruta2.skala_usaha);
    }
  }, [ruta]);

  // Update mapPosition when ruta changes
  useEffect(() => {
    if (ruta && ruta.latitude && ruta.longitude) {
      setMapPosition([ruta.latitude, ruta.longitude]);
    }
  }, [ruta]);

  useEffect(() => {
    if (editRutaData.latitude && editRutaData.longitude) {
      if (
        (!errors.latitude && !errors.longitude) ||
        (errors.latitude === "" && errors.longitude === "")
      ) {
        setMapPosition([editRutaData.latitude, editRutaData.longitude]);
      }
    }
  }, [editRutaData]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditRutaData((prevValues) => ({ ...prevValues, [name]: value }));

  //   if (name === "no_urut_bangunan") {
  //     if (!value) {
  //       errors.no_urut_bangunan = "No. Urut Bangunan harus diisi.";
  //     } else if (!/^\d{3}$/.test(value)) {
  //       errors.no_urut_bangunan =
  //         "No. Urut Bangunan harus berupa angka tiga digit. Contoh: 001";
  //     } else {
  //       errors.no_urut_bangunan = "";
  //     }
  //   }

  //   if (name === "nama_kepala_keluarga") {
  //     if (!value) {
  //       errors.nama_kepala_keluarga = "Nama Kepala Keluarga harus diisi.";
  //     } else {
  //       errors.nama_kepala_keluarga = "";
  //     }
  //   }

  //   if (name === "nama_pemilik_penanggungjawab") {
  //     if (!value) {
  //       errors.nama_pemilik_penanggungjawab =
  //         "Nama Pemilik/Penanggungjawab harus diisi.";
  //     } else {
  //       errors.nama_pemilik_penanggungjawab = "";
  //     }
  //   }

  //   if (name === "nik") {
  //     if (!value) {
  //       errors.nik = "NIK harus diisi.";
  //     } else if (!/^\d{16}$/.test(value)) {
  //       errors.nik = "NIK harus terdiri dari 16 digit angka.";
  //     } else {
  //       errors.nik = "";
  //     }
  //   }

  //   if (name === "no_hp") {
  //     if (!value) {
  //       errors.no_hp = "No. HP harus diisi.";
  //     } else if (!/^08\d{8,11}$/.test(value)) {
  //       errors.no_hp =
  //         "No. HP harus diawali dengan '08' dan terdiri dari 10 hingga 13 digit.";
  //     } else {
  //       errors.no_hp = "";
  //     }
  //   }

  //   if (name === "nama_usaha") {
  //     if (!value) {
  //       errors.nama_usaha = "Nama Usaha harus diisi.";
  //     } else {
  //       errors.nama_usaha = "";
  //     }
  //   }

  //   if (name === "alamat") {
  //     if (!value) {
  //       errors.alamat = "Alamat harus diisi.";
  //     } else {
  //       errors.alamat = "";
  //     }
  //   }

  //   const correctedValue = value.replace(",", ".");

  //   if (name === "latitude") {
  //     if (correctedValue === "") {
  //       errors.latitude = "Latitude harus diisi.";
  //     } else if (isNaN(correctedValue)) {
  //       errors.latitude = "Latitude harus berupa angka.";
  //     } else {
  //       const numericValue = parseFloat(correctedValue);
  //       if (!isValidLatitude(numericValue)) {
  //         errors.latitude = "Latitude harus antara -90 dan 90.";
  //       } else {
  //         errors.latitude = "";
  //         // Update state dengan nilai yang telah dikoreksi
  //         setEditRutaData((prevState) => ({
  //           ...prevState,
  //           [name]: correctedValue,
  //         }));
  //       }
  //     }
  //   }

  //   if (name === "longitude") {
  //     if (correctedValue === "") {
  //       errors.longitude = "Longitude harus diisi.";
  //     } else if (isNaN(correctedValue)) {
  //       errors.longitude = "Longitude harus berupa angka.";
  //     } else {
  //       const numericValue = parseFloat(correctedValue);
  //       if (!isValidLongitude(numericValue)) {
  //         errors.longitude = "Longitude harus antara -180 dan 180.";
  //       } else {
  //         errors.longitude = "";
  //         // Update state dengan nilai yang telah dikoreksi
  //         setEditRutaData((prevState) => ({
  //           ...prevState,
  //           [name]: correctedValue,
  //         }));
  //       }
  //     }
  //   }
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "latitude" || name === "longitude") {
      updatedValue = value.replace(",", "."); // Replace comma with dot for valid decimal format
    }

    if (
      name === "nama_kepala_keluarga" ||
      name === "nama_pemilik_penanggungjawab" ||
      name === "nama_usaha" ||
      name === "alamat" ||
      name === "kegiatan_utama_usaha"
    ) {
      updatedValue = value.toUpperCase();
    }

    if (name !== "latitude" && name !== "longitude") {
      setEditRutaData((prevValues) => ({
        ...prevValues,
        [name]: updatedValue,
      }));
    }

    if (name === "no_urut_bangunan") {
      if (!value) {
        errors.no_urut_bangunan = "No. Urut Bangunan harus diisi.";
      } else if (!/^\d{3}$/.test(value)) {
        errors.no_urut_bangunan =
          "No. Urut Bangunan harus berupa angka tiga digit. Contoh: 001";
      } else {
        errors.no_urut_bangunan = "";
      }
    }

    // if (name === "nama_kepala_keluarga") {
    //   if (!value) {
    //     errors.nama_kepala_keluarga = "Nama Kepala Keluarga harus diisi.";
    //   } else {
    //     errors.nama_kepala_keluarga = "";
    //   }
    // }

    if (name === "nama_pemilik_penanggungjawab") {
      if (!value) {
        errors.nama_pemilik_penanggungjawab =
          "Nama Pemilik/Penanggungjawab harus diisi.";
      } else {
        errors.nama_pemilik_penanggungjawab = "";
      }
    }

    if (name === "nik") {
      if (!value) {
        errors.nik = "NIK harus diisi.";
      } else if (!/^\d{16}$/.test(value)) {
        errors.nik = "NIK harus terdiri dari 16 digit angka.";
      } else {
        errors.nik = "";
      }
    }

    if (name === "no_hp") {
      if (!value) {
        errors.no_hp = "No. HP harus diisi.";
      } else if (!/^08\d{8,11}$/.test(value)) {
        errors.no_hp =
          "No. HP harus diawali dengan '08' dan terdiri dari 10 hingga 13 digit.";
      } else {
        errors.no_hp = "";
      }
    }

    if (name === "nama_usaha") {
      if (!value) {
        errors.nama_usaha = "Nama Usaha harus diisi.";
      } else {
        errors.nama_usaha = "";
      }
    }

    if (name === "alamat") {
      if (!value) {
        errors.alamat = "Alamat harus diisi.";
      } else {
        errors.alamat = "";
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
          setEditRutaData((prevValues) => ({
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
          setEditRutaData((prevValues) => ({
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
    setEditRutaData((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === "kodeRt") setSelectedRt(value);
    if (name === "jenis_kelamin") setSelectedJenisKelamin(value);
    if (name === "tanggal_lahir") setSelectedTanggalLahir(value);
    if (name === "pendidikan_terakhir") setSelectedPendidikanTerakhir(value);
    if (name === "kategori_usaha") setSelectedKategoriUsaha(value);
    if (name === "bentuk_badan_usaha") setSelectedBentukBadanUsaha(value);
    if (name === "lokasi_tempat_usaha") setSelectedLokasiTempatUsaha(value);
    if (name === "skala_usaha") setSelectedSkalaUsaha(value);
  };

  const handleDatePickerChange = (date) => {
    setSelectedTanggalLahir(date ? date.format("DD-MM-YYYY") : null);
    setEditRutaData((prevValues) => ({
      ...prevValues,
      ["tanggal_lahir"]: date ? date.format("DD-MM-YYYY") : null,
    }));
    console.log(date ? date.format("DD-MM-YYYY") : null);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validasi setiap field
    if (!editRutaData.kodeRt) newErrors.kodeRt = "Identitas SLS wajib dipilih.";
    if (!editRutaData.no_urut_bangunan)
      newErrors.no_urut_bangunan = "No. Urut Bangunan wajib diisi.";
    // if (!editRutaData.nama_kepala_keluarga)
    //   newErrors.nama_kepala_keluarga = "Nama Kepala Keluarga wajib diisi.";
    if (!editRutaData.nama_pemilik_penanggungjawab)
      newErrors.nama_pemilik_penanggungjawab =
        "Nama Pemilik atau Penanggungjawab wajib diisi.";
    if (!editRutaData.jenis_kelamin)
      newErrors.jenis_kelamin = "Jenis Kelamin wajib dipilih.";
    if (!editRutaData.tanggal_lahir)
      newErrors.tanggal_lahir = "Tanggal Lahir wajib dipilih.";
    if (!editRutaData.nik) newErrors.nik = "NIK wajib diisi.";
    if (!editRutaData.no_hp) newErrors.no_hp = "No. HP wajib diisi.";
    if (!editRutaData.pendidikan_terakhir)
      newErrors.pendidikan_terakhir = "Pendidikan Terakhir wajib dipilih.";
    if (!editRutaData.nama_usaha)
      newErrors.nama_usaha = "Nama Usaha wajib diisi.";
    if (!editRutaData.kegiatan_utama_usaha)
      newErrors.kegiatan_utama_usaha = "Kegiatan Utama Usaha wajib diisi.";
    if (!editRutaData.kategori_usaha)
      newErrors.kategori_usaha = "Kategori Usaha wajib dipilih.";
    if (!editRutaData.bentuk_badan_usaha)
      newErrors.bentuk_badan_usaha = "Bentuk Badan Usaha wajib dipilih.";
    if (!editRutaData.lokasi_tempat_usaha)
      newErrors.lokasi_tempat_usaha = "Lokasi Tempat Usaha wajib dipilih.";
    if (!editRutaData.skala_usaha)
      newErrors.skala_usaha = "Skala Usaha wajib dipilih.";
    if (!editRutaData.alamat) newErrors.alamat = "Alamat wajib diisi.";
    // if (!editRutaData.catatan)
    //   newErrors.catatan = "Catatan wajib diisi.";
    if (!editRutaData.latitude) newErrors.latitude = "Latitude wajib diisi.";
    if (!editRutaData.longitude) newErrors.longitude = "Longitude wajib diisi.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSave = async () => {
    if (!validateForm()) {
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

    if (editRutaData) {
      const convertedData = {
        ...editRutaData,
        latitude: parseFloat(editRutaData.latitude),
        longitude: parseFloat(editRutaData.longitude),
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
      const response = await api.put(`/api/rumahTangga/${data._id}`, data);
      message.success(
        `UMKM ${data.nama_pemilik_penanggungjawab} berhasil diupdate.`,
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
    setEditRutaData(oldRutaData);
    onEditModalOpenChange(false);
  };

  function capitalizeFirstLetter(string) {
    if (typeof string !== "string" || string.length === 0) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const customMarker = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5693/5693840.png", // Replace with your custom icon URL
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
      <ModalContent className="font-inter text-pdarkblue">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white bg-slate-600">
              Edit Keluarga UMKM
            </ModalHeader>
            <ModalBody className="py-4">
              <div className="space-y-4 simoanginangin-umkm-edit">
                <Input
                  label="Kode"
                  // placeholder="Masukkan No. Urut Bangunan"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="kode"
                  value={editRutaData.kode}
                  onChange={handleInputChange}
                  isReadOnly
                />
                <Input
                  label="Identitas SLS"
                  // placeholder="Masukkan No. Urut Bangunan"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="kode"
                  value={editRutaData.rt_rw_dusun}
                  onChange={handleInputChange}
                  isReadOnly
                />

                <Input
                  label="No. Urut Bangunan"
                  placeholder="Masukkan No. Urut Bangunan"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="no_urut_bangunan"
                  value={editRutaData.no_urut_bangunan}
                  onChange={handleInputChange}
                />
                {errors.no_urut_bangunan && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.no_urut_bangunan}
                  </p>
                )}
                <Input
                  label="Nama Kepala Keluarga"
                  placeholder="Masukkan Nama Kepala Keluarga"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="nama_kepala_keluarga"
                  value={editRutaData.nama_kepala_keluarga}
                  onChange={handleInputChange}
                />
                {errors.nama_kepala_keluarga && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.nama_kepala_keluarga}
                  </p>
                )}
                <Input
                  label="Nama Pemilik/Penanggungjawab"
                  placeholder="Masukkan Nama Pemilik/Penanggungjawab"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="nama_pemilik_penanggungjawab"
                  value={editRutaData.nama_pemilik_penanggungjawab}
                  onChange={handleInputChange}
                />
                {errors.nama_pemilik_penanggungjawab && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.nama_pemilik_penanggungjawab}
                  </p>
                )}
                <Select
                  size="md"
                  label="Jenis Kelamin"
                  className="w-full"
                  name="jenis_kelamin"
                  // value={editRutaData.jenis_kelamin}
                  selectedKeys={
                    selectedJenisKelamin ? [selectedJenisKelamin] : []
                  }
                  placeholder="Pilih Jenis Kelamin"
                  onChange={handleSelectChange}
                >
                  {jenis_kelamin.map((item) => (
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
                {editRutaData.tanggal_lahir !== undefined && (
                  <div className="relative w-full">
                    <h2 className="absolute top-[4px] left-[14px] z-50 text-pdarkblue text-[14px] font-semibold">
                      Tanggal Lahir
                    </h2>
                    {/* {console.log(editRutaData.tanggal_lahir)} */}
                    <DatePicker
                      label="Tanggal Lahir"
                      placeholder="Pilih Tanggal Lahir"
                      size="middle"
                      className="w-full h-[50px] shadow rounded-xl border-none font-inter"
                      name="tanggal_lahir"
                      defaultValue={dayjs(
                        editRutaData.tanggal_lahir,
                        "DD-MM-YYYY"
                      )}
                      maxDate={dayjs()}
                      format={dateFormat}
                      onChange={handleDatePickerChange}
                    />
                  </div>
                )}
                {errors.tanggal_lahir && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.tanggal_lahir}
                  </p>
                )}
                <Input
                  label="NIK"
                  placeholder="Masukkan NIK"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="nik"
                  value={editRutaData.nik}
                  onChange={handleInputChange}
                />
                {errors.nik && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.nik}
                  </p>
                )}
                <Input
                  label="No. HP"
                  placeholder="Masukkan No. HP"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="no_hp"
                  value={editRutaData.no_hp}
                  onChange={handleInputChange}
                />
                {errors.no_hp && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.no_hp}
                  </p>
                )}
                <Select
                  size="md"
                  label="Pendidikan Terakhir"
                  className="w-full"
                  name="pendidikan_terakhir"
                  selectedKeys={
                    selectedPendidikanTerakhir
                      ? [selectedPendidikanTerakhir]
                      : []
                  }
                  placeholder="Pilih Pendidikan Terakhir"
                  onChange={handleSelectChange}
                >
                  {pendidikan_terakhir.map((item) => (
                    <SelectItem key={item.key} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.pendidikan_terakhir && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.pendidikan_terakhir}
                  </p>
                )}
                <Input
                  label="Nama Usaha"
                  placeholder="Masukkan Nama Usaha"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="nama_usaha"
                  value={editRutaData.nama_usaha}
                  onChange={handleInputChange}
                />
                {errors.nama_usaha && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.nama_usaha}
                  </p>
                )}
                <Input
                  label="Kegiatan Utama Usaha"
                  placeholder="Masukkan Kegiatan Utama Usaha"
                  fullWidth
                  classNames={{ inputWrapper: "shadow", input: "text-black" }}
                  name="kegiatan_utama_usaha"
                  value={editRutaData.kegiatan_utama_usaha}
                  onChange={handleInputChange}
                />
                {errors.kegiatan_utama_usaha && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.kegiatan_utama_usaha}
                  </p>
                )}
                <Select
                  size="md"
                  label="Kategori Usaha"
                  className="w-full"
                  name="kategori_usaha"
                  selectedKeys={
                    selectedKategoriUsaha ? [selectedKategoriUsaha] : []
                  }
                  placeholder="Pilih Kategori Usaha"
                  onChange={handleSelectChange}
                >
                  {kategori_usaha.map((item) => (
                    <SelectItem key={item.key} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.kategori_usaha && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.kategori_usaha}
                  </p>
                )}
                <Select
                  size="md"
                  label="Bentuk Badan Usaha"
                  className="w-full"
                  name="bentuk_badan_usaha"
                  selectedKeys={
                    selectedBentukBadanUsaha ? [selectedBentukBadanUsaha] : []
                  }
                  placeholder="Pilih Bentuk Badan Usaha"
                  onChange={handleSelectChange}
                >
                  {bentuk_badan_usaha.map((item) => (
                    <SelectItem key={item.key} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.bentuk_badan_usaha && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.bentuk_badan_usaha}
                  </p>
                )}
                <Select
                  size="md"
                  label="Lokasi Tempat Usaha"
                  className="w-full"
                  name="lokasi_tempat_usaha"
                  selectedKeys={
                    selectedLokasiTempatUsaha ? [selectedLokasiTempatUsaha] : []
                  }
                  placeholder="Pilih Lokasi Tempat Usaha"
                  onChange={handleSelectChange}
                >
                  {lokasi_tempat_usaha.map((item) => (
                    <SelectItem key={item.key} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.lokasi_tempat_usaha && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.lokasi_tempat_usaha}
                  </p>
                )}
                <Select
                  size="md"
                  label="Skala Usaha"
                  className="w-full"
                  name="skala_usaha"
                  selectedKeys={selectedSkalaUsaha ? [selectedSkalaUsaha] : []}
                  placeholder="Pilih Skala Usaha"
                  onChange={handleSelectChange}
                >
                  {skala_usaha.map((item) => (
                    <SelectItem key={item.key} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </Select>
                {errors.skala_usaha && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.skala_usaha}
                  </p>
                )}
                <Textarea
                  label="Alamat"
                  placeholder="Masukkan Alamat"
                  name="alamat"
                  value={editRutaData.alamat}
                  onChange={handleInputChange}
                />
                {errors.alamat && (
                  <p className="ml-3 text-sm text-red-600 font-inter">
                    {errors.alamat}
                  </p>
                )}
                <Textarea
                  label="Catatan"
                  placeholder="Masukkan Catatan"
                  name="catatan"
                  value={editRutaData.catatan}
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
                  value={editRutaData.latitude}
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
                  value={editRutaData.longitude}
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
                      <p className="text-[14px] font-semibold ml-3 my-2">
                        Titik lokasi Rumah Tangga UMKM
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
                          <Popup>Posisi Keluarga UMKM</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
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
                className="bg-[#0B588F] text-white font-inter font-semibold"
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
