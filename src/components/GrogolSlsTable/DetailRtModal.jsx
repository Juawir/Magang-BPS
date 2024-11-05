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
import { formatNumberWithSpace } from "../../utils/formatNumberWithSpace";

const RtDetail = ({ rt, geojson = null }) => {
  const mapRef = useRef();

  if (geojson && mapRef.current) {
    const map = mapRef.current;

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
  }

  const tableColumns = [
    { label: 'Kode', value: rt.kode },
    { label: 'RT', value: rt.rt },
    { label: 'RW', value: rt.rw },
    { label: 'Dusun', value: rt.dusun },
    { label: 'Total Usaha Sayuran', value: formatNumberWithSpace(rt.total_usaha_sayuran) },
    { label: 'Total Tanaman Kangkung', value: formatNumberWithSpace(rt.total_tanaman_kangkung) },
    { label: 'Total Tanaman Bayam', value: formatNumberWithSpace(rt.total_tanaman_bayam) },
    { label: 'Total Tanaman Sawi', value: formatNumberWithSpace(rt.total_tanaman_sawi) },
    { label: 'Total Luas Tanam Kangkung (m²)', value: formatNumberWithSpace(rt.total_rata2_luas_tanam_kangkung) },
    { label: 'Total Luas Tanam Bayam (m²)', value: formatNumberWithSpace(rt.total_rata2_luas_tanam_bayam) },
    { label: 'Total Luas Tanam Sawi (m²)', value: formatNumberWithSpace(rt.total_rata2_luas_tanam_sawi) },
    { label: 'Total Luas Panen Kangkung (m²)', value: formatNumberWithSpace(rt.total_rata2_luas_panen_kangkung) },
    { label: 'Total Luas Panen Bayam (m²)', value: formatNumberWithSpace(rt.total_rata2_luas_panen_bayam) },
    { label: 'Total Luas Panen Sawi (m²)', value: formatNumberWithSpace(rt.total_rata2_luas_panen_sawi) },
    { label: 'Total Volume Produksi Kangkung (kg)', value: formatNumberWithSpace(rt.total_rata2_volume_produksi_kangkung) },
    { label: 'Total Volume Produksi Bayam (kg)', value: formatNumberWithSpace(rt.total_rata2_volume_produksi_bayam) },
    { label: 'Total Volume Produksi Sawi (kg)', value: formatNumberWithSpace(rt.total_rata2_volume_produksi_sawi) },
    { label: 'Total Nilai Produksi Kangkung (000 Rp)', value: formatNumberWithSpace(rt.total_rata2_nilai_produksi_kangkung) },
    { label: 'Total Nilai Produksi Bayam (000 Rp)', value: formatNumberWithSpace(rt.total_rata2_nilai_produksi_bayam) },
    { label: 'Total Nilai Produksi Sawi (000 Rp)', value: formatNumberWithSpace(rt.total_rata2_nilai_produksi_sawi) },
    { label: 'Total Tanaman Kangkung Dijual Sendiri (kg)', value: formatNumberWithSpace(rt.total_tanaman_kangkung_dijual_sendiri) },
    { label: 'Total Tanaman Bayam Dijual Sendiri (kg)', value: formatNumberWithSpace(rt.total_tanaman_bayam_dijual_sendiri) },
    { label: 'Total Tanaman Sawi Dijual Sendiri (kg)', value: formatNumberWithSpace(rt.total_tanaman_sawi_dijual_sendiri) },
    { label: 'Total Tanaman Kangkung Dijual ke Tengkulak (kg)', value: formatNumberWithSpace(rt.total_tanaman_kangkung_dijual_ke_tengkulak) },
    { label: 'Total Tanaman Bayam Dijual ke Tengkulak (kg)', value: formatNumberWithSpace(rt.total_tanaman_bayam_dijual_ke_tengkulak) },
    { label: 'Total Tanaman Sawi Dijual ke Tengkulak (kg)', value: formatNumberWithSpace(rt.total_tanaman_sawi_dijual_ke_tengkulak) },
  ];
  
  
  

  return (
    <div className="p-4">
      <table className="w-full overflow-hidden border border-gray-300 rounded-lg table-detail-sls-grogol">
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
          <p className="text-[14px] font-semibold ml-3 my-2 text-pgreen">Peta Wilayah SLS</p>
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
      size="2xl"
      className="font-inter bg-slate-100 max-h-[90%]"
      classNames={{
        header: "border-b-[1px] border-slate-300",
        footer: "border-t-[1px] border-slate-300",
        wrapper: "overflow-y-hidden",
      }}
    >
      <ModalContent className="font-inter text-pgreen">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white bg-pgreen">
              Detail {selectedRt.label}
            </ModalHeader>
            <ModalBody className="py-4 overflow-y-auto">
              <RtDetail rt={selectedRt} geojson={geojsonRt} />
            </ModalBody>
            <ModalFooter>
              <Button
                className="font-semibold text-white bg-pgreen font-inter"
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
