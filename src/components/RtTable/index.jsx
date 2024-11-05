/* eslint-disable react/prop-types */
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
import api from "../../utils/api";
import { Bars } from "react-loader-spinner";
import GeoJSONUploadModal from "./GeoJSONUploadModal";
import EditRtModal from "./EditRtModal";
import DetailRtModal from "./DetailRtModal";
import { useAsyncList } from "@react-stately/data";

const RtTable = ({ fetchDataAggregate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRt, setSelectedRt] = useState({}); // State untuk menyimpan RT yang dipilih
  const [data, setData] = useState([]); // State untuk data RT
  const [dataGeoJson, setDataGeoJson] = useState([]); // State untuk data GeoJSON
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onOpenChange: onAddModalOpenChange,
  } = useDisclosure();

  // State untuk modal edit
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure();
  const [editRtData, setEditRtData] = useState(null);
  const [loading, setLoading] = useState(true); // State untuk loading

  function getGeoJsonByKode(kode) {
    for (let collection of dataGeoJson) {
      for (let feature of collection.features) {
        if (feature.properties.kode === kode) {
          return feature;
        }
      }
    }
    return null; // Return null if no matching feature is found
  }

  const fetchData = async () => {
    setLoading(true); // Mulai loading
    try {
      // const response = await api.get("/api/rt");
      const [rtResponse, geojsonResponse] = await Promise.all([
        api.get("/api/rt"),
        api.get("/api/rt/all/geojson"),
      ]);
      setData(rtResponse.data.data); // Update state dengan data dari API
      setDataGeoJson(geojsonResponse.data.data);
      console.log("Data fetched:", rtResponse.data.data);
      console.log("Data GeoJSON fetched:", geojsonResponse.data.data);
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

  const deleteData = async (rt) => {
    setLoading(true);
    try {
      await api.delete(`/api/rt/${rt.kode}`);
      setData(data.filter((item) => item.kode !== rt.kode));
      message.success(`RT ${rt.rt} berhasil dihapus.`, 5);
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

  const handleDetailClick = (rt) => {
    setSelectedRt(rt);
    onOpen();
  };

  const handleEditClick = (rt) => {
    console.log("Check editRtData", rt);
    setEditRtData(rt);
    onEditModalOpen();
  };

  const handleDelete = (rt) => {
    deleteData(rt);
    fetchData();
  };

  const filteredData = data.filter((rt) =>
    Object.values(rt).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderCell = (rt, columnKey) => {
    const cellValue = rt[columnKey];

    switch (columnKey) {
      case "aksi":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detail">
              <span
                className="text-lg cursor-pointer text-default-400 active:opacity-50"
                onClick={() => handleDetailClick(rt)}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit">
              <span
                className="text-lg cursor-pointer text-default-400 active:opacity-50"
                onClick={() => handleEditClick(rt)}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Hapus">
              <Popconfirm
                title="Hapus Rukun Tetangga (RT)"
                description="Anda yakin menghapus RT ini?"
                onConfirm={() => handleDelete(rt)}
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
  const rowsPerPage = 25;

  const pages = Math.ceil(filteredData.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredData.slice(start, end);
  }, [page, filteredData]);

  let list = useAsyncList({
    async sort({ items, sortDescriptor }) {
      console.log("Before sorting:", items);

      let sortedItems = items.sort((a, b) => {
        let first = a[sortDescriptor.column];
        let second = b[sortDescriptor.column];

        // Log the values being compared
        console.log(`Comparing "${first}" with "${second}"`);

        // Convert to numbers if possible, or keep as strings
        let firstValue = parseInt(first) || first;
        let secondValue = parseInt(second) || second;

        let cmp =
          firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;

        // Log comparison result
        console.log(`Comparison result: ${cmp}`);

        // Adjust for sort direction
        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }

        // Log the final comparison result after direction adjustment
        console.log(
          `Final comparison result (after direction adjustment): ${cmp}`
        );

        return cmp;
      });

      console.log("After sorting:", sortedItems);

      return {
        items: sortedItems,
      };
    },
  });

  return (
    <div className="p-4 bg-[#ffffffb4] rounded-xl">
      <div className="flex justify-between">
        <Input
          label="Pencarian"
          radius="lg"
          classNames={{
            inputWrapper: "shadow",
          }}
          className="mb-4 w-[50%] simoanginangin-sls-search"
          placeholder="Ketikkan kata kunci..."
          startContent={
            <SearchIcon className="mb-0.5 text-pdarkblue pointer-events-none flex-shrink-0" />
          }
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button
          color="primary"
          className="text-[14px] font-semibold text-white"
          startContent={<FaPlus className="text-[20px] text-white" />}
          onClick={onAddModalOpen}
        >
          Tambah
        </Button>
      </div>
      <Table
        aria-label="Example table with custom cells"
        shadow="none"
        className="shadow rounded-xl font-inter simoanginangin-sls-table"
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
        // sortDescriptor={list.sortDescriptor}
        // onSortChange={list.sort}
      >
        <TableHeader columns={columns} className="font-inter text-pdarkblue">
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "aksi" ? "center" : "start"}
              // allowsSorting={column.uid === "jml_umkm" ? true : false}
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
            <TableRow key={item.kode}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DetailRtModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedRt={selectedRt}
        geojsonRt={getGeoJsonByKode(selectedRt.kode)}
      />

      <GeoJSONUploadModal
        isAddModalOpen={isAddModalOpen}
        onAddModalOpenChange={onAddModalOpenChange}
        onSuccessCreate={() => {
          fetchData();
        }}
      />

      <EditRtModal
        isEditModalOpen={isEditModalOpen}
        onEditModalOpenChange={onEditModalOpenChange}
        rt={editRtData}
        fetchData={fetchData}
        fetchDataAggregate={fetchDataAggregate}
      />

      {/* {loading && (
        <div className="fixed inset-0 bg-[#caf4ff85] flex flex-col justify-center items-center z-50 overflow-hidden">
          <Bars
            height="60"
            width="60"
            color="#0B588F"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p className="mt-3 font-semibold font-inter text-pdarkblue">
            Loading
          </p>
        </div>
      )} */}
    </div>
  );
};

export default RtTable;
