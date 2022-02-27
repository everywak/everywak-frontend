import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

import * as func from '../../common/funtions';

import styles from './SortList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

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

export default SortList;