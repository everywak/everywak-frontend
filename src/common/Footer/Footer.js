import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import Button from '../Components/Button';

import styles from './Footer.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Footer extends Component {
  static defaultProps = {
    btns: [
      {
        id: 0,
        type: 'btn',
        color: '#9147FF',
        href: 'https://twitch.tv/woowakgood',
        img: '/images/twitch_logo.svg',
        label: '우왁굳 트위치',
        showLabel: false,
      },
      {
        id: 1,
        type: 'btn',
        color: '#F00',
        href: 'https://www.youtube.com/channel/UCBkyj16n2snkRg1BAzpovXQ',
        img: '/images/youtube_logo.png',
        label: '우왁굳 유튜브',
        showLabel: false,
      },
      {
        id: 2,
        type: 'btn',
        color: '#5AC467',
        href: 'https://cafe.naver.com/steamindiegame',
        img: '/images/wakki_logo.png',
        label: '왁물원',
        showLabel: false,
      },
      {
        id: 3,
        type: 'line',
        color: '',
        href: '',
        img: '',
        label: '',
      },
      {
        id: 4,
        type: 'btn',
        color: '#1B1F23',
        href: 'https://github.com/wei756',
        img: '/images/github_logo.svg',
        label: '@wei756',
        showLabel: true,
      },
    ]
  }
  render() {
    const { btns } = this.props;
    const btnList = btns.map(
      btn => (btn.type === 'btn'?
      <Button key={btn.id} 
        href={btn.href} 
        iconSrc={btn.img} 
        iconBGColor={btn.color} 
        label={btn.label} 
        showLabel={btn.showLabel} /> :
      <span key={btn.id} className="line"></span>
      )
    );
    return (
      <footer className="footer">
        <div className="btns">{btnList}</div>
        <div className="links"><Link to="/contact">개발자 연락처</Link> | <Link to="/siteinfo">개인정보 처리방침 및 운영방침</Link></div>
        <div className="desc">에브리왁굳은 스트리머 우왁굳의 팬사이트이며<br/>
        특정 플랫폼에 귀속되어 있지 않은 개인이 운영하는 사이트입니다.</div>
        <div className="copyright">에브리왁굳 ⓒ 2020-2022. Wei756. All rights reserved.</div>
      </footer>
    );
  }
}

export default Footer;
