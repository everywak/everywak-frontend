import React, { Component } from 'react';
import styles from './Apps.scss';

import AppListItem from './AppListItem';

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
        thumbnail: null,
        href: '/live',
      },
      {
        key: 'apps_bestwakki',
        title: '왁물원 인기글',
        description: '스팀인디게임에서 왁물원까지',
        thumbnail: null,
        href: '/bestwakki',
      },
      {
        key: 'apps_isedol',
        title: '이세계 아이돌 in 에브리왁',
        description: '이세돌의 생방송, 핫클립, 유튜브 영상들을 한 눈에',
        thumbnail: null,
        href: '/isedol',
      },
      {
        key: 'apps_waktaverselive',
        title: '왁타버스 같이보기',
        description: '왁씨티브이 ON',
        thumbnail: null,
        href: '/withlive',
      },
      {
        key: 'apps_wakcontest',
        title: '우왁굳 연말공모전',
        description: '한 해의 마무리를 장식하는 우왁굳 연공전',
        thumbnail: null,
        href: '/wakcontest',
      },
      {
        key: 'apps_facewakdu',
        title: '왁두 닮은꼴 테스트',
        description: '당신의 왁두는 ‘이것’입니다',
        thumbnail: null,
        href: '/app/facewakdu',
      },
      {
        key: 'apps_gunghap',
        title: '우왁굳 이름 궁합',
        description: '형과 우리 사이 몇 퍼센트..?',
        thumbnail: null,
        href: '/app/gunghap',
      },
      {
        key: 'apps_more',
        title: '또 무엇이 기다리고 있을까',
        description: '새로운 아이디어는 언제나 환영이라굳',
        thumbnail: null,
        href: '/app/apply',
      },
    ]
  };

  render() {
    const { apps, columns } = this.props;
    const list = apps.map(app => <AppListItem {...app} />);
    
    return (
      <div className={cx('Apps', {'front': this.props.front}, {'singleColumn': this.props.columns === 1})}>
        <ul className="appList">
          {list}
        </ul>
      </div>
    );
  }
}

export default Apps;