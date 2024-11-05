import React, { useEffect, useState } from "react";
import styles from "./buletinAdm.module.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import Sidebar from "../SideBar/sidebar.jsx";
import Modal from "../Modal/BuletinModal/buletinModal.jsx";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Bars } from "react-loader-spinner";
import { formatDate } from "../../utils/formatDate.js";
import api5 from "../../utils/api5.js";
import { message, Popconfirm } from "antd";
import Dragger from "antd/es/upload/Dragger.js";
import { InboxOutlined } from "@mui/icons-material";
import { addNumberAttribute } from "../../utils/addNumberAttribute.js";
import { ImNewTab } from "react-icons/im";
import { convertDateFormat } from "../../utils/convertDateFormat.js";

const BuletinAdm = () => {
  const [data, setData] = useState([]);
  const [desa, setDesa] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentItem, setCurrentItem] = useState(null);
  const [urlFile, setUrlFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadMode, setIsUploadMode] = useState(true);
  const [selectedDesa, setSelectedDesa] = useState([]);

  const handleChange = (selectedItems) => {
    console.log(selectedItems);
    setSelectedDesa(selectedItems);
  };

  // useEffect(() => {
  //   // Ini hanya contoh untuk menunjukkan hasil pilihan (bisa diganti dengan logic lainnya)
  //   console.log("Selected Desa:", selectedDesa);
  // }, [selectedDesa]);

  useEffect(() => {
    if (modalType === "edit") {
      setSelectedDesa(new Set(currentItem.desa.split(", ")));
    }
  }, [modalType]);

  useEffect(() => {
    fetchAllBuletin();
    fetchDesa();
  }, []);

  const sortTable = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp />;
    }
    return <FaSortDown />;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddClick = () => {
    setCurrentItem(null);
    setModalType("add");
    setShowModal(true);
    setIsUploadMode(true);
    setUrlFile("");
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setUrlFile(item.link_file);
    setModalType("edit");
    setShowModal(true);
    setIsUploadMode(true);
  };

  const handleDeleteClick = async (item) => {
    await deleteData(item);
    await fetchAllBuletin();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchAllBuletin = async () => {
    setIsLoading(true);
    try {
      const response = await api5.get("/api/buletin");
      setData(addNumberAttribute(response.data));
    } catch (error) {
      console.error("Error fetching buletin:", error);
      message.error("Gagal mendapatkan daftar Buletin!", 8);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await api5.get("/api/desa");
      setDesa(response.data);
    } catch (error) {
      console.error("Error fetching desa:", error);
    }
  };

  const deleteData = async (data) => {
    setIsLoading(true);
    try {
      await api5.delete("/api/buletin/" + data._id);
      message.success("Berhasil menghapus Buletin!", 8);
    } catch (error) {
      message.error("Gagal menghapus Buletin!", 8);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (data) => {
    setIsLoading(true);
    try {
      const response = await api5.put("/api/buletin/" + currentItem._id, data);
      message.success("Berhasil mengubah Buletin!", 8);
      return response.data;
    } catch (error) {
      console.error("Error editing buletin:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message, 8);
      } else {
        message.error("Gagal mengubah Buletin!", 8);
      }
      throw new Error("Failed to edit buletin. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createData = async (data) => {
    setIsLoading(true);
    try {
      const response = await api5.post("/api/buletin", data);
      message.success("Berhasil menambahkan Buletin!", 8);
      return response.data;
    } catch (error) {
      console.error("Error creating buletin:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message, 8);
      } else {
        message.error("Gagal menambahkan Buletin!", 8);
      }
      throw new Error("Failed to create buletin. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  function simplifyGoogleDriveLink(url) {
    const regex = /(https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[0] : null;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newItem = {
      judul: formData.get("judul"),
      tanggal_rilis: formatDate(formData.get("tanggal_rilis")),
      tanggal_kegiatan: formatDate(formData.get("tanggal_kegiatan")),
      deskripsi: formData.get("deskripsi"),
      link_file: isUploadMode ? urlFile : formData.get("link_file"),
      desa: Array.from(selectedDesa).join(", "),
    };

    try {
      if (modalType === "add") {
        await createData(newItem);
      } else if (modalType === "edit") {
        await updateData(newItem);
      }
      setUrlFile("");
      await fetchAllBuletin();
      handleCloseModal();
    } catch (error) {
      console.error("Error creating/updating data:", error);
    }
  };

  const props = {
    name: "file",
    accept: ".pdf,.doc,.docx",
    multiple: false,
    customRequest({ file, onSuccess, onError, onProgress }) {
      const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB in bytes

      if (file.size > MAX_FILE_SIZE) {
        message.error(
          "File terlalu besar untuk diunggah. Maksimal ukuran file adalah 4.5MB."
        );
        onError(new Error("File size exceeds the limit."));
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      api5
        .post("/api/upload", formData, {
          onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100) });
          },
        })
        .then((response) => {
          const fileUrl = response.data.url;
          setUrlFile(fileUrl);
          onSuccess(response.data, file);
        })
        .catch((error) => {
          console.error("Upload error:", error);
          if (error.response && error.response.status === 413) {
            message.error(
              "File terlalu besar untuk diunggah. Silakan pilih file yang lebih kecil."
            );
          } else {
            message.error("Gagal mengupload file.");
          }
          onError(error);
        });
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.buletinContainer}>
        <div className={styles.tableContainer}>
          <Button
            className="text-white font-inter font-semibold text-md bg-[#fcc300] mb-5"
            onClick={handleAddClick}
          >
            <FaPlus /> Tambah Buletin
          </Button>
          <div className="w-full max-w-full p-10 mt-5 bg-white shadow-lg rounded-xl">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th onClick={() => sortTable("no")}>
                    <span>No {getSortIcon("no")}</span>
                  </th>
                  <th onClick={() => sortTable("judul")}>
                    <span>Judul {getSortIcon("judul")}</span>
                  </th>
                  <th onClick={() => sortTable("tanggal_kegiatan")}>
                    <span>
                      Tanggal Kegiatan {getSortIcon("tanggal_kegiatan")}
                    </span>
                  </th>
                  <th onClick={() => sortTable("tanggal_rilis")}>
                    <span>Tanggal Rilis {getSortIcon("tanggal_rilis")}</span>
                  </th>
                  <th>
                    <span>Deskripsi</span>
                  </th>
                  <th>
                    <span>Desa</span>
                  </th>
                  <th>
                    <span>File Link</span>
                  </th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="mx-auto text-center">
                      <Bars width="45" height="45" color="#ea580c" />
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.no}</td>
                      <td>{item.judul}</td>
                      <td>{item.tanggal_kegiatan}</td>
                      <td>{item.tanggal_rilis}</td>
                      <td>{item.deskripsi}</td>
                      <td>{item.desa}</td>
                      <td>
                        <a
                          href={item.link_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex justify-center text-blue-600"
                        >
                          <ImNewTab />
                        </a>
                      </td>
                      <td>
                        <button
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => handleEditClick(item)}
                        >
                          <FaEdit />
                        </button>
                        <Popconfirm
                          title="Hapus Buletin"
                          description="Anda yakin menghapus buletin ini?"
                          onConfirm={() => handleDeleteClick(item)}
                          onOpenChange={() => console.log("open change")}
                        >
                          <button className="ml-2 text-red-500 hover:text-red-600">
                            <FaTrash />
                          </button>
                        </Popconfirm>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-5">
              <button
                className={`px-4 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <FaArrowLeft />
              </button>
              <span className="px-4 py-2 font-semibold text-orange-500 bg-orange-100 rounded-lg">
                {currentPage} dari {totalPages}
              </span>
              <button
                className={`px-4 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        style={{ padding: "0px" }}
      >
        <h3 className="font-bold font-inter text-start text-[18px] text-[#c46024] mb-4">
          {modalType === "add" ? "Tambah Buletin" : "Edit Buletin"}
        </h3>
        <form
          onSubmit={handleFormSubmit}
          className={`${styles.modalForm}`}
          style={{ overflowY: "auto", height: "600px", padding: "0 20px 0 0" }}
        >
          <div className={`${styles.formGroup}`}>
            <label>Judul:</label>
            <input
              type="text"
              placeholder="Masukkan Judul"
              name="judul"
              defaultValue={currentItem?.judul || ""}
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.flexRow}`}>
            <div className={styles.flexColumn}>
              <label>Tanggal Kegiatan:</label>
              <input
                type="date"
                name="tanggal_kegiatan"
                defaultValue={
                  convertDateFormat(currentItem?.tanggal_kegiatan) || ""
                }
                required
              />
            </div>
            <div className={styles.flexColumn}>
              <label>Tanggal Rilis:</label>
              <input
                type="date"
                name="tanggal_rilis"
                defaultValue={
                  convertDateFormat(currentItem?.tanggal_rilis) || ""
                }
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Deskripsi:</label>
            <textarea
              name="deskripsi"
              defaultValue={currentItem?.deskripsi || ""}
              required
              rows="3"
              placeholder="Masukkan Deskripsi"
            />
          </div>

          {/* <div className={styles.formGroup}>
            <label>Desa:</label>
            <select
              name="desa"
              defaultValue={currentItem?.desa || ""}
              required
              className={styles.select}
            >
              <option value="">Pilih Desa</option>
              {desa.length > 0 ? (
                desa.map((desaItem) => (
                  <option key={desaItem._id} value={desaItem.nama}>
                    {desaItem.nama}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Tidak ada desa tersedia
                </option>
              )}
            </select>
          </div> */}

          <div style={{ marginBottom: "20px" }}>
            <label>Desa:</label>
            <Select
              aria-label="Pilih Desa"
              placeholder="Pilih Desa"
              selectionMode="multiple" // Enable multiple selection
              selectedKeys={selectedDesa} // Mengontrol nilai yang dipilih
              onSelectionChange={handleChange} // Handler untuk menangani perubahan
              // disallowEmptySelection
            >
              {desa.length > 0 ? (
                desa.map((desaItem) => (
                  <SelectItem key={desaItem.nama} value={desaItem.nama}>
                    {desaItem.nama}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Tidak ada desa tersedia
                </SelectItem>
              )}
            </Select>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: "130px" }}>
            <label>File atau Link:</label>
            <div className="flex items-center mb-2">
              <button
                type="button"
                className={`px-4 py-2 mr-2 ${
                  isUploadMode ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setIsUploadMode(true)}
              >
                Upload File
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${
                  !isUploadMode ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setIsUploadMode(false)}
              >
                Input Link
              </button>
            </div>
            {isUploadMode ? (
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
            ) : (
              <input
                type="text"
                name="link_file"
                placeholder="Masukkan link file"
                defaultValue={currentItem?.link_file || ""}
              />
            )}
          </div>

          {currentItem !== null && (
            <div className={styles.formGroup} style={{marginTop: "-40px" }}>
              <label>File Terupload:</label>
              <a
                href={currentItem?.link_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 text-blue-600 rounded-full hover:bg-blue-100"
              >
                <ImNewTab size={25} />
              </a>
            </div>
          )}

          <button className="w-fit self-end text-white font-inter font-semibold bg-[#fcc300] px-4 py-2 mb-3 rounded-lg shadow-lg hover:bg-[#ffb400] transition-colors duration-300 transform hover:scale-105">
            {modalType === "add" ? (
              isLoading ? (
                <Bars width="25" height="25" color="#ffffff" />
              ) : (
                "Tambah"
              )
            ) : isLoading ? (
              <Bars width="25" height="25" color="#ffffff" />
            ) : (
              "Simpan"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BuletinAdm;
