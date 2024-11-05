import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import api5 from "../../utils/api5";
import { Bars } from "react-loader-spinner";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
// import "./Login.css";

const TopEllipse = () => {
  return (
    <div className="absolute z-0 flex items-center justify-center top-[calc(50%-260px)] md:top-[5%] md:transform md:-translate-x-[224px] md:translate-y-[110%] 2xl:translate-y-[75%]">
      <div className="size-[100px] rounded-full bg-gradient-to-r from-pdarkblue to-[#CAF4FF]"></div>
    </div>
  );
};

const BottomEllipse = () => {
  return (
    <div className="absolute z-0 flex items-center justify-center bottom-[calc(50%-260px)] md:bottom-[5%] md:transform md:translate-x-[224px] md:-translate-y-[110%] 2xl:-translate-y-[75%]">
      <div className="size-[100px] rounded-full bg-[#f3fdff]"></div>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleUsernameClear = () => {
    setUsername("");
  };

  const clearPassword = () => {
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username && !password) {
      setError("Username dan password tidak boleh kosong");
      setLoading(false);
      return;
    } else if (!username) {
      setError("Username tidak boleh kosong");
      setLoading(false);
      return;
    } else if (!password) {
      setError("Password tidak boleh kosong");
      setLoading(false);
      return;
    }

    try {
      const response = await api5.post("/api/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        // Handle successful login
        console.log(response.data);
        localStorage.setItem("token-desa-cantik", response.data.token);
        localStorage.setItem("username", username);
        setLoading(false);
        navigate("/admin");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setError(error.response.data.message);
      } else {
        // Network error or other errors
        setError("Login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-200">
      <TopEllipse />
      <BottomEllipse />
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm p-8 m-5 bg-white shadow-md rounded-xl md:max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/pict/logo_dc.png"
            alt="Logo"
            className="w-20 h-20 mb-3 md:w-30 md:h-30"
          />
          <p className="text-lg font-bold font-inter md:text-xl">LOGIN</p>
          <p className="text-sm font-semibold tracking-wider text-gray-500 font-assistant">
            ADMIN DESA CANTIK
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col w-full gap-4 font-quicksand"
        >
          <div className="relative">
            <Input
              label="Username"
              placeholder="Masukkan username anda"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              classNames={{
                label:
                  "text-black text-base md:text-lg mt-[5px] font-nunito font-bold",
                inputWrapper: "bg-slate-100",
              }}
            />
            {username && (
              <FaTimes
                className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-1/2 text-pdarkblue"
                onClick={handleUsernameClear}
              />
            )}
          </div>
          <div className="relative">
            <Input
              label="Password"
              placeholder="Masukkan password anda"
              type={passwordType}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              classNames={{
                label:
                  "text-black text-base md:text-lg mt-1 font-nunito font-bold",
                inputWrapper: "bg-slate-100",
              }}
            />
            {/* Tombol untuk toggle visibility password */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute transform -translate-y-1/2 right-8 top-8"
            >
              {passwordType === "password" ? (
                <AiFillEye className="text-pdarkblue" />
              ) : (
                <AiFillEyeInvisible className="text-pdarkblue" />
              )}
            </button>

            {/* Tombol untuk menghapus password */}
            {password && (
              <button
                type="button"
                onClick={clearPassword}
                className="absolute transform -translate-y-1/2 right-2 top-8"
              >
                <FaTimes className="text-pdarkblue" />
              </button>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-[14px] ml-[15px]">{error}</p>
          )}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full font-bold font-nunito bg-[#0B588F] text-white my-2"
              disabled={loading}
            >
              {loading ? (
                <Bars width="25" height="25" color="#ffffff" />
              ) : (
                "Masuk"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
