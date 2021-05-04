import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './BestwakkiBottomNavigator.scss';
import MediaQuery  from 'react-responsive';
import _ from 'lodash';


import * as func from '../../common/funtions';

import classNames from 'classnames/bind';
import Button from '../../common/Components/Button';
import BestwakkiHeader from './BestwakkiHeader';
const cx = classNames.bind(styles);

class BestwakkiBottomNavigator extends Component {
  state = {
    opened: true,
  }

  constructor(props) {
    super(props);
    this.prevScrollY = -1;

    this.scrollHandler = _.throttle(this.scrollHandler, 100);
  }

  open = () => {
    if (!this.state.opened) {
      this.setState({
        opened: true,
      })
    }
  }
  close = () => {
    if (this.state.opened) {
      this.setState({
        opened: false,
      })
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', () => this.scrollHandler());
  }

  scrollHandler = () => {
    const { opened } = this.state;

    if (window.scrollY < 50) {
      this.open();
    } else if (this.prevScrollY > 0) {
      if (this.prevScrollY < window.scrollY) { // scroll down
        this.close();
      } else { // scroll up
        this.open();
      }
    }
    this.prevScrollY = window.scrollY;
  };

  render () {
    const { opened } = this.state;
    const tablet_s_width = 960;
    
    return (
      <MediaQuery maxWidth={tablet_s_width - 1}>
        <nav className={cx('BestwakkiBottomNavigator', {opened: opened})}>
          <div className="left"></div>
          <div className="right">
            <BestwakkiHeader />
          </div>
        </nav>
      </MediaQuery>
    );
  }
}

export default BestwakkiBottomNavigator;