import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './Bestwakki.scss';

import Dropdown from '../../common/Components/Dropdown';
import Spinner from '../../common/Components/Spinner';
import * as service from '../../services/BestApi';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Bestwakki extends Component {
  static defaultProps = {
    front: false
  };

  state = {
    list: [],
    loaded: false
  };

  fetchArticlesInfo = async ({ reset }) => {
    const post = await service.getBestArticles();
    console.log(post);
    if (post.status === 200) {
      this.setState({
        list: post.data.message.result.popularArticleList,
        loaded: true
      });
    }
  };
  componentDidMount() {
    this.fetchArticlesInfo({reset: false});
  }

  render() {
    
    return (
      <div className={cx('Bestwakki', {'front': this.props.front})}>
        <div className="moduleHeader">
          <h1>왁물원 인기글</h1>
          <div className="controlWrapper">
            <SortList />
            <SearchBar />
          </div>
        </div>
        <ArticleList front={this.props.front} data={this.state.list} loaded={this.state.loaded} />
        <div className="more"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="18px" height="18px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><g><path d="M12,8c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,8,12,8z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z M12,16c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,16,12,16z"/></g></g></g></svg></div>
      </div>
    );
  }
}

class ArticleList extends Component {
  static defaultProps = {
    data: [
      {
        "updatedTimeStamp":"",
        "articleId":"",
        "writeDateTimestamp":"",
        "subject":"",
        "readCount":"",
        "upCount":"",
        "commentCount":"",
        "menuName":"",
        "nickname":"",
        "representImage":"",
        "aheadOfWriteDate":""
      },
    ],
    front: false,
    loaded: false
  }

  render() {
    const { data } = this.props;
    const list = data.slice(0, this.props.front ? Math.min(5, data.length) : data.length).map(
      data => (<Article key={data.articleId} data={data} />)
    );
    const listHeader = {
      "articleId":"-1",
      "subject":"제목",
      "readCount":"조회",
      "upCount":"좋아요",
      "menuName":"게시판",
      "nickname":"작성자",
      "aheadOfWriteDate":"작성일"
    };

    return (
      <ul className="ArticleList">
        <Article header={true} key={listHeader.articleId} data={listHeader} />

        {this.props.loaded ? null : <Spinner caption="인기글 로딩중..."/>}
        {list}
      </ul>
    );
  }
}

class Article extends Component {
  static defaultProps = {
    data: {
      articleId: "",
      menuName: "",
      subject: "",
      nickname: "",
      aheadOfWriteDate: "",
      readCount: "0",
      upCount: "0",
      commentCount: "0",
      representImage: "",
    },
    header: false
  };

  render() {
    const { 
      articleId, menuName, subject, nickname, aheadOfWriteDate, readCount, upCount, commentCount, representImage 
    } = this.props.data;
    const href = (
      this.props.header ? 
      null : 
      "https://cafe.naver.com/steamindiegame/" + articleId.replace(/[^0-9]/g, '')
    );
    return (
      <li className={cx('Article', {'listHeader': this.props.header})}>
        <a href={href} className="txt_area" target="_blank" rel="noreferrer">
          <span className="icon_new_txt">•</span>
          <span className="board_txt">{menuName}</span>
          <strong className="tit">{subject}</strong>

          <div className="user_area">
            <span className="nickname">{nickname}</span>
            <span className="datetime">{aheadOfWriteDate}</span>
            <span className="view">{readCount}</span>
            <span className="like">{upCount}</span>
            <span className="comment">{commentCount}</span>
          </div>
        </a>
        <a href={href} className="thumb_area" target="_blank" rel="noreferrer">
          <div className="thumb">
            <img src={representImage} width="64px" height="64px" alt="썸네일" onError={i => i.target.style.display = 'none'} referrerPolicy="no-referrer"/>
          </div>
        </a>
      </li>
    );
  }
}

class SortList extends Component {
  static defaultProps = {
    data: [
      {
        id: 0,
        name: "최신순",
        value: "time"
      },
      {
        id: 1,
        name: "오래된 순",
        value: "time_oldest"
      },
      {
        id: 2,
        name: "좋아요순",
        value: "up"
      },
      {
        id: 3,
        name: "댓글순",
        value: "comment"
      },
      {
        id: 4,
        name: "조회순",
        value: "read"
      },
    ],
  }
  state = {
    sort: '',
    px: 0,
    x: 0,
    pw: 0,
    w: 0
  };

  setSortTarget(val) {
    document.getElementById(val).checked = true;
    this.showAnimSortTarget(val);
  }

  showAnimSortTarget(val) {
    var parentRect = document.getElementById('SortList').getBoundingClientRect();
    var currentRect = document.getElementById('hoverRect').getBoundingClientRect();
    var target = document.querySelector('#' + val + '+ label');
    var targetRect = target.getBoundingClientRect();
    this.setState({
      px: currentRect.left - parentRect.left,
      x: targetRect.left - parentRect.left,
      pw: currentRect.right - currentRect.left,
      w: targetRect.right - targetRect.left,
    });
  }

  componentDidMount () {
    if (this.state.sort === '')
      this.setSortTarget('time');
  }


  render() {
    const animSortTarget = keyframes`
      0% {
        left: ${this.state.px + 'px'};
        width: ${this.state.pw + 'px'};
      }
      100% {
        left: ${this.state.x + 'px'};
        width: ${this.state.w + 'px'};
      }
    `
    const HoverRect = styled.div`
      animation: ${animSortTarget} .3s 0s 1 ease normal forwards;
    `

    const { data } = this.props;
    const list = data.map(
      data => (
        <div key={data.id} className="sortItem">
          <input type="radio" name="sort" value={data.value} id={data.value} />
          <label htmlFor={data.value}>{data.name}</label>
        </div>
      )
    );

    return (
      <div id="SortList" className="SortList" onChange={event => this.setSortTarget(event.target.value)}>
        <HoverRect className="hoverRect" id="hoverRect" />
        {list}
      </div>
    );
  }
}

class SearchBar extends Component {

  render() {
    const searchTarget = [
      {
        id: 0,
        name: '제목',
        value: 'title',
      },
      {
        id: 1,
        name: '작성자',
        value: 'author',
      },
      {
        id: 2,
        name: '게시판',
        value: 'board',
      },
    ];

    return (
      <div className="SearchBar" >
        <input type="text" name="" id="" className="inputForm" placeholder="여기에 검색어 입력" />
        <Dropdown className="searchTarget" name="searchTarget" values={searchTarget} defaultName="제목" defaultValue="title" />
        <div className="btnSearch">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </div>
      </div>
    );
  }
}

export default Bestwakki;