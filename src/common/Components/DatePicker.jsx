import React, { Component } from 'react';
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
    parent: null,
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
    scrollFocus: 0,
  }

  genMonths (start, end) {
    const { scrollFocus } = this.state;
    if (!(!start && !end) && start <= end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const startYear = startDate.getFullYear(),
            startMonth = startDate.getMonth(),
            endYear = endDate.getFullYear(),
            endMonth = endDate.getMonth();

      const offsetMonth = startYear * 12 + startMonth;
      const offsetEndMonth = endYear * 12 + endMonth;
      const list = Array.from(
        {length: offsetEndMonth - offsetMonth + 1}, 
        (v, i) => {
          const year = parseInt((offsetMonth + i) / 12);
          const month = (offsetMonth + i) % 12 + 1;
          return <DateView key={this.props.name + year + '-' + month} year={year} month={month} parent={this} visible={Math.abs(i - scrollFocus) < 2} />;
      });
      return list;
    }
  }

  genDatetime (time) {
    const date = new Date(time);
    return date.getFullYear() + '. ' + (date.getMonth() + 1) + '. ' + date.getDate() + '.';
  }

  setDateTimestamp = (type, timestamp) => {
    const { start, end } = this.state;
    const { parent } = this.props;
    type = type === 'start' || type === 'end' ? type : this.state.cursor;
    if (type === 'start') {
      this.setState({
        start: timestamp,
        end: Math.max(this.state.end, timestamp),
        cursor: 'end'
      });
      if (parent && parent.setDateStr) {
        parent.setDateStr(timestamp, end);
      } 
    } else if (type === 'end') {
      this.setState({
        end: timestamp,
        cursor: 'start'
      });
      if (parent && parent.setDateStr) {
        parent.setDateStr(start, timestamp);
      } 
    }
  }

  setDateTimestampAll = (start, end) => {
    this.setState({
      start: start,
      end: end,
      cursor: 'start'
    });
    const { parent } = this.props;
    if (parent && parent.setDateStr) {
      parent.setDateStr(start, end);
    } 
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

  onDateViewWrapperScroll = e => {
    const dateViewHeight = 30 * 6 + 15;
    const scrollTop = parseInt(e.target.scrollTop / dateViewHeight);
    
    if(this.state.scrollFocus !== scrollTop) {
      this.setState({
        scrollFocus: scrollTop
      });
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
  }

  componentDidMount () {
    const { min, max, start, end } = this.props;
    this.setPreset({
      preset: 'custom',
      targetStart: (start !== -1 ? start : min),
      targetEnd: (end !== -1 ? end : max),
    });
    if (this.props.opened) {
      this.dateList = this.genMonths(this.props.min, this.props.max);
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.opened && this.props.opened) {
      this.dateList = this.genMonths(this.props.min, this.props.max);
      this.setState();
    }
    if (prevState.start !== this.state.start ||
        prevState.end   !== this.state.end) {
      this.handlerStartEndChanged();
    }
  }

  render() {
    const { name, preset, opened } = this.props;
    const { start, end, cursor } = this.state;
    if(opened) {
      this.dateList = this.genMonths(this.props.min, this.props.max);
    }
    const presetList = preset.map(
      item => 
      (item.type === 'option' ? 
      <PresetItem key={name + item.value} value={item.value} name={item.name} selected={this.state.preset === item.value} onclick={this.setPreset} parent={this} /> : 
      <div className="presetLine"/>)
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
          <div className="days">
            <div className="day"><span>일</span></div>
            <div className="day"><span>월</span></div>
            <div className="day"><span>화</span></div>
            <div className="day"><span>수</span></div>
            <div className="day"><span>목</span></div>
            <div className="day"><span>금</span></div>
            <div className="day"><span>토</span></div>
          </div>
          <div className="dateViewWrapper" onScroll={this.onDateViewWrapperScroll}>
            {opened ? this.dateList : ''}
          </div>
        </div>
      </div>
    );
  }
}

class PresetItem extends Component {
  static defaultProps = {
    name: '',
    value: '',
    selected: false,
    parent: null,
    onclick: null,
  }

  render() {
    const { name, value, selected, parent, onclick } = this.props;

    return (
      <div className={cx('presetItem', {checked: selected})} id={parent.props.name + '_' + value} onClick={e => onclick({preset: value})}>
        <div className="marker" />
        <span className="name">{name}</span>
      </div>
    );
  }
}

class DateView extends Component {
  static defaultProps = {
    name: '',
    year: 2021,
    month: 4,
    parent: null,
    visible: true,
  }
  state = {
  }

  genDates (year, month) {
    const { parent } = this.props;
    const { min, max, name } = parent.props;
    const { start, end } = parent.state;
    const startDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const offset = (startDay > 2) * 3;
    const list = Array.from(
      {length: startDay + lastDate - offset}, 
      (v, i) => {
        const date = new Date(year, month - 1, 1 - startDay + i + offset);
        const datetime = date.getTime();
        return <DateItem 
          key={name + datetime}
          date={date.getDate()} 
          datetime={datetime} 
          currMonth={date.getMonth() === month - 1} 
          enabled={min <= datetime && max >= datetime} 
          checkType={start <= datetime && end >= datetime ? (datetime === start) * 1 + (datetime === end) * 2 : -1}
          parent={parent} 
          />
    });

    return list;
  }

  render() {
    const { year, month, visible } = this.props;
    const list = visible ? this.genDates(year, month) : '';

    return (
      <div className='DateView'>
        <div className={cx('listWrapper', {'inlineHeader': new Date(year, month - 1, 1).getDay() > 2})}>
          {visible ? <div className="header">{year}년 {month}월</div> : ''}
          {list}
        </div>
      </div>
    );
  }
}

class DateItem extends Component {
  static defaultProps = {
    date: 1,
    datetime: 0,
    enabled: true,
    parent: null,
    checkType: -1,
  }
  state = {
  }

  checkThis () {
    const { parent, datetime } = this.props;
    const { setDateTimestamp } = parent;
    setDateTimestamp('cursor', datetime);
  }

  render() {
    const { date, currMonth, enabled, checkType } = this.props;

    return (
      <div className={cx('DateItem', {'dummy': !currMonth}, {'disabled': !enabled}, {'checked': checkType > -1}, {'start': checkType === 1}, {'end': checkType === 2}, {'this': checkType === 3})} onClick={e => enabled ? this.checkThis() : null}>
        <span>{date ? date : ''}</span>
      </div>
    );
  }
}

export default DatePicker;