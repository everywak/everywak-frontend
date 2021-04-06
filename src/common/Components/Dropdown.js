import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import styles from './Dropdown.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Dropdown extends Component {
  static defaultProps = {
    values: [],
    name: '',
    value: '',
  }
  state = {
    name: '',
    value: this.props.value,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    opened: false,
  }

  openList() {
    if(!this.state.opened) {
      this.posList();
      this.setState({
        opened: true
      });
    }
  }
  closeList() {
    if(this.state.opened) {
      this.setState({
        opened: false
      });
    }
  }

  setOption(e) {
    if(e.target.dataset.value) {
      this.setState({
        name: e.target.dataset.name,
        value: e.target.dataset.value,
      });
      this.closeList();
    }
  }

  posList() {
    var _this = document.querySelector('.Dropdown[data-name="' + this.props.name + '"]');
    var nameRect = _this.querySelector('.currName').getBoundingClientRect();
    var list = _this.querySelector('.dropdownArea');
    var listRect = list.getBoundingClientRect();
    var target = list.querySelector('.option[data-value="' + this.state.value + '"] > .name');
    var targetRect = (target ? target : list).getBoundingClientRect();
    
    var x1 = nameRect.left - (targetRect.left - listRect.left);
    var y1 = nameRect.top - (targetRect.top - listRect.top) + 19;
    var x2 = nameRect.left - (targetRect.left - listRect.left);
    var y2 = nameRect.top - (targetRect.top - listRect.top) + 3;
    
    this.setState({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
    });
  }

  onWindowScroll(e) {
    if (e.state.opened) {
      e.closeList();
    }
  }
  onWindowResize(e) {
    if (e.state.opened) {
      e.closeList();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.onWindowResize(this));
    window.addEventListener('scroll', () => this.onWindowScroll(this));
    const { value } = this.state;
    var item;
    if (value && (item = this.props.values.find(v => (v.value === value)))) {
      this.setState({
        name: item.name
      });
    } else {
      const defaultItem = this.props.values.find((v, i, o) => (i === 0));
      this.setState({
        name: defaultItem.name,
        value: defaultItem.value
      });
    }
  }

  render() {
    const { x1, y1, x2, y2, name, value, opened } = this.state;
    const { values } = this.props;
    
    const list = values.map(
      val => (
        <div key={val.id} className={cx("option", {'checked': (value === val.value)})} data-value={val.value} data-name={val.name} onClick={e => this.setOption(e)}>
          <div className="marker" />
          <span className="name">{val.name}</span>
        </div>
      )
    );
    const animDropdownList = (opened ? 
      keyframes`
      from {
        opacity: 0;
        left: ${x1}px;
        top: ${y1}px;
      }
      to {
        opacity: 1;
        left: ${x2}px;
        top: ${y2}px;
      }
      ` : 
      null);
    const DropdownArea = styled.div`
      animation: ${animDropdownList} .3s 0s 1 ease normal forwards;
    `

    return (
      <div className={cx('Dropdown', {'opened' : opened})} data-name={this.props.name} >
        <input type="hidden" name={this.props.name} value={value} />
        <div className="dispArea" onClick={e => this.openList()}>
          <span className="currName">{name}</span>
          <ExpandMoreRoundedIcon />
        </div>
        <div className="closeArea" onClick={e => this.closeList()}></div>
        <DropdownArea className="dropdownArea">
          {list}
        </DropdownArea>
      </div>
    );
  }
}

export default Dropdown;