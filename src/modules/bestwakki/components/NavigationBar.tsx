import React, { useRef, useState } from 'react';
import _ from 'lodash';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import { NotDesktop } from 'common/MediaQuery';
import useWindowEvent from 'hooks/useWindowEvent';

import Button from 'common/Components/Button';
import BestwakkiSearchPanel from './NavigationBar/BestwakkiSearchPanel';
import ScrollToTopButton from './NavigationBar/ScrollToTopButton';

import styles from './NavigationBar.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function NavigationBar() {
  const [isShowing, setShowing] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const prevScrollY = useRef(-1);

  const show = () => !isShowing && setShowing(true);
  const hide = () => isShowing && setShowing(false);

  const showBtnTop = () => !showTop && setShowTop(true);
  const hideBtnTop = () => showTop && setShowTop(false);

  const scrollHandler = _.throttle(() => {
    if (window.scrollY < 50) {
      show();
      hideBtnTop();
    } else if (prevScrollY.current > 0) {
      showBtnTop();
      if (prevScrollY.current < window.scrollY) {
        // scroll down
        hide();
      } else {
        // scroll up
        show();
      }
    }
    prevScrollY.current = window.scrollY;
  }, 100);
  useWindowEvent('scroll', scrollHandler, [
    show,
    hide,
    showBtnTop,
    hideBtnTop,
    prevScrollY
  ]);

  return (
    <nav className={cx('NavigationBar', { opened: isShowing })}>
      <div className="left">
        <NotDesktop>
          <Button
            className="goHome"
            href="/"
            iconSrc={<HomeRoundedIcon fontSize="medium" />}
            iconBGColor="transparent"
            labelBGColor="transparent"
            label="홈으로"
            labelSize="16px"
            showLabel={true}
          />
        </NotDesktop>
      </div>
      <div className="right">
        <NotDesktop>
          <BestwakkiSearchPanel />
        </NotDesktop>
        <ScrollToTopButton show={showTop} />
        <Button
          className="btnSetting"
          iconSrc={<SettingsRoundedIcon />}
          iconBGColor="transparent"
          label="인기글 목록 설정"
          href="."
          showLabel={false}
        />
      </div>
    </nav>
  );
}
