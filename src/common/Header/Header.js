import React, { Component } from 'react';
import styled from "styled-components";
import styles from './Header.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Header extends Component {
  state = {
    items: [
      {
        name: '우왁굳 트위치',
        link: 'https://www.twitch.tv/woowakgood',
        img: '/images/twitch_logo.svg',
        background: '#9147ff',
        color: 'white'
      },
      {
        name: '우왁굳 유튜브',
        link: 'https://www.youtube.com/channel/UCBkyj16n2snkRg1BAzpovXQ',
        img: '/images/youtube_logo.png',
        background: '#f00',
        color: 'white'
      },
      {
        name: '왁물원',
        link: 'https://cafe.naver.com/steamindiegame',
        img: '/images/wakki_logo.png',
        background: '#5ac467',
        color: 'white'
      },
      {
        name: '왁물원 인기글',
        link: '',
        img: '/images/thumb_up_off_alt-white-36dp.svg',
        background: '#5ac467',
        color: 'white'
      },
      {
        name: '왁튜브 생방송',
        link: '',
        img: '/images/podcasts-white-36dp.svg',
        background: '#c20',
        color: 'white'
      },
    ]
  }

  render() {
    return (
      <header className="header">
        <a href="/" className="title">에브리왁굳<span className="kr">.KR</span></a>
        <HeaderItemList data={this.state.items} />
      </header>
    );
  }
}

class HeaderItemList extends Component {
  static defaultProps = {
    data: []
  }

  render() {
    const { data } = this.props;
    const list = data.map(
      info => (<HeaderItem info={info} />)
    );
    return (
      <div className="HeaderItemList">
        <ul className="itemList">
          {list}
        </ul>
      </div>
    );
  }
}

const HeaderItemButton = styled.a`
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
`;

class HeaderItem extends Component {
  static defaultProps = {
    info: {
      name: '',
      link: '',
      img: '',
      background: 'rgba(0, 0, 0, 0)',
      color: 'white'
    }
  }
  
  render() {
    const {
      name, link, img, background, color
    } = this.props.info;

    const iconStyle2={
      backgroundColor: background
    }
    return (
      <li className="listItem">
        <HeaderItemButton 
          href={link} 
          //background={background}
          color={color}>
          <div className={cx('icon')} style={iconStyle2} >
            <img src={img} alt={name} />
          </div>
          {name}
        </HeaderItemButton>
      </li>
    );
  }
}

export default Header;
