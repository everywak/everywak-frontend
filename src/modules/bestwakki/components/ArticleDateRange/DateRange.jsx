import React, { PureComponent } from 'react';

import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';

import { Desktop, NotDesktop } from 'common/MediaQuery';
import DatePicker from 'common/Components/DatePicker';

import styles from './DateRange.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const RANGE_MAX = -1;

class DateRange extends PureComponent {
  static defaultProps = {
    name: '',
    min: 0,
    max: 0,
    start: RANGE_MAX,
    end: RANGE_MAX,
    onChange: val => {}
  };
  state = {
    opened: false
  };

  getRealRange = (val, type = 'start') => {
    const { min, max } = this.props;
    return val !== RANGE_MAX ? val : type === 'start' ? min : max;
  };
  getDatetimeString = () => {
    const { min, max, start, end } = this.props;
    return `${this.genDatetime(
      this.getRealRange(start, 'start')
    )} - ${this.genDatetime(this.getRealRange(end, 'end'))}`;
  };
  genDatetime(time) {
    const date = new Date(time);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  }
  genDatetimeInput(time) {
    const date = new Date(time);
    return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${(
      '0' + date.getDate()
    ).slice(-2)}`;
  }

  open = () => {
    this.setState({
      opened: true
    });
  };
  close = () => {
    this.setState({
      opened: false
    });
  };
  toggle = () => {
    this.setState({
      opened: !this.state.opened
    });
  };

  /**
   * DatePicker의 값이 바뀌었을 때 이벤트핸들러
   *
   * @param {{start: number, end: number}} e
   */
  onChange = e => {
    const { min, max } = this.props;
    const val = {
      start: e.start !== min ? e.start : -1,
      end: e.end !== max ? e.end : -1
    };
    this.props.onChange(val);
  };

  /**
   * 모바일 전용
   *
   * @param {object} e
   */
  onChangeStart = e => {
    const { min, max } = this.props;
    const val = new Date(e.target.value).getTime();
    const newState = {
      start: val !== min ? val : -1,
      end: this.state.end
    };
    this.props.onChange(newState);
  };
  /**
   * 모바일 전용
   *
   * @param {object} e
   */
  onChangeEnd = e => {
    const { min, max } = this.props;
    const val = new Date(e.target.value).getTime();
    const newState = {
      start: this.state.start,
      end: val !== max ? val : -1
    };
    this.props.onChange(newState);
  };

  render() {
    const { name, min, max, start, end } = this.props;
    const { opened } = this.state;

    return (
      <div className="DateRange">
        <Desktop>
          <div
            className={cx('dateBtn', { opened: opened })}
            onClick={this.toggle}
          >
            <div className="dateWrapper">{this.getDatetimeString()}</div>
            <DateRangeRoundedIcon fontSize="small" />
          </div>
          <div className="closeArea" onClick={this.close}></div>
          <div className="dateList">
            <DatePicker
              name={name}
              min={min}
              max={max}
              start={this.getRealRange(start, 'start')}
              end={this.getRealRange(end, 'end')}
              onChange={this.onChange}
              opened={opened}
            />
          </div>
        </Desktop>
        <NotDesktop>
          <div className="dateBtn">
            <input
              type="date"
              name={name + '-start'}
              id={name + '-start'}
              min={this.genDatetimeInput(min)}
              value={this.genDatetimeInput(this.getRealRange(start, 'start'))}
              onChange={this.onChangeStart}
            />
          </div>
          <span className="dateDivide">-</span>
          <div className="dateBtn">
            <input
              type="date"
              name={name + '-end'}
              id={name + '-end'}
              max={this.genDatetimeInput(max)}
              value={this.genDatetimeInput(
                this.getRealRange(end, 'end') + 24 * 60 * 60 - 1
              )}
              onChange={this.onChangeEnd}
            />
          </div>
        </NotDesktop>
      </div>
    );
  }
}

export default DateRange;
