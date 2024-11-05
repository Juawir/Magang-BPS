import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/sidebar";
import { FaCheck, FaImages } from "react-icons/fa";
import api5 from "../../utils/api5"; // Adjust the import path as needed
import { Image, message, Upload } from "antd";
import { getTimeDifference } from "../../utils/getTimeDifference";

const BerandaAdm = () => {
  const [formData, setFormData] = useState({
    teks_1: "",
    teks_2: "",
    teks_3: "",
    link_gambar: "",
  });
  const [urlImg, setUrlImg] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [beranda, setBeranda] = useState([]);
  const [lastUpdatedTimes, setLastUpdatedTimes] = useState({});

  useEffect(() => {
    fetchBeranda();
  }, []);

  useEffect(() => {
    if (beranda.length > 0) {
      setFormData({
        teks_1: beranda[0].teks_1,
        teks_2: beranda[0].teks_2,
        teks_3: beranda[0].teks_3,
        link_gambar: beranda[0].link_gambar,
      });
      if (beranda[0].link_gambar !== "") {
        setUrlImg(beranda[0].link_gambar);
        setFileList([
          {
            uid: beranda[0]._id,
            name: beranda[0]._id + ".png",
            status: "done",
            url: beranda[0].link_gambar,
          },
        ]);
      }
      setLastUpdatedTimes({
        teks_1: new Date(beranda[0].update_at_teks_1),
        teks_2: new Date(beranda[0].update_at_teks_2),
        teks_3: new Date(beranda[0].update_at_teks_3),
        link_gambar: new Date(beranda[0].update_at_link_gambar),
      });
    }
  }, [beranda]);

  useEffect(() => {
    setFormData({
      ...formData,
      ["link_gambar"]: urlImg,
    });
  }, [urlImg]);

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Update data
  const updateData = async (field, value) => {
    try {
      let endpoint = "";

      // Tentukan endpoint berdasarkan field yang diupdate
      switch (field) {
        case "teks_1":
          endpoint = "/api/beranda/updateTeks1";
          break;
        case "teks_2":
          endpoint = "/api/beranda/updateTeks2";
          break;
        case "teks_3":
          endpoint = "/api/beranda/updateTeks3";
          break;
        case "link_gambar":
          endpoint = "/api/beranda/updateLinkGambar";
          break;
        default:
          throw new Error("Invalid field");
      }

      // Buat request body sesuai dengan field yang diupdate
      const requestData = { [field]: value };

      // Kirim request ke server
      const response = await api5.put(`${endpoint}`, requestData);

      fetchBeranda();

      message.success(`Berhasil mengubah ${field}!`, 8);
      // Jika berhasil, return response data
      return response.data;
    } catch (error) {
      message.error(`Failed to update ${field}`);
      console.error("Error updating data:", error);
    }
  };

  const fetchBeranda = async () => {
    try {
      const response = await api5.get("/api/beranda");
      setBeranda(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching beranda:", error);
      return [];
    }
  };

  // Handle submit for each field
  const handleSubmit = (e, field) => {
    e.preventDefault();
    updateData(field, formData[field]);
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
      <main className="flex items-center justify-center flex-1 p-8 bg-gray-100">
        <form className="w-full max-w-lg p-6 space-y-5 bg-white rounded-lg shadow-md">
          {[
            { id: "teks_1", label: "Teks 1" },
            { id: "teks_2", label: "Teks 2" },
            { id: "teks_3", label: "Teks 3" },
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center space-x-4">
                <label
                  htmlFor={field.id}
                  className="block w-1/6 font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  id={field.id}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e, field.id)}
                  className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                >
                  <FaCheck />
                </button>
              </div>
              <p className="ml-[90px] text-sm font-semi text-gray-500">
                Diperbarui {getTimeDifference(lastUpdatedTimes[field.id])} yang
                lalu
              </p>
            </div>
          ))}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="fileUpload"
                className="block w-1/6 mr-5 font-medium text-gray-700"
              >
                Unggah Gambar
              </label>
              <Upload
                customRequest={(options) => customRequest({ ...options })}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                className="w-full admin-upload"
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
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, "link_gambar")}
                className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                <FaCheck />
              </button>
            </div>
            <p className="ml-[90px] text-sm font-semi text-gray-500">
              Diperbarui {getTimeDifference(lastUpdatedTimes["link_gambar"])}{" "}
              yang lalu
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default BerandaAdm;
