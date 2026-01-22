import React, { CSSProperties } from 'react';
import clsx from 'clsx';
import { StarRounded, MenuBookRounded, ViewCarouselRounded } from '@mui/icons-material';
import { AppListItem } from '@/components/frontpage/common/Apps/AppListItem';

import styles from './AppList.module.scss';

export const AppList = () => {
  const columns = 4;
  const appItems = [
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
