/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, memo, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { divIcon } from "leaflet";
import { Transition } from "@headlessui/react";
import api2 from "../../utils/api2.js";
import { message } from "antd";
import CountUp from "react-countup";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { BeatLoader } from "react-spinners";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function MapSection() {
  const [selectedClassification, setSelectedClassification] = useState("all");
  const [selectedtUsaha, setSelectedtUsaha] = useState("all");
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
      const response = await api2.get("/api/usahaKlengkeng");
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
    const density = data.features[0].properties.jml_unit_usaha_klengkeng || 0;
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
      ? "#7E370C"
      : density > 16
      ? "#B05E27"
      : density > 8
      ? "#D4AC2B"
      : density > 4
      ? "#FFCE45"
      : density > 2
      ? "#FEB24C"
      : density > 1
      ? "#FED976"
      : "#000000";
  };

  const markerIcon = divIcon({
    className: "custom-label",
    html: `
    <span
      class="material-symbols-outlined"
      style="
        color: #BD7A33;
        font-size: 1.5rem;
        font-variation-settings:
          'FILL' 1,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
        -webkit-text-stroke: 0.6px rgba(255, 255, 255, 0.8); /* Menambahkan stroke putih */
      "
    >
      nutrition
    </span>
  `,
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

        const keysLayer = ["RT", "RW", "Dusun", "Jumlah Usaha"];
        const keysToShow = ["rt", "rw", "dusun", "jml_unit_usaha_klengkeng"];

        const popupContent = `<div>
        <strong>Informasi RT:</strong><br>
        ${keysToShow
          .map(
            (key, index) =>
              `${keysLayer[index]}: ${feature.properties[key] || "N/A"}`
          )
          .join("<br>")}
      </div>`;

        const popup = layer
          .bindPopup(popupContent, {
            autoPan: false,
          })
          .openPopup(e.latlng);

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

  function capitalizeWords(arr) {
    if (!Array.isArray(arr)) {
      console.error("capitalizeWords expects an array but received:", arr);
      return arr; // Or handle the error as needed
    }

    return arr
      .map((str) => {
        if (typeof str !== "string") {
          str = String(str); // Convert to string if it's not already
        }
        return str
          .split(/[-_/]/) // Pisahkan berdasarkan "-" dan "/"
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      })
      .join(" ") // Combine the processed strings with a space
      .replace(/\s\/\s/, "/"); // Gabungkan kembali "/" tanpa spasi
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
    kopi_biji_klengkeng: "Kopi Biji Klengkeng",
    Kerajinan_tangan: "Kerajinan Tangan dari Daun (contoh: pigura, kipas)",
    batik_ecoprint: "Batik Ecoprint",
    minuman: "Minuman Klengkeng (contoh: Susu jelly, sirup)",
    makanan: "Makanan Kelengkeng (Selai, Strudel)",
    tidak_dimanfaatkan: "Tidak Dimanfaatkan",
  };

  const classifications = {
    all: "Semua Jenis",
    jml_pohon_new_crystal: "New Crystal",
    jml_pohon_pingpong: "Pingpong",
    jml_pohon_metalada: "Matalada",
    jml_pohon_diamond_river: "Diamond River",
    jml_pohon_merah: "Merah",
  };

  const variables = {
    jml_pohon_new_crystal: "jml_pohon_new_crystal",
    jml_pohon_pingpong: "jml_pohon_pingpong",
    jml_pohon_metalada: "jml_pohon_metalada",
    jml_pohon_diamond_river: "jml_pohon_diamond_river",
    jml_pohon_merah: "jml_pohon_merah",
  };

  const dataJenis = [
    {
      name: "Belum",
      value: dataAgregat.jml_pohon_blm_berproduksi,
    },
    {
      name: "Sudah",
      value: dataAgregat.jml_pohon_sdh_berproduksi,
    },
  ];

  const handleClassificationChange = (event) => {
    setSelectedClassification(event.target.value);
  };

  const handletUsahaChange = (event) => {
    setSelectedtUsaha(event.target.value);
  };

  const MemoizedGeoJSON = memo(({ data, style, onEachFeature }) => (
    <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
  ));

  MemoizedGeoJSON.displayName = "MemoizedGeoJSON";

  const filtered = useMemo(() => {
    return dataRumahTangga.filter(
      (item) =>
        (selectedRT === "desa" || item.kodeSls === selectedRT) &&
        (selectedClassification === "all" ||
          (selectedClassification in variables &&
            item[variables[selectedClassification]] !== 0)) &&
        (selectedtUsaha === "all" ||
          (Array.isArray(item.pemanfaatan_produk) &&
            item.pemanfaatan_produk.includes(selectedtUsaha)))
    );
  }, [dataRumahTangga, selectedRT, selectedClassification, selectedtUsaha]);

  const CustomMarker = memo(
    ({ item }) => (
      <Marker
        position={[parseFloat(item.latitude), parseFloat(item.longitude)]}
        icon={markerIcon}
      >
        <Popup>
          <div className="z-100">
            <strong>Informasi Usaha:</strong>
            {console.log("Check items ", item)}
            <img
              src={item.url_img}
              alt="Kelengkeng Image"
              className="object-cover w-full h-40 mb-3 rounded-lg"
              loading="lazy"
            />
            <b>{item.nama_kepala_keluarga}</b>
            <br />
            {item.rt_rw_dusun}
            <br />
            <b>Jumlah Pohon: </b>
            <br />
            {item.jml_pohon}
            <br />
            <b>Jenis Kelengkeng:</b>
            <br />
            {item.jml_pohon_new_crystal > 0 && (
              <>
                New Crystal: {item.jml_pohon_new_crystal} Pohon
                <br />
              </>
            )}
            {item.jml_pohon_pingpong > 0 && (
              <>
                Pingpong: {item.jml_pohon_pingpong} Pohon
                <br />
              </>
            )}
            {item.jml_pohon_metalada > 0 && (
              <>
                Metalada: {item.jml_pohon_metalada} Pohon
                <br />
              </>
            )}
            {item.jml_pohon_diamond_river > 0 && (
              <>
                Diamond River: {item.jml_pohon_diamond_river} Pohon
                <br />
              </>
            )}
            {item.jml_pohon_merah > 0 && (
              <>
                Merah: {item.jml_pohon_merah} Pohon
                <br />
              </>
            )}
            <b>Volume Produksi: </b>
            <br />
            {item.volume_produksi} kg
            <br />
            <b>Jenis Pupuk: </b>
            <br />
            {capitalizeWords(item.jenis_pupuk)}
            <br />
            <b>Pemanfaatan Produk: </b>
            <br />
            {capitalizeWords(item.pemanfaatan_produk)}
            <br />
          </div>
        </Popup>
      </Marker>
    ),
    []
  );

  CustomMarker.displayName = "CustomMarker";

  const Colors = ["#FED976", "#d4ac2b"]; // Two colors: base color and a lighter tint
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
            isExpanded ? "bg-[#D4AC2B] text-white" : "bg-gray-200 text-gray-800"
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
                    "linear-gradient(to right, #FFCE45,#D4AC2B, #B05E27, #7E370C)",
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
          center={[-7.446033620089397, 112.60262064240202]} // lokasi desa simoanginangin
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
                      html: `<div class="w-[75px] text-white text-[0.8rem] font-bold absolute p-2"
                        style="
                          -webkit-text-stroke-width: 0.1px;
                          -webkit-text-stroke-color: black;
                          text-shadow: 1px 1px #000;
                        ">RT ${
                          geoJsonData.features[0].properties.rt || "No label"
                        }</div>`,
                    })}
                  />
                )}
              </>
            ))
          ) : (
            <BeatLoader />
          )}
          {showIndividu &&
            // <MarkerClusterGroup>
            filtered.map((item) => (
              <CustomMarker key={`marker-${item._id}`} item={item} />
            ))
            // </MarkerClusterGroup>
          }
        </MapContainer>
      </div>

      <div className="mx-[10%] font-sfProDisplay">
        <button
          className="absolute top-4 right-[10%] z-10 px-11 py-2 bg-[#D4AC2B] text-white rounded-xl shadow-md flex items-center"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="mr-2 material-icons">filter_list</span>
          Filter
        </button>

        <button
          className="absolute top-4 left-[10%] z-10 px-12 py-2 bg-[#D4AC2B] text-white rounded-xl shadow-md flex items-center"
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
          className="absolute top-16 right-[10%] z-10 w-64 p-4 bg-[#101920] rounded-md shadow-md text-white"
        >
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">
                  Tahun
                </label>
                <select
                  id="tahun"
                  name="tahun"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-[#2E2E2E] text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="2024">2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  RT
                </label>
                <select
                  id="rt"
                  name="rt"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-[#2E2E2E] text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedRT}
                  onChange={(e) => setSelectedRT(e.target.value)}
                >
                  <option value="desa">Semua RT</option>
                  {data && data.length > 0 ? (
                    data.map((item) => {
                      const { rt, kode } = item.features[0].properties; // Destrukturisasi untuk bersih
                      return (
                        <option key={rt} value={kode}>
                          {rt}
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

            <label className="block mt-4 text-sm font-medium text-white">
              Jenis Kelengkeng
            </label>
            <select
              id="jenis"
              name="jenis"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-[#2E2E2E] text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={handleClassificationChange}
              value={selectedClassification}
            >
              {Object.entries(classifications).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <label className="block mt-4 text-sm font-medium text-white">
              Pemanfaatan Produk
            </label>
            <select
              id="tUsaha"
              name="tUsaha"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-[#2E2E2E] text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
          className="absolute top-16 left-[10%] z-10 w-64 max-h-[77vh] p-4 bg-[#1D262C] rounded-md shadow-md text-white overflow-y-auto"
        >
          <div className="text-center">
            {filteredData?.features?.[0] ? (
              <>
                {selectedRT !== "desa" ? (
                  <>
                    <div className="mb-4">
                      <p className="bg-[#2E2E2E] rounded-full p-1 text-sm text-white font-medium">
                        <span className="mr-1 text-sm text-white material-icons">
                          location_on
                        </span>
                        RT {filteredData.features[0].properties.rt} RW{" "}
                        {filteredData.features[0].properties.rw} Dsn{" "}
                        {filteredData.features[0].properties.dusun}
                      </p>
                    </div>

                    <div className="bg-[#101920] p-4 rounded-md mb-4 text-left">
                      <div className="text-4xl font-bold">
                        <CountUp
                          start={0}
                          end={
                            filteredData.features[0].properties
                              .jml_unit_usaha_klengkeng
                          }
                          duration={3}
                        />
                      </div>
                      <p className="text-xm">Pohon Kelengkeng</p>
                    </div>

                    <div className="bg-[#101920] p-4 rounded-md mb-4 text-left">
                      <p className="mb-1 text-xm">Produksi</p>
                      <PieChart width={175} height={175}>
                        <Pie
                          data={[
                            {
                              name: "Belum",
                              value:
                                filteredData.features[0].properties
                                  .jml_pohon_blm_berproduksi,
                            },
                            {
                              name: "Sudah",
                              value:
                                filteredData.features[0].properties
                                  .jml_pohon_sdh_berproduksi,
                            },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          innerRadius={50}
                        >
                          {[
                            {
                              name: "Belum",
                              value:
                                filteredData.features[0].properties
                                  .jml_pohon_blm_berproduksi,
                            },
                            {
                              name: "Sudah",
                              value:
                                filteredData.features[0].properties
                                  .jml_pohon_sdh_berproduksi,
                            },
                          ].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={Colors[index % Colors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                          layout="horizontal"
                          align="center"
                          verticalAlign="bottom"
                          wrapperStyle={{
                            fontSize: "12px",
                            marginTop: "1rem",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        />
                      </PieChart>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="bg-[#2E2E2E] rounded-full text-white p-1 text-sm font-medium">
                        <span className="mr-1 text-sm material-icons">
                          location_on
                        </span>
                        Desa Simoketawang
                      </p>
                    </div>

                    <div className="bg-[#101920] p-4 rounded-md mb-4 text-left">
                      <div className="text-4xl font-bold">
                        <CountUp
                          start={0}
                          end={dataAgregat.jml_pohon}
                          duration={3}
                        />
                      </div>
                      <p className="text-xm">Pohon Kelengkeng</p>
                    </div>

                    <div className="bg-[#101920] p-4 rounded-md mb-4 text-left">
                      <p className="mb-1 text-xm">Produksi</p>
                      <PieChart width={175} height={175}>
                        <Pie
                          data={dataJenis}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          innerRadius={50}
                        >
                          {dataJenis.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={Colors[index % Colors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                          layout="horizontal"
                          align="center"
                          verticalAlign="bottom"
                          wrapperStyle={{
                            fontSize: "12px",
                            marginTop: "2rem",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        />
                      </PieChart>
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
                showRT ? "bg-[#7E370C] text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={toggleRT}
            >
              {showRT ? (
                <div className="flex items-center">
                  <span className="mr-2 text-xl material-icons">
                    visibility
                  </span>{" "}
                  RT
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2 text-xl material-icons">
                    visibility_off
                  </span>{" "}
                  RT
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
