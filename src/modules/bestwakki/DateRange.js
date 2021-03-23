import React, { Component } from 'react';
import DatePicker from '../../common/Components/DatePicker';
import styles from './DateRange.scss';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class DateRange extends Component {
  static defaultProps = {
    name: '',
    min: 0,
    max: 0,
    start: -1,
    end: -1,
  };
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
    const { name, min, max, start, end } = this.props;
    const { opened, dateStr } = this.state;

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
          <DatePicker name={name} min={min} max={max} start={start} end={end} parent={this} opened={opened} />
        </div>
      </div>
    );
  }
}

export default DateRange;