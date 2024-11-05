import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaHome, FaList, FaImages, FaUser, FaChartBar, FaYoutube, FaBook, FaDoorOpen } from 'react-icons/fa';
import styles from './sidebar.module.css';

const Sidebar = () => {
  const [hovered, setHovered] = useState(null);
  const [activeMenu, setActiveMenu] = useState('');
  const location = useLocation();

  useEffect(() => {
    const pathToMenuMap = {
      '/admin': 'Desa',
      '/admin/buletin': 'Buletin',
      '/admin/navbar': 'Menu',
      '/admin/dashboard': 'Beranda',
      '/admin/desc': 'Deskripsi',
      '/admin/stat': 'Statistik',
      '/admin/us': 'Tentang Kami',
      '/logout': 'Keluar',
    };
    
    setActiveMenu(pathToMenuMap[location.pathname] || '');
  }, [location.pathname]);

  const handleMouseEnter = (index) => setHovered(index);
  const handleMouseLeave = () => setHovered(null);

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h1 className={styles.logoText}>Admin Desa Cantik</h1>
      </div>
      <nav className={styles.navMenu}>
        {[
          { icon: <FaList />, text: 'Menu', path: '/admin/navbar' },
          { icon: <FaImages />, text: 'Beranda', path: '/admin/dashboard' },
          { icon: <FaYoutube />, text: 'Deskripsi', path: '/admin/desc' },
          { icon: <FaChartBar />, text: 'Statistik', path: '/admin/stat' },
          { icon: <FaHome />, text: 'Desa', path: '/admin' },
          { icon: <FaBook />, text: 'Buletin', path: '/admin/buletin' },
          { icon: <FaUser />, text: 'Tentang Kami', path: '/admin/us' },
          { icon: <FaDoorOpen />, text: 'Keluar', path: '/logout' },
        ].map((item, index) => (
          <Link key={index} to={item.path} className={styles.navLink}>
            <div
              className={`${styles.button} ${hovered === index ? styles.buttonHover : ''} ${activeMenu === item.text ? styles.activeMenu : ''}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.text}>{item.text}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
