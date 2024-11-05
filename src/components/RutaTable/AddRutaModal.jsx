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
import { DatePicker, message } from "antd";
import { Bars } from "react-loader-spinner";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@mui/icons-material";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { convertDatesInArray } from "../../utils/date";
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

const AddRutaModal = ({
  isOpen,
  onClose,
  isSatuan,
  dataRuta,
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
  const initialCoordinate = [-7.437249, 112.601518];
  const [addRutaData, setAddRutaData] = useState({});
  const [addRutaDataCache, setAddRutaDataCache] = useState({});
  const [addRutaList, setAddRutaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState(initialCoordinate); // Default position
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
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [createError, setCreateError] = useState(false);

  dayjs.extend(customParseFormat);
  const dateFormat = "DD-MM-YYYY";

  useEffect(() => {
    // Cek apakah addRutaDataCache bukan objek kosong
    if (Object.keys(addRutaDataCache).length > 0 && createError === true) {
      setAddRutaData(addRutaDataCache);
      setSelectedRt(addRutaDataCache.kodeRt);
      setSelectedJenisKelamin(addRutaDataCache.jenis_kelamin);
      setSelectedPendidikanTerakhir(addRutaDataCache.pendidikan_terakhir);
      setSelectedKategoriUsaha(addRutaDataCache.kategori_usaha);
      setSelectedBentukBadanUsaha(addRutaDataCache.bentuk_badan_usaha);
      setSelectedLokasiTempatUsaha(addRutaDataCache.lokasi_tempat_usaha);
      setSelectedSkalaUsaha(addRutaDataCache.skala_usaha);
      console.log("createError", createError);
      console.log("addRutaDataCache", addRutaDataCache);
      setCreateError(false);
    }
  }, [createError]);

  useEffect(() => {
    if (addRutaData.latitude && addRutaData.longitude) {
      const latitude = parseFloat(addRutaData.latitude);
      const longitude = parseFloat(addRutaData.longitude);

      if (errors.latitude === "" && errors.longitude === "") {
        setMapPosition([latitude, longitude]);
      }
    }
  }, [addRutaData.latitude, addRutaData.longitude]);

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
      setAddRutaData((prevValues) => ({ ...prevValues, [name]: updatedValue }));
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
          setAddRutaData((prevValues) => ({
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
          setAddRutaData((prevValues) => ({
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
    setAddRutaData((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === "kodeRt") setSelectedRt(value);
    if (name === "jenis_kelamin") setSelectedJenisKelamin(value);
    if (name === "tanggal_lahir") setSelectedTanggalLahir(value);
    if (name === "pendidikan_terakhir") setSelectedPendidikanTerakhir(value);
    if (name === "kategori_usaha") setSelectedKategoriUsaha(value);
    if (name === "bentuk_badan_usaha") setSelectedBentukBadanUsaha(value);
    if (name === "lokasi_tempat_usaha") setSelectedLokasiTempatUsaha(value);
    if (name === "skala_usaha") setSelectedSkalaUsaha(value);
  };

  const resetSelect = () => {
    setSelectedRt("");
    setSelectedJenisKelamin("");
    setSelectedTanggalLahir("");
    setSelectedPendidikanTerakhir("");
    setSelectedKategoriUsaha("");
    setSelectedBentukBadanUsaha("");
    setSelectedLokasiTempatUsaha("");
    setSelectedSkalaUsaha("");
  };

  const handleDatePickerChange = (date) => {
    setSelectedTanggalLahir(date ? date.format("DD-MM-YYYY") : null);
    setAddRutaData((prevValues) => ({
      ...prevValues,
      ["tanggal_lahir"]: date ? date.format("DD-MM-YYYY") : null,
    }));
    console.log(date ? date.format("DD-MM-YYYY") : null);
  };

  const validateForm = (addRutaData) => {
    console.log("validateForm", addRutaData);
    const newErrors = {};

    // Validasi setiap field
    if (!addRutaData.kodeRt) newErrors.kodeRt = "Identitas SLS wajib dipilih.";
    if (!addRutaData.no_urut_bangunan)
      newErrors.no_urut_bangunan = "No. Urut Bangunan wajib diisi.";
    // if (!addRutaData.nama_kepala_keluarga)
    //   newErrors.nama_kepala_keluarga = "Nama Kepala Keluarga wajib diisi.";
    if (!addRutaData.nama_pemilik_penanggungjawab)
      newErrors.nama_pemilik_penanggungjawab =
        "Nama Pemilik atau Penanggungjawab wajib diisi.";
    if (!addRutaData.jenis_kelamin)
      newErrors.jenis_kelamin = "Jenis Kelamin wajib dipilih.";
    if (!addRutaData.tanggal_lahir)
      newErrors.tanggal_lahir = "Tanggal Lahir wajib dipilih.";
    if (!addRutaData.nik) newErrors.nik = "NIK wajib diisi.";
    if (!addRutaData.no_hp) newErrors.no_hp = "No. HP wajib diisi.";
    if (!addRutaData.pendidikan_terakhir)
      newErrors.pendidikan_terakhir = "Pendidikan Terakhir wajib dipilih.";
    if (!addRutaData.nama_usaha)
      newErrors.nama_usaha = "Nama Usaha wajib diisi.";
    if (!addRutaData.kegiatan_utama_usaha)
      newErrors.kegiatan_utama_usaha = "Kegiatan Utama Usaha wajib diisi.";
    if (!addRutaData.kategori_usaha)
      newErrors.kategori_usaha = "Kategori Usaha wajib dipilih.";
    if (!addRutaData.bentuk_badan_usaha)
      newErrors.bentuk_badan_usaha = "Bentuk Badan Usaha wajib dipilih.";
    if (!addRutaData.lokasi_tempat_usaha)
      newErrors.lokasi_tempat_usaha = "Lokasi Tempat Usaha wajib dipilih.";
    if (!addRutaData.skala_usaha)
      newErrors.skala_usaha = "Skala Usaha wajib dipilih.";
    if (!addRutaData.alamat) newErrors.alamat = "Alamat wajib diisi.";
    // if (!addRutaData.catatan)
    //   newErrors.catatan = "Catatan wajib diisi.";
    if (!addRutaData.latitude) newErrors.latitude = "Latitude wajib diisi.";
    if (!addRutaData.longitude) newErrors.longitude = "Longitude wajib diisi.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatNumber = (input) => {
    // Tambahkan 1 ke input
    const incrementedValue = input + 1;

    // Konversi angka menjadi string dan format dengan padding 3 digit
    const formattedString = incrementedValue.toString().padStart(3, "0");

    return formattedString;
  };

  function incrementLastThreeDigits(code) {
    // Memastikan panjang string yang valid
    if (code.length < 3) {
      throw new Error("String must be at least 3 characters long");
    }

    // Pisahkan string menjadi dua bagian
    const lastThreeDigits = code.slice(-3); // Ambil tiga digit terakhir
    const remainingString = code.slice(0, -3); // Ambil string sisanya

    console.log("Last Three Digits:", lastThreeDigits);
    console.log("Remaining String:", remainingString);

    // Tambahkan satu pada tiga digit terakhir
    const incrementedLastThree = (parseInt(lastThreeDigits, 10) + 1)
      .toString()
      .padStart(3, "0");

    console.log("Incremented Last Three Digits:", incrementedLastThree);

    // Gabungkan string sisanya dengan tiga digit terakhir yang diperbarui
    const finalCode = remainingString + incrementedLastThree;

    console.log("Final Code:", finalCode);

    return finalCode;
  }

  function incrementLargestCodeByKodeRt(array, kodeRt) {
    // Filter objek berdasarkan kodeRt
    const filteredArray = array.filter((obj) => obj.kodeRt === kodeRt);
    console.log("Filtered Array:", filteredArray);

    // Jika tidak ada objek yang memenuhi kriteria, kembalikan null atau penanganan error
    if (filteredArray.length === 0) {
      console.log("No objects found for the given kodeRt");
      return incrementLastThreeDigits(kodeRt + "000"); // Atau Anda bisa menggunakan throw new Error('No objects found for the given kodeRt');
    }

    // Temukan kode string terbesar di antara objek yang sudah difilter
    const largestCode = filteredArray.reduce((max, obj) => {
      return obj.kode > max ? obj.kode : max;
    }, "");
    console.log("Largest Code:", largestCode);

    // // Tambahkan satu pada kode string terbesar
    // const largestCodeLength = largestCode.length;
    // const incrementedCode = (parseInt(largestCode, 10) + 1).toString();

    // // Pastikan panjang kode tetap konsisten dengan kode terbesar yang ditemukan
    // const paddedCode = incrementedCode.padStart(largestCodeLength, "0");
    // console.log("Padded Incremented Code:", paddedCode);

    // // Hasil akhir
    // const finalCode = paddedCode;
    // console.log("Final Code:", finalCode);

    return incrementLastThreeDigits(largestCode);
  }

  const handleAddSave = async () => {
    console.log("handleAddSave ", addRutaData);
    if (addRutaData && isSatuan) {
      if (!validateForm(addRutaData)) {
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

      console.log("Add Ruta Data", addRutaData);
      setAddRutaDataCache(addRutaData);
      const convertedData = {
        ...addRutaData,
        // kode: incrementLargestCodeByKodeRt(dataRuta, addRutaData.kodeRt), // Pastikan ini sesuai dengan kebutuhan
        rt_rw_dusun: getLabelByKey(addRutaData.kodeRt, daftarRt),
        latitude: parseFloat(addRutaData.latitude),
        longitude: parseFloat(addRutaData.longitude),
        // jumlahUmkm, // Tambahkan jumlah UMKM ke data yang akan disimpan
      };

      console.log("Data Ruta", convertedData);

      // Lanjutkan dengan penyimpanan data
      await createData(convertedData);

      setAddRutaData({});
      setErrors({});
      resetSelect();
      await fetchDataAggregate();
    } else {
      try {
        console.log("Add Ruta Data List", addRutaList);
        await createData(addRutaList);
        setAddRutaData({});
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
      await api.post("/api/rumahTangga", data);
      if (isSatuan) {
        message.success(
          `UMKM ${data.nama_pemilik_penanggungjawab} berhasil dibuat.`,
          5
        );
      } else {
        message.success(
          `Data UMKM sebanyak ${data.length} berhasil dibuat.`,
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
        console.log("Habis error kesini 1");
        setCreateError(true);
        // initializeAfterError(data);
      } else {
        message.error(`Terjadi kesalahan: ${error.message}`, 5);
        console.log("Habis error kesini 2");
        console.log("AddRutaData when error", addRutaData);
        setCreateError(true);
        // initializeAfterError(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseButton = () => {
    setAddRutaData({});
    resetSelect();
    setErrors({});
    onClose();
  };

  function generateKodeRumahTangga(inputArray, rutaList) {
    const rtCountMap = {};

    // Hitung jumlah rumah tangga untuk setiap kodeRt dalam rutaList
    rutaList.forEach((ruta) => {
      const { kodeRt } = ruta;
      if (!rtCountMap[kodeRt]) {
        rtCountMap[kodeRt] = 0;
      }
      rtCountMap[kodeRt]++;
    });

    // Tambahkan kode rumah tangga untuk setiap objek dalam inputArray
    return inputArray.map((item) => {
      const { kodeRt } = item;
      if (!rtCountMap[kodeRt]) {
        rtCountMap[kodeRt] = 0;
      }
      rtCountMap[kodeRt]++;
      const noUrut = rtCountMap[kodeRt].toString().padStart(3, "0");
      const kodeRumahTangga = `${kodeRt}${noUrut}`;

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

        setAddRutaList(readyRutaList);

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
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5693/5693840.png", // Replace with your custom icon URL
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
      <ModalContent className="font-inter text-pdarkblue">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white bg-slate-600">
              Tambah Keluarga UMKM
            </ModalHeader>
            <ModalBody className="py-4">
              {isSatuan ? (
                <div className="space-y-4 simoanginangin-umkm-add">
                  <Select
                    size="md"
                    label="Identitas SLS"
                    className="w-full"
                    name="kodeRt"
                    selectedKeys={selectedRt ? [selectedRt] : []}
                    placeholder="Pilih Identitas SLS"
                    onChange={handleSelectChange}
                  >
                    {daftarRt.map((item) => (
                      <SelectItem key={item.kode} value={item.kode}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {errors.kodeRt && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.kodeRt}
                    </p>
                  )}
                  <Input
                    label="No. Urut Bangunan"
                    placeholder="Masukkan No. Urut Bangunan"
                    fullWidth
                    classNames={{ inputWrapper: "shadow", input: "text-black" }}
                    name="no_urut_bangunan"
                    value={addRutaData.no_urut_bangunan}
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
                    value={addRutaData.nama_kepala_keluarga}
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
                    value={addRutaData.nama_pemilik_penanggungjawab}
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
                  <div className="relative w-full">
                    <h2 className="absolute top-[4px] left-[14px] z-50 text-pdarkblue text-[14px] font-semibold">
                      Tanggal Lahir
                    </h2>
                    <DatePicker
                      label="Tanggal Lahir"
                      placeholder="Pilih Tanggal Lahir"
                      size="middle"
                      className="w-full h-[50px] shadow rounded-xl border-none font-inter"
                      name="tanggal_lahir"
                      maxDate={dayjs()}
                      format={dateFormat}
                      onChange={handleDatePickerChange}
                    />
                  </div>
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
                    value={addRutaData.nik}
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
                    value={addRutaData.no_hp}
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
                    value={addRutaData.nama_usaha}
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
                    value={addRutaData.kegiatan_utama_usaha}
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
                      selectedLokasiTempatUsaha
                        ? [selectedLokasiTempatUsaha]
                        : []
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
                    selectedKeys={
                      selectedSkalaUsaha ? [selectedSkalaUsaha] : []
                    }
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
                    value={addRutaData.alamat}
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
                    value={addRutaData.catatan}
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
                    value={addRutaData.latitude}
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
                    value={addRutaData.longitude}
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
                className="bg-[#0B588F] text-white font-inter font-semibold"
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
