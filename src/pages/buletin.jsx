import React from 'react';
import BuletinPage from "../components/Buletin";
import NavbarCustom from "../components/NavbarCustom";

const Buletin = () => {
  return (
    <div>
      <>
        <NavbarCustom />
        <BuletinPage />
      </>
    </div>
  );
};

export default Buletin;