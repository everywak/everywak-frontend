import React, { Component } from 'react';
import _ from 'lodash';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import Button from 'common/Components/Button';
import BestwakkiSearchPanel from './BestwakkiSearchPanel';
import ScrollToTopButton from './ScrollToTopButton';

import { NotDesktop } from 'common/MediaQuery';

import styles from './BestwakkiBottomNavigator.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class BestwakkiBottomNavigator extends Component {

  static defaultProps = {
    searchFilter: null, 
    onChangeDateRangeHandler: e => {},
    updateSearchFilter: e => {},
  }

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
    const { searchFilter, onChangeDateRangeHandler, updateSearchFilter } = this.props;
    const { opened, showTop } = this.state;
    
    return (
        <nav className={cx('BestwakkiBottomNavigator', {opened: opened})}>
          <div className="left">
            <NotDesktop>
              <Button className="goHome"
                href="/"
                iconSrc={<HomeRoundedIcon fontSize="medium" />}
                iconBGColor="transparent" 
                labelBGColor="transparent"
                label="홈으로" 
                labelSize="16px"
                showLabel={true} />
            </NotDesktop>
          </div>
          <div className="right">
            <NotDesktop>
              <BestwakkiSearchPanel searchFilter={searchFilter} onChangeDateRangeHandler={onChangeDateRangeHandler} />
            </NotDesktop>
            <ScrollToTopButton show={showTop} />
            <Button className="btnSetting"
              iconSrc={<SettingsRoundedIcon />} 
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