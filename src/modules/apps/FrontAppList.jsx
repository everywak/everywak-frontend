import React, { Component } from 'react';

import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ViewCarouselRoundedIcon from '@mui/icons-material/ViewCarouselRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';

import AppListItem from './AppListItem';

import './FrontAppList.scss';
import cx from 'classnames/bind';

function FrontAppList(props) {
  const columns = 3;
  const appItems = [
    {
      key: 'apps_bestwakki',
      title: '왁물원 인기글',
      icon: '/images/wakki_logo_2x.png',
      iconPadding: '2px',
      themeColor: '#25CB36',
      href: '/bestwakki',
    },
    {
      key: 'apps_live',
      title: '우왁굳 생방송',
      icon: <LiveTvRoundedIcon />,
      iconPadding: '1px',
      themeColor: '#8D2BDA',
      href: '/live',
    },
    {
      key: 'apps_isedol',
      title: '이세계 아이돌',
      icon: <StarRoundedIcon />,
      themeColor: '#F2499A',
      href: '/isedol',
    },
    {
      key: 'apps_waktaverselive',
      title: '왁타버스 같이보기',
      icon: <ViewCarouselRoundedIcon />,
      themeColor: '#DD3535',
      href: '/withlive',
    },
    {
      key: 'apps_waktoon',
      title: '왁굳코믹스',
      icon: <MenuBookRoundedIcon />,
      iconPadding: '1px',
      themeColor: '#10CBa1',
      href: '/waktoon',
    },
    /*{
      key: 'apps_waktv',
      title: '왁굳TV',
      icon: <ArchiveRoundedIcon />,
      iconPadding: '1px',
      themeColor: '#4A3DDE',
      href: '/video',
    },*/
  ];
  const list = appItems.map((app) => <AppListItem {...app} size="tiny" />);

  return (
    <div className={cx('FrontAppList')} style={{ '--column': columns }}>
      <ul className="appList">{list}</ul>
    </div>
  );
}

export default FrontAppList;
