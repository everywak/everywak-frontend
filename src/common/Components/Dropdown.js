import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './Dropdown.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Dropdown extends Component {
  static defaultProps = {
    values: [
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
    ],
    name: ''
  }
  state = {
    name: '제목',
    value: 'title',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    animDropdownList: null,
    opened: false,
  }

  openDropdown() {
    if(!this.state.opened) {
      this.posDropdownList();
      setTimeout(() => {
        this.setState({
          opened: true
        });
      }, 300);
    }
  }

  setOption(e) {
    if(e.target.dataset.value) {
      this.setState({
        name: e.target.dataset.name,
        value: e.target.dataset.value,
      });
      this.posDropdownList();
    }
  }

  posDropdownList() {
    var _this = document.querySelector('.Dropdown[data-name="' + this.props.name + '"]');
    var nameRect = _this.querySelector('.currName').getBoundingClientRect();
    var list = _this.querySelector('.dropdownArea');
    var listRect = list.getBoundingClientRect();
    var targetRect = list.querySelector('.option[data-value="' + this.state.value + '"] > .name').getBoundingClientRect();
    
    var x1= nameRect.left - (targetRect.left - listRect.left);
    var y1= nameRect.top - (targetRect.top - listRect.top) + 19;
    var x2= nameRect.left - (targetRect.left - listRect.left);
    var y2= nameRect.top - (targetRect.top - listRect.top) + 3;
    
    this.setState({
      x1: nameRect.left - (targetRect.left - listRect.left),
      y1: nameRect.top - (targetRect.top - listRect.top) + 19,
      x2: nameRect.left - (targetRect.left - listRect.left),
      y2: nameRect.top - (targetRect.top - listRect.top) + 3,
      animDropdownList: keyframes`
    from {
      opacity: 0;
      left: ${x1}px;
      top: ${y1}px;
    }
    to {
      opacity: 1;
      left: ${x2}px;
      top: ${y2}px;
    }`
    });
    console.log(`x: ${nameRect.left} y: ${nameRect.top}`);
  }

  componentDidMount () {
    //this.posDropdownList();
  }

  render() {
    const { name, value, opened } = this.state;
    const { values } = this.props;
    
    const list = values.map(
      val => (
        <div key={val.id} className={cx("option", {'checked': (value === val.value)})} data-value={val.value} data-name={val.name} onClick={e => this.setOption(e)}>
          <div className="marker" />
          <span className="name">{val.name}</span>
        </div>
      )
    );

    const animDropdownList = keyframes`
    from {
      opacity: 0;
      left: ${this.state.x1}px;
      top: ${this.state.y1}px;
    }
    to {
      opacity: 1;
      left: ${this.state.x2}px;
      top: ${this.state.y2}px;
    }
    `
    const DropdownArea = styled.div`
      animation: ${this.state.animDropdownList} .3s 0s 1 ease normal forwards;
    `

    return (
      <div className={cx('Dropdown', {'opened' : opened})} data-name={this.props.name} >
        <input type="hidden" name={this.props.name} value={value} />
        <div className="dispArea" onClick={e => this.openDropdown()}>
          <span className="currName">{name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
        </div>
        <DropdownArea className="dropdownArea">
          {list}
        </DropdownArea>
      </div>
    );
  }
}

export default Dropdown;