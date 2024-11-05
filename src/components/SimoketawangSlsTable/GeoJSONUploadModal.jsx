/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { Bars } from "react-loader-spinner";
import api from "../../utils/api";
import { delay } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api3 from "../../utils/api3";

const GeoJSONUploadModal = ({
  isAddModalOpen,
  onAddModalOpenChange,
  onSuccessCreate,
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAddModalOpen) {
      setFiles([]);
    }
  }, [isAddModalOpen]);

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".geojson",
    customRequest: ({ file, onSuccess, onError }) => {
      // Handle file locally without uploading
      setFiles((prevFiles) => {
        if (!prevFiles.some((f) => f.uid === file.uid)) {
          return [...prevFiles, file];
        }
        return prevFiles;
      });
      onSuccess(); // Indicate successful file handling
    },
    onRemove(file) {
      setFiles((prevFiles) => prevFiles.filter((f) => f.uid !== file.uid));
    },
    onChange(info) {
      const { status, file } = info;
      if (status === "error") {
        message.error(`${file.name} file processing failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleAdd = async () => {
    if (files.length === 0) {
      setLoading(false);
      message.error(`Terjadi kesalahan: Tidak ada file`, 5);
      return;
    }
    onAddModalOpenChange(false);
    setLoading(true);
    try {
      const fileReaders = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const geojson = JSON.parse(event.target.result);
              resolve(geojson);
            } catch (error) {
              reject(`Failed to parse ${file.name}: ${error.message}`);
            }
          };
          reader.onerror = () => {
            reject(`Failed to read ${file.name}`);
          };
          reader.readAsText(file);
        });
      });

      const geojsons = await Promise.all(fileReaders);

      // Debugging
      console.log("SLS Data GeoJSON:", geojsons);

      // Mengirim data ke API
      await api3.post("/api/sls", geojsons);

      // Reset files dan tutup modal
      setFiles([]);
      message.success("Data berhasil diproses dan dikirim.", 5);
      onSuccessCreate();
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
        message.error(
          `Terjadi kesalahan: ${error.message}`,
          5
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={onAddModalOpenChange}
        size="lg"
        className="bg-slate-100 font-inter max-h-[90%]"
        classNames={{
          header: "border-b-[1px] border-slate-300",
          footer: "border-t-[1px] border-slate-300",
          body: "overflow-y-auto",
          wrapper: "overflow-y-hidden",
        }}
      >
        <ModalContent className="font-inter text-pyellow">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white bg-pyellow">
                Tambah Satuan Lingkungan Setempat (SLS)
              </ModalHeader>
              <ModalBody className="py-4">
                <div className="flex flex-col text-pyellow font-inter">
                  <p className="font-semibold text-[14px] mb-3 text-pyellow">
                    Upload geoJSON
                  </p>
                  <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ color: "#d4ac2b" }} />
                    </p>
                    <p className="ant-upload-text">
                      Klik atau seret file geoJSON ke area ini
                    </p>
                    <p className="ant-upload-hint">
                      Dukungan untuk unggahan satuan atau kumpulan file.
                      Dilarang keras mengunggah data perusahaan atau file yang
                      dilarang lainnya.
                    </p>
                  </Dragger>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
                <Button
                  className="font-semibold text-white bg-pyellow font-inter"
                  onPress={handleAdd}
                  disabled={loading}
                >
                  {loading ? (
                  <Bars width="25" height="25" color="#ffffff" />
                ) : (
                  "Tambah"
                )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* {loading && (
        <div className="fixed inset-0 bg-[#caf4ff85] flex flex-col justify-center items-center z-50 overflow-hidden">
          <Bars
            height="60"
            width="60"
            color="#0B588F"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p className="mt-3 font-semibold font-inter text-pdarkblue">
            Loading
          </p>
        </div>
      )} */}
    </>
  );
};

export default GeoJSONUploadModal;
