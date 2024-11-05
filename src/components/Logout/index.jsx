import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hapus token dari localStorage
    localStorage.removeItem('token-desa-cantik');

    // Arahkan pengguna ke halaman login atau halaman lainnya
    navigate('/login'); // Sesuaikan dengan rute login Anda
  }, [navigate]);

  return null; // Komponen ini tidak perlu menampilkan apapun
};

export default Logout;
