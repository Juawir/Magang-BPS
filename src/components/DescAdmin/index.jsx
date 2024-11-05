import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/sidebar";
import { FaCheck } from "react-icons/fa";
import api5 from "../../utils/api5"; // Adjust the import path as needed
import { message } from "antd";
import { getTimeDifference } from "../../utils/getTimeDifference";

const DescAdmin = () => {
  const [description, setDescription] = useState([]);
  const [formData, setFormData] = useState({
    judul: "",
    sub_judul: "",
    isi: "",
    link_video: "",
  });
  const [lastUpdatedTimes, setLastUpdatedTimes] = useState({});

  useEffect(() => {
    fetchDescription();
  }, []);

  useEffect(() => {
    if (description.length > 0) {
      setFormData({
        judul: description[0].judul,
        sub_judul: description[0].sub_judul,
        isi: description[0].isi,
        link_video: description[0].link_video,
      });
      setLastUpdatedTimes({
        judul: new Date(description[0].update_at_judul),
        sub_judul: new Date(description[0].update_at_sub_judul),
        isi: new Date(description[0].update_at_isi),
        link_video: new Date(description[0].update_at_link_video),
      });
    }
  }, [description]);

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const fetchDescription = async () => {
    try {
      const response = await api5.get("/api/deskripsi");
      setDescription(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching description:", error);
      return [];
    }
  };

  const updateDesciption = async (field, value) => {
    try {
      let endpoint = "";

      // Tentukan endpoint berdasarkan field yang diupdate
      switch (field) {
        case "judul":
          endpoint = "/api/deskripsi/updateJudul";
          break;
        case "sub_judul":
          endpoint = "/api/deskripsi/updateSubJudul";
          break;
        case "isi":
          endpoint = "/api/deskripsi/updateIsi";
          break;
        case "link_video":
          endpoint = "/api/deskripsi/updateLinkVideo";
          break;
        default:
          throw new Error("Invalid field");
      }

      // Buat request body sesuai dengan field yang diupdate
      const requestData = { [field]: value };

      // Kirim request ke server
      const response = await api5.put(`${endpoint}`, requestData);

      fetchDescription();

      message.success(`Berhasil mengubah ${field}!`, 8);
      // Jika berhasil, return response data
      return response.data;
    } catch (error) {
      message.error(`Gagal mengubah ${field}!`, 8);
      console.error("Error updating description:", error);
      throw error;
    }
  };

  const handleSubmit = (e, fieldId) => {
    e.preventDefault();

    updateDesciption(fieldId, formData[fieldId]);
  };

  // Form fields definition
  const formFields = [
    { id: "judul", label: "Judul", placeholder: "Masukkan Judul" },
    { id: "sub_judul", label: "Sub Judul", placeholder: "Masukkan Sub Judul" },
    { id: "isi", label: "Isi", placeholder: "Masukkan Isi" },
    {
      id: "link_video",
      label: "Tautan Video",
      placeholder: "Masukkan Tautan Video",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex items-center justify-center flex-1 p-12">
        <div className="w-full max-w-lg p-8 mx-auto bg-white rounded-lg shadow-md animate-fade-in-up">
          <form className="space-y-5">
            {formFields.map((field) => (
              <div className="space-y-2" key={field.id}>
                <div className="flex items-center space-x-4 animate-slide-in">
                  <label
                    htmlFor={field.id}
                    className="block w-1/6 font-medium text-gray-700 transition-transform transform hover:translate-x-1"
                  >
                    {field.label}
                  </label>
                  <input
                    type="text"
                    id={field.id}
                    placeholder={field.placeholder}
                    className="flex-1 px-3 py-2 transition-shadow border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData[field.id]}
                    onChange={handleInputChange}
                  />
                  <button
                    type="submit"
                    onClick={(e) => handleSubmit(e, field.id)}
                    className="px-4 py-2 text-white transition-all bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <FaCheck />
                  </button>
                </div>
                <p className="ml-[90px] text-sm font-semi text-gray-500">
                  Diperbarui {getTimeDifference(lastUpdatedTimes[field.id])}{" "}
                  yang lalu
                </p>
              </div>
            ))}
          </form>
        </div>
      </main>
    </div>
  );
};

export default DescAdmin;
