import React, { Component } from 'react';
import DatePicker from '../../common/Components/DatePicker';
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded';
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

  setDateStr = (start, end) => {
    this.setState({
      dateStr: `${this.genDatetime(start)} - ${this.genDatetime(end)}`,
    });
  }

  genDatetime (time) {
    const date = new Date(time);
    return `${date.getFullYear()}. ${(date.getMonth() + 1)}. ${date.getDate()}.`;
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
          <DateRangeRoundedIcon fontSize="small" />
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