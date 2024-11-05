import React from "react";
import FooterTitle from "./FooterTittle";
import FooterList from "./FooterList";
import {
  YouTube,
  Instagram,
  Facebook,
  Twitter,
  Room,
  Email,
  X,
  FacebookOutlined,
  FacebookRounded,
  FacebookSharp,
  FacebookTwoTone,
  Call,
} from "@mui/icons-material";

const medSos = [
  {
    icon: FacebookOutlined,
    href: "",
    text: "BPS 3515",
  },
  {
    icon: Instagram,
    href: "",
    text: "@bps.sidoarjo",
  },
  {
    icon: YouTube,
    href: "",
    text: "@BPS3515",
  },
];

const contacts = [
  {
    icon: Room,
    href: "https://maps.app.goo.gl/4dMALXhFKqJ952D78/",
    text: "Jl. Pahlawan No 140 Sidoarjo",
  },
  {
    icon: Call,
    text: "(031)8941744",
  },
  {
    icon: Email,
    href: "mailto:bps3515@bps.go.id",
    text: "bps3515@bps.go.id",
  },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative flex flex-col p-5 mt-10 overflow-hidden bg-base text-pdarkblue md:h-60 md:flex-around md:flex-row md:items-center md:p-0"
    >
      <div className="flex flex-col items-center justify-center mb-5 md:w-4/12 md:my-0">
        <div className="flex items-center">
          <img alt="logo" src="/image/logo.png" width={120} height={120} />

          {/* Divider here */}
          <div className="w-[6px] rounded-full h-24 bg-pdarkblue mx-4"></div>

          <p className="block text-2xl">
            <b>BPS</b> <span className="block">Kabupaten</span>{" "}
            <span className="block">
              <b>Sidoarjo</b>
            </span>
          </p>
        </div>

        <p className="z-40 mt-5 ml-6 text-lg whitespace-pre-wrap w-42 md:text-left text-pdarkblue">
          <b>
            <span className="mr-2">&#169;</span>BPS Sidoarjo 2024
          </b>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-10 mx-auto md:grid-cols-2 md:w-9/12">
        <div>
          <FooterTitle title="Media Sosial" />
          <FooterList items={medSos} />
        </div>
        <div>
          <FooterTitle title="Kontak Kami" />
          <FooterList items={contacts} />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 hidden md:block">
        <img src="/image/pattern.png" width={140} height={140} />
      </div>

      <div className="absolute bottom-0 left-0 hidden md:block">
        <img
          src="/image/pattern.png"
          width={140}
          height={140}
          style={{ transform: "scaleX(-1)" }}
        />
      </div>
    </footer>
  );
}
