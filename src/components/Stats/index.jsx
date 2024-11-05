import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import api5 from '../../utils/api5';

const StatCard = ({ num, label }) => (
  <div className="w-full max-w-[200px] h-[160px] px-10 py-5 rounded-xl flex flex-col justify-center items-center bg-gradient-to-b from-[#E63900] to-[#F3A853] text-white shadow-xl">
    <b className="text-3xl">
      <CountUp end={num} duration={4} />
    </b>
    <p className="mt-2 text-2xl font-medium text-white font-assistant">{label}</p>
  </div>
);

export default function Stats() {
  const [list, setList] = useState([
    { num: 0, label: "Kecamatan" },
    { num: 0, label: "Desa" },
    { num: 0, label: "RT" }
  ]);

  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setList([
        { num: data.kecamatan || 0, label: "Kecamatan" },
        { num: data.desa || 0, label: "Desa" },
        { num: data.rt || 0, label: "RT" }
      ]);
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await api5.get("/api/statistik");
      if (response.data) {
        setData(response.data[0]);
      } else {
        throw new Error("Data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <img src="/pict/Group 29.svg" alt="Background Image" className="w-full h-auto" />
      <div className="max-w-full py-10 bg-base">
        <div className="flex flex-col items-center justify-center space-y-5 md:flex-row md:space-x-20 md:space-y-0">
          {list.map((item, index) => (
            <StatCard key={index} num={item.num} label={item.label} />
          ))}
        </div>
      </div>
      <img src="/pict/Group 30.svg" alt="Background Image" className="w-full h-auto" />
    </div>
  );
}
