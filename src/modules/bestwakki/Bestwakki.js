import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './Bestwakki.scss';

import Dropdown from '../../common/Components/Dropdown';
import Spinner from '../../common/Components/Spinner';
import DatePicker from '../../common/Components/DatePicker';
import * as service from '../../services/BestApi';
import * as func from '../../common/funtions';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Bestwakki extends Component {
  static defaultProps = {
    front: false
  };

  state = {
    list: [],
    loaded: false,
    page: 1
  };

  fetchArticlesInfo = async ({ reset }) => {
    this.setState({
      loaded: false,
    });
    const { search } = this.props.location || {};
    const params = func.getURLParams(search);
    params.page = reset ? 1 : this.state.page + 1;
    const post = await service.getBestArticles(params);

    if (post.status === 200) {
      const list = reset ? 
        post.data.message.result.popularArticleList : 
        this.state.list.concat(post.data.message.result.popularArticleList);
      
      this.setState({
        list: list,
        loaded: true,
        page: params.page,
      });
    }
  };
  componentDidMount() {
    this.fetchArticlesInfo({reset: true});
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.fetchArticlesInfo({reset: true});
    }
  }

  render() {
    
    return (
      <div className={cx('Bestwakki', {'front': this.props.front})}>
        <div className="moduleHeader">
          <h1>왁물원 인기글</h1>
          <div className="controlWrapper">
            <SortList history={this.props.history} location={this.props.location} fetchArticlesInfo={this.fetchArticlesInfo} />
            <div className="right">
              <DateRange />
              <SearchBar history={this.props.history} location={this.props.location} />
            </div>
          </div>
        </div>
        <ArticleList front={this.props.front} data={this.state.list} loaded={this.state.loaded} />
        <div className="more">
          <svg className="frontOnly" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="18px" height="18px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><g><path d="M12,8c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,8,12,8z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z M12,16c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,16,12,16z"/></g></g></g></svg>
          <div className="moreLoad" onClick={e => this.fetchArticlesInfo({reset: false})}>
            <span>더 보기</span>
            <svg viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
          </div>
        </div>
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
    const list = data.slice(0, this.props.front ? Math.min(4, data.length) : data.length).map(
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

        {list}
        {this.props.loaded ? null : <Spinner caption="인기글 로딩중..."/>}
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
    const thumb_area = 
    <a href={href} className="thumb_area" target="_blank" rel="noreferrer">
      <div className="thumb">
        <img src={representImage} alt="썸네일" onError={i => i.target.style.display = 'none'} referrerPolicy="no-referrer"/>
      </div>
    </a>;
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
        {representImage && representImage !== '' ? thumb_area : ''}
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
    defaultSort: 'time'
  }
  state = {
    sort: 'time',
    px: 0,
    x: 0,
    pw: 0,
    w: 0
  };

  setSortTarget(val) {
    const prev = this.state.sort;
    this.setState({
      sort: val
    });
    if (this.props.history && val !== prev) {
      addURLParams.bind(this) (
        '/bestwakki', {
        orderBy: val
      });
    }
    document.getElementById(val).checked = true;
  }

  showAnimSortTarget(prevVal, targetVal) {
    const parentRect = document.getElementById('SortList').getBoundingClientRect();
    const current = document.querySelector('#' + (prevVal ? prevVal : 'time') + '+ label');
    const target = document.querySelector('#' + targetVal + '+ label');
    const currentRect = current.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    this.setState({
      px: currentRect.left - parentRect.left,
      x: targetRect.left - parentRect.left,
      pw: currentRect.right - currentRect.left,
      w: targetRect.right - targetRect.left,
    });
  }

  onChanged = (val) => {
    this.showAnimSortTarget(this.state.sort, val);
    setTimeout(() => {
      this.setSortTarget(val);
    }, 300);
  };

  componentDidMount () {
    var { search } = this.props.location || {};
    var { orderBy } = func.getURLParams(search);
    if (!this.props.data.find(e => {return e.value === orderBy})) {
      orderBy = this.props.defaultSort;
    }
    this.showAnimSortTarget(orderBy, orderBy);
    this.setSortTarget(orderBy);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.sort !== this.state.sort) {
      this.showAnimSortTarget(this.state.sort, this.state.sort);
    }
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
      <div id="SortList" className="SortList" onChange={event => this.onChanged(event.target.value)}>
        <HoverRect className="hoverRect" id="hoverRect" />
        {list}
      </div>
    );
  }
}

class DateRange extends Component {
  state = {
    dateStr: '',
    opened: false,
  }

  setDateStr = (str) => {
    this.setState({
      dateStr: str,
    });
  }

  open = () => {
    this.setState({
      opened: true,
    })
  }
  close = () => {
    this.setState({
      opened: false,
    })
  }
  toggle = () => {
    this.setState({
      opened: !this.state.opened,
    })
  }

  render() {
    const { opened, dateStr } = this.state;
    const today = new Date();

    return (
      <div className="DateRange">
        <div className={cx('dateBtn', {opened: opened})} onClick={e => this.toggle()}>
          <div className="dateWrapper">
            {dateStr}
          </div>
          <svg viewBox="0 0 24 24" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
        </div>
        <div className="closeArea" onClick={e => this.close()}></div>
        <div className="dateList">
          <DatePicker name="queryDate" min={1424876400000} max={new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()} parent={this} opened={opened} />
        </div>
      </div>
    );
  }
}

class SearchBar extends Component {

  search() {
    if (this.props.history) {
      const queryTxtElement = document.querySelector('input[name=queryTxt]');
      var queryTxt = queryTxtElement.value ? queryTxtElement.value : queryTxtElement.dataset.defaultvalue;

      const beginAtElement = document.getElementById('queryDate-start');
      var beginAt = beginAtElement.value;

      const endAtElement = document.getElementById('queryDate-end');
      var endAt = endAtElement.value;

      addURLParams.bind(this) (
        '/bestwakki', {
        queryTarget: document.querySelector('input[name=searchTarget]').value,
        queryTxt: queryTxt,
        beginAt: beginAt,
        endAt: endAt,
      });
    }
  }

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
    const phTxtList = [
      'manhwa', 'manhwa', 'ㅗㅜㅑ', '왁굳', 'ㅇㄷ', 'ㅇㅎ', '꿀팁', '꿀팁', 
    ];
    const phTxt = phTxtList[Math.floor(Math.random() * phTxtList.length)];

    return (
      <div className="SearchBar" >
        <input type="text" name="queryTxt" id="" className="inputForm" onKeyUp={e => {if (e.keyCode === 13) {this.search()}}} placeholder={"'" + phTxt + "' 검색해 보기"} data-defaultvalue={phTxt} />
        <Dropdown className="searchTarget" name="searchTarget" values={searchTarget} />
        <div className="btnSearch" onClick={e => this.search()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </div>
      </div>
    );
  }
}

function addURLParams(path, arr) {
  const { search } = this.props.location || {};
  const params = func.getURLParams(search);
  Object.keys(arr).map(
    key => params[key] = arr[key]
  );
  
  this.props.history.push({
    pathname: path,
    search: func.toURLParams(params)
  });
}

export default Bestwakki;