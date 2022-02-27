import React, { Component } from 'react';

import AppListItem from './AppListItem';

import LiveTvRoundedIcon from '@material-ui/icons/LiveTvRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import ViewCarouselRoundedIcon from '@material-ui/icons/ViewCarouselRounded';
import EmojiEventsRoundedIcon from '@material-ui/icons/EmojiEventsRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';

import styles from './Apps.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Apps extends Component {
  static defaultProps = {
    front: false,
    columns: 2,
    apps: [
      {
        key: 'apps_live',
        title: '우왁굳 생방송',
        description: '트위치, 유튜브, 어디서든 형과 함께',
        icon: <LiveTvRoundedIcon />,
        iconPadding: '1px',
        themeColor: '#8D2BDA',
        href: '/live',
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
        title: '이세계 아이돌 in 에브리왁',
        description: '이세돌의 생방송, 핫클립, 유튜브 영상들을 한 눈에',
        icon: <StarRoundedIcon />,
        themeColor: '#F2499A',
        href: '/isedol',
      },
      {
        key: 'apps_waktaverselive',
        title: '왁타버스 같이보기',
        description: '왁씨티브이 ON',
        icon: <ViewCarouselRoundedIcon />,
        themeColor: '#DD3535',
        href: '/withlive',
      },
      {
        key: 'apps_wakcontest',
        title: '우왁굳 연말공모전',
        description: '한 해의 마무리를 장식하는 우왁굳 연공전',
        icon: <EmojiEventsRoundedIcon />,
        themeColor: '#4A3DDE',
        href: '/wakcontest',
      },
      {
        key: 'apps_facewakdu',
        title: '왁두 닮은꼴 테스트',
        description: '당신의 왁두는 ‘이것’입니다',
        icon: '/images/wakdu_logo_2x.png',
        themeColor: '#D29317',
        href: '/app/facewakdu',
      },
      {
        key: 'apps_gunghap',
        title: '우왁굳 이름 궁합',
        description: '형과 우리 사이 몇 퍼센트..?',
        icon: <FavoriteRoundedIcon />,
        themeColor: '#3D9ADE',
        href: '/app/gunghap',
      },
      {
        key: 'apps_more',
        title: '또 무엇이 기다리고 있을까',
        description: '새로운 아이디어는 언제나 환영이라굳',
        icon: <MoreHorizRoundedIcon />,
        themeColor: '#D3D3D3',
        href: '/app/apply',
      },
    ]
  };

  render() {
    const { front, apps, columns } = this.props;
    const list = apps.map(app => <AppListItem {...app} />);
    
    return (
      <div className={cx('Apps', {'front': front}, {'singleColumn': columns === 1})}>
        <ul className="appList">
          {list}
        </ul>
      </div>
    );
  }
}

export default Apps;