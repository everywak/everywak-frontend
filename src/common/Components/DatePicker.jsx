import React, { Component } from 'react';

import TransparentButton from './Button/TransparentButton';

import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';

import styles from './DatePicker.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class DatePicker extends Component {
  static defaultProps = {
    name: '',
    min: 0,
    max: 0,
    start: 0,
    end: 0,
    onChange: val => {},
    preset: [
      {
        type: 'option',
        name: '커스텀',
        value: 'none',
      },
      {
        type: 'line',
        name: '',
        value: '',
      },
      {
        type: 'option',
        name: '오늘',
        value: 'today',
      },
      {
        type: 'option',
        name: '이번 주',
        value: 'thisweek',
      },
      {
        type: 'option',
        name: '이번 달',
        value: 'thismonth',
      },
      {
        type: 'option',
        name: '올해',
        value: 'thisyear',
      },
      {
        type: 'line',
        name: '',
        value: '',
      },
      {
        type: 'option',
        name: '최근 7일',
        value: '7days',
      },
      {
        type: 'option',
        name: '최근 30일',
        value: '30days',
      },
      {
        type: 'line',
        name: '',
        value: '',
      },
      {
        type: 'option',
        name: '전체',
        value: 'all',
      },
    ],
    opened: false,
  }
  state = {
    cursor: 'start',
    start: 0,
    end: 0,
    preset: 'all',
    currYear: new Date().getFullYear(),
    currMonth: new Date().getMonth(),
  }

  showYearMonth = (year, month) => {
    const {
      currYear, currMonth
    } = this.state;

    const targetMonth = new Date(year, month, 1);
    const actualYear = targetMonth.getFullYear();
    const actualMonth = targetMonth.getMonth();

    if (actualYear !== currYear || actualMonth !== currMonth) {
      this.setState({
        currYear: actualYear,
        currMonth: actualMonth,
      });
    }
  }

  showNextMonth = () => {
    this.showYearMonth(this.state.currYear, this.state.currMonth + 1);
  }

  showPrevMonth = () => {
    this.showYearMonth(this.state.currYear, this.state.currMonth - 1);
  }

  genDatetime (timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
  }

  setDateTimestamp = (type, timestamp) => {
    const { start, end } = this.state;
    type = type === 'start' || type === 'end' ? type : this.state.cursor;
    if (type === 'start') {
      this.setState({
        start: timestamp,
        end: Math.max(this.state.end, timestamp),
        cursor: 'end'
      });
    } else if (type === 'end') {
      this.setState({
        end: timestamp,
        cursor: 'start'
      });
    }
  }

  setDateTimestampAll = (start, end) => {
    this.setState({
      start: start,
      end: end,
      cursor: 'start'
    });
  }

  setPreset = (data) => {
    const { min, max } = this.props;
    const { preset, targetStart, targetEnd } = data;
    const day = 24*60*60*1000;
    var start = min, end = max;
    if (preset === 'today') {
      start = max;
    } else if (preset === '7days') {
      start = max - 6 * day;
    } else if (preset === '30days') {
      start = max - 29 * day;
    } else if (preset === 'thisweek') {
      start = max - ((new Date(max).getDay() + 6) % 7) * day;
    } else if (preset === 'thismonth') {
      start = max - (new Date(max).getDate() - 1) * day;
    } else if (preset === 'thisyear') {
      start = new Date(new Date(max).getFullYear(), 0, 1).getTime();
    }
    if (preset !== 'custom' && preset !== 'none') {
      this.setDateTimestampAll(start, end);
    } else if (preset === 'custom') {
      this.setDateTimestampAll(targetStart, targetEnd);
    }
  }

  handlerStartEndChanged = () => {
    const day = 24*60*60*1000;
    const { min, max } = this.props;
    const { start, end } = this.state;
    const startDate = new Date(start);
    const endDate = new Date(end);
    var preset = 'none';
    if (end === max) {
      if (start === min) {
        preset = 'all';
      } else if (start === end) {
        preset = 'today';
      } else if (end - start === 6 * day) {
        preset = '7days';
      } else if (end - start === 29 * day) {
        preset = '30days';
      } else if (end - start === ((endDate.getDay() + 6) % 7) * day) {
        preset = 'thisweek';
      } else if (end - start === (endDate.getDate() - 1) * day) {
        preset = 'thismonth';
      } else if (startDate.getFullYear() === endDate.getFullYear() && 
                startDate.getMonth() === 0 && 
                startDate.getDate() === 1) {
        preset = 'thisyear';
      }
    }
    if (preset !== this.state.preset) {
      this.setState({
        preset: preset
      });
    }
    
    this.props.onChange({ start, end });
  }

  onClickDate = timestamp => this.setDateTimestamp('cursor', timestamp)

  componentDidMount () {
    const { min, max, start, end } = this.props;
    this.setPreset({
      preset: 'custom',
      targetStart: (start !== -1 ? start : min),
      targetEnd: (end !== -1 ? end : max),
    });
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.start !== this.state.start ||
        prevState.end   !== this.state.end) {
      this.handlerStartEndChanged();
    }
  }

  render() {
    const { name, preset, opened, min, max } = this.props;
    const { start, end, cursor, currYear, currMonth } = this.state;
    const presetList = preset.map(
      (item, i) => 
      (item.type === 'option' ? 
      <PresetItem key={name + item.value} value={item.value} name={item.name} selected={this.state.preset === item.value} onclick={this.setPreset} /> : 
      <div key={name + 'line' + i} className="presetLine"/>)
    );
    
    return (
      <div className={cx('DatePicker', {opened: opened})} data-name={this.props.name} >
        <div className="preset">
          {presetList}
        </div>
        <div className="range">
          <div className="dateRange">
            <div className="startDate" onClick={e => (this.setState({cursor: 'start'}))} >
              <div className={cx('datetime', {'selected': cursor === 'start'})} >{this.genDatetime(start)}</div>
              <input type="hidden" name={name + "-start"} id={name + "-start"} value={parseInt(start / 1000)} />
            </div>부터
            <div className="endDate" onClick={e => (this.setState({cursor: 'end'}))} >
              <div className={cx('datetime', {'selected': cursor === 'end'})} >{this.genDatetime(end)}</div>
              <input type="hidden" name={name + "-end"} id={name + "-end"} value={parseInt(end / 1000) + 24*60*60 - 1} />
            </div>까지
          </div>
          <div className="monthController">
            <div className="currentYearMonth">
              <span className="currYear">{currYear}</span>년&nbsp;
              <span className="currMonth">{currMonth + 1}</span>월
            </div>
            <div className="changeBtnArea">
              <TransparentButton onClick={this.showPrevMonth}><NavigateBeforeRoundedIcon fontSize="small" /></TransparentButton>
              <TransparentButton onClick={this.showNextMonth}><NavigateNextRoundedIcon fontSize="small" /></TransparentButton>
            </div>
          </div>
          <div className="days">
            <div className="day">일</div>
            <div className="day">월</div>
            <div className="day">화</div>
            <div className="day">수</div>
            <div className="day">목</div>
            <div className="day">금</div>
            <div className="day">토</div>
          </div>
          <div className="dateViewWrapper">
            <DateView 
              year={currYear} 
              month={currMonth} 
              min={min} max={max} start={start} end={end} 
              onClickDate={this.onClickDate} />
          </div>
        </div>
      </div>
    );
  }
}

