import React, { Component } from 'react';
import styles from './ScrollToTopButton.scss';

import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';

import Button from '../../common/Components/Button';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class ScrollToTopButton extends Component {
  static defaultProps = {
    show: false,
  }
  state = {
  }

  gotoTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  render () {
    
    return (
      <Button className={cx('ScrollToTopButton', {show: this.props.show})}
        iconSrc={<KeyboardArrowUpRoundedIcon fontSize="small" />} 
        iconBGColor="white"
        label="맨 위로"
        onclick={this.gotoTop}
        showLabel={false} />
    );
  }
}

export default ScrollToTopButton;