/* eslint-disable react/prop-types */
import { useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@nextui-org/react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RtDetail = ({ rt, geojson = null }) => {
  const mapRef = useRef();

  console.log("RtDetail: ", rt, geojson);

  if (geojson && mapRef.current) {
    const map = mapRef.current;
    console.log("Map reference:", map);

    // Remove existing GeoJSON layers
    map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) {
        map.removeLayer(layer);
      }
    });

    // Add new GeoJSON layer
    const geoJsonLayer = new L.GeoJSON(geojson, {
      onEachFeature: (feature, layer) => {
        layer.on({
          click: () => {
            map.fitBounds(layer.getBounds());
          },
        });

        // Add label
        if (feature.properties && feature.properties.label) {
          const label = feature.properties.label;
          const labelIcon = L.divIcon({
            className: "geojson-label",
            html: `<div class="font-inter font-bold text-white text-center w-full">${label}</div>`,
            iconSize: [300, 40],
          });
          L.marker(layer.getBounds().getCenter(), { icon: labelIcon }).addTo(map);
        }
      },
    });
    geoJsonLayer.addTo(map);
    map.fitBounds(geoJsonLayer.getBounds());
    console.log("Fitting bounds:", geoJsonLayer.getBounds());
  }

  // Table columns configuration
  const tableColumns = [
    { label: 'Kode', value: rt.kode },
    { label: 'RT', value: rt.rt },
    { label: 'RW', value: rt.rw },
    { label: 'Dusun', value: rt.dusun },
    { label: 'Jumlah Ruta', value: rt.jml_ruta },
    { label: 'Jumlah UMKM', value: rt.jml_umkm },
    { label: 'Jumlah UMKM Ketegori A', value: rt.jml_umkm_kbli_a },
    { label: 'Jumlah UMKM Ketegori B', value: rt.jml_umkm_kbli_b },
    { label: 'Jumlah UMKM Ketegori C', value: rt.jml_umkm_kbli_c },
    { label: 'Jumlah UMKM Ketegori D', value: rt.jml_umkm_kbli_d },
    { label: 'Jumlah UMKM Ketegori E', value: rt.jml_umkm_kbli_e },
    { label: 'Jumlah UMKM Ketegori F', value: rt.jml_umkm_kbli_f },
    { label: 'Jumlah UMKM Ketegori G', value: rt.jml_umkm_kbli_g },
    { label: 'Jumlah UMKM Ketegori H', value: rt.jml_umkm_kbli_h },
    { label: 'Jumlah UMKM Ketegori I', value: rt.jml_umkm_kbli_i },
    { label: 'Jumlah UMKM Ketegori J', value: rt.jml_umkm_kbli_j },
    { label: 'Jumlah UMKM Ketegori K', value: rt.jml_umkm_kbli_k },
    { label: 'Jumlah UMKM Ketegori L', value: rt.jml_umkm_kbli_l },
    { label: 'Jumlah UMKM Ketegori M', value: rt.jml_umkm_kbli_m },
    { label: 'Jumlah UMKM Ketegori N', value: rt.jml_umkm_kbli_n },
    { label: 'Jumlah UMKM Ketegori O', value: rt.jml_umkm_kbli_o },
    { label: 'Jumlah UMKM Ketegori P', value: rt.jml_umkm_kbli_p },
    { label: 'Jumlah UMKM Ketegori Q', value: rt.jml_umkm_kbli_q },
    { label: 'Jumlah UMKM Ketegori R', value: rt.jml_umkm_kbli_r },
    { label: 'Jumlah UMKM Ketegori S', value: rt.jml_umkm_kbli_s },
    { label: 'Jumlah UMKM Ketegori T', value: rt.jml_umkm_kbli_t },
    { label: 'Jumlah UMKM Ketegori U', value: rt.jml_umkm_kbli_u },
    { label: 'Jumlah UMKM Bangunan Khusus Usaha', value: rt.jml_umkm_lokasi_bangunan_khusus_usaha },
    { label: 'Jumlah UMKM Bangunan Campuran', value: rt.jml_umkm_lokasi_bangunan_campuran },
    { label: 'Jumlah UMKM Kaki Lima', value: rt.jml_umkm_lokasi_kaki_lima },
    { label: 'Jumlah UMKM Keliling', value: rt.jml_umkm_lokasi_keliling },
    { label: 'Jumlah UMKM di Dalam Bangunan Tempat Tinggal atau Online', value: rt.jml_umkm_lokasi_didalam_bangunan_tempat_tinggal_online },
    { label: 'Jumlah UMKM PT/Persero/Sejenisnya', value: rt.jml_umkm_bentuk_pt_persero_sejenisnya },
    { label: 'Jumlah UMKM Ijin Desa atau Ijin Lainnya', value: rt.jml_umkm_bentuk_ijin_desa_ijin_lainnya },
    { label: 'Jumlah UMKM Tidak Berbadan Hukum', value: rt.jml_umkm_bentuk_tidak_berbadan_hukum },
    { label: 'Jumlah UMKM Mikro', value: rt.jml_umkm_skala_usaha_mikro },
    { label: 'Jumlah UMKM Kecil', value: rt.jml_umkm_skala_usaha_kecil },
    { label: 'Jumlah UMKM Menengah', value: rt.jml_umkm_skala_usaha_menengah },
  ];

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full overflow-hidden border border-gray-300 rounded-lg table-detail-rt">
        <tbody className="text-[14px]">
          {tableColumns.map((column, index) => (
            <tr key={index} className="bg-white/70">
              <th className="p-3 font-semibold text-left border border-gray-300">
                {column.label}
              </th>
              <td className="p-3 text-right border border-gray-300">
                {column.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {geojson && (
        <div className="my-4">
          <p className="text-[14px] font-bold ml-3 my-2 text-pdarkblue">Peta Wilayah SLS</p>
          <MapContainer
            key={JSON.stringify(geojson)} // Ensure a new key when geojson changes
            ref={mapRef}
            center={[0, 0]} // Initial center, will be overridden by fitBounds
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: "200px", width: "100%" }}
            className="border-4 rounded-lg border-slate-300"
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri"
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
};

const DetailRtModal = ({ isOpen, onOpenChange, selectedRt, geojsonRt }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      className="font-inter bg-slate-100 max-h-[90%] my-auto"
      classNames={{
        header: "border-b-[1px] border-slate-300",
        footer: "border-t-[1px] border-slate-300",
        wrapper: "overflow-y-hidden",
      }}
    >
      <ModalContent className="font-inter text-pdarkblue">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white bg-slate-600">
              Detail {selectedRt.label}
            </ModalHeader>
            <ModalBody className="py-4 overflow-y-auto">
              <RtDetail rt={selectedRt} geojson={geojsonRt} />
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-[#0B588F] text-white font-inter font-semibold"
                onPress={() => onOpenChange(false)}
              >
                Tutup
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DetailRtModal;
