import React, { useEffect, useState } from "react";
import Sidebar from "../SideBar/sidebar.jsx";
import {
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import api5 from "../../utils/api5.js";
import { message } from "antd";

const dummyData = [
  {
    id: 1,
    title: "Beranda",
    link: "/",
  },
  {
    id: 2,
    title: "Peta Tematik",
    link: "/peta-tematik",
    submenus: [
      {
        id: 21,
        title: "Simoangin-angin",
        link: "",
        subsubmenus: [
          {
            id: 211,
            title: "Peta UMKM",
            link: "/peta-umkm-simoanginangin",
          },
        ],
      },
      {
        id: 22,
        title: "Simoketawang",
        link: "",
        subsubmenus: [
          {
            id: 221,
            title: "Pemanfaatan Kelengkeng",
            link: "/peta-kelengkeng-simoketawang",
          },
        ],
      },
      {
        id: 23,
        title: "Grogol",
        link: "",
        subsubmenus: [
          {
            id: 231,
            title: "Hortikultura",
            link: "/peta-hortikultura-grogol",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Buletin",
    link: "/buletin",
  },
  {
    id: 4,
    title: "Tentang Kami",
    link: "/tentang-kami",
  },
];

const MenuAdm = () => {
  const [accordionItems, setAccordionItems] = useState([]);

  const statusColorMap = {
    main: "success",
    submenu: "danger",
    subsubmenu: "warning",
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentItem, setCurrentItem] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");
  const [modalMode, setModalMode] = useState("add");
  const [parentId, setParentId] = useState(null);
  const [grandparentId, setGrandparentId] = useState(null);

  useEffect(() => {
    fetchAllMenus();
  }, []);

  const fetchAllMenus = async () => {
    try {
      const response = await api5.get("/api/menu");
      setAccordionItems(response.data);
    } catch (error) {
      console.error(error);
      message.error("Terjadi kesalahan saat memuat data menu");
    }
  };

  const handleOpenModal = (
    mode,
    item = null,
    parentId = null,
    grandparentId = null
  ) => {
    setModalMode(mode);
    setParentId(parentId);
    setGrandparentId(grandparentId);

    if (mode === "edit" && item) {
      setCurrentItem(item);
      setNewTitle(item.title);
      setNewLink(item.link);
    } else {
      setNewTitle("");
      setNewLink("");
      setCurrentItem(null);
    }
    onOpen();
  };

  const handleCloseModal = () => {
    onOpenChange(false);
    setNewTitle("");
    setNewLink("");
    setCurrentItem(null);
    setParentId(null);
    setGrandparentId(null);
  };

  const handleSaveItem = async () => {
    if (modalMode === "add") {
      if (grandparentId) {
        setAccordionItems(
          accordionItems.map((item) =>
            item.id === grandparentId
              ? {
                  ...item,
                  submenus: item.submenus.map((submenu) =>
                    submenu.id === parentId
                      ? {
                          ...submenu,
                          subsubmenus: [
                            ...submenu.subsubmenus,
                            {
                              id: submenu.subsubmenus.length + 1,
                              title: newTitle,
                              link: newLink,
                            },
                          ],
                        }
                      : submenu
                  ),
                }
              : item
          )
        );
      } else if (parentId) {
        setAccordionItems(
          accordionItems.map((item) =>
            item.id === parentId
              ? {
                  ...item,
                  submenus: [
                    ...item.submenus,
                    {
                      id: item.submenus.length + 1,
                      title: newTitle,
                      link: newLink,
                      subsubmenus: [],
                    },
                  ],
                }
              : item
          )
        );
      } else {
        // setAccordionItems([
        //   ...accordionItems,
        //   {
        //     id: accordionItems.length + 1,
        //     title: newTitle,
        //     link: newLink,
        //     submenus: [],
        //   },
        // ]);
        try {
          await api5.post("/api/menu", {
            title: newTitle,
            link: newLink,
          });
          message.success("Data menu berhasil ditambahkan");
        } catch (error) {
          console.error(error);
          message.error("Terjadi kesalahan saat menyimpan data menu");
        }
      }
    } else if (modalMode === "edit" && currentItem) {
      if (grandparentId) {
        setAccordionItems(
          accordionItems.map((item) =>
            item._id === grandparentId
              ? {
                  ...item,
                  submenus: item.submenus.map((submenu) =>
                    submenu._id === parentId
                      ? {
                          ...submenu,
                          subsubmenus: submenu.subsubmenus.map((subSubmenu) =>
                            subSubmenu._id === currentItem._id
                              ? {
                                  ...subSubmenu,
                                  title: newTitle,
                                  link: newLink,
                                }
                              : subSubmenu
                          ),
                        }
                      : submenu
                  ),
                }
              : item
          )
        );
      } else if (parentId) {
        setAccordionItems(
          accordionItems.map((item) =>
            item.id === parentId
              ? {
                  ...item,
                  submenus: item.submenus.map((submenu) =>
                    submenu.id === currentItem.id
                      ? { ...submenu, title: newTitle, link: newLink }
                      : submenu
                  ),
                }
              : item
          )
        );
      } else {
        setAccordionItems(
          accordionItems.map((item) =>
            item.id === currentItem.id
              ? { ...item, title: newTitle, link: newLink }
              : item
          )
        );
      }
    }
    await fetchAllMenus();
    handleCloseModal();
  };

  const getFormTitle = () => {
    if (modalMode === "add") {
      if (!parentId) return "Tambah Menu";
      if (!grandparentId) return "Tambah Sub Menu";
      return "Tambah Sub Sub Menu";
    } else if (modalMode === "edit") {
      if (!parentId) return "Edit Menu";
      if (!grandparentId) return "Edit Sub Menu";
      return "Edit Sub Sub Menu";
    }
    return "";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="w-[80%] mx-auto">
        <Button
          color="warning"
          auto
          className="text-white font-inter font-semibold text-md bg-[#fcc300] mt-10 ml-4"
          onPress={() => handleOpenModal("add")}
        >
          <FaPlus /> Tambah Menu
        </Button>
        <div className="w-full p-2 mx-auto">
          <Accordion
            variant="splitted"
            className="py-5 overflow-hidden rounded-lg"
            fullWidth={true}
          >
            {accordionItems.map((item) => (
              <AccordionItem
                key={item._id}
                aria-label={item.title}
                title={
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-gray-700 font-inter">
                      {item.title}
                    </p>
                    <p className="text-[12px] leading-4 rounded-lg px-[4px] pb-[2px] text-center text-white bg-success">
                      main
                    </p>
                  </div>
                }
                className="relative w-full"
              >
                <div className="flex items-center p-1">
                  <div className="flex gap-3">
                    <button
                      className="p-0 m-0 bg-transparent"
                      // auto
                      // flat
                      onClick={() => handleOpenModal("edit", item)}
                    >
                      <FaEdit className="text-orange-700" />
                    </button>
                    <button className="p-0 m-0 bg-transparent">
                      <FaTrash className="text-red-800" />
                    </button>
                  </div>
                  <Button
                    auto
                    flat
                    className="flex items-center gap-2 ml-5 font-medium text-orange-700 bg-transparent font-assistant"
                    onPress={() => handleOpenModal("add", null, item._id)}
                  >
                    <FaPlus className="text-orange-700" /> Sub Menu
                  </Button>
                </div>
                <Accordion>
                  {item.subMenus?.map((subMenu) => (
                    <AccordionItem
                      key={subMenu.id}
                      aria-label={subMenu.title}
                      title={
                        <div className="flex items-center gap-2">
                          <p className="ml-5 text-lg font-medium text-gray-600 font-inter">
                            {subMenu.title}
                          </p>
                          <p className="leading-4 rounded-lg px-[5px] pb-[2px] text-assistant text-[12px] text-center text-white bg-danger">
                            sub-menu
                          </p>
                        </div>
                      }
                      className="relative w-full"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          className="p-0 bg-transparent ml-7"
                          // auto
                          // flat
                          onClick={() =>
                            handleOpenModal("edit", subMenu, item._id)
                          }
                        >
                          <FaEdit className="text-orange-700" />
                        </button>
                        <button className="p-0 ml-0 bg-transparent">
                          <FaTrash className="text-red-800" />
                        </button>
                        <Button
                          auto
                          flat
                          className="flex items-center gap-2 ml-5 font-medium text-orange-700 bg-transparent font-assistant"
                          onPress={() =>
                            handleOpenModal("add", null, subMenu._id, item._id)
                          }
                        >
                          <FaPlus className="text-orange-700" /> Sub Sub Menu
                        </Button>
                      </div>
                      <Accordion>
                        {subMenu.subSubMenus?.map((subSubMenu) => (
                          <AccordionItem
                            key={subSubMenu.id}
                            aria-label={subSubMenu.title}
                            title={
                              <div className="flex items-center gap-2">
                                <p className="ml-10 font-medium text-gray-500 text-md font-inter">
                                  {subSubMenu.title}
                                </p>
                                <p className="leading-4 rounded-lg px-[5px] pb-[2px] text-assistant text-[12px] text-center text-white bg-primary">
                                  sub-sub-menu
                                </p>
                              </div>
                            }
                            className="relative w-full"
                          >
                            <div className="flex items-center gap-3 ml-7">
                              <button
                                className="p-0 m-0 bg-transparent"
                                // auto
                                // flat
                                onClick={() =>
                                  handleOpenModal(
                                    "edit",
                                    subSubMenu,
                                    subMenu.id,
                                    item.id
                                  )
                                }
                              >
                                <FaEdit className="text-orange-700" />
                              </button>
                              <button
                                className="p-0 m-0 bg-transparent"
                                // auto
                                // flat
                              >
                                <FaTrash className="text-red-800" />
                              </button>
                            </div>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
        placement="top-center"
        className="bg-[#f5f5f5]"
      >
        <ModalContent className="rounded-2xl">
          <ModalHeader className="font-semibold text-orange-500">
            {getFormTitle()}
          </ModalHeader>
          <ModalBody>
            <label className="font-medium font-assistant">Judul:</label>
            <Input
              placeholder="Masukkan Judul"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border-gray-200 border-1 rounded-xl"
            />
            <label className="font-medium font-assistant">Link:</label>
            <Input
              placeholder="Masukkan Link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="border-gray-200 border-1 rounded-xl"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="font-inter font-semibold text-white bg-[#fcc300]"
              onPress={handleSaveItem}
            >
              Simpan
            </Button>
            <Button
              className="font-semibold text-white font-inter"
              color="danger"
              onPress={handleCloseModal}
            >
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MenuAdm;
