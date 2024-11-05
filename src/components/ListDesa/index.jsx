import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api5 from "../../utils/api5";

// Custom Previous Button
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`absolute left-4 z-10 p-2 rounded-full transform -translate-y-1/2 shadow-lg transition duration-300 ease-in-out ${className}`}
      style={{
        ...style,
        display: "block",
        top: "50%",
        border: "none",
        outline: "none",
        fontSize: "18px",
      }}
      onClick={onClick}
      aria-label="Previous Slide"
    ></button>
  );
};

// Custom Next Button
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`absolute right-7 z-10 p-2 rounded-full transform -translate-y-1/2 shadow-lg transition duration-300 ease-in-out ${className}`}
      style={{
        ...style,
        display: "block",
        top: "50%",
        border: "none",
        outline: "none",
        fontSize: "18px",
      }}
      onClick={onClick}
      aria-label="Next Slide"
    ></button>
  );
};

export default function ListDesa() {
  // const list = [
  //   {
  //     title: "Simoanginangin",
  //     img: "/pict/simoanginagin.jpg",
  //     desc: "Simoanginangin adalah desa di Kecamatan Wonoayu, Kabupaten Sidoarjo, dengan luas 42 hektar."
  //   },
  //   {
  //     title: "Simoketawang",
  //     img: "/pict/simoketawang.png",
  //     desc: "Simoketawang adalah desa di Kecamatan Wonoayu, Kabupaten Sidoarjo, dengan luas 96,53 hektar."
  //   },
  //   {
  //     title: "Grogol",
  //     img: "/pict/grogol.jpg",
  //     desc: "Grogol adalah desa di Kecamatan Tulangan, Kabupaten Sidoarjo, dengan luas 112.818 hektar."
  //   },
  //   {
  //     title: "Sugihwaras",
  //     img: "/pict/Sugihwaras.png",
  //     desc: "Sugihwaras adalah desa di Kecamatan Candi, Kabupaten Sidoarjo, dengan luas 107.168 hektar."
  //   },
  //   {
  //     title: "Kedungrejo",
  //     img: "/pict/Kedungrejo.png",
  //     desc: "Kedungrejo adalah desa di Kecamatan Waru, Kabupaten Sidoarjo, dengan luas 86.44 hektar."
  //   },
  //   {
  //     title: "Masangankulon",
  //     img: "/pict/Masangan Kulon.png",
  //     desc: "Masangankulon adalah desa di Kecamatan Sukodono, Kabupaten Sidoarjo, dengan luas 2.03 hektar."
  //   },
  //   {
  //     title: "Wangkal",
  //     img: "/pict/wangkal 2.jpg",
  //     desc: "Wangkal adalah desa di Kecamatan Krembung, Kabupaten Sidoarjo, dengan luas 154.77 hektar."
  //   },
  //   {
  //     title: "Kedungturi",
  //     img: "/pict/kedungturi.jpg",
  //     desc: "Kedungturi adalah desa di Kecamatan Taman, Kabupaten Sidoarjo, dengan luas 158.58 hektar."
  //   },
  //   {
  //     title: "Kepunten",
  //     img: "/pict/kepunten.jpg",
  //     desc: "Kepunten adalah desa di Kecamatan Tulangan, Kabupaten Sidoarjo, dengan luas 194.5 hektar."
  //   },
  //   {
  //     title: "Kludan",
  //     img: "/pict/kludan.png",
  //     desc: "Kludan adalah desa di Kecamatan Tanggulangin, Kabupaten Sidoarjo, dengan luas 88.20 hektar."
  //   }
  // ];
  const [desaData, setDesaData] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setList(
      desaData.map((desa) => ({
        title: desa.nama,
        img: desa.link_gambar,
        desc: `${desa.nama} adalah desa di Kecamatan ${desa.kecamatan}, Kabupaten Sidoarjo, dengan luas ${desa.luas} hektar.`,
      }))
    );
  }, [desaData]);

  const fetchData = async () => {
    try {
      const response = await api5.get("/api/desa");
      if (response.data) {
        setDesaData(response.data);
      } else {
        throw new Error("Data not found in the response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="flex justify-center m-12">
      <Slider {...settings} className="w-full">
        {list.map((item, index) => (
          <div key={index} className="px-4 py-2">
            {" "}
            {/* Added padding here */}
            <Card
              className="flex flex-col justify-around p-4 bg-neutral-100 h-100 w-70"
              shadow="sm"
            >
              {" "}
              {/* Added padding here */}
              <CardBody className="items-center p-2 overflow-visible">
                <Image
                  shadow="sm"
                  radius="md"
                  width="100%"
                  alt={item.title}
                  className="object-cover w-full"
                  src={item.img}
                />
              </CardBody>
              <CardFooter className="block text-center text-small">
                <b className="block text-lg">{item.title}</b>
                <p
                  className="mx-4 text-content-card"
                  style={{ textAlign: "justify" }}
                >
                  {item.desc}
                </p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
}
