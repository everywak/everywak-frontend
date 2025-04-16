import React, { CSSProperties } from 'react';
import clsx from 'clsx';
import { StarRounded, MenuBookRounded, ViewCarouselRounded } from '@mui/icons-material';
import { AppListItem } from 'components/frontpage/common/Apps/AppListItem';

import styles from './AppList.module.scss';

export const AppList = () => {
  const columns = 4;
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
      key: 'apps_withlive',
      title: '왁타버스 같이보기',
      icon: <ViewCarouselRounded />,
      themeColor: '#DD3535',
      href: '/withlive',
    },
    {
      key: 'apps_isedol',
      title: '이세계아이돌',
      icon: <StarRounded />,
      themeColor: '#F2499A',
      href: '/isedol',
    },
    {
      key: 'apps_waktoon',
      title: '왁굳코믹스',
      icon: <MenuBookRounded />,
      iconPadding: '1px',
      themeColor: '#10CBa1',
      href: '/waktoon',
    },
  ];
  const list = appItems.map((app) => (
    <AppListItem className={styles.item} {...app} size="tiny" hideShadow />
  ));

  return (
    <div
      className={clsx('AppList', styles.container)}
      style={{ '--column': columns } as CSSProperties}
    >
      <ul className={styles.list}>{list}</ul>
    </div>
  );
};
