import React from 'react';
import LoginPage from "../components/Login";
import NavbarCustom from "../components/NavbarCustom";

const Login = () => {
  return (
    <div>
      <>
        <NavbarCustom />
        <LoginPage />
      </>
    </div>
  );
};

export default Login;