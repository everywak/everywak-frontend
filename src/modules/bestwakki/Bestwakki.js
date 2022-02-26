import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import MediaQuery  from 'react-responsive';

import ArticleList from '../board/ArticleList/ArticleList';
import SearchBar from './SearchBar';
import DateRange from './DateRange';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import BestwakkiBottomNavigator from './BestwakkiBottomNavigator';

import * as service from '../../services/BestApi';
import * as func from '../../common/funtions';

import styles from './Bestwakki.scss';
import classNames from 'classnames/bind';
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
    this.beginAt = beginAt ? this.decodeDateStr(beginAt) : -1;
    this.endAt   = endAt   ? this.decodeDateStr(endAt)   : -1;
  }

  decodeDateStr = str => (func.isDateStr(str) ? new Date(str).getTime() : str * 1000);

  fetchArticlesInfo = async ({ reset }) => {
    this.setState({
      loaded: false,
    });
    const { search } = this.props.location || {};
    const params = func.getURLParams(search);
    params.page = reset ? 1 : this.state.page + 1;

    try {
      const res = await service.getPopularArticles(params);

      if (res.status != 200) { throw res; }

      const {
        popularArticleList, page, perPage
      } = res.result;
  
      const currList = this.state.list;
      const list = reset ? popularArticleList : currList.concat(popularArticleList);
      
      this.setState({
        list: list,
        loaded: true,
        page: params.page,
        loadedLength: popularArticleList.length
      });

    } catch(e) {
      //TODO: Bestwakki api 예외 처리
      console.error(e);
    };
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
    const tablet_s_width = 960;
    
    return (
      <div className={cx('Bestwakki', {'front': front})}>
        {!front && 
          <Fragment>
            <div className="moduleHeader">
              <Link to="/bestwakki"><h1>왁물원 인기글</h1></Link>
              <div className="controlWrapper">
                <SortList history={history} location={location} fetchArticlesInfo={this.fetchArticlesInfo} />
                <div className="right">
                  <MediaQuery minWidth={tablet_s_width}>
                    <DateRange name="queryDate" min={min} max={max} start={this.beginAt} end={this.endAt} />
                    <SearchBar history={history} location={location} />
                  </MediaQuery>
                </div>
              </div>
            </div>
            <BestwakkiBottomNavigator history={this.props.history} />
          </Fragment>
        }
        <ArticleList 
          front={front} 
          data={list} 
          loaded={loaded} loadedLength={loadedLength}
          pagination={front ? 'none' : 'more'}
          onMore={e => this.fetchArticlesInfo({reset: false})}
          responsiveMode={front ? 'mobile' : 'auto'} />
        {
          front &&
          <div className="more">
            <MoreVertRoundedIcon className="frontOnly" fontSize="small" />
          </div>
        }
      </div>
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