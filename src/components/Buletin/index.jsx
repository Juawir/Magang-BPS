import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Image,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { getThumbnailUrlFromFileUrl } from "../../utils/getThumbnailUrlFromFileUrl";
import { getYearFromDateString } from "../../utils/getYearFromDateString";
import { getMonthFromDateString } from "../../utils/getMonthFromDateString";
import api5 from "../../utils/api5";
import { message } from "antd";

export default function AplikasiLayanan() {
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [selectedMonths, setSelectedMonths] = useState(new Set());
  const [selectedDesa, setSelectedDesa] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [buletinList, setBuletinList] = useState([]);
  const [desaList, setDesaList] = useState([]);

  useEffect(() => {
    fetchBuletin();
    fetchDesa();
  }, []);

  const fetchBuletin = async () => {
    try {
      const response = await api5.get("/api/buletin");
      setBuletinList(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching buletin:", error);
      message.error(`Terjadi kesalahan dalam mengambil data buletin.`, 5);
      return [];
    }
  };

  const fetchDesa = async () => {
    try {
      const response = await api5.get("/api/desa");
      setDesaList(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching desa:", error);
      message.error(`Terjadi kesalahan dalam mengambil data desa.`, 5);
      return [];
    }
  };

  // const list = [
  //   {
  //     title: "Audiensi dengan Wakil Bupati",
  //     img: "/pict/descan.png",
  //     link: "https://drive.google.com/file/d/1L--SOZFEvjzKnGDJKWWrf51J7bAQ9GLQ/view",
  //     year: "2024",
  //     month: "Juli",
  //     village: "Desa Simoanginangin",
  //     description: "Surat edaran tentang dukungan pelaksanaan pembinaan Desa Cantik di Kabupaten Sidoarjo tahun 2024",
  //     date: "29 Juli 2024"
  //   },
  //   {
  //     title: "Overview Pelatihan Calon Pembina Desa Cantik",
  //     img: "/pict/descan.png",
  //     link: "https://drive.google.com/file/d/12ztl4rglSRdjpXVePm0CLnm5IPIXVtmP/view",
  //     year: "2024",
  //     month: "Juli",
  //     village: "Desa Simoanginangin",
  //     description: "Pedoman teknis program Desa Cantik tahun 2024",
  //     date: "25 Juli 2024"
  //   },
  //   {
  //     title: "Rancangan Kegiatan Desa Cantik",
  //     img: "/pict/descan.png",
  //     link: "https://drive.google.com/file/d/1qH1w-nGuIZb664yNpB0gRFPfSMPSVyGT/view",
  //     year: "2024",
  //     month: "Juli",
  //     village: "Desa Simoanginangin",
  //     description: "Rancangan kegiatan Desa Simoanginangin sebagai Desa Cantik Kabupaten Sidoarjo tahun 2024",
  //     date: "24 Juli 2024"
  //   },
  //   {
  //     title: "Sosialisasi dan Pencanangan Desa Cantik",
  //     img: "/pict/descan.png",
  //     link: "https://drive.google.com/file/d/1MyF5HhGhe993dMv14gsUSHXqVm01tfxe/view",
  //     year: "2024",
  //     month: "Juli",
  //     village: "Desa Simoanginangin",
  //     description: "Sosialisasi dan pencanangan Desa Cantik oleh Kepala BPS Kabupaten Sidoarjo bersama dengan Sekretaris Daerah",
  //     date: "23 Juli 2024"
  //   },
  //   {
  //     title: "Pendampingan Updating Website Diskominfo",
  //     img: "/pict/descan.png",
  //     link: "https://drive.google.com/file/d/1G4oWqZk0ezN5q5UAfSrEUjGs881SJ4jA/view",
  //     year: "2024",
  //     month: "Juli",
  //     village: "Desa Simoanginangin",
  //     description: "Koordinasi pemutakhiran website Desa Simoangin Angin antara Operator Website, tim Desa Cantik BPS Kabupaten Sidoarjo dan Diskominfo Kabupaten Sidoarjo",
  //     date: "22 Juli 2024"
  //   },
  //   {
  //     title: "Koordinasi terkait Update Website Desa Simoanginangin",
  //     img: "/pict/descan.png",
  //     link: "https://drive.google.com/file/d/1jbzu5O7YxAlfnVv3waoEsvCR05qumjv2/view",
  //     year: "2024",
  //     month: "Juli",
  //     village: "Desa Simoanginangin",
  //     description: "Koordinasi rencana pemutakhiran website Desa Simoangin Angin",
  //     date: "15 Juli 2024"
  //   },
  //   {
  //     title: "Internalisasi Desa Cantik oleh BPS Pusat",
  //     img: "/pict/descan.png",
  //     link: "https://drive.google.com/file/d/1ttpbzNd7JC2U5W81yk46MX0cRy8wV7xJ/view",
  //     year: "2024",
  //     month: "Juli",
  //     village: "Desa Simoanginangin",
  //     description: "Program pembinaan Desa Cantik tahun 2024 oleh BPS Pusat",
  //     date: "10 Juli 2024"
  //   }
  // ];

  // const list = [
  //   {
  //     _id: "66fe76485058ec3813f0e626",
  //     judul: "Audiensi dengan Wakil Bupati",
  //     tanggal_rilis: "30-09-2024",
  //     tanggal_kegiatan: "29-09-2024",
  //     deskripsi:
  //       "Surat edaran tentang dukungan pelaksanaan pembinaan Desa Cantik di Kabupaten Sidoarjo tahun 2024",
  //     link_file:
  //       "https://drive.google.com/file/d/1_ArDoi-iwWNw2LHZnpd_7Xz2iWKxTA7u",
  //     link_thumbnail:
  //       "https://res.cloudinary.com/dfajk6tmu/image/upload/v1727952458/qppf79iyndrsrucqm33n.png",
  //     __v: 0,
  //   },
  //   {
  //     _id: "66fe76485058ec3813f0e626",
  //     judul: "Audiensi dengan Wakil Bupati",
  //     tanggal_rilis: "30-09-2024",
  //     tanggal_kegiatan: "29-09-2024",
  //     deskripsi:
  //       "Surat edaran tentang dukungan pelaksanaan pembinaan Desa Cantik di Kabupaten Sidoarjo tahun 2024",
  //     link_file:
  //       "https://drive.google.com/file/d/1_ArDoi-iwWNw2LHZnpd_7Xz2iWKxTA7u",
  //     link_thumbnail:
  //       "https://res.cloudinary.com/dfajk6tmu/image/upload/v1727952458/qppf79iyndrsrucqm33n.png",
  //     __v: 0,
  //   },
  //   {
  //     _id: "66fe76485058ec3813f0e626",
  //     judul: "Audiensi dengan Wakil Bupati",
  //     tanggal_rilis: "30-09-2024",
  //     tanggal_kegiatan: "29-09-2024",
  //     deskripsi:
  //       "Surat edaran tentang dukungan pelaksanaan pembinaan Desa Cantik di Kabupaten Sidoarjo tahun 2024",
  //     link_file:
  //       "https://drive.google.com/file/d/1_ArDoi-iwWNw2LHZnpd_7Xz2iWKxTA7u",
  //     link_thumbnail:
  //       "https://res.cloudinary.com/dfajk6tmu/image/upload/v1727952458/qppf79iyndrsrucqm33n.png",
  //     __v: 0,
  //   },
  // ];

  const years = [
    { key: "2024", label: "2024" },
    { key: "2023", label: "2023" },
    { key: "2022", label: "2022" },
    { key: "2021", label: "2021" },
  ];

  const months = [
    { key: "1", label: "Januari" },
    { key: "2", label: "Februari" },
    { key: "3", label: "Maret" },
    { key: "4", label: "April" },
    { key: "5", label: "Mei" },
    { key: "6", label: "Juni" },
    { key: "7", label: "Juli" },
    { key: "8", label: "Agustus" },
    { key: "9", label: "September" },
    { key: "10", label: "Oktober" },
    { key: "11", label: "November" },
    { key: "12", label: "Desember" },
  ];

  const villages = [
    "Desa Simoanginangin",
    "Desa Simoketawang",
    "Desa Grogol",
    "Desa Sugihwaras",
    "Desa Kludan",
    "Desa Kedungturi",
    "Desa Masangan Kulon",
  ];

  const itemsPerPage = 4;

  const filteredList = useMemo(() => {
    return buletinList.filter((item) => {
      const desaArray = item.desa.split(", ").map((desa) => desa.trim());
      const yearMatch =
        selectedYears.size === 0 ||
        selectedYears.has(getYearFromDateString(item.tanggal_rilis));
      const monthMatch =
        selectedMonths.size === 0 ||
        selectedMonths.has(getMonthFromDateString(item.tanggal_rilis));
      const desaMatch =
        selectedDesa.size === 0 ||
        Array.from(selectedDesa).some((desaFilter) =>
          desaArray.includes(desaFilter)
        );

      return yearMatch && monthMatch && desaMatch;
    });
  }, [selectedYears, selectedMonths, selectedDesa, buletinList]);

  const maxPage = Math.ceil(filteredList.length / itemsPerPage);

  const currentItems = useMemo(
    () =>
      filteredList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredList, currentPage, itemsPerPage]
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-6xl">
        <h1
          className="w-full mb-2 font-sans text-2xl font-bold text-left header"
          style={{ marginTop: "30px" }}
        >
          Buletin
        </h1>
        <p className="w-full mb-6 font-sans text-xl text-left sub-header">
          Berikut merupakan dokumen laporan terkait Desa Cantik di Kabupaten Sidoarjo.
        </p>
        <p className="w-full mb-6 font-sans text-xl font-bold text-left sub-header">
          Pilih filter dokumen
        </p>

        <div className="flex mb-6 space-x-4">
          <Select
            aria-label="Pilih tahun"
            selectionMode="multiple"
            placeholder="Pilih tahun"
            selectedKeys={selectedYears}
            className="max-w-xs border-2 rounded-xl"
            onSelectionChange={setSelectedYears}
          >
            {years.map((year) => (
              <SelectItem key={year.key}>{year.label}</SelectItem>
            ))}
          </Select>

          <Select
            // label="Favorite Animal"
            aria-label="Pilih bulan"
            selectionMode="multiple"
            placeholder="Pilih bulan"
            selectedKeys={selectedMonths}
            className="max-w-xs border-2 rounded-xl"
            onSelectionChange={setSelectedMonths}
          >
            {months.map((month) => (
              <SelectItem key={month.key}>{month.label}</SelectItem>
            ))}
          </Select>

          <Select
            // label="Favorite Animal"
            aria-label="Pilih desa"
            selectionMode="multiple"
            placeholder="Pilih desa"
            selectedKeys={selectedDesa}
            className="max-w-xs border-2 rounded-xl"
            onSelectionChange={setSelectedDesa}
          >
            {desaList.map((desa) => (
              <SelectItem key={desa.nama}>{desa.nama}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="w-full space-y-6">
          {currentItems.length === 0 ? (
            <div className="my-16 text-center text-gray-500">
              <p>Data tidak ada</p>
            </div>
          ) : (
            currentItems.map((item, index) => (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="block"
              >
                <div className="flex items-center px-4 overflow-hidden transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-2xl">
                  <Image
                    src={item.link_thumbnail}
                    alt={item._id}
                    width="220px"
                    height="220px"
                    className="object-cover rounded-l-xl"
                  />
                  <div className="flex flex-col justify-between w-full p-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {item.judul}
                      </h2>
                      <p className="flex gap-2 mt-1 text-sm text-gray-500">
                        <span>{item.tanggal_kegiatan}</span>|
                        <span>Desa: {item.desa}</span>
                      </p>
                      <p className="mt-4 text-base leading-relaxed text-gray-700">
                        {item.deskripsi}
                      </p>
                      <p className="mt-4 text-sm font-semibold text-gray-800">
                        Tanggal Rilis: {item.tanggal_rilis}
                      </p>
                    </div>
                    <Button
                      color="primary"
                      auto
                      className="mt-6 self-start bg-[#EB891B] hover:bg-[#D77A18]"
                      onClick={() =>
                        window.open(
                          item.link_file,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Baca Selengkapnya
                    </Button>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>

        <div
          className="flex justify-center mt-4"
          style={{ marginBottom: "30px" }}
        >
          {currentItems.length > 0 && (
            <Pagination
              isCompact
              showControls
              total={maxPage}
              initialPage={currentPage}
              onChange={(page) => handlePageChange(page)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
