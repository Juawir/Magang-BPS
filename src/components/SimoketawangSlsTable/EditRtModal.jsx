/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react"; // Assuming Input is imported from @nextui-org/react
import api from "../../utils/api";
import { message } from "antd";
import { Bars } from "react-loader-spinner";
import api3 from "../../utils/api3";

const EditRtModal = ({
  isEditModalOpen,
  onEditModalOpenChange,
  rt,
  fetchData,
  fetchDataAggregate,
}) => {
  const [editRtData, setEditRtData] = useState(rt);
  const [oldRtData, setOldRtData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update editRtData when rt prop changes
  useEffect(() => {
    if (rt) {
      setEditRtData(rt);
      setOldRtData(rt);
    }
  }, [rt]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value.replace(",", ".");

    // Default validation message
    let validationMessage = "";

    // Validation logic for each attribute
    switch (name) {
      case "jml_penduduk":
      case "jml_unit_usaha_klengkeng":
      case "jml_unit_usaha_klengkeng_pupuk_organik":
      case "jml_unit_usaha_klengkeng_pupuk_anorganik":
      case "jml_unit_usaha_klengkeng_tidak_ada_pupuk":
      case "jml_unit_usaha_klengkeng_kopi_biji_klengkeng":
      case "jml_unit_usaha_klengkeng_kerajinan_tangan":
      case "jml_unit_usaha_klengkeng_batik_ecoprint":
      case "jml_unit_usaha_klengkeng_minuman":
      case "jml_unit_usaha_klengkeng_makanan":
      case "jml_unit_usaha_klengkeng_tidak_dimanfaatkan":
      case "jml_pohon":
      case "jml_pohon_new_crystal":
      case "jml_pohon_pingpong":
      case "jml_pohon_metalada":
      case "jml_pohon_diamond_river":
      case "jml_pohon_merah":
      case "jml_pohon_blm_berproduksi":
      case "jml_pohon_sdh_berproduksi":
        if (!value) {
          validationMessage = `Jumlah ${name.replace(/_/g, " ")} harus diisi.`;
        } else if (isNaN(value)) {
          validationMessage = `Jumlah ${name.replace(
            /_/g,
            " "
          )} harus berupa angka.`;
        } else if (Number(value) < 0) {
          validationMessage = `Jumlah ${name.replace(
            /_/g,
            " "
          )} harus berupa angka positif.`;
        } else if (!Number.isInteger(Number(value))) {
          validationMessage = `Jumlah ${name.replace(
            /_/g,
            " "
          )} harus berupa angka bulat.`;
        } else {
          validationMessage = "";
        }
        break;
      case "volume_produksi":
        if (!value) {
          validationMessage = `Volume produksi harus diisi.`;
        } else if (isNaN(value)) {
          validationMessage = `Volume produksi harus berupa angka.`;
        } else if (Number(value) < 0) {
          validationMessage = `Volume produksi harus berupa angka positif.`;
        } else {
          validationMessage = "";
        }
        break;
      default:
        // Handle unknown or non-valid fields if needed
        validationMessage = "";
        break;
    }

    // Update the errors object dynamically
    errors[name] = validationMessage;

    // Update the state with the new value
    setEditRtData((prevData) => ({ ...prevData, [name]: updatedValue }));
  };

  const validateForm = (editRtData) => {
    const newErrors = {};

    // Validasi total jumlah pohon
    const totalPohonJenis =
      (parseInt(editRtData.jml_pohon_new_crystal) || 0) +
      (parseInt(editRtData.jml_pohon_pingpong) || 0) +
      (parseInt(editRtData.jml_pohon_metalada) || 0) +
      (parseInt(editRtData.jml_pohon_diamond_river) || 0) +
      (parseInt(editRtData.jml_pohon_merah) || 0);

    if (
      editRtData.jml_pohon &&
      totalPohonJenis !== parseInt(editRtData.jml_pohon)
    ) {
      newErrors.jml_pohon =
        "Jumlah total pohon jenis harus sama dengan jumlah pohon keseluruhan.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSave = () => {
    if (!validateForm(editRtData)) {
      message.error(
        "Mohon lengkapi semua field yang diperlukan dan perbaiki kesalahan.",
        5
      );
      return;
    }
    if (editRtData) {
      // Convert attributes to integers
      const convertedData = {
        ...editRtData,
        jml_penduduk: parseInt(editRtData.jml_penduduk, 10) || 0,
        jml_unit_usaha_klengkeng:
          parseInt(editRtData.jml_unit_usaha_klengkeng, 10) || 0,
        jml_unit_usaha_klengkeng_pupuk_organik:
          parseInt(editRtData.jml_unit_usaha_klengkeng_pupuk_organik, 10) || 0,
        jml_unit_usaha_klengkeng_pupuk_anorganik:
          parseInt(editRtData.jml_unit_usaha_klengkeng_pupuk_anorganik, 10) ||
          0,
        jml_unit_usaha_klengkeng_tidak_ada_pupuk:
          parseInt(editRtData.jml_unit_usaha_klengkeng_tidak_ada_pupuk, 10) ||
          0,
        jml_unit_usaha_klengkeng_kopi_biji_klengkeng:
          parseInt(
            editRtData.jml_unit_usaha_klengkeng_kopi_biji_klengkeng,
            10
          ) || 0,
        jml_unit_usaha_klengkeng_kerajinan_tangan:
          parseInt(editRtData.jml_unit_usaha_klengkeng_kerajinan_tangan, 10) ||
          0,
        jml_unit_usaha_klengkeng_batik_ecoprint:
          parseInt(editRtData.jml_unit_usaha_klengkeng_batik_ecoprint, 10) || 0,
        jml_unit_usaha_klengkeng_minuman:
          parseInt(editRtData.jml_unit_usaha_klengkeng_minuman, 10) || 0,
        jml_unit_usaha_klengkeng_makanan:
          parseInt(editRtData.jml_unit_usaha_klengkeng_makanan, 10) || 0,
        jml_unit_usaha_klengkeng_tidak_dimanfaatkan:
          parseInt(
            editRtData.jml_unit_usaha_klengkeng_tidak_dimanfaatkan,
            10
          ) || 0,
        jml_pohon: parseInt(editRtData.jml_pohon, 10) || 0,
        jml_pohon_new_crystal:
          parseInt(editRtData.jml_pohon_new_crystal, 10) || 0,
        jml_pohon_pingpong: parseInt(editRtData.jml_pohon_pingpong, 10) || 0,
        jml_pohon_metalada: parseInt(editRtData.jml_pohon_metalada, 10) || 0,
        jml_pohon_diamond_river:
          parseInt(editRtData.jml_pohon_diamond_river, 10) || 0,
        jml_pohon_merah: parseInt(editRtData.jml_pohon_merah, 10) || 0,
        jml_pohon_blm_berproduksi:
          parseInt(editRtData.jml_pohon_blm_berproduksi, 10) || 0,
        jml_pohon_sdh_berproduksi:
          parseInt(editRtData.jml_pohon_sdh_berproduksi, 10) || 0,
        volume_produksi: parseFloat(editRtData.volume_produksi) || 0,
      };
      console.log("Edit data:", convertedData);
      updateData(convertedData);
    }
  };

  const updateData = async (data) => {
    setLoading(true);
    try {
      const response = await api3.put(`/api/sls/${data.kode}`, data);
      console.log("Data updated:", response.data.data);
      message.success(`SLS ${data.label} berhasil diupdate.`, 5);
      onEditModalOpenChange(false); // Close the modal
      await fetchData(); // Fetch updated data
      await fetchDataAggregate();
      setErrors({});
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Terjadi kesalahan: ${error.response.data.message}`, 5);
      } else {
        message.error(`Terjadi kesalahan: ${error.message}`, 5);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseButton = () => {
    setErrors({});
    setEditRtData(oldRtData);
    onEditModalOpenChange(false);
  };

  return (
    <>
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalOpenChange}
        size="xl"
        className="bg-slate-100 font-inter max-h-[90%]"
        classNames={{
          header: "border-b-[1px] border-slate-300",
          footer: "border-t-[1px] border-slate-300",
          body: "overflow-y-auto",
          wrapper: "overflow-y-hidden",
        }}
        hideCloseButton={true}
        isDismissable={false}
      >
        <ModalContent className="font-inter text-pyellow">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white bg-pyellow">
                Edit Satuan Lingkungan Setempat (SLS)
              </ModalHeader>
              <ModalBody className="py-4">
                <div className="space-y-4 simoketawang-sls-edit">
                  <Input
                    label="Kode"
                    placeholder="Masukkan kode"
                    fullWidth
                    name="kode"
                    value={editRtData?.kode ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                    disabled
                  />
                  <Input
                    label="RT"
                    placeholder="Masukkan RT"
                    fullWidth
                    name="rt"
                    value={editRtData?.rt ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                    disabled
                  />
                  <Input
                    label="RW"
                    placeholder="Masukkan RW"
                    fullWidth
                    name="rw"
                    value={editRtData?.rw ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                    disabled
                  />
                  <Input
                    label="Dusun"
                    placeholder="Masukkan Dusun"
                    fullWidth
                    name="dusun"
                    value={editRtData?.dusun ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                    disabled
                  />
                  <Input
                    label="Unit Usaha Kelengkeng"
                    placeholder="Masukkan jumlah unit usaha kelengkeng"
                    fullWidth
                    name="jml_unit_usaha_klengkeng"
                    value={editRtData?.jml_unit_usaha_klengkeng ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Pupuk Organik"
                    placeholder="Masukkan jumlah unit usaha kelengkeng pupuk organik"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_pupuk_organik"
                    value={
                      editRtData?.jml_unit_usaha_klengkeng_pupuk_organik ?? ""
                    }
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_pupuk_organik && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_pupuk_organik}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Pupuk Anorganik"
                    placeholder="Masukkan jumlah unit usaha kelengkeng pupuk anorganik"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_pupuk_anorganik"
                    value={
                      editRtData?.jml_unit_usaha_klengkeng_pupuk_anorganik ?? ""
                    }
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_pupuk_anorganik && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_pupuk_anorganik}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Tidak Ada Pupuk"
                    placeholder="Masukkan jumlah unit usaha kelengkeng Tidak Ada Pupuk"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_tidak_ada_pupuk"
                    value={
                      editRtData?.jml_unit_usaha_klengkeng_tidak_ada_pupuk ?? ""
                    }
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_tidak_ada_pupuk && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_tidak_ada_pupuk}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Kopi Biji Kelengkeng"
                    placeholder="Masukkan jumlah unit usaha kelengkeng kopi biji kelengkeng"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_kopi_biji_klengkeng"
                    value={
                      editRtData?.jml_unit_usaha_klengkeng_kopi_biji_klengkeng ??
                      ""
                    }
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_kopi_biji_klengkeng && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_kopi_biji_klengkeng}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Kerajinan Tangan"
                    placeholder="Masukkan jumlah unit usaha kelengkeng kerajinan tangan"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_kerajinan_tangan"
                    value={
                      editRtData?.jml_unit_usaha_klengkeng_kerajinan_tangan ??
                      ""
                    }
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_kerajinan_tangan && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_kerajinan_tangan}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Batik Ecoprint"
                    placeholder="Masukkan jumlah unit usaha kelengkeng batik ecoprint"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_batik_ecoprint"
                    value={
                      editRtData?.jml_unit_usaha_klengkeng_batik_ecoprint ?? ""
                    }
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_batik_ecoprint && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_batik_ecoprint}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Minuman"
                    placeholder="Masukkan jumlah unit usaha kelengkeng minuman"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_minuman"
                    value={editRtData?.jml_unit_usaha_klengkeng_minuman ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_minuman && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_minuman}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Makanan"
                    placeholder="Masukkan jumlah unit usaha kelengkeng makanan"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_makanan"
                    value={editRtData?.jml_unit_usaha_klengkeng_makanan ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_makanan && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_makanan}
                    </p>
                  )}
                  <Input
                    label="Unit Usaha Kelengkeng Tidak Ada Pemanfaatan"
                    placeholder="Masukkan jumlah unit usaha kelengkeng tidak ada pemanfaatan"
                    fullWidth
                    name="jml_unit_usaha_klengkeng_tidak_dimanfaatkan"
                    value={
                      editRtData?.jml_unit_usaha_klengkeng_tidak_dimanfaatkan ??
                      ""
                    }
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_unit_usaha_klengkeng_tidak_dimanfaatkan && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_unit_usaha_klengkeng_tidak_dimanfaatkan}
                    </p>
                  )}
                  <Input
                    label="Pohon Kelengkeng"
                    placeholder="Masukkan jumlah pohon kelengkeng"
                    fullWidth
                    name="jml_pohon"
                    value={editRtData?.jml_pohon ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_pohon && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_pohon}
                    </p>
                  )}
                  <Input
                    label="Pohon Kelengkeng New Crystal"
                    placeholder="Masukkan jumlah pohon kelengkeng new crystal"
                    fullWidth
                    name="jml_pohon_new_crystal"
                    value={editRtData?.jml_pohon_new_crystal ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_pohon_new_crystal && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_pohon_new_crystal}
                    </p>
                  )}
                  <Input
                    label="Pohon Kelengkeng Pingpong"
                    placeholder="Masukkan jumlah pohon kelengkeng pingpong"
                    fullWidth
                    name="jml_pohon_pingpong"
                    value={editRtData?.jml_pohon_pingpong ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_pohon_pingpong && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_pohon_pingpong}
                    </p>
                  )}
                  <Input
                    label="Pohon Kelengkeng Metalada"
                    placeholder="Masukkan jumlah pohon kelengkeng metalada"
                    fullWidth
                    name="jml_pohon_metalada"
                    value={editRtData?.jml_pohon_metalada ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_pohon_metalada && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_pohon_metalada}
                    </p>
                  )}
                  <Input
                    label="Pohon Kelengkeng Diamond River"
                    placeholder="Masukkan jumlah pohon kelengkeng diamond river"
                    fullWidth
                    name="jml_pohon_diamond_river"
                    value={editRtData?.jml_pohon_diamond_river ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_pohon_diamond_river && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_pohon_diamond_river}
                    </p>
                  )}
                  <Input
                    label="Pohon Kelengkeng Merah"
                    placeholder="Masukkan jumlah pohon kelengkeng merah"
                    fullWidth
                    name="jml_pohon_merah"
                    value={editRtData?.jml_pohon_merah ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_pohon_merah && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_pohon_merah}
                    </p>
                  )}
                  <Input
                    label="Pohon Kelengkeng Belum Berproduksi"
                    placeholder="Masukkan jumlah pohon kelengkeng belum berproduksi"
                    fullWidth
                    name="jml_pohon_blm_berproduksi"
                    value={editRtData?.jml_pohon_blm_berproduksi ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_pohon_blm_berproduksi && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_pohon_blm_berproduksi}
                    </p>
                  )}
                  <Input
                    label="Pohon Kelengkeng Sudah Berproduksi"
                    placeholder="Masukkan jumlah pohon kelengkeng sudah berproduksi"
                    fullWidth
                    name="jml_pohon_sdh_berproduksi"
                    value={editRtData?.jml_pohon_sdh_berproduksi ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.jml_pohon_sdh_berproduksi && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.jml_pohon_sdh_berproduksi}
                    </p>
                  )}
                  <Input
                    label="Volume Produksi Agustus 2023-Juli 2024 (Kg)"
                    placeholder="Masukkan jumlah pohon kelengkeng sudah berproduksi"
                    fullWidth
                    name="volume_produksi"
                    value={editRtData?.volume_produksi ?? ""}
                    onChange={handleEditChange}
                    classNames={{ inputWrapper: "shadow" }}
                  />
                  {errors.volume_produksi && (
                    <p className="ml-3 text-sm text-red-600 font-inter">
                      {errors.volume_produksi}
                    </p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseButton}
                >
                  Tutup
                </Button>
                <Button
                  className="font-semibold text-white bg-pyellow font-inter"
                  onPress={handleEditSave}
                  disabled={loading}
                >
                  {loading ? (
                    <Bars width="25" height="25" color="#ffffff" />
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditRtModal;
