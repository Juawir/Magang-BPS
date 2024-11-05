/* eslint-disable react/prop-types */
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Button } from "@nextui-org/react";
import { daftarRt, daftarRw, daftarDusun, daftarKlasifikasi, daftarJenisUmkm } from './data';

const AddRutaModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onOpenChange={onClose} size="lg" className="bg-slate-100 font-inter max-h-[90%]">
    <ModalHeader className="flex flex-col gap-1 text-white bg-slate-600">
      Tambah Rumah Tangga UMKM
    </ModalHeader>
    <ModalBody className="py-4">
      <div className="space-y-4">
        {[
          { label: 'Kode', placeholder: 'Masukkan kode' },
          { label: 'Nama KRT', placeholder: 'Masukkan nama KRT' },
          { label: 'Latitude', placeholder: 'Masukkan nilai latitude' },
          { label: 'Longitude', placeholder: 'Masukkan nilai longitude' }
        ].map(({ label, placeholder }) => (
          <Input key={label} label={label} placeholder={placeholder} fullWidth classNames={{ inputWrapper: "shadow" }} />
        ))}
        {[
          { label: 'RT', options: daftarRt },
          { label: 'RW', options: daftarRw },
          { label: 'Dusun', options: daftarDusun },
          { label: 'Klasifikasi UMKM', options: daftarKlasifikasi },
          { label: 'Jenis UMKM', options: daftarJenisUmkm }
        ].map(({ label, options }) => (
          <Select key={label} size="md" label={label} className="w-full" placeholder={`Masukkan ${label}`}>
            {options.map(option => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        ))}
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="danger" variant="light" onPress={onClose}>Tutup</Button>
      <Button className="bg-[#0B588F] text-white font-inter font-semibold" onPress={onClose}>Tambah</Button>
    </ModalFooter>
  </Modal>
);

export default AddRutaModal;
