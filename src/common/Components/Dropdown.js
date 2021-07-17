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
    tx: 0,
    ty: 0,
    opened: false,
  }

  btnSelect = React.createRef();
  dropdownArea = React.createRef();
  selectedItem = React.createRef();

  openList = () => {
    if(!this.state.opened) {
      this.posList();
      this.setState({
        opened: true
      });
    }
  }
  closeList = () => {
    if(this.state.opened) {
      this.setState({
        opened: false
      });
    }
  }

  setOption = val => {
    if(val.value) {
      this.setState({
        name: val.name,
        value: val.value,
      });
      this.closeList();
    }
  }

  posList() {
    const nameRect = this.btnSelect.current.getBoundingClientRect();
    const list = this.dropdownArea.current;
    const listRect = list.getBoundingClientRect();
    const target = this.selectedItem.current;
    const targetRect = (target ? target : list).getBoundingClientRect();
    
    const tx = nameRect.left - (targetRect.left - listRect.left);
    const ty = nameRect.top - (targetRect.top - listRect.top) + 3;
    
    this.setState({
      tx: tx,
      ty: ty,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.closeList);
    window.addEventListener('scroll', this.closeList);
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.closeList);
    window.removeEventListener('scroll', this.closeList);
  }

  render() {
    const { tx, ty, name, value, opened } = this.state;
    const { values } = this.props;
    
    const list = values.map(
      val => (
        <div 
          key={val.id} 
          className={cx("option", {'checked': (value === val.value)})} 
          data-value={val.value} 
          data-name={val.name} 
          onClick={e => this.setOption(val)}
        >
          <div className="marker" />
          <span className="name" ref={value === val.value && this.selectedItem}>
            {val.name}
          </span>
        </div>
      )
    );
    const tablet_s_width = 960;
    const DropdownArea = styled.div`
    @media (min-width: ${tablet_s_width + 'px'}) {
      left: ${tx}px;
      top: ${ty}px;
    }`;

    return (
      <div className={cx('Dropdown', {'opened' : opened})} data-name={this.props.name} ref={this.me} >
        <input type="hidden" name={this.props.name} value={value} />
        <div className="dispArea" onClick={this.openList}>
          <span className="currName" ref={this.btnSelect}>{name}</span>
          <ExpandMoreRoundedIcon />
        </div>
        <div className="closeArea" onClick={this.closeList}></div>
        <DropdownArea className="dropdownAreaWrapper" ref={this.dropdownArea}>
          <div className="dropdownArea">{list}</div>
        </DropdownArea>
      </div>
    );
  }
}

export default Dropdown;