import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function NavbarPetaKelengkeng() {
  return (
    <div className="sticky top-0 z-50">
        <Navbar className="bg-[#eaffdb] text-[#065f46] h-[11vh] p-3 sm:p-2 flex shadow-lg w-full">
          <NavbarBrand justify="left">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Coat_of_Arms_of_Sidoarjo_Regency.png/664px-Coat_of_Arms_of_Sidoarjo_Regency.png"
              alt="Sidoarjo Coat of Arms"
              width={48}
              height={48}
            />
            <img
              className="ml-1"
              src="/pict/logo_dc.png"
              alt="Desa Cantik Logo"
              width={48}
              height={48}
            />
            <div className="ml-3">
              <p className="font-sfProDisplay font-semibold text-[#065f46] leading-tight">
                PETA USAHA TANAMAN SAYURAN
                <br />
                <span className="text-[1.2rem] text-[#065f46] font-bold font-sfProDisplay">DESA GROGOL</span>
              </p>
            </div>
          </NavbarBrand>
          <NavbarContent className="hidden gap-4 sm:flex" justify="center">
            {/* Add other NavbarItems if needed */}
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Link
                to="/login-grogol"
                className="flex items-center justify-center p-2 bg-pgreen text-white font-medium rounded-xl md:rounded-full md:px-4 md:py-2 cursor-pointer"
              >
                <span className="hidden md:inline">Masuk</span>
                <span className="md:hidden material-icons">account_circle</span>
              </Link>
            </NavbarItem>
            <NavbarItem>
            <Link
              to="https://drive.google.com/drive/folders/1bL7iuXakzx2Co9_fbwK7Q3aXJHetMUvr?usp=drive_link"
              className="flex items-center justify-center p-2 bg-pgreen text-white font-medium rounded-xl md:rounded-full md:px-4 md:py-2 cursor-pointer mr-2"
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
