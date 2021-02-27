import React, { Component } from 'react';
import styles from './Apps.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Apps extends Component {
  static defaultProps = {
    front: false,
    apps: [
      {
        id: 0,
        img: '',
        name: '닮은꼴 왁두 찾기 인공지능'
      },
      {
        id: 1,
        img: '',
        name: '우왁굳 이름 궁합'
      },
      {
        id: 2,
        img: '',
        name: '2020 연말공모전'
      },
      {
        id: 3,
        img: '',
        name: '왁굳 포인트 경매'
      },
      {
        id: 4,
        img: '',
        name: '팬치 타이머'
      },
    ]
  };

  render() {
    const { apps } = this.props;
    const list = apps.map(
      app => (
        <li key={app.id} className="appItem">
          <div className="wrapper">
            <img src={app.img} alt={app.name} onError={i => (i.target.style.display = 'none')} />
          </div>
        </li>
      )
    );
    
    return (
      <div className={cx('Apps', {'front': this.props.front})}>
        <ul className="appList">
          {list}
        </ul>
      </div>
    );
  }
}

export default Apps;