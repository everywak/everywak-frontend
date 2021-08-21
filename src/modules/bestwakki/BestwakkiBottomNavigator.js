import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './BestwakkiBottomNavigator.scss';
import MediaQuery  from 'react-responsive';
import _ from 'lodash';

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import * as func from '../../common/funtions';

import classNames from 'classnames/bind';
import Button from '../../common/Components/Button';
import BestwakkiSearchPanel from './BestwakkiSearchPanel';
import ScrollToTopButton from './ScrollToTopButton';
const cx = classNames.bind(styles);

class BestwakkiBottomNavigator extends Component {
  state = {
    opened: true,
    showTop: false,
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
  showBtnTop = () => {
    if (!this.state.showTop) {
      this.setState({
        showTop: true,
      })
    }
  }
  hideBtnTop = () => {
    if (this.state.showTop) {
      this.setState({
        showTop: false,
      })
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.scrollHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  scrollHandler = () => {
    const { opened } = this.state;

    if (window.scrollY < 50) {
      this.open();
      this.hideBtnTop();
    } else if (this.prevScrollY > 0) {
      this.showBtnTop();
      if (this.prevScrollY < window.scrollY) { // scroll down
        this.close();
      } else { // scroll up
        this.open();
      }
    }
    this.prevScrollY = window.scrollY;
  };

  render () {
    const { opened, showTop } = this.state;
    const tablet_s_width = 960;
    
    return (
        <nav className={cx('BestwakkiBottomNavigator', {opened: opened})}>
          <div className="left">
            <MediaQuery maxWidth={tablet_s_width - 1}>
              <Button className="goHome"
                href="/"
                iconSrc={<HomeRoundedIcon fontSize="medium" />}
                iconBGColor="transparent" 
                labelBGColor="transparent"
                label="홈으로" 
                labelSize="16px"
                showLabel={true} />
            </MediaQuery>
          </div>
          <div className="right">
            <MediaQuery maxWidth={tablet_s_width - 1}>
              <BestwakkiSearchPanel history={this.props.history} />
            </MediaQuery>
            <ScrollToTopButton show={showTop} />
            <Button className="btnSetting"
              iconSrc={<SettingsRoundedIcon fontSize="medium" />} 
              iconBGColor="transparent"
              label="인기글 목록 설정"
              href="."
              showLabel={false} />
          </div>
        </nav>
    );
  }
}

export default BestwakkiBottomNavigator;