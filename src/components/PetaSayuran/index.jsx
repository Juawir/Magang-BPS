/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { divIcon } from "leaflet";
import { Transition } from "@headlessui/react";
import api2 from "../../utils/api4.js";
import { message } from "antd";
import CountUp from "react-countup";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { BeatLoader } from "react-spinners";

export default function MapSection() {
  const [selectedClassification, setSelectedClassification] = useState("all");
  const [selectedtUsaha, setSelectedtUsaha] = useState("all");
  const [selectedJenisPupuk, setSelectedJenisPupuk] = useState("all");
  const [mapInstance, setMapInstance] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [data, setData] = useState([]);
  const [dataAgregat, setDataAgregat] = useState([]);
  const [dataRumahTangga, setDataRumahTangga] = useState([]);
  const [selectedRT, setSelectedRT] = useState("desa");
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(
    data ? (data.length > 0 ? data[0] : {}) : {}
  );
  const [showRT, setShowRT] = useState(true);
  const [showIndividu, setIndividu] = useState(true);
  const [visualization, setVisualization] = useState("umkm");
  const toggleRT = () => setShowRT(!showRT);
  const changeVisualization = (type) => setVisualization(type);

  const fetchData = async () => {
    setLoading(true); // Mulai loading
    try {
      const response = await api2.get("/api/sls/all/geojson");
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

  const fetchDataAgregat = async () => {
    setLoading(true); // Mulai loading
    try {
      const response = await api2.get("/api/sls/all/aggregate");
      setDataAgregat(response.data.data); // Update state dengan data dari API
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

  const fetchDataRumahTangga = async () => {
    setLoading(true); // Mulai loading
    try {
      const response = await api2.get("/api/usahasayuran");
      setDataRumahTangga(response.data.data); // Update state dengan data dari API
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
    if (!isFetched) {
      setLoading(true);
      Promise.all([fetchData(), fetchDataAgregat(), fetchDataRumahTangga()])
        .then(() => setIsFetched(true))
        .catch((error) => {
          message.error(`Terjadi kesalahan: ${error.message}`, 5);
        })
        .finally(() => setLoading(false));
    }
  }, [isFetched]);  

  // Function to determine style based on feature properties
  const getStyle = (data) => {
    const density = data.features[0].properties.total_usaha_sayuran|| 0;
    return {
      fillColor: getColor(density),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.3,
    };
  };

  const getColor = (density) => {
    return density > 32
      ? "#40A578"
      : density > 16
      ? "#68B92E"
      : density > 8
      ? "#9DDE8B"
      : density > 4
      ? "#E6FF94"
      : density > 1
      ? "#FED976"
      : "#000000";
  };

  const markerIcon = divIcon({
  className: "custom-label",
  html: `<div style="
             background-color: #68B92E;
             border-radius: 50%;
             width: 1.5rem;
             height: 1.5rem;
             border: 0.1rem solid white;
             display: flex;
             justify-content: center;
             align-items: center;
           ">
             <span class="material-icons" style="color: #FFFFFF; font-size: 1rem;">eco</span>
           </div>`,
  });
  
  

  let selectedLayer = null; // Track the currently selected layer

  const onEachFeature = (feature, layer) => {
  layer.on({
    mouseover: (e) => {
      const layer = e.target;
      if (layer !== selectedLayer) {
        layer.setStyle({
          weight: 4,
          color: "#fff",
          dashArray: "",
          fillOpacity: 0.8,
        });
      }

      const keysLayer = [
        "RT",
        "RW",
        "Dusun",
        "Jumlah Usaha Sayuran",
      ];
      const keysToShow = [
        "rt",
        "rw",
        "dusun",
        "total_usaha_sayuran",
      ];

      const popupContent = `<div>
        <strong>Informasi RT:</strong><br>
        ${keysToShow
          .map(
            (key, index) =>
              `${keysLayer[index]}: ${feature.properties[key] || "N/A"}`
          )
          .join("<br>")}
      </div>`;

      const popup = layer.bindPopup(popupContent, {
        autoPan: false,
      }).openPopup(e.latlng);

      popup.setLatLng(e.latlng);
    },

    mouseout: (e) => {
      const layer = e.target;
      if (layer !== selectedLayer) {
        layer.setStyle({
          weight: 2,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.3,
        });
      }
      layer.closePopup();
    },

    click: (e) => {
      const layer = e.target;
      
      // Reset previous selected layer style
      if (selectedLayer) {
        selectedLayer.setStyle({
          weight: 2,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.3,
        });
      }
      
      // Set the current layer as the selected layer
      if (selectedLayer === layer) {
        selectedLayer = null;
        setSelectedRT("desa");
      } else {
        selectedLayer = layer;
        setSelectedRT(feature.properties.kode);
        layer.setStyle({
          weight: 4,
          color: "#fff",
          dashArray: "",
          fillOpacity: 0.8, // Ensure opacity is set to 0.8 when clicked
        });
      }
    },
  });
};

  useEffect(() => {
    if (data && data.length > 0) {
      // Periksa apakah data ada dan tidak kosong
      if (selectedRT === "desa") {
        setFilteredData(data[0]);
      } else {
        const filtered = data.find(
          (item) => item.features[0].properties.kode === selectedRT
        );
        setFilteredData(filtered || data[0]); // Fallback to data[0] if no match is found
      }
    } else {
      // Jika data tidak ada atau kosong, Anda bisa mengatur filteredData ke nilai default
      setFilteredData(null); // Atau data default lainnya jika diperlukan
    }
  }, [selectedRT, data]);

  function capitalizeWords(input) {
    // Handle array input
    if (Array.isArray(input)) {
        return input.map((str) => capitalizeSingleString(str)).join(" ");
    } else if (typeof input === 'string') {
        // Handle string input
        return capitalizeSingleString(input);
    } else {
        console.error("capitalizeWords expects a string or an array but received:", input);
        return input; // Or handle the error as needed
    }
  }

  function capitalizeSingleString(str) {
      // Special cases mapping
      const specialCases = {
          npk: "NPK"
      };

      // Check for special cases first
      if (specialCases[str.toLowerCase()]) {
          return specialCases[str.toLowerCase()];
      }

      // Capitalize normally if not a special case
      return str
          .split(/[-_/]/) // Split based on "-", "_", or "/"
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" "); // Combine the processed strings with a space
  }

  function calculateCentroid(multiPolygon) {
    let totalX = 0,
      totalY = 0,
      totalPoints = 0;

    multiPolygon.coordinates.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach((coordinate) => {
          totalX += coordinate[0];
          totalY += coordinate[1];
          totalPoints++;
        });
      });
    });

    const centroidX = totalX / totalPoints;
    const centroidY = totalY / totalPoints;

    return [centroidY, centroidX]; // Return as an array of floats
  }

  const tempatUsaha = {
    all: "Semua Produk",
    dijual_ke_tengkulak : "Sebagian besar dijual ke tengkulak",
    dijual_sendiri : "Sebagian besar dijual ke sendiri",
  };

  const jenisPupuk = {
    all: "Semua Jenis Pupuk",
    urea: "Pupuk Urea",
    npk: "Pupuk NPK",
    non_organik_lainnya: "Pupuk Non Organik Lainnya",
    organik: "Pupuk Organik",
    tidak_ada: "Tidak Ada"
  };

  const classifications = {
    all: "Semua Tanaman",
    sawi: "Sawi",
    kangkung: "Kangkung",
    bayam: "Bayam",
  };

  const handleClassificationChange = (event) => {
    setSelectedClassification(event.target.value);
  };

  const handleJenisPupukChange = (event) => {
    setSelectedJenisPupuk(event.target.value);
  };
  
  const handletUsahaChange = (event) => {
    setSelectedtUsaha(event.target.value);
  };

  const MemoizedGeoJSON = memo(({ data, style, onEachFeature }) => (
    <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
  ));

  MemoizedGeoJSON.displayName = "MemoizedGeoJSON";

  const filtered = useMemo(() => {
    return dataRumahTangga.filter((item) => {
      // Filter by selectedRT
      const matchRT =
        selectedRT === "desa" || item.kodeSls === selectedRT;
  
      // Filter by selectedClassification (matches any tanaman in daftar_tanaman)
      const matchClassification =
        selectedClassification === "all" ||
        item.daftar_tanaman.some(
          (tanaman) => tanaman.nama_tanaman === selectedClassification
        );
       
        const matchJenisPupuk = 
        selectedJenisPupuk === "all" ||
        item.daftar_tanaman.some(
          (tanaman) => tanaman.jenis_pupuk === selectedJenisPupuk
        );      
  
      // Filter by selectedtUsaha (matches pemanfaatan_produk)
      const matchUsaha =
        selectedtUsaha === "all" ||
        item.daftar_tanaman.some(
          (tanaman) => tanaman.pemanfaatan_produk === selectedtUsaha
        );  
  
      // Return combined result
      return matchRT && matchClassification && matchUsaha && matchJenisPupuk;
    });
  }, [dataRumahTangga, selectedRT, selectedClassification, selectedtUsaha, selectedJenisPupuk]);
  

  const CustomMarker = memo(
    ({ item }) => (
      <Marker
        position={[parseFloat(item.latitude), parseFloat(item.longitude)]}
        icon={markerIcon}
      >
      <Popup>
      <div className="z-100000000 w-full">
        <div className="mb-4">
          {item.rt_rw_dusun}
          <br />
          <strong>Nama Pengusaha:</strong>
          <br />{item.nama_pengusaha}
        </div>

        <div className="w-full rounded-lg overflow-hidden">
        <div className="max-h-64 overflow-y-auto overflow-x-auto">
    <table className="w-full border-collapse">
      <thead className="bg-[#E6FF94] sticky top-0 z-10">
        <tr>
          <th className="border border-[#E6FF94] px-2 py-2 text-left text-gray-600"></th>
          {item.daftar_tanaman && item.daftar_tanaman.length > 0 &&
            item.daftar_tanaman.map((tanaman) => (
              <th key={tanaman._id} className="border border-[#E6FF94] px-4 py-2 text-left text-gray-600">
                {capitalizeWords(tanaman.nama_tanaman)}
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {[
          { label: "Frekuensi tanam*", field: "frekuensi_tanam" },
          { label: "Rata-rata luas tanam (m²)", field: "rata2_luas_tanam", isDecimal: true },
          { label: "Frekuensi panen*", field: "frekuensi_panen" },
          { label: "Rata-rata luas panen (m²)", field: "rata2_luas_panen", isDecimal: true },
          { label: "Penyebab luas panen kurang dari luas tanam", field: "penyebab_luas_panen_kurang_dari_luas_tanam", isText: true },
          { label: "Rata-rata volume produksi (kg)", field: "rata2_volume_produksi" },
          { label: "Rata-rata nilai produksi (Rp)", field: "rata2_nilai_produksi" },
          { label: "Jenis Pupuk", field: "jenis_pupuk", isText: true },
          { label: "Mendapat penyuluhan?", field: "is_penyuluhan", isYesNo: true },
          { label: "Pemanfaatan produk", field: "pemanfaatan_produk", isText: true }
        ].map((row, index) => (
          <tr key={index} className="hover:bg-[#e6ff945e] transition duration-200">
            <td className="border border-[#E6FF94] px-2 py-2 text-gray-700">{row.label}</td>
            {item.daftar_tanaman.map((tanaman) => (
              <td key={tanaman._id} className="border border-[#E6FF94] px-4 py-2 text-gray-700">
                {row.isDecimal
                  ? tanaman[row.field].toFixed(2)
                  : row.isYesNo
                  ? tanaman[row.field] ? 'Ya' : 'Tidak'
                  : row.isText
                  ? capitalizeWords(tanaman[row.field])
                  : tanaman[row.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        <p className="text-xs italic mt-2">*periode Januari-September 2024</p>
      </div>
      </Popup>


      </Marker>
    ),
    []
  );

  CustomMarker.displayName = "CustomMarker";

  const Colors = ['#FED976','#d4ac2b']; // Two colors: base color and a lighter tint
  const LegendMenu = () => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const toggleExpand2 = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div className="relative">
        {/* Tombol Simbol Legenda */}
        <button
          onClick={toggleExpand2}
          className={`py-1 px-2 rounded-md focus:outline-none ${
            isExpanded ? "bg-[#68B92E] text-white" : "bg-gray-200 text-gray-800"
          }`}
          aria-label="Toggle Legend"
        >
          {/* Ikon untuk tombol */}
          <span className="material-icons">legend_toggle</span>
        </button>
  
        {/* Menu yang akan diperluas ketika tombol diklik */}
        {isExpanded && (
          <div
            className="absolute right-0 bottom-full mb-3 p-4 w-[20vh] bg-white rounded-md shadow-md text-gray-800"
            style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
            backdropFilter: "blur(12px)", // Blur effect
          }}
          >
            <div className="mb-1 text-sm font-semibold text-right">
              Jumlah Usaha
            </div>
            <div className="relative h-6 mb-2 rounded-full">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to left, #68B92E, #9DDE8B,#E6FF94)",
                  borderRadius: "99px",
                }}
              ></div>
            </div>
            <div className="flex justify-between px-2 mt-1">
              <span className="text-xs">0</span>
              <span className="text-xs">50+</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-[89vh] font-sfProDisplay">
      <div className="absolute top-0 left-0 z-0 w-full h-full">
        <MapContainer
          center={[-7.4612266,112.658755]} // lokasi desa simoanginangin
          zoom={16}
          scrollWheelZoom={true}
          className="w-full h-full"
          touchZoom={true}
          whenCreated={setMapInstance}
        >
          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer checked name="Google Sattelite">
              <TileLayer
                url="https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Google Street">
              <TileLayer
                url="https://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          {data ? (
            data.length > 0 &&
            data.map((geoJsonData, index) => (
              <>
                <MemoizedGeoJSON
                  key={index}
                  data={geoJsonData}
                  style={getStyle(geoJsonData)}
                  onEachFeature={onEachFeature}
                />
                {showRT && (
                  <Marker
                    key={`marker-${geoJsonData.features[0].properties.kode}`}
                    position={calculateCentroid(
                      geoJsonData.features[0].geometry
                    )}
                    icon={divIcon({
                      className: "custom-label",
                      html: `<div class="w-[125px] text-white text-[0.8rem] font-bold absolute p-2"
                        style="
                          -webkit-text-stroke-width: 0.1px;
                          -webkit-text-stroke-color: black;
                          text-shadow: 1px 1px #000;
                        ">RT ${
                          geoJsonData.features[0].properties.rt || "No label"
                        }/RW ${
                          geoJsonData.features[0].properties.rw || "No label"
                        }</div>`,
                      })}
                  />
                )}
              </>
            ))
          ) : (
            <BeatLoader />
          )}
          {showIndividu && (
            <MarkerClusterGroup>
              {filtered.map((item) => (
                <CustomMarker key={`marker-${item._id}`} item={item} />
              ))}
            </MarkerClusterGroup>
          )}
        </MapContainer>
      </div>

      <div className="mx-[10%] font-sfProDisplay">
        <button
          className="absolute top-4 right-[10%] z-10 px-11 py-2 bg-[#68B92E] text-white rounded-xl shadow-md flex items-center"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="mr-2 material-icons">filter_list</span>
          Filter
        </button>

        <button
          className="absolute top-4 left-[10%] z-10 px-12 py-2 bg-[#68B92E] text-white rounded-xl shadow-md flex items-center"
          onClick={() => setIsVisualizationOpen(!isVisualizationOpen)}
        >
          <span className="mr-2 material-icons">analytics</span>
          Statistik
        </button>

        <Transition
          show={isFilterOpen}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 transform scale-95"
          enterTo="opacity-100 transform scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 transform scale-100"
          leaveTo="opacity-0 transform scale-95"
          className="absolute top-16 right-[10%] z-10 w-64 p-4 bg-[#eaffdb] rounded-md shadow-md text-[#065f46]"
        >
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Tahun</label>
                <select
                  id="tahun"
                  name="tahun"
                  className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-600 bg-[#b4fa82] text-[#065f46] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="2024">2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">RT/RW</label>
                <select
                  id="rt"
                  name="rt"
                  className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-600 bg-[#b4fa82] text-[#065f46] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedRT}
                  onChange={(e) => setSelectedRT(e.target.value)}
                >
                  <option value="desa">Semua RT/RW</option>
                  {data && data.length > 0 ? (
                    data.map((item) => {
                      const { rt, rw, kode } = item.features[0].properties;
                      return (
                        <option key={rt} value={kode}>
                          {rt}/{rw}
                        </option>
                      );
                    })
                  ) : (
                    <option value="" disabled>
                      No RT available
                    </option>
                  )}
                </select>
              </div>
            </div>

            <label className="block mt-4 text-sm font-medium">Nama Sayuran Semusim</label>
            <select
              id="jenis"
              name="jenis"
              className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-600 bg-[#b4fa82] text-[#065f46] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={handleClassificationChange}
              value={selectedClassification}
            >
              {Object.entries(classifications).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <label className="block mt-4 text-sm font-medium">Jenis Pupuk</label>
            <select
              id="tUsaha"
              name="tUsaha"
              className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-600 bg-[#b4fa82] text-[#065f46] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={handleJenisPupukChange}
              value={selectedJenisPupuk}
            >
              {Object.entries(jenisPupuk).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <label className="block mt-4 text-sm font-medium">Pemanfaatan Hasil Produksi</label>
            <select
              id="tUsaha"
              name="tUsaha"
              className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-600 bg-[#b4fa82] text-[#065f46] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={handletUsahaChange}
              value={selectedtUsaha}
            >
              {Object.entries(tempatUsaha).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </Transition>


        <Transition
          show={isVisualizationOpen}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 transform scale-95"
          enterTo="opacity-100 transform scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 transform scale-100"
          leaveTo="opacity-0 transform scale-95"
          className="absolute top-16 left-[10%] z-10 w-64 max-h-[77vh] p-4 bg-[#eaffdb] rounded-md shadow-md text-white overflow-y-auto"
        >
          <div className="text-center">
          {filteredData?.features?.[0] ? (
            <>
              {selectedRT !== "desa" ? (
                <>
                  <div className="mb-4">
                    <p className="bg-[#b4fa82] text-[#065f46] rounded-full p-1 text-sm font-medium">
                      <span className="mr-1 text-sm material-icons  text-[#065f46]">location_on</span>
                      RT {filteredData.features[0].properties.rt} RW {filteredData.features[0].properties.rw} <br></br>{filteredData.features[0].properties.dusun}
                    </p>
                  </div>

                  <div className="bg-[#d3f4a2] p-4 rounded-md mb-4 text-left">
                  <div className="text-4xl font-bold text-[#6b8e23]">
                    <CountUp start={0} end={filteredData.features[0].properties.total_usaha_sayuran} duration={3} />
                  </div>
                  <p className="text-xm text-[#6b8e23]">Pengusaha <br></br>Sayuran Semusim</p>
                </div>

                <div className="bg-[#d3f4a2] p-4 rounded-md mb-4 text-left space-y-4">
                  {/* Unit Usaha Kangkung */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#FED976] text-[#8F722E] font-bold w-10 text-center px-3 py-1 rounded-lg">
                      <CountUp
                        start={0}
                        end={filteredData.features[0].properties.total_tanaman_kangkung}
                        duration={3}
                      />
                    </div>
                    <p className="text-sm text-[#8F722E]">Unit Usaha Kangkung</p>
                  </div>

                  {/* Unit Usaha Bayam */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#e0ff8c] text-[#728B3C] font-bold w-10 text-center px-3 py-1 rounded-lg">
                      <CountUp
                        start={0}
                        end={filteredData.features[0].properties.total_tanaman_bayam}
                        duration={3}
                      />
                    </div>
                    <p className="text-sm text-[#728B3C]">Unit Usaha Bayam</p>
                  </div>

                  {/* Unit Usaha Sawi */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#a2e48f] text-[#587644] font-bold w-10 text-center px-3 py-1 rounded-lg">
                      <CountUp
                        start={0}
                        end={filteredData.features[0].properties.total_tanaman_sawi}
                        duration={3}
                      />
                    </div>
                    <p className="text-sm text-[#587644]">Unit Usaha Sawi</p>
                  </div>
                </div>

                </>
              ) : (
                <>
                <div className="mb-4">
                  <p className="bg-[#b4fa82] text-[#065f46] rounded-full p-1 text-sm font-medium">
                    <span className="mr-1 text-[#065f46] text-sm material-icons">location_on</span>
                    Desa Grogol
                  </p>
                </div>

                <div className="bg-[#d3f4a2] p-4 rounded-md mb-4 text-left">
                  <div className="text-4xl font-bold text-[#6b8e23]">
                    <CountUp start={0} end={dataAgregat.total_usaha_sayuran} duration={3} />
                  </div>
                  <p className="text-xm text-[#6b8e23]">Pengusaha <br></br>Sayuran Semusim</p>
                </div>

                <div className="bg-[#d3f4a2] p-4 rounded-md mb-4 text-left space-y-4">
                  {/* Unit Usaha Kangkung */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#FED976] text-[#8F722E] font-bold w-10 text-center px-3 py-1 rounded-lg">
                      <CountUp
                        start={0}
                        end={dataAgregat.total_tanaman_kangkung}
                        duration={3}
                      />
                    </div>
                    <p className="text-sm text-[#8F722E]">Unit Usaha Kangkung</p>
                  </div>

                  {/* Unit Usaha Bayam */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#e0ff8c] text-[#728B3C] font-bold w-10 text-center px-3 py-1 rounded-lg">
                      <CountUp
                        start={0}
                        end={dataAgregat.total_tanaman_bayam}
                        duration={3}
                      />
                    </div>
                    <p className="text-sm text-[#728B3C]">Unit Usaha Bayam</p>
                  </div>

                  {/* Unit Usaha Sawi */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-[#a2e48f] text-[#587644] font-bold w-10 text-center px-3 py-1 rounded-lg">
                      <CountUp
                        start={0}
                        end={dataAgregat.total_tanaman_sawi}
                        duration={3}
                      />
                    </div>
                    <p className="text-sm text-[#587644]">Unit Usaha Sawi</p>
                  </div>
                </div>

                </>
              )}
            </>
          ) : null}
          </div>


        </Transition>
        <div
          className="absolute bottom-4 right-4 z-10 w-auto p-2 mr-[8%] bg-white rounded-md shadow-md text-gray-800"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background
            backdropFilter: "blur(12px)", // Blur effect
          }}
        >
          <div className="flex items-center justify-center">
            <button
              className={`py-1 px-2 rounded-md justify-center items-center text-center text-sm mr-4 ${
                showRT ? "bg-[#68B92E] text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={toggleRT}
            >
              {showRT ? (
                <div className="flex items-center">
                  <span className="mr-2 text-xl material-icons">
                    visibility
                  </span>{" "}
                  RT/RW
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2 text-xl material-icons">
                  visibility_off
                  </span>{" "}
                  RT/RW
                </div>
              )}
            </button>
            <LegendMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
