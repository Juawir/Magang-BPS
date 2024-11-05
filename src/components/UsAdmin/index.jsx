import React, { useEffect, useState } from "react";
import Sidebar from "../SideBar/sidebar";
import styles from "../dashboard/dashboard.module.css";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@mui/icons-material";
import { Image, message, Popconfirm, Upload } from "antd";
import api5 from "../../utils/api5";
import { addNumberAttribute } from "../../utils/addNumberAttribute";
import { Bars } from "react-loader-spinner";
import { ImNewTab } from "react-icons/im";

const UsAdmin = () => {
  const initData = [
    {
      name: "Simoketawang",
      role: "Kecamatan Wonoayu",
      pict: "https://example.com/file.pdf",
    },
    {
      name: "Simoanginangin",
      role: "Kecamatan Wonoayu",
      pict: "https://example.com/file.pdf",
    },
    {
      name: "Grogol",
      role: "Kecamatan Tulangan",
      pict: "https://example.com/file.pdf",
    },
    {
      name: "Sugihwaras",
      role: "Kecamatan Candi",
      pict: "https://example.com/file.pdf",
    },
    {
      name: "Kedungrejo",
      role: "Kecamatan Waru",
      pict: "https://example.com/file.pdf",
    },
    {
      name: "Masangankulon",
      role: "Kecamatan Sukodono",
      pict: "https://example.com/file.pdf",
    },
  ];

  const skData = [
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
    { title: "Simoketawang", link: "https://example.com/file.pdf" },
    { title: "Simoanginangin", link: "https://example.com/file.pdf" },
    { title: "Grogol", link: "https://example.com/file.pdf" },
    { title: "Sugihwaras", link: "https://example.com/file.pdf" },
  ];

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [modalType, setModalType] = useState(null); // State for modal type
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [urlFile, setUrlFile] = useState("");
  const [urlImg, setUrlImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [daftarTim, setDaftarTim] = useState([]);
  const [daftarSk, setDaftarSk] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const sortTable = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    const sortedData = [...initData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
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
        console.log("Link Photo: ", response.data.url);
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageChange2 = (page) => {
    if (page >= 1 && page <= totalPages2) {
      setCurrentPage2(page);
    }
  };

  const openModal = (type, item = null, isEdit = false) => {
    setModalType(type);
    setEditMode(isEdit);
    setSelectedItem(item);
    if (type === "timDesaCantik" && isEdit) {
      setUrlImg(item.link_gambar);
      setFileList([
        {
          uid: item._id,
          name: item.nama + ".png",
          status: "done",
          url: item.link_gambar,
        },
      ]);
    } else if (type === "suratKeputusan" && isEdit) {
      setUrlFile(item.link_file);
    }
    onOpen();
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    setIsLoading2(true);
    try {
      // Mengirimkan kedua permintaan API secara paralel
      const [response1, response2] = await Promise.all([
        api5.get("/api/timdesacantik"),
        api5.get("/api/suratkeputusan"),
      ]);

      // Mengatur state dengan hasil dari kedua permintaan
      setDaftarTim(response1.data);
      setDaftarSk(response2.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Menampilkan pesan kesalahan kepada pengguna
      message.error("Gagal mendapatkan daftar data!", 8);
      throw new Error("Failed to get data. Please try again.");
    } finally {
      setIsLoading(false);
      setIsLoading2(false);
    }
  };

  const deleteData = async (data, type) => {
    try {
      if (type === "timDesaCantik") {
        setIsLoading(true);
        await api5.delete("/api/timdesacantik/" + data._id);
      } else {
        setIsLoading2(true);
        await api5.delete("/api/suratkeputusan/" + data._id);
      }
      message.success(
        `Berhasil menghapus ${
          type === "timDesaCantik" ? "Tim Desa Cantik" : "Surat Keputusan"
        }!`,
        8
      );
      return;
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error(
        `Gagal menghapus ${
          type === "timDesaCantik" ? "Tim Desa Cantik" : "Surat Keputusan"
        }: ${error.message}`,
        8
      );
      throw new Error("Failed to delete data. Please try again.");
    } finally {
      if (type === "timDesaCantik") {
        setIsLoading(false);
      } else {
        setIsLoading2(false);
      }
      fetchAllData();
    }
  };

  const updateData = async (data) => {
    try {
      if (modalType === "timDesaCantik") {
        setIsLoading(true);
        await api5.put("/api/timdesacantik/" + selectedItem._id, data);
      } else {
        setIsLoading2(true);
        await api5.put("/api/suratkeputusan/" + selectedItem._id, data);
      }
      message.success(
        `Berhasil mengubah ${
          modalType === "timDesaCantik" ? "Tim Desa Cantik" : "Surat Keputusan"
        }!`,
        8
      );
      return;
    } catch (error) {
      message.error(
        `Gagal mengubah ${
          modalType === "timDesaCantik" ? "Tim Desa Cantik" : "Surat Keputusan"
        }: ${
          error.response.data.message ===
            "SuratKeputusan validation failed: link_file: Path `link_file` is required." ||
          error.response.data.message ===
            "TimDesaCantik validation failed: link_gambar: Path `link_gambar` is required."
            ? "Harus upload file/gambar!"
            : "Error lainnya!"
        }`,
        8
      );
      throw new Error("Failed to edit data. Please try again.");
    } finally {
      if (modalType === "timDesaCantik") {
        setIsLoading(false);
      } else {
        setIsLoading2(false);
      }
    }
  };

  const createData = async (data) => {
    try {
      if (modalType === "timDesaCantik") {
        setIsLoading(true);
        await api5.post("/api/timdesacantik", data);
      } else {
        setIsLoading2(true);
        await api5.post("/api/suratkeputusan", data);
      }
      message.success(
        `Berhasil menambahkan ${
          modalType === "timDesaCantik" ? "Tim Desa Cantik" : "Surat Keputusan"
        }!`,
        8
      );
      return;
    } catch (error) {
      message.error(
        `Gagal menambahkan ${
          modalType === "timDesaCantik" ? "Tim Desa Cantik" : "Surat Keputusan"
        }: ${
          error.response.data.message ===
            "SuratKeputusan validation failed: link_file: Path `link_file` is required." ||
          error.response.data.message ===
            "TimDesaCantik validation failed: link_gambar: Path `link_gambar` is required."
            ? "Harus upload file/gambar!"
            : "Error lainnya!"
        }`,
        8
      );
      throw new Error("Failed to create data. Please try again.");
    } finally {
      if (modalType === "timDesaCantik") {
        setIsLoading(false);
      } else {
        setIsLoading2(false);
      }
    }
  };

  const handleDeleteClick = async (data, type) => {
    // console.log(data, type);
    setSelectedItem(data);
    await deleteData(data, type);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let newItem;

    if (modalType === "timDesaCantik") {
      newItem = {
        nama: formData.get("nama"),
        jabatan: formData.get("jabatan"),
        link_gambar: urlImg, // Pastikan urlImg sudah terdefinisi dengan benar
      };
    } else {
      newItem = {
        judul: formData.get("judul"),
        link_file: urlFile, // Pastikan urlFile sudah terdefinisi dengan benar
      };
    }

    try {
      if (!editMode) {
        await createData(newItem); // Gantilah ini dengan fungsi API yang sesuai
      } else {
        await updateData(newItem); // Gantilah ini dengan fungsi API yang sesuai
      }
      setUrlFile(""); // Kosongkan urlFile setelah berhasil
      setUrlImg(""); // Kosongkan urlImg setelah berhasil
      setFileList([]); // Kosongkan fileList setelah berhasil
      await fetchAllData(); // Memperbarui data setelah berhasil
      onOpenChange(false); // Menutup modal atau melakukan aksi yang sesuai
    } catch (error) {
      console.error("Error handling form submit:", error);
      // Menampilkan pesan kesalahan kepada pengguna
    }
  };

  const props = {
    name: "file",
    accept: ".pdf,.doc,.docx",
    multiple: false,
    customRequest({ file, onSuccess, onError, onProgress }) {
      const formData = new FormData();
      formData.append("file", file);

      api5
        .post("/api/upload", formData, {
          onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100) });
          },
        })
        .then((response) => {
          // Simpan URL dari response
          const fileUrl = response.data.url; // Sesuaikan dengan struktur response Anda
          console.log("File URL:", fileUrl);
          setUrlFile(fileUrl);
          onSuccess(response.data, file);
        })
        .catch((error) => {
          console.error("Upload error:", error);
          onError(error);
          message.error(`${file.name} file upload failed.`);
        });
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(
    daftarTim.length === 0 ? 1 : daftarTim.length / itemsPerPage
  );

  const itemsPerPage2 = 10;
  const totalPages2 = Math.ceil(
    daftarSk.length === 0 ? 1 : daftarSk.length / itemsPerPage2
  );

  const displayedDataTim = daftarTim.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const displayedDataSk = daftarSk.slice(
    (currentPage2 - 1) * itemsPerPage2,
    currentPage2 * itemsPerPage2
  );

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-12 overflow-y-auto bg-gray-100">
        <div className="flex mb-5 space-x-5">
          {/* Buttons to open modals */}
          <Button
            className="text-white font-inter font-semibold text-md bg-[#fcc300]"
            onPress={() => openModal("timDesaCantik")}
          >
            <FaPlus />
            Tambah Tim Desa Cantik
          </Button>
          <Button
            className="text-white font-inter font-semibold text-md bg-[#fcc300]"
            onPress={() => openModal("suratKeputusan")}
          >
            <FaPlus className={styles.addIcon} />
            Tambah Surat Keputusan
          </Button>
        </div>

        {/* Tim Desa Cantik Table */}
        <div className="p-10 mt-10 bg-white shadow-lg rounded-xl">
          <h3 className="text-xl text-[#ff9c37] font-inter font-bold mb-3">
            Tabel Tim Desa Cantik
          </h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => sortTable("name")}>
                  <span>Nama {getSortIcon("name")}</span>
                </th>
                <th onClick={() => sortTable("role")}>
                  <span>Jabatan {getSortIcon("role")}</span>
                </th>
                <th>Tautan Foto</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="mx-auto text-center">
                    <Bars width="45" height="45" color="#ea580c" />
                  </td>
                </tr>
              ) : displayedDataTim.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                displayedDataTim.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nama}</td>
                    <td>{item.jabatan}</td>
                    <td>
                      <a
                        href={item.link_gambar}
                        className="text-blue-500 hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat Foto
                      </a>
                    </td>
                    <td>
                      <button
                        className="text-orange-500 hover:text-orange-600"
                        onClick={() => openModal("timDesaCantik", item, true)} // Open modal in edit mode
                      >
                        <FaEdit />
                      </button>
                      <Popconfirm
                        title="Hapus Anggota Tim Desa Cantik"
                        description="Anda yakin menghapus anggota ini?"
                        onConfirm={() =>
                          handleDeleteClick(item, "timDesaCantik")
                        }
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

        {/* Surat Keputusan Table */}
        <div className="p-10 mt-10 bg-white shadow-lg rounded-xl">
          <h3 className="text-xl text-[#ff9c37] font-inter font-bold mb-3">
            Tabel Surat Keputusan
          </h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Judul Surat Keputusan</th>
                <th>Tautan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading2 ? (
                <tr>
                  <td colSpan="7" className="mx-auto text-center">
                    <Bars width="45" height="45" color="#ea580c" />
                  </td>
                </tr>
              ) : displayedDataSk.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                displayedDataSk.map((sk, index) => (
                  <tr key={index}>
                    <td>{sk.judul}</td>
                    <td>
                      <a
                        href={sk.link_file}
                        className="text-blue-500 hover:text-blue-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat Surat Keputusan
                      </a>
                    </td>
                    <td>
                      <button
                        className="text-orange-500 hover:text-orange-600"
                        onClick={() => openModal("suratKeputusan", sk, true)} // Open modal in edit mode
                      >
                        <FaEdit />
                      </button>
                      <Popconfirm
                        title="Hapus Surat Keputusan"
                        description="Anda yakin menghapus surat keputusan ini?"
                        onConfirm={() =>
                          handleDeleteClick(sk, "suratKeputusan")
                        }
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
                currentPage2 === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handlePageChange2(currentPage2 - 1)}
              disabled={currentPage2 === 1}
            >
              <FaArrowLeft />
            </button>
            <span className="px-4 py-2 font-semibold text-orange-500 bg-orange-100 rounded-lg">
              {currentPage2} dari {totalPages2}
            </span>
            <button
              className={`px-4 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 ${
                currentPage2 === totalPages2
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => handlePageChange2(currentPage2 + 1)}
              disabled={currentPage2 === totalPages2}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Dynamic Modal for Both Tim Desa Cantik and Surat Keputusan */}
        <Modal
          className="bg-[#f5f5f5]"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          hideCloseButton={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div className="flex justify-between w-full">
                    <h3 className="text-[18px] text-[#c46024] font-inter font-bold">
                      {editMode
                        ? `Edit ${
                            modalType === "timDesaCantik"
                              ? "Tim Desa Cantik"
                              : "Surat Keputusan"
                          }`
                        : `Tambah ${
                            modalType === "timDesaCantik"
                              ? "Tim Desa Cantik"
                              : "Surat Keputusan"
                          }`}
                    </h3>
                    <button
                      className="text-xl text-[#BB5A5A]"
                      onClick={onClose}
                    >
                      &times;
                    </button>
                  </div>
                </ModalHeader>
                <ModalBody>
                  {modalType === "timDesaCantik" ? (
                    <>
                      <form
                        onSubmit={handleFormSubmit}
                        className="relative flex flex-col gap-1 pb-16"
                      >
                        <label className="font-assistant">Nama:</label>
                        <input
                          type="text"
                          name="nama"
                          placeholder="Masukkan Nama"
                          className="w-full p-2 border rounded-xl"
                          defaultValue={
                            editMode && selectedItem ? selectedItem.nama : ""
                          }
                        />

                        <label className="mt-4 font-assistant">Jabatan:</label>
                        <input
                          type="text"
                          name="jabatan"
                          placeholder="Masukkan Jabatan"
                          className="w-full p-2 border rounded-xl"
                          defaultValue={
                            editMode && selectedItem ? selectedItem.jabatan : ""
                          }
                        />

                        <label className="block mb-2">Unggah Foto:</label>
                        <Upload
                          customRequest={(options) =>
                            customRequest({ ...options })
                          }
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
                              onVisibleChange: (visible) =>
                                setPreviewOpen(visible),
                              afterOpenChange: (visible) =>
                                !visible && setPreviewImage(""),
                            }}
                            src={previewImage}
                          />
                        )}
                        <button
                          type="submit"
                          className="w-fit self-end text-white font-inter font-semibold bg-[#fcc300] px-4 py-2 rounded-lg shadow-lg hover:bg-[#ffb400] transition-colors duration-300 transform hover:scale-105 absolute bottom-2 right-0"
                        >
                          {!editMode ? (
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
                    </>
                  ) : (
                    <>
                      <form
                        onSubmit={handleFormSubmit}
                        className="relative flex flex-col gap-3 pb-16"
                      >
                        <label className="font-inter">
                          Judul Surat Keputusan:
                        </label>
                        <input
                          type="text"
                          name="judul"
                          placeholder="Masukkan Judul"
                          className="w-full p-2 border rounded-xl"
                          defaultValue={
                            editMode && selectedItem ? selectedItem.judul : ""
                          }
                        />

                        {selectedItem !== null ? (
                          <>
                            <label>File Terupload:</label>
                            <a
                              href={selectedItem?.link_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-8 h-8 text-blue-600 rounded-full hover:bg-blue-100"
                            >
                              <ImNewTab size={25} />
                            </a>
                          </>
                        ) : null}

                        <label>Upload File:</label>
                        <Dragger {...props}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibited from uploading company data or other
                            banned files.
                          </p>
                        </Dragger>
                        <button
                          type="submit"
                          className="w-fit self-end text-white font-inter font-semibold bg-[#fcc300] px-4 py-2 rounded-lg shadow-lg hover:bg-[#ffb400] transition-colors duration-300 transform hover:scale-105 absolute bottom-2 right-0"
                        >
                          {!editMode ? (
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
                    </>
                  )}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </main>
    </div>
  );
};

export default UsAdmin;
