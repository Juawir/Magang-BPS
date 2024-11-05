import React from 'react';
import SK from "../components/TentangKami/sk";
import Tim from "../components/TentangKami/tim";
import NavbarCustom from "../components/NavbarCustom";

const TentangKami = () => {
  return (
    <div>
      <>
        <NavbarCustom />
        <Tim />
        <SK />
      </>
    </div>
  );
};

export default TentangKami;