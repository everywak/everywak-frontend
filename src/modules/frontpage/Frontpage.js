import React, { Component } from 'react';
import styles from './Frontpage.scss';
import classNames from 'classnames/bind';

import Bestwakki from '../bestwakki/Bestwakki.js';
import Live from '../live/Live.js';
import Apps from '../apps/Apps.js';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

class Frontpage extends Component {

  render() {
    
    return (
      <div className="Frontpage">
        <ArticleList />
      </div>
    );
  }
}

class ArticleList extends Component {
  static defaultProps = {
    data: [
      {
        id: 0,
        title: "우왁굳 생방송",
        link: "/live",
        component: <Live front={true} />
      },
      {
        id: 1,
        title: "왁물원 인기글",
        link: "/bestwakki",
        component: <Bestwakki front={true} />
      },
      {
        id: 2,
        title: "여러가지가 있읍니다",
        link: "/apps",
        component: <Apps front={true} />
      },
    ]
  }

  render() {
    const { data } = this.props;
    const list = data.map(
      data => (
      <li key={data.id} className="FrontPanel">
        <div className="panelHeader">
          <Link to={data.link}>
            <span className="tit">{data.title}</span>
            <span className="more">
              더 보기 <KeyboardArrowRightRoundedIcon fontSize="small"/>
            </span>
          </Link>
        </div>
        <div className="compContainer">
          {data.component}
        </div>
      </li>
      )
    );

    return (
      <ul className="FrontPanelList">
        {list}
      </ul>
    );
  }
}

class Article extends Component {
  static defaultProps = {
    data: {
      articleId: "",
      menuName: "유머, 정보 게시판",
      subject: "제목 어쩌구저쩌구",
      nickname: "ㅇㅇㅇㅇ",
      aheadOfWriteDate: "21.02.27.",
      readCount: "120",
      upCount: "330",
      commentCount: "10",
      representImage: "",
    }
  };

  render() {
    const { 
      articleId, menuName, subject, nickname, aheadOfWriteDate, readCount, upCount, commentCount, representImage 
    } = this.props.data;
    const href = "https://cafe.naver.com/steamindiegame/" + articleId.replace(/[^0-9]/g, '');
    return (
      <li className="Article">
        <a href={href} className="txt_area" target="_blank" rel="noreferrer">
          <span class="icon_new_txt">•</span>
          <span class="board_txt">{menuName}</span>
          <strong class="tit">{subject}</strong>

          <div class="user_area">
            <span class="nickname">{nickname}</span>
            <span class="datetime">{aheadOfWriteDate}</span>
            <span class="view">{readCount}</span>
            <span class="like">{upCount}</span>
            <span class="comment">{commentCount}</span>
          </div>
        </a>
        <a href={href} class="thumb_area" target="_blank" rel="noreferrer">
          <div class="thumb">
            <img src={representImage} width="64px" height="64px" alt="썸네일" onerror="this.style.display='none';" referrerPolicy="no-referrer"/>
          </div>
        </a>
      </li>
    );
  }
}

export default Frontpage;