import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}></div>
      <EverywakLogo />
      <div className={styles.right}>
        {/* <button className={styles.moreApp}><img src="/images/grid_view-black-18dp.svg" alt="앱 바로가기 메뉴"/></button> */}
      </div>
    </header>
  );
}

export function EverywakLogo (props) {
  return <Link to="/" className={styles.title}><img src="/images/everywak_logo.png" alt="Everywak 로고"/></Link>;
}

export default Header;
