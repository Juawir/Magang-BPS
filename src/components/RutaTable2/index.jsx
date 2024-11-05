/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { message } from "antd";
import useFetchData from "./useFetchData";
import api from "../../utils/api";
import RutaTableHeader from "./RutaTableHandler";
import RutaTableBody from "./RutaTableBody";
import { columns, daftarKlasifikasi } from "./data";
import RutaTableFooter from "./RutaTableFooter";
import RutaDetail from "./RutaDetail";
import AddRutaModal from "./AddRutaModal";
import EditRutaModal from "./EditRutaModal";
import { SearchIcon } from "./Icons";
import { FaPlus } from "react-icons/fa6";
import { Button, Input, Pagination, Table } from "@nextui-org/react";

const RutaTable = () => {
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: rutas, loading } = useFetchData("/api/rumahTangga");

  const filteredRutas = rutas.filter((ruta) =>
    ruta.namaKrt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(rutas.length / rowsPerPage);

  console.log(pages);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredRutas.slice(start, end);
  }, [page, filteredRutas]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleEditModalOpen = (ruta) => {
    setSelectedRuta(ruta);
    setEditModalOpen(true);
  };
  const handleDelete = async (ruta) => {
    try {
      await api.delete(`/api/rumahTangga/${ruta.kode}`);
      message.success("Data berhasil dihapus");
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Terjadi kesalahan saat menghapus data");
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
          placeholder="Ketikkan kata kunci..."
          startContent={
            <SearchIcon className="mb-0.5 text-pdarkblue pointer-events-none flex-shrink-0" />
          }
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 w-[50%]"
        />
        <Button
          color="success"
          className="text-[14px] font-semibold text-white"
          startContent={<FaPlus className="text-[20px] text-white" />}
          onClick={handleAddModalOpen} // Tambahkan onClick untuk membuka modal tambah
        >
          Tambah
        </Button>
      </div>
      <Table
        aria-label="Data Rumah Tangga UMKM"
        shadow="none"
        className="shadow rounded-xl font-inter"
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
        <RutaTableHeader columns={columns} />
        <RutaTableBody
          items={items}
          renderCell={(item, columnKey) => item[columnKey]}
          onDetailClick={setSelectedRuta}
          onEditClick={handleEditModalOpen}
          onDeleteClick={handleDelete}
        />
      </Table>
      {selectedRuta && (
        <RutaDetail ruta={selectedRuta} daftarKlasifikasi={daftarKlasifikasi} />
      )}
      <AddRutaModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      {selectedRuta && (
        <EditRutaModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          ruta={selectedRuta}
        />
      )}
    </div>
  );
};

// export default RutaTable;
