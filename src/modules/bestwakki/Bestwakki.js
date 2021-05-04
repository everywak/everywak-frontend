import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './Bestwakki.scss';

import Spinner from '../../common/Components/Spinner';
import Button from '../../common/Components/Button';
import SearchBar from './SearchBar';
import DateRange from './DateRange';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import CommentRoundedIcon from '@material-ui/icons/CommentRounded';
import * as service from '../../services/BestApi';
import * as func from '../../common/funtions';

import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import BestwakkiBottomNavigator from './BestwakkiBottomNavigator';
import { Fragment } from 'react';
const cx = classNames.bind(styles);

class Bestwakki extends Component {
  static defaultProps = {
    front: false
  };

  state = {
    list: [],
    loaded: false,
    page: 1,
    loadedLength: 1,
  };

  constructor (props) {
    super(props);
    if (!props.front) {
      document.title = '에브리왁굳 : 왁물원 인기글';
    }

    const { search } = props.location || {};
    const { beginAt, endAt } = func.getURLParams(search);
    this.beginAt = (
      beginAt ? 
      (func.isDateStr(beginAt) ? new Date(beginAt).getTime() : beginAt * 1000) : 
      -1
    );
    this.endAt = (
      endAt ? 
      (func.isDateStr(endAt) ? new Date(endAt).getTime() : endAt * 1000) : 
      -1
    );
  }

  fetchArticlesInfo = async ({ reset }) => {
    this.setState({
      loaded: false,
    });
    const { search } = this.props.location || {};
    const params = func.getURLParams(search);
    params.page = reset ? 1 : this.state.page + 1;
    const post = await service.getBestArticles(params);

    if (post.status === 200) {
      const currList = this.state.list;
      const loadedList = post.data.message.result.popularArticleList;
      const list = reset ? loadedList : currList.concat(loadedList);
      
      this.setState({
        list: list,
        loaded: true,
        page: params.page,
        loadedLength: loadedList.length
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
    const { front, history, location } = this.props;
    const { list, loaded, loadedLength } = this.state;
    const today = new Date();
    const min = 1424876400000, max = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    return (
      <div className={cx('Bestwakki', {'front': front})}>
        {!front && 
          <Fragment>
            <div className="moduleHeader">
              <Link to="/bestwakki"><h1>왁물원 인기글</h1></Link>
              <div className="controlWrapper">
                <SortList history={history} location={location} fetchArticlesInfo={this.fetchArticlesInfo} />
                <div className="right">
                  <DateRange name="queryDate" min={min} max={max} start={this.beginAt} end={this.endAt} />
                  <SearchBar history={history} location={location} />
                </div>
              </div>
            </div>
            <BestwakkiBottomNavigator />
          </Fragment>
        }
        <ArticleList front={front} data={list} loaded={loaded} />
        <div className="more">
          <MoreVertRoundedIcon className="frontOnly" fontSize="small" />
          <Button 
            className={cx('moreLoad', {hide: !loaded || !loadedLength})} 
            href="" 
            size="fillWidth" 
            label={<span>더 보기<ExpandMoreRoundedIcon fontSize="medium" /></span>} 
            showLabel={true} 
            labelSize="14px" 
            labelBGColor="transparent" 
            onclick={e => this.fetchArticlesInfo({reset: false})} />
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

  skeleton = 
    <li className='Article skeleton'>
      <span className="txt_area">
        <span className="board_txt"><span className="skeletonItem">ㅇㅇㅇㅇㅇ</span></span>
        <strong className="tit"><span className="skeletonItem">ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</span></strong>
        <div className="user_area pc">
          <span className="nickname"><span className="skeletonItem">ㅇㅇㅇㅇ</span></span>
          <span className="datetime"><span className="skeletonItem">00:00:00</span></span>
          <span className="view"><span className="skeletonItem">000</span></span>
          <span className="like"><span className="skeletonItem">000</span></span>
          <span className="comment"><span className="skeletonItem">000</span></span>
        </div>
        <div className="user_area mobile">
          <span className="skeletonItem">ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</span>
        </div>
      </span>
      <span className="thumb_area">
        <div className="thumb skeletonItem">
        </div>
      </span>
    </li>;

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
        {!this.props.loaded && <Spinner struct={this.skeleton} structLength={8} />}
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
            <span className="nickname">
              <i className="blind">작성자</i>{nickname}
            </span>
            <span className="datetime">{aheadOfWriteDate}</span>
            <span className="view">
              <i className="blind">조회수</i>
              <VisibilityRoundedIcon className="icon" fontSize="small" />
              {readCount}
            </span>
            <span className="like">
              <i className="blind">좋아요</i>
              <FavoriteRoundedIcon className="icon" fontSize="small" />
              {upCount}
            </span>
            <span className="comment">
              <i className="blind">댓글</i>
              <CommentRoundedIcon className="icon" fontSize="small" />
              {commentCount}
            </span>
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
      func.addURLParams.bind(this) (
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
    const { px, pw, x, w } = this.state;
    const animSortTarget = keyframes`
      0% {
        left: ${px + 'px'};
        width: ${pw + 'px'};
      }
      100% {
        left: ${x + 'px'};
        width: ${w + 'px'};
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

export default Bestwakki;