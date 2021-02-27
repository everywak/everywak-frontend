import React, { Component } from 'react';
import styles from './Frontpage.scss';
import classNames from 'classnames/bind';

import Bestwakki from '../bestwakki/Bestwakki.js';
import Live from '../live/Live.js';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

class Frontpage extends Component {

  render() {
    const style ={
      background: 'white',
      height: '100%'
    }
    
    return (
      <div className="Frontpage" style={style}>
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
        title: "왁물원 인기글",
        link: "/bestwakki",
        component: <Bestwakki front='true' />
      },
      {
        id: 1,
        title: "우왁굳 생방송",
        link: "/live",
        component: <Live front={true} />
      },
      {
        id: 2,
        title: "여러가지가 있읍니다",
        link: "/apps",
        component: <Bestwakki />
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
            <span className="tit">{data.title}</span><span className="more">더 보기 <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="18px" height="18px"><g><rect fill="none" height="24" width="24" y="0"/></g><g><g><g><path d="M9.29,15.46l3.88-3.88L9.29,7.7c-0.39-0.39-0.39-1.02,0-1.41l0,0c0.39-0.39,1.02-0.39,1.41,0l4.59,4.59 c0.39,0.39,0.39,1.02,0,1.41l-4.59,4.59c-0.39,0.39-1.02,0.39-1.41,0l0,0C8.91,16.49,8.9,15.85,9.29,15.46z"/></g></g></g></svg></span>
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