/**
 * 프리셋 아이템
 * 
 * @param {{ name: string, value: string, selected: boolean, onclick: function }} props 
 */
function PresetItem({ name, value, selected = false, onclick }) {

  return (
    <div className={cx('presetItem', {checked: selected})} onClick={e => onclick({preset: value})}>
      <div className="marker" />
      <span className="name">{name}</span>
    </div>
  );
}

/**
 * 월을 표시합니다.
 * 
 * @param {{
 * year: number, 
 * month: number, 
 * min: number, 
 * max: number, 
 * start: number, 
 * end: number, 
 * onClickDate: function }} props 
 */
function DateView({ year, month, min, max, start, end, onClickDate }) {

  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const list = Array.from(
    {length: firstDay + lastDate + 6 - lastDay}, 
    (v, i) => {
      const date = new Date(year, month, 1 - firstDay + i);
      const datetime = date.getTime();
      return <DateItem 
        key={'dateitem' + datetime}
        dateString={date.getDate()} 
        datetime={datetime} 
        currMonth={date.getMonth() === month} 
        enabled={min <= datetime && max >= datetime} 
        checkType={start <= datetime && end >= datetime ? (datetime === start) * 1 + (datetime === end) * 2 : -1}
        onClick={onClickDate} 
        />
  });

  return (
    <div className='DateView'>
      <div className={cx('listWrapper')}>
        {list}
      </div>
    </div>
  );
}

/**
 * 날짜를 표시합니다.
 * 
 * @param {{dateString: string, datetime: number, currMonth: boolean, enabled: boolean, checkType: number, onClick: function}} props 
 */
function DateItem({dateString, datetime, currMonth, enabled = true, checkType = -1, onClick}) {

  const checkTypeClassName = {
    checked: checkType > -1, 
    start: checkType === 1, 
    end: checkType === 2, 
    this: checkType === 3
  };

  return (
    <div className={cx('DateItem', {dummy: !currMonth, disabled: !enabled}, checkTypeClassName)} onClick={e => enabled && onClick(datetime)}>
      <span>{dateString}</span>
    </div>
  );
}

export default DatePicker;