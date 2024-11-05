// src/components/Modal/modal.jsx
import React from 'react';
import styles from './modal.module.css';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
