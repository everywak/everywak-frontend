import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import BestwakkiHeader from '../../modules/bestwakki/BestwakkiHeader';

import styles from './Header.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="left"></div>
        <Link to="/" className="title"><img src="/images/everywak_logo.png" alt="Everywak"/></Link>
        <div className="right">
          <Route path="/bestwakki" component={BestwakkiHeader}/>
          <button className="moreApp"><img src="/images/grid_view-black-18dp.svg" alt=""/></button>
        </div>
      </header>
    );
  }
}

export default Header;
