import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/sidebar";
import { FaCheck } from "react-icons/fa";
import api5 from "../../utils/api5";
import { getTimeDifference } from "../../utils/getTimeDifference";
import { message } from "antd";

const StatAdm = () => {
  const [statistics, setStatistics] = useState([]);
  const [formData, setFormData] = useState({
    kecamatan: "",
    desa: "",
    rt: "",
  });
  const [errors, setErrors] = useState({
    kecamatan: "",
    desa: "",
    rt: "",
  });
  const [lastUpdatedTimes, setLastUpdatedTimes] = useState({});

  useEffect(() => {
    getStatistics();
  }, []);

  useEffect(() => {
    if (statistics.length > 0) {
      setFormData({
        kecamatan: statistics[0].kecamatan,
        desa: statistics[0].desa,
        rt: statistics[0].rt,
      });
      setLastUpdatedTimes({
        kecamatan: new Date(statistics[0].update_at_kec),
        desa: new Date(statistics[0].update_at_des),
        rt: new Date(statistics[0].update_at_rt),
      });
    }
  }, [statistics]);

  const getStatistics = async () => {
    try {
      const response = await api5.get("/api/statistik");
      setStatistics(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return [];
    }
  };

  // Handle input change and validation
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update form data
    setFormData({
      ...formData,
      [id]: value,
    });

    // Validate input for all fields to allow only numbers
    const isNumeric = /^[0-9]*$/.test(value);
    setErrors({
      ...errors,
      [id]: isNumeric ? "" : `${fieldLabels[id]} harus berupa angka`,
    });
  };

  const updateStatistik = async (field, value) => {
    try {
      let endpoint = "";

      // Tentukan endpoint berdasarkan field yang diupdate
      switch (field) {
        case "kecamatan":
          endpoint = "/api/statistik/updateKec";
          break;
        case "desa":
          endpoint = "/api/statistik/updateDes";
          break;
        case "rt":
          endpoint = "/api/statistik/updateRt";
          break;
        default:
          throw new Error("Invalid field");
      }

      // Buat request body sesuai dengan field yang diupdate
      const requestData = { [field]: parseInt(value) };

      // Kirim request ke server
      const response = await api5.put(`${endpoint}`, requestData);

      getStatistics();

      message.success(`Berhasil mengubah angka ${field}!`, 8);
      // Jika berhasil, return response data
      return response.data;
    } catch (error) {
      message.error(`Gagal mengubah angka ${field}!`, 8);
      console.error("Error updating statistik:", error);
      throw error;
    }
  };

  const handleSubmit = (e, fieldId) => {
    e.preventDefault();
    if (!errors[fieldId]) {
      console.log(`Submit ${fieldId} with value: ${formData[fieldId]}`);
      // Add your submit logic here (e.g., API call)

      updateStatistik(fieldId, formData[fieldId]);
    }
  };

  const formFields = [
    {
      id: "kecamatan",
      label: "Kecamatan",
      placeholder: "Masukkan Kecamatan (Angka)",
    },
    { id: "desa", label: "Desa", placeholder: "Masukkan Desa (Angka)" },
    { id: "rt", label: "RT", placeholder: "Masukkan RT (Angka)" },
  ];

  const fieldLabels = {
    kec: "Kecamatan",
    des: "Desa",
    rt: "RT",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex items-center justify-center flex-1 p-12">
        {statistics.length > 0 && (
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
                      className={`flex-1 px-3 py-2 transition-shadow border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors[field.id] ? "border-red-500" : ""
                      }`}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                    />
                    <button
                      type="submit"
                      className={`px-4 py-2 text-white transition-all bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors[field.id] ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={(e) => handleSubmit(e, field.id)}
                      disabled={!!errors[field.id]}
                    >
                      <FaCheck />
                    </button>
                  </div>
                  {/* Display error message */}
                  {errors[field.id] && (
                    <p className="ml-[90px] text-sm font-semi text-red-500">
                      {errors[field.id]}
                    </p>
                  )}
                  {/* Display the "last updated" text */}
                  <p className="ml-[90px] text-sm font-semi text-gray-500">
                    Diperbarui {getTimeDifference(lastUpdatedTimes[field.id])}{" "}
                    yang lalu
                  </p>
                </div>
              ))}
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default StatAdm;
