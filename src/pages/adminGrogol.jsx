/* eslint-disable react/prop-types */
import { Tab, Tabs } from "@nextui-org/tabs";
import { PiUserCircleDashedDuotone } from "react-icons/pi";
import "./pages.css";
import RtTable from "../components/RtTable";
import { message } from "antd";
import RutaTable from "../components/RutaTable";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { dataLabelGrogol, dataLabels, dataLabelSimoketawang } from "./data";
import SimoketawangSlsTable from "../components/SimoketawangSlsTable";
import SimoketawangUsahaTable from "../components/SimoketawangUsahaTable";
import { useMediaQuery } from "react-responsive";
import api from "../utils/api";
import api4 from "../utils/api4";
import GrogolSlsTable from "../components/GrogolSlsTable";
import GrogolUsahaTable from "../components/GrogolUsahaTable";
import { formatNumberWithSpace } from "../utils/formatNumberWithSpace";

const username = localStorage.getItem("username");

const AdminGrogol = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });

  const fetchData = async () => {
    setLoading(true); // Mulai loading
    try {
      // const response = await api.get("/api/rt");
      const [response] = await Promise.all([
        api4.get("/api/sls/all/aggregate"),
      ]);
      setData(response.data.data); // Update state dengan data dari API
      console.log("Data fetched:", response.data.data);
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

  useEffect(() => {
    // Fetch data from API
    fetchData();
  }, []);

  let tabs = [
    {
      id: "sls",
      label: isMobile ? "SLS" : "Satuan Lingkungan Setempat (SLS)",
      content: <GrogolSlsTable fetchDataAggregate={fetchData} />,
    },
    {
      id: "usaha-klengkeng",
      label: isMobile ? "Usaha" : "Usaha Sayuran",
      content: <GrogolUsahaTable fetchDataAggregate={fetchData} />,
    },
  ];

  const StatComponent = ({ label = "Jumlah UMKM", value = 100 }) => {
    return (
      <div className="flex items-center justify-between w-full p-2 border-2 border-dashed border-pgreen rounded-xl font-inter text-pgreen">
        <div className="flex justify-between items-center w-full text-[14px]">
          <span className="font-semibold text-[14px]">{label}</span>
          <span className="ml-2">{value}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center absolute border-b-3 border-[#b4fa82] w-full px-[10%] 2xl:px-[20%] font-inter text-pgreen py-[16px] admin-grogol">
        <h1 className="text-lg font-semibold">Manajemen Data Peta Tematik</h1>
        <div className="flex items-center gap-2">
          <PiUserCircleDashedDuotone className="text-[40px]" />
          <h1 className="text-lg font-semibold">{username}</h1>
        </div>
      </div>
      <div className="flex flex-col items-center w-full min-h-screen bg-[#eaffdb] px-[10%] 2xl:px-[20%] font-inter text-pgreen">
        <h1 className="font-semibold text-[16px] mt-[90px] mb-[12px] bg-white py-2 px-3 w-fit rounded-xl">
          Ringkasan Statistik Usaha Tanaman Sayuran Desa Grogol
        </h1>
        <div className="flex flex-col w-full gap-0 p-5 pb-3 bg-white rounded-xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data
              ? dataLabelGrogol.map(({ key, label }) => {
                  // Dapatkan nilai dari dataAgregat berdasarkan key
                  const value = data[key];

                  // Jika nilai tidak ada, tampilkan 0 atau nilai default
                  return (
                    <StatComponent
                      key={key}
                      label={label}
                      value={
                        typeof value === "number"
                          ? formatNumberWithSpace(value)
                          : 0
                      }
                      // value={value !== undefined ? value : 0}
                    />
                  );
                })
              : null}
          </div>
        </div>
        <Tabs
          aria-label="Dynamic tabs"
          items={tabs}
          className="justify-center mt-[16px] grogol-tabs"
        >
          {(item) => (
            <Tab
              key={item.id}
              title={item.label}
              className="w-full font-semibold"
            >
              {item.content}
            </Tab>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default AdminGrogol;
