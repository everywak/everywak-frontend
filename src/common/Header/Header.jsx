import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Header() {
  return (
    <header className="header">
      <div className="left"></div>
      <EverywakLogo />
      <div className="right">
        {/* <button className="moreApp"><img src="/images/grid_view-black-18dp.svg" alt="앱 바로가기 메뉴"/></button> */}
      </div>
    </header>
  );
}

export function EverywakLogo (props) {
  return <Link to="/" className="title"><img src="/images/everywak_logo.png" alt="Everywak 로고"/></Link>;
}

export default Header;
