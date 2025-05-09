import React, { CSSProperties } from 'react';
import clsx from 'clsx';

import { AppListItem } from './AppListItem';

import StarRoundedIcon from '@mui/icons-material/StarRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ViewCarouselRoundedIcon from '@mui/icons-material/ViewCarouselRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import styles from './Apps.module.scss';

export interface Props {
  columns?: number;
}

export const Apps = ({ columns }: Props) => {
  const apps = [
    {
      key: 'apps_waktaverselive',
      title: '왁타버스 같이보기',
      description: '왁씨티브이 ON',
      icon: <ViewCarouselRoundedIcon />,
      themeColor: '#DD3535',
      href: '/withlive',
    },
    {
      key: 'apps_bestwakki',
      title: '왁물원 인기글',
      description: '스팀인디게임에서 왁물원까지',
      icon: '/images/wakki_logo_2x.png',
      iconPadding: '1px',
      themeColor: '#25CB36',
      href: '/bestwakki',
    },
    {
      key: 'apps_isedol',
      title: '이세계아이돌 in 에브리왁',
      description: '이세돌의 생방송, 핫클립, 유튜브 영상들을 한 눈에',
      icon: <StarRoundedIcon />,
      themeColor: '#F2499A',
      href: '/isedol',
    },
    {
      key: 'apps_waktoon',
      title: '왁타버스 웹툰',
      description: '이세돌, 고정멤버 웹툰 모아보기',
      icon: <MenuBookRoundedIcon />,
      themeColor: '#10CBa1',
      href: '/waktoon',
    },
    {
      key: 'apps_wakcontest',
      title: '우왁굳 연말공모전',
      description: '한 해의 마무리를 장식하는 우왁굳 연공전',
      icon: <EmojiEventsRoundedIcon />,
      themeColor: '#4A3DDE',
      href: 'https://everywak.kr/wakcontest',
    },
    {
      key: 'apps_facewakdu',
      title: '왁두 닮은꼴 테스트',
      description: '당신의 왁두는 ‘이것’입니다',
      icon: '/images/wakdu_logo_1x.png',
      themeColor: '#D29317',
      href: 'https://everywak.kr/wakdu',
    },
    {
      key: 'apps_gunghap',
      title: '우왁굳 이름 궁합',
      description: '형과 우리 사이 몇 퍼센트..?',
      icon: <FavoriteRoundedIcon />,
      themeColor: '#3D9ADE',
      href: 'https://everywak.kr/trend/gunghap.wak',
    },
    {
      key: 'apps_more',
      title: '또 무엇이 기다리고 있을까',
      description: '새로운 아이디어는 언제나 환영이라굳',
      icon: <MoreHorizRoundedIcon />,
      themeColor: '#D3D3D3',
      href: '/app/apply',
    },
  ];

  const list = apps.map((app) => <AppListItem className={styles.item} {...app} />);

  return (
    <div
      className={clsx('Apps', styles.container, { [styles.singleColumn]: columns === 1 })}
      style={{ '--column': columns } as CSSProperties}
    >
      <ul className={styles.appList}>{list}</ul>
    </div>
  );
};
