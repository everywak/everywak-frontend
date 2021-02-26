import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import styled from "styled-components";
import styles from './Header.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Header extends Component {
  render() {
    return (
      <header className="header">
      </header>
    );
  }
}

export default Header;
