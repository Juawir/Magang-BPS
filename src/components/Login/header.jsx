import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { ChevronDown } from "./Icon.jsx";
import { useNavigate } from "react-router-dom";

export default function NavbarCustom() {
  const [activeMenu, setActiveMenu] = useState("Login");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    navigate(path);
  };

  const getMenuClasses = (menu) => {
    return activeMenu === menu
      ? "font-bold font-inter text-[14px] text-white bg-pdarkblue py-2 px-4 rounded-full transition-colors duration-100"
      : "font-bold font-inter text-[14px] text-pdarkblue transition-colors duration-100";
  };

  return (
    <Navbar className="bg-base" shouldHideOnScroll>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <NavbarBrand className="flex items-center">
          <a href="https://pahlawan140.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://www.bps.go.id/_next/image?url=%2Fassets%2Flogo-bps.png&w=1080&q=75"
              alt="BPS Logo"
              width={45}
              height={45}
              className="mr-6"
            />
          </a>
          <span></span>
          <img
            src="/pict/logo_dc.png"
            alt="Desa Cantik Logo"
            width={48}
            height={48}
          />
          <p className="font-bold font-inter italic text-[14px] sm:text-[18px] text-pdarkblue ml-3 block xs:inline-block">
            DESA CANTIK <br />KABUPATEN SIDOARJO
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex items-center">
        <NavbarItem className="hidden lg:flex">
          <Link
            href="/"
            className={getMenuClasses("Beranda")}
            onClick={() => handleMenuClick("Beranda")}
          >
            Beranda
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link
            href="#"
            className={getMenuClasses("PetaTematik")}
            onClick={() => handleMenuClick("PetaTematik")}
          >
            Peta Tematik
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link
            href="/buletin"
            className={getMenuClasses("Buletin")}
            onClick={() => handleMenuClick("Buletin")}
          >
            Buletin
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link
            href="/tentangkami"
            className={getMenuClasses("TentangKami")}
            onClick={() => handleMenuClick("TentangKami")}
          >
            Tentang Kami
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex px-5">
          <Link
            href="/login"
            className="font-bold font-assistant text-white bg-porange py-2 px-4 rounded-lg transition-colors duration-100 hover:bg-orange-400 hover:outline-0 hover:outline-white"
          >
            Login
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem className="lg:flex">
          <Link
            href="/"
            className={getMenuClasses("Beranda")}
            onClick={() => handleMenuClick("Beranda")}
          >
            Beranda
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="lg:flex">
          <Link
            href="#"
            className={getMenuClasses("PetaTematik")}
            onClick={() => handleMenuClick("PetaTematik")}
          >
            Peta Tematik
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="lg:flex">
          <Link
            href="/buletin"
            className={getMenuClasses("Buletin")}
            onClick={() => handleMenuClick("Buletin")}
          >
            Buletin
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="lg:flex">
          <Link
            href="/tentangkami"
            className={getMenuClasses("TentangKami")}
            onClick={() => handleMenuClick("TentangKami")}
          >
            Tentang Kami
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="lg:flex">
          <Link
            href="/login"
            className="font-bold text-white bg-porange py-2 px-4 rounded-lg transition-colors duration-100 hover:bg-orange-400 hover:outline-0 hover:outline-white"
          >
            Login
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}