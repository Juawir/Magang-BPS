import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function NavbarPetaKelengkeng() {
  return (
    <div className="sticky top-0 z-50">
        <Navbar className="bg-base h-[11vh] p-3 sm:p-2 flex shadow-lg w-full">
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
            <img
              className="ml-1"
              src="/pict/kampung_kelengkeng.png"
              alt="Kampung Kelengkeng"
              width={70}
              height={35}
            />
            <div className="ml-3">
              <p className="font-sfProDisplay font-semibold text-[#0F1820] leading-tight">
                PETA POTENSI PEMANFAATAN KELENGKENG
                <br />
                <span className="text-[1.2rem] font-bold font-sfProDisplay">DESA SIMOKETAWANG</span>
              </p>
            </div>
          </NavbarBrand>
          <NavbarContent className="hidden gap-4 sm:flex" justify="center">
            {/* Add other NavbarItems if needed */}
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Link
                to="/login-simoketawang"
                className="flex items-center justify-center p-2 bg-[#0F1820] text-white font-medium rounded-xl md:rounded-full md:px-4 md:py-2 md:text-base cursor-pointer"
              >
                <span className="hidden md:inline">Masuk</span>
                <span className="md:hidden material-icons">account_circle</span>
              </Link>
            </NavbarItem>
            <NavbarItem>
            <Link
              to="https://drive.google.com/drive/folders/1hrlkzfvidivE55YydX4pJYpBiQTDdu69?usp=drive_link"
              className="flex items-center justify-center p-2 bg-[#0F1820] text-white font-medium rounded-xl md:rounded-full md:px-4 md:py-2 md:text-base cursor-pointer mr-2"
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Provides security benefits
            >
              <span className="hidden md:inline material-icons">folder</span>
              <span className="md:hidden material-icons">folder</span>
            </Link>
          </NavbarItem>
          </NavbarContent>
        </Navbar>
      </div>
  );
}
