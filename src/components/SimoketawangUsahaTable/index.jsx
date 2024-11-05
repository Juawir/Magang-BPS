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
import {
  columns,
  jenis_klengkeng,
  jenis_pupuk,
  pemanfaatan_produk,
} from "./data";
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
import api3 from "../../utils/api3";
import { useMediaQuery } from "react-responsive";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { SiMicrosoftexcel } from "react-icons/si";
import { AiTwotoneDelete } from "react-icons/ai";

const SimoketawangUsahaTable = ({ fetchDataAggregate }) => {
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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isSatuan, setIsSatuan] = useState(true);
  const [loading, setLoading] = useState(true); // State untuk loading
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const fetchData = async () => {
    setLoading(true); // Mulai loading
    try {
      const [rtResponse, rutaResponse] = await Promise.all([
        api3.get("/api/sls"),
        api3.get("/api/usahaKlengkeng"),
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
      await api3.delete(`/api/usahaKlengkeng/${ruta._id}`);
      setDataRuta(dataRuta.filter((item) => item._id !== ruta._id));
      message.success(
        `Usaha ${ruta.nama_kepala_keluarga} berhasil dihapus.`,
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
      await api3.delete(`/api/usahaKlengkeng/many`, {
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
                title="Hapus Data Usaha Kelengkeng"
                description="Anda yakin menghapus data usaha kelengkeng ini?"
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

  const keyToLabelMap = pemanfaatan_produk.reduce((map, item) => {
    map[item.key] = item.label;
    return map;
  }, {});

  const formatPemanfaatanProduk = (produkArray) => {
    return produkArray
      .map((key) => keyToLabelMap[key] || key) // Ganti key dengan label
      .join(", ");
  };

  const exportToExcel = (data, fileName) => {
    // Menghapus atribut _id dan __v dari setiap objek dalam data
    const filteredData = data.map(({ _id, __v, ...rest }) => rest);

    const updatedData = filteredData.map((item) => ({
      ...item,
      pemanfaatan_produk: formatPemanfaatanProduk(item.pemanfaatan_produk),
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
    const fileName = `Data Usaha Kelengkeng Simoketawang ${formattedDateTime}`;
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
          className="mb-4 w-[50%] simoketawang-usaha-search"
          placeholder="Ketikkan kata kunci..."
          startContent={
            <SearchIcon className="mb-0.5 text-pyellow pointer-events-none flex-shrink-0" />
          }
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="flex gap-2">
          <Button
            color="primary"
            className="text-[14px] font-semibold text-white"
            startContent={<FaPlus className="text-[20px] text-white" />}
            // onMouseEnter={() => !isMobile && setDropdownVisible(true)}
            onClick={handleSatuanAddModal}
          >
            Tambah
          </Button>
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
        className="shadow rounded-xl font-inter simoketawang-usaha-table"
        classNames={{ loadingWrapper: "mx-auto" }}
        bottomContent={
          <div className="relative flex justify-center w-full">
            <Popconfirm
              title="Hapus Banyak Usaha Kelengkeng"
              description="Anda yakin menghapus Usaha Kelengkeng ini?"
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
        <TableHeader columns={columns} className="font-inter text-pyellow">
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
            <Bars width="50" height="50" color="#D4AC2B" className="mx-auto" />
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
        jenis_klengkeng={jenis_klengkeng}
        jenis_pupuk={jenis_pupuk}
        pemanfaatan_produk={pemanfaatan_produk}
        fetchData={fetchData}
        fetchDataAggregate={fetchDataAggregate}
      />

      <EditRutaModal
        isEditModalOpen={isEditModalOpen}
        onEditModalOpenChange={onEditModalOpenChange}
        ruta={editRutaData}
        fetchData={fetchData}
        fetchDataAggregate={fetchDataAggregate}
        jenis_klengkeng={jenis_klengkeng}
        jenis_pupuk={jenis_pupuk}
        pemanfaatan_produk={pemanfaatan_produk}
      />
    </div>
  );
};

export default SimoketawangUsahaTable;
