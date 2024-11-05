import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Sidebar from "../SideBar/sidebar.jsx";
import Modal from "../Modal/modal.jsx";
import {
  FaPlus,
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaImages,
} from "react-icons/fa";
import { Button } from "@nextui-org/react";
import { Image, message, Popconfirm, Upload } from "antd";
import api5 from "../../utils/api5.js";
import "./style.css";
import { Bars } from "react-loader-spinner";
import { ImNewTab } from "react-icons/im";
import { addNumberAttribute } from "../../utils/addNumberAttribute.js";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentItem, setCurrentItem] = useState(null);
  const [urlImg, setUrlImg] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllDesa();
  }, []);

  const sortTable = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
  };

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddClick = () => {
    setCurrentItem(null);
    setModalType("add");
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setUrlImg(item.link_gambar);
    setFileList([
      {
        uid: item._id,
        name: item.nama + ".png",
        status: "done",
        url: item.link_gambar,
      },
    ]);
    setModalType("edit");
    setShowModal(true);
    setFileInput(null);
  };

  const handleDeleteClick = async (item) => {
    await deleteData(item);
    await fetchAllDesa();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchAllDesa = async () => {
    setIsLoading(true);
    try {
      const response = await api5.get("/api/desa");
      // message.success("Berhasil mendapatkan daftar Desa!", 3);
      setData(addNumberAttribute(response.data));
    } catch (error) {
      console.error("Error creating data:", error);
      // Bisa melempar ulang error atau mengembalikan pesan custom
      message.error("Gagal mendapatkan daftar Desa!", 8);
      throw new Error("Failed to create data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (data) => {
    setIsLoading(true);
    try {
      await api5.delete("/api/desa/" + data._id);
      message.success("Berhasil menghapus Desa!", 8);
      return;
    } catch (error) {
      // Bisa melempar ulang error atau mengembalikan pesan custom
      await message.error("Gagal menghapus Desa!", 8);
      throw new Error("Failed to delete data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (data) => {
    setIsLoading(true);
    try {
      const response = await api5.put("/api/desa/" + currentItem._id, data);
      message.success("Berhasil mengubah Desa!", 8);
      return response.data;
    } catch (error) {
      console.error("Error editing data:", error);
      // Bisa melempar ulang error atau mengembalikan pesan custom
      await message.error("Gagal mengubah Desa!", 8);
      throw new Error("Failed to create data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createData = async (data) => {
    setIsLoading(true);
    try {
      const response = await api5.post("/api/desa", data);
      message.success("Berhasil menambahkan Desa!", 8);
      return response.data;
    } catch (error) {
      console.error("Error creating data:", error);
      // Bisa melempar ulang error atau mengembalikan pesan custom
      message.error("Gagal menambahkan Desa!", 8);
      throw new Error("Failed to create data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
      // no: currentItem ? currentItem.no : data.length + 1,
      nama: formData.get("nama"),
      kecamatan: formData.get("kecamatan"),
      luas: parseFloat(formData.get("luas")),
      link_gambar: urlImg,
    };

    try {
      if (modalType === "add") {
        await createData(newItem);
      } else if (modalType === "edit") {
        await updateData(newItem);
      }
      setUrlImg("");
      setFileList([]);
      await fetchAllDesa();
      handleCloseModal();
    } catch (error) {
      console.error("Error creating data:", error);
      // Bisa melempar ulang error atau mengembalikan pesan custom
      message.error("Gagal menambahkan Desa!", 8);
    }

    // console.log(newItem);

    // if (modalType === "add") {
    //   setData([...data, newItem]);
    // } else if (modalType === "edit" && currentItem) {
    //   setData(
    //     data.map((item) => (item.no === currentItem.no ? newItem : item))
    //   );
    // }
    // handleCloseModal();
  };

  const customRequest = ({ file, onSuccess, onError }) => {
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

    const formData = new FormData();

    formData.append("file", file);

    // Kirimkan data menggunakan Axios
    api5
      .post("/api/upload", formData)
      .then((response) => {
        onSuccess(response.data);
        setUrlImg(response.data.url);
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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.tableContainer}>
          <Button
            className="text-white font-inter font-semibold text-md bg-[#fcc300] mb-5"
            onClick={handleAddClick}
          >
            <FaPlus /> Tambah Desa
          </Button>
          <div className="w-full max-w-full p-10 mt-5 bg-white shadow-lg rounded-xl">
            <table className={styles.table}>
              {/* Table headers */}
              <thead>
                <tr>
                  <th onClick={() => sortTable("no")}>
                    <span>No {getSortIcon("no")}</span>
                  </th>
                  <th onClick={() => sortTable("nama")}>
                    <span>Nama Desa {getSortIcon("nama")}</span>
                  </th>
                  <th onClick={() => sortTable("kecamatan")}>
                    <span>Kecamatan {getSortIcon("kecamatan")}</span>
                  </th>
                  <th onClick={() => sortTable("luas")}>
                    <span>Luas (hektar) {getSortIcon("luas")}</span>
                  </th>
                  <th>
                    <span>Foto</span>
                  </th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="mx-auto text-center">
                      <Bars width="45" height="45" color="#ea580c" />
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.no}</td>
                      <td>{item.nama}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.luas}</td>
                      <td>
                        <a
                          href={item.link_gambar}
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
                          title="Hapus Desa"
                          description="Anda yakin menghapus desa ini?"
                          onConfirm={() => handleDeleteClick(item)}
                          // onOpenChange={() => console.log("open change")}
                        >
                          <button
                            className="ml-2 text-red-500 hover:text-red-600"
                            // onClick={() => handleDeleteClick(item)}
                          >
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
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Modal show={showModal} onClose={handleCloseModal}>
        <form onSubmit={handleFormSubmit} className={styles.modalForm}>
          <h3 className="font-bold font-inter text-start text-[18px] text-[#c46024] mb-4">
            {modalType === "add" ? "Tambah Desa" : "Edit Desa"}
          </h3>
          <div className={styles.formGroup}>
            <label>Nama Desa:</label>
            <input
              type="text"
              placeholder="Masukkan Nama Desa"
              name="nama"
              defaultValue={currentItem?.nama || ""}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Kecamatan:</label>
            <select
              name="kecamatan"
              defaultValue={currentItem?.kecamatan || ""}
              required
            >
              <option value="" disabled>
                Pilih Kecamatan
              </option>
              {[
                "Candi",
                "Gedangan",
                "Jabon",
                "Krembung",
                "Porong",
                "Prambon",
                "Sedati",
                "Sidoarjo",
                "Sukodono",
                "Taman",
                "Tanggulangin",
                "Tulangan",
                "Waru",
                "Wonoayu",
              ].map((kecamatan, index) => (
                <option key={index} value={kecamatan}>
                  {kecamatan}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Luas (hektar):</label>
            <input
              type="text"
              placeholder="Masukkan Luas"
              name="luas"
              defaultValue={currentItem?.luas || ""}
              required
            />
          </div>
          <div>
            <div className="mb-4">
              <label className="block mb-2">Unggah Foto:</label>
              <Upload
                customRequest={(options) => customRequest({ ...options })}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                className="admin-upload"
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
            </div>
          </div>
          <button className="w-fit self-end text-white font-inter font-semibold bg-[#fcc300] px-4 py-2 rounded-lg shadow-lg hover:bg-[#ffb400] transition-colors duration-300 transform hover:scale-105">
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

export default Dashboard;
