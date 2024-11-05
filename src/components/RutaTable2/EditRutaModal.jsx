/* eslint-disable react/prop-types */
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Button } from "@nextui-org/react";
import { daftarRt, daftarRw, daftarDusun, daftarKlasifikasi, daftarJenisUmkm } from './data';

const EditRutaModal = ({ isOpen, onClose, ruta }) => (
  <Modal isOpen={isOpen} onOpenChange={onClose} size="lg" className="bg-slate-100 font-inter max-h-[90%]">
    <ModalHeader className="flex flex-col gap-1 text-white bg-slate-600">
      Edit Rumah Tangga UMKM
    </ModalHeader>
    <ModalBody className="py-4">
      <div className="space-y-4">
        {[
          { label: 'Kode', placeholder: 'Masukkan kode', value: ruta.kode },
          { label: 'Nama KRT', placeholder: 'Masukkan nama KRT', value: ruta.namaKrt },
          { label: 'Latitude', placeholder: 'Masukkan nilai latitude', value: ruta.latitude },
          { label: 'Longitude', placeholder: 'Masukkan nilai longitude', value: ruta.longitude }
        ].map(({ label, placeholder, value }) => (
          <Input key={label} label={label} placeholder={placeholder} defaultValue={value} fullWidth classNames={{ inputWrapper: "shadow" }} />
        ))}
        {[
          { label: 'RT', options: daftarRt, value: ruta.rt },
          { label: 'RW', options: daftarRw, value: ruta.rw },
          { label: 'Dusun', options: daftarDusun, value: ruta.dusun },
          { label: 'Klasifikasi UMKM', options: daftarKlasifikasi, value: ruta.klasifikasiKbli },
          { label: 'Jenis UMKM', options: daftarJenisUmkm, value: ruta.jenisUmkm }
        ].map(({ label, options, value }) => (
          <Select key={label} size="md" label={label} defaultValue={value} className="w-full" placeholder={`Pilih ${label}`}>
            {options.map(option => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        ))}
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="danger" variant="light" onPress={onClose}>Tutup</Button>
      <Button className="bg-[#0B588F] text-white font-inter font-semibold" onPress={onClose}>Simpan</Button>
    </ModalFooter>
  </Modal>
);

export default EditRutaModal;
