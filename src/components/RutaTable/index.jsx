import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Input,
  Button,
  useDisclosure,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import {
  bentuk_badan_usaha,
  columns,
  jenis_kelamin,
  kategori_usaha,
  lokasi_tempat_usaha,
  pendidikan_terakhir,
  skala_usaha,
} from "./data";
import { SearchIcon } from "./SearchIcon";
import "./table.css";
import { FaPlus } from "react-icons/fa6";
import { SiMicrosoftexcel } from "react-icons/si";
import { message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Bars } from "react-loader-spinner";
import "leaflet/dist/leaflet.css";
import AddRutaModal from "./AddRutaModal";
import DetailRutaModal from "./DetailRutaModal";
import EditRutaModal from "./EditRutaModal";
import { useMediaQuery } from "react-responsive";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const RutaTable = ({ fetchDataAggregate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [selectedLokasiTempatUsaha, setSelectedLokasiTempatUsaha] =
    useState("");
  const [dataRuta, setDataRuta] = useState([]);
  const [dataRt, setDataRt] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onOpenChange: onAddModalOpenChange,
  } = useDisclosure();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // State untuk modal edit
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure();
  const [editRutaData, setEditRutaData] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isSatuan, setIsSatuan] = useState(true);
  const [loading, setLoading] = useState(true); // State untuk loading

  const fetchData = async () => {
    setLoading(true); // Mulai loading
    try {
      const [rtResponse, rutaResponse] = await Promise.all([
        api.get("/api/rt"),
        api.get("/api/rumahTangga"),
      ]);
      setDataRt(rtResponse.data.data);
      console.log("Check dataRt", rtResponse.data.data);
      setDataRuta(rutaResponse.data.data);
      console.log("Check dataRuta", rutaResponse.data.data);
    } catch (error) {
      // Cek jika error memiliki respons body
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Terjadi kesalahan: ${error.response.data.message}`, 5);
      } else {
        // Jika error tidak memiliki respons body yang dapat diakses
        message.error(`Terjadi kesalahan: ${error.message}`, 5);
      }
    } finally {
      setLoading(false); // Akhiri loading
    }
  };

  const deleteData = async (ruta) => {
    setLoading(true);
    try {
      await api.delete(`/api/rumahTangga/${ruta._id}`);
      setDataRuta(dataRuta.filter((item) => item._id !== ruta._id));
      message.success(
        `UMKM ${ruta.nama_pemilik_penanggungjawab} berhasil dihapus.`,
        5
      );
      fetchData();
      fetchDataAggregate();
    } catch (error) {
      // Cek jika error memiliki respons body
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(
          `Terjadi kesalahan pada proses hapus data: ${error.response.data.message}`,
          5
        );
      } else {
        // Jika error tidak memiliki respons body yang dapat diakses
        message.error(
          `Terjadi kesalahan pada proses hapus data: ${error.message}`,
          5
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data from API
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLokasiChange = (value) => {
    console.log("handleLokasiChange: ", value);
    setSelectedLokasiTempatUsaha(value);
  };

  const handleDetailClick = (ruta) => {
    setSelectedRuta(ruta);
    onOpen();
  };

  const handleEditClick = (ruta) => {
    console.log("handleEditClick: ", ruta);
    setEditRutaData(ruta);
    onEditModalOpen();
  };

  const handleDelete = (ruta) => {
    deleteData(ruta);
  };

  const filteredData = dataRuta
    .filter((ruta) =>
      Object.values(ruta).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((ruta) =>
      selectedLokasiTempatUsaha
        ? ruta.lokasi_tempat_usaha === selectedLokasiTempatUsaha
        : true
    );

  const renderCell = (ruta, columnKey) => {
    const cellValue = ruta[columnKey];

    switch (columnKey) {
      case "aksi":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detail">
              <span
                className="text-lg cursor-pointer text-default-400 active:opacity-50"
                onClick={() => handleDetailClick(ruta)}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span
                className="text-lg cursor-pointer text-default-400 active:opacity-50"
                onClick={() => handleEditClick(ruta)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Hapus">
              <Popconfirm
                title="Hapus Data UMKM"
                description="Anda yakin menghapus data UMKM ini?"
                onConfirm={() => handleDelete(ruta)}
                onOpenChange={() => console.log("open change")}
              >
                <span className="text-lg cursor-pointer text-danger active:opacity-50">
                  <DeleteIcon />
                </span>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(dataRuta.length / rowsPerPage);

  console.log(pages);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData.slice(start, end);
  }, [page, filteredData]);

  const handleSatuanAddModal = () => {
    onAddModalOpen();
    setIsSatuan(true);
  };
  const handleKumpulanAddModal = () => {
    onAddModalOpen();
    setIsSatuan(false);
  };

  const handleButtonClick = () => {
    if (isMobile) {
      setDropdownVisible(!dropdownVisible);
    }
  };

  const exportToExcel = (data, fileName) => {
    // Menghapus atribut _id dan __v dari setiap objek dalam data
    const filteredData = data.map(({ _id, __v, ...rest }) => rest);

    // Membuat worksheet dari data yang sudah difilter
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Mendapatkan range dari worksheet
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // Membuat style untuk header yang bold
    const headerStyle = { font: { bold: true } };

    // Menerapkan style bold ke setiap sel di baris pertama (header)
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = headerStyle;
    }

    // Menyetel lebar kolom agar sesuai dengan konten
    const columnWidths = filteredData.reduce((acc, row) => {
      Object.keys(row).forEach((key, i) => {
        const cellValue = row[key] ? row[key].toString() : "";
        acc[i] = Math.max(acc[i] || 0, cellValue.length);
      });
      return acc;
    }, {});

    ws["!cols"] = Object.keys(columnWidths).map((i) => ({
      wch: columnWidths[i],
    }));

    // Membuat workbook dan menambahkan worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Mengonversi workbook ke array buffer
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Menyimpan file menggunakan FileSaver
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  };

  const getFormattedDateTime = () => {
    const now = new Date();

    // Ambil komponen tanggal dan waktu
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Format tanggal dan waktu sesuai dengan "dd-MM-yyyy HH:mm"
    return `${day}-${month}-${year} ${hours}.${minutes}`;
  };

  const handleEksporButtonClick = () => {
    const formattedDateTime = getFormattedDateTime();
    const fileName = `Data UMKM Simoangin-angin ${formattedDateTime}`;
    exportToExcel(dataRuta, fileName);
  };

  return (
    <div className="p-4 bg-[#ffffffb4] rounded-xl">
      <div className="flex justify-between gap-3">
        {/* <Input
          label="Pencarian"
          radius="lg"
          classNames={{
            inputWrapper: "shadow",
          }}
          className="mb-4 w-[50%] simoanginangin-umkm-search"
          placeholder="Ketikkan kata kunci..."
          startContent={
            <SearchIcon className="mb-0.5 text-pdarkblue pointer-events-none flex-shrink-0" />
          }
          value={searchTerm}
          onChange={handleSearchChange}
        /> */}
        <div className="flex items-center w-full gap-3 mb-4">
          <Input
            label="Pencarian"
            radius="lg"
            classNames={{
              inputWrapper: "shadow",
            }}
            className="w-[50%] simoanginangin-umkm-search"
            placeholder="Ketikkan kata kunci..."
            startContent={
              <SearchIcon className="mb-0.5 text-pdarkblue pointer-events-none flex-shrink-0" />
            }
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Tambahkan komponen Select untuk filter */}
          <Select
            label="Lokasi Tempat Usaha"
            placeholder="Pilih filter"
            classNames={{
              inputWrapper: "shadow",
            }}
            className="w-[50%] simoanginangin-umkm-search"
            onChange={(e) =>handleLokasiChange(e.target.value)}
          >
            {lokasi_tempat_usaha.map((lokasi) => (
              <SelectItem key={lokasi.key}>{lokasi.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          <div
            className="relative"
            onMouseLeave={() => !isMobile && setDropdownVisible(false)}
          >
            <Button
              color="primary"
              className="text-[14px] font-semibold text-white"
              startContent={<FaPlus className="text-[20px] text-white" />}
              onMouseEnter={() => !isMobile && setDropdownVisible(true)}
              onClick={handleButtonClick}
            >
              Tambah
            </Button>
            {dropdownVisible && (
              <div className="absolute right-0 z-50 mt-2 bg-white border w-full border-gray-200 rounded-xl shadow-lg top-10 text-[14px] text-pdarkblue font-inter">
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 rounded-md hover:bg-gray-100"
                    onClick={handleSatuanAddModal}
                  >
                    Satuan
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 rounded-md hover:bg-gray-100"
                    onClick={handleKumpulanAddModal}
                  >
                    Kumpulan
                  </a>
                </div>
              </div>
            )}
          </div>
          <Button
            color="success"
            className="text-[14px] font-semibold text-white"
            startContent={
              <SiMicrosoftexcel className="text-[20px] text-white" />
            }
            onClick={handleEksporButtonClick}
          >
            Ekspor
          </Button>
        </div>
      </div>
      <Table
        aria-label="Example table with custom cells"
        shadow="none"
        className="shadow rounded-xl font-inter simoanginangin-umkm-table"
        classNames={{ loadingWrapper: "mx-auto" }}
        bottomContent={
          <div className="flex justify-center w-full">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns} className="font-inter text-pdarkblue">
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "aksi" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={items}
          emptyContent={"Tidak ada data."}
          isLoading={loading}
          loadingContent={
            <Bars width="50" height="50" color="#0B588F" className="mx-auto" />
          }
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DetailRutaModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedRuta={selectedRuta}
      />

      <AddRutaModal
        isOpen={isAddModalOpen}
        onClose={onAddModalOpenChange}
        isSatuan={isSatuan}
        dataRuta={dataRuta}
        daftarRt={dataRt}
        jenis_kelamin={jenis_kelamin}
        pendidikan_terakhir={pendidikan_terakhir}
        kategori_usaha={kategori_usaha}
        bentuk_badan_usaha={bentuk_badan_usaha}
        lokasi_tempat_usaha={lokasi_tempat_usaha}
        skala_usaha={skala_usaha}
        fetchData={fetchData}
        fetchDataAggregate={fetchDataAggregate}
      />

      <EditRutaModal
        isEditModalOpen={isEditModalOpen}
        onEditModalOpenChange={onEditModalOpenChange}
        ruta={editRutaData}
        fetchData={fetchData}
        fetchDataAggregate={fetchDataAggregate}
        daftarRt={dataRt}
        jenis_kelamin={jenis_kelamin}
        pendidikan_terakhir={pendidikan_terakhir}
        kategori_usaha={kategori_usaha}
        bentuk_badan_usaha={bentuk_badan_usaha}
        lokasi_tempat_usaha={lokasi_tempat_usaha}
        skala_usaha={skala_usaha}
      />
    </div>
  );
};

export default RutaTable;
