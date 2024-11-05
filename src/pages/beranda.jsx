import React, { useEffect } from 'react';
import WelcomeBanner from '../components/WelcomeBanner';
import NavbarCustom from "../components/NavbarCustom";
import ListDesa from "../components/ListDesa";
import Stats from "../components/Stats";
import Desc from "../components/Desc";
import Footer from "../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const Beranda = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

  return (
    <div className='relative flex flex-col'>
      <NavbarCustom />
      <div data-aos="fade-down">
       <WelcomeBanner />
      </div>
      <Desc />
      <Stats />
      <div data-aos="fade-up">
        <ListDesa />
      </div>
      <Footer />
    </div>
  );
};

export default Beranda;
