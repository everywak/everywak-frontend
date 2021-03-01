import React, { Component } from 'react';
import styled from "styled-components";
import styles from './Dropdown.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Dropdown extends Component {

  render() {

    return (
        <div className="Dropdown">
          <div className="dispArea">
            <span className="currName">제목</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
          </div>
          <div className="dropdownArea">

          </div>
        </div>
    );
  }
}

export default Dropdown;