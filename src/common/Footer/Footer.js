import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import styles from './Footer.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        footer
      </footer>
    );
  }
}

export default Footer;
