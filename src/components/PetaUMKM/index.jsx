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
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { divIcon } from "leaflet";
import { Transition } from "@headlessui/react";
import api from "../../utils/api.js";
import { message } from "antd";
import CountUp from "react-countup";
import { BeatLoader } from "react-spinners";

export default function MapSection() {
  const [selectedClassification, setSelectedClassification] = useState("all");
  const [selectedtUsaha, setSelectedtUsaha] = useState("all");
  const [selectedskalaUsaha, setSelectedskalaUsaha] = useState("all");
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

  const fetchData = async (url, setDataCallback) => {
    setLoading(true);
    try {
      const response = await api.get(url);
      setDataCallback(response.data.data);
      console.log("Data fetched:", response.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error(`Terjadi kesalahan: ${errorMessage}`, 5);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      fetchData("/api/rt/all/geojson", setData).then(() => {
        fetchData("/api/rt/all/aggregate", setDataAgregat).then(() => {
          fetchData("/api/rumahTangga/", setDataRumahTangga).then(() => {
            setIsFetched(true);
          });
        });
      });
    }
  }, [isFetched]);

  // Function to determine style based on feature properties
  const getStyle = (data) => {
    const density = data.features[0].properties.jml_umkm || 0;
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
    return density > 100
      ? "#800026"
      : density > 50
      ? "#BD0026"
      : density > 20
      ? "#E31A1C"
      : density > 10
      ? "#FC4E2A"
      : density > 5
      ? "#FD8D3C"
      : density > 2
      ? "#FEB24C"
      : density > 0
      ? "#FED976"
      : "#000000";
  };

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
          "Jumlah Keluarga",
          "Jumlah UMKM",
        ];
        const keysToShow = ["rt", "rw", "dusun", "jml_ruta", "jml_umkm"];

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

  function capitalizeWords(str) {
    return str
      .split(/[-/]/) // Pisahkan berdasarkan "-" dan "/"
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
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
    all: "Semua Tempat Usaha",
    "bangunan-khusus-usaha": "Bangunan Khusus Usaha",
    "bangunan-campuran": "Bangunan Campuran",
    "kaki-lima": "Kaki Lima",
    keliling: "Keliling",
    "didalam-bangunan-tempat-tinggal/online":
      "Didalam Bangunan Tempat Tinggal/Online",
  };

  const skalaUsaha = {
    all: "Semua Skala Usaha",
    "usaha-mikro": "Skala Usaha Mikro",
    "usaha-kecil": "Skala Usaha Kecil",
    "usaha-menengah": "Skala Usaha Menengah",
  };

  const classifications = {
    all: "Seluruh Lapangan Usaha",
    kbli_a: "A. Pertanian, Kehutanan, dan Perikanan",
    kbli_b: "B. Pertambangan dan Penggalian",
    kbli_c: "C. Industri Pengolahan",
    kbli_d: "D. Pengadaan Listrik, Gas, Uap/Air Panas dan Udara Dingin",
    kbli_e:
      "E. Treatment Air, Treatment Air Limbah, Treatment dan Pemulihan Material Sampah, dan Aktivitas Remediasi",
    kbli_f: "F. Konstruksi",
    kbli_g: "G. Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor",
    kbli_h: "H. Pengangkutan dan Pergudangan",
    kbli_i: "I. Penyediaan Akomodasi dan Penyediaan Makan Minum",
    kbli_j: "J. Informasi dan Komunikasi",
    kbli_k: "K. Aktifitas Keuangan dan Asuransi",
    kbli_l: "L. Real Estat",
    kbli_m: "M. Aktivitas Profesional, Ilmiah, dan Teknis",
    kbli_n:
      "N. Aktivitas Penyewaan dan Sewa Guna Usaha Tanpa Hak Opsi, Ketenagakerjaan, Agen Perjalanan dan Penunjang Usaha Lainnya",
    kbli_o: "O. Administrasi Pemerintahan, Pertahanan Dan Jaminan Sosial Wajib",
    kbli_p: "P. Pendidikan",
    kbli_q: "Q. Aktivitas Kesehatan Manusia dan Aktivitas Sosial",
    kbli_r: "R. Kesenian, Hiburan, dan Rekreasi",
    kbli_s: "S. Jasa Lainnya",
    kbli_t:
      "T. Aktivitas Rumah Tangga Sebagai Pemberi Kerja; Aktivitas Yang Menghasilkan Barang Dan Jasa Oleh Rumah Tangga yang Digunakan untuk Memenuhi Kebutuhan Sendiri",
    kbli_u:
      "U. Aktivitas Badan Internasional dan Badan Ekstra Internasional Lainnya",
  };

  const handleClassificationChange = (event) => {
    setSelectedClassification(event.target.value);
  };

  const handletUsahaChange = (event) => {
    setSelectedtUsaha(event.target.value);
  };

  const handleskalaUsahaChange = (event) => {
    setSelectedskalaUsaha(event.target.value);
  };

  const MemoizedGeoJSON = memo(({ data, style, onEachFeature }) => (
    <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
  ));

  MemoizedGeoJSON.displayName = "MemoizedGeoJSON";

  const filteredData2 = useMemo(() => {
    return dataRumahTangga.filter(
      (item) =>
        (selectedRT === "desa" || item.kodeRt === selectedRT) &&
        (selectedClassification === "all" ||
          item.kategori_usaha === selectedClassification) &&
        (selectedtUsaha === "all" ||
          item.lokasi_tempat_usaha === selectedtUsaha) &&
        (selectedskalaUsaha === "all" ||
          item.skala_usaha === selectedskalaUsaha)
    );
  }, [
    dataRumahTangga,
    selectedRT,
    selectedClassification,
    selectedtUsaha,
    selectedskalaUsaha,
  ]);

  const storeIcon = useMemo(
    () =>
      divIcon({
        className: "custom-label",
        html: `<div style="
             background-color: #AF282F;
             border-radius: 50%;
             width: 1.5rem;
             height: 1.5rem;
             border: 0.1rem solid white;
             display: flex;
             justify-content: center;
             align-items: center;
           ">
             <span class="material-icons" style="color: #FFFFFF; font-size: 1rem;">store</span>
           </div>`,
      }),
    []
  );

  const CustomMarker = memo(
    ({ item }) => (
      <Marker
        position={[parseFloat(item.latitude), parseFloat(item.longitude)]}
        icon={storeIcon}
      >
        <Popup>
          <div className="z-100">
            <strong>Informasi UMKM:</strong>
            <br />
            <span className="text-[1rem] font-bold p-0 mt-0 mb-0">
              {item.nama_usaha ? item.nama_usaha : "Tidak ada informasi"}{" "}
            </span>
            <br />
            {item.rt_rw_dusun ? item.rt_rw_dusun : "Tidak ada informasi"}
            <br />
            <b>Kegiatan Utama Usaha: </b>
            <br />
            {item.kegiatan_utama_usaha
              ? item.kegiatan_utama_usaha
              : "Tidak ada informasi"}
            <br />
            <b>Kategori: </b>
            <br />
            {classifications[item.kategori_usaha ? item.kategori_usaha : ""]
              ? classifications[item.kategori_usaha ? item.kategori_usaha : ""]
              : "Tidak ada informasi"}
            <br />
            <b>Tempat Usaha: </b>
            <br />
            {capitalizeWords(
              item.lokasi_tempat_usaha
                ? item.lokasi_tempat_usaha
                : "Tidak ada informasi"
            )}
            <br />
            <b>Skala Usaha: </b>
            <br />
            {capitalizeWords(
              item.skala_usaha ? item.skala_usaha : "Tidak ada informasi"
            )}
          </div>
        </Popup>
      </Marker>
    ),
    []
  );

  CustomMarker.displayName = "CustomMarker";

  return (
    <div className="relative w-full h-[89vh] font-sfProDisplay">
      <div className="absolute top-0 left-0 z-0 w-full h-full">
        <MapContainer
          center={[-7.4388978, 112.59942]} // lokasi desa simoanginangin
          zoom={15}
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

          {
            showIndividu &&
              // <MarkerClusterGroup>
              filteredData2.map((item) => (
                <CustomMarker key={`marker-${item._id}`} item={item} />
              ))
            // </MarkerClusterGroup>
          }
        </MapContainer>
      </div>

      <div className="mx-[10%] font-sfProDisplay">
        <button
          className="absolute top-4 right-[10%] z-10 px-11 py-2 bg-[#AF282F] text-white rounded-xl shadow-md flex items-center"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="mr-2 material-icons">filter_list</span>
          Filter
        </button>

        <button
          className="absolute top-4 left-[10%] z-10 px-12 py-2 bg-[#AF282F] text-white rounded-xl shadow-md flex items-center"
          onClick={() => setIsVisualizationOpen(!isVisualizationOpen)}
        >
          <span className="mr-2 material-icons">analytics</span>
          Visualisasi
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
              Jenis Kategori
            </label>
            <select
              id="jenis-kbli"
              name="jenis-kbli"
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
              Tempat Usaha
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

            <label className="block mt-4 text-sm font-medium text-white">
              Skala Usaha
            </label>
            <select
              id="skala"
              name="skala"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-[#2E2E2E] text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={handleskalaUsahaChange}
              value={selectedskalaUsaha}
            >
              {Object.entries(skalaUsaha).map(([key, value]) => (
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
            {filteredData &&
            filteredData.features &&
            filteredData.features[0] ? (
              <>
                {selectedRT !== "desa" ? (
                  <>
                    <div className="mb-4">
                      <p className="bg-[#2E2E2E] rounded-full p-1 text-sm text-[#fff] font-medium">
                        <span className="mr-1 text-sm material-icons text-[#fff] ">
                          location_on
                        </span>{" "}
                        RT {filteredData.features[0].properties.rt} RW{" "}
                        {filteredData.features[0].properties.rw} Dsn{" "}
                        {filteredData.features[0].properties.dusun}
                      </p>
                    </div>
                    <div className="bg-[#101920] p-4 rounded-md mb-4 text-left">
                      <div className="text-4xl font-bold">
                        <CountUp
                          start={0}
                          end={filteredData.features[0].properties.jml_umkm}
                          duration={3}
                        />
                      </div>
                      <p className="text-xm">Pelaku UMKM</p>
                    </div>
                    <div className="bg-[#101920] p-4 rounded-md mb-4 text-left">
                      <div className="text-4xl font-bold">
                        <CountUp
                          start={0}
                          end={(
                            (filteredData.features[0].properties.jml_umkm /
                              filteredData.features[0].properties.jml_ruta) *
                            100
                          ).toFixed(2)}
                          duration={3}
                          decimals={2}
                        />
                        %
                      </div>
                      <p className="text-xm">Keluarga UMKM</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="bg-[#2E2E2E] rounded-full text-[#fff] p-1 text-sm font-medium">
                        <span className="mr-1 text-sm material-icons">
                          location_on
                        </span>{" "}
                        Desa Simoangin-angin
                      </p>
                    </div>
                    <div className="bg-[#101920] p-4 rounded-md mb-4 text-left">
                      <div className="text-4xl font-bold">
                        <CountUp
                          start={0}
                          end={dataAgregat.jml_umkm}
                          duration={3}
                        />
                      </div>
                      <p className="text-xm">Pelaku UMKM</p>
                    </div>
                    <div className="bg-[#101920] p-4 rounded-md mb-4 text-left">
                      <div className="text-4xl font-bold">
                        <CountUp
                          start={0}
                          end={(
                            (dataAgregat.jml_umkm / dataAgregat.jml_ruta) *
                            100
                          ).toFixed(2)}
                          duration={3}
                          decimals={2}
                        />
                        %
                      </div>
                      <p className="text-xm">Keluarga UMKM</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p>Data tidak tersedia</p>
            )}
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
                showRT ? "bg-[#BD0026] text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={toggleRT}
            >
              {showRT ? (
                <div className="flex items-center">
                  <span className="mr-2 text-xl material-icons">
                    visibility_off
                  </span>{" "}
                  RT
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2 text-xl material-icons">
                    visibility
                  </span>{" "}
                  RT
                </div>
              )}
            </button>
            <div>
              <div className="w-[20vh]">
                <div className="mb-1 text-sm font-semibold text-right">
                  Jumlah UMKM
                </div>
                <div className="relative h-6 mb-2 rounded-full">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to right, #FED976,#FEB24C, #FD8D3C, #FC4E2A, #E31A1C,#BD0026, #800026)",
                      borderRadius: "99px",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between px-2 mt-1">
                  <span className="text-xs">0</span>
                  <span className="text-xs">100+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
