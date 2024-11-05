import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function NavbarPeta() {
  return (
    <div className="sticky top-0 z-50">
      <Navbar className="bg-base h-[11vh] p-3 sm:p-2 mx-0 flex shadow-lg">
        <NavbarBrand justify="left">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Coat_of_Arms_of_Sidoarjo_Regency.png/664px-Coat_of_Arms_of_Sidoarjo_Regency.png"
            alt="Sidoarjo Coat of Arms"
            width={48}
            height={48}
          />
          <img
            src="/pict/logo_dc.png"
            alt="Desa Cantik Logo"
            width={48}
            height={48}
          />
          <div className="ml-3">
            <p className="font-sfProDisplay font-semibold text-[#0F1820] leading-tight">
              PETA TEMATIK UMKM
              <br />
              <span className="text-lg font-bold font-sfProDisplay">DESA SIMOANGINANGIN</span>
            </p>
          </div>
        </NavbarBrand>
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          {/* Add other NavbarItems if needed */}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
          <Link
            to="/login-simoanginangin"
            className="flex items-center justify-center p-2 bg-[#0F1820] text-white font-medium rounded-xl md:rounded-full md:px-4 md:py-2 md:text-base cursor-pointer"
          >
            <span className="hidden md:inline">Masuk</span>
            <span className="md:hidden material-icons">account_circle</span>
          </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              to="https://drive.google.com/drive/folders/1ZF_rkfRYosh0d0vUtK-TDGvwtvJ9raPM?usp=drive_link"
              className="flex items-center justify-center p-2 bg-[#0F1820] text-white font-medium rounded-xl md:rounded-full md:px-4 md:py-2 md:text-base cursor-pointer mr-2"
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Provides security benefits
            >
              <span className="hidden md:inline">Panduan</span>
              <span className="md:hidden material-icons">folder</span>
            </Link>
          </NavbarItem>

        </NavbarContent>
      </Navbar>
    </div>
  );
}
