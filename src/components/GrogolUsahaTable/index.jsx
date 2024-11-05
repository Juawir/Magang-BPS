/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
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
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { columns } from "./data";
import { SearchIcon } from "./SearchIcon";
import "./table.css";
import { FaPlus } from "react-icons/fa6";
import { message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import "leaflet/dist/leaflet.css";
import AddRutaModal from "./AddRutaModal";
import DetailRutaModal from "./DetailRutaModal";
import EditRutaModal from "./EditRutaModal";
import api4 from "../../utils/api4";
import { useMediaQuery } from "react-responsive";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { SiMicrosoftexcel } from "react-icons/si";
import { AiTwotoneDelete } from "react-icons/ai";

const GrogolUsahaTable = ({ fetchDataAggregate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRuta, setSelectedRuta] = useState(null);
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
  // const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isSatuan, setIsSatuan] = useState(true);
  const [loading, setLoading] = useState(true); // State untuk loading
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const fetchData = async () => {
    setLoading(true); // Mulai loading
    try {
      const [rtResponse, rutaResponse] = await Promise.all([
        api4.get("/api/sls"),
        api4.get("/api/usahaSayuran"),
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
      await api4.delete(`/api/usahaSayuran/${ruta._id}`);
      setDataRuta(dataRuta.filter((item) => item._id !== ruta._id));
      message.success(
        `Usaha ${ruta.nama_pengusaha} berhasil dihapus.`,
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

  const deleteManyData = async (idsArray) => {
    setLoading(true);
    try {
      await api4.delete(`/api/usahaSayuran/many`, {
        data: idsArray,
      });
      const successMessage = idsArray.includes("all")
        ? "Berhasil menghapus semua usaha."
        : `Berhasil menghapus ${idsArray.length} usaha.`;

      message.success(successMessage, 5);
      setSelectedKeys(new Set([]));
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

  const filteredData = dataRuta.filter((ruta) =>
    Object.values(ruta).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
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
                title="Hapus Data Usaha Sayuran"
                description="Anda yakin menghapus data usaha sayuran ini?"
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

  // const keyToLabelMap = pemanfaatan_produk.reduce((map, item) => {
  //   map[item.key] = item.label;
  //   return map;
  // }, {});

  // const formatPemanfaatanProduk = (produkArray) => {
  //   return produkArray
  //     .map((key) => keyToLabelMap[key] || key) // Ganti key dengan label
  //     .join(", ");
  // };

  // const exportToExcel = (data, fileName) => {
  //   // Menghapus atribut _id dan __v dari setiap objek dalam data
  //   const filteredData = data.map(({ _id, __v, ...rest }) => rest);

  //   const updatedData = filteredData.map((item) => ({
  //     ...item,
  //     // pemanfaatan_produk: formatPemanfaatanProduk(item.pemanfaatan_produk),
  //   }));

  //   // Membuat worksheet dari data yang sudah difilter
  //   const ws = XLSX.utils.json_to_sheet(updatedData);

  //   // Mendapatkan range dari worksheet
  //   const range = XLSX.utils.decode_range(ws["!ref"]);

  //   // Membuat style untuk header yang bold
  //   const headerStyle = { font: { bold: true } };

  //   // Menerapkan style bold ke setiap sel di baris pertama (header)
  //   for (let col = range.s.c; col <= range.e.c; col++) {
  //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
  //     if (!ws[cellAddress]) continue;
  //     ws[cellAddress].s = headerStyle;
  //   }

  //   // Menyetel lebar kolom agar sesuai dengan konten
  //   const columnWidths = filteredData.reduce((acc, row) => {
  //     Object.keys(row).forEach((key, i) => {
  //       const cellValue = row[key] ? row[key].toString() : "";
  //       acc[i] = Math.max(acc[i] || 0, cellValue.length);
  //     });
  //     return acc;
  //   }, {});

  //   ws["!cols"] = Object.keys(columnWidths).map((i) => ({
  //     wch: columnWidths[i],
  //   }));

  //   // Membuat workbook dan menambahkan worksheet
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  //   // Mengonversi workbook ke array buffer
  //   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  //   // Menyimpan file menggunakan FileSaver
  //   const blob = new Blob([wbout], { type: "application/octet-stream" });
  //   FileSaver.saveAs(blob, `${fileName}.xlsx`);
  // };

  const exportToExcel = (data, fileName) => {
    const usahaSayuranData = [];
    const tanamanData = [];

    data.forEach((usaha) => {
      // Menambahkan data usaha sayuran
      const usahaSayuran = {
        _id: usaha._id,
        kode: usaha.kode,
        kodeSls: usaha.kodeSls,
        rt_rw_dusun: usaha.rt_rw_dusun,
        latitude: usaha.latitude,
        longitude: usaha.longitude,
        nama_kepala_keluarga: usaha.nama_kepala_keluarga,
        nama_pengusaha: usaha.nama_pengusaha,
        jenis_kelamin: usaha.jenis_kelamin,
        umur: usaha.umur,
        pendidikan_terakhir: usaha.pendidikan_terakhir,
      };
      usahaSayuranData.push(usahaSayuran);

      // Menambahkan data tanaman
      usaha.daftar_tanaman.forEach((tanaman) => {
        const tanamanUnit = {
          nama_tanaman: tanaman.nama_tanaman,
          frekuensi_tanam: tanaman.frekuensi_tanam,
          rata2_luas_tanam: tanaman.rata2_luas_tanam,
          frekuensi_panen: tanaman.frekuensi_panen,
          rata2_luas_panen: tanaman.rata2_luas_panen,
          penyebab_luas_panen_kurang_dari_luas_tanam:
            tanaman.penyebab_luas_panen_kurang_dari_luas_tanam,
          rata2_volume_produksi: tanaman.rata2_volume_produksi,
          rata2_nilai_produksi: tanaman.rata2_nilai_produksi,
          jenis_pupuk: tanaman.jenis_pupuk,
          is_penyuluhan: tanaman.is_penyuluhan,
          pemanfaatan_produk: tanaman.pemanfaatan_produk,
        };
        tanamanData.push(tanamanUnit);
      });
    });

    // Fungsi untuk membuat worksheet
    const createWorksheet = (data, sheetName) => {
      const filteredData = data.map(({ __v, ...rest }) => rest);

      const updatedData = filteredData.map((item) => ({
        ...item,
        // pemanfaatan_produk: formatPemanfaatanProduk(item.pemanfaatan_produk),
      }));

      // Membuat worksheet dari data yang sudah difilter
      const ws = XLSX.utils.json_to_sheet(updatedData);

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

      return ws;
    };

    // Membuat workbook dan menambahkan worksheet
    const wb = XLSX.utils.book_new();
    const wsUsahaSayuran = createWorksheet(usahaSayuranData, "Usaha Sayuran");
    const wsTanaman = createWorksheet(tanamanData, "Tanaman");

    XLSX.utils.book_append_sheet(wb, wsUsahaSayuran, "Usaha Sayuran");
    XLSX.utils.book_append_sheet(wb, wsTanaman, "Tanaman");

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
    const fileName = `Data Usaha Sayuran Grogol ${formattedDateTime}`;
    exportToExcel(dataRuta, fileName);
  };

  const containsAllElements = (arr, elements) => {
    return elements.every((element) => arr.includes(element));
  };

  const handleDeleteManyUsaha = () => {
    const allValue = ["a", "l", "l"];
    const idsArray = [...selectedKeys];
    console.log("idsArray: ", idsArray);
    if (idsArray.length > 0) {
      if (containsAllElements(idsArray, allValue)) {
        deleteManyData([idsArray.join("")]);
      } else {
        deleteManyData(idsArray);
      }
    }
  };

  return (
    <div className="p-4 bg-[#ffffffb4] rounded-xl">
      <div className="flex justify-between">
        <Input
          label="Pencarian"
          radius="lg"
          classNames={{
            inputWrapper: "shadow",
          }}
          className="mb-4 w-[50%] grogol-usaha-search"
          placeholder="Ketikkan kata kunci..."
          startContent={
            <SearchIcon className="mb-0.5 text-pgreen pointer-events-none flex-shrink-0" />
          }
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="flex gap-2">
          <div
            className="relative"
            // onMouseLeave={() => !isMobile && setDropdownVisible(false)}
          >
            <Button
              color="primary"
              className="text-[14px] font-semibold text-white"
              startContent={<FaPlus className="text-[20px] text-white" />}
              // onMouseEnter={() => !isMobile && setDropdownVisible(true)}
              onClick={handleSatuanAddModal}
            >
              Tambah
            </Button>
            {/* {dropdownVisible && (
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
            )} */}
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
      {/* <div className="relative"> */}
      <Table
        aria-label="Example table with custom cells"
        shadow="none"
        className="shadow rounded-xl font-inter grogol-usaha-table"
        classNames={{ loadingWrapper: "mx-auto" }}
        bottomContent={
          <div className="relative flex justify-center w-full">
            <Popconfirm
              title="Hapus Banyak Usaha Sayuran"
              description="Anda yakin menghapus Usaha Sayuran ini?"
              onConfirm={() => handleDeleteManyUsaha()}
              onOpenChange={() => console.log("open change")}
            >
              <AiTwotoneDelete
                className="absolute bottom-0 left-0 m-[10px] text-red-600 cursor-pointer"
                size={25}
              />
            </Popconfirm>
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
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        selectionBehavior="toggle"
        onRowAction={() => null}
      >
        <TableHeader columns={columns} className="font-inter text-pgreen">
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
            <Bars width="50" height="50" color="#68B92E" className="mx-auto" />
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

      {/* </div> */}

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
        daftarSls={dataRt}
        // jenis_klengkeng={jenis_klengkeng}
        // jenis_pupuk={jenis_pupuk}
        // pemanfaatan_produk={pemanfaatan_produk}
        fetchData={fetchData}
        fetchDataAggregate={fetchDataAggregate}
      />

      <EditRutaModal
        isEditModalOpen={isEditModalOpen}
        onEditModalOpenChange={onEditModalOpenChange}
        ruta={editRutaData}
        fetchData={fetchData}
        fetchDataAggregate={fetchDataAggregate}
        // jenis_klengkeng={jenis_klengkeng}
        // jenis_pupuk={jenis_pupuk}
        // pemanfaatan_produk={pemanfaatan_produk}
      />
    </div>
  );
};

export default GrogolUsahaTable;
