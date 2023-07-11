import React from 'react';
import ModalPortal from './ModalPortal';

import styles from './ModalFrame.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/** 
 * @param {{className: string, children: string, setOnModal: (state: boolean) => void}} props
 */
function ModalFrame({ className, children, setOnModal }) {
  return (
    <ModalPortal>
      <div className={cx('ModalDim', `${className}ModalDim`)} onClick={() => setOnModal(false)}>
        <div className={cx('ModalBox', `${className}ModalBox`)}>
          {children}
        </div>
      </div>
    </ModalPortal>
  );
}

export default ModalFrame;