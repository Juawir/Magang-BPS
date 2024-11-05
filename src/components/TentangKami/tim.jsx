import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import api5 from "../../utils/api5";

export default function TimKerja() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [tim, setTim] = React.useState([]);
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api5.get("/api/timdesacantik");
      if (response.data) {
        setTim(response.data);
      } else {
        throw new Error("Data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const list = [
    {
      title: "Kepala BPS Kabupaten Sidoarjo",
      subtitle: "Mohamad Isma'il S.Si, M.Ec.Dev",
      img: "/pict/ismail.png",
    },
    {
      title: "Statistisi Ahli Madya",
      subtitle: "Rahayu Rachmawati S.ST, M.Si",
      img: "/pict/yayuk.png",
    },
    {
      title: "Kepala Sub Bagian Umum",
      subtitle: "Anggie Dian Pratiwi SST, M.Ec.Dev",
      img: "/pict/anggi.png",
    },
    {
      title: "Tim IT",
      subtitle: "Chandra Sugiarso Lasambouw SST, MM",
      img: "/pict/candra.png",
    },
    {
      title: "Perwakilan Tim SDI",
      subtitle: "Faizah Naely SST",
      img: "/pict/neli.png",
    },
    {
      title: "Tim Pelaksana Desa Cantik",
      subtitle: "Eka Fauziah Rahmawati SST",
      img: "/pict/eka.png",
    },
    {
      title: "Tim Pelaksana Desa Cantik",
      subtitle: "Nuning Tri Haryani A.Md.",
      img: "/pict/nuning.png",
    },
    {
      title: "Tim Pelaksana Desa Cantik",
      subtitle: "Nofriana Florida Djami R SST., M.Sc",
      img: "/pict/nofri.png",
    },
  ];

  const handleCardClick = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  return (
    <div className="container mx-auto mt-5">
      <h1
        className="mb-6 text-xl text-center sub-header"
        style={{
          fontWeight: "bold",
          fontFamily: "Inter",
          marginTop: "40px",
          marginBottom: "4px",
        }}
      >
        Tim Kerja Desa Cantik
      </h1>
      <p
        className="mb-6 text-lg text-center sub-header"
        style={{ fontFamily: "Inter", marginBottom: "10px" }}
      >
        Berikut merupakan tim kerja Desa Cantik Kabupaten Sidoarjo tahun{" "}
        {currentYear}.
      </p>
      {tim.length === 0 ? (
        <div
          className="flex items-center justify-center w-full h-full"
          style={{ height: "220px", width: "100%" }}
        >
          <p className="text-lg text-center">Tidak ada data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 mb-10 sm:grid-cols-2 lg:grid-cols-4 gap-y-6">
          {tim.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item)}
              className="cursor-pointer card-link"
            >
              <Card
                className="max-w-xs mx-auto"
                style={{
                  marginTop: "10px",
                  backgroundColor: "#f0f0f0",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                  width: "250px",
                  height: "420px",
                }}
                shadow="xl"
              >
                <CardBody
                  className="p-4 overflow-visible"
                  style={{ height: "180px" }}
                >
                  <Image
                    shadow="lg"
                    radius="md"
                    width="100%"
                    height="100%"
                    alt={item.title}
                    className="object-cover w-full h-full"
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    src={item.link_gambar}
                  />
                </CardBody>
                <CardFooter
                  className="block text-small"
                  style={{
                    height: "240px",
                    marginTop: "5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <b
                    className="text-title-card-lg"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      marginTop: "135px",
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.nama}
                  </b>
                  <p
                    className="text-content-card"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "12px",
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.jabatan}
                  </p>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent
          style={{
            width: "300px", // Adjust the width here
            maxWidth: "90%", // Ensure it fits within smaller screens
          }}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedItem?.title}
              </ModalHeader>
              <ModalBody>
                <Image
                  shadow="lg"
                  radius="md"
                  width="100%"
                  height="auto"
                  alt={selectedItem?.nama}
                  className="object-cover w-full h-full"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                  src={selectedItem?.link_gambar}
                />
                <p>{selectedItem?.jabatan}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
