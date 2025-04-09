import React from 'react';
import ReactDOM from 'react-dom';

function ModalPortal({ children }) {
  return ReactDOM.createPortal(children, document.getElementById('modal-root'));
}

export default ModalPortal;
